import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { Mus } from './../../interfaces/mus';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MusService } from 'src/app/services/mus.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-creator',
  templateUrl: './creator.component.html',
  styleUrls: ['./creator.component.scss']
})
export class CreatorComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];
  mus!: Mus;
  tempMus!: Mus;
  playing!: any;
  activeNote = -1;
  hola: any;
  userName!: string;

  constructor(private musService: MusService, private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.mus = this.initMus();
    const userNameSubscription$ = this.auth.userName$.subscribe(userName => {
      this.userName = userName;
    });
    this.subscriptions.push(userNameSubscription$);
  }

  initMus(): Mus {
    return {
      id: '0',
      title: 'New Mus',
      notes: ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C8']
    };
  }

  updateValue(passedNote: string, index: number): void {
    this.mus.notes[index] = passedNote;
    if (passedNote.length > 1) {
      this.mus.notes[index] = this.mus.notes[index].toUpperCase();
    }
  }

  updateTitle(title: string): void {
    this.musService.musValue = {
      ...this.mus,
      title
    }
  }

  play(): void {
    let i = 0;
    this.playing = setInterval(() => {
      this.activeNote = i;
      console.log(this.activeNote);
      
      let useNote =  this.mus.notes[i].toUpperCase();
      if (this.mus.notes[i].length > 1) {
        const split = this.mus.notes[i].split('');
        split[0] = split[0].toUpperCase();
        const newNote = split.join('');
        useNote = newNote;
      }
      const audio = new Audio(`./assets/notes/${useNote}.mp3`);
      audio.play();
      i++;
      if (i === this.mus.notes.length) {
        this.stop();
      }
    }, 700);
  }

  stop(): void {
    if (this.playing) {
      clearInterval(this.playing);
      this.playing = undefined;
      this.activeNote = -1;
    }
  }

  save(): void {
    const id = this.generateId();
    this.mus.id = id;
    this.mus.notes = this.mus.notes.map(note => note.toUpperCase());
    console.log(this.mus);
    this.musService.addMuse(this.mus);
    this.router.navigate(['/']);
  }

  generateId(): string {
    return `mus${this.userName}${Date.now().toString()}`;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
