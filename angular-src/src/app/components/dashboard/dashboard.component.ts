import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ForumManagerService } from '../../services/forum-manager.service';
import { UploadService } from '../../services/upload.service';
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
  file: any;

  constructor(
    private authService: AuthService,
    private forumMangagerService: ForumManagerService,
    private uploadService: UploadService,
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

  onFileUpload(fileInput) {
    this.file = fileInput.target.files[0];
    console.log('file input:');
    console.log(this.file);
  }

  onCreateThreadSubmit() {
    const newPost = {
      username: this.user.username,
      profilePicture: this.user.profilePicture,
      bodyText: this.bodyText,
      mediaURL: null
    }
    const _this = this;
    if (_this.file) {
      // upload the media 
      _this.uploadService.uploadFile(_this.file).subscribe((data) => {
        if (data.succ) {
          console.log('uploaded new media');
          console.log(data);
          newPost.mediaURL = data.file.filename;
          _this.postThread(newPost);
        }
        else {
          // error uploading the file selected by the user
          toast('Failed to upload image!', 5000, 'red');
          return false;
        }
      });
    }
    else {
      _this.postThread(newPost);
    }
  }

  postThread(post) {
    const _this = this;
    this.forumMangagerService.createThread(post).subscribe(function(data) {
      if (data.succ) {
        toast('Thread created!', 5000, 'green');
        _this.goToThread(data.thread_id);
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
