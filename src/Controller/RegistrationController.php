<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use App\Security\UserAuthenticator;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Security\Http\Authentication\UserAuthenticatorInterface;

class RegistrationController extends AbstractController
{

    // Register page
    #[Route("/register", name:"register")]
    public function register(): Response
    {
        return $this->render('index.html.twig');
    }
    // Registration success
    #[Route("/success", name:"success_register")]
    public function successRegister(): Response
    {
        return $this->render('index.html.twig');
    }


    #[Route('/api/registration', name: 'api_registration')]
    public function index(Request $request, UserAuthenticatorInterface $userAuthenticatorInterface, UserAuthenticator $userAuthenticator, UserPasswordHasherInterface $passwordHasher, EntityManagerInterface $em, UserRepository $userRepository, MailerInterface $mailer)//: Response
    {
        $email    = $request->request->get('email');
        $password = $request->request->get('password');
        $repeatPassword = $request->request->get('repeatPassword');
        $fName    = $request->request->get('fName');
        $lName    = $request->request->get('lName');
        $city     = $request->request->get('city');
        $zip      = $request->request->get('zip');
        $address  = $request->request->get('address');
        $phone    = $request->request->get('phone');

        if ( isset($email) && isset($password) && isset($repeatPassword) && isset($fName) && isset($lName) && isset($city) && isset($zip) && isset($address) && isset($phone) ) {
            if ( !empty($email) && !empty($password) && !empty($repeatPassword) && !empty($fName) && !empty($lName) && !empty($city) && !empty($zip) && !empty($address) && !empty($phone) ){
                // check email exist or not
                $userExist = $userRepository->findBy(['email' => $email]);
                if($userExist) return $this->json('Email address already exist!', 400);
                
                // check password match 
                if($password === $repeatPassword){

                    if ( strlen($password < 8) ) return $this->json('Password should be more than or equal to 8 characters!');

                    // Create Verification ID
                    $bytes= random_bytes(16);
                    $verifID = md5(sha1(mt_rand())) . bin2hex($bytes) . time() . md5(uniqid());

                    // Create new user
                    $user = new User();
                    $user->setEmail($email);
                    $user->setFirstname($fName);
                    $user->setLastname($lName);
                    $user->setCity($city);
                    $user->setZip($zip);
                    $user->setAddress($address);
                    $user->setPhone($phone);
                    $user->setVerifid($verifID);
                    $user->setVerified(0);
                    $user->setPassword(
                        $passwordHasher->hashPassword(
                            $user,
                            $password
                        )
                    );
                    $existUsers = $userRepository->findAll();
                    if($existUsers){
                        $user->setRoles(["user"]);
                    }else{
                        $user->setRoles(["SUPER_ADMIN"]);
                    }
                    $em->persist($user);
                    $em->flush();



                    // Send verification Email to user
                    $activation_link = 'http://127.0.0.1:8000/account/activation?token='.$verifID.'';
                    $this->sendEmail($mailer, $email, $fName, $activation_link, $verifID);


                    // 
                    return $this->json('User created successfully.', 200);


                }else{
                    return $this->json('Password not match!', 400);
                }
            }else{
                return $this->json('All fields are required', 400);
            }
        }else{
            return $this->json('Something went wrong! Try again later.', 500);
        }
    }
    


    #[Route('/account/activation', name: 'activation_page')]
    public function activation(Request $request, UserRepository $userRepository, EntityManagerInterface $em) {

        // $token = 
        $token = $request->query->get('token');
        $user = $userRepository->findOneBy(['verifid' => $token]);

        if ($user) {
            $user->setVerifid('');
            $user->setVerified(1);
            $em->persist($user);
            $em->flush();
            return $this->render('index.html.twig');
        }else{
            return $this->redirect( $this->generateUrl('any', ['any' => 'not-found'], UrlGeneratorInterface::ABSOLUTE_URL) );
        }

        // return $this->redirect($this->generateUrl('activation_success', ['active' => 1], UrlGeneratorInterface::ABSOLUTE_URL));
    }


    
    
    
    // Send Email Function
    public function sendEmail($mailer, $user_mail, $user_name, $activation_link, $hash) {
        $email = ( new Email() )
        ->from('admin@shop.com')
        ->to($user_mail)
        ->subject('Account verification link')
        ->html( '<p>
                    Hello '.$user_name.', <br />
                    Please click on link below to activate your account.<br />
                </p>
                <a href="'.$activation_link.'">'.$hash.'</a>
                
            ');

        
        $mailer->send($email);
    }

}


