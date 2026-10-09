// Generated warm ambient pad (no audio files). Starts muted; user toggles.
export class AmbientAudio {
  private ctx?: AudioContext;
  private master?: GainNode;
  on = false;

  private init() {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0;
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 900;
    filter.connect(this.master);
    this.master.connect(this.ctx.destination);
    [146.83, 220, 293.66, 369.99, 440].forEach((f, i) => {
      const o = this.ctx!.createOscillator();
      o.type = i % 2 ? "triangle" : "sine";
      o.frequency.value = f;
      const g = this.ctx!.createGain();
      g.gain.value = 0.05;
      const lfo = this.ctx!.createOscillator();
      lfo.frequency.value = 0.07 + i * 0.03;
      const lg = this.ctx!.createGain();
      lg.gain.value = 0.03;
      lfo.connect(lg).connect(g.gain);
      o.connect(g).connect(filter);
      o.start(); lfo.start();
    });
  }

  toggle() {
    if (!this.ctx) this.init();
    this.on = !this.on;
    this.ctx!.resume();
    this.master!.gain.setTargetAtTime(this.on ? 0.35 : 0, this.ctx!.currentTime, 0.6);
    return this.on;
  }

  setLevel(v: number) {
    if (this.ctx && this.on) this.master!.gain.setTargetAtTime(0.35 * v, this.ctx.currentTime, 0.8);
  }
}
