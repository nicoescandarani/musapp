import { Notes } from './../../enums/notes';
import { SharedService } from './../../services/shared.service';
import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { Mus } from './../../interfaces/mus';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
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
  openMenu = -1;
  notes = Notes;
  notesKeys: string[] = Object.keys(Notes);

  constructor(private musService: MusService, private auth: AuthService, private router: Router, private shared: SharedService) { }

  ngOnInit(): void {
    this.mus = this.initMus();
    const userNameSubscription$ = this.auth.userName$.subscribe(userName => {
      this.userName = userName;
    });
    this.subscriptions.push(userNameSubscription$);
    const noteSubscription$ = this.shared.activeNote.subscribe(note => {
      this.activeNote = note;
    });
    this.subscriptions.push(noteSubscription$);

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
    this.shared.play(this.mus);
  }

  stop(): void {
    this.shared.stop();
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

  toggleMenu(i: number): void {
    if (this.openMenu === i) {
      this.openMenu = -1;
      return;
    }
    this.openMenu = i;
  }

  changeValue(note: string, index: number): void {
    this.mus.notes[index] = note;
    this.openMenu = -1;
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    if(!(event.target as HTMLElement).classList.contains('select__toggle') && this.openMenu !== -1) {
      this.openMenu = -1;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
