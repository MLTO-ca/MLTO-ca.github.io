import { EventCarousel } from './event-carousel.js';
import { CalendarWrapper } from './calendar-wrapper.js';
import { EventsController } from './events-controller.js';
import { PastEventsComponent } from './past-events-component.js';

window.addEventListener('DOMContentLoaded', () => {
  // Only initialize upcoming events carousel if container exists
  const carouselContainer = document.getElementById('events-carousel');
  const calendarContainer = document.getElementById('calendar');

  if (carouselContainer && calendarContainer) {
    // Initialize upcoming events carousel with calendar
    const carousel = new EventCarousel('events-carousel', '/data/events.json');
    const calendar = new CalendarWrapper('#calendar');
    const controller = new EventsController(carousel, calendar);
    controller.init();
  }
  
  // Initialize past events component
  const pastEventsComponent = new PastEventsComponent('past-events-content', '/data/events.json', 6, 6);
  pastEventsComponent.init();
});