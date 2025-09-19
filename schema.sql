CREATE TABLE Students (
    student_id INT PRIMARY KEY
    student_name VARCHAR(50) NOT NULL,
    date_of_birth DATE NOT NULL,
    student_email VARCHAR(100) NOT NULL,
    student_address VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    student_license CHAR(20) UNIQUE,
    student_insurance VARCHAR(50),
    emergency_contact VARCHAR(50),
    emergency_contact_phone VARCHAR(20)
    registration date TIMESTAMP DEFAULT CURRENT_TIMESTAMP

    FOREIGN KEY () REFERENCES ()
);

CREATE TABLE Events (
    event_id INT PRIMARY KEY,
    event_name VARCHAR(100) NOT NULL,
    event_date DATE NOT NULL,
    event_time TIME NOT NULL,
    event_location VARCHAR(100) NOT NULL,
    event_description TEXT

    FOREIGN KEY () REFERENCES ()
);

CREATE TABLE Vehicles (
    vehicle_id INT PRIMARY KEY,
    vehicle_make VARCHAR(50) NOT NULL,
    vehicle_model VARCHAR(50) NOT NULL,
    vehicle_year INT(4),
    license_plate VARCHAR(20) UNIQUE NOT NULL,
    vehicle_availability BOOLEAN DEFAULT TRUE

    FOREIGN KEY () REFERENCES ()
);

CREATE TABLE Drivers (
    driver_id INT PRIMARY KEY,
    driver_name VARCHAR(50) NOT NULL,
    driver_phone VARCHAR(20) NOT NULL,
    driver_email VARCHAR(100) NOT NULL,
    driver_licence VARCHAR(20) UNIQUE NOT NULL,
    driver_rating DECIMAL(2,1) CHECK (driver_rating BETWEEN 1.0 AND 5.0)
    driver_availability BOOLEAN DEFAULT TRUE

    FOREIGN KEY () REFERENCES ()

);

CREATE TABLE Payments (
    payment_id INT PRIMARY KEY,
    student_id INT,
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50) CHECK (payment_method IN ('Credit Card', 'Debit Card', 'PayPal', 'Apple Pay', 'Google Pay')),
    payment_status VARCHAR(20) CHECK (payment_status IN ('Pending', 'Completed', 'Failed')),
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    transaction_id VARCHAR(100) UNIQUE NOT NULL,

    FOREIGN KEY () REFERENCES ()
);

CREATE TABLE Bookings (
    booking_id INT PRIMARY KEY,
    student_id INT,
    driver_id INT,
    vehicle_id INT,
    event_id INT,
    payment_id INT,
    pickup_location VARCHAR(100) NOT NULL,
    dropoff_location VARCHAR(100) NOT NULL,
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    ride_status VARCHAR(20) CHECK (status IN ('Pending', 'Confirmed', 'Cancelled')),

    FOREIGN KEY () REFERENCES ()
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE Create_Event (
    create_event_id INT PRIMARY KEY,
    student_id INT,
    event_id INT,
    role VARCHAR(50) CHECK (role IN ('Student', 'Organizer', 'Volunteer')),

    FOREIGN KEY () REFERENCES ()
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE Ride_Groups (
    ride_group_id INT PRIMARY KEY,
    group_name VARCHAR(100) NOT NULL,
    group_description TEXT,
    created_by INT,

    FOREIGN KEY () REFERENCES ()
);
