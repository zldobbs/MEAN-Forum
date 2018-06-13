import { Component, OnInit } from '@angular/core';
import { toast } from 'angular2-materialize';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  onLogoutClick() {
    this.authService.logout();
    toast('You are now logged out', 5000, 'orange');
    this.router.navigate(['/login']);
    return false;
  }
}
