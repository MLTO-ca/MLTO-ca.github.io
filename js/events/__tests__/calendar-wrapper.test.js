import { jest } from '@jest/globals';
import { CalendarWrapper } from "../calendar-wrapper.js";

// Mock VanillaCalendarPro
global.window.VanillaCalendarPro = {
  Calendar: class {
    constructor(selector, options) {
      this.selector = selector;
      this.options = options;
      this.set = jest.fn();
      this.update = jest.fn();
      this.init = jest.fn();
      this.context = { selectedDates: ["2025-06-10"] };
    }
  }
};

describe("CalendarWrapper", () => {
  it("calls onDateSelect callback when a date is selected", () => {
    const wrapper = new CalendarWrapper("#calendar");
    const mockCallback = jest.fn();
    wrapper.onDateSelect = mockCallback;
    wrapper.init(["2025-06-10"], "2025-06-10");

    // Simulate calendar date click
    const calendarInstance = wrapper.calendar;
    calendarInstance.options.onClickDate(calendarInstance, {});
    expect(mockCallback).toHaveBeenCalledWith("2025-06-10");
  });

  it("selectDate calls set and update on calendar", () => {
    const wrapper = new CalendarWrapper("#calendar");
    wrapper.init(["2025-06-10"], "2025-06-10");
    wrapper.selectDate("2025-06-11");
    expect(wrapper.calendar.set).toHaveBeenCalled();
    expect(wrapper.calendar.update).toHaveBeenCalled();
  });
});