import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LmsComponent } from './lms.component';
import { ApplyleaveComponent } from './components/applyleave/applyleave.component';
import { LeavehistoryComponent } from './components/leavehistory/leavehistory.component';
import { LmscalendarComponent } from './components/lmscalendar/lmscalendar.component';
import { TimesheetComponent } from './components/timesheet/timesheet.component';
import { EmployeeReportsComponent } from './components/employee-reports/employee-reports.component';
import { TeamReportComponent } from './components/team-report/team-report.component';
import { DailylogReportComponent } from './components/dailylog-report/dailylog-report.component';

const routes: Routes = [

    { path: 'applyleave', component: ApplyleaveComponent },
    { path: 'approveleave', component: LeavehistoryComponent },
    { path: 'lmscalendar', component: LmscalendarComponent },
    { path: 'myattendance', component: TimesheetComponent },
    { path: 'reports', component: EmployeeReportsComponent },
    { path: 'teamreports', component: TeamReportComponent },
    { path: 'dailylogreport', component: DailylogReportComponent }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LmsRoutingModule { }
