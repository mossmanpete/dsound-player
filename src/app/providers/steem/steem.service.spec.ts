import { TestBed } from '@angular/core/testing';

import { SteemService } from './steem.service';

describe('SteemService', () => {
   beforeEach(() => TestBed.configureTestingModule({}));

   it('should be created', () => {
      const service: SteemService = TestBed.get(SteemService);
      expect(service).toBeTruthy();
   });
});
