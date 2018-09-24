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

  createThread(thread) {
    let headers = new Headers();
    this.authToken = this.authService.loadToken();
    console.log('Token = ' + this.authToken);
    console.log('Thread tags = ' + thread.threadTags);
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/forum/createThread', thread, {headers: headers}).pipe(
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

  getThreadsWithTag(tags) {
    let headers = new Headers();
    const selectedTags = {selectedTags: tags};
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/forum/threadsWithTag', selectedTags, {headers: headers}).pipe(
      map(function(res) {
        return res.json();
      })
    );
  }

  getThreadsById(thread_ids) {
    console.log("getting threads: " + thread_ids);
    let headers = new Headers();
    const queryIds = {thread_ids: thread_ids};
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/forum/threadsWithId', queryIds, {headers: headers}).pipe(
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
    return this.http.post('http://localhost:3000/forum/postsFromThread', thread, {headers: headers}).pipe(
      map(function(res) {
        return res.json();
      })
    );
  }

  addReplyToThread(thread_id, post) {
    let headers = new Headers();
    // this seems redundant.....
    // no need for me to make a new post object, should just take the post passed in 
    const newPost = {
      thread_id : thread_id,
      username : post.username,
      profilePicture: post.profilePicture,
      mediaURL: post.mediaURL,
      bodyText : post.bodyText
    }
    this.authToken = this.authService.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/forum/createPost', newPost, {headers: headers}).pipe(
      map(function(res) {
        return res.json();
      })
    );
  }
}
