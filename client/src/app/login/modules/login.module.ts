import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginRoutingModule } from './login-routing.module';
import { SharedModule } from '../../shared/modules/shared.module';

import { LoginComponent } from '../components/container/login.component';
import { SessionoutComponent } from '../dialogs/sessionout/sessionout.component'

@NgModule({
  declarations: [
    LoginComponent,
    SessionoutComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    LoginRoutingModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [SessionoutComponent]
})
export class LoginModule { }
