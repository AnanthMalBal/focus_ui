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
    FullCalendarModule
  ],
},

)
export class LmsModule { }
