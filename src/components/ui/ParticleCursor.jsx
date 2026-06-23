'use client';

import { useEffect, useRef } from 'react';

export default function ParticleCursor() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: -100, y: -100 };
    let animationId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 1.5 + 0.5; // Much smaller
        this.speedX = (Math.random() - 0.5) * 1; // Slower
        this.speedY = (Math.random() - 0.5) * 1;
        this.life = 1;
        this.decay = Math.random() * 0.03 + 0.02; // Faster decay

        // Subtle modern colors
        const colors = [
          { r: 255, g: 255, b: 255 },   // white
          { r: 124, g: 92, b: 252 },    // primary accent
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= this.decay;
        this.size *= 0.98;
      }

      draw(ctx) {
        if (this.life <= 0) return;
        ctx.save();
        ctx.globalAlpha = this.life * 0.4; // More transparent
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`;
        ctx.fill();

        // Subtle glow effect
        ctx.shadowBlur = 4;
        ctx.shadowColor = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0.3)`;
        ctx.fill();
        ctx.restore();
      }
    }

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      // Spawn 1 particle per move, with random chance
      if (Math.random() > 0.3) {
        particles.push(new Particle(mouse.x, mouse.y));
      }
    };

    const handleClick = (e) => {
      // Small burst of particles on click
      for (let i = 0; i < 6; i++) {
        const p = new Particle(e.clientX, e.clientY);
        p.speedX = (Math.random() - 0.5) * 4;
        p.speedY = (Math.random() - 0.5) * 4;
        p.size = Math.random() * 2 + 1;
        particles.push(p);
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, index) => {
        p.update();
        p.draw(ctx);
        if (p.life <= 0 || p.size <= 0.1) {
          particles.splice(index, 1);
        }
      });

      // Limit particles for performance and minimalism
      if (particles.length > 40) {
        particles = particles.slice(-40);
      }

      animationId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  );
}
