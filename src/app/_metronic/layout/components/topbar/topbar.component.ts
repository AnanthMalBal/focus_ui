import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { AttendanceService } from 'src/app/modules/lms/services/attendance.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
})
export class TopbarComponent implements OnInit{


  // for mark attendance
  selectedToggle: string = '';
  mode="WFH";

  // for getMarkattendance

  constructor(private authService: AuthService,
    private attendanceservice:AttendanceService,
  ) {}
  ngOnInit(): void {

     this.getsignin();

  }

  // method for markattendance
  onToggleClick(option: string) {
    this.selectedToggle = option;
    console.log('Selected Option:', this.selectedToggle);
     this.attendanceservice.addAttendance(this.selectedToggle,this.mode)
    .subscribe((res: any)=>{
      console.log('onToggleClick',res)
       // Update markedHours so the UI reflects the selected attendance immediately
    })

  }

  getsignin() {
    this.attendanceservice.getMarkattendance()
      .subscribe((res) => {
        const markedData=res;
         this.selectedToggle = markedData.symbol;
        console.log("markedhours",this.selectedToggle)

      })
  }

}
