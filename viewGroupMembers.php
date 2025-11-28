<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require 'db_config.php';

$trip_id = $_GET['trip_id'] ?? '';

if ($trip_id === '') {
    die("Missing trip ID.");
}

// Fetch trip info
$trip_sql = "SELECT trip_name, trip_code 
             FROM group_trips 
             WHERE id = ?";
$trip_stmt = $conn->prepare($trip_sql);

if (!$trip_stmt) {
    die("Trip prepare failed: " . $conn->error);
}

$trip_stmt->bind_param("i", $trip_id);
$trip_stmt->execute();
$trip_result = $trip_stmt->get_result();
$trip = $trip_result->fetch_assoc();
$trip_stmt->close();

if (!$trip) {
    die("Trip not found.");
}

$member_sql = "SELECT * FROM group_trip_members 
               WHERE trip_id = ?
               ORDER BY joined_at DESC";
$member_stmt = $conn->prepare($member_sql);

if (!$member_stmt) {
    die("Member prepare failed: " . $conn->error);
}

$member_stmt->bind_param("i", $trip_id);
$member_stmt->execute();
$members = $member_stmt->get_result();
$member_stmt->close();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Group Trip Members</title>
    <link rel="stylesheet" href="bookings.css"> <!-- Reuse your table styles -->
    <style>
        .back-btn {
            display: inline-block;
            margin-top: 20px;
            background: #2563eb;
            padding: 10px 16px;
            border-radius: 6px;
            color: #fff;
            text-decoration: none;
            font-size: 14px;
        }
        .back-btn:hover { background: #1e4bb8; }

        .page-header h1 {
            margin-bottom: 4px;
        }
        .trip-code {
            font-size: 14px;
            color: #666;
        }
    </style>
</head>

<body>
<header>
    <nav class="navbar">
        <div class="img-container">
            <img src="campusCruiserLogo.png" class="nav-logo"
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

<main class="bookings-main">

    <section class="page-header">
        <h1>Group Trip: <?php echo htmlspecialchars($trip['trip_name']); ?></h1>
        <div class="trip-code">Trip Code: <?php echo htmlspecialchars($trip['trip_code']); ?></div>
        <p>Members who joined this trip.</p>
    </section>

    <section class="bookings-list">
        <?php if ($members && $members->num_rows > 0): ?>

            <table class="bookings-table">
                <thead>
                <tr>
                    <th>#</th>
                    <th>Student Name</th>
                    <th>Student ID</th>
                    <th>Amount Paid</th>
                    <th>Joined At</th>
                </tr>
                </thead>

                <tbody>
                <?php while ($m = $members->fetch_assoc()): ?>
                    <tr>
                        <td><?php echo htmlspecialchars($m['id']); ?></td>
                        <td><?php echo htmlspecialchars($m['student_name']); ?></td>
                        <td><?php echo htmlspecialchars($m['student_id']); ?></td>
                        <td>$<?php echo number_format($m['amount_paid'], 2); ?></td>
                        <td><?php echo htmlspecialchars($m['joined_at']); ?></td>
                    </tr>
                <?php endwhile; ?>
                </tbody>
            </table>

        <?php else: ?>
            <p>No members have joined this trip yet.</p>
        <?php endif; ?>

        <a href="bookings.php" class="back-btn">← Back to My Bookings</a>
    </section>

</main>

</body>
</html>

<?php
$conn->close();
?>
