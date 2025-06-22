import { formatDateToStr } from './utils.js';

export class EventsController {
  constructor(carousel, calendar) {
    this.carousel = carousel;
    this.calendar = calendar;
  }

  async init() {
    await this.carousel.init();
    const eventDates = this.carousel.getEventDates();
    const todayStr = formatDateToStr(new Date());
    if (!eventDates.includes(todayStr)) {
      eventDates.push(todayStr);
    }
    const initialDate = this.carousel.events.length ? this.carousel.events[this.carousel.currentIndex].dateStr : null;

    this.calendar.onDateSelect = (dateStr) => {
      this.carousel.showEventByDate(dateStr);
    };
    this.calendar.init(eventDates, initialDate);

    this.carousel.onEventChange = (dateStr) => {
      this.calendar.selectDate(dateStr);
    };
  }
}