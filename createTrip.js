const menuBtn = document.querySelector('.menu-icon');
const links = document.querySelector('.nav-link-container');
menuBtn?.addEventListener('click', () => links?.classList.toggle('open'));
links?.querySelectorAll('.nav-link').forEach(a =>
    a.addEventListener('click', () => links.classList.remove('open'))
);


function safeDate(d) {
    if (!d || d.length < 8) return "";   
    return d;
}

function safeTime(t) {
    if (!t || !t.includes(":")) return ""; 
    return t;
}

function getUrlParams() {
    const params = new URLSearchParams(window.location.search);

    return {
        vehicleName: params.get('vehicle') || 'Toyota Camry',
        vehicleType: params.get('type') || 'sedan',
        vehicleSeats: params.get('seats') || '5',
        vehiclePrice: params.get('price') || '45',
        vehicleFeatures: params.get('features') || 'Bluetooth,Backup Camera,USB',
        departureAddress: params.get('departure-address') || '',
        returnAddress: params.get('return-address') || '',
        returnPickup: params.get('return-pickup') || '',
        returnDropoff: params.get('return-dropoff') || '',
        departureDate: safeDate(params.get('departure-date')),
        departureTime: safeTime(params.get('departure-time')),
        returnDate: safeDate(params.get('return-date')),
        returnTime: safeTime(params.get('return-time')),
        totalSeats: params.get('total-seats') || '4'
    };
}


function getVehicleIcon(type) {
    const icons = {
        sedan: '🚗',
        suv: '🚙',
        van: '🚐',
        truck: '🛻'
    };
    return icons[type.toLowerCase()] || '🚗';
}


function calculateDays(startDate, endDate) {
    if (!startDate || !endDate) return 1;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = Math.abs(end - start);
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) || 1;
}


function formatDate(dateString) {
    if (!dateString) return 'Not selected';
    const d = new Date(dateString + "T00:00:00");
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatTime(t) {
    if (!t) return "";
    const [h, m] = t.split(':');
    const hour = parseInt(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const display = hour % 12 || 12;
    return `${display}:${m} ${ampm}`;
}


function calculateCostBreakdown() {
    const params = getUrlParams();
    const hasVehicle = params.vehicleName !== 'Toyota Camry' || window.location.search.includes('vehicle=');

    const costDiv = document.querySelector('.cost-breakdown');
    const seatsRow = document.getElementById('total-seats')?.closest('.form-row');

    if (!hasVehicle) {
        if (costDiv) costDiv.style.display = "none";
        if (seatsRow) seatsRow.style.display = "none";
        document.getElementById('total-seats')?.removeAttribute('required');
        document.getElementById('price-per-person')?.removeAttribute('required');
        return;
    }

    if (costDiv) costDiv.style.display = "block";
    if (seatsRow) seatsRow.style.display = "grid";

    document.getElementById('total-seats')?.setAttribute('required', 'required');
    document.getElementById('price-per-person')?.setAttribute('required', 'required');

    const dailyRate = parseFloat(params.vehiclePrice) || 45;
    const numDays = calculateDays(params.departureDate, params.returnDate);
    const seats = parseInt(document.getElementById('total-seats').value) || 4;

    const totalCost = dailyRate * numDays;
    const suggested = Math.ceil(totalCost / seats);

    document.getElementById('breakdown-rental').textContent = `$${totalCost.toFixed(2)}`;
    document.getElementById('breakdown-passengers').textContent = seats;
    document.getElementById('breakdown-suggested').textContent = `$${suggested.toFixed(2)}`;
    document.getElementById('price-per-person').value = suggested.toFixed(2);

    updateSidebar();
}


function initializeForm() {
    const params = getUrlParams();

    const hasVehicle = params.vehicleName !== 'Toyota Camry' || window.location.search.includes('vehicle=');
    const vehicleSection = document.getElementById('vehicle-route-section');

    if (hasVehicle) {
        vehicleSection.style.display = "block";

        document.getElementById('preview-icon').textContent = getVehicleIcon(params.vehicleType);
        document.getElementById('preview-title').textContent = params.vehicleName;

        const typeFormatted = params.vehicleType.charAt(0).toUpperCase() + params.vehicleType.slice(1);
        document.getElementById('preview-specs').textContent =
            `${typeFormatted} • ${params.vehicleSeats} Seats`;

        document.getElementById('preview-price').textContent = params.vehiclePrice;

        document.getElementById('total-seats').setAttribute('max', params.vehicleSeats);
    } else {
        vehicleSection.style.display = "none";
    }

    if (params.departureAddress) {
        document.getElementById('summary-departure-section').style.display = "flex";
        document.getElementById('summary-departure').textContent = params.departureAddress;
    }

    if (params.returnAddress) {
        document.getElementById('summary-destination-section').style.display = "flex";
        document.getElementById('summary-destination').textContent = params.returnAddress;
    }

    
    const returnPickupValue =
    params.returnPickup || 
    params.returnAddress || 
    params.departureAddress;

    const returnDropoffValue =
    params.returnDropoff || 
    params.departureAddress || 
    params.returnAddress;


    document.getElementById('summary-return-pickup').textContent = returnPickupValue;
    document.getElementById('summary-return-dropoff').textContent = returnDropoffValue;

    document.getElementById('summary-return-pickup-section').style.display = "flex";
    document.getElementById('summary-return-dropoff-section').style.display = "flex";

    

    if (params.departureDate) {
        document.getElementById('summary-dep-date').textContent = formatDate(params.departureDate);
    }

    if (params.departureTime) {
        document.getElementById('summary-dep-time-section').style.display = "flex";
        document.getElementById('summary-dep-time').textContent = formatTime(params.departureTime);
    }

    if (params.returnDate) {
        document.getElementById('summary-ret-date').textContent = formatDate(params.returnDate);
    }

    if (params.returnTime) {
        document.getElementById('summary-ret-time-section').style.display = "flex";
        document.getElementById('summary-ret-time').textContent = formatTime(params.returnTime);
    }

    document.getElementById('total-seats').value =
        params.totalSeats || params.vehicleSeats || 4;

    document.getElementById('summary-seats').textContent =
        document.getElementById('total-seats').value;

    calculateCostBreakdown();
}

initializeForm();

const seatsInput = document.getElementById('total-seats');
document.getElementById('seats-decrease').addEventListener('click', () => {
    let v = parseInt(seatsInput.value) || 2;
    if (v > 2) {
        seatsInput.value = v - 1;
        calculateCostBreakdown();
        updateSidebar();
    }
});
document.getElementById('seats-increase').addEventListener('click', () => {
    let v = parseInt(seatsInput.value) || 2;
    const max = parseInt(seatsInput.getAttribute('max')) || 15;
    if (v < max) {
        seatsInput.value = v + 1;
        calculateCostBreakdown();
        updateSidebar();
    }
});


function updateSidebar() {
    const params = getUrlParams();

    const eventType = document.getElementById('event-type').value;
    if (eventType) {
        const f = eventType.charAt(0).toUpperCase() + eventType.slice(1);
        document.getElementById('summary-trip-type').textContent = f;
    }

    document.getElementById('summary-price').textContent =
        `$${parseFloat(document.getElementById('price-per-person').value).toFixed(2)}`;

    document.getElementById('summary-seats').textContent =
        document.getElementById('total-seats').value;
}


const eventTags = document.querySelectorAll('.tag');
const eventTypeInput = document.getElementById('event-type');
eventTags.forEach(tag => {
    tag.addEventListener('click', () => {
        eventTags.forEach(t => t.classList.remove('active'));
        tag.classList.add('active');
        eventTypeInput.value = tag.dataset.type;
        updateSidebar();
    });
});

document.getElementById('create-trip-form').addEventListener('submit', function (e) {
    e.preventDefault();

    if (!eventTypeInput.value) {
        alert("Please select an event type.");
        return;
    }

    const params = getUrlParams();

    const formData = {
        trip_name: document.getElementById('trip-name').value,
        event_type: eventTypeInput.value,
        description: document.getElementById('description').value,
        departure_date: params.departureDate,
        departure_time: params.departureTime,
        return_date: params.returnDate,
        return_time: params.returnTime,
        departure_address: params.departureAddress || "",
        destination: params.returnAddress || "",
        return_pickup: params.returnPickup || params.returnAddress || params.departureAddress,
        return_dropoff: params.returnDropoff || params.departureAddress || params.returnAddress,
        total_seats: document.getElementById('total-seats').value,
        price_per_person: document.getElementById('price-per-person').value,
        public_trip: document.getElementById('public-trip').checked ? "1" : "0",
        vehicle_name: params.vehicleName,
        vehicle_type: params.vehicleType,
        vehicle_seats: params.vehicleSeats,
        vehicle_price: params.vehiclePrice
    };


    const body = new URLSearchParams();
    for (const [k, v] of Object.entries(formData)) {
        if (v !== null && v !== undefined) body.append(k, v);
    }

    fetch("create_group_trip.php", {
        method: "POST",
        body
    })
        .then(res => res.json())
        .then(data => {
            if (!data.success) {
                alert("Error creating trip: " + data.message);
                return;
            }
            showSuccessState(formData, data.join_url);
        })
        .catch(err => {
            console.error("Network error:", err);
            alert("Failed to create trip.");
        });
});


function showSuccessState(tripData, joinUrl) {
    document.getElementById('create-trip-form').style.display = "none";

    document.querySelector('.page-header h1').textContent = "Trip Created Successfully!";
    document.querySelector('.page-header p').textContent = "Share this link with your friends";

    const formWrapper = document.querySelector('.form-wrapper');

    const successDiv = document.createElement('div');
    successDiv.className = "success-section";

    successDiv.innerHTML = `
        <div class="success-card">
            <div class="success-icon-large">✓</div>
            <h2>${tripData.trip_name}</h2>

            <div class="trip-link-section">
                <h3>Share Your Trip</h3>
                <div class="link-container">
                    <input id="trip-link" type="text" readonly value="${joinUrl}">
                    <button type="button" class="copy-link-btn" onclick="copyTripLink()">Copy Link</button>
                </div>
            </div>

            <button class="primary-btn" type="button" onclick="location.href='browse-trips.html'">View Trips</button>
            <button class="secondary-btn" type="button" onclick="location.href='home.html'">Home</button>
        </div>
    `;

    formWrapper.appendChild(successDiv);
}


function copyTripLink() {
    const link = document.getElementById('trip-link');
    link.select();
    navigator.clipboard.writeText(link.value).then(() => {
        const btn = document.querySelector('.copy-link-btn');
        btn.textContent = "✓ Copied!";
        setTimeout(() => btn.textContent = "Copy Link", 2000);
    });
}
