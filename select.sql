--Purpose: Find Students that have the last name "Collins"--
SELECT *
FROM Students
WHERE last_name = 'Collins';

-- Purpose Find Events happening within the month of October --
SELECT event_name, event_date
FROM Events
WHERE event_date ='2025-08-01' AND event_date = '2025-08-31';

-- Purpose: Retrieve a list of driver who are currently available --
SELECT *
FROM Drivers
WHERE driver_availability = TRUE;

-- Purpose: Find Students who haven't completed their payments    --
SELECT *
FROM Payments
WHERE payment_status = 'Failed' OR payment_status = 'Pending';
-- Purpose: Retrive all students that registered before 2025.--
SELECT first_name, last_name, registration_date
FROM Students
WHERE registration_date < '2024-01-01';

