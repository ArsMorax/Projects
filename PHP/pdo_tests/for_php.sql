create database userdb;

use userdb;

create table users_data (
    id int auto_increment primary key,
    name varchar(255) not null,
    email varchar(255) not null
);