import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from 'src/app/shared/services/user/user.service';
import { StoreService } from 'src/app/shared/services/store/store.service';
export interface DialogData {
  data: any;
}
@Component({
  selector: 'app-addcontacts',
  templateUrl: './addcontacts.component.html',
  styleUrls: ['./addcontacts.component.scss']
})
export class AddcontactsComponent implements OnInit {
  private users: any = [];
  private current_user: string = "";

  constructor(
    public dialogRef: MatDialogRef<AddcontactsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private userService: UserService,
    private storeService: StoreService
  ) { }

  ngOnInit() {
    this.storeService.getAuthUser().subscribe((this_user) => {
      this.current_user = this_user._id;
      this.userService.registeredUsers(this.data['groupId']).subscribe(data => {
        this.users = data;
        this.users = this.users.map(user => user._id == this.current_user ? { ...user, user_name: 'You' } : user)
      });
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}