import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { StoreService } from 'src/app/shared/services/store/store.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SocketService } from 'src/app/shared/services/socket/socket.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm = this.fb.group({
    phone: ['', Validators.required],
    password: ['', Validators.required]
  });

  constructor(
    private toast: ToastrService,
    private fb: FormBuilder,
    private socketService: SocketService,
    private authservice: AuthService,
    private storeservice: StoreService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  onSubmit() {
    this.authservice.sessionStatus(this.loginForm.value).subscribe(session => {
      if (!session['active']) {
        this.authenticate();
      } else {
        if (confirm('Sessions ongoing! Logout from other sessions and continue?')) {
          this.authservice.sessionOut({ userId: session['userId'] }).subscribe(_ => {
            this.socketService.getsocket().emit('sessionOut', {
              socket_id: session['socket_id']
            });
            this.authenticate();
          });
        }
      }
    });
  }

  authenticate() {
    this.authservice.authenticate({ ...this.loginForm.value, socket_id: this.socketService.getsocket().id }).subscribe(data => {
      this.toast.success('Logged In!');
      this.storeservice.setAuthUser(data);
    }, (err) => {
      this.toast.warning(JSON.stringify(err));
    }, () => {
      this.router.navigate(['/dashboard']);
    });
  }
}