import finalizarPartidaUrl from '../assets/sounds/finalizar-partida.mp3';
import golsUrl from '../assets/sounds/gols.mp3';
import iniciarPartidaUrl from '../assets/sounds/iniciar-partida.mp3';
import pausarPartidaUrl from '../assets/sounds/pausar-partida.mp3';
import sortearUrl from '../assets/sounds/sortear.mp3';

export class SoundEngine {
  // Sound engine for FutQuina
  private createAudio(src: string) {
    // Add cache buster query parameter to guarantee the browser downloads the newest file
    return new Audio(src);
  }

  // Audio files have been moved to src/assets/sounds to use Vite's static bundler, avoiding path issues on Vercel
  private audioFinalizar = typeof window !== 'undefined' ? this.createAudio(finalizarPartidaUrl) : null;
  private audioGols = typeof window !== 'undefined' ? this.createAudio(golsUrl) : null;
  private audioIniciar = typeof window !== 'undefined' ? this.createAudio(iniciarPartidaUrl) : null;
  private audioPausar = typeof window !== 'undefined' ? this.createAudio(pausarPartidaUrl) : null;
  private audioSortear = typeof window !== 'undefined' ? this.createAudio(sortearUrl) : null;

  constructor() {
    // The static imports above automatically handle asset linking natively in Vite during build.
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

