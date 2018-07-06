import { Component, OnInit } from '@angular/core';
import { ForumManagerService } from '../../services/forum-manager.service';
import { AuthService } from '../../services/auth.service';
import { UploadService } from '../../services/upload.service';
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
  file: any;

  constructor(
    private forumManagerService: ForumManagerService,
    private authService: AuthService,
    private uploadService: UploadService,
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
          _this.router.navigate(['/dashboard']);
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

  onFileUpload(fileInput) {
    this.file = fileInput.target.files[0];
    console.log('file input:');
    console.log(this.file);
  }

  onReplyThreadSubmit() {
    var _this = this;
    if (this.user) {

      var newPost = {
        username: _this.user.username,
        profilePicture: _this.user.profilePicture,
        bodyText: _this.replyText,
        mediaURL: null
      };

      if (_this.file) {
        // upload the media 
        this.uploadService.uploadFile(_this.file).subscribe((data) => {
          if (data.succ) {
            console.log('uploaded new media');
            console.log(data);
            newPost.mediaURL = data.file.filename;
            _this.postReply(newPost);
          }
          else {
            // error uploading the file selected by the user
            toast('Failed to upload image!', 5000, 'red');
            return false;
          }
        });
      }
      else {
        _this.postReply(newPost);
      }
    }
    else {
      toast('Please login to post a reply!', 5000, 'red');
      return false;
    }
  }

  postReply(post) {
    const newPost = post;
    console.log('media = ' + newPost.mediaURL);
    this.forumManagerService.addReplyToThread(this.thread_id, newPost).subscribe(function(data) {
      if (data.succ) {
        location.reload();
      }
      else {
        toast('Invalid reply!', 5000, 'red');
        console.log(data.msg);
      }
    });
  }

}
