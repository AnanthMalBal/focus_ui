import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LmsRoutingModule } from './lms-routing.module';
import { ApplyleaveComponent } from './components/applyleave/applyleave.component';
import { LeavehistoryComponent } from './components/leavehistory/leavehistory.component';
import { TimesheetComponent } from './components/timesheet/timesheet.component';
import { LmscalendarComponent } from './components/lmscalendar/lmscalendar.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    LmsRoutingModule
  ],
  // exports: [ApplyleaveComponent, TimesheetComponent, LmscalendarComponent, LeavehistoryComponent] 
})
export class LmsModule { }
