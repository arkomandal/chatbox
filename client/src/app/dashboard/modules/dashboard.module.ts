import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from '../../shared/modules/shared.module';

import { DashboardComponent } from '../components/container/dashboard.component';
import { MoremenuComponent } from '../components/moremenu/moremenu.component'
import { CreategroupComponent } from 'src/app/dashboard/dialogs/creategroup/creategroup.component'
import { RenamegroupComponent } from 'src/app/dashboard/dialogs/renamegroup/renamegroup.component';
import { AddcontactsComponent } from '../dialogs/addcontacts/addcontacts.component';

@NgModule({
  declarations: [
    DashboardComponent,
    MoremenuComponent,
    CreategroupComponent,
    RenamegroupComponent,
    AddcontactsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    DashboardRoutingModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [CreategroupComponent, RenamegroupComponent, AddcontactsComponent]
})
export class DashboardModule { }
