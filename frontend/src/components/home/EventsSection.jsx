import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './HomeSection.css';

export default function EventsSection({ apiBase, community, onViewAll }) {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    let mounted = true;
    
    const fetchEvents = async () => {
      setLoading(true);
      try {
        // Note: This assumes you'll create an /events endpoint
        // For now, it will gracefully fail and show empty state
        const response = await axios.get(`${apiBase}/events`, {
          params: { community, limit: 4, page: 1 }
        });
        
        if (mounted) {
          setEvents(response.data || []);
        }
      } catch (error) {
        // Silently fail - events endpoint might not exist yet
        console.log('Events endpoint not available yet');
        if (mounted) setEvents([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchEvents();
    return () => { mounted = false; };
  }, [apiBase, community]);

  // Don't render section at all if events endpoint doesn't exist
  if (!loading && events.length === 0) {
    return null;
  }

  if (loading) {
    return (
      <section className="home-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">📅 Upcoming Events</h2>
          </div>
          <div className="loading-state">Loading events...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="home-section events-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">📅 Upcoming Events</h2>
          <button 
            className="btn btn-text" 
            onClick={() => onViewAll?.('events')}
          >
            View All Events →
          </button>
        </div>

        <div className="event-list">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </section>
  );
}

function EventCard({ event }) {
  const formatEventDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-ZA', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="event-card card">
      <div className="event-date-badge">
        <div className="event-month">
          {event.date ? new Date(event.date).toLocaleDateString('en-ZA', { month: 'short' }) : 'TBD'}
        </div>
        <div className="event-day">
          {event.date ? new Date(event.date).getDate() : '?'}
        </div>
      </div>
      <div className="event-info">
        <h3 className="event-title">{event.title}</h3>
        {event.description && (
          <p className="event-desc">{event.description}</p>
        )}
        <div className="event-meta">
          {event.location && <span>📍 {event.location}</span>}
          {event.time && <span>🕐 {event.time}</span>}
        </div>
      </div>
    </div>
  );
}