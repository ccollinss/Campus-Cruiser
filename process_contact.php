<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require 'db_config.php';

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $name = $_POST['name'] ?? '';
    $email = $_POST['email'] ?? '';
    $message = $_POST['message'] ?? '';

    if ($name === '' || $email === '' || $message === '') {
        die("Please fill out all fields.");
    }

    $sql = "INSERT INTO contact_messages (name, email, message)
            VALUES (?, ?, ?)";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sss", $name, $email, $message);

    if ($stmt->execute()) {
        echo "<p style='color:green;font-size:20px;'>Message sent successfully!</p>";
        echo "<a href='contact.html'>Back to Contact Page</a>";
    } else {
        echo "Error: " . $stmt->error;
    }

    $stmt->close();
    $conn->close();
}
?>
