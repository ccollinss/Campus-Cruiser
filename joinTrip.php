<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require 'db_config.php';

$code = $_GET['code'] ?? '';

if ($code === '') {
    die("Missing trip code.");
}

$sql = "SELECT * FROM group_trips WHERE trip_code = ?";
$stmt = $conn->prepare($sql);
if (!$stmt) {
    die("Prepare failed: " . $conn->error);
}

$stmt->bind_param("s", $code);
$stmt->execute();
$result = $stmt->get_result();
$trip = $result->fetch_assoc();
$stmt->close();
$conn->close();

if (!$trip) {
    die("This group trip could not be found.");
}

$price_per_person = (float)$trip['price_per_person'];
$vehicle_label = $trip['vehicle_name'] ? $trip['vehicle_name'] : ("Group Trip: " . $trip['trip_name']);

function fmt_date($d) {
    if (!$d) return "Not set";
    return date("M j, Y", strtotime($d));
}

function fmt_time($t) {
    if (!$t) return "";
    return date("g:i A", strtotime($t));
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Join Group Trip - Campus Cruiser</title>
    <link rel="stylesheet" href="joinTrip.css">
</head>
<body>

<header>
    <nav class="navbar">
        <div class="img-container">
            <img src="campusCruiserLogo.png" class="nav-logo" alt="Campus Cruiser Logo"
                 onclick="location.href='home.html'">
        </div>
        <ul class="nav-link-container">
            <li><a href="home.html" class="nav-link">Home</a></li>
            <li><a href="searchVehicle.html" class="nav-link">Browse Trips</a></li>
            <li><a href="bookings.php" class="nav-link">My Bookings</a></li>
            <li><a href="about.html" class="nav-link">About</a></li>
        </ul>
    </nav>
</header>

<main class="join-main">
    <section class="page-header">
        <h1>Join Group Trip</h1>
        <p>Pay your share and reserve your seat.</p>
    </section>

    <section class="join-wrapper">
        <div class="trip-summary-card">
            <h2><?php echo htmlspecialchars($trip['trip_name']); ?></h2>
            <p><strong>Event Type:</strong> <?php echo htmlspecialchars($trip['event_type']); ?></p>
            <p><strong>Route:</strong>
                <?php echo htmlspecialchars($trip['departure_address']); ?>
                →
                <?php echo htmlspecialchars($trip['destination']); ?>
            </p>
            <p><strong>Departure:</strong>
                <?php echo fmt_date($trip['departure_date']); ?>
                <?php if ($trip['departure_time']) echo " at " . fmt_time($trip['departure_time']); ?>
            </p>
            <p><strong>Return:</strong>
                <?php echo fmt_date($trip['return_date']); ?>
                <?php if ($trip['return_time']) echo " at " . fmt_time($trip['return_time']); ?>
            </p>
            <p><strong>Price Per Person:</strong>
                $<?php echo number_format($price_per_person, 2); ?>
            </p>
        </div>

        <div class="join-form-card">
            <h2>Reserve Your Spot</h2>

            <form action="payment.php" method="GET">

                <label>
                    Student ID
                    <input type="text" name="student_id" maxlength="10" required>
                </label>

                <label>
                    Student Name
                    <input type="text" name="student_name" maxlength="100" required>
                </label>

                <input type="hidden" name="vehicle" value="<?php echo htmlspecialchars($vehicle_label); ?>">
                <input type="hidden" name="price" value="<?php echo htmlspecialchars($price_per_person); ?>">
                <input type="hidden" name="pickup"
                       value="<?php echo htmlspecialchars($trip['departure_address']); ?>">
                <input type="hidden" name="dropoff"
                       value="<?php echo htmlspecialchars($trip['destination']); ?>">

                <input type="hidden" name="departure-date" value="<?php echo htmlspecialchars($trip['departure_date']); ?>">
                <input type="hidden" name="departure-time" value="<?php echo htmlspecialchars($trip['departure_time']); ?>">
                <input type="hidden" name="return-date" value="<?php echo htmlspecialchars($trip['return_date']); ?>">
                <input type="hidden" name="return-time" value="<?php echo htmlspecialchars($trip['return_time']); ?>">

                <input type="hidden" name="group_trip_id" value="<?php echo (int)$trip['id']; ?>">
                <input type="hidden" name="is_group" value="1">

                <button type="submit" class="primary-btn">Continue to Payment</button>
            </form>
        </div>
    </section>
</main>

</body>
</html>
