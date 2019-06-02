CREATE TABLE Halls(
    id SERIAL PRIMARY KEY,      
    name VARCHAR(256) NOT NULL UNIQUE,
    address VARCHAR(256) NOT NULL,
    picture_url VARCHAR(1024) NOT NULL,
    description VARCHAR(1024) NOT NULL, 
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

--CREATE TYPE reservation_status AS ENUM ('pending', 'approved', 'denied');

CREATE TABLE Reservations(
    id SERIAL PRIMARY KEY,
    hall_fk INT REFERENCES Halls(ID) NOT NULL,
    reservation_title VARCHAR(256) NOT NULL,
    reservation_description VARCHAR(1024) NOT NULL,
    reservation_status reservation_status NOT NULL,
    reservation_date DATE NOT NULL,
    reservation_start_time TIME NOT NULL,
    reservation_end_time TIME NOT NULL,
    citizen_full_name VARCHAR(256) NOT NULL,
    citizen_organization VARCHAR(256),
    citizen_email VARCHAR(256) NOT NULL,
    citizen_phone_number VARCHAR(256) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW() 
);

CREATE TABLE Admins(
    id SERIAL PRIMARY KEY,
    user_name VARCHAR(256) NOT NULL UNIQUE,
    hashed_password VARCHAR(1024) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()       
);

CREATE TABLE Sessions(
    id SERIAL PRIMARY KEY,
    admin_fk INT REFERENCES Admins(id) NOT NULL,
    login_timestamp TIMESTAMP NOT NULL,
    logout_timestamp TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()       
);
