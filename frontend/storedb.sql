DROP schema if exists storedb;
CREATE schema storedb;
USE storedb;

CREATE TABLE Categories (
	categoryID int PRIMARY KEY AUTO_INCREMENT, 
    categoryName varchar(255) not null,
    description text null
);

CREATE TABLE Suppliers (
	supplierID int PRIMARY KEY AUTO_INCREMENT,
    supplierName varchar(255) not null,
    phone varchar(20) not null,
    address text not null,
    description text null
);

CREATE TABLE Products (
	productID int PRIMARY KEY AUTO_INCREMENT, 
    categoryID int,
    supplierID int,
    productName varchar(255) not null,
    price DECIMAL(20, 2) not null,
    quantity int not null,
    description text null,
    FOREIGN KEY (categoryID) REFERENCES Categories(categoryID),
    FOREIGN KEY (supplierID) REFERENCES Suppliers(supplierID)
);

CREATE TABLE ImageProduct (
	imageID int PRIMARY KEY AUTO_INCREMENT, 
    productID int,
    imageUrl text not null,
    FOREIGN KEY (productID) REFERENCES Products(productID)
);

CREATE TABLE Customers (
	customerID int PRIMARY KEY AUTO_INCREMENT,
    name varchar(150) NOT NULL,
    phone varchar(10) NOT NULL,
    email varchar(150) NOT NULL,
    birthday datetime NOT NULL,
    hashed_password VARCHAR(255) NOT NULL
);

CREATE TABLE InfoDelivery (
	infoDeliveryID int PRIMARY KEY AUTO_INCREMENT,
    customerID int,
    name varchar(50) not null,
    phone varchar(10) not null,
    city varchar(100) not null,
    district varchar(100) not null,
    ward varchar(100) not null,
    specificAddress varchar(100) not null,
    description text null,
    dateCreate datetime not null,
    FOREIGN KEY (customerID) REFERENCES Customers(customerID)
);

CREATE TABLE Orders (
	orderID int PRIMARY KEY AUTO_INCREMENT,
    customerID int, 
    dateOrder datetime not null,
    dateShipping datetime null,
    infoDeliveryID int,
    FOREIGN KEY (customerID) REFERENCES Customers(customerID),
    FOREIGN KEY (infoDeliveryID) REFERENCES InfoDelivery(infoDeliveryID)
);

CREATE TABLE OrderDetails (
	orderID int,
    productID int,
    price DECIMAL(20, 2) not null,
    quantity int NOT NULL,
    discount float NOT NULL,
    PRIMARY KEY (orderID, productID),
    FOREIGN KEY (orderID) REFERENCES Orders(orderID),
    FOREIGN KEY (productID) REFERENCES Products(productID)
);

CREATE TABLE CustomerCart (
	cartID int AUTO_INCREMENT,
	customerID int,
    PRIMARY KEY (cartID, customerID),
    FOREIGN KEY (customerID) REFERENCES Customers(customerID)
);

CREATE TABLE CartDetails (
	cartID int,
    productID int,
    quantity int not null,
    PRIMARY KEY (cartID, productID),
	FOREIGN KEY (cartID) REFERENCES CustomerCart(cartID),
    FOREIGN KEY (productID) REFERENCES Products(productID)
);





