import { EventCarousel } from "../event-carousel.js";
import { EventModel } from "../event-model.js";

describe("EventCarousel", () => {
  let container;

  beforeEach(() => {
    document.body.innerHTML = '<div id="events-carousel"></div>';
    container = document.getElementById("events-carousel");
  });

  it("should initialize with empty events", () => {
    const carousel = new EventCarousel("events-carousel", "/data/events.json");
    carousel.renderCarousel();
    expect(carousel.events).toEqual([]);
    expect(carousel.currentIndex).toBe(0);
    expect(document.getElementById("events-carousel").innerHTML).toContain("No upcoming events.");
  });

  it("should filter upcoming events", () => {
    const carousel = new EventCarousel("events-carousel", "/data/events.json");
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    carousel.events = [
      new EventModel({ title: "Past", date: yesterday.toISOString().slice(0, 10) }),
      new EventModel({ title: "Future", date: today.toISOString().slice(0, 10) })
    ];
    carousel.filterUpcomingEvents();
    expect(carousel.events.length).toBe(1);
    expect(carousel.events[0].title).toBe("Future");
  });

  it("should sort events by date", () => {
    const carousel = new EventCarousel("events-carousel", "/data/events.json");
    carousel.events = [
      new EventModel({ title: "B", date: "2025-06-11" }),
      new EventModel({ title: "A", date: "2025-06-10" })
    ];
    carousel.sortEvents();
    expect(carousel.events[0].title).toBe("A");
    expect(carousel.events[1].title).toBe("B");
  });

  it("should wrap navigation", () => {
    const carousel = new EventCarousel("events-carousel", "/data/events.json");
    carousel.events = [
      new EventModel({ title: "A", date: "2025-06-10" }),
      new EventModel({ title: "B", date: "2025-06-11" })
    ];
    carousel.currentIndex = 0;
    // Simulate navigation
    carousel.navigate(1, { innerHTML: "" });
    expect(carousel.currentIndex).toBe(1);
    carousel.navigate(1, { innerHTML: "" });
    expect(carousel.currentIndex).toBe(0);
  });
});