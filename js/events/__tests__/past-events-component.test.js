import { jest } from '@jest/globals';
import { PastEventsComponent } from '../past-events-component.js';

describe('PastEventsComponent', () => {
  let container;
  let component;

  const mockEvents = [
    { id: '1', title: 'ML Workshop 2024', date: '2024-06-15', startTime: '18:00', attendees: 150 },
    { id: '2', title: 'AI Conference 2024', date: '2024-03-20', startTime: '18:00', attendees: 200 },
    { id: '3', title: 'Data Science Meetup 2023', date: '2023-09-10', startTime: '18:00', attendees: 80 },
    { id: '4', title: 'Tech Talk 2023', date: '2023-05-25', startTime: '17:30', attendees: 120 }
  ];

  // Add helper function for triggering select change
  const triggerSelectChange = (selectElement, value) => {
    selectElement.value = value;
    const changeEvent = new Event('change', { bubbles: true});
    selectElement.dispatchEvent(changeEvent);
  }

  beforeEach(() => {
    document.body.innerHTML = '<div id="past-events"></div>';
    container = document.getElementById('past-events');
    
    // This mocks fetch to return mockEvents
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockEvents)
    });

    // Mock current date to ensure all events are "past"
    jest.spyOn(Date, 'now').mockImplementation(() => new Date('2025-01-01').getTime());
  });

  afterEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = '';
  });

  // Test 1: Basic initialization
  test('initializes correctly', () => {
    component = new PastEventsComponent('past-events', '/data/events.json', 2, 2);
    
    expect(component.container).toBe(container);
    expect(component.initialCount).toBe(2);
    expect(component.incrementCount).toBe(2);
  });

  // Test 2: Data fetching
  test('fetches and processes events', async () => {
    component = new PastEventsComponent('past-events', '/data/events.json');
    await component.init();
    
    expect(global.fetch).toHaveBeenCalledWith('/data/events.json');
    expect(component.allEvents.length).toBeGreaterThan(0);
  });

  // Test 3: Year filter rendering
  test('renders year filter dropdown', async () => {
    component = new PastEventsComponent('past-events', '/data/events.json');
    await component.init();
    
    const select = container.querySelector('#year-filter');
    const options = select.querySelectorAll('option');
    
    expect(select).toBeTruthy();
    expect(options.length).toBe(3); // Exactly: "Filter by year" + "2024" + "2023"
    expect(options[0].textContent).toBe('Filter by year');
  });

  // Test 4: Events list rendering
  test('renders events list', async () => {
    component = new PastEventsComponent('past-events', '/data/events.json', 2);
    await component.init();
    
    const eventsList = container.querySelector('.past-events-list');
    const eventItems = eventsList.querySelectorAll('.past-event-item');
    
    expect(eventsList).toBeTruthy();
    expect(eventItems.length).toBe(2); // Initial count
  });

  // Test 5: Show more button
  test('shows "Show More" button when more events exist', async () => {
    component = new PastEventsComponent('past-events', '/data/events.json', 2);
    await component.init();
    
    const showMoreBtn = container.querySelector('.show-more-btn');
    expect(showMoreBtn).toBeTruthy();
    expect(showMoreBtn.textContent).toBe('Show More');
  });

  // Test 6: Year filtering functionality
  test('filters events by year', async () => {
    component = new PastEventsComponent('past-events', '/data/events.json');
    await component.init();

    const select = container.querySelector('#year-filter');

    // Trigger a select event change
    triggerSelectChange(select, '2024');

    // Check if events are filtered (should show only 2024 events)
    expect(component.selectedYear).toBe('2024');
    expect(component.filteredEvents.length).toBe(2); // Should be 2 for 2024 events
  });

  // Test 7: Show more functionality
  test('shows more events when "Show More" clicked', async () => {
    component = new PastEventsComponent('past-events', '/data/events.json', 2, 1);
    await component.init();

    const initialItems = container.querySelectorAll('.past-event-item').length;
    
    const showMoreBtn = container.querySelector('.show-more-btn');
    showMoreBtn.click();
    
    const newItems = container.querySelectorAll('.past-event-item').length;
    expect(newItems).toBeGreaterThan(initialItems);
  });

  // Test 8: Error handling
  test('handles fetch errors gracefully', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    component = new PastEventsComponent('past-events', '/data/events.json');
    await component.init();
    
    expect(container.innerHTML).toContain('Error loading events');
    expect(consoleSpy).toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });

  // Test 9: Empty events handling
  test('handles empty events list', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue([])
    });
    
    component = new PastEventsComponent('past-events', '/data/events.json');
    await component.init();
    
    expect(container.innerHTML).toContain('No past events found');
    expect(container.querySelector('.past-events-filter')).toBeFalsy();
  });

  // Test 10: Container not found error
  test('throws error when container not found', () => {
    expect(() => {
      new PastEventsComponent('non-existent', '/data/events.json');
    }).toThrow();
  });
});
