import { Subscription } from 'rxjs';
import { User } from './../../interfaces/user';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit, OnDestroy {

  user!: string;
  subscription!: Subscription;

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    this.subscription = this.auth.userName$.subscribe(user => {
      if (user) {
        console.log(user);
        this.user = user;
      }
    });
  }

  logout(): void {
    this.auth.logout();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
