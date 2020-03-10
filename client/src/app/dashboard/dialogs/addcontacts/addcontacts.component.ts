import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from 'src/app/shared/services/user/user.service';
export interface DialogData {
  data: any;
}
@Component({
  selector: 'app-addcontacts',
  templateUrl: './addcontacts.component.html',
  styleUrls: ['./addcontacts.component.scss']
})
export class AddcontactsComponent implements OnInit {
  private users_not_added: any = [];

  constructor(
    public dialogRef: MatDialogRef<AddcontactsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.userService.registeredUsers(this.data['groupId']).subscribe(data => {
      this.users_not_added = data['users_not_added'];
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}