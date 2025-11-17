<?php
// Show all errors while testing
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Database connection info
$servername = "localhost";
$username = "camp_cruiser";
$password = "4321";
$database = "registration";

// Create connection and select database
$conn = mysqli_connect($servername, $username, $password, $database);

// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

// Only process form if submitted via POST
if ($_SERVER["REQUEST_METHOD"] === "POST") {

    // Collect POST data safely
    $sId = $_POST['Student_ID'] ?? '';
    $sName = $_POST['student_name'] ?? '';
    $sDateofBirth = $_POST['student_date_of_birth'] ?? '';
    $sEmail = $_POST['student_email'] ?? '';
    $sAddress = $_POST['student_address'] ?? '';
    $sStudentPhoneNumber = $_POST['phone_number'] ?? '';
    $sStudentlicense = $_POST['student_license'] ?? '';
    $sStudentinsurance = $_POST['student_insurance'] ?? '';
    $sStudentemergencycontact = $_POST['emergency_contact'] ?? '';
    $sStudentemergencyphonenumber = $_POST['emergency_phone'] ?? '';
    $sregistration = $_POST['registration'] ?? '';

    // Display values
    echo "<h2>Student Registration Info</h2>";
    echo "<h5>ID: <span>$sId</span></h5>";
    echo "<h5>Name: <span>$sName</span></h5>";
    echo "<h5>Date of Birth: <span>$sDateofBirth</span></h5>";
    echo "<h5>Email: <span>$sEmail</span></h5>";
    echo "<h5>Address: <span>$sAddress</span></h5>";
    echo "<h5>Phone: <span>$sStudentPhoneNumber</span></h5>";
    echo "<h5>License: <span>$sStudentlicense</span></h5>";
    echo "<h5>Insurance: <span>$sStudentinsurance</span></h5>";
    echo "<h5>Emergency Contact: <span>$sStudentemergencycontact</span></h5>";
    echo "<h5>Emergency Phone: <span>$sStudentemergencyphonenumber</span></h5>";
    echo "<h5>Registration: <span>$sregistration</span></h5>";

    // Prepared statement to prevent SQL injection
    $stmt = $conn->prepare("
        INSERT INTO students (
            Student_ID, student_name, student_date_of_birth, student_email,
            student_address, student_phone_number, student_license, student_insurance,
            student_emergency_contact, student_emergency_phone_number, registration
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");

    // Bind parameters
    $stmt->bind_param(
        "sssssssssss",
        $sId,
        $sName,
        $sDateofBirth,
        $sEmail,
        $sAddress,
        $sStudentPhoneNumber,
        $sStudentlicense,
        $sStudentinsurance,
        $sStudentemergencycontact,
        $sStudentemergencyphonenumber,
        $sregistration
    );

    // Execute and check result
    if ($stmt->execute()) {
        echo "<p style='color: green;'>✅ Record added successfully!</p>";
    } else {
        echo "<p style='color: red;'>❌ Error: " . $stmt->error . "</p>";
    }

    $stmt->close();
} else {
    echo "<p>No form data submitted.</p>";
}

// Close connection
$conn->close();
?>
$sregistration = $_POST['registration'];
echo "<h5>Registration: <span>$sregistration</span></h5>";
?>
