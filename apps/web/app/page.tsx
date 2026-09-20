import { colors, fontSizes, radii, spacing } from '@blackcinnamon/design-tokens';

import { fetchApiHealth, getApiBaseUrl } from '@/lib/api';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const api = await fetchApiHealth();

  return (
    <main
      style={{
        maxWidth: '960px',
        margin: '0 auto',
        padding: `${spacing['3xl']} ${spacing.xl}`,
        display: 'flex',
        flexDirection: 'column',
        gap: spacing.xl,
      }}
    >
      <header style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
        <h1
          style={{
            margin: 0,
            fontSize: fontSizes['4xl'],
            fontFamily: 'var(--font-family-display)',
          }}
        >
          BlackCinnamon
        </h1>
        <p style={{ margin: 0, color: colors.textMuted, fontSize: fontSizes.lg }}>
          Survival. Trading. Player-driven economy.
        </p>
      </header>

      <section
        aria-labelledby="status-heading"
        style={{
          border: `1px solid ${colors.border}`,
          borderRadius: radii.lg,
          background: colors.surface,
          padding: spacing.xl,
          display: 'flex',
          flexDirection: 'column',
          gap: spacing.sm,
        }}
      >
        <h2 id="status-heading" style={{ margin: 0, fontSize: fontSizes.xl }}>
          Platform status
        </h2>
        <p style={{ margin: 0, color: colors.textMuted }}>
          API ({getApiBaseUrl()}):{' '}
          <strong style={{ color: api.reachable ? colors.success : colors.danger }}>
            {api.reachable ? 'reachable' : 'unreachable'}
          </strong>
        </p>
        {api.error !== null && (
          <p style={{ margin: 0, color: colors.textMuted, fontSize: fontSizes.sm }}>{api.error}</p>
        )}
      </section>
    </main>
  );
}
