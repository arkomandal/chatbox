import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Gateway } from '../gateway';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements Gateway {

  GATEWAY: string = '';

  constructor(private http: HttpClient) {
    this.GATEWAY = `http://localhost:5000`;
  }

  public authenticate(body) {
    return this.http.post(`${this.GATEWAY}/user/authenticate`, body)
  }
}