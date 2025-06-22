import { EventModel } from '../event-model.js';

describe('EventModel', () => {
  it('throws if title is missing', () => {
    expect(() => new EventModel({ date: '2025-06-10' })).toThrow();
  });

  it('throws if date is invalid', () => {
    expect(() => new EventModel({ title: 'Test', date: '2025/06/10' })).toThrow();
  });

  it('sets defaults for optional fields', () => {
    const event = new EventModel({ title: 'Test', date: '2025-06-10' });
    expect(event.startTime).toBe('TBC');
    expect(event.endTime).toBe('');
    expect(event.location).toBe('TBC');
    expect(event.link).toBe('#');
  });

  it('assigns all fields from valid input', () => {
    const event = new EventModel({
      title: 'Test',
      date: '2025-06-10',
      startTime: '10:00',
      endTime: '12:00',
      location: 'Toronto',
      registrationLink: 'https://example.com'
    });
    expect(event.title).toBe('Test');
    expect(event.dateStr).toBe('2025-06-10');
    expect(event.startTime).toBe('10:00');
    expect(event.endTime).toBe('12:00');
    expect(event.location).toBe('Toronto');
    expect(event.link).toBe('https://example.com');
  });

  it('renders HTML with event details', () => {
    const event = new EventModel({ title: 'Test', date: '2025-06-10', location: 'Toronto' });
    const html = event.toHTML();
    expect(html).toContain('Test');
    expect(html).toContain('Toronto');
    expect(html).toContain('event-link');
  });
});