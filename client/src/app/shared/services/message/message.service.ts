import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Gateway } from '../gateway';

@Injectable({
  providedIn: 'root'
})
export class MessageService implements Gateway {

  GATEWAY: string = '';

  constructor(private http: HttpClient) {
    this.GATEWAY = `http://localhost:5000`;
  }

  public setMessage(token, sender, receiver_type, receiver, message) {
    return this.http.post(`${this.GATEWAY}/message/add`, {
      sender,
      receiver_type,
      receiver,
      message
    });
  }

  public getMessages(page, receiver_type, receiver, sender = '') {
    return this.http.get(`${this.GATEWAY}/message/list/${page}/1/?receiver_type=${receiver_type}&receiver=${receiver}&sender=${sender}`);
  }

}
