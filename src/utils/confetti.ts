/**
 * Wedding Celebration Confetti with golden glitters, hearts & ribbons
 */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  vRot: number;
  shape: 'rect' | 'circle' | 'heart';
  opacity: number;
}

export function triggerWeddingConfetti(isGrand = false) {
  if (typeof window === 'undefined') return;

  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    document.body.removeChild(canvas);
    return;
  }

  const width = (canvas.width = window.innerWidth);
  const height = (canvas.height = window.innerHeight);

  const colors = [
    '#E6C275', // Champagne Gold
    '#F7D78A', // Pale Gold
    '#B32638', // Wedding Crimson
    '#D94358', // Rose Pink
    '#FFF1CF', // Pearl Warm
    '#800020', // Burgundy
    '#FFFFFF', // Sparkling White
  ];

  const count = isGrand ? 160 : 80;
  const particles: Particle[] = [];

  for (let i = 0; i < count; i++) {
    const fromLeft = Math.random() < 0.5;
    const originX = fromLeft ? width * 0.15 + Math.random() * (width * 0.2) : width * 0.65 + Math.random() * (width * 0.2);
    const originY = height * 0.4 + Math.random() * (height * 0.2);

    const angle = fromLeft
      ? (Math.random() * 0.6 - 0.3) * Math.PI - Math.PI / 3
      : (Math.random() * 0.6 - 0.3) * Math.PI - (Math.PI * 2) / 3;

    const speed = 7 + Math.random() * 12;

    particles.push({
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed * (fromLeft ? 1 : -1),
      vy: Math.sin(angle) * speed - 5,
      size: 6 + Math.random() * 8,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 12,
      shape: Math.random() > 0.4 ? (Math.random() > 0.5 ? 'heart' : 'rect') : 'circle',
      opacity: 1,
    });
  }

  let animationFrameId: number;
  let frame = 0;

  function drawHeart(c: CanvasRenderingContext2D, x: number, y: number, size: number) {
    c.save();
    c.translate(x, y);
    c.beginPath();
    const topCurveHeight = size * 0.3;
    c.moveTo(0, topCurveHeight);
    // top left curve
    c.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
    // bottom left curve
    c.bezierCurveTo(-size / 2, (size + topCurveHeight) / 2, 0, (size + topCurveHeight) / 1.5, 0, size);
    // bottom right curve
    c.bezierCurveTo(0, (size + topCurveHeight) / 1.5, size / 2, (size + topCurveHeight) / 2, size / 2, topCurveHeight);
    // top right curve
    c.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
    c.closePath();
    c.fill();
    c.restore();
  }

  function render() {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);

    let activeParticles = 0;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      if (p.opacity <= 0.01) continue;

      activeParticles++;
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35; // gravity
      p.vx *= 0.985; // air drag
      p.rotation += p.vRot;
      p.opacity -= 0.008;

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.opacity);
      ctx.fillStyle = p.color;

      if (p.shape === 'heart') {
        drawHeart(ctx, p.x, p.y, p.size);
      } else if (p.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      }
      ctx.restore();
    }

    frame++;
    if (activeParticles > 0 && frame < 200) {
      animationFrameId = requestAnimationFrame(render);
    } else {
      cancelAnimationFrame(animationFrameId);
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    }
  }

  render();
}
