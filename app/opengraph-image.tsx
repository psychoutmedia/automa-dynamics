import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Automa Dynamics - Autonomous Intelligence'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Grid Pattern */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              linear-gradient(to right, rgba(139, 92, 246, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Gradient Orb */}
        <div
          style={{
            position: 'absolute',
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)',
            filter: 'blur(60px)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 24,
            position: 'relative',
            zIndex: 10,
          }}
        >
          {/* Logo Placeholder - Text Version */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: 16,
                background: 'linear-gradient(135deg, #e2e8f0 0%, #94a3b8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 32,
                fontWeight: 'bold',
                color: '#0f172a',
              }}
            >
              AD
            </div>
            <span
              style={{
                fontSize: 48,
                fontWeight: 'bold',
                background: 'linear-gradient(to right, #e2e8f0, #ffffff, #e2e8f0)',
                backgroundClip: 'text',
                color: 'transparent',
                letterSpacing: '0.05em',
              }}
            >
              AUTOMA DYNAMICS
            </span>
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: 24,
              color: '#94a3b8',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}
          >
            Pioneering Autonomous Intelligence
          </div>

          {/* Divider */}
          <div
            style={{
              width: 200,
              height: 2,
              background: 'linear-gradient(to right, transparent, #8b5cf6, transparent)',
            }}
          />

          {/* Mission */}
          <div
            style={{
              fontSize: 20,
              color: '#cbd5e1',
              textAlign: 'center',
              maxWidth: 600,
              lineHeight: 1.6,
            }}
          >
            Building the future of autonomous systems through advanced AI agents, 
            neural architectures, and intelligent automation.
          </div>
        </div>

        {/* Corner Accents */}
        <div
          style={{
            position: 'absolute',
            top: 40,
            left: 40,
            width: 60,
            height: 60,
            borderTop: '2px solid rgba(139, 92, 246, 0.5)',
            borderLeft: '2px solid rgba(139, 92, 246, 0.5)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            right: 40,
            width: 60,
            height: 60,
            borderBottom: '2px solid rgba(139, 92, 246, 0.5)',
            borderRight: '2px solid rgba(139, 92, 246, 0.5)',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  )
}
