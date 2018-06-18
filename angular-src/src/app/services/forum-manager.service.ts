import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ForumManagerService {
  authToken: any;
  user: any;
  post: any;

  constructor(
    private http: Http,
    private jwtHelperService: JwtHelperService,
    private authService: AuthService
  ) {}

  createThread(post) {
    let headers = new Headers();
    this.authService.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/forum/createThread', post, {headers: headers}).pipe(
      map(function(res) {
        return res.json();
      })
    );
  }

  getAllThreads() {
    let headers = new Headers();
    this.authService.loadToken();
    headers.append('Content-Type', 'application/json');
    // TODO: implement allThreads route to get all threads
    // TODO: at a future point these functions will get more refined
    return this.http.get('http://localhost:3000/forum/allThreads', {headers: headers}).pipe(
      map(function(res) {
        return res.json();
      })
    );
  }

  // TODO: createPost(post)
}
