CREATE DATABASE db_login;

USE db_login;

CREATE TABLE users(
    id INT(11) PRIMARY KEY NOT NULL,
    username VARCHAR(20) NOT NULL,
    password VARCHAR(50) NOT NULL,
    fullname VARCHAR(70) NOT NULL

);

ALTER TABLE users
    MODIFY id INT(11) NOT NULL AUTO_INCREMENT;