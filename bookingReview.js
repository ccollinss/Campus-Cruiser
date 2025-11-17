// Mobile menu functionality
const menuBtn = document.querySelector('.menu-icon');
const links = document.querySelector('.nav-link-container');
menuBtn?.addEventListener('click', () => links?.classList.toggle('open'));
links?.querySelectorAll('.nav-link').forEach(a =>
    a.addEventListener('click', () => links.classList.remove('open'))
);

// ===== BOOKING CONFIRMATION FUNCTIONALITY =====

// Get URL parameters
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        vehicleName: params.get('vehicle') || 'Toyota Camry',
        vehicleType: params.get('type') || 'sedan',
        vehicleSeats: params.get('seats') || '5',
        vehiclePrice: params.get('price') || '45',
        vehicleFeatures: params.get('features') || 'Bluetooth,Backup Camera,USB',
        departureAddress: params.get('departure-address') || 'VSU Multi-Purpose Center',
        returnAddress: params.get('return-address') || 'VSU Multi-Purpose Center',
        departureDate: params.get('departure-date') || '',
        departureTime: params.get('departure-time') || '',
        returnDate: params.get('return-date') || '',
        returnTime: params.get('return-time') || '',
        passengers: params.get('passengers') || '4'
    };
}

// Format date for display
function formatDate(dateString) {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString + 'T00:00:00');
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Format time for display
function formatTime(timeString) {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

// Get vehicle icon based on type
function getVehicleIcon(type) {
    const icons = {
        'sedan': '🚗',
        'suv': '🚙',
        'van': '🚐',
        'truck': '🛻'
    };
    return icons[type.toLowerCase()] || '🚗';
}

// Calculate number of days between two dates
function calculateDays(startDate, endDate) {
    if (!startDate || !endDate) return 1;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1;
}

// Initialize booking confirmation page
function initializeConfirmation() {
    const params = getUrlParams();
    
    // Set vehicle details
    document.getElementById('vehicle-icon').textContent = getVehicleIcon(params.vehicleType);
    document.getElementById('vehicle-name').textContent = params.vehicleName;
    
    // Format vehicle type
    const typeFormatted = params.vehicleType.charAt(0).toUpperCase() + params.vehicleType.slice(1);
    document.getElementById('vehicle-specs').textContent = `${typeFormatted} • ${params.vehicleSeats} Seats`;
    
    // Set features
    const featuresContainer = document.getElementById('features-display');
    featuresContainer.innerHTML = '';
    const features = params.vehicleFeatures.split(',');
    features.forEach(feature => {
        const tag = document.createElement('span');
        tag.className = 'feature-tag';
        tag.textContent = feature.trim();
        featuresContainer.appendChild(tag);
    });
    
    // Set trip details
    document.getElementById('pickup-location').textContent = params.departureAddress;
    document.getElementById('dropoff-location').textContent = params.returnAddress;
    
    const pickupDisplay = params.departureDate 
        ? `${formatDate(params.departureDate)}${params.departureTime ? ' at ' + formatTime(params.departureTime) : ''}`
        : 'Not specified';
    document.getElementById('pickup-datetime').textContent = pickupDisplay;
    
    const returnDisplay = params.returnDate 
        ? `${formatDate(params.returnDate)}${params.returnTime ? ' at ' + formatTime(params.returnTime) : ''}`
        : 'Not specified';
    document.getElementById('return-datetime').textContent = returnDisplay;
    
    document.getElementById('passengers').textContent = 
        `${params.passengers} ${parseInt(params.passengers) === 1 ? 'passenger' : 'passengers'}`;
    
    // Calculate pricing
    const dailyRate = parseFloat(params.vehiclePrice);
    const numDays = calculateDays(params.departureDate, params.returnDate);
    const subtotal = dailyRate * numDays;
    const serviceFee = 5.00;
    const tax = subtotal * 0.07; // 7% tax
    const total = subtotal + serviceFee + tax;
    
    // Set price breakdown
    document.getElementById('daily-rate').textContent = `$${dailyRate.toFixed(2)}`;
    document.getElementById('num-days').textContent = numDays;
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('service-fee').textContent = `$${serviceFee.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

// Initialize on page load
initializeConfirmation();

// ===== CREATE GROUP TRIP BUTTON =====
document.getElementById('create-trip-btn').addEventListener('click', function() {
    const params = getUrlParams();
    
    // Navigate to create trip page with all vehicle and trip data
    const url = 'createTrip.html' +
        '?vehicle=' + encodeURIComponent(params.vehicleName) +
        '&type=' + encodeURIComponent(params.vehicleType) +
        '&seats=' + encodeURIComponent(params.vehicleSeats) +
        '&price=' + encodeURIComponent(params.vehiclePrice) +
        '&features=' + encodeURIComponent(params.vehicleFeatures) +
        '&departure-address=' + encodeURIComponent(params.departureAddress) +
        '&return-address=' + encodeURIComponent(params.returnAddress) +
        '&departure-date=' + encodeURIComponent(params.departureDate) +
        '&departure-time=' + encodeURIComponent(params.departureTime) +
        '&return-date=' + encodeURIComponent(params.returnDate) +
        '&return-time=' + encodeURIComponent(params.returnTime) +
        '&total-seats=' + encodeURIComponent(params.passengers);
    
    window.location.href = url;
});
