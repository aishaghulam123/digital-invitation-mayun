// Canvas petal field: ambient falling petals + bursts toward the viewer.
type Petal = {
  x: number; y: number; vx: number; vy: number; r: number; rot: number; vr: number;
  life: number; z: number; vz: number; hue: number; burst: boolean;
};

const COLORS = ["#C79A32", "#D9A93A", "#E3B84A", "#C8A96B", "#A9634C", "#E8C766"];

export class PetalField {
  private ctx: CanvasRenderingContext2D;
  private petals: Petal[] = [];
  private raf = 0;
  private w = 0;
  private h = 0;
  ambient = 0.15;

  constructor(private canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext("2d")!;
    this.resize();
    window.addEventListener("resize", this.resize);
    this.loop();
  }

  private resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.canvas.width = this.w * dpr;
    this.canvas.height = this.h * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  burst(x = this.w / 2, y = this.h / 2, n = 160) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = 2 + Math.random() * 9;
      this.petals.push({
        x: x + (Math.random() - 0.5) * this.w * 0.5, y: y + (Math.random() - 0.5) * 60,
        vx: Math.cos(a) * s, vy: Math.sin(a) * s - 1.5, r: 4 + Math.random() * 7,
        rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3, life: 1,
        z: 1, vz: 0.012 + Math.random() * 0.03, hue: Math.floor(Math.random() * COLORS.length), burst: true,
      });
    }
  }

  private spawnAmbient() {
    if (Math.random() > this.ambient) return;
    this.petals.push({
      x: Math.random() * this.w, y: -20, vx: (Math.random() - 0.3) * 0.8, vy: 0.6 + Math.random() * 1.2,
      r: 3 + Math.random() * 5, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.06, life: 1,
      z: 0.6 + Math.random() * 0.6, vz: 0, hue: Math.floor(Math.random() * COLORS.length), burst: false,
    });
  }

  private loop = () => {
    const { ctx } = this;
    ctx.clearRect(0, 0, this.w, this.h);
    this.spawnAmbient();
    const t = performance.now() / 1000;
    this.petals = this.petals.filter((p) => p.life > 0 && p.y < this.h + 40);
    for (const p of this.petals) {
      if (p.burst) {
        p.vx *= 0.97; p.vy = p.vy * 0.97 + 0.08; p.z += p.vz; p.life -= 0.009;
      } else {
        p.vx += Math.sin(t + p.y * 0.01) * 0.01;
      }
      p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      const size = p.r * p.z;
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, p.life)) * 0.9;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = COLORS[p.hue] ?? "#C79A32";
      ctx.beginPath();
      ctx.ellipse(0, 0, size, size * 0.55 * Math.abs(Math.cos(p.rot * 1.5)) + 1, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    this.raf = requestAnimationFrame(this.loop);
  };

  destroy() {
    cancelAnimationFrame(this.raf);
    window.removeEventListener("resize", this.resize);
  }
}
