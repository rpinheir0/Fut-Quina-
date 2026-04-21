export class SoundEngine {
  // Sound engine for FutQuina
  private createAudio(path: string) {
    if (typeof window === 'undefined') return null;
    // By using window.location.origin, we ensure Vite bundler completely ignores this URL
    // during the NPM BUILD step, preventing any ENOENT Rollup errors on Vercel.
    const fullUrl = `${window.location.origin}/sounds/${path}?t=${Date.now()}`;
    return new Audio(fullUrl);
  }

  private audioFinalizar = this.createAudio('finalizar-partida.mp3');
  private audioGols = this.createAudio('gols.mp3');
  private audioIniciar = this.createAudio('iniciar-partida.mp3');
  private audioPausar = this.createAudio('pausar-partida.mp3');
  private audioSortear = this.createAudio('sortear.mp3');

  constructor() {
    // Escaping static bundler
  }

  private playSound(audio: HTMLAudioElement | null, volume: number = 0.8) {
    if (!audio || typeof window === 'undefined') return;
    try {
      // Clona o elemento de áudio para permitir a reprodução de sons sobrepostos
      // ou reproduções rápidas sem cortar o áudio original.
      const clone = audio.cloneNode() as HTMLAudioElement;
      clone.volume = volume; // Allow custom volume override
      clone.play().catch((e) => console.warn("Erro ao tocar o áudio:", e));
    } catch (e) {
      console.warn("Erro no SoundEngine:", e);
    }
  }

  playStartMatch() {
    this.playSound(this.audioIniciar);
  }

  playFinishMatch() {
    this.playSound(this.audioFinalizar);
  }

  playGoal() {
    this.playSound(this.audioGols);
  }

  playPause() {
    // Aumenta o volume específico do áudio de pausar
    this.playSound(this.audioPausar, 1.0);
  }

  playDrawFinished() {
    this.playSound(this.audioSortear);
  }
}

export const sounds = new SoundEngine();

