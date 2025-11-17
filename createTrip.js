// Mobile menu functionality
const menuBtn = document.querySelector('.menu-icon');
const links = document.querySelector('.nav-link-container');
menuBtn?.addEventListener('click', () => links?.classList.toggle('open'));
links?.querySelectorAll('.nav-link').forEach(a =>
    a.addEventListener('click', () => links.classList.remove('open'))
);

// ===== CREATE TRIP FUNCTIONALITY =====

// Get URL parameters
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
        departureDate: params.get('departure-date') || '',
        departureTime: params.get('departure-time') || '',
        returnDate: params.get('return-date') || '',
        returnTime: params.get('return-time') || '',
        totalSeats: params.get('total-seats') || '4'
    };
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

// Format date for display
function formatDate(dateString) {
    if (!dateString) return 'Not selected';
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

// Calculate cost breakdown
function calculateCostBreakdown() {
    const params = getUrlParams();
    const hasVehicleInfo = params.vehicleName !== 'Toyota Camry' || 
                          window.location.search.includes('vehicle=');
    
    // Only show cost breakdown if there's vehicle info
    const costBreakdown = document.querySelector('.cost-breakdown');
    if (!hasVehicleInfo) {
        if (costBreakdown) {
            costBreakdown.style.display = 'none';
        }
        // HIDE ENTIRE ROW WITH SEATS AND PRICE WHEN NO VEHICLE
        const seatsFormGroup = document.getElementById('total-seats').closest('.form-row');
        if (seatsFormGroup) {
            seatsFormGroup.style.display = 'none';
        }
        
        // REMOVE REQUIRED ATTRIBUTES WHEN FIELDS ARE HIDDEN
        const seatsInput = document.getElementById('total-seats');
        const priceInput = document.getElementById('price-per-person');
        if (seatsInput) seatsInput.removeAttribute('required');
        if (priceInput) priceInput.removeAttribute('required');
        
        return;
    }
    
    if (costBreakdown) {
        costBreakdown.style.display = 'block';
    }
    
    // SHOW SEATS AND PRICE ROW WHEN VEHICLE EXISTS
    const seatsFormGroup = document.getElementById('total-seats').closest('.form-row');
    if (seatsFormGroup) {
        seatsFormGroup.style.display = 'grid';
    }
    
    // ADD REQUIRED ATTRIBUTES BACK WHEN FIELDS ARE VISIBLE
    const seatsInput = document.getElementById('total-seats');
    const priceInput = document.getElementById('price-per-person');
    if (seatsInput) seatsInput.setAttribute('required', 'required');
    if (priceInput) priceInput.setAttribute('required', 'required');
    
    const dailyRate = parseFloat(params.vehiclePrice) || 45;
    const departureDate = params.departureDate;
    const returnDate = params.returnDate;
    const numDays = calculateDays(departureDate, returnDate);
    const totalSeats = parseInt(document.getElementById('total-seats').value) || parseInt(params.totalSeats) || 4;
    
    const totalRentalCost = dailyRate * numDays;
    const suggestedPricePerPerson = Math.ceil(totalRentalCost / totalSeats);
    
    // Update breakdown display
    document.getElementById('breakdown-rental').textContent = `$${totalRentalCost.toFixed(2)}`;
    document.getElementById('breakdown-passengers').textContent = totalSeats;
    document.getElementById('breakdown-suggested').textContent = `$${suggestedPricePerPerson.toFixed(2)}`;
    
    // Auto-populate price per person field (user can edit)
    const priceInput2 = document.getElementById('price-per-person');
    priceInput2.value = suggestedPricePerPerson.toFixed(2);
    
    // Update sidebar
    updateSidebar();
}

// Initialize form with URL parameters
function initializeForm() {
    const params = getUrlParams();
    
    // Check if vehicle info exists (coming from booking flow vs home page)
    const hasVehicleInfo = params.vehicleName !== 'Toyota Camry' || 
                          window.location.search.includes('vehicle=');
    
    const vehicleSection = document.getElementById('vehicle-route-section');
    
    if (hasVehicleInfo) {
        // Show vehicle section and populate it
        vehicleSection.style.display = 'block';
        
        // Set vehicle preview
        document.getElementById('preview-icon').textContent = getVehicleIcon(params.vehicleType);
        document.getElementById('preview-title').textContent = params.vehicleName;
        
        const typeFormatted = params.vehicleType.charAt(0).toUpperCase() + params.vehicleType.slice(1);
        document.getElementById('preview-specs').textContent = `${typeFormatted} • ${params.vehicleSeats} Seats`;
        document.getElementById('preview-price').textContent = params.vehiclePrice;
        
        // Update sidebar with vehicle info
        const vehicleSidebarSection = document.getElementById('summary-vehicle-section');
        if (vehicleSidebarSection) {
            vehicleSidebarSection.style.display = 'flex';
            document.getElementById('summary-vehicle').textContent = params.vehicleName;
        }
        
        // Set max seats based on vehicle capacity
        const vehicleSeats = parseInt(params.vehicleSeats) || 15;
        document.getElementById('total-seats').setAttribute('max', vehicleSeats);
        
        // Update helper text
        const helperText = document.querySelector('.input-helper');
        if (helperText) {
            helperText.textContent = `You can offer up to ${vehicleSeats} seats.`;
        }
    } else {
        // Hide entire vehicle & route section if coming from home page
        vehicleSection.style.display = 'none';
        
        // Hide price row in sidebar when no vehicle
        const priceRow = document.getElementById('summary-price').closest('.trip-summary-item');
        if (priceRow) {
            priceRow.style.display = 'none';
        }
        
        // Hide seats row in sidebar when no vehicle
        const seatsRow = document.getElementById('summary-seats').closest('.trip-summary-item');
        if (seatsRow) {
            seatsRow.style.display = 'none';
        }
    }
    
    // Populate sidebar with route info from params
    if (params.departureAddress) {
        const depSection = document.getElementById('summary-departure-section');
        depSection.style.display = 'flex';
        document.getElementById('summary-departure').textContent = params.departureAddress;
    }
    
    if (params.returnAddress) {
        const destSection = document.getElementById('summary-destination-section');
        destSection.style.display = 'flex';
        document.getElementById('summary-destination').textContent = params.returnAddress;
    }
    
    if (params.departureDate) {
        document.getElementById('summary-dep-date').textContent = formatDate(params.departureDate);
    }
    
    if (params.departureTime) {
        const depTimeSection = document.getElementById('summary-dep-time-section');
        depTimeSection.style.display = 'flex';
        document.getElementById('summary-dep-time').textContent = formatTime(params.departureTime);
    }
    
    if (params.returnDate) {
        document.getElementById('summary-ret-date').textContent = formatDate(params.returnDate);
    }
    
    if (params.returnTime) {
        const retTimeSection = document.getElementById('summary-ret-time-section');
        retTimeSection.style.display = 'flex';
        document.getElementById('summary-ret-time').textContent = formatTime(params.returnTime);
    }
    
    // Set total seats from params (or default to vehicle capacity)
    const defaultSeats = params.totalSeats || params.vehicleSeats || '4';
    document.getElementById('total-seats').value = defaultSeats;
    document.getElementById('summary-seats').textContent = defaultSeats;
    
    // Calculate initial cost breakdown and populate price
    calculateCostBreakdown();
}

// Initialize form on page load
initializeForm();

// ===== COUNTER FUNCTIONALITY =====
const seatsInput = document.getElementById('total-seats');
const decreaseBtn = document.getElementById('seats-decrease');
const increaseBtn = document.getElementById('seats-increase');

decreaseBtn.addEventListener('click', function() {
    let currentValue = parseInt(seatsInput.value) || 2;
    if (currentValue > 2) {
        seatsInput.value = currentValue - 1;
        calculateCostBreakdown();
        updateSidebar();
    }
});

increaseBtn.addEventListener('click', function() {
    let currentValue = parseInt(seatsInput.value) || 2;
    const maxSeats = parseInt(seatsInput.getAttribute('max')) || 15;
    
    if (currentValue < maxSeats) {
        seatsInput.value = currentValue + 1;
        calculateCostBreakdown();
        updateSidebar();
    }
});

// ===== LIVE SIDEBAR UPDATES =====
function updateSidebar() {
    // Update event type
    const eventType = document.getElementById('event-type').value;
    if (eventType) {
        const typeFormatted = eventType.charAt(0).toUpperCase() + eventType.slice(1);
        document.getElementById('summary-trip-type').textContent = typeFormatted;
    }
    
    // Update vehicle info if exists
    const params = getUrlParams();
    const hasVehicleInfo = params.vehicleName !== 'Toyota Camry' || 
                          window.location.search.includes('vehicle=');
    
    if (hasVehicleInfo) {
        const vehicleSection = document.getElementById('summary-vehicle-section');
        vehicleSection.style.display = 'flex';
        document.getElementById('summary-vehicle').textContent = params.vehicleName;
        
        // Show price row in sidebar
        const priceRow = document.getElementById('summary-price').closest('.trip-summary-item');
        if (priceRow) {
            priceRow.style.display = 'flex';
        }
        
        // Show seats row in sidebar
        const seatsRow = document.getElementById('summary-seats').closest('.trip-summary-item');
        if (seatsRow) {
            seatsRow.style.display = 'flex';
        }
    } else {
        // Hide price row in sidebar when no vehicle
        const priceRow = document.getElementById('summary-price').closest('.trip-summary-item');
        if (priceRow) {
            priceRow.style.display = 'none';
        }
        
        // Hide seats row in sidebar when no vehicle
        const seatsRow = document.getElementById('summary-seats').closest('.trip-summary-item');
        if (seatsRow) {
            seatsRow.style.display = 'none';
        }
    }
    
    // Update dates (from params, not form fields)
    if (params.departureDate) {
        document.getElementById('summary-dep-date').textContent = formatDate(params.departureDate);
    }
    
    if (params.returnDate) {
        document.getElementById('summary-ret-date').textContent = formatDate(params.returnDate);
    }
    
    // Update seats
    const seats = document.getElementById('total-seats').value;
    document.getElementById('summary-seats').textContent = seats;
    
    // Update price ONLY if vehicle info exists
    if (hasVehicleInfo) {
        const price = document.getElementById('price-per-person').value;
        if (price) {
            document.getElementById('summary-price').textContent = `$${parseFloat(price).toFixed(2)}`;
        }
    }
}

// Add event listener for price updates (only if field exists and is visible)
const priceInput = document.getElementById('price-per-person');
if (priceInput) {
    priceInput.addEventListener('input', function() {
        // Only update if the field is visible
        if (this.closest('.form-group').style.display !== 'none') {
            updateSidebar();
        }
    });
}

// Handle event type tag selection
const eventTags = document.querySelectorAll('.tag');
const eventTypeInput = document.getElementById('event-type');

eventTags.forEach(tag => {
    tag.addEventListener('click', function() {
        // Remove active class from all tags
        eventTags.forEach(t => t.classList.remove('active'));
        
        // Add active class to clicked tag
        this.classList.add('active');
        
        // Set hidden input value
        const eventType = this.dataset.type;
        eventTypeInput.value = eventType;
        
        // Update sidebar
        updateSidebar();
    });
});

// Form validation - ensure event type is selected
document.getElementById('create-trip-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    console.log('Form submitted!'); // Debug log
    
    if (!eventTypeInput.value) {
        alert('Please select an event type.');
        return;
    }
    
    // Get params for route/vehicle data
    const params = getUrlParams();
    const hasVehicleInfo = params.vehicleName !== 'Toyota Camry' || 
                          window.location.search.includes('vehicle=');
    
    console.log('Has vehicle info:', hasVehicleInfo); // Debug log
    
    // Get seats value - only if vehicle section is visible
    const seatsInput = document.getElementById('total-seats');
    let totalSeats = null;
    if (hasVehicleInfo && seatsInput) {
        totalSeats = seatsInput.value;
    }
    
    // Get price value - only if vehicle section is visible
    const priceInput = document.getElementById('price-per-person');
    let pricePerPerson = null;
    if (hasVehicleInfo && priceInput) {
        pricePerPerson = priceInput.value;
    }
    
    // Get all form values
    const formData = {
        tripName: document.getElementById('trip-name').value,
        eventType: eventTypeInput.value,
        description: document.getElementById('description').value,
        departureAddress: params.departureAddress || null,
        destination: params.returnAddress || null,
        departureDate: params.departureDate || null,
        departureTime: params.departureTime || null,
        returnDate: params.returnDate || null,
        returnTime: params.returnTime || null,
        totalSeats: totalSeats,
        pricePerPerson: pricePerPerson,
        publicTrip: document.getElementById('public-trip').checked,
        // IMPORTANT: Pass actual vehicle data, not just check hasVehicleInfo
        vehicleName: params.vehicleName,
        vehicleType: params.vehicleType,
        vehicleSeats: params.vehicleSeats,
        vehiclePrice: params.vehiclePrice
    };
    
    // In production, this would send data to backend
    console.log('Trip created:', formData);
    
    // Show success state
    try {
        showSuccessState(formData);
    } catch (error) {
        console.error('Error showing success state:', error);
        alert('There was an error creating your trip. Please try again.');
    }
});

// Show success state after trip creation
function showSuccessState(tripData) {
    // Check if vehicle section was visible (meaning user came from booking flow with vehicle)
    const vehicleSection = document.getElementById('vehicle-route-section');
    const wasVehicleSectionVisible = vehicleSection && vehicleSection.style.display !== 'none';
    
    // Vehicle exists if the section was visible AND we have vehicle data
    const hasVehicle = wasVehicleSectionVisible && 
                      tripData.vehicleType && 
                      tripData.vehiclePrice && 
                      tripData.vehicleName;
    
    console.log('Was Vehicle Section Visible:', wasVehicleSectionVisible);
    console.log('Has Vehicle:', hasVehicle);
    console.log('Trip Data:', tripData);
    
    // Hide the form
    document.getElementById('create-trip-form').style.display = 'none';
    
    // Update page header
    document.querySelector('.page-header h1').textContent = 'Trip Created Successfully!';
    document.querySelector('.page-header p').textContent = 'Your group trip is ready to share';
    
    // Update sidebar title
    document.querySelector('.info-card-title').textContent = '✓ Trip Created';
    
    // Create success message section
    const formWrapper = document.querySelector('.form-wrapper');
    const successSection = document.createElement('div');
    successSection.className = 'success-section';
    successSection.innerHTML = `
        <div class="success-card">
            <div class="success-icon-large">✓</div>
            <h2 class="success-title">${tripData.tripName}</h2>
            <p class="success-subtitle">Your group trip has been created!</p>
            
            <div class="trip-link-section">
                <h3>Share Your Trip</h3>
                <div class="link-container">
                    <input type="text" readonly value="campuscruiser.com/trips/ABC123" class="trip-link-input" id="trip-link">
                    <button class="copy-link-btn" onclick="copyTripLink()">Copy Link</button>
                </div>
                <p class="link-help">Share this link with friends to let them join your trip!</p>
            </div>
            
            ${!hasVehicle ? `
            <div class="add-vehicle-section">
                <h3>🚗 Add a Vehicle</h3>
                <p>Complete your trip by adding a vehicle to share costs</p>
                <button class="add-vehicle-btn" id="browse-vehicles-btn">
                    Browse Vehicles
                </button>
            </div>
            ` : `
            <div class="vehicle-added-section">
                <h3>✓ Vehicle Added</h3>
                <div class="vehicle-mini-display">
                    <span class="vehicle-icon-small">${getVehicleIcon(tripData.vehicleType)}</span>
                    <span>${tripData.vehicleName}</span>
                </div>
            </div>
            `}
            
            <div class="action-buttons-success">
                <button class="primary-btn" onclick="location.href='browse-trips.html'">
                    View All Trips
                </button>
                <button class="secondary-btn" onclick="location.href='home.html'">
                    Back to Home
                </button>
            </div>
        </div>
    `;
    
    // Replace form with success section
    formWrapper.appendChild(successSection);
    
    // Add event listener for Browse Vehicles button if it exists
    const browseVehiclesBtn = document.getElementById('browse-vehicles-btn');
    if (browseVehiclesBtn) {
        browseVehiclesBtn.addEventListener('click', function() {
            // Get the trip data that was stored
            const params = getUrlParams();
            
            // Build URL with all trip information
            const url = 'searchVehicle.html' +
                '?trip-exists=true' +
                '&departure-address=' + encodeURIComponent(params.departureAddress || tripData.departureAddress || '') +
                '&return-address=' + encodeURIComponent(params.returnAddress || tripData.destination || '') +
                '&departure-date=' + encodeURIComponent(params.departureDate || tripData.departureDate || '') +
                '&departure-time=' + encodeURIComponent(params.departureTime || tripData.departureTime || '') +
                '&return-date=' + encodeURIComponent(params.returnDate || tripData.returnDate || '') +
                '&return-time=' + encodeURIComponent(params.returnTime || tripData.returnTime || '') +
                '&seats=' + encodeURIComponent(params.seats || tripData.totalSeats || '4');
            
            location.href = url;
        });
    }
}

// Copy trip link to clipboard
function copyTripLink() {
    const linkInput = document.getElementById('trip-link');
    linkInput.select();
    linkInput.setSelectionRange(0, 99999); // For mobile devices
    
    navigator.clipboard.writeText(linkInput.value).then(() => {
        const copyBtn = document.querySelector('.copy-link-btn');
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✓ Copied!';
        copyBtn.style.background = '#10b981';
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.background = '';
        }, 2000);
    }).catch(() => {
        alert('Link copied: ' + linkInput.value);
    });
}
