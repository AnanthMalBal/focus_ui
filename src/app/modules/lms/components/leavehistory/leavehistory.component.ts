import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { LeaveModel } from '../../models/leave-model';
import { LeaveService } from '../../services/leave.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-leavehistory',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './leavehistory.component.html',
  styleUrl: './leavehistory.component.scss'
})
export class LeavehistoryComponent {

  empData:any;
  leavedata:any;
  leavemodel:any;  

constructor(private leaveservice:LeaveService,

){ }

  ngOnInit(): void {
    this.getLeaves();
  }

  formatDate(date: Date): string {
    // Format date as yyyy-MM-dd
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getLeaves(){
    const currentYear = new Date().getFullYear();
    const firstDate = new Date(currentYear, 0, 1); // January 1st
    const lastDate = new Date(currentYear, 11, 31); // December 31st
    console.log('First Date of the Year:', firstDate);
    console.log('Last Date of the Year:', lastDate);
    const first= this.formatDate(firstDate);
    const last= this.formatDate(lastDate)

    this.leavemodel=new LeaveModel();
    this.leavemodel.fromDate=first;
    this.leavemodel.toDate=last;
    this.leavemodel.page=1;
    this.leavemodel.perPage=10;
    this.leavemodel.sort="modifiedDate desc";
    console.log('leavemodel to service',this.leavemodel)
    this.leaveservice.getleavehistory(this.leavemodel)
    .subscribe((res:any)=>{
      console.log('leavedata result',res);
      this.leavedata=res.data;
      console.log('leavedata',this.leavedata.data);
    })

  }
  cancelleave(id:any){
    this.leaveservice.cancelLeave(id)
    .subscribe((result:any)=>{
      const resData=result
      Swal.fire({
        text:
          resData.message,
          confirmButtonColor: '#2ecc71',
      });
      this.getLeaves();
    })

  }

}
