import { Component, OnInit } from '@angular/core';
import { ForumManagerService } from '../../services/forum-manager.service';
import { toast } from 'angular2-materialize';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-thread',
  templateUrl: './view-thread.component.html',
  styleUrls: ['./view-thread.component.css']
})
export class ViewThreadComponent implements OnInit {
  posts: [any];

  constructor(
    private forumManagerService: ForumManagerService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    var _this = this;
    this.activatedRoute.params.subscribe(function(params) {
      let thread_id = params['thread_id'];
      console.log('viewing thread: ' + thread_id);

      _this.forumManagerService.getAllPostsInThread(thread_id).subscribe(function(thread) {
        if (thread.succ) {
          _this.posts = thread.posts;
        }
        else {
          console.log(thread.msg);
          return false;
        }
      });
    });
  }

  // NOTE: add functionality to reply to thread here

}
