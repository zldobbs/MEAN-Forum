import { Component, OnInit } from '@angular/core';
import { ForumManagerService } from '../../services/forum-manager.service';
import { AuthService } from '../../services/auth.service';
import { toast } from 'angular2-materialize';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-thread',
  templateUrl: './view-thread.component.html',
  styleUrls: ['./view-thread.component.css']
})
export class ViewThreadComponent implements OnInit {
  thread_id: string;
  user: any;
  posts: [any];
  replyText: string;

  constructor(
    private forumManagerService: ForumManagerService,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    var _this = this;
    this.activatedRoute.params.subscribe(function(params) {
      _this.thread_id = params['thread_id'];
      console.log('viewing thread: ' + _this.thread_id);

      _this.forumManagerService.getAllPostsInThread(_this.thread_id).subscribe(function(thread) {
        if (thread.succ) {
          _this.posts = thread.posts;
          _this.posts.sort(function(a, b) {
            return a.timestamp - b.timestamp;
          });
        }
        else {
          console.log(thread.msg);
          return false;
        }
      });
    });

    this.authService.getProfile().subscribe(function(profile) {
      _this.user = profile.user
    },
    function(err) {
      console.log(err);
      return false;
    });
  }

  onReplyThreadSubmit() {
    // get the user that is submitting the reply
    var _this = this;
    if (this.user) {
      let newPost = {
        username: _this.user.username,
        profilePicture: _this.user.profilePicture,
        bodyText: _this.replyText
      };
      console.log('adding reply = ' + newPost.profilePicture);
      _this.forumManagerService.addReplyToThread(_this.thread_id, newPost).subscribe(function(data) {
        if (data.succ) {
          location.reload();
        }
        else {
          toast('Failed to post reply!', 5000, 'red');
          console.log(data.msg);
        }
      });
    }
    else {
      console.log('user is not signed in, can not post');
      return false;
    }
  }

  // NOTE: add functionality to reply to thread here

}
