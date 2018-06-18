import { TestBed, inject } from '@angular/core/testing';

import { ForumManagerService } from './forum-manager.service';

describe('ForumManagerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ForumManagerService]
    });
  });

  it('should be created', inject([ForumManagerService], (service: ForumManagerService) => {
    expect(service).toBeTruthy();
  }));
});
