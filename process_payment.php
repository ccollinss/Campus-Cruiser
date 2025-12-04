<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require 'db_config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    die("Invalid request.");
}

$student_id     = $_POST['student_id'] ?? '';
$student_name   = $_POST['student_name'] ?? '';
$group_trip_id  = $_POST['group_trip_id'] ?? null; 
$is_group       = $_POST['is_group'] ?? 0;

$vehicle        = $_POST['vehicle'] ?? '';
$price          = $_POST['price'] ?? '0';
$group_trip_id  = $_POST['group_trip_id'] ?? null;
$pickup         = $_POST['pickup'] ?? '';
$dropoff        = $_POST['dropoff'] ?? '';
$dep_date       = $_POST['departure_date'] ?? '';
$dep_time       = $_POST['departure_time'] ?? '';
$ret_date       = $_POST['return_date'] ?? '';
$ret_time       = $_POST['return_time'] ?? '';

$payment_method = $_POST['payment_method'] ?? 'Credit Card';

// Determine trip type
$trip_type = ($ret_date === '' || $ret_time === '') ? 'one-way' : 'round-trip';

if ($student_id === '' || $student_name === '' || $vehicle === '' || $pickup === '' || $dropoff === '') {
    die("Missing required booking information.");
}

$pickup_dt = $dep_date . ' ' . ($dep_time ?: '00:00:00');
$return_dt = ($ret_date !== '' ? ($ret_date . ' ' . ($ret_time ?: '00:00:00')) : null);

$total_price = floatval($price);

$booking_sql = "
    INSERT INTO bookings 
    (student_id, student_name, vehicle_name, pickup_location, dropoff_location, pickup_datetime, return_datetime, total_price, trip_type)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
";

$booking_stmt = $conn->prepare($booking_sql);
if (!$booking_stmt) {
    die("Booking prepare failed: " . $conn->error);
}

$booking_stmt->bind_param(
    "sssssssds",
    $student_id,
    $student_name,
    $vehicle,
    $pickup,
    $dropoff,
    $pickup_dt,
    $return_dt,
    $total_price,
    $trip_type
);

if (!$booking_stmt->execute()) {
    die("Error inserting booking: " . $booking_stmt->error);
}

$booking_id = $booking_stmt->insert_id;
$booking_stmt->close();

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

if ($is_group && $group_trip_id) {

    $member_sql = "
        INSERT INTO group_trip_members (group_trip_id, student_id, student_name)
        VALUES (?, ?, ?)
    ";

    $member_stmt = $conn->prepare($member_sql);
    if (!$member_stmt) {
        die("Member insert failed: " . $conn->error);
    }

    $member_stmt->bind_param("iss", $group_trip_id, $student_id, $student_name);
    $member_stmt->execute();
    $member_stmt->close();

    $update_sql = "
        UPDATE group_trips
        SET seats_taken = seats_taken + 1
        WHERE id = ?
    ";

    $update_stmt = $conn->prepare($update_sql);
    if (!$update_stmt) {
        die("Seat update failed: " . $conn->error);
    }

    $update_stmt->bind_param("i", $group_trip_id);
    $update_stmt->execute();
    $update_stmt->close();
}


$payment_stmt->close();
if (!empty($group_trip_id)) {

    $member_sql = "
        INSERT INTO group_trip_members (group_trip_id, student_id, student_name)
        VALUES (?, ?, ?)
    ";

    $member_stmt = $conn->prepare($member_sql);

    if ($member_stmt) {
        $member_stmt->bind_param("iss", $group_trip_id, $student_id, $student_name);
        $member_stmt->execute();
        $member_stmt->close();
    }

    $update_sql = "
        UPDATE group_trips
        SET seats_taken = seats_taken + 1
        WHERE id = ?
    ";

    $update_stmt = $conn->prepare($update_sql);

    if ($update_stmt) {
        $update_stmt->bind_param("i", $group_trip_id);
        $update_stmt->execute();
        $update_stmt->close();
    }
}


if (!empty($group_trip_id)) {

    $member_sql = "
        INSERT INTO group_trip_members (group_trip_id, student_id, student_name)
        VALUES (?, ?, ?)
    ";

    $member_stmt = $conn->prepare($member_sql);

    if ($member_stmt) {
        $member_stmt->bind_param("iss", $group_trip_id, $student_id, $student_name);
        $member_stmt->execute();
        $member_stmt->close();
    }

    $update_sql = "
        UPDATE group_trips
        SET seats_taken = seats_taken + 1
        WHERE id = ?
    ";

    $update_stmt = $conn->prepare($update_sql);

    if ($update_stmt) {
        $update_stmt->bind_param("i", $group_trip_id);
        $update_stmt->execute();
        $update_stmt->close();
    }
}
if (isset($_POST['group_trip_id']) && $_POST['is_group'] == "1") {
    $group_trip_id = intval($_POST['group_trip_id']);

    // Update seats_taken
    $update_sql = "UPDATE group_trips SET seats_taken = seats_taken + 1 WHERE id = ?";
    $update_stmt = $conn->prepare($update_sql);
    $update_stmt->bind_param("i", $group_trip_id);
    $update_stmt->execute();
    $update_stmt->close();

    // Insert member record
    $member_sql = "INSERT INTO group_trip_members (group_trip_id, student_id, student_name) VALUES (?, ?, ?)";
    $member_stmt = $conn->prepare($member_sql);
    $member_stmt->bind_param("iss", $group_trip_id, $student_id, $student_name);
    $member_stmt->execute();
    $member_stmt->close();
}


$conn->close();

$redirect_url = "paymentSuccess.html" .
    "?vehicle=" . urlencode($vehicle) .
    "&price=" . urlencode(number_format($total_price, 2, '.', '')) .
    "&pickup=" . urlencode($pickup) .
    "&dropoff=" . urlencode($dropoff) .
    "&departure-date=" . urlencode($dep_date) .
    "&departure-time=" . urlencode($dep_time) .
    "&return-date=" . urlencode($ret_date) .
    "&return-time=" . urlencode($ret_time) .
    "&trip-type=" . urlencode($trip_type);

header("Location: $redirect_url");
exit;
?>
