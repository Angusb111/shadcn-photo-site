"use client";

import { useEffect, useRef } from "react";

export function FloatingBlobs({ isOpen }: { isOpen: boolean }) {
  const blobCount = 12;
  const blobsRef = useRef<(HTMLDivElement | null)[]>([]);
  const blobsData = useRef<any[]>([]);
  const openRef = useRef(isOpen);

  // Keep ref updated
  useEffect(() => {
    openRef.current = isOpen;
  }, [isOpen]);

  // Initialize blobs + animation loop
  useEffect(() => {
    function randInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const minSpeed = 0.2;
    const maxSpeed = 0.3;

    // initialize blobs
    blobsData.current = Array.from({ length: blobCount }, () => {
      const size = 180;
      let vx = (Math.random() < 0.5 ? -1 : 1) * randInRange(minSpeed, maxSpeed);
      let vy = (Math.random() < 0.5 ? -1 : 1) * randInRange(minSpeed, maxSpeed);

      return {
        x: randInRange(0, window.innerWidth - size),
        y: randInRange(0, window.innerHeight - size),
        vx,
        vy,
        size,
        rotation: randInRange(0, 360),
        rotationSpeed: randInRange(-0.2, 0.2),
        opacity: 0.6,
      };
    });

    function moveBlobs() {
      const data = blobsData.current;

      for (let i = 0; i < data.length; i++) {
        const b = data[i];

        if (openRef.current) {
          // fly-away mode
          b.vx *= 1.05;
          b.vy *= 1.05;

          b.x += b.vx * 4;
          b.y += b.vy * 4;
          b.rotation += b.rotationSpeed * 3;

          b.opacity -= 0.01;
          if (b.opacity < 0) b.opacity = 0;
        } else {
          // normal float
          b.opacity += 0.01;
          if (b.opacity > 0.6) b.opacity = 0.6;

          b.vx += randInRange(-0.1, 0.1);
          b.vy += randInRange(-0.1, 0.1);

          // clamp velocities
          b.vx = Math.sign(b.vx) * Math.max(Math.abs(b.vx), minSpeed);
          b.vy = Math.sign(b.vy) * Math.max(Math.abs(b.vy), minSpeed);
          b.vx = Math.sign(b.vx) * Math.min(Math.abs(b.vx), maxSpeed);
          b.vy = Math.sign(b.vy) * Math.min(Math.abs(b.vy), maxSpeed);

          b.x += b.vx;
          b.y += b.vy;
          b.rotation += b.rotationSpeed;

          // wall collisions
          if (b.x <= 0 || b.x + b.size >= window.innerWidth) b.vx *= -1;
          if (b.y <= 0 || b.y + b.size >= window.innerHeight) b.vy *= -1;

          // blob collisions
          for (let j = i + 1; j < data.length; j++) {
            const b2 = data[j];
            const dx = b2.x - b.x;
            const dy = b2.y - b.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const radiusSum = b.size / 2 + b2.size / 2;

            if (dist < radiusSum) {
              [b.vx, b2.vx] = [b2.vx, b.vx];
              [b.vy, b2.vy] = [b2.vy, b.vy];

              // push apart slightly
              const overlap = radiusSum - dist;
              const nx = dx / dist;
              const ny = dy / dist;
              b.x -= nx * overlap / 2;
              b.y -= ny * overlap / 2;
              b2.x += nx * overlap / 2;
              b2.y += ny * overlap / 2;
            }
          }
        }
      }

      data.forEach((b, idx) => {
        const el = blobsRef.current[idx];
        if (el) {
          el.style.transform = `translate(${b.x}px, ${b.y}px) rotate(${b.rotation}deg)`;
          el.style.opacity = `${b.opacity}`;
        }
      });

      requestAnimationFrame(moveBlobs);
    }

    moveBlobs();
  }, []);

  // Reset blobs when dialog closes
  useEffect(() => {
    if (!isOpen && blobsData.current.length > 0) {
      const padding = 50;
      const minSpeed = 0.2;
      const maxSpeed = 0.3;

      blobsData.current.forEach((b) => {
        b.x = padding + Math.random() * (window.innerWidth - b.size - padding * 2);
        b.y = padding + Math.random() * (window.innerHeight - b.size - padding * 2);

        b.vx =
          (Math.random() < 0.5 ? -1 : 1) *
          (minSpeed + Math.random() * (maxSpeed - minSpeed));
        b.vy =
          (Math.random() < 0.5 ? -1 : 1) *
          (minSpeed + Math.random() * (maxSpeed - minSpeed));

        b.opacity = 0; // fade-in
      });
    }
  }, [isOpen]);

  const blobGradients = [
    "bg-gradient-to-r from-pink-500 via-purple-500 to-blue-800",
    "bg-gradient-to-r from-green-400 via-teal-400 to-cyan-400",
    "bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400",
    "bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500",
    "bg-gradient-to-r from-pink-400 via-red-400 to-yellow-400",
    "bg-gradient-to-r from-teal-400 via-green-400 to-lime-400",
    "bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400",
    "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500",
    "bg-gradient-to-r from-red-400 via-pink-400 to-purple-400",
    "bg-gradient-to-r from-cyan-400 via-teal-400 to-green-400",
  ];

  return (
    <div className="fixed inset-0 overflow-hidden z-0 pointer-events-none saturate-180">
      {Array.from({ length: blobCount }).map((_, idx) => (
        <div
          key={idx}
          ref={(el) => {
            blobsRef.current[idx] = el;
          }}
          className={`absolute size-[15vw] rounded-full blur-3xl origin-center ${
            blobGradients[idx % blobGradients.length]
          }`}
        />
      ))}
    </div>
  );
}