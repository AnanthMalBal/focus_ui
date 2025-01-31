import { Component, OnInit } from '@angular/core';
import { AttendanceService } from 'src/app/modules/lms/services/attendance.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  selectedToggle: string = '';
  mode="WFH";

  
  constructor(private attendanceservice:AttendanceService,) {}

  ngOnInit(): void {}
  onToggleClick(option: string) {
    this.selectedToggle = option;
    console.log('Selected Option:', this.selectedToggle);
     this.attendanceservice.addAttendance(this.selectedToggle,this.mode)
    .subscribe((res: any)=>{
      console.log('onToggleClick',res)
      
    })

  }
}
