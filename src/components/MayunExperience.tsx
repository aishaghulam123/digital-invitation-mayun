import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { PetalField } from "@/lib/petals";
import { AmbientAudio } from "@/lib/ambient-audio";
import fabric from "@/assets/fabric.jpg";
import courtyard from "@/assets/courtyard.jpg";
import haldi from "@/assets/haldi.jpg";
import venue from "@/assets/venue.jpg";
import bangles from "@/assets/bangles.jpg";
import childhood from "@/assets/childhood-01.jpg";
import family from "@/assets/family-01.jpg";
import areeba from "@/assets/areeba-current.jpg";

const split = (text: string, cls = "") =>
  text.split(" ").map((w, wi, arr) => (
    <span key={wi} className="inline-block whitespace-nowrap">
      {w.split("").map((c, i) => (
        <span key={i} className={`inline-block will-change-transform ${cls}`} data-ch>{c}</span>
      ))}
      {wi < arr.length - 1 && <span className="inline-block" data-ch>{"\u00A0"}</span>}
    </span>
  ));

const montage = [
  { src: bangles, word: "A LITTLE SUNSHINE." },
  { src: haldi, word: "A LOT OF LOVE." },
  { src: fabric, word: "ONE BEAUTIFUL MORNING." },
  { src: areeba, word: "MAYUN" },
];

const story = [
  { src: childhood, label: "childhood-01.jpg", line: "She was once the little girl everyone watched grow." },
  { src: family, label: "family-01.jpg", line: "She grew up surrounded by the people who loved her." },
  { src: areeba, label: "areeba-current.jpg", line: "…that little girl is getting married." },
];

export function MayunExperience() {
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const audio = useRef<AmbientAudio | null>(null);
  const [sound, setSound] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const petals = new PetalField(canvas.current!);
    petals.ambient = 0;
    audio.current = new AmbientAudio();

    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    window.scrollTo(0, 0);
    lenis.stop();

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);

      /* 01 — HOOK */
      const intro = gsap.timeline({ onComplete: () => { lenis.start(); petals.ambient = 0.12; } });
      intro
        .fromTo(q(".fab-a"), { xPercent: 120, skewX: -18 }, { xPercent: -130, skewX: 8, duration: 0.85, ease: "power3.inOut" }, 0)
        .fromTo(q(".fab-b"), { xPercent: -130, skewX: 14 }, { xPercent: 130, duration: 0.9, ease: "power3.inOut" }, 0.1)
        .from(q(".l1 [data-ch]"), { yPercent: 120, rotate: 8, opacity: 0, stagger: 0.025, duration: 0.5, ease: "power4.out" }, 0.75)
        .add(() => petals.burst(window.innerWidth / 2, window.innerHeight / 2, reduce ? 30 : 260), 1.85)
        .to(q(".l1 [data-ch]"), {
          x: () => gsap.utils.random(-400, 400), y: () => gsap.utils.random(-300, 300),
          rotate: () => gsap.utils.random(-180, 180), scale: 2.5, opacity: 0, filter: "blur(6px)",
          duration: 0.6, ease: "power2.in", stagger: { each: 0.008, from: "center" },
        }, 1.8)
        .fromTo(q(".l2"), { opacity: 0, letterSpacing: "0.9em" }, { opacity: 1, letterSpacing: "0.35em", duration: 0.5 }, 2.35)
        .to(q(".l2"), { opacity: 0, y: -30, duration: 0.25 }, 2.9)
        .fromTo(q(".l3"), { scale: 1.8, opacity: 0, filter: "blur(18px)", clipPath: "inset(45% 0 45% 0)" },
          { scale: 1, opacity: 1, filter: "blur(0px)", clipPath: "inset(0% 0 0% 0)", duration: 1, ease: "expo.out" }, 3)
        .from(q(".l4"), { opacity: 0, y: 20, duration: 0.6 }, 3.6)
        .from(q(".cue"), { opacity: 0, duration: 0.5 }, 3.9);

      gsap.to(q(".l3"), {
        scale: 6, opacity: 0, ease: "none",
        scrollTrigger: { trigger: ".s-hook", start: "top top", end: "bottom top", scrub: true },
      });

      /* 02 — HOUSE WAKES UP */
      const house = gsap.timeline({ scrollTrigger: { trigger: ".s-house", start: "top top", end: "+=180%", scrub: 1, pin: true } });
      house
        .fromTo(q(".house-img"), { scale: 1.45, yPercent: 6 }, { scale: 1.05, yPercent: -4, ease: "none" }, 0)
        .fromTo(q(".house-fg"), { scale: 1.3, xPercent: -8 }, { scale: 1.8, xPercent: 12, opacity: 0, ease: "none" }, 0)
        .fromTo(q(".sun"), { xPercent: -60 }, { xPercent: 60, ease: "none" }, 0)
        .from(q(".house-t1"), { opacity: 0, y: 40, duration: 0.2 }, 0.1)
        .to(q(".house-t1"), { opacity: 0, y: -40, duration: 0.2 }, 0.45)
        .from(q(".house-t2"), { opacity: 0, y: 40, duration: 0.2 }, 0.55);

      /* 03 — MONTAGE */
      const mont = gsap.timeline({ scrollTrigger: { trigger: ".s-montage", start: "top top", end: "+=260%", scrub: 0.6, pin: true } });
      q(".m-frame").forEach((el, i) => {
        if (i > 0) mont.fromTo(el, { clipPath: i % 2 ? "inset(0 0 100% 0)" : "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0% 0)", duration: 0.35, ease: "power3.inOut" });
        mont.fromTo(el.querySelector("img"), { scale: 1.3 }, { scale: 1, duration: 0.6, ease: "none" }, "<");
        mont.fromTo(el.querySelector(".m-word"), { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.25 }, "<0.1");
      });

      /* 04 — HALDI */
      const hal = gsap.timeline({ scrollTrigger: { trigger: ".s-haldi", start: "top top", end: "+=220%", scrub: 1, pin: true } });
      hal
        .fromTo(q(".haldi-img"), { scale: 1 }, { scale: 1.6, rotate: -6, transformOrigin: "50% 45%", ease: "power1.in", duration: 0.5 }, 0)
        .fromTo(q(".spill"), { attr: { r: 0 } }, { attr: { r: 1600 }, ease: "power2.in", duration: 0.45 }, 0.3)
        .fromTo(q(".spill-drop"), { attr: { r: 0 } }, { attr: { r: 260 }, duration: 0.3 }, 0.25)
        .from(q(".haldi-t [data-ch]"), { opacity: 0, yPercent: 80, stagger: 0.01, duration: 0.2 }, 0.78);

      /* 05 — STORY */
      const st = gsap.timeline({ scrollTrigger: { trigger: ".s-story", start: "top top", end: "+=360%", scrub: 1, pin: true } });
      const frames = q(".story-img") as HTMLElement[];
      const lines = q(".story-line") as HTMLElement[];
      st.from(frames[0]!, { opacity: 0, scale: 1.15, filter: "blur(20px)", duration: 0.4 })
        .from(lines[0]!, { opacity: 0, y: 30, duration: 0.3 }, "<0.2")
        .to(lines[0]!, { opacity: 0, y: -30, duration: 0.25 }, "+=0.3")
        .fromTo(frames[1]!, { opacity: 0, clipPath: "circle(0% at 50% 50%)", filter: "blur(12px)" }, { opacity: 1, clipPath: "circle(75% at 50% 50%)", filter: "blur(0px)", duration: 0.5 }, "<")
        .from(lines[1]!, { opacity: 0, y: 30, duration: 0.3 }, "<0.25")
        .to(lines[1]!, { opacity: 0, y: -30, duration: 0.25 }, "+=0.3")
        .from(q(".story-and"), { opacity: 0, letterSpacing: "0.6em", duration: 0.35 })
        .to(q(".story-and"), { opacity: 0, duration: 0.2 }, "+=0.3")
        .fromTo(frames[2]!, { opacity: 0, scale: 1.25, filter: "blur(24px) brightness(1.6)" }, { opacity: 1, scale: 1, filter: "blur(0px) brightness(1)", duration: 0.6 })
        .from(lines[2]!, { opacity: 0, y: 30, duration: 0.3 }, "<0.3")
        .to(q(".leak"), { opacity: 0.7, xPercent: 40, duration: 0.6 }, 0);

      /* 06 — BLOOM */
      const bl = gsap.timeline({ scrollTrigger: { trigger: ".s-bloom", start: "top top", end: "+=260%", scrub: 1, pin: true,
        onEnter: () => petals.burst(window.innerWidth / 2, window.innerHeight / 2, 90) } });
      const stack = q(".stack-card");
      bl.from(stack, { z: -600, opacity: 0, stagger: 0.08, duration: 0.3 })
        .to(stack, { rotateY: (i: number) => [-25, 0, 25][i] ?? 0, rotateZ: (i: number) => [-12, 2, 14][i] ?? 0, x: (i: number) => [-90, 0, 90][i] ?? 0, duration: 0.3 })
        .to(stack, { x: 0, rotateZ: (i) => i * 120, scale: 0.15, opacity: 0, duration: 0.35, ease: "power2.in" })
        .fromTo(q(".petal"), { scale: 0, rotate: -90, transformOrigin: "50% 100%" }, { scale: 1, rotate: 0, stagger: 0.025, duration: 0.4, ease: "back.out(1.4)" }, "<0.15")
        .to(q(".bloom-svg"), { rotate: 30, scale: 1.15, duration: 0.6 }, "<")
        .from(q(".bloom-t"), { opacity: 0, y: 20, scale: 0.9, stagger: 0.12, duration: 0.25 }, "<0.3");

      /* 07 — DETAILS */
      q(".detail").forEach((el) => {
        gsap.from(el, { opacity: 0, y: 50, clipPath: "inset(0 0 100% 0)", duration: 1.1, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%" } });
      });
      q(".rule").forEach((el) => {
        gsap.from(el, { scaleX: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 90%" } });
      });

      /* 08 — CALENDAR */
      const cal = gsap.timeline({ scrollTrigger: { trigger: ".s-cal", start: "top top", end: "+=220%", scrub: 0.8, pin: true } });
      cal.to(q(".page-oct"), { rotateX: -105, opacity: 0, duration: 0.3, ease: "power2.in" })
        .to(q(".page-nov"), { rotateX: -105, opacity: 0, duration: 0.3, ease: "power2.in" })
        .fromTo(q(".brush-14"), { strokeDashoffset: 1000 }, { strokeDashoffset: 0, duration: 0.4 })
        .from(q(".cal-big"), { opacity: 0, y: 30, duration: 0.25 }, "<0.2")
        .fromTo(q(".brush-wide"), { scaleX: 0 }, { scaleX: 1, transformOrigin: "left center", duration: 0.45, ease: "power2.inOut" });

      /* 09 — CLOCK */
      const clk = gsap.timeline({ scrollTrigger: { trigger: ".s-clock", start: "top top", end: "+=240%", scrub: 1, pin: true } });
      clk.fromTo(q(".clock-ring"), { strokeDashoffset: 1300 }, { strokeDashoffset: 0, duration: 0.25 })
        .from(q(".tick"), { opacity: 0, stagger: 0.01, duration: 0.1 }, "<0.1")
        .fromTo(q(".hand-m"), { rotate: 0 }, { rotate: 360 * 7, svgOrigin: "200 200", duration: 0.55, ease: "power3.inOut" })
        .fromTo(q(".hand-h"), { rotate: -150 }, { rotate: 210, svgOrigin: "200 200", duration: 0.55, ease: "power3.inOut" }, "<")
        .to(q(".clock-blur"), { opacity: 1, duration: 0.25, yoyo: true, repeat: 1 }, "<0.05")
        .from(q(".clock-t1"), { opacity: 0, y: 20, duration: 0.15 })
        .from(q(".clock-t2"), { opacity: 0, scale: 1.3, duration: 0.15 });

      /* 10 — VENUE */
      const ven = gsap.timeline({ scrollTrigger: { trigger: ".s-venue", start: "top top", end: "+=260%", scrub: 1, pin: true } });
      ven.fromTo(q(".branch"), { strokeDashoffset: 800 }, { strokeDashoffset: 0, duration: 0.2 })
        .to(q(".branches"), { scale: 3, opacity: 0, duration: 0.3, ease: "power2.in" })
        .fromTo(q(".venue-img"), { scale: 1.5 }, { scale: 1, duration: 0.4 }, "<")
        .from(q(".venue-name"), { opacity: 0, y: 30, duration: 0.15 }, "<0.2")
        .to(q(".venue-name"), { opacity: 0, duration: 0.1 }, "+=0.05")
        .fromTo(q(".door-wrap"), { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.15 })
        .to(q(".door-l"), { rotateY: -105, duration: 0.3 }, ">")
        .to(q(".door-r"), { rotateY: 105, duration: 0.3 }, "<")
        .fromTo(q(".route"), { strokeDashoffset: 600 }, { strokeDashoffset: 0, duration: 0.3 }, "<0.15")
        .from(q(".addr"), { opacity: 0, y: 12, stagger: 0.05, duration: 0.15 }, "<0.1");

      /* 11 — CLIMAX */
      const cl = gsap.timeline({ scrollTrigger: { trigger: ".s-climax", start: "top top", end: "+=240%", scrub: 1, pin: true,
        onEnter: () => { petals.ambient = 0; audio.current?.setLevel(0.25); },
        onLeave: () => { petals.ambient = 0.3; audio.current?.setLevel(1); },
        onEnterBack: () => { petals.ambient = 0; audio.current?.setLevel(0.25); },
        onLeaveBack: () => { petals.ambient = 0.12; audio.current?.setLevel(1); } } });
      cl.from(q(".c1"), { opacity: 0, filter: "blur(8px)", duration: 0.3 })
        .to(q(".c1"), { opacity: 0.25, duration: 0.2 }, "+=0.2")
        .from(q(".c2"), { opacity: 0, filter: "blur(8px)", duration: 0.3 })
        .to([q(".c1"), q(".c2")], { opacity: 0, duration: 0.2 }, "+=0.25")
        .from(q(".c3 [data-ch]"), { opacity: 0, yPercent: 100, stagger: 0.04, duration: 0.3, ease: "power4.out" });

      /* 12 — FINALE */
      const fin = gsap.timeline({ scrollTrigger: { trigger: ".s-finale", start: "top 60%",
        onEnter: () => petals.burst(window.innerWidth / 2, window.innerHeight * 0.4, reduce ? 30 : 200) } });
      fin.fromTo(q(".fin-bg"), { scale: 1.4 }, { scale: 1, duration: 3, ease: "power2.out" }, 0)
        .from(q(".fin-line"), { opacity: 0, y: 30, stagger: 0.12, duration: 0.9, ease: "power3.out" }, 0.3)
        .from(q(".fin-mayun"), { opacity: 0, letterSpacing: "1em", duration: 1.6 }, 1.4);
    }, root);

    return () => {
      ctx.revert();
      gsap.ticker.remove(tick);
      lenis.destroy();
      petals.destroy();
    };
  }, []);

  const toggleSound = () => setSound(audio.current?.toggle() ?? false);

  return (
    <div ref={root} className="grain relative bg-ink text-ivory">
      <canvas ref={canvas} className="pointer-events-none fixed inset-0 z-40 h-full w-full" aria-hidden />

      <button
        onClick={toggleSound}
        aria-label={sound ? "Mute ambient sound" : "Play ambient sound"}
        className="eyebrow fixed right-4 top-4 z-50 flex items-center gap-2 rounded-full border border-gold/50 bg-ink/60 px-4 py-2 text-ivory backdrop-blur-md transition-colors hover:bg-mustard hover:text-ink"
      >
        <span className="flex h-3 items-end gap-[2px]">
          {[0, 1, 2].map((i) => (
            <span key={i} className={`w-[2px] bg-current ${sound ? "animate-pulse" : ""}`} style={{ height: sound ? `${6 + i * 3}px` : "3px" }} />
          ))}
        </span>
        {sound ? "Sound on" : "Sound off"}
      </button>

      {/* 01 HOOK */}
      <section className="s-hook relative flex h-svh items-center justify-center overflow-hidden bg-ink">
        <div className="absolute inset-0 flex items-center justify-center px-4 text-center">
          <h1 className="l1 display text-[13vw] uppercase leading-none text-ivory md:text-[9vw]">
            <span className="block">{split("She's getting")}</span>
            <span className="block italic text-mustard">{split("married.")}</span>
          </h1>
        </div>
        <p className="l2 eyebrow absolute text-lg text-gold opacity-0 md:text-2xl">But first…</p>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h2 className="l3 display text-[30vw] font-light uppercase text-mustard opacity-0 md:text-[22vw]">Mayun</h2>
          <p className="l4 eyebrow mt-2 text-gold">The morning before forever</p>
        </div>
        <img src={fabric} alt="" className="fab-a absolute inset-y-0 left-0 h-full w-[160%] max-w-none object-cover" />
        <img src={fabric} alt="" className="fab-b absolute inset-y-[18%] left-0 h-[64%] w-[150%] max-w-none object-cover opacity-80 mix-blend-screen" />
        <div className="cue eyebrow absolute bottom-8 flex flex-col items-center gap-3 text-gold/80">
          Scroll
          <span className="h-10 w-px animate-pulse bg-gold/70" />
        </div>
      </section>

      {/* 02 HOUSE */}
      <section className="s-house relative h-svh overflow-hidden">
        <img src={courtyard} alt="A sunlit courtyard house dressed in mustard textiles and marigolds" className="house-img absolute inset-0 h-full w-full object-cover" width={1088} height={1600} />
        <div className="sun absolute inset-0" style={{ background: "var(--gradient-sun)", mixBlendMode: "screen" }} />
        <div className="curtain absolute -top-10 left-0 h-[115%] w-[26%]" />
        <div className="curtain absolute -top-10 right-0 h-[115%] w-[20%]" style={{ animationDelay: "-3s" }} />
        <div className="house-fg absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,var(--ink)_100%)]" />
        {Array.from({ length: 26 }).map((_, i) => (
          <span key={i} className="dust" style={{ left: `${(i * 37) % 100}%`, top: `${30 + ((i * 53) % 60)}%`, animationDelay: `${-i * 0.7}s` }} />
        ))}
        <div className="vignette absolute inset-0" />
        <div className="absolute inset-x-0 bottom-[14%] px-6 text-center">
          <p className="house-t1 display text-5xl italic md:text-7xl">The house wakes up.</p>
          <p className="house-t2 absolute inset-x-6 top-0 display text-4xl md:text-6xl">
            Before the music gets louder,<br /><span className="text-mustard italic">there is the morning.</span>
          </p>
        </div>
      </section>

      {/* 03 MONTAGE */}
      <section className="s-montage relative h-svh overflow-hidden bg-ink">
        {montage.map((m, i) => (
          <div key={i} className="m-frame absolute inset-0 overflow-hidden" style={{ zIndex: i }}>
            <img src={m.src} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-ink/35" />
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden px-6">
              <h3 className={`m-word display text-center uppercase ${m.word === "MAYUN" ? "text-[26vw] text-mustard md:text-[18vw]" : "text-[12vw] md:text-[7vw]"}`}>
                {m.word}
              </h3>
            </div>
          </div>
        ))}
      </section>

      {/* 04 HALDI */}
      <section className="s-haldi relative h-svh overflow-hidden bg-ivory">
        <img src={haldi} alt="A ceramic bowl of haldi on a brass tray" className="haldi-img absolute inset-0 h-full w-full object-cover" loading="lazy" />
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice" aria-hidden>
          <defs>
            <filter id="liquid">
              <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" seed="4" />
              <feDisplacementMap in="SourceGraphic" scale="120" />
            </filter>
          </defs>
          <g filter="url(#liquid)" fill="var(--mustard)">
            <circle className="spill-drop" cx="520" cy="560" r="0" />
            <circle className="spill" cx="520" cy="560" r="0" />
          </g>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
          <h3 className="haldi-t display text-[11vw] italic text-brown md:text-[6.5vw]">{split("Before she became a bride…")}</h3>
        </div>
      </section>

      {/* 05 STORY */}
      <section className="s-story relative h-svh overflow-hidden bg-brown">
        <div className="leak absolute -left-1/2 top-0 h-full w-full opacity-0 blur-3xl" style={{ background: "radial-gradient(circle, var(--terracotta), transparent 60%)" }} />
        <div className="absolute left-1/2 top-[12%] w-[72vw] max-w-sm -translate-x-1/2 md:top-[10%]">
          <div className="photo-frame relative aspect-[4/5] -rotate-2">
            {story.map((s) => (
              <figure key={s.label} className="story-img absolute inset-[0.6rem] bottom-[2.2rem] overflow-hidden">
                <img src={s.src} alt={s.label} className="h-full w-full object-cover sepia-[.25]" loading="lazy" />
                <figcaption className="absolute -bottom-7 left-0 font-script text-lg text-brown">{s.label.replace(".jpg", "")}</figcaption>
              </figure>
            ))}
          </div>
        </div>
        <div className="absolute inset-x-6 bottom-[10%] text-center">
          {story.map((s, i) => (
            <p key={i} className="story-line display absolute inset-x-0 bottom-0 text-3xl italic md:text-5xl">{s.line}</p>
          ))}
          <p className="story-and display absolute inset-x-0 bottom-0 text-4xl text-mustard md:text-6xl">And somehow…</p>
        </div>
      </section>

      {/* 06 BLOOM */}
      <section className="s-bloom relative flex h-svh items-center justify-center overflow-hidden bg-ink" style={{ perspective: "1200px" }}>
        {[childhood, family, areeba].map((src, i) => (
          <div key={i} className="stack-card photo-frame absolute w-40 md:w-56" style={{ transformStyle: "preserve-3d" }}>
            <img src={src} alt="" className="aspect-[4/5] w-full object-cover" loading="lazy" />
          </div>
        ))}
        <svg className="bloom-svg absolute h-[110vmin] w-[110vmin]" viewBox="-200 -200 400 400" aria-hidden>
          {Array.from({ length: 14 }).map((_, i) => (
            <g key={i} transform={`rotate(${(360 / 14) * i})`}>
              <path className="petal" d="M0 0 C -38 -60, -30 -150, 0 -185 C 30 -150, 38 -60, 0 0 Z" fill={i % 2 ? "var(--mustard)" : "var(--gold)"} opacity="0.92" />
            </g>
          ))}
          {Array.from({ length: 10 }).map((_, i) => (
            <g key={`in${i}`} transform={`rotate(${36 * i + 18})`}>
              <path className="petal" d="M0 0 C -28 -40, -22 -100, 0 -120 C 22 -100, 28 -40, 0 0 Z" fill="var(--terracotta)" opacity="0.85" />
            </g>
          ))}
          <circle r="70" fill="var(--ivory)" className="petal" />
        </svg>
        <div className="relative z-10 text-center text-brown">
          <p className="bloom-t eyebrow text-[0.6rem]">You're invited</p>
          <p className="bloom-t display mt-1 text-lg italic">to celebrate</p>
          <p className="bloom-t display mt-1 text-2xl uppercase">Areeba's<br />Mayun</p>
        </div>
      </section>

      {/* 07 DETAILS */}
      <section className="relative bg-ivory px-6 py-28 text-brown md:py-40">
        <div className="mx-auto max-w-3xl text-center">
          <p className="detail eyebrow text-terracotta">Mayun Celebration</p>
          <h3 className="detail display mt-6 text-[17vw] md:text-9xl">Areeba <span className="italic text-mustard">Khan</span></h3>
          <div className="rule mx-auto my-12 h-px w-40 bg-gold" />
          <div className="grid gap-10 md:grid-cols-3">
            <div className="detail"><p className="eyebrow text-olive">When</p><p className="display mt-3 text-3xl">Saturday<br />14 November 2026</p></div>
            <div className="detail"><p className="eyebrow text-olive">Time</p><p className="display mt-3 text-3xl">7:00 PM</p></div>
            <div className="detail"><p className="eyebrow text-olive">Where</p><p className="display mt-3 text-3xl">The Courtyard House</p><p className="mt-2 text-sm">24 Garden Avenue, Lahore</p></div>
          </div>
          <div className="rule mx-auto my-12 h-px w-40 bg-gold" />
          <p className="detail font-script text-3xl text-terracotta">Hosted by The Khan Family</p>
        </div>
      </section>

      {/* 08 CALENDAR */}
      <section className="s-cal relative flex h-svh flex-col items-center justify-center overflow-hidden bg-ivory text-brown">
        <div className="relative h-80 w-64 md:h-96 md:w-80" style={{ perspective: "1000px" }}>
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-card shadow-2xl">
            <p className="eyebrow text-terracotta">November</p>
            <div className="relative mt-2">
              <svg className="absolute -inset-10 h-[calc(100%+5rem)] w-[calc(100%+5rem)]" viewBox="0 0 300 200" aria-hidden>
                <path className="brush-14" d="M30 120 C 70 40, 220 30, 270 100 C 230 170, 80 180, 40 110" fill="none" stroke="var(--mustard)" strokeWidth="26" strokeLinecap="round" strokeDasharray="1000" opacity="0.85" />
              </svg>
              <p className="display relative text-[9rem]">14</p>
            </div>
            <p className="eyebrow text-olive">Saturday</p>
          </div>
          {[{ c: "page-nov", m: "November", d: "01" }, { c: "page-oct", m: "October", d: "31" }].map((p) => (
            <div key={p.c} className={`${p.c} absolute inset-0 flex flex-col items-center justify-center border-t-8 border-terracotta bg-card shadow-xl`} style={{ transformOrigin: "top center", backfaceVisibility: "hidden" }}>
              <p className="eyebrow text-terracotta">{p.m}</p>
              <p className="display text-[9rem] opacity-70">{p.d}</p>
              <p className="eyebrow text-olive">2026</p>
            </div>
          ))}
        </div>
        <h3 className="cal-big display mt-12 text-center text-5xl md:text-7xl">14 November <span className="italic text-mustard">2026</span></h3>
        <div className="brush-wide absolute bottom-0 left-0 h-[22vh] w-full bg-mustard" style={{ clipPath: "polygon(0 40%, 8% 20%, 30% 35%, 55% 10%, 78% 28%, 100% 5%, 100% 100%, 0 100%)" }} />
      </section>

      {/* 09 CLOCK */}
      <section className="s-clock relative flex h-svh flex-col items-center justify-center overflow-hidden bg-mustard text-ink">
        <div className="clock-blur absolute inset-0 bg-[repeating-conic-gradient(from_0deg,transparent_0_8deg,var(--gold)_8deg_9deg)] opacity-0" />
        <svg viewBox="0 0 400 400" className="relative w-[78vmin] max-w-md" aria-label="Clock showing 7:00">
          <circle cx="200" cy="200" r="185" fill="var(--ivory)" />
          <circle className="clock-ring" cx="200" cy="200" r="185" fill="none" stroke="var(--brown)" strokeWidth="4" strokeDasharray="1300" />
          {Array.from({ length: 12 }).map((_, i) => (
            <line key={i} className="tick" x1="200" y1="32" x2="200" y2={i % 3 ? 46 : 60} stroke="var(--brown)" strokeWidth={i % 3 ? 2 : 4} transform={`rotate(${i * 30} 200 200)`} />
          ))}
          {["XII", "III", "VI", "IX"].map((n, i) => {
            const a = (i * Math.PI) / 2;
            return <text key={n} x={200 + Math.sin(a) * 118} y={208 - Math.cos(a) * 118} textAnchor="middle" fontFamily="Cormorant Garamond" fontSize="28" fill="var(--brown)">{n}</text>;
          })}
          <line className="hand-h" x1="200" y1="200" x2="200" y2="105" stroke="var(--brown)" strokeWidth="8" strokeLinecap="round" />
          <line className="hand-m" x1="200" y1="200" x2="200" y2="58" stroke="var(--terracotta)" strokeWidth="4" strokeLinecap="round" />
          <circle cx="200" cy="200" r="9" fill="var(--brown)" />
        </svg>
        <p className="clock-t1 eyebrow mt-10 text-center text-brown">When the courtyard comes alive</p>
        <p className="clock-t2 display mt-3 text-7xl md:text-8xl">7:00 PM</p>
      </section>

      {/* 10 VENUE */}
      <section className="s-venue relative h-svh overflow-hidden bg-ink">
        <img src={venue} alt="The Courtyard House entrance glowing with marigold garlands" className="venue-img absolute inset-0 h-full w-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-ink/30" />
        <svg className="branches absolute inset-0 h-full w-full" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice" aria-hidden>
          <rect width="400" height="800" fill="var(--mustard)" />
          {["M200 400 C 120 300, 60 250, -20 120", "M200 400 C 280 300, 360 240, 420 90", "M200 400 C 150 520, 70 600, -10 720", "M200 400 C 260 520, 340 620, 420 760", "M120 300 C 140 250, 180 220, 200 160", "M300 290 C 290 240, 250 210, 230 150"].map((d, i) => (
            <path key={i} className="branch" d={d} fill="none" stroke="var(--olive)" strokeWidth="5" strokeLinecap="round" strokeDasharray="800" />
          ))}
        </svg>
        <h3 className="venue-name display absolute inset-x-6 top-[16%] text-center text-6xl md:text-8xl">The Courtyard<br /><span className="italic text-mustard">House</span></h3>
        <div className="door-wrap absolute inset-x-6 top-1/2 mx-auto max-w-sm -translate-y-1/2 opacity-0" style={{ perspective: "1400px" }}>
          <div className="relative aspect-[3/4] overflow-hidden rounded-t-full bg-ivory text-brown">
            <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
              <svg viewBox="0 0 200 120" className="w-44" aria-hidden>
                <path className="route" d="M20 100 C 60 100, 50 40, 100 50 S 150 20, 180 20" fill="none" stroke="var(--terracotta)" strokeWidth="2.5" strokeDasharray="6 6" strokeDashoffset="600" />
                <circle cx="20" cy="100" r="5" fill="var(--olive)" />
                <circle cx="180" cy="20" r="7" fill="var(--mustard)" />
              </svg>
              <p className="addr eyebrow mt-4 text-terracotta">Venue</p>
              <p className="addr display mt-2 text-3xl">24 Garden Avenue</p>
              <p className="addr display text-2xl italic">Lahore, Pakistan</p>
              <a className="addr eyebrow mt-6 border-b border-brown pb-1" href="https://maps.google.com/?q=24+Garden+Avenue+Lahore" target="_blank" rel="noreferrer">Open directions</a>
            </div>
            <div className="door-l wood absolute inset-y-0 left-0 w-1/2 border-r border-gold/40" style={{ transformOrigin: "left center" }} />
            <div className="door-r wood absolute inset-y-0 right-0 w-1/2 border-l border-gold/40" style={{ transformOrigin: "right center" }} />
          </div>
        </div>
      </section>

      {/* 11 CLIMAX */}
      <section className="s-climax relative flex h-svh items-center justify-center bg-ivory px-6 text-brown">
        <div className="relative max-w-2xl text-center">
          <p className="c1 display text-3xl italic md:text-5xl">You won't remember every little detail of this day.</p>
          <p className="c2 display mt-8 text-3xl italic md:text-5xl">But you'll remember who was there.</p>
          <p className="c3 display absolute inset-x-0 top-1/2 -translate-y-1/2 text-[17vw] uppercase text-terracotta md:text-[9vw]">{split("So be there.")}</p>
        </div>
      </section>

      {/* 12 FINALE */}
      <section className="s-finale relative flex min-h-svh items-center justify-center overflow-hidden px-6 py-24">
        <img src={courtyard} alt="" className="fin-bg absolute inset-0 h-full w-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-ink/70" />
        <div className="curtain absolute -top-10 left-0 h-[115%] w-[18%] opacity-60" />
        <div className="curtain absolute -top-10 right-0 h-[115%] w-[18%] opacity-60" style={{ animationDelay: "-2s" }} />
        <div className="relative mx-auto max-w-xl border border-gold/50 px-6 py-14 text-center backdrop-blur-[2px] md:px-12">
          <p className="fin-line eyebrow text-gold">Mayun Celebration</p>
          <h3 className="fin-line display mt-5 text-6xl md:text-7xl">Areeba Khan</h3>
          <div className="fin-line mx-auto my-8 h-px w-24 bg-gold" />
          <p className="fin-line display text-3xl">14 November 2026</p>
          <p className="fin-line eyebrow mt-2 text-gold">Saturday · 7:00 PM</p>
          <p className="fin-line display mt-6 text-2xl">The Courtyard House</p>
          <p className="fin-line text-sm text-ivory/80">24 Garden Avenue, Lahore</p>
          <p className="fin-line mt-8 font-script text-2xl text-gold">Hosted by The Khan Family</p>
          <p className="fin-line display mt-8 text-2xl italic text-mustard">Come celebrate the morning before forever.</p>
          <p className="fin-mayun glow-text display mt-12 text-6xl uppercase tracking-[0.3em] text-mustard">Mayun</p>
        </div>
      </section>
    </div>
  );
}
