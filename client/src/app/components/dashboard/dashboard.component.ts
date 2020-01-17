import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { StoreService } from 'src/app/services/store/store.service';
import { UserService } from 'src/app/services/user/user.service';
import { MessageService } from 'src/app/services/message/message.service';
import { SocketService } from 'src/app/services/socket/socket.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'] //https://codepen.io/Jackthomsonn/pen/jWyGvX
})
export class DashboardComponent implements OnInit {
  user: any;
  groups: any = [];
  selectedGroup: any = null;
  messages: any = [];


  private page: number = 1;
  private users: any = [];
  private messagesToShow: any = [];
  private totalCount: Number = 0;
  public isFullListDisplayed: boolean = false;

  // messages1: any = [{
  //   Name: 'George Clooney',
  //   Message: "The only failure is not to try"
  // }, {
  //   Name: 'Seth Rogen',
  //   Message: "I grew up in Vancouver, man. That's where more than half of my style comes from."
  // }];
  groupForm = this.fb.group({
    group_name: ['', Validators.required]
  });

  messageForm = this.fb.group({
    message: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private storeservice: StoreService,
    private userservice: UserService,
    private messageService: MessageService,
    private socketService: SocketService
  ) { }

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
        this.messagesToShow = this.messages;;
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

  createGroup() {
    this.userservice.createGroup(this.user.token, this.groupForm.value.group_name, [this.user._id]).subscribe(() => {
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
}