import { Component, OnInit } from '@angular/core';
import { toast } from 'angular2-materialize';
import { ValidateService } from '../../services/validate.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  name: String;
  username: String;
  email: String;
  password: String;

  constructor(
    private validateService: ValidateService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    // check if we're logged in 
    // FIXME should probably make a guard to handle this instead....
    const _this = this;
    if (this.authService.loggedIn()) {
        _this.router.navigate(['/dashboard']);
    }
  }

  onRegisterSubmit() {
    // Phil Thomas Katt will be the default profile pic
    const defaultProfilePic = "bc79679e1b71616a25949acf764392c2.png"; 
    // can't send toast normally, gets consumed.. prevent default?
    // TODO: add password validation against confirm password field
    const user = {
      name: this.name,
      username: this.username,
      email: this.email,
      password: this.password,
      profilePicture: defaultProfilePic
    }

    // validate fields filled before registering
    if (!this.validateService.validateRegister(user)) {
      toast('Please fill out all fields', 5000, 'red');
      return false;
    }
    if (!this.validateService.validateEmail(user.email)) {
      toast('Please provide a valid email', 5000, 'red');
      return false;
    }
    // send the registration info to the backend
    const _this = this;
    this.authService.registerUser(user).subscribe(function(data) {
      if (data.succ) {
        // now login user
        _this.authService.authenticateUser(user).subscribe(function(newUser) {
          if (newUser.succ) {
            _this.authService.storeUserData(newUser.token, newUser.user);
            toast('You are now registered!', 5000, 'green');
            _this.router.navigate(['/dashboard']); // NOTE: consider changing redirect location
          }
          else {
            toast('Failed to register', 5000, 'red');
            _this.router.navigate(['/register']);            
          }
        });
      }
      else {
        toast('Failed to register', 5000, 'red');
        _this.router.navigate(['/register']);
      }
    });

  }
}
