import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserService } from 'src/app/shared/services/user/user.service';
import { ToastrService } from 'ngx-toastr';
import { StoreService } from 'src/app/shared/services/store/store.service';
import { MatDialog } from '@angular/material/dialog';
import {AddcontactsComponent} from '../../dialogs/addcontacts/addcontacts.component'

@Component({
  selector: 'app-moremenu',
  templateUrl: './moremenu.component.html',
  styleUrls: ['./moremenu.component.scss']
})
export class MoremenuComponent implements OnInit {
  @Input() group: any = {};
  @Output() output = new EventEmitter()

  constructor(
    public dialog: MatDialog,
    private storeservice: StoreService,
    private toast: ToastrService,
    private userService: UserService
  ) { }

  ngOnInit() {
  }

  assignFriends() {
    const dialogRef = this.dialog.open(AddcontactsComponent, {
      width: '250px',
      data: { groupId: this.group._id}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log('data could be added', result);
    });

    //show mutual contacts from google contact and database like whatsapp
    //open a dialog for selecting contacts

    //when done add
    // this.userService.addUserToGroup(this.group._id, '[contacts]').subscribe(data => {
    //   if (data) this.toast.info("Successfully added");
    //   else this.toast.warning("Please try again");
    // }, () => {
    //   this.toast.warning("Please try again");
    // });
  }

  leaveGroup() {
    this.storeservice.getAuthUser().subscribe(user => {
      this.userService.removeUserFromGroup(this.group._id, user._id).subscribe(data => {
        if (data) {
          this.output.emit(data);
          this.toast.info("You've left");
        }
      }, () => {
        this.toast.warning("Please try again");
      });
    });
  }
}