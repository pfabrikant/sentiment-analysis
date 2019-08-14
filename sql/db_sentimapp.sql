DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id SERIAL primary key,
    username VARCHAR (255) UNIQUE,
    email VARCHAR (255) not null,
    password TEXT not null,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);
DROP TABLE IF EXISTS history;
CREATE TABLE history (
    id SERIAL primary key,
    userId INT,
    input_text TEXT,
    sentiment FLOAT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
