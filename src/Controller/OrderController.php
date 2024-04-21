<?php

namespace App\Controller;

use App\Entity\Order;
use App\Entity\OrderAddress;
use App\Repository\OrderAddressRepository;
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
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;



class OrderController extends AbstractController
{

    // Create order to DB
    #[Route('/api/order', name: 'api_order')]
    public function index(Request $request, UserRepository $userRepository, OrderRepository $orderRepository, ProductRepository $productRepository, EntityManagerInterface $em){

        // Create new Order
        $orderAddress = new OrderAddress();

        $user_id = $request->request->get('user_id');
        $fname = $request->request->get('fname');
        $lname = $request->request->get('lname');
        $city = $request->request->get('city');
        $address = $request->request->get('address');
        $zip = $request->request->get('zip');
        $phone = $request->request->get('phone');
        $email = $request->request->get('email');
        $pay_method = $request->request->get('pay_method');
        $is_guest = $request->request->get('is_guest');

        $products = $request->request->get('products');
        $total_price = $request->request->get('total_price');
        
        $order_id = time() . md5(uniqid());
        
        

        if(isset($user_id) && isset($fname) && isset($lname) && isset($city) && isset($address) && isset($zip) && isset($phone) && isset($email) && isset($pay_method) && isset($is_guest) && isset($products) && isset($total_price) ) {
            if(!empty($fname) && !empty($lname) && !empty($city) && !empty($address) && !empty($zip) && !empty($phone) && !empty($email) && !empty($pay_method) && !empty($is_guest) && !empty($products) && !empty($total_price) ) {
                

                     // Order products
                    $products = json_decode($products);
                    // $em->getConnection()->getConfiguration()->setMiddlewares([new \Doctrine\DBAL\Logging\Middleware(new \Psr\Log\NullLogger())]);

                    foreach($products as $product) {
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
                        $order->setIsPaid(0);
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
                    // $em->clear();

                    return $this->json('Thank you for ordering from our shop. Your order is being processed.', 200);
                // }
            }
        }

    }


    // Select all Orders
    #[Route('/api/orders', name: 'api_orders')]
    public function orders(OrderAddressRepository $orderAddressRepository, OrderRepository $orderRepository, ProductRepository $productRepository, EntityManagerInterface $em){
        
        $orders = [];
        $order =  $orderRepository->findAll();
        for ($i=0;$i<count($order); $i++ ) {
            $addresses = $orderAddressRepository->findOneBy(['order_id' => $order[$i]->getId()]);
            $j=1;
            while(!$addresses){
                $addresses = $orderAddressRepository->findOneBy(['order_id' => $order[$i-$j]->getId()]);
                $j++;
            }
            if($order[$i]->getUserId() != null) {
                $full_name = $order[$i]->getUserId()->getFirstname() . ' ' . $order[$i]->getUserId()->getLastname();
                $email = $order[$i]->getUserId()->getEmail();
                $is_guest = false;
            } else {
                $full_name = $addresses->getFirstname() . ' ' . $addresses->getLastname();
                $email = $addresses->getEmail();
                $is_guest = true;
            }

            array_push( $orders, [
                "id" => $order[$i]->getId(),
                "order_id" => $order[$i]->getOrderId(),
                "user" => $full_name,
                "user_email" => $email,
                "is_guest" => $is_guest,
                "product" => $order[$i]->getProductId()->getName(),
                "product_qntity" => $order[$i]->getProductQuntity(),
                "product_price" => $order[$i]->getProductPrice(),
                "total_price" => $order[$i]->getTotalPrice(),
                "pay_method" => $order[$i]->getPaymentMethod(),
                "status" => $order[$i]->getStatus(),
                "is_paid" => $order[$i]->getIsPaid(),
                "create_date" => $order[$i]->getCreatedAt()->format('Y-m-d'),
                // address
                'city' => $addresses->getCity(),
                'address' => $addresses->getAddress(),
                'zip' => $addresses->getZip(),
                'phone' => $addresses->getPhone(),
            ] );
        }
        
        return $this->json($orders);

 
    }


    // Finish Order
    #[Route('/api/order/finish/{id}', name: 'api_order_finish')]
    public function finishOrder($id, OrderRepository $orderRepository, EntityManagerInterface $em) {

        
        $orders = $orderRepository->findBy(['order_id' => $id]);
        foreach($orders as $order){
            $order->setStatus('Finished');
            $em->persist($order);
            $em->flush();
            
        }
        return $this->json('Order Finished!', 200);

    }




    // Delete Order
    #[Route('/api/order/delete/{id}', name: 'api_order_delete')]
    public function deleteOrder($id, OrderRepository $orderRepository, OrderAddressRepository $orderAddressRepository) {
        $orders = $orderRepository->findBy(['order_id' => $id]);
        // dd($orders);
        foreach($orders as $order){
            $orderAddressRepository->removeOrderAddress($order->getId());
            $orderRepository->removeOrders($order->getOrderId());
        }
        return $this->json('Order Deleted!');
    }


}
