INSERT INTO Students (student_id, student_name, date_of_birth, student_email, student_address, phone_number, drivers_license, student_insurance, emergency_contact, emergency_contact_phone) VALUES
(1, 'Cameeron Collins', '2005-11-09', 'cmcollins2005@gmail.com', '6215 Pink St, Colorsville', '555-1234', 'D1234567', 'HealthPlus', 'Jane Collins', '410-567-3538'),
(2, 'Ava Johnson', '2004-05-14', 'ajohnson14@gmail.com', '456 Oak St, Townsville', '555-2345', 'D2345678', 'MediCare', 'John Johnson', '667-274-6789'),
(3, 'Liam Smith', '2005-08-22', 'thesmiths@gmail.com', '789 Pine St, Villageville', '555-3456', 'D3456789', 'HealthFirst', 'Mary Smith', '294-219-7890'),
(4, 'Sophia Brown', '2004-12-30', '@gmail.com', '321 Maple St, Hamletville', '555-4567', 'D4567890', 'WellCare', 'James Brown', '911-592-8901'),
(5, 'Noah Davis', '2005-03-18', 'xxx@gmail.com', '654 Cedar St, Boroughville', '555-5678', 'D5678901', 'HealthPlus', 'Patricia Davis', '229-295-9012');

INSERT INTO Events (event_id, event_name, event_date, event_time, event_location, event_description) VALUES
(1, 'Norfolk State Homecoming', '2024-09-01', '10:00:00', '700 Park Ave, Norfolk, VA 23504', 'Annual homecoming event with various activities and performances.'),
(2, 'NSBE Tech Expo', '2024-12-10', '11:00:00', '2048 Chesapeake Dr, Catonsville, NC 20419', 'An expo showcasing the latest in technology and innovation.');
(3, 'Kenrick Lamar Concert', '2024-10-05', '09:00:00', '123 Music Ln, Richmond, VA 23220', 'Live concert featuring Kenrick Lamar and other artists.'),
(4, 'NCAT vs. Morgan Football Game', '2024-11-20', '12:00:00', '1601 E Market St, Greensboro, NC 27411', 'Exciting football game between NCAT and Morgan State.'),
(5, 'DC Carnival Festival', '2024-09-15', '14:00:00', '6001 Georgia Ave NW, Washington, DC 20011', 'Cultural festival with food, music, and entertainment.');

INSERT INTO Vehicles (vehicle_id, vehicle_make, vehicle_model, vehicle_year, license_plate, vehicle_availability) VALUES
(1, 'Toyota', 'Camry', 2020, 'ABC123', 'Available'),
(2, 'Honda', 'Civic', 2019, 'XYZ789', 'Available'),
(3, 'Ford', 'Focus', 2021, 'LMN456', 'Unavailable'),
(4, 'Chevrolet', 'Malibu', 2018, 'DEF321', 'Available'),
(5, 'Nissan', 'Altima', 2022, 'GHI654', 'Unavailable');

INSERT INTO Drivers (driver_id, driver_name, driver_phone, driver_email, driver_license, driver_rating, driver_availability) VALUES
(1, 'Michael Scott', '555-1111', 'xxx.com', 'D6789012', 4.5, 'Available'),
(2, 'Pam Beesly', '555-2222', 'xxx.com', 'D7890123', 4.8, 'Unavailable'),
(3, 'Jim Halpert', '555-3333', 'xxx.com', 'D8901234', 4.7, 'Available'),
(4, 'Dwight Schrute', '555-4444', 'xxx.com', 'D9012345', 4.6, 'Available'),
(5, 'Stanley Hudson', '555-5555', 'xxx.com', 'D0123456', 4.4, 'Unavailable');

INSERT INTO Payments (payment_id, student_id, amount, payment_method, payment_status, transaction_id) VALUES
(1, 1, 50.00, 'Credit Card', 'Completed', 'TXN1001'),
(2, 2, 75.00, 'PayPal', 'Pending', 'TXN1002'),
(3, 3, 60.00, 'Debit Card', 'Completed', 'TXN1003'),
(4, 4, 80.00, 'Apple Pay', 'Failed', 'TXN1004'),
(5, 5, 55.00, 'Google Pay', 'Completed', 'TXN1005');

INSERT INTO Bookings (booking_id, student_id, driver_id, vehicle_id, event_id, payment_id, pickup_location, event_location, booking_date, booking_time, ride_status) VALUES
(1, 1, 1, 1, 1, 1, '123 Main St', '700 Park Ave, Norfolk, VA 23504', '2024-08-25', '09:00:00', 'Confirmed'),
(2, 2, 2, 2, 2, 2, '456 Oak St', '2048 Chesapeake Dr, Catonsville, NC 20419', '2024-11-30', '10:00:00', 'Pending'),
(3, 3, 3, 3, 3, 3, '789 Pine St', '123 Music Ln, Richmond, VA 23220', '2024-09-28', '08:00:00', 'Cancelled'),
(4, 4, 4, 4, 4, 4, '321 Maple St', '1601 E Market St, Greensboro, NC 27411', '2024-11-15', '11:00:00', 'Confirmed'),
(5, 5, 5, 5, 5, 5, '654 Cedar St', '6001 Georgia Ave NW, Washington, DC 20011', '2024-09-10', '13:00:00', 'Confirmed');

INSERT INTO Create_Event (create_event_id, student_id, event_id, role) VALUES
(1, 1, 1, 'Organizer'),
(2, 2, 2, 'Volunteer'),
(3, 3, 3, 'Student'),
(4, 4, 4, 'Organizer'),
(5, 5, 5, 'Student');

INSERT INTO Ride_Groups (ride_group_id, group_name, group_description, created_by) VALUES
