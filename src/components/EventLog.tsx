import type { SimulationEvent } from '../simulation/types'

interface EventLogProps {
  events: SimulationEvent[]
}

export function EventLog({ events }: EventLogProps) {
  const visibleEvents = [...events].reverse().slice(0, 14)
  return (
    <section className="panel-surface event-panel">
      <div className="section-heading"><div><p className="eyebrow">Auditoria visual</p><h2>Log de eventos</h2></div><span className="event-count">{events.length} registros</span></div>
      <div className="event-list">
        {visibleEvents.length === 0 ? <div className="empty-state"><span>⌁</span><p>Inicie a simulação para acompanhar cada transição do ciclo.</p></div> : visibleEvents.map((event) => (
          <div className={`event-item tone-${event.tone}`} key={event.id}>
            <span className="event-time">{event.time}</span><span className="event-mark" /><div><strong>{event.label}</strong><p>{event.message}</p></div>
          </div>
        ))}
      </div>
    </section>
  )
}
