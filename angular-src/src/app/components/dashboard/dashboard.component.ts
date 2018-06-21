import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ForumManagerService } from '../../services/forum-manager.service';
import { toast } from 'angular2-materialize';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user: any;
  bodyText: String;
  threads: [any];

  constructor(
    private authService: AuthService,
    private forumMangagerService: ForumManagerService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    const _this = this;

    // TODO: implement getThreads()
    this.forumMangagerService.getAllThreads().subscribe(function(data) {
      if (data.succ) {
        _this.threads = data.threads;
      }
      else {
        console.log('getAllThreads error');
        return false;
      }
    });

    this.authService.getProfile().subscribe(function(profile) {
      _this.user = profile.user
    },
    function(err) {
      console.log('getProfile error: ' + err);
      return false;
    });
  }

  onCreateThreadSubmit() {
    const newPost = {
      username: this.user.username,
      bodyText: this.bodyText
    }
    const _this = this;
    this.forumMangagerService.createThread(newPost).subscribe(function(data) {
      if (data.succ) {
        toast('Thread created!', 5000, 'green');
        _this.router.navigate(['/dashboard']);
        // NOTE: this should actually redirect to a page to view the Thread
        // --> via a get url param of the thread's id
      }
      else {
        toast('Failed to create thread', 5000, 'red');
        _this.router.navigate(['/dashboard']);
      }
    });
  }

  goToThread(thread_id) {
    this.router.navigate(
      ['/viewThread', {
        thread_id: thread_id
      }]
    );
  }
}
