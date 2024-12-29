import { Injectable } from '@angular/core';
import confetti, { Options, Shape } from 'canvas-confetti';

@Injectable({
  providedIn: 'root',
})
export class ConfettiService {
  constructor() {}

  triggerCelebration(event?: MouseEvent) {
    const options = {
      particleCount: 30, // Reduced particles
      spread: 20, // Smaller spread area
      origin: {
        x: event ? event.clientX / window.innerWidth : 0.5, // Get mouse X position
        y: event ? event.clientY / window.innerHeight : 0.5, // Get mouse Y position
      },
      gravity: 2, // Increased gravity for faster fall
      ticks: 100, // Reduced ticks for shorter duration
      startVelocity: 20, // Increased velocity for faster movement
      scalar: 0.7, // Smaller particles
      shapes: ['square' as Shape], // Just squares for simpler effect
      colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42'],
      disableForReducedMotion: true, // Accessibility consideration
    };

    confetti(options);
  }

  // Optional: Method for multiple quick bursts
  triggerQuickBurst(event?: MouseEvent) {
    const burstCount = 2;
    for (let i = 0; i < burstCount; i++) {
      setTimeout(() => {
        this.triggerCelebration(event);
      }, i * 50); // 50ms delay between bursts
    }
  }

  triggerExplosion() {
    const count = 5; // Increased count
    const defaults: Options = {
      particleCount: 100, // More particles
      spread: 150, // Wider spread
      origin: { y: 0.7 }, // Slightly lower origin for better visibility
      colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42'],
      shapes: ['square' as Shape],
      scalar: 1.2, // Larger particles
      ticks: 200, // Longer duration
    };

    function fire(particleRatio: number, opts: Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio * 20), // More particles in each burst
      });
    }

    fire(0.25, {
      spread: 50,
      startVelocity: 65,
    });

    fire(0.3, {
      spread: 80,
      startVelocity: 50,
    });

    fire(0.4, {
      spread: 140,
      decay: 0.91,
    });

    fire(0.2, {
      spread: 180,
      startVelocity: 45,
      decay: 0.92,
    });

    fire(0.2, {
      spread: 160,
      startVelocity: 55,
    });
  }

  triggerCornerFalls() {
    const duration = 2000; // Longer duration
    const end = Date.now() + duration;
    const colors = ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42'];

    (function frame() {
      confetti({
        particleCount: 4, // More particles
        angle: 60,
        spread: 80, // Wider spread
        origin: { x: 0, y: 0.1 }, // Slightly lower for visibility
        colors: colors,
        shapes: ['square' as Shape],
        scalar: 1.2, // Larger particles
        ticks: 300, // Longer-lasting particles
        startVelocity: 45, // Faster initial velocity
      });

      confetti({
        particleCount: 4,
        angle: 120,
        spread: 80,
        origin: { x: 1, y: 0.1 },
        colors: colors,
        shapes: ['square' as Shape],
        scalar: 1.2,
        ticks: 300,
        startVelocity: 45,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }

  // Optional: Adjust the combined celebration timing
  triggerGrandCelebration() {
    this.triggerExplosion();
    setTimeout(() => {
      this.triggerCornerFalls();
    }, 300); // Slight delay for better visual effect
  }
}
