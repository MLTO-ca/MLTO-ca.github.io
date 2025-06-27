import { EventModel } from './event-model.js';
import { formatDateToStr } from './utils.js';

export class EventCarousel {
  constructor(containerId, dataUrl) {
    this.container = document.getElementById(containerId);
    this.dataUrl = dataUrl;
    this.events = [];
    this.currentIndex = 0;
    this.onEventChange = null;
  }

  async init() {
    await this.fetchEvents();
    this.filterUpcomingEvents();
    this.sortEvents();
    this.renderCarousel();
    if (this.onEventChange && this.events.length) {
      this.onEventChange(this.events[this.currentIndex].dateStr);
    }
  }

  async fetchEvents() {
    try {
      const response = await fetch(this.dataUrl);
      const data = await response.json();
      this.events = data.map(ev => new EventModel(ev));
    } catch (error) {
      this.container.innerHTML = `<p>Error loading events.</p>`;
      console.error(error);
    }
  }

  filterUpcomingEvents() {
    const todayStr = formatDateToStr(new Date());
    this.events = this.events.filter(event => event.dateStr >= todayStr);
  }

  sortEvents() {
    this.events.sort((a, b) => a.date - b.date);
  }

  renderCarousel() {
    this.container.innerHTML = '';
    if (!this.events.length) {
      this.container.innerHTML = `<p>No upcoming events.</p>`;
      return;
    }
    const wrapper = document.createElement('div');
    wrapper.className = 'carousel-wrapper';

    const content = document.createElement('div');
    content.className = 'carousel-content';
    content.innerHTML = this.events[this.currentIndex].toHTML();

    const prevBtn = document.createElement('button');
    prevBtn.textContent = '⟨';
    prevBtn.onclick = () => this.navigate(-1, content);

    const nextBtn = document.createElement('button');
    nextBtn.textContent = '⟩';
    nextBtn.onclick = () => this.navigate(1, content);

    wrapper.appendChild(prevBtn);
    wrapper.appendChild(content);
    wrapper.appendChild(nextBtn);
    this.container.appendChild(wrapper);
  }

  navigate(direction, contentDiv) {
    const len = this.events.length;
    this.currentIndex = (this.currentIndex + direction + len) % len;
    contentDiv.innerHTML = this.events[this.currentIndex].toHTML();
    if (this.onEventChange) {
      this.onEventChange(this.events[this.currentIndex].dateStr);
    }
  }

  showEventByDate(dateStr) {
    const idx = this.events.findIndex(ev => ev.dateStr === dateStr);
    if (idx !== -1) {
      this.currentIndex = idx;
      const contentDiv = this.container.querySelector('.carousel-content');
      if (contentDiv) {
        contentDiv.innerHTML = this.events[this.currentIndex].toHTML();
      }
      if (this.onEventChange) {
        this.onEventChange(this.events[this.currentIndex].dateStr);
      }
    }
  }

  getEventDates() {
    return this.events.map(ev => ev.dateStr);
  }
}