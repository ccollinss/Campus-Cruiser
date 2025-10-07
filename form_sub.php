<?php
    $tempStlye = "<style>span {color: green; text-decoration: underline;)</style>";
    echo $tempStlye;
    
    echo " <h2>Testing Page to show values of form</h2>";
    echo "<hr>";

    $sId = $_POST["student_id"];
    echo "<h5>Student ID: <span>$sId</span></h5>";
    
    $sName = $_POST["student_name"];
    echo "<h5>Name: <span>$sName</span></h5>";

    $sEmail = $_POST["student_email"];
    echo "<h5>Email: <span>$sEmail</span></h5>";

    $sMajor = $_POST["student_major"];
    echo "<h5>Major: <span>$sMajor</span></h5>";

    $sCredits = $_POST["student_credits"];
    echo "<h5>Credits: <span>$sCredits</span></h5>";

    $sGpa = $_POST["student_gpa"];
    echo "<h5>GPA: <span>$sGpa</span></h5>";

    $sGender = $_POST["student_gender"];
    echo "<h5>Gender: <span>$sGender</span></h5>";
    
    if (isset($_POST["student_hosuing"])) {
        echo "<h5>Housing: <span>On campus</span></h5>";
    } else {
        echo "<h5>Housing: <span>Off campus</span></h5>";
    }

    $sEmergencyContact = $_POST["student_emergency_phone"];
    echo "<h5> Emergency_Contact: <span>$sEmergencyContact</span></h5>";

?>
