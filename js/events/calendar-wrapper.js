import { enhanceTodayCell } from './utils.js';

export class CalendarWrapper {
  constructor(selector) {
    this.selector = selector;
    this.calendar = null;
    this.onDateSelect = null;
  }

  init(eventDates, selectedDate) {
    if (window.VanillaCalendarPro) {
      const { Calendar } = window.VanillaCalendarPro;
      this.calendar = new Calendar(this.selector, {
        styles: {
          calendar: 'vc col-12 col-sm-4 mb-3 mb-sm-0'
        },
        settings: {
          selection: { day: true },
          visibility: { daysOutside: false }
        },
        disableAllDates: true,
        enableDates: eventDates,
        selectedDates: selectedDate ? [selectedDate] : [],
        enableJumpToSelectedDate: true,
        themeAttrDetect: 'html[data-bs-theme]',
        onClickDate: (self, event) => {
          const dateStr = self.context.selectedDates && self.context.selectedDates[0];
          if (dateStr && this.onDateSelect) {
            this.onDateSelect(dateStr);
          }
        }
      });
      this.calendar.init();
      enhanceTodayCell();
    }
  }

  selectDate(dateStr) {
    if (this.calendar && typeof this.calendar.set === 'function') {
      this.calendar.set({
        selectedDates: [dateStr]
      }, {
        dates: false
      });
      if (typeof this.calendar.update === 'function') {
        this.calendar.update({ dates: true });
      }
      enhanceTodayCell();
    }
  }
}