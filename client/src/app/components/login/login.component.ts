import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { StoreService } from 'src/app/services/store/store.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

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
    private authservice: AuthService,
    private storeservice: StoreService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  onSubmit() {
    this.authservice.authenticate(this.loginForm.value).subscribe((data) => {
      this.toast.success('Logged In!');
      this.storeservice.setAuthUser(data);
    }, (err) => {
      this.toast.warning(JSON.stringify(err))
    }, () => {
      this.router.navigate(['/dashboard']);
    })
  }
}
