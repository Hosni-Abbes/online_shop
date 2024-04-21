<?php

namespace App\Repository;

use App\Entity\Product;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Product>
 *
 * @method Product|null find($id, $lockMode = null, $lockVersion = null)
 * @method Product|null findOneBy(array $criteria, array $orderBy = null)
 * @method Product[]    findAll()
 * @method Product[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ProductRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Product::class);
    }

    public function save(Product $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Product $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }




    // Filter Products
    public function findByFilter($search=null, $category=null, $minPrice=0, $maxPrice=null): array {

        
        $queryBuilder = $this->createQueryBuilder('p')
            ->where('p.name LIKE :search')
            ->andWhere($category ? 'p.category = :cat' : 'p.category IS NOT NULL' )
            ->andWhere($maxPrice ? 'p.price BETWEEN :min AND :max' : 'p.price > :min')
            ->setParameter('search', '%'.$search.'%')

            ->setParameter('min', $minPrice)
            ->orderBy('p.id', 'ASC')
            ->getQuery();


        $category ? $queryBuilder->setParameter('cat', $category) : null;
        $maxPrice ? $queryBuilder->setParameter('max', $maxPrice) : null;

        return $queryBuilder->getResult();
   }

//    /**
//     * @return Product[] Returns an array of Product objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('p')
//            ->andWhere('p.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('p.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?Product
//    {
//        return $this->createQueryBuilder('p')
//            ->andWhere('p.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
