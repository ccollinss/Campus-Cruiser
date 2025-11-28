<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require 'db_config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    die("Invalid request.");
}

// Basic student + trip info (solo flow)
$student_id     = $_POST['student_id'] ?? '';
$student_name   = $_POST['student_name'] ?? '';

$vehicle        = $_POST['vehicle'] ?? '';
$price          = $_POST['price'] ?? '0';
$pickup         = $_POST['pickup'] ?? '';
$dropoff        = $_POST['dropoff'] ?? '';
$dep_date       = $_POST['departure_date'] ?? '';
$dep_time       = $_POST['departure_time'] ?? '';
$ret_date       = $_POST['return_date'] ?? '';
$ret_time       = $_POST['return_time'] ?? '';

$payment_method = $_POST['payment_method'] ?? 'Credit Card';

// Validate required fields for a normal booking
if ($student_id === '' || $student_name === '' || $vehicle === '' || $pickup === '' || $dropoff === '') {
    die("Missing required booking information.");
}

// Build datetime strings
$pickup_dt = $dep_date . ' ' . ($dep_time ?: '00:00:00');
$return_dt = $ret_date . ' ' . ($ret_time ?: '00:00:00');

$total_price = floatval($price);

// ===== INSERT INTO bookings (no group_trip_id here) =====
$booking_sql = "
    INSERT INTO bookings 
    (student_id, student_name, vehicle_name, pickup_location, dropoff_location, pickup_datetime, return_datetime, total_price)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
";

$booking_stmt = $conn->prepare($booking_sql);
if (!$booking_stmt) {
    die("Booking prepare failed: " . $conn->error);
}

$booking_stmt->bind_param(
    "sssssssd",
    $student_id,
    $student_name,
    $vehicle,
    $pickup,
    $dropoff,
    $pickup_dt,
    $return_dt,
    $total_price
);

if (!$booking_stmt->execute()) {
    die("Error inserting booking: " . $booking_stmt->error);
}

$booking_id = $booking_stmt->insert_id;
$booking_stmt->close();

// ===== INSERT INTO payments =====
$payment_sql = "
    INSERT INTO payments (booking_id, amount, payment_method, status)
    VALUES (?, ?, ?, 'Completed')
";

$payment_stmt = $conn->prepare($payment_sql);
if (!$payment_stmt) {
    die("Payment prepare failed: " . $conn->error);
}

$payment_method = substr($payment_method, 0, 50);

$payment_stmt->bind_param("ids", $booking_id, $total_price, $payment_method);

if (!$payment_stmt->execute()) {
    die("Error inserting payment: " . $payment_stmt->error);
}

$payment_stmt->close();
$conn->close();

// ===== Redirect to success page with ALL the details (what you had before) =====
$redirect_url = "paymentSuccess.html" .
    "?vehicle=" . urlencode($vehicle) .
    "&price=" . urlencode(number_format($total_price, 2, '.', '')) .
    "&pickup=" . urlencode($pickup) .
    "&dropoff=" . urlencode($dropoff) .
    "&departure-date=" . urlencode($dep_date) .
    "&departure-time=" . urlencode($dep_time) .
    "&return-date=" . urlencode($ret_date) .
    "&return-time=" . urlencode($ret_time);

header("Location: $redirect_url");
exit;
?>
    