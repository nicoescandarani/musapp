import { Notes } from './../../enums/notes';
import { SharedService } from './../../services/shared.service';
import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { Mus } from './../../interfaces/mus';
import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MusService } from 'src/app/services/mus.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-creator',
  templateUrl: './creator.component.html',
  styleUrls: ['./creator.component.scss']
})
export class CreatorComponent implements OnInit, OnDestroy, AfterViewInit {

  muses: Mus[] = [];
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
  showToast = false;
  toastMessage!: string;
  toastTimeout: any;

  @ViewChild('input') input!: ElementRef;
  @ViewChildren('note') note: QueryList<ElementRef> | undefined;

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
    const musesSubscription$ = this.musService.muses$.subscribe(muses => {
      this.muses = muses;
    });
    this.subscriptions.push(musesSubscription$);
    this.subscriptions.push(noteSubscription$);
  }

  ngAfterViewInit(): void {
    this.note?.forEach(element => {
      element.nativeElement.addEventListener('mouseover', () => {
        this.shared.playSingleNote(element.nativeElement.innerText);
      });
    });
  }

  initMus(): Mus {
    return {
      id: '0',
      title: 'New Mus',
      notes: ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C8'],
      isMus: true
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
    this.mus.title = this.generateName();
    this.musService.addMuse(this.mus);
    this.router.navigate(['/']);
  }

  generateId(): string {
    return `mus${this.userName}${Date.now().toString()}`;
  }

  generateName(): string {
    const amountofSameTitle = this.muses.filter(mus => mus.title.split('(')[0] === this.mus.title.split('(')[0]).length;
    if (this.muses.some(mus => mus.title === mus.title)) {
      return `${this.mus.title}${amountofSameTitle > 0 ? '(' + (amountofSameTitle + 1) + ')' : ''}`;
    } else {
      return this.mus.title;
    }
  }

  toggleMenu(i: number): void {
    if (this.openMenu === i) {
      this.openMenu = -1;
      return;
    }
    this.openMenu = i;
  }

  openFile(): void {
    this.input.nativeElement.click();
  }

  importMus($event: any): void {
    if ($event.target.files[0]) {
      const file = $event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const data = JSON.parse(e.target.result);
        if (data.isMus && (data.title && data.notes && data.id)) {
          this.mus = data;
          this.mus.notes = this.mus.notes.map(note => note.toUpperCase());
          this.handleToast('Mus imported successfully!');
        } else {
          this.handleToast('Please, select a valid mus file');
        }
      }
      reader.readAsText(file);
    }
  }

  handleToast(message: string): void {
    this.showToast = true;
    this.toastMessage = message;
    this.closeToastAuto();
  }

  closeToastAuto() {
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
    this.toastTimeout = setTimeout(() => {
      this.showToast = false;
    }, 8000);
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
