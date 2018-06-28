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
  file: any; // note: could this be changed to multiple files - yes

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

  onFileUpload(fileInput) {
    this.file = fileInput.target.files[0];
    console.log('file input:');
    console.log(this.file);
  }

  onFileSubmit() {
    console.log('attempting to upload file');
    this.uploadService.uploadFile(this.file).subscribe((data) => {
      console.log('got response');
      console.log(data);
    });
  }
}
