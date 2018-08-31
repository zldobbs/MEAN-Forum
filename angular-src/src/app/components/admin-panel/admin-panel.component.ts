import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FeedService } from '../../services/feed.service';
import { UploadService } from '../../services/upload.service';
import { ForumManagerService } from '../../services/forum-manager.service';
import { toast } from 'angular2-materialize';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {
  user: any;
  bodyText: String;
  tagText: any;
  file: any;

  constructor(
    private router: Router,
    private authService: AuthService,
    private feedService: FeedService,
    private uploadService: UploadService,
    private forumManagerService: ForumManagerService
  ) { }

  ngOnInit() {
    const _this = this;
    this.authService.getProfile().subscribe(function(profile) {
      _this.user = profile.user
    },
    function(err) {
      console.log('getProfile error: ' + err);
      return false;
    });
  }

  onCreateThreadSubmit() {
    const newThread = {
      username: this.user.username,
      profilePicture: this.user.profilePicture,
      bodyText: this.bodyText,
      threadTags: null,
      mediaURL: null
    }
    const _this = this;
    // check for tags
    if (_this.tagText) {
      newThread.threadTags = _this.tagText.split(' ');
    }
    if (_this.file) {
      // upload the media 
      _this.uploadService.uploadFile(_this.file).subscribe((data) => {
        if (data.succ) {
          console.log('uploaded new media');
          console.log(data);
          newThread.mediaURL = data.file.filename;
          _this.postThread(newThread);
        }
        else {
          // error uploading the file selected by the user
          toast('Failed to upload image!', 5000, 'red');
          return false;
        }
      });
    }
    else {
      _this.postThread(newThread);
    }
  }

  postThread(post) {
    const _this = this;
    this.forumManagerService.createThread(post).subscribe(function(data) {
      if (data.succ) {
        toast('Thread created!', 5000, 'green');
        // now add the thread to the feed
        const feedThread = {
          thread_id: data.thread_id,
          additional_text: null,
          timestamp_added: new Date()
        }
        _this.feedService.addThreadToFeed(feedThread).subscribe((feedData) => {
          if (feedData.succ) {
            toast('Added thread to feed', 5000, 'green');
            _this.router.navigate(['/feed']);
          }
          else {
            toast('Failed to add thread to feed', 5000, 'red');
            _this.router.navigate(['/adminPanel']);
          }
        });
      }
      else {
        toast('Failed to create thread', 5000, 'red');
        _this.router.navigate(['/dashboard']);
      }
    });
  }
}
