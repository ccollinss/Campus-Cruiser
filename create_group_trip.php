<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require 'db_config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "message" => "Invalid request"]);
    exit;
}

function build_datetime($date, $time) {
    if (!$date || trim($date) === "") return NULL;
    
    if (strlen($date) < 8) return NULL;

    if (!$time || trim($time) === "") {
        $time = "00:00:00";
    }

    return $date . " " . $time;
}

$trip_name        = $_POST['trip_name'] ?? '';
$event_type       = $_POST['event_type'] ?? '';
$description      = $_POST['description'] ?? null;

$vehicle_name     = $_POST['vehicle_name'] ?? null;
$vehicle_type     = $_POST['vehicle_type'] ?? null;
$vehicle_seats    = $_POST['vehicle_seats'] ?? null;
$vehicle_price    = $_POST['vehicle_price'] ?? null;

$departure_address = $_POST['departure_address'] ?? null;
$destination       = $_POST['destination'] ?? null;

$departure_date    = $_POST['departure_date'] ?? '';
$departure_time    = $_POST['departure_time'] ?? '';
$return_date       = $_POST['return_date'] ?? '';
$return_time       = $_POST['return_time'] ?? '';

$total_seats       = $_POST['total_seats'] ?? null;
$price_per_person  = $_POST['price_per_person'] ?? null;
$public_trip       = $_POST['public_trip'] ?? 1;

if ($trip_name === '' || $event_type === '') {
    echo json_encode(["success" => false, "message" => "Missing required trip name or event type"]);
    exit;
}

$departure_datetime = build_datetime($departure_date, $departure_time);
$return_datetime    = build_datetime($return_date, $return_time);

$trip_code = strtoupper(substr(md5(uniqid("", true)), 0, 8));

$sql = "INSERT INTO group_trips 
    (trip_code, trip_name, event_type, description, vehicle_name, vehicle_type, vehicle_seats, vehicle_price,
     departure_address, destination, departure_datetime, return_datetime, total_seats, price_per_person, public_trip)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode(["success" => false, "message" => "Prepare failed: " . $conn->error]);
    exit;
}



$stmt->bind_param(
    "sssssss d s s s s i d i",
    $trip_code,
    $trip_name,
    $event_type,
    $description,
    $vehicle_name,
    $vehicle_type,
    $vehicle_seats,     
    $vehicle_price,     
    $departure_address,
    $destination,
    $departure_datetime,
    $return_datetime,
    $total_seats,       
    $price_per_person, 
    $public_trip        
);

$stmt->bind_param(
    "sssssssds ss sd i",
    $trip_code,
    $trip_name,
    $event_type,
    $description,
    $vehicle_name,
    $vehicle_type,
    $vehicle_seats,
    $vehicle_price,
    $departure_address,
    $destination,
    $departure_datetime,
    $return_datetime,
    $total_seats,
    $price_per_person,
    $public_trip
);


if (!$stmt->execute()) {
    echo json_encode(["success" => false, "message" => "Execute failed: " . $stmt->error]);
    exit;
}

$trip_id = $stmt->insert_id;

$stmt->close();
$conn->close();

$join_url = "joinTrip.php?code=" . urlencode($trip_code);

echo json_encode([
    "success" => true,
    "trip_id" => $trip_id,
    "trip_code" => $trip_code,
    "join_url" => $join_url
]);
exit;

?>
