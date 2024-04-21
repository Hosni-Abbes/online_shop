<?php

namespace App\Services;

use App\Repository\ImageRepository;

class DeleteImages {

    private $imageRepository;

    public function __construct(ImageRepository $imageRepository)
    {
        $this->imageRepository = $imageRepository;
    }

    public function tryDelete($product_id) 
    {
        $root = $_SERVER['DOCUMENT_ROOT'];

        $imgToDelete = $this->imageRepository->findBy(['product' => $product_id]);

        foreach($imgToDelete as $deleteimg){
            if(  is_file($root . $deleteimg->getSrc() ) ){
                unlink( $root . $deleteimg->getSrc() );
                $this->imageRepository->remove($deleteimg, true);
            }
        }
    }

}