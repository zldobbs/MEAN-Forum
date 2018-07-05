import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UploadService } from '../../services/upload.service';
import { Router } from '@angular/router';
import { toast } from 'angular2-materialize';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any;
  file: any;

  constructor(
    private authService: AuthService,
    private uploadService: UploadService,
    private router: Router
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

    // find all threads that a user is involved in.
    // two queries, one for all threads that have user as owner
    // second is any posts that the user has replied too
    // display in one box, denote through a slight shading to differentiate
    // sort the results based on timestamp of most recent post / thread 
    // make sure only one result per thread is being displayed (most recent post from thread as well)
    // how to solve this efficiently..?
  }

  onFileUpload(fileInput) {
    const _this = this;
    this.file = fileInput.target.files[0];
    console.log('file input:');
    console.log(this.file);
    console.log('attempting to upload file');
    this.uploadService.uploadFile(this.file).subscribe((data) => {
      // now update the actual user
      // FIXME: not doing error checking here.. could come back to bite me in the ass 
      if (data.succ) {
        console.log(_this.user.email);
        _this.uploadService.updateProfilePicture(_this.user.email, data.file.filename).subscribe((data) => {
          if(data.succ) {
            // refresh page 
            location.reload();
          }
          else {
            toast('Failed to upload profile picture!', 5000, 'red'); 
          }
        });
      }
    });
  }

}
