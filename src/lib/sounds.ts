import finalizarMp3 from '../efeitos sonoros fut quina/Finalizar partida.mp3';
import golsMp3 from '../efeitos sonoros fut quina/Gols.mp3';
import iniciarMp3 from '../efeitos sonoros fut quina/Iniciar partida.mp3';
import pausarMp3 from '../efeitos sonoros fut quina/Pausar partida.mp3';
import sortearMp3 from '../efeitos sonoros fut quina/Sortear.mp3';

export class SoundEngine {
  private createAudio(src: string) {
    // Add cache buster query parameter to guarantee the browser downloads the newest file
    return new Audio(src + "?t=" + Date.now());
  }

  private audioFinalizar = this.createAudio(finalizarMp3);
  private audioGols = this.createAudio(golsMp3);
  private audioIniciar = this.createAudio(iniciarMp3);
  private audioPausar = this.createAudio(pausarMp3);
  private audioSortear = this.createAudio(sortearMp3);

  private playSound(audio: HTMLAudioElement, volume: number = 0.8) {
    if (!audio) return;
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

