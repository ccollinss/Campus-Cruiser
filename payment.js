// Read URL parameters
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);

    return {
        vehicle: params.get("vehicle") || "Vehicle",
        price: params.get("price") || "0",
        passengers: params.get("passengers") || "1",
        pickup: params.get("pickup") || "Unknown",
        dropoff: params.get("dropoff") || "Unknown",
        depDate: params.get("departure-date") || "",
        returnDate: params.get("return-date") || "",
        depTime: params.get("departure-time") || "",
        returnTime: params.get("return-time") || ""
    };
}

// Fill summary box
function populateSummary() {
    const p = getUrlParams();

    document.getElementById("summary-vehicle").textContent = p.vehicle;
    document.getElementById("summary-pickup").textContent =
        `${p.pickup} • ${p.depDate} ${p.depTime}`;
    document.getElementById("summary-return").textContent =
        `${p.dropoff} • ${p.returnDate} ${p.returnTime}`;
    document.getElementById("summary-price").textContent =
        `$${parseFloat(p.price).toFixed(2)}`;
}

populateSummary();

// Payment form submit
document.getElementById("payment-form").addEventListener("submit", function (e) {
    e.preventDefault();

    alert("Payment Successful! 🎉 Your booking is confirmed.");

    // TODO: redirect to success page later
});
