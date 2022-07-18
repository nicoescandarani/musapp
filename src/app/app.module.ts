import { environment } from './../environments/environment';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './views/home/home.component';
import { CreatorComponent } from './views/creator/creator.component';
import { AngularFireModule } from '@angular/fire/compat';
import { LoginComponent } from './views/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { NavComponent } from './components/nav/nav.component';
import { ToastComponent } from './components/toast/toast.component';
import { ModalComponent } from './components/modal/modal.component';


const config = {
  apiKey: "AIzaSyCHmt7OGnDFkI7EurV3GVHwGq9wn4dlAME",
  authDomain: "musapp-ec4d5.firebaseapp.com",
  projectId: "musapp-ec4d5",
  storageBucket: "musapp-ec4d5.appspot.com",
  messagingSenderId: "151137150436",
  appId: "1:151137150436:web:31b36ed5bb1ed9bb6653f1"
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CreatorComponent,
    LoginComponent,
    NavComponent,
    ToastComponent,
    ModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.config)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
