import { Component, OnInit, OnChanges } from '@angular/core';
import { StoreService } from './shared/services/store/store.service';
import { SocketService } from './shared/services/socket/socket.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnChanges {
  user: any;
  token: string = null;
  activeAuthRoute: boolean = true;

  constructor(
    private socketservice: SocketService,
    private storeservice: StoreService,
    private toast: ToastrService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.socketservice.setSocket();
    this.storeservice.getAuthUser().subscribe(data => {
      this.user = data;
      this.token = data ? data['token'] : null;
    });
  }

  ngOnChanges() {
    this.storeservice.getAuthUser().subscribe(data => {
      this.user = data;
      this.token = data ? data['token'] : null;
    });
  }

  isLoggedIn() {
    if (this.token) {
      return true;
    }
    return false;
  }

  logout() {
    this.storeservice.setAuthUser(null);
    this.toast.success('You are logged out.');
  }

  changeRoute(){
    if (this.router.url.includes('/auth')) this.activeAuthRoute = true;
    else if (this.router.url.includes('/signup')) this.activeAuthRoute = false;
  }

}
