<?php
// bookings.php
error_reporting(E_ALL);
ini_set('display_errors', 1);
require 'db_config.php';

// For now, show ALL bookings.
$sql = "SELECT * FROM bookings ORDER BY created_at DESC";
$result = $conn->query($sql);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>My Bookings - Campus Cruiser</title>
    <link rel="stylesheet" href="bookings.css">
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
            <li><a href="bookings.php" class="nav-link active">My Bookings</a></li>
            <li><a href="about.html" class="nav-link">About</a></li>
        </ul>
    </nav>
</header>

<main class="bookings-main">
    <section class="page-header">
        <h1>My Bookings</h1>
        <p>Here are your recent Campus Cruiser rides.</p>
    </section>

    <section class="bookings-list">
        <?php if ($result && $result->num_rows > 0): ?>
            <table class="bookings-table">
                <thead>
                <tr>
                    <th>Booking #</th>
                    <th>Vehicle</th>
                    <th>Pickup</th>
                    <th>Return</th>
                    <th>Trip Type</th> <!-- <-- NEW COLUMN -->
                    <th>Total Paid</th>
                    <th>Created</th>
                </tr>
                </thead>
                <tbody>
                <?php while ($row = $result->fetch_assoc()): ?>
                    <tr>
                        <td><?php echo htmlspecialchars($row['id']); ?></td>
                        <td><?php echo htmlspecialchars($row['vehicle_name']); ?></td>

                        <td>
                            <?php
                            echo htmlspecialchars($row['pickup_location']) . "<br>";
                            echo htmlspecialchars($row['pickup_datetime']);
                            ?>
                        </td>

                        <td>
                            <?php
                            echo htmlspecialchars($row['dropoff_location']) . "<br>";
                            echo htmlspecialchars($row['return_datetime']);
                            ?>
                        </td>

                        <!-- NEW TRIP TYPE COLUMN -->
                        <td>
                            <?php
                            // Show readable format
                            if (!empty($row['trip_type'])) {
                                echo ($row['trip_type'] === "one-way")
                                    ? "One-Way Trip"
                                    : "Round Trip";
                            } else {
                                echo "Round Trip"; // default for older bookings
                            }
                            ?>
                        </td>

                        <td>$<?php echo number_format($row['total_price'], 2); ?></td>
                        <td><?php echo htmlspecialchars($row['created_at']); ?></td>
                    </tr>
                <?php endwhile; ?>
                </tbody>
            </table>
        <?php else: ?>
            <p>No bookings found yet. Go book your first ride!</p>
        <?php endif; ?>
    </section>
</main>

</body>
</html>

<?php
$conn->close();
?>
