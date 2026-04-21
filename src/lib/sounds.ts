import {
  finalizarPartidaData,
  golsData,
  iniciarPartidaData,
  pausarPartidaData,
  sortearData
} from './audioBase64';

export class SoundEngine {
  // Sound engine for FutQuina
  private createAudio(base64Data: string) {
    if (typeof window === 'undefined') return null;
    return new Audio(base64Data);
  }

  private audioFinalizar = this.createAudio(finalizarPartidaData);
  private audioGols = this.createAudio(golsData);
  private audioIniciar = this.createAudio(iniciarPartidaData);
  private audioPausar = this.createAudio(pausarPartidaData);
  private audioSortear = this.createAudio(sortearData);

  constructor() {
    // Escaping static bundler and external HTTP requests by using Base64 data directly
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

