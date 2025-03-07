import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LmsRoutingModule } from './lms-routing.module';
import { ApplyleaveComponent } from './components/applyleave/applyleave.component';
import { LeavehistoryComponent } from './components/leavehistory/leavehistory.component';
import { TimesheetComponent } from './components/timesheet/timesheet.component';
import { LmscalendarComponent } from './components/lmscalendar/lmscalendar.component';
import { RouterModule } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { EmployeeReportsComponent } from './components/employee-reports/employee-reports.component';
import { NgApexchartsModule } from "ng-apexcharts";
import { ToastrModule } from 'ngx-toastr';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [],
  imports: [
    CommonModule,
    LmsRoutingModule,
    RouterModule,
    ApplyleaveComponent,
    LeavehistoryComponent,
    LmscalendarComponent,
    TimesheetComponent,
    EmployeeReportsComponent,
    FullCalendarModule,
    NgApexchartsModule,
    NgxDaterangepickerMd.forRoot(),
    ToastrModule.forRoot({  // Global Toastr Configuration
      timeOut: 5000,  // Auto close time (3 sec)
      positionClass: 'toast-top-center', // Position of toast
      // progressBar: true, // Show progress bar
       closeButton: true, // Show close button
    })

  ]
},

)
export class LmsModule { }
