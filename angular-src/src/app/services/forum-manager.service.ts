import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ForumManagerService {
  user: any;
  post: any;
  authToken: string;

  constructor(
    private http: Http,
    private jwtHelperService: JwtHelperService,
    private authService: AuthService
  ) {}

  createThread(post) {
    let headers = new Headers();
    this.authToken = this.authService.loadToken();
    console.log('Token = ' + this.authToken);
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
    headers.append('Content-Type', 'application/json');
    console.log('attempting to get the threads');
    // TODO: at a future point these functions will get more refined
    return this.http.get('http://localhost:3000/forum/allThreads', {headers: headers}).pipe(
      map(function(res) {
        return res.json();
      })
    );
  }

  getAllPostsInThread(thread_id) {
    let headers = new Headers();
    const thread = {thread_id : thread_id}
    console.log('the thread is : ' + thread_id);
    headers.append('Content-Type', 'application/json');
    // FIXME: this post request should be a get request? not sure on proper protocol here
    return this.http.post('http://localhost:3000/forum/postsFromThread', thread, {headers: headers}).pipe(
      map(function(res) {
        return res.json();
      })
    );
  }

  // TODO: createPost(post)
}
