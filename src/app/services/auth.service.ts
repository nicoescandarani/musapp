import { User } from './../interfaces/user';
import { Observable, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: BehaviorSubject<User> = new BehaviorSubject({
    userName: ''
  });

  userName: BehaviorSubject<string> = new BehaviorSubject('');

  constructor(private auth: AngularFireAuth) { }

  loginLocal(): void {
    let user = '';
    if (localStorage.getItem('user') !== null) {
      user = JSON.parse(localStorage.getItem('user') || '');
    }
    if (user) {
      this.userName.next(user);
    } else {
      this.userName.next('New User');
    }
  }

  registerLocal(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  async login(email: string, password: string) {
    try {
      return await this.auth.signInWithEmailAndPassword(email, password);
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  logout(): void {
    this.auth.signOut();
  }

  getUser(): Observable<any> {
    return this.auth.user;
  }

  get user$(): Observable<User> {
    return this.user.asObservable();
  }

  get userName$(): Observable<string> {
    return this.userName.asObservable();
  }

  set userValue(user: User) {
    this.user.next(user);
  }

  set userNameValue(userName: string) {
    this.userName.next(userName);
    localStorage.setItem('user', JSON.stringify(userName));
  }
}
