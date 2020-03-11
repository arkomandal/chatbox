import { TestBed } from '@angular/core/testing';

import { DashboardStoreService } from './dashboardstore.service';

describe('StoreService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DashboardStoreService = TestBed.get(DashboardStoreService);
    expect(service).toBeTruthy();
  });
});
