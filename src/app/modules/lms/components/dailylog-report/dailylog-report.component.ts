import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { ReportsService } from '../../services/reports.service';
import { AuthService } from 'src/app/modules/auth';
import moment from 'moment';

@Component({
  selector: 'app-dailylog-report',
  standalone: true,
  imports: [CommonModule, FormsModule, NgApexchartsModule, NgxDaterangepickerMd],
  templateUrl: './dailylog-report.component.html',
  styleUrl: './dailylog-report.component.scss'
})
export class DailylogReportComponent {

  loginData: any;
  userRoles: any;
  lastRole: any;
  fromDate = "2025-01-23";
  toDate = "2025-02-03";
  dailyLogEntry: any;

  public dailyLogChart: any;

  selectedRange: { startDate: moment.Moment; endDate: moment.Moment } = {
      startDate: moment().subtract(29, 'days'),
      endDate: moment(),
    };
  


  constructor(private reportService: ReportsService, private cdr: ChangeDetectorRef, private auth: AuthService){}


  ngOnInit(): void {
    // this.getEmployeeChart();
    // this.getDailyLog();
    this.loginData = this.auth.getAuthFromLocalStorage();
    this.userRoles = this.loginData.user.roles
    console.log('userRoles', this.userRoles);
    this.lastRole = this.userRoles[this.userRoles.length - 1];
    if (this.lastRole === "Employee") {
      this.lastRole = "emp";
    }
    console.log('userRole-----', this.lastRole);
    // this.onDateRangeSelected();
    this.getDailyLog();



  }

   locale = {
      format: 'DD-MM-YYYY',
      separator: ' - ',
      applyLabel: 'Apply',
      cancelLabel: 'Cancel',
      fromLabel: 'From',
      toLabel: 'To',
      customRangeLabel: 'Custom Range',
      weekLabel: 'W'
    };
  
    ranges: any = {
      'Today': [moment(), moment()],
      'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
      'Last 7 Days': [moment().subtract(6, 'days'), moment()],
      'Last 30 Days': [moment().subtract(29, 'days'), moment()],
      'This Month': [moment().startOf('month'), moment().endOf('month')],
      'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
      'Custom Range': []
    };
  
    onDateRangeSelected(range: any) {
      this.selectedRange = range;
      this.fromDate=range.startDate.format('YYYY-MM-DD');
      this.toDate=range.endDate.format('YYYY-MM-DD');
      console.log('Selected Range:', range.startDate.format('YYYY-MM-DD'), '-', range.endDate.format('YYYY-MM-DD'));
    }

    getDailyLog() {

      this.reportService.getdailyLog(this.lastRole, this.fromDate, this.toDate).
        subscribe((res) => {
          this.dailyLogEntry = res[0];
          console.log('data in getdailyLog', this.dailyLogEntry);
  
  
          this.dailyLogChart = {
            series: [
              {
                name: 'Daily Log Entry',
                data: this.dailyLogEntry.map((emp:any) => emp.totalDays),
                color: '#dc3545'
              },
              {
                name: 'Missed Days',
                data: this.dailyLogEntry.map((emp:any) => emp.leaveDays),
                color: '#28a745'
              },
            ],
            chart: {
              type: 'bar',
              height: 400,
            },
            title: {
              text: 'Daily Log Report',
              align: 'center',
              style: {
                fontSize: "18px",
                fontWeight: "bold",
              },
            },
            xaxis: {
              categories: this.dailyLogEntry.map((emp:any) => emp.userName),
            },
            yaxis: {
  
              title: {
                text: 'Number of Days',
              },
            },
            legend: {
              position: 'bottom',
            },
            dataLabels: {
              enabled: false, // Hide numbers on bars
            },
          };
  
        })
    }
  
  
}
