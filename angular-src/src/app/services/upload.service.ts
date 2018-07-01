import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})

export class UploadService {
  authToken: any;

  constructor(
    private http: Http,
    private jwtHelperService: JwtHelperService,
    private authService: AuthService
  ) { }

  uploadFile(file) {
    console.log('upload service uploading...');
    var formData = new FormData();
    formData.append('file', file, file.name);
    console.log(file);
    console.log(Array.from(formData.getAll('file')));
    let headers = new Headers();
    this.authToken = this.authService.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Accept', 'application/json');
    return this.http.post('http://localhost:3000/upload/', formData, {headers: headers}).pipe(
      map(function(res) {
        return res.json();
      })
    );
  }

  updateProfilePicture(userEmail, profilePicFilename) {
    const updateInfo = {email: userEmail, filename: profilePicFilename};
    let headers = new Headers();
    this.authToken = this.authService.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/upload/updateProfilePicture', updateInfo, {headers: headers}).pipe(
      map(function(res) {
        return res.json();
      })
    );
  }

  getImage(encFilename) {
    //  returns the image's buffer. right now: use http://localhost:3000/uploads/image/:filename
    let params = new URLSearchParams();
    params.append('filename', encFilename);
    let options = new RequestOptions({ params: params });
    return this.http.get('http://localhost:3000/upload/image/:image_id', options).subscribe(
      (data) => {
        console.log(data.toString());
      },
      (err) => {
        console.log(err);
      }
    );
  }

}
