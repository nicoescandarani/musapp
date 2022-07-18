import { User } from './../interfaces/user';
import { Mus } from './../interfaces/mus';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Notes } from '../enums/notes';

@Injectable({
  providedIn: 'root'
})
export class MusService {
  private mus: BehaviorSubject<Mus> = new BehaviorSubject<Mus>({
    id: '9',
    title: 'Mus',
    notes: [Notes.C, Notes.D, Notes.E, Notes.F, Notes.G, Notes.A, Notes.B, Notes.C8],
    isMus: true
  });

  private muses: BehaviorSubject<Mus[]> = new BehaviorSubject<Mus[]>([]);

  addMuse(mus: Mus): void {
    const muses = this.muses.getValue();
    muses.push(mus);
    this.muses.next(muses);
    localStorage.setItem('muses', JSON.stringify(muses));
  }

  deleteMus(id: string): void {
    const muses = this.muses.getValue();
    const index = muses.findIndex(m => m.id === id);
    muses.splice(index, 1);
    this.muses.next(muses);
    localStorage.setItem('muses', JSON.stringify(muses));
  }

  // ! Getters

  get mus$(): Observable<Mus> {
    return this.mus.asObservable();
  }

  get muses$(): Observable<Mus[]> {
    if (this.muses.getValue().length === 0) {
      this.muses.next(JSON.parse(localStorage.getItem('muses') || '[]'));
    }

    return this.muses.asObservable();
  }

  // ! Setters

  set musValue(mus: Mus) {
    this.mus.next(mus);
  }

}
