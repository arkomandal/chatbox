import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { StoreService } from 'src/app/shared/services/store/store.service';
import { UserService } from 'src/app/shared/services/user/user.service';
import { MessageService } from 'src/app/shared/services/message/message.service';
import { SocketService } from 'src/app/shared/services/socket/socket.service';

import { MatDialog } from '@angular/material/dialog';
import { CreategroupComponent } from 'src/app/dashboard/dialogs/creategroup/creategroup.component'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'], //https://codepen.io/Jackthomsonn/pen/jWyGvX
  // changeDetection: ChangeDetectionStrategy.Default
})
export class DashboardComponent implements OnInit {
  user: any;
  groups: any = [];
  selectedGroup: any = null;
  messages: any = [];

  group_name: string = "";

  private page: number = 1;
  private messagesToShow: any = [];
  private totalCount: Number = 0;
  public isFullListDisplayed: boolean = false;

  messageForm = this.fb.group({
    message: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private storeservice: StoreService,
    private userservice: UserService,
    private messageService: MessageService,
    private socketService: SocketService,
    public dialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.storeservice.getAuthUser().subscribe(user => {
      this.user = user
    });
    this.socketService.getsocket().on('group message', (data) => {
      this.messages.push({ message: data.message, sender: data.sender, time: data.time })
    });
    this.socketService.getsocket().on('sender group message', (data) => {
      this.messages.push({ message: data.message, sender: data.sender, time: data.time });
    });
    this.getAllGroups();
  }

  onScroll() {
    if (this.messagesToShow.length <= this.totalCount) {
      this.page += 1;
      this.messageService.getMessages(2, this.selectedGroup._id, this.page).subscribe(data => {
        Array.prototype.push.apply(this.messages, data['messages']);
        this.messagesToShow = this.messages;
      });
    } else {
      this.isFullListDisplayed = true;
    }
  }

  getAllGroups() {
    this.userservice.getUserGroups(this.user._id, this.user.token).subscribe(data => {
      this.groups = data[0]['group_users'];
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CreategroupComponent, {
      width: '250px',
      data: { name: this.user.user_name, animal: this.group_name }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.group_name = result;
      if (this.group_name && this.group_name.trim() != "") this.createGroup(this.group_name);
    });
  }

  createGroup(group_name) {
    this.userservice.createGroup(this.user.token, group_name, [this.user._id]).subscribe(() => {
      this.getAllGroups();
    });
  }

  getGroupMessages(group) {
    this.selectedGroup = group;
    this.resetMessages();
    this.socketService.getsocket().emit('assign users', group._id);
    this.messageService.getMessages(2, group._id, this.page).subscribe(data => {
      //infinite scroll
      Array.prototype.push.apply(this.messages, data['messages']);
      this.totalCount = data['total'];
      this.messagesToShow = this.messages;
    });
  }

  resetMessages() {
    this.messages = [];
    this.messagesToShow = [];
    this.page = 1;
    this.isFullListDisplayed = false;
  }

  onSend(event) {
    if (event.keyCode == 13) {
      this.messageService.setMessage(this.user.token, this.user._id, 2, this.selectedGroup._id, this.messageForm.value.message).subscribe(data => {
        this.socketService.getsocket().emit('send group message', this.selectedGroup._id, this.user.user_name, this.messageForm.value.message, data['createdAt']);
        this.messageForm.reset();
      });
    }
  }

  responseFromChild(data) {
    this.selectedGroup = null;
    this.getAllGroups();
    this.resetMessages();
  }
}