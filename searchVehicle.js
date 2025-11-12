// -- search summary function //

// get url parameters from home page
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        departureAddress: params.get('departure-address') || 'VSU Multi-Purpose Center',
        returnAddress: params.get('return-address') || 'Richmond, VA',
        departureDate: params.get('departure-date') || '',
        departureTime: params.get('departure-time') || '',
        returnDate: params.get('return-date') || '',
        returnTime: params.get('return-time') || '',
        seats: params.get('seats') || '4'
    };
}

// format date
function formatDate(dateString) {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString + 'T00:00:00');
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// format time
function formatTime(timeString) {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

// initialize search summary
function initializeSearchSummary() {
    const params = getUrlParams();
    
    // update summary display
    document.getElementById('summary-route').textContent = 
        `${params.departureAddress} → ${params.returnAddress}`;
    
    const departureDisplay = params.departureDate 
        ? `${formatDate(params.departureDate)}${params.departureTime ? ' at ' + formatTime(params.departureTime) : ''}`
        : 'Not specified';
    document.getElementById('summary-departure').textContent = departureDisplay;
    
    const returnDisplay = params.returnDate 
        ? `${formatDate(params.returnDate)}${params.returnTime ? ' at ' + formatTime(params.returnTime) : ''}`
        : 'Not specified';
    document.getElementById('summary-return').textContent = returnDisplay;
    
    document.getElementById('summary-seats').textContent = 
        `${params.seats} ${parseInt(params.seats) === 1 ? 'passenger' : 'passengers'}`;
    
    // pre-fill edit form fields
    document.getElementById('edit-departure-address').value = params.departureAddress;
    document.getElementById('edit-return-address').value = params.returnAddress;
    document.getElementById('edit-departure-date').value = params.departureDate;
    document.getElementById('edit-departure-time').value = params.departureTime;
    document.getElementById('edit-return-date').value = params.returnDate;
    document.getElementById('edit-return-time').value = params.returnTime;
    document.getElementById('edit-seats').value = params.seats;
}

// edit search button
document.getElementById('edit-search-btn').addEventListener('click', function() {
    document.getElementById('summary-content').classList.add('hidden');
    document.getElementById('summary-edit-form').classList.remove('hidden');
    this.textContent = 'Editing...';
    this.disabled = true;
});

// cancel edit button
document.getElementById('cancel-edit-btn').addEventListener('click', function() {
    document.getElementById('summary-content').classList.remove('hidden');
    document.getElementById('summary-edit-form').classList.add('hidden');
    const editBtn = document.getElementById('edit-search-btn');
    editBtn.textContent = 'Edit Search';
    editBtn.disabled = false;
});

// save search button
document.getElementById('save-search-btn').addEventListener('click', function() {
    const newParams = {
        departureAddress: document.getElementById('edit-departure-address').value,
        returnAddress: document.getElementById('edit-return-address').value,
        departureDate: document.getElementById('edit-departure-date').value,
        departureTime: document.getElementById('edit-departure-time').value,
        returnDate: document.getElementById('edit-return-date').value,
        returnTime: document.getElementById('edit-return-time').value,
        seats: document.getElementById('edit-seats').value
    };
    
    // update display
    document.getElementById('summary-route').textContent = 
        `${newParams.departureAddress} → ${newParams.returnAddress}`;
    
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
    
    // update URL without reloading
    const url = new URL(window.location);
    url.searchParams.set('departure-address', newParams.departureAddress);
    url.searchParams.set('return-address', newParams.returnAddress);
    url.searchParams.set('departure-date', newParams.departureDate);
    url.searchParams.set('departure-time', newParams.departureTime);
    url.searchParams.set('return-date', newParams.returnDate);
    url.searchParams.set('return-time', newParams.returnTime);
    url.searchParams.set('seats', newParams.seats);
    window.history.pushState({}, '', url);
    
    // hide edit form
    document.getElementById('summary-content').classList.remove('hidden');
    document.getElementById('summary-edit-form').classList.add('hidden');
    const editBtn = document.getElementById('edit-search-btn');
    editBtn.textContent = 'Edit Search';
    editBtn.disabled = false;
    
    // re-filter vehicles based on new criteria
    filterVehicles();
});

// initialize on page load
initializeSearchSummary();

// --- vehicle filtering and sorting --- //

// get all vehicle cards
const vehicleCards = Array.from(document.querySelectorAll('.vehicle-card'));
const resultCountElement = document.getElementById('result-count');
const vehiclesGrid = document.getElementById('vehicles-grid');

// function to update result count
function updateResultCount() {
    const visibleCards = vehicleCards.filter(card => !card.classList.contains('hidden')).length;
    resultCountElement.textContent = visibleCards;
}

// filtering function
function filterVehicles() {
    // get selected vehicle types
    const typeCheckboxes = document.querySelectorAll('.filter-checkbox[value="sedan"], .filter-checkbox[value="suv"], .filter-checkbox[value="van"], .filter-checkbox[value="truck"]');
    const selectedTypes = Array.from(typeCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);

    // get seats requirement
    const minSeats = parseInt(document.getElementById('filter-seats').value) || 1;
    
    // get price range
    const minPrice = parseFloat(document.getElementById('min-price').value) || 0;
    const maxPrice = parseFloat(document.getElementById('max-price').value) || Infinity;

    // get selected features
    const featureCheckboxes = document.querySelectorAll('.filter-checkbox[value="bluetooth"], .filter-checkbox[value="gps"], .filter-checkbox[value="backup-camera"], .filter-checkbox[value="usb-charging"]');
    const selectedFeatures = Array.from(featureCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);

    vehicleCards.forEach(card => {
        const cardType = card.dataset.type;
        const cardSeats = parseInt(card.dataset.seats);
        const cardPrice = parseFloat(card.dataset.price);

        // get card features from feature badges
        const cardFeatureBadges = card.querySelectorAll('.feature-badge');
        const cardFeatures = Array.from(cardFeatureBadges).map(badge => {
            const text = badge.textContent.toLowerCase().trim();
            if (text === 'bluetooth') return 'bluetooth';
            if (text === 'gps') return 'gps';
            if (text.includes('backup')) return 'backup-camera';
            if (text === 'usb') return 'usb-charging';
            return null;
        }).filter(f => f !== null);

        // check if vehicle meets all criteria
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

// sorting functionality
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

    // clear grid and re-append in sorted order
    vehiclesGrid.innerHTML = '';
    cardsToSort.forEach(card => vehiclesGrid.appendChild(card));
}

// clear filters functionality
document.querySelector('.clear-filters-btn').addEventListener('click', function(e) {
    e.preventDefault();
    
    // reset all form inputs
    document.querySelectorAll('.filter-checkbox').forEach(cb => cb.checked = false);
    document.getElementById('filter-seats').value = '1';
    document.getElementById('min-price').value = '';
    document.getElementById('max-price').value = '';

    // show all vehicles
    vehicleCards.forEach(card => card.classList.remove('hidden'));
    updateResultCount();
});

// event listener for sort dropdown
document.getElementById('sort-select').addEventListener('change', function(e) {
    sortVehicles(e.target.value);
});

// real-time filtering on checkbox change
document.querySelectorAll('.filter-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', filterVehicles);
});

// real-time filtering on seats dropdown change
document.getElementById('filter-seats').addEventListener('change', filterVehicles);

// real-time filtering on price input changes
document.getElementById('min-price').addEventListener('input', filterVehicles);
document.getElementById('max-price').addEventListener('input', filterVehicles);

// apply filters on Enter key in price inputs
document.getElementById('min-price').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        this.blur(); // Remove focus to trigger any remaining updates
    }
});

document.getElementById('max-price').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        this.blur(); // Remove focus to trigger any remaining updates
    }
});

// book Now button functionality
document.querySelectorAll('.book-btn').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        const card = this.closest('.vehicle-card');
        const vehicleName = card.querySelector('.vehicle-title').textContent;
        const vehiclePrice = card.querySelector('.price-amount').textContent.replace('$', '');
        const vehicleType = card.dataset.type;
        const vehicleSeats = card.dataset.seats;
        
        // get features from the card
        const featureBadges = card.querySelectorAll('.feature-badge');
        const features = Array.from(featureBadges).map(badge => badge.textContent.trim()).join(',');
        
        // get search parameters
        const searchParams = getUrlParams();
        
        // build URL string directly
        const url = 'bookingReview.html' +
            '?vehicle=' + encodeURIComponent(vehicleName) +
            '&type=' + encodeURIComponent(vehicleType) +
            '&seats=' + encodeURIComponent(vehicleSeats) +
            '&price=' + encodeURIComponent(vehiclePrice) +
            '&features=' + encodeURIComponent(features) +
            '&departure-address=' + encodeURIComponent(searchParams.departureAddress) +
            '&return-address=' + encodeURIComponent(searchParams.returnAddress) +
            '&departure-date=' + encodeURIComponent(searchParams.departureDate) +
            '&departure-time=' + encodeURIComponent(searchParams.departureTime) +
            '&return-date=' + encodeURIComponent(searchParams.returnDate) +
            '&return-time=' + encodeURIComponent(searchParams.returnTime) +
            '&passengers=' + encodeURIComponent(searchParams.seats);
        
        // navigate to review page
        window.location.href = url;
    });
});

// set min date for edit form
const today = new Date().toISOString().split('T')[0];
const editDepartureDate = document.getElementById('edit-departure-date');
const editReturnDate = document.getElementById('edit-return-date');

if (editDepartureDate) {
    editDepartureDate.setAttribute('min', today);
}

if (editReturnDate) {
    editReturnDate.setAttribute('min', today);
}

// update return date minimum when departure date changes in edit form
if (editDepartureDate) {
    editDepartureDate.addEventListener('change', function() {
        const departureDate = this.value;
        if (editReturnDate) {
            editReturnDate.setAttribute('min', departureDate);
        }
    });
}

// initialize result count on page load
updateResultCount();
