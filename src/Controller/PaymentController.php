<?php

namespace App\Controller;

use App\Entity\Order;
use App\Entity\OrderAddress;
use App\Repository\OrderRepository;
use App\Repository\ProductRepository;
use App\Repository\UserRepository;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

use Stripe\Checkout\Session;
use Stripe\Stripe;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

#[Route('/payment', name: 'order_payment_')]
class PaymentController extends AbstractController
{

    #[Route('/checkout', name: 'checkout')]
    public function paymentCheckout($stripe_secret_key, Request $request, SessionInterface $SymfonySession) {

        $OrderItems = json_decode($request->request->get('products'));
        
        $allProducts = [];
        foreach($OrderItems as $product){
            array_push($allProducts, [
                'price_data' => [
                    'currency' => 'usd',
                    'product_data' => ['name' => $product->title],
                    'unit_amount' => $product->price,
                ],
                'quantity' => $product->itemQntity,
            ]);
        }


        Stripe::setApiKey($stripe_secret_key);
        $stripeSession = Session::create([
            'payment_method_types' => ['card'],
            'line_items' => $allProducts,
            'mode' => 'payment',
            'success_url' => $this->generateUrl('order_payment_success_url', [], UrlGeneratorInterface::ABSOLUTE_URL),
            'cancel_url' => $this->generateUrl('order_payment_cancel_url', [], UrlGeneratorInterface::ABSOLUTE_URL),
        ]);

        

        $data = [
            "order_products" => $OrderItems,
            "user_info" => json_decode($request->request->get('user_data')),
            "user_id" => $request->request->get('user_id'),
            "total_price" => $request->request->get('total_price'),
            "payment_id" => $stripeSession->payment_intent
        ];
        $SymfonySession->set('orderData', $data);


        return $this->redirect($stripeSession->url, 303);
        
    }


    #[Route('/success', name: 'success_url')]
    public function success(UserRepository $userRepository, OrderRepository $orderRepository, ProductRepository $productRepository, EntityManagerInterface $em, SessionInterface $SymfonySession, MailerInterface $mailer): Response
    {
                
        $data = $SymfonySession->get('orderData');
        
        
        if (!$data) return $this->redirect( $this->generateUrl('index', [], UrlGeneratorInterface::ABSOLUTE_URL) );

        // Payment Stripe ID


        $orderProducts = $data['order_products'];
        $fname = $data['user_info']->fname;
        $lname = $data['user_info']->lname;
        $city = $data['user_info']->city;
        $address = $data['user_info']->address;
        $zip = $data['user_info']->zip;
        $phone = $data['user_info']->phone;
        $email = $data['user_info']->email;
        $pay_method = $data['user_info']->pay_method;
        $is_guest = $data['user_info']->is_guest;

        $user_id = $data['user_id'];
        $total_price = $data['total_price'];

        $orderAddress = new OrderAddress();

        $order_id = time() . md5(uniqid());

        foreach($orderProducts as $product) {
            $order = new Order();

            $user_id != 0 ? $user = $userRepository->findOneBy(['id' => (int)$user_id]) : $user = null;
            $order->setUserId($user);
    
            // Product
            $ordered_product = $productRepository->findOneBy(['id' => (int)$product->id]);
            $order->setOrderId($order_id);
            $order->setProductId($ordered_product);
            $order->setProductQuntity($product->itemQntity);
            $order->setProductPrice($product->price);
            $order->setTotalPrice($total_price);
            $order->setPaymentMethod($pay_method);
            $order->setIsPaid(1);
            $order->setStatus('Processing');
            $order->setCreatedAt(new DateTimeImmutable());

            $em->persist($order);
            $em->flush();
            $em->clear();
        }
        // Oredr address
        $orderr = $orderRepository->findOneBy(['order_id' => $order_id]);
        $orderAddress->setOrderId($orderr);
        $orderAddress->setFirstname($fname);
        $orderAddress->setLastname($lname);
        $orderAddress->setCity($city);
        $orderAddress->setAddress($address);
        $orderAddress->setZip($zip);
        $orderAddress->setPhone($phone);
        $orderAddress->setEmail($email);

        // $em->persist($order);
        $em->persist($orderAddress);
        $em->flush();


        // Send email to user contains order details
        $this->sendEmail($mailer, $email, $fname, $orderProducts);
        
        // dd('test');

        // remove order data from session after success payment
        $SymfonySession->remove('data');
        
        return $this->render('index.html.twig');
    }

    #[Route('/cancel', name: 'cancel_url')]
    public function cancel(SessionInterface $SymfonySession): Response
    {
        $SymfonySession->remove('data');
        return $this->redirect( $this->generateUrl('index', [], UrlGeneratorInterface::ABSOLUTE_URL) );
    }




    // Send Email Function
    public function sendEmail($mailer, $emailTo, $userName, $orderItems) {
        $email = ( new Email() )
        ->from('hosny.abbes@gmail.com')
        ->to($emailTo)
        ->subject('Order details')
        ->html('<p>Hello '.$userName.'! This is test email. </p>');
        
        // attach a file stream
        //  ->text(fopen('/path/to/emails/user_signup.txt', 'r'))
        //  ->html(fopen('/path/to/emails/user_signup.html', 'r'))
        
        $mailer->send($email);
    }

}
