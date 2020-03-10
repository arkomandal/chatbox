import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { StoreService } from '../store/store.service';

@Injectable({
  providedIn: 'root'
})
export class AuthguardService {
  token: string = null;
  constructor(private router: Router, private storeservice: StoreService) { }

  canActivateChild() {
    this.storeservice.getAuthUser().subscribe(data => this.token = data ? data["token"] : null);
    if (this.token) return true;
    else this.router.navigate(['/auth']);
  }
}