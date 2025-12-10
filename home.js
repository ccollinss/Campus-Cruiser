document.addEventListener('DOMContentLoaded', () => {

  // -------------------------------
  // EXISTING: "View All" Event Cards
  // -------------------------------
  const viewAllBtn = document.querySelector('.see-all-btn');
  const eventsGrid = document.querySelector('.events-grid');
  const buttonContainer = document.querySelector('.see-all-button-container');

  if (viewAllBtn && eventsGrid && buttonContainer) {

      viewAllBtn.addEventListener('click', () => {

          eventsGrid.classList.add('show-all');
          buttonContainer.classList.add('hidden');

          setTimeout(() => {
              const firstHiddenEvent = document.querySelector('.event-card:nth-child(5)');
              if (firstHiddenEvent) {
                  firstHiddenEvent.scrollIntoView({
                      behavior: 'smooth',
                      block: 'nearest'
                  });
              }
          }, 900);

      });
  }

  // ---------------------------------------------------
  // NEW: Trip Type Switching (Round Trip / One Way Tabs)
  // ---------------------------------------------------

  const roundTripBtn = document.getElementById('round-trip-btn');
  const oneWayBtn = document.getElementById('one-way-btn');

  // Return field containers
  const returnDateGroup = document.getElementById('return-date-group');
  const returnTimeGroup = document.getElementById('return-time-group');

  // ---- ROUND TRIP SELECTED ----
  if (roundTripBtn) {
      roundTripBtn.addEventListener('click', () => {

          roundTripBtn.classList.add('active');
          oneWayBtn.classList.remove('active');

          // Show return fields
          returnDateGroup.style.display = 'block';
          returnTimeGroup.style.display = 'block';

          // Make required again
          document.getElementById('return-date').required = true;
          document.getElementById('return-time').required = true;
      });
  }

  // ---- ONE WAY SELECTED ----
  if (oneWayBtn) {
      oneWayBtn.addEventListener('click', () => {

          oneWayBtn.classList.add('active');
          roundTripBtn.classList.remove('active');

          // Hide return fields
          returnDateGroup.style.display = 'none';
          returnTimeGroup.style.display = 'none';

          // Remove required so form can submit
          document.getElementById('return-date').required = false;
          document.getElementById('return-time').required = false;

          // Clear values (optional)
          document.getElementById('return-date').value = '';
          document.getElementById('return-time').value = '';
      });
  }

});
