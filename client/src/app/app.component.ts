import { Component, OnInit, HostListener } from '@angular/core';
import { StoreService } from './shared/services/store/store.service';
import { SocketService } from './shared/services/socket/socket.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './shared/services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  user: any;
  token: string = null;
  activeAuthRoute: boolean = true;

  constructor(
    private socketservice: SocketService,
    private storeservice: StoreService,
    private authservice: AuthService,
    private toast: ToastrService,
    private router: Router
  ) {
  }

  //logout from this session if user reloads
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    this.logout();
  }

  ngOnInit() {
    this.socketservice.setSocket();
    this.storeservice.getAuthUser().subscribe(data => { //setting the user of this session
      this.user = data;
      this.token = data ? data['token'] : null;
    });
    this.socketservice.getsocket().on('sessionOut', (data) => { //getting socket data. if user try connecting in another socket, this socket will be destroyed
      this.logout();
    });
  }

  isLoggedIn() {
    if (this.token) {
      return true;
    }
    return false;
  }

  logout() {
    this.authservice.sessionOut({ userId: this.user._id }).subscribe(_ => {
      this.storeservice.setAuthUser(null);
      this.toast.success('You are logged out.');
      this.router.navigate(['/auth']);
    });
  }

  changeRoute() {
    if (this.router.url.includes('/auth')) this.activeAuthRoute = true;
    else if (this.router.url.includes('/signup')) this.activeAuthRoute = false;
  }

}
