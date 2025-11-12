// get the View All button and events grid
const viewAllBtn = document.querySelector('.see-all-btn');
const eventsGrid = document.querySelector('.events-grid');
const buttonContainer = document.querySelector('.see-all-button-container');

// add click event listener
viewAllBtn.addEventListener('click', function () {
  // add 'show-all' class to reveal hidden events
  eventsGrid.classList.add('show-all');

  // hide the View All button
  buttonContainer.classList.add('hidden');

  // smooth scroll to show revealed events
  setTimeout(() => {
    const firstHiddenEvent = document.querySelector('.event-card:nth-child(5)');
    if (firstHiddenEvent) {
      firstHiddenEvent.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, 900);
});

// hidden cards revealed on button click
document.addEventListener('DOMContentLoaded', () => {
  const viewAllBtn = document.querySelector('.see-all-btn');
  const eventsGrid = document.querySelector('.events-grid');
  const buttonContainer = document.querySelector('.see-all-button-container');

  // add click event listener to "View All" button if elements exist
  if (viewAllBtn && eventsGrid && buttonContainer) {
    viewAllBtn.addEventListener('click', () => {
      eventsGrid.classList.add('show-all');      // reveals hidden cards
      buttonContainer.classList.add('hidden');   // hides the button
      setTimeout(() => {
        document.querySelector('.event-card:nth-child(5)')?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
      }, 900);
    });
  }
});
