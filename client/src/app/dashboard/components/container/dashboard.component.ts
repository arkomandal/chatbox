import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { StoreService } from 'src/app/shared/services/store/store.service';
import { UserService } from 'src/app/shared/services/user/user.service';
import { MessageService } from 'src/app/shared/services/message/message.service';
import { SocketService } from 'src/app/shared/services/socket/socket.service';

import { MatDialog } from '@angular/material/dialog';
import { CreategroupComponent } from 'src/app/dashboard/dialogs/creategroup/creategroup.component'
import { DashboardStoreService } from '../../services/dashboardstore/dashboardstore.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'], //https://codepen.io/Jackthomsonn/pen/jWyGvX
})
export class DashboardComponent implements OnInit {
  @ViewChild('scrollMe', { static: false }) private myScrollContainer: ElementRef;
  scrollHeight: number = 0;

  listType: number = 1;
  users: any = [];
  user: any;
  groups: any = [];
  selectedGroup: any = null;
  selectedUser: any = null;
  messages: any = [];

  group_name: string = "";

  private page: number = 1;
  private messagesToShow: any = [];
  private totalCount: Number = 0;
  public isFullListDisplayed: boolean = false;

  messageForm = this.fb.group({
    message: ['', Validators.required]
  });

  userTypingMessage: string = "";

  constructor(
    private fb: FormBuilder,
    private storeservice: StoreService,
    private dashboardStoreService: DashboardStoreService,
    private userservice: UserService,
    private messageService: MessageService,
    private socketService: SocketService,
    public dialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.storeservice.getAuthUser().subscribe(user => {
      this.user = user;
      this.getAllGroups();
      this.getAllUsers();
    });

    //group settings
    this.socketService.getsocket().on('typing', (data) => {
      this.userTypingMessage = `${data.senderName} is typing...`;
      setTimeout(() => {
        this.userTypingMessage = "";
      }, 1000);
    });
    this.socketService.getsocket().on('group message', (data) => {
      this.messages.push({ message: data.message, sender: data.senderName, time: data.time, senderId: data.senderId })
      this.setScroll();
    });

    //user settings
    this.socketService.getsocket().on('typingPersonal', () => {
      this.userTypingMessage = ` is typing...`;
      setTimeout(() => {
        this.userTypingMessage = "";
      }, 1000);
    });
    this.socketService.getsocket().on('messagePersonal', (data) => {
      if (data.senderId == this.selectedUser._id) {
        this.messages.push({ message: data.message, sender: data.senderName, time: data.time, senderId: data.senderId })
        this.setScroll();
      }
    });
    this.socketService.getsocket().on('messagePersonalToSameUser', (data) => {
      this.messages.push({ message: data.message, sender: data.senderName, time: data.time, senderId: data.senderId })
      this.setScroll();
    });

    this.setConnectedUsers();
  }

  onScroll() {
    console.log('listtype: ', this.listType)
    if (this.messagesToShow.length <= this.totalCount) {
      this.page += 1;
      if (this.listType == 1) {
        this.messageService.getMessages(this.page, 1, this.selectedUser._id, this.user._id).subscribe(data => {
          Array.prototype.push.apply(this.messages, data['messages']);
          this.messagesToShow = this.messages;
          this.setScroll();
        });
      } else if (this.listType == 2) {
        this.messageService.getMessages(this.page, 2, this.selectedGroup._id).subscribe(data => {
          Array.prototype.push.apply(this.messages, data['messages']);
          this.messagesToShow = this.messages;
          this.setScroll();
        });
      }
    } else {
      this.isFullListDisplayed = true;
    }
  }

  setList(type) {
    this.listType = type;
  }

  getAllGroups() {
    this.userservice.getUserGroups(this.user._id, this.user.token).subscribe(data => {
      this.groups = data[0]['group_users'];
    });
  }

  getAllUsers() {
    this.userservice.getOtherUsers(this.user._id).subscribe(data => {
      this.users = data;
    }, () => { }, () => {
      this.setConnectedUsers();
    });
  }

  //adding socket_id with users
  setConnectedUsers() {
    this.storeservice.getConnectedUsers().subscribe(con_users => {
      this.users = this.users.map((user) => {
        let match = con_users.filter((con_user) => con_user.user_id == user._id ? true : false)[0];
        return match ? { ...user, active: true, socket_id: match.socket_id } : { ...user, active: false, socket_id: '' };
      });
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CreategroupComponent, {
      width: '250px',
      data: { name: this.user.user_name, animal: this.group_name }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.group_name = result;
      if (this.group_name && this.group_name.trim() != "") this.createGroup(this.group_name);
    });
  }

  createGroup(group_name) {
    this.userservice.createGroup(this.user.token, group_name, [this.user._id]).subscribe(() => {
      this.getAllGroups();
    });
  }

  getUserMessages(user) {
    this.selectedGroup = null;
    this.selectedUser = user;
    this.resetMessages();

    //getting messages
    this.messageService.getMessages(this.page, 1, this.selectedUser._id, this.user._id).subscribe(data => {
      //infinite scroll
      Array.prototype.push.apply(this.messages, data['messages']);
      this.totalCount = data['total'];
      this.messagesToShow = this.messages;
      this.setScroll();
    });
  }

  getGroupMessages(group) {
    this.selectedUser = null;
    this.selectedGroup = group;
    this.resetMessages();

    //leaving previous group
    const subscription = this.dashboardStoreService.getCurrentGroup().subscribe((data) => {
      this.socketService.getsocket().emit('unsubscribe', data);
    });
    subscription.unsubscribe();

    //entering new group
    this.socketService.getsocket().emit('subscribe', group._id);
    this.messageService.getMessages(this.page, 2, this.selectedGroup._id).subscribe(data => {
      //infinite scroll
      Array.prototype.push.apply(this.messages, data['messages']);
      this.totalCount = data['total'];
      this.messagesToShow = this.messages;
      this.dashboardStoreService.setCurrentGroup(group._id);
      this.setScroll();
    });
  }

  setScroll() {
    setTimeout(() => this.scrollHeight = this.myScrollContainer.nativeElement.scrollHeight, 0);
  }

  resetMessages() {
    this.messages = [];
    this.messagesToShow = [];
    this.page = 1;
    this.isFullListDisplayed = false;
    this.userTypingMessage = "";
  }

  onSend(event) {
    if (event.keyCode == 13) {
      this.messageService.setMessage(this.user.token, this.user._id, 2, this.selectedGroup._id, this.messageForm.value.message).subscribe(data => {
        this.socketService.getsocket().emit('send group message', this.selectedGroup._id, this.user._id, this.user.user_name, this.messageForm.value.message, data['createdAt']);
        this.messageForm.reset();
      });
    } else {
      this.socketService.getsocket().emit('typing', this.selectedGroup._id, this.user.user_name);
    }
  }

  onSendUser(event) {
    if (event.keyCode == 13) {
      this.messageService.setMessage(this.user.token, this.user._id, 1, this.selectedUser._id, this.messageForm.value.message).subscribe(data => {
        this.socketService.getsocket().emit('messagePersonal', this.selectedUser.socket_id, this.user._id, this.user.user_name, this.messageForm.value.message, data['createdAt']);
        this.messageForm.reset();
      });
    } else {
      this.socketService.getsocket().emit('typingPersonal', this.selectedUser.socket_id, this.user.user_name);
    }
  }

  responseFromChild(data) {
    this.selectedGroup = null;
    this.getAllGroups();
    this.resetMessages();
  }
}