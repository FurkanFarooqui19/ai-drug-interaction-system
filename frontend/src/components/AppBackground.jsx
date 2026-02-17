/**
 * Premium app background: glow blobs (optional) + noise via .bg-noise on parent.
 * Pure CSS, GPU-friendly. Set animated=true for subtle blob pulse (optional).
 */
export default function AppBackground({ children, glowBlobs = true, animated = false }) {
  return (
    <div className={`relative min-h-screen flex flex-col overflow-x-hidden ${animated ? 'bg-mesh-animated' : ''}`}>
      {/* Optional: soft glow blobs for depth (fixed, behind content) */}
      {glowBlobs && (
        <div className="fixed inset-0 pointer-events-none z-0" aria-hidden>
          <div
            className={`bg-glow-blob absolute -top-40 -right-40 w-[min(80vw,600px)] h-[min(80vw,600px)] rounded-full opacity-30 dark:opacity-20 ${animated ? 'animate-glow-slow' : ''}`}
            style={{
              background: 'radial-gradient(circle, rgba(56, 189, 248, 0.4) 0%, transparent 70%)',
              filter: 'blur(60px)',
            }}
          />
          <div
            className={`bg-glow-blob absolute top-1/2 -left-32 w-[min(60vw,400px)] h-[min(60vw,400px)] rounded-full opacity-20 dark:opacity-15 ${animated ? 'animate-glow-slow' : ''}`}
            style={{
              background: 'radial-gradient(circle, rgba(99, 102, 241, 0.35) 0%, transparent 70%)',
              filter: 'blur(50px)',
              ...(animated && { animationDelay: '-4s' }),
            }}
          />
          <div
            className={`bg-glow-blob absolute -bottom-32 left-1/3 w-[min(50vw,350px)] h-[min(50vw,350px)] rounded-full opacity-15 dark:opacity-10 ${animated ? 'animate-glow-slow' : ''}`}
            style={{
              background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)',
              filter: 'blur(55px)',
              animationDelay: animated ? '-8s' : undefined,
            }}
          />
        </div>
      )}
      <div className="relative z-10 flex flex-col min-h-screen">
        {children}
      </div>
    </div>
  )
}
