-- Insert initial customer data
INSERT INTO CUSTOMERS (name, surname, country_region, street_and_house_number, city, postal_code, phone_number, email)
VALUES
    ('John', 'Doe', 'USA', '123 Main St', 'New York', '10001', '1234567890', 'john.doe@example.com'),
    ('Jane', 'Smith', 'Canada', '456 Maple Ave', 'Toronto', 'M4B 1B4', '0987654321', 'jane.smith@example.com');

-- Insert initial payment data
INSERT INTO PAYMENTS (amount, payer_name, transaction_id, payment_method, date)
VALUES
    (99.99, 'John Doe', 'TX1234567890', 'CREDIT_CARD', '2024-01-01'),
    (55.00, 'Jane Smith', 'TX0987654321', 'DEBIT_CARD', '2024-01-02');

-- Insert initial order data
INSERT INTO ORDERS (order_date, customer_id, payment_id)
VALUES
    ('2024-01-05', 1, 1),
    ('2024-01-06', 2, 2);

-- Insert initial user and authority data
INSERT INTO USERS (username, password, enabled)
VALUES
    ('abrar2030', 'password123', 1);

INSERT INTO AUTHORITIES (username, authority)
VALUES
    ('abrar2030', 'ROLE_USER');
