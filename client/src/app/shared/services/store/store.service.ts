import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  constructor() { }

  private auth_user = new BehaviorSubject(null);
  setAuthUser(user_details) {
    this.auth_user.next(user_details);
  }
  getAuthUser() {
    return this.auth_user;
  }

  private connectedUsers = new BehaviorSubject([]);
  setConnectedUsers(data) {
    this.connectedUsers.next(data);
  }
  getConnectedUsers() {
    return this.connectedUsers;
  }
}