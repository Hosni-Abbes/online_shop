<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230722141631 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE order_address (id INT AUTO_INCREMENT NOT NULL, relation_id INT DEFAULT NULL, firstname VARCHAR(255) NOT NULL, lastname VARCHAR(255) NOT NULL, city VARCHAR(100) NOT NULL, address VARCHAR(255) NOT NULL, zip INT NOT NULL, phone VARCHAR(100) NOT NULL, UNIQUE INDEX UNIQ_FB34C6CA3256915B (relation_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE order_address ADD CONSTRAINT FK_FB34C6CA3256915B FOREIGN KEY (relation_id) REFERENCES `order` (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE order_address DROP FOREIGN KEY FK_FB34C6CA3256915B');
        $this->addSql('DROP TABLE order_address');
    }
}
