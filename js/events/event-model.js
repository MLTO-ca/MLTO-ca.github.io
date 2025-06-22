import { getTimeZoneAbbr } from './utils.js';

/**
 * Represents an event for the MLTO calendar/carousel.
 */
export class EventModel {
  /**
   * @param {Object} data
   * @param {string} data.title
   * @param {string} data.date - In YYYY-MM-DD format
   * @param {string} [data.startTime]
   * @param {string} [data.endTime]
   * @param {string} [data.location]
   * @param {string} [data.registrationLink]
   */
  constructor({ title, date, startTime, endTime, location, registrationLink }) {
    if (!title || typeof title !== 'string') throw new Error('Event title is required.');
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error('Event date must be YYYY-MM-DD.');
    this.title = title;
    this.date = new Date(date + 'T00:00:00');
    this.dateStr = date;
    this.startTime = startTime || 'TBC';
    this.endTime = endTime || '';
    this.location = location || 'TBC';
    this.link = registrationLink || '#';
  }

  toHTML() {
    const day = this.date.getDate();
    const month = this.date.toLocaleString('en-CA', { month: 'short', timeZone: 'America/Toronto' });
    const year = this.date.getFullYear();
    const tzString = getTimeZoneAbbr(this.date);

    return `
      <div class="event-card d-flex align-items-stretch">
        <div class="event-flag me-3">
          <div class="event-flag-date text-center">
            <div class="event-flag-day">${day}</div>
            <div class="event-flag-month">${month}</div>
          </div>
        </div>
        <div class="event-content flex-grow-1">
          <div class="event-time">${year} &bull; ${this.startTime}${this.endTime ? ' - ' + this.endTime : ''} ${tzString}</div>
          <h4 class="mb-1 event-title">${this.title}</h4>
          <p class="mb-1 mb-sm-3 event-address">
            <em>${this.location}</em>
          </p>
          <a href="${this.link}" target="_blank" class="event-link">Registration</a>
        </div>
      </div>
    `;
  }
}