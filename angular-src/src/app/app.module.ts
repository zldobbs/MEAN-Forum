import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaterializeModule } from 'angular2-materialize';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { JwtModule } from '@auth0/angular-jwt';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ViewThreadComponent } from './components/view-thread/view-thread.component'
import { FeedComponent } from './components/feed/feed.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';

import { ValidateService } from './services/validate.service';
import { AuthService } from './services/auth.service';
import { ForumManagerService } from './services/forum-manager.service';
import { UploadService } from './services/upload.service';

import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

const appRoutes : Routes = [
  { path : '', component : HomeComponent },
  { path : 'dashboard', component : DashboardComponent },
  { path : 'feed', component : FeedComponent },
  { path : 'login', component : LoginComponent },
  { path : 'profile', component : ProfileComponent, canActivate : [AuthGuard] },
  { path : 'register', component : RegisterComponent },
  { path : 'viewThread', component : ViewThreadComponent },
  { path : 'adminPanel', component : AdminPanelComponent, canActivate : [AdminGuard] }
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    ProfileComponent,
    DashboardComponent,
    ViewThreadComponent,
    FeedComponent,
    AdminPanelComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    MaterializeModule,
    FormsModule,
    HttpModule,
    JwtModule.forRoot({
      config: {
        whitelistedDomains: ['localhost:3000'],
        tokenGetter: function() {
          return localStorage.getItem('id_token');
        }
      }
    })
  ],
  providers: [
    ValidateService,
    AuthService,
    ForumManagerService,
    UploadService,
    AuthGuard,
    AdminGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
