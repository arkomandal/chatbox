import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignupRoutingModule } from './signup-routing.module';
import { SharedModule } from '../../shared/modules/shared.module';

import { SignupComponent } from '../components/container/signup.component';

@NgModule({
  declarations: [
    SignupComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    SignupRoutingModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SignupModule { }
