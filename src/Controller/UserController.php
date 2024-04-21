<?php

namespace App\Controller;

use App\Repository\OrderAddressRepository;
use App\Repository\OrderRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;



class UserController extends AbstractController
{

    // Fetch All Users
    #[Route('/api/users', name: 'api_users')]
    public function index(UserRepository $userRepository){
        $users = $userRepository->findAll();
        $usersData = [];
        
        $userOrders = [];
        foreach($users as $user){

            // detect what role has this user
            $roles = $user->getRoles();
            if(in_array('ADMIN', $roles) ){
                $role = 'Admin';
            }elseif( in_array('SUPER_ADMIN', $roles) ) {
                $role = 'Super Admin';
            }else {
                $role = 'User';
            }

            // Detect user order
            $orders = $user->getOrders();
            foreach($orders as $order){
                if ( !in_array($order->getOrderId(), $userOrders ) ){
                    array_push($userOrders, $order->getOrderId());
                }
            }
            
            
            array_push($usersData, [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'name' => $user->getFirstname() . ' ' . $user->getLastname(),
                'role' => $role,
                'orders' => $userOrders,
            ]);
        }


        $response = new Response();

        $response->headers->set('Content-Type', 'application/json');
        $response->headers->set('Access-Control-Allow-Origin', '*');


        $response->setContent(json_encode($usersData));

        return $response;

    }


    // Fetch One User
    // #[Route('/api/user/{id}', name: 'api_user_by_id')]
    // public function getOneUser($id, UserRepository $userRepository){
    //     $user = $userRepository->findOneBy(['id' => $id ]);

    //     // detect what role has this user
    //     $roles = $user->getRoles();
    //     if(in_array('ADMIN', $roles) ){
    //         $role = 'ADMIN';
    //     }elseif( in_array('SUPER_ADMIN', $roles) ) {
    //         $role = 'SUPER_ADMIN';
    //     }else {
    //         $role = 'User';
    //     }

    //     $userData = [
    //         'id' => $user->getId(),
    //         'role' => $role
    //     ];

    //     $response = new Response();
    //     $response->headers->set('Content-Type', 'application/json');
    //     $response->headers->set('Access-Control-Allow-Origin', '*');

    //     $response->setContent(json_encode($userData));

    //     return $response;

    //     // return $this->json(json_encode($userData), 200);
    // }


    // Update User
    #[Route('/api/user/{id}/update', name: 'api_user_update')]
    public function update($id, Request $request, UserRepository $userRepository, EntityManagerInterface $em){
        $user = $userRepository->findOneBy(['id' => $id]);
        $data = $request->getContent();
        $data = json_decode($data, true);
        $role = $data['role'];
        
        // update
        $user->setRoles([$role]);
        $em->persist($user);
        $em->flush();
       



        return $this->json('User Role has been updated.', 200);

    }


    // Delete User
    #[Route('/api/user/{id}/delete', name: 'api_user_delete')]
    public function delete($id, UserRepository $userRepository, OrderRepository $orderRepository, OrderAddressRepository $orderAddressRepository, EntityManagerInterface $em){
        $user = $userRepository->findOneBy(['id' => $id]);

        $orders = $orderRepository->findBy(['user_id' => $id]);
        foreach($orders as $order){
            $orderAddressRepository->removeOrderAddress($order->getId());
            $orderRepository->removeOrders($order->getOrderId());
        }

        // delete
        $em->remove($user);
        $em->flush();
       



        return $this->json('User has been deleted.', 200);

    }




    // Update User Info
    #[Route('/api/user/{id}/user-info', name: 'api_update_userinfo')]
    public function updateUserInfo($id, Request $request, UserRepository $userRepository, EntityManagerInterface $em){
        $user = $userRepository->findOneBy(['id' => $id]);

        $data = $request->getContent();
        $data = json_decode($data, true);
        
        $fName    = $data['data']['fName'];
        $lName    = $data['data']['lName'];
        $city     = $data['data']['city'];
        $zip      = $data['data']['zip'];
        $address  = $data['data']['address'];
        $phone    = $data['data']['phone'];


        if ( isset($fName) && isset($lName) && isset($city) && isset($zip) && isset($address) && isset($phone) ) {

            // update
            $fName && $user->setFirstname($fName);
            $lName && $user->setLastname($lName);
            $city && $user->setCity($city);
            $zip && $user->setZip($zip);
            $address && $user->setAddress($address);
            $phone && $user->setPhone($phone);

            $em->persist($user);
            $em->flush();
        }

        return $this->json('Your info has been updated.', 200);
    }

    // Update User Email
    #[Route('/api/user/{id}/user-email', name: 'api_update_useremail')]
    public function updateUserEmail($id, Request $request, UserRepository $userRepository, EntityManagerInterface $em, UserPasswordHasherInterface $passwordHasher){
        $user = $userRepository->findOneBy(['id' => $id]);

        $data = $request->getContent();
        $data = json_decode($data, true);
        
        $email    = $data['newEmail'];
        $password = $data['password'];

        // Check Password match
        if(!$passwordHasher->isPasswordValid($user, $password)){
            return $this->json('Incorrect password!');
        }

        // set the new email
        $user->setEmail($email);
        $em->persist($user);
        $em->flush();

        return $this->json('Your email has been updated!', 200);


    }

    // Update User Password
    #[Route('/api/user/{id}/user-pass', name: 'api_update_userpass')]
    public function updateUserPass($id, Request $request, UserRepository $userRepository, EntityManagerInterface $em, UserPasswordHasherInterface $passwordHasher){
        $user = $userRepository->findOneBy(['id' => $id]);

        $data = $request->getContent();
        $data = json_decode($data, true);
        
        $currentPassword    = $data['currentPassword'];
        $repeatNewPassword  = $data['repeatNewPassword'];
        $newPassword        = $data['newPassword'];

        // Check Password match
        if(!$passwordHasher->isPasswordValid($user, $currentPassword)) return $this->json('Incorrect password!');
        
        // check if new password and repeated password are match
        if ($newPassword !== $repeatNewPassword) return $this->json('New password did not match!');

        if( strlen($newPassword) < 8 ) return $this->json('Password should be more than or equal to 8 characters!');
        // hash new password
        $hashedPassword = $passwordHasher->hashPassword(
            $user,
            $newPassword
        );


        // set the new email
        $user->setPassword($hashedPassword);
        $em->persist($user);
        $em->flush();

        return $this->json('Your password has been updated!', 200);

    }

    // Fetch User For Persistance
    #[Route('/api/connected-user', name: 'api_connected_user')]
    public function getConnectedUser( UserRepository $userRepository ): Response
    {
        $userId = $_POST['userId'];
        $sessionId = $_POST['sessionId'];
        if(!$userId || !$sessionId) return $this->json([], 200);

        $user = $userRepository->findOneBy([
            'id' => $userId,
            'sessionId' => $sessionId
        ]);
        if(!$user) return $this->json([], 200);

        return $this->json([
            'user_id' => $user->getId(),
            'user'  => $user->getUserIdentifier(),
            'fname'  => $user->getFirstname(),
            'lname'  => $user->getLastname(),
            'roles'  => $user->getRoles(),
            'city'  => $user->getCity(),
            'address'  => $user->getAddress(),
            'phone'  => $user->getPhone(),
            'zip'  => $user->getZip(),
            'sessionId' => $sessionId
        ], 200);
    }


}
