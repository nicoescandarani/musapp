import { SharedService } from './../../services/shared.service';
import { Subscription, Observable } from 'rxjs';
import { Mus } from './../../interfaces/mus';
import { MusService } from 'src/app/services/mus.service';
import { User } from './../../interfaces/user';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  user!: User;
  userName = '';
  muses!: Mus[];
  editing = false;
  subscriptions: Subscription[] = [];
  isPlaying = false;
  musPlayingId!: Observable<string>;

  constructor(private auth: AuthService, private musService: MusService, private shared: SharedService) {
    this.musPlayingId = this.shared.musPlayingId;
  }

  ngOnInit(): void {
    const userNameSubscription$ = this.auth.userName$.subscribe(user => {
      this.userName = user;
    });
    this.subscriptions.push(userNameSubscription$);
    const musesSubscription$ = this.musService.muses$.subscribe(muses => {
      this.muses = muses;
    });
    this.subscriptions.push(musesSubscription$);
    const playingSubscription$ = this.shared.playing$.subscribe(playing => {
      this.isPlaying = playing;
    });
    this.subscriptions.push(playingSubscription$);
  }

  setUserName(): void {
    this.auth.userNameValue = this.userName;
    this.editing = false;
  }

  deleteMus(id: string) {
    this.musService.deleteMus(id);
  }

  playMus(mus: Mus) {
    this.shared.stop();
    this.shared.play(mus);
  }

  stopMus() {
    this.shared.stop();
  }

  editUserName(): void {
    this.editing = true;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
