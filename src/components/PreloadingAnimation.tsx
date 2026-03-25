import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    gsap: any;
  }
}

export const PreloadingAnimation = () => {
  const animationCompleted = useRef(false);

  useEffect(() => {
    if (animationCompleted.current || !window.gsap) return;

    const gsap = window.gsap;
    const preloader = document.getElementById('preloader');
    const loaderText = document.getElementById('loader-text');
    const mainContent = document.getElementById('main-content');

    if (!preloader || !loaderText || !mainContent) return;

    // Words to cycle through (15 greetings - removed 5 for faster loading)
    const words = [
      'नमस्ते', // Start with Hindi Namaste
      'Hello',
      'Привет',
      'Hola',
      'Bonjour',
      'こんにちは',
      'Ciao',
      '여보세요',
      'Olá',
      '你好',
      'Hallo',
      'Szia',
      'Merhaba',
      'God dag',
      'Welcome',
    ];

    // Force body overflow hidden
    document.body.style.overflow = 'hidden';

    const timeline = gsap.timeline({
      onComplete: () => {
        animationCompleted.current = true;
        // Restore body overflow
        document.body.style.overflow = 'auto';
      },
    });

    // Phase 1: Cycle through words (Ultra-fast: 0.03s fade + 0.03s stagger, with delay after first word)
    const perWordDuration = 0.06; // 0.03s fade in + 0.03s stagger + 0.03s fade out (ultra-fast flickering)
    const firstWordDelay = 0.8; // Extra delay after first word (नमस्ते)

    words.forEach((word, index) => {
      const baseStartTime = index * perWordDuration;
      const startTime = index === 0 ? baseStartTime : baseStartTime + firstWordDelay;

      timeline.call(() => {
        loaderText.textContent = word;
      }, null, startTime);

      // Entrance: fade in and move up from y=20 to y=0
      timeline.fromTo(
        loaderText,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.03, ease: 'power2.out' },
        startTime
      );

      // Hold (longer for first word, short for others)
      const holdDuration = index === 0 ? 0.8 : 0.03; // 0.8s delay for first word, 0.03s for others
      timeline.to(loaderText, { opacity: 1, duration: holdDuration }, startTime + 0.03);

      // Exit: fade out and move up to y=-20
      const exitStartTime = startTime + 0.03 + holdDuration;
      timeline.to(
        loaderText,
        { opacity: 0, y: -20, duration: 0.03, ease: 'power2.in' },
        exitStartTime
      );
    });

    // Phase 2 & 3: Reveal and landing
    const totalWordTime = (words.length - 1) * perWordDuration + firstWordDelay + perWordDuration;

    timeline.to(
      preloader,
      {
        yPercent: -100,
        duration: 0.4,
        ease: 'expo.in',
      },
      totalWordTime
    );

    timeline.fromTo(
      mainContent,
      { opacity: 0, scale: 1.05 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: 'power4.out',
      },
      totalWordTime
    );

    // Skip button functionality (click anywhere after 0.5s)
    const skipHandler = () => {
      if (!animationCompleted.current) {
        timeline.progress(1);
        timeline.kill();
        animationCompleted.current = true;
        document.body.style.overflow = 'auto';
        preloader.removeEventListener('click', skipHandler);
      }
    };

    // Allow skip after 0.5s
    const skipTimeout = setTimeout(() => {
      preloader.addEventListener('click', skipHandler);
    }, 500);

    // Force completion after 4 seconds max (ultra-fast animation cycle)
    const maxTimeout = setTimeout(() => {
      if (!animationCompleted.current) {
        timeline.progress(1);
        timeline.kill();
        animationCompleted.current = true;
        document.body.style.overflow = 'auto';
      }
    }, 4000);

    return () => {
      clearTimeout(skipTimeout);
      clearTimeout(maxTimeout);
      preloader.removeEventListener('click', skipHandler);
      timeline.kill();
    };
  }, []);

  return null;
};
