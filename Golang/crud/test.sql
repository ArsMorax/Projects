create database inventories;
use inventories;

create table products (
    product_id int auto_increment primary key,
    name varchar(100) not null,
    description varchar(255),
    price decimal(10,2) not null,
    stock_quantity int default 0,
    created_at timestamp default current_timestamp
);

INSERT into products (name, description, price, stock_quantity) values
('Laptop', 'High performance laptop', 1200.00, 10),
('Smartphone', 'Latest model smartphone', 800.00, 25),
('Headphones', 'Noise-cancelling headphones', 150.00, 50),
('Monitor', '4K UHD monitor', 400.00, 15),
('Keyboard', 'Mechanical keyboard', 100.00, 30);

select * from products;