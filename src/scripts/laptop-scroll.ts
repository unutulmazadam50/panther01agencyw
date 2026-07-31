import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const experience = document.querySelector<HTMLElement>('[data-laptop-experience]');
const orbit = document.querySelector<HTMLElement>('[data-laptop-orbit]');
const heroCopy = document.querySelector<HTMLElement>('[data-hero-copy]');
const ambient = document.querySelector<HTMLElement>('.hero-ambient');
const redField = document.querySelector<HTMLElement>('[data-red-field]');
const story = document.querySelector<HTMLElement>('[data-screen-story]');
const scrollCue = document.querySelector<HTMLElement>('[data-scroll-cue]');
const screenPanels = Array.from(document.querySelectorAll<HTMLElement>('[data-screen]'));
const captions = Array.from(document.querySelectorAll<HTMLElement>('[data-caption]'));
const controls = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-screen-control]'));
const scan = document.querySelector<HTMLElement>('.screen-scan');

let activeScreen = 0;
let scanTimer = 0;

const setScreen = (index: number, animate = true) => {
  if (!screenPanels[index]) return;
  const changed = index !== activeScreen;
  activeScreen = index;

  screenPanels.forEach((panel, panelIndex) => {
    panel.classList.toggle('is-visible', panelIndex === index);
    panel.setAttribute('aria-hidden', panelIndex === index ? 'false' : 'true');
  });

  captions.forEach((caption, captionIndex) => {
    caption.classList.toggle('is-active', captionIndex === index);
  });

  controls.forEach((control, controlIndex) => {
    const isActive = controlIndex === index;
    control.classList.toggle('is-active', isActive);
    control.setAttribute('aria-selected', isActive ? 'true' : 'false');
    control.tabIndex = isActive ? 0 : -1;
  });

  if (changed && animate && scan) {
    window.clearTimeout(scanTimer);
    scan.classList.remove('is-scanning');
    requestAnimationFrame(() => scan.classList.add('is-scanning'));
    scanTimer = window.setTimeout(() => scan.classList.remove('is-scanning'), 420);
  }
};

controls.forEach((control, index) => {
  control.addEventListener('click', () => setScreen(index));
  control.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const direction = event.key === 'ArrowRight' ? 1 : -1;
    const next = (index + direction + controls.length) % controls.length;
    controls[next]?.focus();
    setScreen(next);
  });
});

requestAnimationFrame(() => {
  experience?.classList.add('is-ready');
  document.querySelector<HTMLElement>('[data-header]')?.classList.add('is-ready');
});

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (experience && orbit && heroCopy && ambient && story && !prefersReducedMotion.matches) {
  const media = gsap.matchMedia();

  media.add(
    {
      desktop: '(min-width: 880px)',
      tablet: '(min-width: 621px) and (max-width: 879px)',
      mobile: '(max-width: 620px)',
      mobileLandscape: '(max-width: 879px) and (max-height: 540px) and (orientation: landscape)',
    },
    (context) => {
      const conditions = context.conditions as Record<string, boolean>;
      const isMobile = conditions.mobile || conditions.mobileLandscape;

      if (isMobile) {
        gsap.set(orbit, {
          xPercent: 0,
          yPercent: 72,
          rotationX: -3,
          rotationY: -8,
          rotationZ: 1.5,
          scale: 0.84,
          opacity: 0,
        });
        gsap.set(redField, {
          clipPath: 'inset(92% 0% 0% 0%)',
          x: 0,
          xPercent: 0,
          scaleX: 1,
          opacity: 1,
        });
        gsap.set(ambient, { opacity: 0, scale: 0.78 });
        gsap.set(story, { opacity: 0 });

        const mobileTimeline = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: experience,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.65,
            invalidateOnRefresh: true,
            onUpdate: ({ progress }) => {
              const index = progress < 0.64 ? 0 : progress < 0.82 ? 1 : 2;
              setScreen(index);
            },
          },
        });

        mobileTimeline
          .to(
            heroCopy,
            {
              yPercent: -12,
              opacity: 0,
              filter: 'blur(4px)',
              duration: 0.14,
            },
            0.07,
          )
          .to(
            scrollCue,
            {
              opacity: 0,
              duration: 0.06,
            },
            0.02,
          )
          .to(
            redField,
            {
              clipPath: 'inset(0% 0% 0% 0%)',
              duration: 0.24,
            },
            0.17,
          )
          .to(
            ambient,
            {
              opacity: 0.82,
              scale: 1,
              duration: 0.28,
            },
            0.2,
          )
          .to(
            orbit,
            {
              yPercent: -5,
              rotationX: -2,
              rotationY: -6,
              rotationZ: 1,
              scale: 0.93,
              opacity: 1,
              duration: 0.3,
            },
            0.22,
          )
          .to(
            orbit,
            {
              yPercent: -9,
              rotationX: 0,
              rotationY: 0,
              rotationZ: 0,
              scale: 0.97,
              duration: 0.34,
            },
            0.5,
          )
          .to(
            story,
            {
              opacity: 1,
              duration: 0.12,
            },
            0.5,
          );

        return () => {
          mobileTimeline.scrollTrigger?.kill();
          mobileTimeline.kill();
          gsap.set([orbit, redField, ambient, story, heroCopy, scrollCue], { clearProps: 'all' });
        };
      }

      const targetX = conditions.desktop ? -41 : conditions.tablet ? -19 : -8;
      const targetY = conditions.desktop ? 8 : conditions.tablet ? -2 : -22;
      const targetScale = conditions.desktop ? 1.06 : conditions.tablet ? 1.02 : 0.94;

      const timeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: experience,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.7,
          invalidateOnRefresh: true,
          onUpdate: ({ progress }) => {
            const index = progress < 0.59 ? 0 : progress < 0.79 ? 1 : 2;
            setScreen(index);
          },
        },
      });

      timeline
        .to(
          heroCopy,
          {
            yPercent: conditions.mobile ? -18 : -28,
            opacity: 0,
            filter: 'blur(5px)',
            duration: 0.2,
          },
          0.06,
        )
        .to(
          scrollCue,
          {
            opacity: 0,
            duration: 0.08,
          },
          0.02,
        )
        .to(
          orbit,
          {
            xPercent: targetX,
            yPercent: targetY,
            rotationX: 0,
            rotationY: 0,
            rotationZ: 0,
            scale: targetScale,
            duration: 0.36,
          },
          0.08,
        )
        .to(
          ambient,
          {
            xPercent: conditions.desktop ? -22 : -7,
            opacity: 0.72,
            scale: 0.88,
            duration: 0.36,
          },
          0.08,
        )
        .to(
          redField,
          {
            xPercent: conditions.desktop ? 6 : 2,
            scaleX: conditions.desktop ? 0.9 : 0.96,
            opacity: conditions.mobile ? 0.82 : 0.72,
            duration: 0.46,
          },
          0.08,
        )
        .to(
          story,
          {
            opacity: 1,
            duration: 0.12,
          },
          0.39,
        )
        .to(
          orbit,
          {
            yPercent: targetY - (conditions.mobile ? 1 : 3),
            scale: targetScale + (conditions.mobile ? 0.02 : 0.05),
            duration: 0.47,
          },
          0.45,
        );

      return () => {
        timeline.scrollTrigger?.kill();
        timeline.kill();
      };
    },
  );

  document.fonts.ready.then(() => ScrollTrigger.refresh());
}

const flowLine = document.querySelector<SVGPathElement>('[data-flow-line]');
if (flowLine && !prefersReducedMotion.matches) {
  gsap.to(flowLine, {
    strokeDashoffset: 0,
    ease: 'none',
    scrollTrigger: {
      trigger: '.automation-map',
      start: 'top 82%',
      end: 'bottom 68%',
      scrub: 0.6,
    },
  });
}

setScreen(0, false);
