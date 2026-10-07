const ROWS = [
  { computer: 'CPU',            delivery: 'Manager',              compIcon: '🖥️', delIcon: '👔', compColor: '#3b82f6' },
  { computer: 'DMA Controller', delivery: 'Delivery Agent',       compIcon: '🔧', delIcon: '🚚', compColor: '#f59e0b' },
  { computer: 'I/O Device',     delivery: 'Warehouse',            compIcon: '💾', delIcon: '🏭', compColor: '#8b5cf6' },
  { computer: 'RAM',            delivery: 'Destination',          compIcon: '🗄️', delIcon: '🏠', compColor: '#10b981' },
  { computer: 'Data',           delivery: 'Packages',             compIcon: '📊', delIcon: '📦', compColor: '#ec4899' },
  { computer: 'System Bus',     delivery: 'Road / Route',         compIcon: '⚡', delIcon: '🛣️', compColor: '#64748b' },
  { computer: 'Interrupt',      delivery: 'Delivery Confirmation',compIcon: '📡', delIcon: '🔔', compColor: '#f97316' },
];

export default function DeliveryAnalogy() {
  return (
    <section style={{ marginTop: '2.5rem' }}>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '0.4rem', textAlign: 'center' }}>
        Think of DMA Like a Delivery Service
      </h2>
      <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
        A simple analogy to make the concept click
      </p>

      <div
        style={{
          background: '#1e293b',
          border: '1px solid #334155',
          borderRadius: 16,
          overflow: 'hidden',
        }}
      >
        {/* Table header */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            background: '#0f172a',
            padding: '0.6rem 1.25rem',
            borderBottom: '1px solid #334155',
          }}
        >
          <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#3b82f6', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            💻 Computer
          </div>
          <div style={{ width: 32 }} />
          <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#f59e0b', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            🚚 Delivery Service
          </div>
        </div>

        {/* Rows */}
        {ROWS.map((row, i) => (
          <div
            key={row.computer}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto 1fr',
              padding: '0.65rem 1.25rem',
              alignItems: 'center',
              borderBottom: i < ROWS.length - 1 ? '1px solid #1e293b' : 'none',
              background: i % 2 === 0 ? 'transparent' : '#0f172a08',
              transition: 'background 0.2s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.background = `${row.compColor}10`}
            onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : '#0f172a08'}
          >
            {/* Computer column */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.1rem' }}>{row.compIcon}</span>
              <span style={{ fontWeight: 600, fontSize: '0.88rem', color: row.compColor }}>
                {row.computer}
              </span>
            </div>

            {/* Arrow */}
            <div style={{ color: '#334155', fontSize: '1rem', textAlign: 'center' }}>⟷</div>

            {/* Delivery column */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.1rem' }}>{row.delIcon}</span>
              <span style={{ fontSize: '0.88rem', color: '#94a3b8' }}>
                {row.delivery}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
