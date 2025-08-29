import { EventModel } from './event-model.js';
import { formatDateToStr } from './utils.js';

/**
 * Component for displaying past events with year filtering and pagination
 */
export class PastEventsComponent {
  /**
   * @param {string} containerId - ID of the container element
   * @param {string} dataUrl - URL to fetch events data
   * @param {number} initialCount - Number of events to show initially
   * @param {number} incrementCount - Number of additional events to show when "Show More" is clicked
   */
  constructor(containerId, dataUrl, initialCount = 3, incrementCount = 3) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      throw new Error(`Container with id "${containerId}" not found`);
    }
    this.dataUrl = dataUrl;
    this.initialCount = initialCount;
    this.incrementCount = incrementCount;
    this.allEvents = [];
    this.filteredEvents = [];
    this.visibleCount = initialCount;
    this.selectedYear = 'all';
    this.years = [];

    // Year filter change
    this.container.addEventListener('change', (e) => {
      if (e.target.id === 'year-filter') {
        this.selectedYear = e.target.value;
        this.visibleCount = this.initialCount;
        this.applyYearFilter();
        this.renderEvents();
      }
    });

    // Show more button click
    this.container.addEventListener('click', (e) => {
      if (e.target.classList.contains('show-more-btn')) {
        e.preventDefault();
        this.visibleCount += this.incrementCount;
        this.appendMoreEvents();
      }
    });
    
    // Click outside to close dropdown
    document.addEventListener('click', (e) => {
      const dropdown = this.container.querySelector('.custom-select');
      if (dropdown && !dropdown.contains(e.target)) {
        dropdown.querySelector('.select-options').classList.remove('show');
      }
    }); 
  }

  async init() {
    if (!this.container) return;
    
    await this.fetchEvents();
    this.filterPastEvents();
    this.extractYears();
    this.renderYearFilter();
    this.renderEvents();
  }

  async fetchEvents() {
    try {
      const response = await fetch(this.dataUrl);
      const data = await response.json();
      this.allEvents = data.map(ev => new EventModel(ev));
    } catch (error) {
      this.container.innerHTML = `<p>Error loading events.</p>`;
      console.error(error);
    }
  }

  filterPastEvents() {
    const todayStr = formatDateToStr(new Date());
    // Filter past events
    this.allEvents = this.allEvents.filter(event => event.dateStr < todayStr);
    // Sort by date descending (newest first)
    this.allEvents.sort((a, b) => b.date - a.date);
    this.applyYearFilter();
  }

  extractYears() {
    // Get unique years from events
    this.years = [...new Set(this.allEvents.map(event => event.date.getFullYear()))];
    this.years.sort((a, b) => b - a); // Sort years descending
  }

  applyYearFilter() {
    if (this.selectedYear === 'all') {
      this.filteredEvents = [...this.allEvents];
    } else {
      const year = parseInt(this.selectedYear);
      this.filteredEvents = this.allEvents.filter(
        event => event.date.getFullYear() === year
      );
    }
  }

  renderYearFilter() {
    if (!this.years.length) return;

    const filterContainer = document.createElement('div');
    filterContainer.className = 'past-events-filter my-4';
    
    // Hidden native select (for functionality)
    const select = document.createElement('select');
    select.id = 'year-filter';
    select.className = 'visually-hidden';
    
    const placeholderOption = document.createElement('option');
    placeholderOption.value = 'all';
    placeholderOption.textContent = 'Filter by year';
    select.appendChild(placeholderOption);
    
    this.years.forEach(year => {
      const option = document.createElement('option');
      option.value = year;
      option.textContent = year;
      select.appendChild(option);
    });
    
    // Custom visual dropdown (for appearance)
    const customDropdown = document.createElement('div');
    customDropdown.className = 'custom-select';
    
    const selectButton = document.createElement('button');
    selectButton.type = 'button';
    selectButton.className = 'select-button';
    selectButton.textContent = 'Filter by year';
    
    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'select-options';
    
    // Add "all" option
    const allOption = document.createElement('div');
    allOption.className = 'select-option';
    allOption.textContent = 'Filter by year';
    allOption.dataset.value = 'all';
    optionsContainer.appendChild(allOption);
    
    // Add year options
    this.years.forEach(year => {
      const option = document.createElement('div');
      option.className = 'select-option';
      option.textContent = year;
      option.dataset.value = year;
      optionsContainer.appendChild(option);
    });
    
    // Toggle dropdown on button click
    selectButton.addEventListener('click', () => {
      optionsContainer.classList.toggle('show');
    });
    
    // Handle option selection
    optionsContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('select-option')) {
        const value = e.target.dataset.value; // Get value for custom option
        select.value = value; // Update native select
        select.dispatchEvent(new Event('change', { bubbles: true })); // Trigger native change event
        
        selectButton.textContent = `${e.target.textContent}`; // Update visual appearance
        optionsContainer.classList.remove('show');
      }
    });
    
    customDropdown.appendChild(selectButton);
    customDropdown.appendChild(optionsContainer);
    
    filterContainer.appendChild(select);
    filterContainer.appendChild(customDropdown);
    this.container.appendChild(filterContainer);
  }

  renderEvents() {
    // Clear existing events and button
    this.clearEventList();
    this.clearShowMoreButton();

    // Create fresh events container
    const eventsContainer = document.createElement('div');
    eventsContainer.className = 'past-events-list';

    if (!this.filteredEvents.length) {
      eventsContainer.innerHTML = '<p>No past events found.</p>';
      this.container.appendChild(eventsContainer);
      return;
    }

    // Render visible events
    const visibleEvents = this.filteredEvents.slice(0, this.visibleCount);
    this.renderEventItems(eventsContainer, visibleEvents);

    this.container.appendChild(eventsContainer);
    this.renderShowMoreButton();
  }

  appendMoreEvents() {
    const eventsContainer = this.container.querySelector('.past-events-list');
    if (!eventsContainer) return;

    // Remove existing button
    this.clearShowMoreButton();

    // Get new events to append
    const currentDisplayed = eventsContainer.children.length;
    const newEvents = this.filteredEvents.slice(currentDisplayed, this.visibleCount);

    // Append new events
    this.renderEventItems(eventsContainer, newEvents);
    this.renderShowMoreButton();
  }

  renderEventItems(container, events) {
    events.forEach(event => {
      const eventElement = document.createElement('a');
      eventElement.className = 'past-event-item mb-4';
      eventElement.href = event.link;
      eventElement.target = '_blank';
      eventElement.innerHTML = event.toHTML(true);
      container.appendChild(eventElement);
    });
  }

  renderShowMoreButton() {
    if (this.visibleCount < this.filteredEvents.length) {
      const showMoreBtn = document.createElement('button');
      showMoreBtn.className = 'btn show-more-btn';
      showMoreBtn.textContent = 'Show More';
      showMoreBtn.type = 'button';
      this.container.appendChild(showMoreBtn);
    }
  }

  clearEventList() {
    const existingEvents = this.container.querySelector('.past-events-list');
    if (existingEvents) {
      existingEvents.remove();
    }
  }

  clearShowMoreButton() {
    const existingButton = this.container.querySelector('.show-more-btn');
    if (existingButton) {
      existingButton.remove();
    }
  }
}