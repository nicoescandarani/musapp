import { Mus } from './../interfaces/mus';
import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  playing: any;
  activeNote: BehaviorSubject<number> = new BehaviorSubject<number>(-1);
  isPlaying: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  musPlayingId: BehaviorSubject<string> = new BehaviorSubject<string>('');
  singleNotePlaying!: HTMLAudioElement;

  play(mus: Mus): void {
    let i = 0;
    this.isPlaying.next(true);
    this.musPlayingId.next(mus.id);
    this.playing = setInterval(() => {
      this.activeNote.next(i);
      let useNote =  mus.notes[i].toUpperCase();
      let tempNote = '';
      if (mus.notes[i].length > 1) {
        switch (mus.notes[i]) {
          case 'Cb':
            tempNote = 'B';
            break;
          case 'C#':
            tempNote = 'Db';
            break;
          case 'D#':
            tempNote = 'Eb';
            break;
          case 'E#':
            tempNote = 'F';
            break;
          case 'Fb':
            tempNote = 'E';
            break;
          case 'F#':
            tempNote = 'Gb';
            break;
          case 'G#':
            tempNote = 'Ab';
            break;
          case 'A#':
            tempNote = 'Bb';
            break;
          case 'B#':
            tempNote = 'C';
            break;
        }
        if (tempNote) {
          useNote = tempNote;
        }
        const split = useNote.toLocaleLowerCase().split('');
        split[0] = split[0].toUpperCase();
        const newNote = split.join('');
        useNote = newNote;
      }
      const audio = new Audio(`./assets/notes/${useNote}.mp3`);
      audio.play();
      i++;
      if (i === mus.notes.length) {
        this.stop();
      }
    }, 700);
  }

  playSingleNote(note: string): void {
    if (!this.playing) {
      this.singleNotePlaying = new Audio(`./assets/notes/${note}.mp3`);
      this.singleNotePlaying.play();
    }
  }

  stopSingleNote(): void {
    this.singleNotePlaying.pause();
  }

  stop(): void {
    if (this.playing) {
      clearInterval(this.playing);
      this.playing = undefined;
      this.isPlaying.next(false);
      this.activeNote.next(-1);
      this.musPlayingId.next('');
    }
  }

  generateFile(mus: Mus, type: string, singleType: string, name: string): File {
    const blob = new Blob([JSON.stringify(mus)], { type: type });
    const tempFile = new File([blob], `${name}.${singleType}`, { type: type });
    return tempFile;
  }

  downloadFile(file: File, name: string): void {
    if (file) {
      const url = window.URL.createObjectURL(file);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${name}.json`;
      link.click();
    }
  }

  generateFileName(name: string): string {
    const split = name.toLowerCase().split(' ');
    return `${split.join('_')}_musapp`;
  }

  // ! Getters

  get activeNote$(): Observable<number> {
    return this.activeNote as Observable<number>;
  }

  get playing$(): Observable<boolean> {
    return this.isPlaying as Observable<boolean>;
  }

  // ! Setters

  set activeNoteValue(value: number) {
    this.activeNote.next(value);
  }

}
