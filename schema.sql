CREATE TABLE Students (
    student_id INT PRIMARY KEY AUTO_INCREMENT,
    student_name VARCHAR(50) NOT NULL,
    date_of_birth DATE NOT NULL,
    student_email VARCHAR(100) NOT NULL,
    student_address VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    student_license CHAR(20) UNIQUE,
    student_insurance VARCHAR(50),
    emergency_contact VARCHAR(50),
    emergency_contact_phone VARCHAR(20),
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Events (
    event_id INT PRIMARY KEY AUTO_INCREMENT,
    event_name VARCHAR(100) NOT NULL,
    event_date DATE NOT NULL,
    event_time TIME NOT NULL,
    event_location VARCHAR(100) NOT NULL,
    event_description TEXT
);

CREATE TABLE Vehicles (
    vehicle_id INT PRIMARY KEY AUTO_INCREMENT,
    vehicle_make VARCHAR(50) NOT NULL,
    vehicle_model VARCHAR(50) NOT NULL,
    vehicle_year INT(4),
    license_plate VARCHAR(20) UNIQUE NOT NULL,
    vehicle_availability BOOLEAN DEFAULT TRUE
);

CREATE TABLE Drivers (
    driver_id INT PRIMARY KEY AUTO_INCREMENT,
    driver_name VARCHAR(50) NOT NULL,
    driver_phone VARCHAR(20) NOT NULL,
    driver_email VARCHAR(100) NOT NULL,
    driver_licence VARCHAR(20) UNIQUE NOT NULL,
    driver_rating DECIMAL(2,1) CHECK (driver_rating BETWEEN 1.0 AND 5.0)
    driver_availability BOOLEAN DEFAULT TRUE
    driver_age INT(2) CHECK (driver_age >= 18) NOT NULL
    
);

CREATE TABLE Payments (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT,
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50) CHECK (payment_method IN ('Credit Card', 'Debit Card', 'PayPal', 'Apple Pay', 'Google Pay')),
    payment_status VARCHAR(20) CHECK (payment_status IN ('Pending', 'Completed', 'Failed')),
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    transaction_id VARCHAR(100) UNIQUE NOT NULL,

    FOREIGN KEY (student_id) REFERENCES Students(student_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE Bookings (
    booking_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT,
    driver_id INT,
    vehicle_id INT,
    event_id INT,
    payment_id INT,
    pickup_location VARCHAR(100) NOT NULL,
    dropoff_location VARCHAR(100) NOT NULL,
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    ride_status VARCHAR(20) CHECK (ride_status IN ('Pending', 'Confirmed', 'Cancelled')),

    FOREIGN KEY (student_id) REFERENCES Students(student_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (driver_id) REFERENCES Drivers(driver_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    FOREIGN KEY (vehicle_id) REFERENCES Vehicles(vehicle_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    FOREIGN KEY (event_id) REFERENCES Events(event_id)   
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    FOREIGN KEY (payment_id) REFERENCES Payments(payment_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

CREATE TABLE Create_Event (
    create_event_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT,
    event_id INT,
    role VARCHAR(50) CHECK (role IN ('Student', 'Organizer', 'Volunteer')),

    FOREIGN KEY (student_id) REFERENCES Students(student_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (event_id) REFERENCES Events(event_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE Ride_Groups (
    ride_group_id INT PRIMARY KEY AUTO_INCREMENT,
    group_size INT CHECK (group_size >= 4) NOT NULL,
    group_name VARCHAR(100) NOT NULL,
    group_description TEXT,
    created_by INT,

    FOREIGN KEY (created_by) REFERENCES Students(student_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);
