/**
 * App background — clean wrapper, design system handles background via CSS.
 * Keeps glow blobs subtle for depth without visual noise.
 */
export default function AppBackground({ children }) {
  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden">
      {children}
    </div>
  )
}
