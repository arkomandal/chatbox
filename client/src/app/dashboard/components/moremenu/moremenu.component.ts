import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserService } from 'src/app/shared/services/user/user.service';
import { ToastrService } from 'ngx-toastr';
import { StoreService } from 'src/app/shared/services/store/store.service';
import { MatDialog } from '@angular/material/dialog';
import { AddcontactsComponent } from '../../dialogs/addcontacts/addcontacts.component'
import { SocketService } from 'src/app/shared/services/socket/socket.service';

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
    private userService: UserService,
    private socketService: SocketService
  ) { }

  ngOnInit() {
  }

  assignFriends() {
    const dialogRef = this.dialog.open(AddcontactsComponent, {
      width: '250px',
      data: { groupId: this.group._id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let ids = result.filter(el => el.checked && !el.disabled).map(el => el._id);
        this.userService.addUserToGroup(this.group._id, ids).subscribe(data => {
          if (data) {
            this.toast.success("Successfully added");
            //notifying sockets that it is assigned to refresh group list to get the newly assigned one
            this.storeservice.getConnectedUsers().subscribe((data) => {
              data.filter(user => ids.includes(user.user_id)).forEach(user => {
                this.socketService.getsocket().emit('assignmentNotification', user.socket_id);
              });
            });
          }
          else this.toast.warning("Please try again");
        }, () => {
          this.toast.warning("Please try again");
        });
      }
    });
  }

  leaveGroup() {
    if (confirm("Are you sure?")) {
      this.storeservice.getAuthUser().subscribe(user => {
        this.userService.removeUserFromGroup(this.group._id, user._id).subscribe(data => {
          if (data) {
            this.socketService.getsocket().emit('unsubscribe', this.group._id);
            this.output.emit(data);
            this.toast.success("You've left");
          }
        }, () => {
          this.toast.warning("Please try again");
        });
      });
    }
  }

  renameGroup() {
    console.log("this functionality is not implemented yet");
  }
}