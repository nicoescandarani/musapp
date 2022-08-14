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
  showModal = false;
  showMultipleModal = false;
  modalMessage = 'Are you sure you want to delete this mus?';
  multiplemodalMessage = 'Are you sure you want to delete these muses?';
  musIdToDelete!: string;
  showToast = false;
  toastMessage = '';
  toastTimeout: any;
  editModeEnabled = false;
  selectedMuses: string[] = [];

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

  editMode(): void {
    this.editModeEnabled = !this.editModeEnabled;
    if (!this.editModeEnabled) {
      this.selectedMuses = [];
    }
  }

  addToSlectedMuses(id: string): void {
    if (!this.selectedMuses.includes(id)) {
      this.selectedMuses.push(id);
    } else {
      this.selectedMuses = this.selectedMuses.filter(musId => musId !== id);
    }
  }

  musIsSelected(id: string): boolean {
    return this.selectedMuses.includes(id);
  }

  deleteSelectedMuses(): void {
    this.multiplemodalMessage = 'Are you sure you want to delete these muses?';
    this.showMultipleModal = true;
  }

  setUserName(): void {
    this.auth.userNameValue = this.userName;
    this.editing = false;
  }

  downloadMus(mus: Mus) {
    const fileName = this.shared.generateFileName(mus.title);
    const file = this.shared.generateFile(mus, 'application/json', 'json', fileName);
    this.shared.downloadFile(file, fileName);
  }

  deleteMus(id: string) {
    this.musIdToDelete = id;
    this.modalMessage = 'Are you sure you want to delete this mus?';
    this.showModal = true;
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

  acceptModal() {
    if (this.musIdToDelete) {
      this.musService.deleteMus(this.musIdToDelete);
    }
    this.showModal = false;
    this.musIdToDelete = '';
    this.handleToast('Mus deleted successfully');
  }

  acceptMultipleModal(): void {
    this.selectedMuses.forEach(id => {
      this.musService.deleteMus(id);
    });
    this.showMultipleModal = false;
    this.editModeEnabled = false;
    this.multiplemodalMessage = '';
    this.selectedMuses = [];
    this.handleToast('Muses deleted successfully');
  }

  cancelModal() {
    this.showModal = false;
    this.modalMessage = '';
  }

  cancelMultipleModal(): void {
    this.showMultipleModal = false;
    this.multiplemodalMessage = '';
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

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
