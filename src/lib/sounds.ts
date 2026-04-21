export class SoundEngine {
  // Sound engine for FutQuina
  private createAudio(src: string) {
    // Add cache buster query parameter to guarantee the browser downloads the newest file
    return new Audio(src);
  }

  // Audio files have been moved to src/assets/sounds to use Vite's static bundler, avoiding path issues on Vercel
  private audioFinalizar: HTMLAudioElement | null = null;
  private audioGols: HTMLAudioElement | null = null;
  private audioIniciar: HTMLAudioElement | null = null;
  private audioPausar: HTMLAudioElement | null = null;
  private audioSortear: HTMLAudioElement | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      import('../assets/sounds/finalizar-partida.mp3').then(m => { this.audioFinalizar = this.createAudio(m.default); }).catch(e => console.warn(e));
      import('../assets/sounds/gols.mp3').then(m => { this.audioGols = this.createAudio(m.default); }).catch(e => console.warn(e));
      import('../assets/sounds/iniciar-partida.mp3').then(m => { this.audioIniciar = this.createAudio(m.default); }).catch(e => console.warn(e));
      import('../assets/sounds/pausar-partida.mp3').then(m => { this.audioPausar = this.createAudio(m.default); }).catch(e => console.warn(e));
      import('../assets/sounds/sortear.mp3').then(m => { this.audioSortear = this.createAudio(m.default); }).catch(e => console.warn(e));
    }
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

