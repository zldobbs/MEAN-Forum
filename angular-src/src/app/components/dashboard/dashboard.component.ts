import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user: Object;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
    const _this = this;
    this.authService.getProfile().subscribe(function(profile) {
      _this.user = profile.user
    },
    function(err) {
      console.log(err);
      return false;
    });
  }

}
