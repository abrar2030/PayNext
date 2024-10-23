-- TRANSACTIONS
INSERT INTO TRANSACTIONS (id, user_id, amount, transaction_date, status, payment_method)
    VALUES (1, 'abrar2030', '99.99', '2024-01-01', 'COMPLETED', 'CREDIT_CARD');

INSERT INTO TRANSACTIONS (id, user_id, amount, transaction_date, status, payment_method)
    VALUES (2, 'abrar2030', '55.00', '2024-01-02', 'PENDING', 'DEBIT_CARD');

INSERT INTO TRANSACTIONS (id, user_id, amount, transaction_date, status, payment_method)
    VALUES (3, 'abrar2030', '250.89', '2024-01-03', 'FAILED', 'PAYPAL');

INSERT INTO TRANSACTIONS (id, user_id, amount, transaction_date, status, payment_method)
    VALUES (4, 'abrar2030', '26.95', '2024-01-04', 'COMPLETED', 'BANK_TRANSFER');

INSERT INTO TRANSACTIONS (id, user_id, amount, transaction_date, status, payment_method)
    VALUES (5, 'abrar2030', '38.00', '2024-01-05', 'CANCELLED', 'CREDIT_CARD');

-- USERS
INSERT INTO USERS (username, password, enabled)
    VALUES ('abrar2030', '{noop}abrar2030', 1);

-- AUTHORITIES
INSERT INTO AUTHORITIES (username, authority)
    VALUES ('abrar2030', 'ADMIN');
