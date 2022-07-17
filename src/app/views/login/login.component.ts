import { AuthService } from './../../services/auth.service';
import { Router } from '@angular/router';
import { User } from './../../interfaces/user';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  fg!: FormGroup;
  user!: User;
  subscription!: Subscription;

  constructor(private fb: FormBuilder, private router: Router, private auth: AuthService) { }

  ngOnInit(): void {
    this.fg = this.initForm();
    this.subscription = this.auth.user$.subscribe(user => {
      this.user = user;
    });
  }

  initForm(): FormGroup {
    return this.fb.group({
      userName: ['', [Validators.required]]
    });
  }

  login(): void {
    this.auth.loginLocal();
    if (this.user.userName) {
      this.router.navigate(['/']);
    } else {
      this.router.navigate(['/login']);
    }
    this.router.navigate(['/']);
  }

  register(): void {
    this.auth.registerLocal(this.user);
    this.router.navigate(['/']);
  }

  get userName() {
    return this.fg.get('userName');
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
