<?php

// Connect to the database
$sId = $_POST['student_id'];
echo "<h5>ID: <span>$sId</span></h5>";

$sName = $_POST['student_name'];
echo "<h5>Name: <span>$sName</span></h5>";

$sDateofBirth = $_POST['student_date_of_birth'];
echo "<h5>Date of Birth: <span>$sDateofBirth</span></h5>";

$sEmail = $_POST['student_email'];
echo "<h5>Email: <span>$sEmail</span></h5>"; 

$sAddress = $_POST['student_address'];
echo "<h5>Address: <span>$sAddress</span></h5>";

$sStudentPhoneNumber = $_POST['student_phone_number'];
echo "<h5>Student Phone Number: <span>$sStudentPhoneNumber</span></h5>";

$sStudentlicense = $_POST['student_license'];
echo "<h5>Student License: <span>$sStudentlicense</span></h5>";

$sStudentinsurance = $_POST['student_insurance'];
echo "<h5>Student Insurance: <span>$sStudentinsurance</span></h5>";

$sStudentemergencycontact = $_POST['student_emergency_contact'];
echo "<h5>Student Emergency Contact: <span>$sStudentemergencycontact</span></h5>";

$sStudentemergencyphonenumber = $_POST['student_emergency_phone_number'];
echo "<h5>Student Emergency Phone Number: <span>$sStudentemergencyphonenumber</span></h5>"; 

$sregistration = $_POST['registration'];
echo "<h5>Registration: <span>$sregistration</span></h5>";
?>
