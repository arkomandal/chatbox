import { Injectable, Injector } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from "@angular/common/http";
import { Observable } from 'rxjs';
import { StoreService } from '../store/store.service';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

//Every http request and responses are modified using this injectable provider in ngModule
@Injectable()
export class SetAuth implements HttpInterceptor {
    token: string = null;
    constructor(
        private router: Router,
        private storeservice: StoreService,
        private toast: ToastrService
    ) {
        this.storeservice.getAuthUser().subscribe(data => this.token = data ? data['token'] : null)
    }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const modified = req.clone({ setHeaders: { 'Authorization': 'Bearer ' + this.token } });
        return next.handle(modified).pipe(tap(() => {},
            (err: any) => {
                if (err instanceof HttpErrorResponse) {
                    if (err.status === 401) {
                        this.router.navigate(['/auth']);
                        this.storeservice.setAuthUser(null);
                        this.toast.warning('Session out. Please login to continue.');
                    }
                }
            }
        ));
    }
}