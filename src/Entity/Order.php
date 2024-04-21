<?php

namespace App\Entity;

use App\Repository\OrderRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: OrderRepository::class)]
#[ORM\Table(name: '`order`')]
class Order
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 100)]
    private ?string $order_id = null;

    #[ORM\ManyToOne(inversedBy: 'orders', cascade: ['persist', 'remove'])]
    private ?User $user_id = null;

    #[ORM\ManyToOne(inversedBy: 'orders', cascade: ['persist', 'remove'])]
    private ?Product $product_id = null;

    #[ORM\Column]
    private ?int $product_quntity = null;

    #[ORM\Column]
    private ?int $product_price = null;

    #[ORM\Column]
    private ?int $total_price = null;

    #[ORM\Column(length: 100)]
    private ?string $payment_method = null;

    #[ORM\Column]
    private ?int $is_paid = null;

    #[ORM\Column(length: 100)]
    private ?string $status = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $created_at = null;

    #[ORM\OneToOne(mappedBy: 'order_id', cascade: ['persist', 'remove'])]
    private ?OrderAddress $orderAddress = null;

    public function __construct()
    {
        
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getOrderId(): ?string
    {
        return $this->order_id;
    }

    public function setOrderId(string $order_id): self
    {
        $this->order_id = $order_id;

        return $this;
    }

    public function getUserId(): ?User
    {
        return $this->user_id;
    }

    public function setUserId(?User $user_id): self
    {
        $this->user_id = $user_id;

        return $this;
    }


    public function getProductQuntity(): ?int
    {
        return $this->product_quntity;
    }

    public function setProductQuntity(int $product_quntity): self
    {
        $this->product_quntity = $product_quntity;

        return $this;
    }

    public function getProductPrice(): ?int
    {
        return $this->product_price;
    }

    public function setProductPrice(int $product_price): self
    {
        $this->product_price = $product_price;

        return $this;
    }

    public function getTotalPrice(): ?int
    {
        return $this->total_price;
    }

    public function setTotalPrice(int $total_price): self
    {
        $this->total_price = $total_price;

        return $this;
    }

    public function getPaymentMethod(): ?string
    {
        return $this->payment_method;
    }

    public function setPaymentMethod(string $payment_method): self
    {
        $this->payment_method = $payment_method;

        return $this;
    }

    public function getIsPaid(): ?int
    {
        return $this->is_paid;
    }

    public function setIsPaid(int $is_paid): self
    {
        $this->is_paid = $is_paid;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): self
    {
        $this->status = $status;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->created_at;
    }

    public function setCreatedAt(\DateTimeImmutable $created_at): self
    {
        $this->created_at = $created_at;

        return $this;
    }

    public function getOrderAddress(): ?OrderAddress
    {
        return $this->orderAddress;
    }

    public function setOrderAddress(?OrderAddress $orderAddress): self
    {
        // unset the owning side of the relation if necessary
        if ($orderAddress === null && $this->orderAddress !== null) {
            $this->orderAddress->setOrderId(null);
        }

        // set the owning side of the relation if necessary
        if ($orderAddress !== null && $orderAddress->getOrderId() !== $this) {
            $orderAddress->setOrderId($this);
        }

        $this->orderAddress = $orderAddress;

        return $this;
    }

    public function getProductId(): ?Product
    {
        return $this->product_id;
    }

    public function setProductId(?Product $product_id): self
    {
        $this->product_id = $product_id;

        return $this;
    }


}
