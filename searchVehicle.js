function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        departureAddress: params.get('departure-address') || 'VSU Multi-Purpose Center',
        returnAddress: params.get('return-address') || 'Richmond, VA',
        returnPickup: params.get('return-pickup') || '',
        returnDropoff: params.get('return-dropoff') || '',
        departureDate: params.get('departure-date') || '',
        departureTime: params.get('departure-time') || '',
        returnDate: params.get('return-date') || '',
        returnTime: params.get('return-time') || '',
        seats: params.get('seats') || '4'
    };
}

function formatDate(dateString) {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString + 'T00:00:00');
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function formatTime(timeString) {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

function initializeSearchSummary() {
    const params = getUrlParams();

    const departureAddress = params.departureAddress || 'VSU Multi-Purpose Center';
    const baseReturnAddress = params.returnAddress || departureAddress;

    const returnPickup = params.returnPickup || baseReturnAddress;

    const returnDropoff = params.returnDropoff || departureAddress;

    const outboundRouteText =
        `Leaving from: ${departureAddress} → Going to: ${baseReturnAddress}`;
    document.getElementById('summary-route').textContent = outboundRouteText;

    const returnRouteText =
        `Leaving from: ${returnPickup} → Return to: ${returnDropoff}`;
    const returnRouteEl = document.getElementById('summary-return-route');
    if (returnRouteEl) {
        returnRouteEl.textContent = returnRouteText;
    }

    document.getElementById('summary-return-pickup').textContent = returnPickup;
    document.getElementById('summary-return-dropoff').textContent = returnDropoff;

    const departureDisplay = params.departureDate
        ? `${formatDate(params.departureDate)}${params.departureTime ? ' at ' + formatTime(params.departureTime) : ''}`
        : 'Not specified';
    document.getElementById('summary-departure').textContent = departureDisplay;

    const returnDisplay = params.returnDate
        ? `${formatDate(params.returnDate)}${params.returnTime ? ' at ' + formatTime(params.returnTime) : ''}`
        : 'Not specified';
    document.getElementById('summary-return').textContent = returnDisplay;

    // ---- SEATS ----
    document.getElementById('summary-seats').textContent =
        `${params.seats} ${parseInt(params.seats) === 1 ? 'passenger' : 'passengers'}`;

    // ---- EDIT FORM FIELDS ----
    document.getElementById('edit-departure-address').value = departureAddress;
    document.getElementById('edit-return-address').value = baseReturnAddress;
    document.getElementById('edit-departure-date').value = params.departureDate;
    document.getElementById('edit-departure-time').value = params.departureTime;
    document.getElementById('edit-return-date').value = params.returnDate;
    document.getElementById('edit-return-time').value = params.returnTime;
    document.getElementById('edit-seats').value = params.seats;
    document.getElementById('edit-return-pickup').value = returnPickup;
    document.getElementById('edit-return-dropoff').value = returnDropoff;
}


document.getElementById('edit-search-btn').addEventListener('click', function() {
    document.getElementById('summary-content').classList.add('hidden');
    document.getElementById('summary-edit-form').classList.remove('hidden');
    this.textContent = 'Editing...';
    this.disabled = true;
});

document.getElementById('cancel-edit-btn').addEventListener('click', function() {
    document.getElementById('summary-content').classList.remove('hidden');
    document.getElementById('summary-edit-form').classList.add('hidden');
    const editBtn = document.getElementById('edit-search-btn');
    editBtn.textContent = 'Edit Search';
    editBtn.disabled = false;
});

document.getElementById('save-search-btn').addEventListener('click', function() {
    const newParams = {
        departureAddress: document.getElementById('edit-departure-address').value,
        returnAddress: document.getElementById('edit-return-address').value,
        returnPickup: document.getElementById('edit-return-pickup')?.value || '',
        returnDropoff: document.getElementById('edit-return-dropoff')?.value || '',
        departureDate: document.getElementById('edit-departure-date').value,
        departureTime: document.getElementById('edit-departure-time').value,
        returnDate: document.getElementById('edit-return-date').value,
        returnTime: document.getElementById('edit-return-time').value,
        seats: document.getElementById('edit-seats').value
    };
    
    const outboundRouteText = `Leaving from: ${newParams.departureAddress} → Going to: ${newParams.returnAddress}`;
    document.getElementById('summary-route').textContent = outboundRouteText;

    const returnRouteText = `Leaving from: ${newParams.returnAddress} → Return to: ${newParams.departureAddress}`;
    const returnRouteEl = document.getElementById('summary-return-route');
    if (returnRouteEl) {
        returnRouteEl.textContent = returnRouteText;
    }

    document.getElementById('summary-return-pickup').textContent = newParams.returnPickup;
    document.getElementById('summary-return-dropoff').textContent = newParams.returnDropoff;

    const departureDisplay = newParams.departureDate 
        ? `${formatDate(newParams.departureDate)}${newParams.departureTime ? ' at ' + formatTime(newParams.departureTime) : ''}`
        : 'Not specified';
    document.getElementById('summary-departure').textContent = departureDisplay;
    
    const returnDisplay = newParams.returnDate 
        ? `${formatDate(newParams.returnDate)}${newParams.returnTime ? ' at ' + formatTime(newParams.returnTime) : ''}`
        : 'Not specified';
    document.getElementById('summary-return').textContent = returnDisplay;
    
    document.getElementById('summary-seats').textContent = 
        `${newParams.seats} ${parseInt(newParams.seats) === 1 ? 'passenger' : 'passengers'}`;
    
    const url = new URL(window.location);
    url.searchParams.set('departure-address', newParams.departureAddress);
    url.searchParams.set('return-address', newParams.returnAddress);
    url.searchParams.set('return-pickup', newParams.returnPickup);
    url.searchParams.set('return-dropoff', newParams.returnDropoff);
    url.searchParams.set('departure-date', newParams.departureDate);
    url.searchParams.set('departure-time', newParams.departureTime);
    url.searchParams.set('return-date', newParams.returnDate);
    url.searchParams.set('return-time', newParams.returnTime);
    url.searchParams.set('seats', newParams.seats);

    window.history.pushState({}, '', url);
    
    document.getElementById('summary-content').classList.remove('hidden');
    document.getElementById('summary-edit-form').classList.add('hidden');
    const editBtn = document.getElementById('edit-search-btn');
    editBtn.textContent = 'Edit Search';
    editBtn.disabled = false;
    
    filterVehicles();
});

initializeSearchSummary();


const vehicleCards = Array.from(document.querySelectorAll('.vehicle-card'));
const resultCountElement = document.getElementById('result-count');
const vehiclesGrid = document.getElementById('vehicles-grid');

function updateResultCount() {
    const visibleCards = vehicleCards.filter(card => !card.classList.contains('hidden')).length;
    resultCountElement.textContent = visibleCards;
}

function filterVehicles() {
    const typeCheckboxes = document.querySelectorAll('.filter-checkbox[value="sedan"], .filter-checkbox[value="suv"], .filter-checkbox[value="van"], .filter-checkbox[value="truck"]');
    const selectedTypes = Array.from(typeCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);

    const minSeats = parseInt(document.getElementById('filter-seats').value) || 1;
    
    const minPrice = parseFloat(document.getElementById('min-price').value) || 0;
    const maxPrice = parseFloat(document.getElementById('max-price').value) || Infinity;

    const featureCheckboxes = document.querySelectorAll('.filter-checkbox[value="bluetooth"], .filter-checkbox[value="gps"], .filter-checkbox[value="backup-camera"], .filter-checkbox[value="usb-charging"]');
    const selectedFeatures = Array.from(featureCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);

    vehicleCards.forEach(card => {
        const cardType = card.dataset.type;
        const cardSeats = parseInt(card.dataset.seats);
        const cardPrice = parseFloat(card.dataset.price);

        const cardFeatureBadges = card.querySelectorAll('.feature-badge');
        const cardFeatures = Array.from(cardFeatureBadges).map(badge => {
            const text = badge.textContent.toLowerCase().trim();
            if (text === 'bluetooth') return 'bluetooth';
            if (text === 'gps') return 'gps';
            if (text.includes('backup')) return 'backup-camera';
            if (text === 'usb') return 'usb-charging';
            return null;
        }).filter(f => f !== null);

        const typeMatch = selectedTypes.length === 0 || selectedTypes.includes(cardType);
        const seatsMatch = cardSeats >= minSeats;
        const priceMatch = cardPrice >= minPrice && cardPrice <= maxPrice;
        const featuresMatch = selectedFeatures.length === 0 || 
            selectedFeatures.every(feature => cardFeatures.includes(feature));

        if (typeMatch && seatsMatch && priceMatch && featuresMatch) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });

    updateResultCount();
}

function sortVehicles(sortBy) {
    const cardsToSort = [...vehicleCards];

    cardsToSort.sort((a, b) => {
        const aPrice = parseFloat(a.dataset.price);
        const bPrice = parseFloat(b.dataset.price);
        const aSeats = parseInt(a.dataset.seats);
        const bSeats = parseInt(b.dataset.seats);

        switch (sortBy) {
            case 'price-low':
                return aPrice - bPrice;
            case 'price-high':
                return bPrice - aPrice;
            case 'seats':
                return bSeats - aSeats;
            case 'recommended':
            default:
                return 0;
        }
    });

    vehiclesGrid.innerHTML = '';
    cardsToSort.forEach(card => vehiclesGrid.appendChild(card));
}

document.querySelector('.clear-filters-btn').addEventListener('click', function(e) {
    e.preventDefault();
    
    document.querySelectorAll('.filter-checkbox').forEach(cb => cb.checked = false);
    document.getElementById('filter-seats').value = '1';
    document.getElementById('min-price').value = '';
    document.getElementById('max-price').value = '';

    vehicleCards.forEach(card => card.classList.remove('hidden'));
    updateResultCount();
});

document.getElementById('sort-select').addEventListener('change', function(e) {
    sortVehicles(e.target.value);
});

document.querySelectorAll('.filter-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', filterVehicles);
});

document.getElementById('filter-seats').addEventListener('change', filterVehicles);

document.getElementById('min-price').addEventListener('input', filterVehicles);
document.getElementById('max-price').addEventListener('input', filterVehicles);

document.getElementById('min-price').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        this.blur(); 
    }
});

document.getElementById('max-price').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        this.blur(); 
    }
});

document.querySelectorAll('.book-btn').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        const card = this.closest('.vehicle-card');
        const vehicleName = card.querySelector('.vehicle-title').textContent;
        const vehiclePrice = card.querySelector('.price-amount').textContent.replace('$', '');
        const vehicleType = card.dataset.type;
        const vehicleSeats = card.dataset.seats;
        
        const featureBadges = card.querySelectorAll('.feature-badge');
        const features = Array.from(featureBadges).map(badge => badge.textContent.trim()).join(',');
        
        const searchParams = getUrlParams();
        
        const url = 'bookingReview.html' +
            '?vehicle=' + encodeURIComponent(vehicleName) +
            '&type=' + encodeURIComponent(vehicleType) +
            '&seats=' + encodeURIComponent(vehicleSeats) +
            '&price=' + encodeURIComponent(vehiclePrice) +
            '&features=' + encodeURIComponent(features) +
            '&departure-address=' + encodeURIComponent(searchParams.departureAddress) +
            '&return-address=' + encodeURIComponent(searchParams.returnAddress) +
            '&return-pickup=' + encodeURIComponent(searchParams.returnPickup || '') +
            '&return-dropoff=' + encodeURIComponent(searchParams.returnDropoff || '') +
            '&departure-date=' + encodeURIComponent(searchParams.departureDate) +
            '&departure-time=' + encodeURIComponent(searchParams.departureTime) +
            '&return-date=' + encodeURIComponent(searchParams.returnDate) +
            '&return-time=' + encodeURIComponent(searchParams.returnTime) +
            '&passengers=' + encodeURIComponent(searchParams.seats);
        
       
        window.location.href = url;
    });
});


const today = new Date().toISOString().split('T')[0];
const editDepartureDate = document.getElementById('edit-departure-date');
const editReturnDate = document.getElementById('edit-return-date');

if (editDepartureDate) {
    editDepartureDate.setAttribute('min', today);
}

if (editReturnDate) {
    editReturnDate.setAttribute('min', today);
}

if (editDepartureDate) {
    editDepartureDate.addEventListener('change', function() {
        const departureDate = this.value;
        if (editReturnDate) {
            editReturnDate.setAttribute('min', departureDate);
        }
    });
}

updateResultCount();
