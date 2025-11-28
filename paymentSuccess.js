// paymentSuccess.js

const params = new URLSearchParams(window.location.search);

const vehicle = params.get('vehicle') || '—';
const price   = params.get('price') || '0';
const pickup  = params.get('pickup') || '—';
const dropoff = params.get('dropoff') || '—';
const depDate = params.get('departure-date') || '';
const depTime = params.get('departure-time') || '';
const retDate = params.get('return-date') || '';
const retTime = params.get('return-time') || '';

function formatDate(d) {
    if (!d) return '';
    const date = new Date(d + 'T00:00:00');
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

function formatDateTime(dateStr, timeStr) {
    const datePart = formatDate(dateStr);
    if (!datePart) return '—';
    if (!timeStr) return datePart;

    const [h, m] = timeStr.split(':');
    const hour = parseInt(h, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    const timePart = `${displayHour}:${m} ${ampm}`;
    return `${datePart} at ${timePart}`;
}

// Fill the summary box
document.getElementById('summary-vehicle').textContent = vehicle;

document.getElementById('summary-pickup').textContent =
    pickup === '—'
        ? '—'
        : `${pickup} • ${formatDateTime(depDate, depTime)}`;

document.getElementById('summary-return').textContent =
    dropoff === '—'
        ? '—'
        : `${dropoff} • ${formatDateTime(retDate, retTime)}`;

document.getElementById('summary-price').textContent =
    `$${parseFloat(price || '0').toFixed(2)}`;
