<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require 'db_config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    die("Invalid request.");
}

$name = $_POST['name'] ?? '';
$email = $_POST['email'] ?? '';
$message = $_POST['message'] ?? '';

if ($name === '' || $email === '' || $message === '') {
    die("All fields are required.");
}

$sql = "INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sss", $name, $email, $message);

if (!$stmt->execute()) {
    die("Error saving message: " . $stmt->error);
}

$stmt->close();
$conn->close();

header("Location: contact_success.html");
exit;
?>
