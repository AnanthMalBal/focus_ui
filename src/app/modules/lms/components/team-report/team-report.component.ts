import { ChangeDetectorRef, Component } from '@angular/core';
import moment from 'moment';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexLegend, ApexTitleSubtitle, ApexXAxis, ApexYAxis, NgApexchartsModule } from 'ng-apexcharts';
import { ReportsService } from '../../services/reports.service';
import { AuthService } from 'src/app/modules/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';

@Component({
  selector: 'app-team-report',
  standalone: true,
  imports: [CommonModule, FormsModule, NgApexchartsModule, NgxDaterangepickerMd],
  templateUrl: './team-report.component.html',
  styleUrl: './team-report.component.scss'
})
export class TeamReportComponent {

  loginData: any;
  userRoles: any;
  lastRole: any;
  fromDate = "2025-01-23";
  toDate = "2025-02-03";

  jsonData: any[] = [];

  empName: any = [];
  empLeave: any = [];
  empHoliday: any = [];
  empDaysPresent: any = [];


  chartOptions: {
    series: ApexAxisChartSeries
    chart: ApexChart
    xaxis: ApexXAxis
    yaxis: ApexYAxis
    title: ApexTitleSubtitle
    legend: ApexLegend
    dataLabels: ApexDataLabels
  };

  selectedRange: { startDate: moment.Moment; endDate: moment.Moment } = {
    startDate: moment().subtract(29, 'days'),
    endDate: moment(),
  };

  constructor(private reportService: ReportsService, private cdr: ChangeDetectorRef, private auth: AuthService) {
  }

  ngOnInit(): void {
    this.loginData = this.auth.getAuthFromLocalStorage();
    this.userRoles = this.loginData.user.roles
    console.log('userRoles', this.userRoles);
    this.lastRole = this.userRoles[this.userRoles.length - 1];
    if (this.lastRole === "Employee") {
      this.lastRole = "emp";
    }
    console.log('userRole-----', this.lastRole);
    this.getEmployeeChart();
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
    console.log('Selected Range:', range.startDate.format('MMMM D, YYYY'), '-', range.endDate.format('MMMM D, YYYY'));
  }

  getEmployeeChart() {
    this.reportService.getReportChartById(this.lastRole, this.fromDate, this.toDate).
      subscribe((res) => {
        this.jsonData = res[0];
        console.log('datain jsonData',res, this.jsonData.map(emp => emp.userName))
        this.empName = this.jsonData.map(emp => emp.userName);
        this.empLeave = this.jsonData.map(emp => emp.leaveDays);
        this.empDaysPresent = this.jsonData.map(emp => emp.presentDays);
        this.empHoliday = this.jsonData.map(emp => emp.holiday);
        console.log('datain jsonData', this.empLeave);

        this.chartOptions = {
          series: [
            {
              name: 'Leave',
              data: this.empLeave,
              color: '#dc3545'
            },
            {
              name: 'Days Present',
              data: this.empDaysPresent,
              color: '#28a745'
            },
            {
              name: 'Holiday',
              data: this.empHoliday,
              color: '#ffc107'
            },
          ],
          chart: {
            type: 'bar',
            height: 400,
            stacked: true,
          },
          title: {
            text: 'Employee Attendance Report',
            align: 'center',
            style: {
              fontSize: "18px",
              fontWeight: "bold",
            },
          },
          xaxis: {
            categories: this.empName,
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
  };

}
