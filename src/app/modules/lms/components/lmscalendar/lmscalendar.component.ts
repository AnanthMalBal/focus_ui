import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LmsserviceService } from '../../services/lmsservice.service';
import { AttendanceService } from '../../services/attendance.service';
import { TimesheetService } from '../../services/timesheet.service';
import { CalendarOptions, EventInput, EventSourceFuncArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-lmscalendar',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FullCalendarModule],
  templateUrl: './lmscalendar.component.html',
  styleUrl: './lmscalendar.component.scss',
  providers: [ToastrService]
})
export class LmscalendarComponent {
  empData: any;
  lmslist: any;
  leavebal: any;
  calenderItem: any = [];
  selectedToggle: string = '';
  mode = "WFH";
  name: string = "demo";
  count: any;
  description: any;
  userName: any;
  markedHours: any;
  notificationInterval: any;


  constructor(
    private lmsservice: LmsserviceService,
    private attendanceservice: AttendanceService,
    private timesheetservice: TimesheetService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.startAttendanceCheck();
    console.log("data", this.empData)
    this.leavebalance();
    this.getsignin();
  }

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    dateClick: (arg) => this.handleDateClick(arg),
    // events:[
    //   { title: 'event 1', date: '2024-09-01' }
    // ]
    events: this.LoadEvents.bind(this),
  }

  handleDateClick(arg: DateClickArg) {
    console.log('date click! ' + arg.dateStr);
    this.router.navigate(["timesheet", { date: arg.dateStr }

    ]);
  }

  async LoadEvents(args: EventSourceFuncArg): Promise<EventInput[]> {
    return new Promise<EventInput[]>((resolve) => {
      console.log("args", args);
      console.log("endstr", args.endStr.slice(0, 10))
      console.log("start", args.startStr.slice(0, 10));
      var start = args.startStr.slice(0, 10)

      this.lmsservice.getholidays(start)
        .subscribe((res) => {
          console.log("calendardata", res[0]);
          this.calenderItem = res[0];
          this.lmslist = res[1];
          const events: EventInput[] = [];
          for (let i of this.calenderItem) {
            events.push({
              // title:  i.title,
              date: i.cDate,
              color: i.color.toLowerCase(),
              display: 'list-item'
            })
          }
          console.log("events", events);
          resolve(events);
        })
    }
    )
  }


  leavebalance() {
    this.lmsservice.getleavebalance().subscribe(data => {
      this.leavebal = data;
      this.count = this.leavebal.Count;
      this.description = this.leavebal.Description;
      console.log("leavebal", this.leavebal)
    })
  }

  onToggleClick(option: string) {
    this.selectedToggle = option;
    console.log('Selected Option:', this.selectedToggle);
    this.attendanceservice.addAttendance(this.selectedToggle, this.mode)
      .subscribe((res) => {
        console.log('onToggleClick', res)
        Swal.fire({
          text:
            res.message,
          confirmButtonColor: 'rgb(133, 187, 131)',
          // background: '#efc96a',
        });
      })

  }

  getsignin() {
    this.timesheetservice.getSignDate()
      .subscribe((res) => {
        const markedData = res;
        this.markedHours = markedData.symbol;
        console.log("markedhours", this.markedHours)
        this.selectedToggle = this.markedHours;

      })
  }

  startAttendanceCheck() {
    this.checkAttendance();

    // Repeat check every 10 minutes (600,000 ms)
    this.notificationInterval = setInterval(() => {
      this.checkAttendance();
    }, 600000);
  }

  showSuccess() {
    console.log('Login Successful!')
    this.toastr.success('Login Successful!', 'Success');
  }


  checkAttendance() {
    const currentTime = new Date();
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    console.log('Current Time:', currentTime);
  
    // Check if time is past 10:00 AM
    if (hours >= 10 && minutes > 0) {
      console.log('Checking attendance at:', currentTime);
  
      this.timesheetservice.getSignDate().subscribe(
        (data) => {
          const attendanceData = data;
          console.log('Attendance Data:', attendanceData);
  
          // If attendance is recorded, stop the notifications
          if (!attendanceData || Object.keys(attendanceData).length === 0) {
            console.log('Attendance not marked, showing reminder.');
            this.toastr.show(
              'You have not marked your attendance yet!',
              'Attendance Reminder',
              { positionClass: "toast-top-left" }
            );
          } else {
            console.log('Attendance marked, stopping reminders.');
            clearInterval(this.notificationInterval); // Stop the repeating check
            
          }
        },
        (error) => {
          console.error('Error fetching attendance data:', error);
        }
      );
    }  
  }

}