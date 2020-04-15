import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  data: any;
}

@Component({
  selector: 'app-renamegroup',
  templateUrl: './renamegroup.component.html',
  styleUrls: ['./renamegroup.component.scss']
})
export class RenamegroupComponent {

  constructor(
    public dialogRef: MatDialogRef<RenamegroupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
