'use client';

import { useEffect, useRef } from 'react';

export default function NetworkGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle details
    interface Node3D {
      x: number;
      y: number;
      z: number;
      px: number;
      py: number;
    }

    const nodes: Node3D[] = [];
    const nodeCount = 80; // Optimized from 140 for a 3x rendering performance boost

    // Generate points uniformly on a unit sphere (normalized radius = 1)
    for (let i = 0; i < nodeCount; i++) {
      const theta = Math.acos(Math.random() * 2 - 1);
      const phi = Math.random() * Math.PI * 2;

      nodes.push({
        x: Math.sin(theta) * Math.cos(phi),
        y: Math.sin(theta) * Math.sin(phi),
        z: Math.cos(theta),
        px: 0,
        py: 0
      });
    }

    let angleX = 0.002;
    let angleY = 0.003;
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left - width / 2;
      const y = e.clientY - rect.top - height / 2;
      mouseX = x;
      mouseY = y;
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    const rotateX = (node: Node3D, angle: number) => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const y1 = node.y * cos - node.z * sin;
      const z1 = node.z * cos + node.y * sin;
      node.y = y1;
      node.z = z1;
    };

    const rotateY = (node: Node3D, angle: number) => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const x1 = node.x * cos - node.z * sin;
      const z1 = node.z * cos + node.x * sin;
      node.x = x1;
      node.z = z1;
    };

    let animationFrameId: number;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Rotate nodes based on speed and mouse drag influence
      const currentAngleY = angleY + mouseX * 0.00001;
      const currentAngleX = angleX + mouseY * 0.00001;

      // Dynamically compute radius based on parent container dimension
      const currentRadius = Math.min(width, height) * 0.35;

      nodes.forEach((node) => {
        rotateY(node, currentAngleY);
        rotateX(node, currentAngleX);

        // Project normalized 3D coordinates scaled by currentRadius to 2D screen coordinates
        const fov = 400;
        const scaledZ = node.z * currentRadius;
        const scale = fov / (fov + scaledZ);
        node.px = (node.x * currentRadius) * scale + width / 2;
        node.py = (node.y * currentRadius) * scale + height / 2;
      });

      // Draw connection lines
      ctx.lineWidth = 0.5;
      for (let i = 0; i < nodeCount; i++) {
        const nodeA = nodes[i];
        if (nodeA.z > 0.5) continue; // hide points on back side for deep layering (using normalized z)

        for (let j = i + 1; j < nodeCount; j++) {
          const nodeB = nodes[j];
          if (nodeB.z > 0.5) continue;

          const dx = nodeA.px - nodeB.px;
          const dy = nodeA.py - nodeB.py;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Connect close nodes
          if (dist < 80) {
            const alpha = (1 - dist / 80) * 0.25 * (1 - (nodeA.z + 1) / 2);
            ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(nodeA.px, nodeA.py);
            ctx.lineTo(nodeB.px, nodeB.py);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      nodes.forEach((node) => {
        const opacity = 1 - (node.z + 1) / 2;
        ctx.fillStyle = `rgba(0, 240, 255, ${opacity * 0.8})`;
        ctx.shadowBlur = 4;
        ctx.shadowColor = '#00f0ff';
        ctx.beginPath();
        ctx.arc(node.px, node.py, (node.z < 0 ? 3 : 1.5), 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.shadowBlur = 0;

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 opacity-40">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
