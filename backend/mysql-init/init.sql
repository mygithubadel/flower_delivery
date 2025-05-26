CREATE DATABASE IF NOT EXISTS flower_delivery_test;

CREATE USER IF NOT EXISTS 'user_test'@'%' IDENTIFIED BY 'pass_test';
GRANT ALL PRIVILEGES ON `flower_delivery_test`.* TO 'user_test'@'%';
FLUSH PRIVILEGES;

USE flower_delivery_test;
CREATE TABLE IF NOT EXISTS users
(
    id         INT AUTO_INCREMENT PRIMARY KEY,
    invited_by int          null,
    email      VARCHAR(100) NOT NULL UNIQUE,
    username   VARCHAR(100) NOT NULL UNIQUE,
    phone      VARCHAR(15)  NULL,
    password   CHAR(60)     NOT NULL
);

USE flower_delivery_test;
CREATE TABLE IF NOT EXISTS orders
(
    id             INT                                       NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id        INT                                       NOT NULL,
    status         ENUM ('pending', 'delivered', 'canceled') NOT NULL,
    flower_details JSON                                      NOT NULL,
    quantity       INT                                       NOT NULL CHECK (quantity > 0),
    address        TEXT                                      NOT NULL,
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

USE flower_delivery;
CREATE TABLE IF NOT EXISTS users
(
    id         INT AUTO_INCREMENT PRIMARY KEY,
    invited_by int          null,
    email      VARCHAR(100) NOT NULL UNIQUE,
    username   VARCHAR(100) NOT NULL UNIQUE,
    phone      VARCHAR(15)  NULL,
    password   CHAR(60)     NOT NULL
);

USE flower_delivery;
CREATE TABLE IF NOT EXISTS orders
(
    id             INT                                       NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id        INT                                       NOT NULL,
    status         ENUM ('pending', 'delivered', 'canceled') NOT NULL,
    flower_details JSON                                      NOT NULL,
    quantity       INT                                       NOT NULL CHECK (quantity > 0),
    address        TEXT                                      NOT NULL,
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
);



