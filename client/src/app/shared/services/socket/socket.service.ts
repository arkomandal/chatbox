import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  public socket: SocketIOClient.Socket; //npm install @types/socket.io-client socket.io-client --save

  constructor() { }

  public setSocket() {
    this.socket = io.connect("http://localhost:5000");
  }
  public getsocket() {
    return this.socket;
  }
  
}
