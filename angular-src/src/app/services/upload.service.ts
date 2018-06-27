import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
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
    let headers = new Headers();
    this.authToken = this.authService.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json'); 
    console.log('sending file');
    console.log(file);
    return this.http.post('http://localhost:3000/upload/', file, {headers: headers}).pipe(
      map(function(res) {
        return res.json();
      })
    );  
  }

}
