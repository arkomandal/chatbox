import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardStoreService {

  constructor() { }

  private current_group = new BehaviorSubject('');
  setCurrentGroup(group_details) {
    this.current_group.next(group_details);
  }
  getCurrentGroup() {
    return this.current_group.asObservable();
  }
}