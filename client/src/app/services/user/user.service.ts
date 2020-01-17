import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Gateway } from '../gateway';

@Injectable({
  providedIn: 'root'
})
export class UserService implements Gateway {

  GATEWAY: string = '';

  constructor(private http: HttpClient) {
    this.GATEWAY = `http://localhost:5000`;
  }

  public signup(body) {
    return this.http.post(`${this.GATEWAY}/user/add`, body);
  }

  public createGroup(token, group_name, users) {
    return this.http.post(`${this.GATEWAY}/group/add`, {
      group_name, users
    });
  }

  public getUserGroups(userId, token) {
    return this.http.get(`${this.GATEWAY}/user/${userId}`);
  }
}