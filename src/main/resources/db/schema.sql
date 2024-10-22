CREATE TABLE book (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    authors VARCHAR(255),
    publisher VARCHAR(255),
    published_on VARCHAR(255),
    isbn VARCHAR(20),
    price DECIMAL(10, 2) NOT NULL
);
