import { Component, OnInit } from '@angular/core';
import { toast } from 'angular2-materialize';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: String;
  password: String;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  onLoginSubmit() {
    const user = {
      username: this.username,
      password: this.password
    }
    const _this = this;
    this.authService.authenticateUser(user).subscribe(function(data) {
      console.log(data);
      if (data.succ) {
        _this.authService.storeUserData(data.token, data.user);
        toast('Logged in!', 5000, 'green');
        _this.router.navigate(['/dashboard']);
      }
      else {
        toast('Incorrect login information', 5000, 'red');
        _this.router.navigate(['/login']);
      }
    });
  }
}
