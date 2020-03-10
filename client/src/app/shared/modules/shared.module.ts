import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from './angular-material.module'; //https://material.angular.io/guide/getting-started#step-4-include-a-theme
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule
  ],
  exports:[
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    InfiniteScrollModule
  ]
})
export class SharedModule { }