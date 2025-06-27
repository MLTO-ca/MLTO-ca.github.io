import { EventCarousel } from './event-carousel.js';
import { CalendarWrapper } from './calendar-wrapper.js';
import { EventsController } from './events-controller.js';

window.addEventListener('DOMContentLoaded', () => {
  const carousel = new EventCarousel('events-carousel', '/data/events.json');
  const calendar = new CalendarWrapper('#calendar');
  const controller = new EventsController(carousel, calendar);
  controller.init();
});