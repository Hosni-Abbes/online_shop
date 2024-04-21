<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use App\Security\UserAuthenticator;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;

use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Security\Core\User\UserInterface;

class SecurityController extends AbstractController
{
    #[Route(path: '/api/login', name: 'app_login')]
    /*public function login(AuthenticationUtils $authenticationUtils, UserAuthenticator $userAuthenticator, Request $request): Response
    {
        // if ($this->getUser()) {
        //     return $this->redirectToRoute('target_path');
        // }
        // get the login error if there is one
        $error = $authenticationUtils->getLastAuthenticationError();
        // last username entered by the user
        $lastUsername = $authenticationUtils->getLastUsername();

        $this->json(['last_username' => $lastUsername, 'error' => $error]);


        $this->json($userAuthenticator->authenticate($request));

        return $this->render('security/login.html.twig', ['last_username' => $lastUsername, 'error' => $error]);
    }*/
    public function login(#[CurrentUser] ?User $user, Security $security, Request $request, UserRepository $userRepository, UserPasswordHasherInterface $passwordHasher, EntityManagerInterface $em ): Response 
    {
        // $request->getSession()->set(Security::LAST_USERNAME, $email);
        
        $email = $request->request->get('email');
        $password = $request->request->get('password');

        if( isset($email) && isset($password) ){
            if( !empty($email) && !empty($password) ){
                $usern = $userRepository->findOneBy(['email' => $email]);
                if (!$usern) {
                    return $this->json('Invalid credentials!', Response::HTTP_UNAUTHORIZED);
                }else{
                    // Check password 
                    if(!$passwordHasher->isPasswordValid($usern, $password)) return $this->json('Invalid credentials!', Response::HTTP_UNAUTHORIZED);

                    // If user is not verfieed throw error
                    if ( $usern->getVerified() == 0 ) return $this->json('Your account is not active!', Response::HTTP_UNAUTHORIZED);
                    
                    // set user sessionId
                    $sessionId = time() . md5(uniqid());
                    $usern->setSessionId($sessionId);
                    $em->persist($usern);
                    $em->flush();

                    return $this->json([
                        'user_id' => $usern->getId(),
                        'user'  => $usern->getUserIdentifier(),
                        'fname'  => $usern->getFirstname(),
                        'lname'  => $usern->getLastname(),
                        'roles'  => $usern->getRoles(),
                        'city'  => $usern->getCity(),
                        'address'  => $usern->getAddress(),
                        'phone'  => $usern->getPhone(),
                        'zip'  => $usern->getZip(),
                        'sessionId' => $sessionId
                    ], 200);

                }

            }else{
                return $this->json('Fields can not be empty!', 400);
            }
        }else{
            return $this->json('Something went wrong!', 500);
        }
        

    }


    #[Route(path: '/api/logout', name: 'app_logout')]
    public function logout(UserRepository $userRepository, EntityManagerInterface $em): Response
    {
        $userId = $_POST['userId'];
        $sessionId = $_POST['sessionId'];

        if(!$userId || !$sessionId) return new Response("", Response::HTTP_UNAUTHORIZED);

        $user = $userRepository->findOneBy([
            'id' => $userId,
            'sessionId' => $sessionId
        ]);

        if(!$user) return new Response("", 204);

        $user->setSessionId('');
        $em->persist($user);
        $em->flush();
        
        return new Response("", 204);
    }




    // LOGIN page
    #[Route("/login", name:"login")]
    public function loginPage(): Response
    {
        return $this->render('index.html.twig');
    }

        
}
