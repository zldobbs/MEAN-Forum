import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UploadService } from '../../services/upload.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {
  user: any;

  constructor(
    private authService: AuthService,
    private uploadService: UploadService
  ) { }

  ngOnInit() {
    const _this = this;
    this.authService.getProfile().subscribe(function(profile) {
      if (profile.succ) {
        _this.user = profile.user;
      }
      else {
        console.log(profile.msg);
        return false;
      }
    });
  }

  onFileUploadSubmit() {
    console.log('attempting to upload file');
    // should probably not be sending json, instead send form data
    const _this = this;
    // what should file be ..?
    // this.uploadService.uploadFile(file).subscribe((data) => {
    //   console.log(data);
    // });
  }
}
