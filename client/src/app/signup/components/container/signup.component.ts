import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/shared/services/user/user.service';
import { SocketService } from 'src/app/shared/services/socket/socket.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  // Roles: any = ['Admin', 'Author', 'Reader'];
  signupForm = this.fb.group({
    user_name: ['', Validators.required],
    phone: ['', Validators.required],
    password: ['', Validators.required]
  });

  constructor(
    private toast: ToastrService,
    private userservice: UserService,
    private socketService: SocketService,
    private fb: FormBuilder,
    private router: Router) { }

  ngOnInit() {
  }

  onSubmit() {
    this.userservice.signup(this.signupForm.value).subscribe(data => {
      if (data['status'] == 409) {
        this.toast.warning(data['message']);
      }
      else {
        this.toast.success('Success!');
        this.socketService.getsocket().emit('newUserSignup');
        this.router.navigate(['/auth']);
      }
    }, (err) => {
      this.toast.warning(JSON.stringify(err))
    });
  }
}
