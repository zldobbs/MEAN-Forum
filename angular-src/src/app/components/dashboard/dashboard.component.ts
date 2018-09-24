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
  tagText: any;
  file: any;
  selectedTags: any;

  constructor(
    private authService: AuthService,
    private forumManagerService: ForumManagerService,
    private uploadService: UploadService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    const _this = this;
    this.selectedTags = [];
    // TODO: implement getThreads()
    this.forumManagerService.getAllThreads().subscribe(function(data) {
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

  filterThreads() {
    const _this = this;
    this.forumManagerService.getThreadsWithTag(_this.selectedTags).subscribe(function(data) {
      if (data.succ) {
        _this.threads = data.threads;
        _this.router.navigate(['/dashboard']);
      }
      else {
        toast('Found no posts with specified tags', 5000, 'red');
      }
    });
  }

  addTag(tag) {
    if (this.selectedTags.indexOf(tag) < 0) {
      this.selectedTags.push(tag);
      this.filterThreads();  
    }
  }

  clearTag(tag) {
    const _this = this;
    const index = this.selectedTags.indexOf(tag);
    if (index > -1) {
      _this.selectedTags.splice(index, 1);
      if (_this.selectedTags.length == 0) {
        _this.forumManagerService.getAllThreads().subscribe(function(data) {
          if (data.succ) {
            _this.threads = data.threads;
            _this.router.navigate(['/dashboard']);
          }
          else {
            toast('Could not retrieve threads!', 5000, 'red');
            return false;
          }
        });
      }
      else {
        _this.filterThreads();
      }
    }
  }

  goToThread(thread_id) {
    this.router.navigate(
      ['/viewThread', {
        thread_id: thread_id
      }]
    );
  }
}
