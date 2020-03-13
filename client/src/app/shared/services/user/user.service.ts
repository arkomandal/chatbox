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

  public getOtherUsers(user_id){
    return this.http.get(`${this.GATEWAY}/user/list/otherthan/${user_id}`);
  }

  public registeredUsers(groupId){
    return this.http.get(`${this.GATEWAY}/map/users_by_group/${groupId}`);
  }

  public createGroup(token, group_name, users) {
    return this.http.post(`${this.GATEWAY}/group/add`, {
      group_name, users
    });
  }

  public addUserToGroup(groupId, userId) {
    return this.http.post(`${this.GATEWAY}/map/add_user_to_group`, {
      group_id: groupId,
      user_id: userId
    });
  }

  public removeUserFromGroup(groupId, userId) {
    return this.http.delete(`${this.GATEWAY}/map/remove_user_from_group/${groupId}/${userId}`);
  }

  public getUserGroups(userId, token) {
    return this.http.get(`${this.GATEWAY}/user/${userId}`);
  }

}