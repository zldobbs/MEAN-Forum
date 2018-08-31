import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FeedService } from '../../services/feed.service';
import { ForumManagerService } from '../../services/forum-manager.service';
import { toast } from 'angular2-materialize';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {
  user: any;
  file: any; // note: could this be changed to multiple files - yes
  stories: any;
  storyCols: any;

  constructor(
    private authService: AuthService,
    private feedService: FeedService,
    private forumManagerService: ForumManagerService
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

    // get stories from mongo, need a service to post them too (admin page)
    // dummy code
    // this.stories = [
    //   {
    //     'str': 'hello',
    //     'boxSize': 3,
    //     'backgroundColor': '#FFFFFF'
    //   },
    //   {
    //     'str': 'world',
    //     'boxSize': 3,
    //     'backgroundColor': '#FFFFFF'
    //   },
    //   {
    //     'str': 'yuh',
    //     'boxSize': 3,        
    //     'backgroundColor': '#FFFFFF'
    //   },
    //   {
    //     'str': 'asdf',
    //     'boxSize': 3,
    //     'backgroundColor': '#FFFFFF'
    //   },
    //   {
    //     'str': 'hi',
    //     'boxSize': 3,
    //     'backgroundColor': '#FFFFFF'
    //   },
    //   {
    //     'str': 'one',
    //     'boxSize': 3,
    //     'backgroundColor': '#FFFFFF'
    //   },
    //   {
    //     'str': 'tw',
    //     'boxSize': 3,
    //     'backgroundColor': '#FFFFFF'
    //   },
    //   {
    //     'str': 'three',
    //     'boxSize': 3,
    //     'backgroundColor': '#FFFFFF'
    //   },
    //   {
    //     'str': 'four',
    //     'boxSize': 3,
    //     'backgroundColor': '#FFFFFF'
    //   }
    // ];

    this.feedService.getFeed().subscribe((data) => {
      if (data.succ) {
        console.log(data);
        // scrape the thread id's ... getting a little confusing
        // need to maintain the thread w/ additional text and timestamp added 
        // will the data returned be in the same order as it is sent? (stable?)
        // now retrieve the actual threads for each thread id in the array
        _this.forumManagerService.getThreadsById()
      }
      else {
        toast("Failed to retrieve feed!", 5000, "red");
      }
    });

    this.storyCols = [];

    var lastSize = 0; 
    var storyCol;

    for (var i = 0; i < this.stories.length; i++) {
      switch (lastSize) {
        case 3:
          this.stories[i].boxSize = Math.floor((Math.random() * 2) + 1); // get num between 1-2
          lastSize = this.stories[i].boxSize;
          break;
        case 2:
          this.stories[i].boxSize = 1;
          lastSize = 0;
          break;
        case 1:
          this.stories[i].boxSize = 2;
          lastSize = 0;
          break;
        case 0:
        default:
          this.stories[i].boxSize = Math.floor((Math.random() * 3) + 1); // get num between 1-3
          lastSize = this.stories[i].boxSize;
          break;
      }
      // set random background color, need to actually apply this to the css 
      // probably be easier with a specific subset of colors, not the entire spectrum 
      this.stories[i].backgroundColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
      if (lastSize == 0 || lastSize == 3) {
        if (lastSize == 0) {
          storyCol = {
            'stories' : [
              this.stories[i - 1],
              this.stories[i]
            ]
          };  
        }
        else {
          storyCol = { "stories" : [this.stories[i]] };
        }
        this.storyCols.push(storyCol);
      }
    }
    if (lastSize == 1 || lastSize == 2) {
      storyCol = { 'stories' : [this.stories[i-1]] };
      this.storyCols.push(storyCol);
    }
    console.log(this.storyCols);
  }
}
