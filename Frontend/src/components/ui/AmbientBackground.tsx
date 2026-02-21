/**
 * AmbientBackground — Subtle animated gradient mesh + dot texture overlay.
 * Place inside a page wrapper with `position: relative` to create
 * ambient background effects. Uses pointer-events: none for zero
 * interference with user interactions.
 */
export default function AmbientBackground() {
  return (
    <>
      {/* Layer 1: Animated floating gradient orbs */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          background: [
            "radial-gradient(ellipse 600px 600px at 15% 20%, hsl(229 71% 50% / 0.055) 0%, transparent 70%)",
            "radial-gradient(ellipse 500px 500px at 85% 12%, hsl(24 95% 53% / 0.045) 0%, transparent 70%)",
            "radial-gradient(ellipse 450px 450px at 60% 85%, hsl(229 71% 50% / 0.04) 0%, transparent 70%)",
            "radial-gradient(ellipse 400px 400px at 20% 75%, hsl(24 95% 53% / 0.035) 0%, transparent 70%)",
          ].join(", "),
          animation: "ambientDrift 25s ease-in-out infinite alternate",
        }}
      />

      {/* Layer 2: Fine dot grid texture */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          opacity: 0.4,
          backgroundImage:
            "radial-gradient(circle 1px at center, hsl(229 20% 50% / 0.18) 0%, transparent 100%)",
          backgroundSize: "24px 24px",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
          maskImage:
            "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
        }}
      />
    </>
  );
}
