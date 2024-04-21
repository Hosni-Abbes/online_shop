<?php

namespace App\Controller;

use App\Entity\Category;
use App\Entity\Image;
use App\Entity\Product;
use App\Form\ProductType;
use App\Repository\CategoryRepository;
use App\Repository\ImageRepository;
use App\Repository\ProductRepository;
use App\Services\DeleteImages;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Psr\Container\ContainerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ProductController extends AbstractController
{

    // Home page
    #[Route("/", name:"index")]
    public function index(): Response
    {
        return $this->render('index.html.twig');
    }
    // Cart page
    #[Route("/cart", name:"cart")]
    public function cart(): Response
    {
        return $this->render('index.html.twig');
    }
    // Administration page
    #[Route("/admin", name:"admin")]
    public function admin(): Response
    {
        return $this->render('index.html.twig');
    }
    // Not found
    #[Route("/{any}", name:"any")]
    public function notfound($any): Response
    {
        return $this->render('index.html.twig');
    }






    // CRUD 

    // Fetch all Products data
    #[Route("/api/products", name:"api_products")]
    public function home(ProductRepository $productRepository, CategoryRepository $catRepository, ImageRepository $imageRepository ): Response
    {
        $products = $productRepository->findBy([], ['id' => 'ASC']);
        $productsData=[];
        
        foreach($products as $product){
            $productImages = $imageRepository->findImageSrcById($product->getId());
            $cat = $catRepository->find($product->getCategory()->getId());

            array_push($productsData, [
                'id' => $product->getId(),
                'title' => $product->getName(),
                'desc' => $product->getDescription(),
                'price' => $product->getPrice(),
                'image' => $productImages,
                'category' => $cat->getName(),
                'quantity' => $product->getQuantity()
            ]);
        }        

        $response = new Response();
        $response->headers->set('Content-Type', 'application/json');
        $response->headers->set('Access-Control-Allow-Origin', '*');

        $response->setContent(json_encode($productsData));

        return $response;
    }


    // Filter Products
    // sword={search}&category={category}&min_price={minPrice}&max_price={maxPrice}
    #[Route("/api/products/filter", name:"api_products_filter")]
    public function filter(Request $request, ProductRepository $productRepository, CategoryRepository $catRepository, ImageRepository $imageRepository ): Response
    {
        $data = $request->getContent();
        $data = json_decode($data, true);

        $searchWord = $request->query->get('sword');
        $categoryName = $request->query->get('category');
        $minPrice = $request->query->get('min_price');
        $maxPrice = $request->query->get('max_price');

        $category = $categoryName ? $catRepository->findOneBy(['name' => $categoryName])->getId() : null;

        $products = $productRepository->findByFilter($searchWord, $category, $minPrice, $maxPrice);
        
        $productsData=[];
        
        foreach($products as $product){
            $productImages = $imageRepository->findImageSrcById($product->getId());
            $cat = $catRepository->find($product->getCategory()->getId());

            array_push($productsData, [
                'id' => $product->getId(),
                'title' => $product->getName(),
                'desc' => $product->getDescription(),
                'price' => $product->getPrice(),
                'image' => $productImages,
                'category' => $cat->getName(),
                'quantity' => $product->getQuantity()
            ]);
        }
        

        $response = new Response();

        $response->headers->set('Content-Type', 'application/json');
        $response->headers->set('Access-Control-Allow-Origin', '*');


        $response->setContent(json_encode($productsData));

        return $response;
    }


    // Create Product
    #[Route("/api/product/add", name:"api_product_add")]
    public function createProduct(Request $request, CategoryRepository $catRepository, EntityManagerInterface $em)// : Response
    {
        $product = new Product();
        $category = new Category();

        $name = $request->request->get('name');
        $slug = strtolower( str_replace(' ', '-', $name ) );
        $description = $request->request->get('description');
        $price = $request->request->get('price');
        $quantity = $request->request->get('quantity');
        $cat = $request->request->get('category');
        $images = $request->request->get('images');

        
        
        if( isset( $name) && isset( $description) && isset( $price) && isset( $quantity) && isset( $cat) && isset( $images) ) {
            if( !empty( $name) && !empty( $description) && !empty( $price) && !empty( $quantity) && !empty( $cat) && !empty( $images) ) {


                $product->setName($name);
                $product->setDescription($description);
                $product->setPrice($price);
                $product->setQuantity($quantity);
                $product->setSlug($slug);
                
                if ($categ = $catRepository->findBy(['name' => $cat]) ){
                    $product->setCategory($categ[0]);
                }else{
                    $category->setName($cat);
                    $product->setCategory($category);
                    $em->persist($category);
                }

                
                
                $em->persist($product);
                $em->flush();

                // if images
                if(isset($_FILES['imag'])){
                    $allImages = $_FILES['imag'] ;
                    $allowedImages = ['png', 'jpeg', 'jpg', 'gif', 'webp'];
                    foreach( explode(',', $images) as $key => $img){
                        $extArr = explode('.', $img);
                        $ext = strtolower(end($extArr));
                        if( !in_array( $ext, $allowedImages ) ) return $this->json('Product files should be of type Images!');
    
                        $imgName = md5(uniqid()) . '.' . $ext;
                        if( move_uploaded_file($allImages['tmp_name'][$key], $_SERVER['DOCUMENT_ROOT'].'/assets/images/'.$imgName) ){
                            $image = new Image();
                            $image->setSrc('/assets/images/'. $imgName );
                            $image->setProduct($product);
                            $em->persist($image);
                            $em->flush();
                        }
                    }
                }else{
                    return $this->json('Please add product image(s)!');
                }

                return $this->json('Product created successfully.');
            }else{
                return $this->json('All Fields are required!', 500);
            }
        }

    }



    // Edit Product
    #[Route("/api/product/edit/{id}", name:"api_product_edit")]
    public function editProduct($id, ProductRepository $productRepository, Request $request, CategoryRepository $catRepository, EntityManagerInterface $em, DeleteImages $deleteImages)//: Response
    {
        $product = $productRepository->findOneBy(['id' => $id]);

        $name = $request->request->get('name');
        // return $this->json($name);
        $slug = strtolower( str_replace(' ', '-', $name ) );
        $description = $request->request->get('description');
        $price = $request->request->get('price');
        $quantity = $request->request->get('quantity');
        $cat = $request->request->get('category');
        $images = $request->request->get('images');

        if( isset( $name) && isset( $description) && isset( $price) && isset( $quantity) && isset( $cat) && isset( $images) ) {
            if( !empty( $name) && !empty( $description) && !empty( $price) && !empty( $quantity) && !empty( $cat) && !empty( $images) ) {


                $product->setName($name);
                $product->setDescription($description);
                $product->setPrice($price);
                $product->setQuantity($quantity);
                $product->setSlug($slug);
                
                if ($categ = $catRepository->findBy(['name' => $cat]) ){
                    $product->setCategory($categ[0]);
                }else{
                    $category = new Category();
                    $category->setName($cat);
                    $product->setCategory($category);
                    $em->persist($category);
                }

                
                // $em->persist($product);
                $em->flush();

                
                // if images
                if(isset($_FILES['imag'])){
                    // Remove Old Images
                    $deleteImages->tryDelete($id);

                    $allImages = $_FILES['imag'] ;
                    
                    $allowedImages = ['png', 'jpeg', 'jpg', 'gif', 'webp'];
                    foreach( explode(',', $images) as $key => $img){
                        $extArr = explode('.', $img);
                        $ext = strtolower(end($extArr));
                        if( !in_array( $ext, $allowedImages ) ) return $this->json('Product files should be of type Images!');
    

                        $imgName = md5(uniqid()) . '.' . $ext;
                        if( move_uploaded_file($allImages['tmp_name'][$key], $_SERVER['DOCUMENT_ROOT'].'/assets/images/'.$imgName) ){

                            $image = new Image();
                            $image->setSrc('/assets/images/'. $imgName );
                            $image->setProduct($product);
                            $em->persist($image);
                            $em->flush();
                        }
                    }
                    

                }else{
                    return $this->json('Please add product image(s)!');
                }

                return $this->json('Product Updated successfully.');
                
            }else{
                return $this->json('All Fields are required!', 500);
            }
        }else{
            return $this->json('All Fields are required!');
        }

    }


    // Delete Product
    #[Route("/api/product/delete/{id}", name:"api_product_delete")]
    public function delete($id, ProductRepository $productRepository, ImageRepository $imageRepository, EntityManagerInterface $em): Response
    {
        try{
            $root = $_SERVER['DOCUMENT_ROOT'];
            $product = $productRepository->find($id);
            $productImages = $imageRepository->findBy(['product' => $id]);
            
            if ($productImages){
                foreach($productImages as $img){
                    if(is_file($root . $img->getSrc())){
                        unlink($root . $img->getSrc());
                    }
                }
            }

            $em->remove($product);
            $em->flush();
            return $this->json('Product deleted.');
        }catch(Exception $e){
            return $this->json($e->getMessage());
        }
        
    }



}
