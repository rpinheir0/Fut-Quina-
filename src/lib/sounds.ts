import finalizarMp3 from '../sounds/finalizar-partida.mp3';
import golsMp3 from '../sounds/gols.mp3';
import iniciarMp3 from '../sounds/iniciar-partida.mp3';
import pausarMp3 from '../sounds/pausar-partida.mp3';
import sortearMp3 from '../sounds/sortear.mp3';

export class SoundEngine {
  private createAudio(src: string) {
    // Add cache buster query parameter to guarantee the browser downloads the newest file
    return new Audio(src + "?t=" + Date.now());
  }

  private audioFinalizar = typeof window !== 'undefined' ? this.createAudio(finalizarMp3) : null;
  private audioGols = typeof window !== 'undefined' ? this.createAudio(golsMp3) : null;
  private audioIniciar = typeof window !== 'undefined' ? this.createAudio(iniciarMp3) : null;
  private audioPausar = typeof window !== 'undefined' ? this.createAudio(pausarMp3) : null;
  private audioSortear = typeof window !== 'undefined' ? this.createAudio(sortearMp3) : null;

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

