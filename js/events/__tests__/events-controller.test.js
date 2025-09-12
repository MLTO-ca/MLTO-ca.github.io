import { jest } from '@jest/globals';
import { EventsController } from "../events-controller.js";

describe("EventsController", () => {
  let carousel, calendar, controller;

  beforeEach(() => {
    carousel = {
      init: jest.fn().mockResolvedValue(),
      getEventDates: jest.fn(() => ["2025-06-10"]),
      events: [{ dateStr: "2025-06-10" }],
      currentIndex: 0,
      showEventByDate: jest.fn(),
      onEventChange: null
    };
    calendar = {
      onDateSelect: null,
      init: jest.fn(),
      selectDate: jest.fn()
    };
    controller = new EventsController(carousel, calendar);
  });

  it("initializes and links calendar and carousel", async () => {
    await controller.init();

    // Simulate calendar date selection
    expect(typeof calendar.onDateSelect).toBe("function");
    calendar.onDateSelect("2025-06-10");
    expect(carousel.showEventByDate).toHaveBeenCalledWith("2025-06-10");

    // Simulate carousel event change
    expect(typeof carousel.onEventChange).toBe("function");
    carousel.onEventChange("2025-06-10");
    expect(calendar.selectDate).toHaveBeenCalledWith("2025-06-10");
  });
});