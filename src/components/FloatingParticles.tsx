import { useMemo } from 'react';

const PARTICLE_COUNT = 40;
const AMBER = 'rgba(251, 191, 36, 0.55)';
const ZINC = 'rgba(212, 212, 216, 0.35)';

function Particle({ delay, duration, x, y, size, color }: {
  delay: number;
  duration: number;
  x: number;
  y: number;
  size: number;
  color: string;
}) {
  return (
    <div
      className="absolute rounded-full animate-float"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        backgroundColor: color,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
      }}
      aria-hidden
    />
  );
}

export default function FloatingParticles() {
  const particles = useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      id: i,
      delay: (i * 0.7) % 5,
      duration: 12 + (i % 7),
      x: (i * 17 + 11) % 94,
      y: (i * 23 + 7) % 92,
      size: 8 + (i % 5),
      color: i % 3 === 0 ? AMBER : ZINC,
    }));
  }, []);

  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
      aria-hidden
    >
      {particles.map((p) => (
        <Particle
          key={p.id}
          delay={p.delay}
          duration={p.duration}
          x={p.x}
          y={p.y}
          size={p.size}
          color={p.color}
        />
      ))}
    </div>
  );
}
