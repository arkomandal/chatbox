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

  public getMessages(receiver_type, receiver, page) {
    return this.http.get(`${this.GATEWAY}/message/list/${'123'}/${receiver_type}/${receiver}/${page}/1/`);
  }

}
