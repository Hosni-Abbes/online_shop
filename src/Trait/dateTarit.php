<?php
namespace App\Trait;

use DateTimeImmutable;

trait dateTrait {

    private $createdAt = null;


    public function getCreatedAt(): ?DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(DateTimeImmutable $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }
}