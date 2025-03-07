import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportsService } from '../../services/reports.service';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexLegend, ApexTitleSubtitle, ApexXAxis, ApexYAxis, NgApexchartsModule } from "ng-apexcharts";
import * as moment from 'moment';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { AuthService } from 'src/app/modules/auth';

// import {
//   ApexAxisChartSeries,
//   ApexChart,
//   ApexXAxis,
//   ApexDataLabels,
//   ApexLegend,
//   ApexYAxis,
//   ApexTitleSubtitle,
//   ChartComponent,
// } from 'ng-apexcharts';



@Component({
  selector: 'app-employee-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, NgApexchartsModule, NgxDaterangepickerMd],
  templateUrl: './employee-reports.component.html',
  styleUrl: './employee-reports.component.scss',
})
export class EmployeeReportsComponent {

  loginData: any;
  userRoles: any;
  lastRole: any;
  fromDate = "2025-01-23";
  toDate = "2025-02-03";

  public dailyLogChart: any;


  chartOptions: {
    series: ApexAxisChartSeries
    chart: ApexChart
    xaxis: ApexXAxis
    yaxis: ApexYAxis
    title: ApexTitleSubtitle
    legend: ApexLegend
    dataLabels: ApexDataLabels
  };

  public pieChartOptions: any;

  jsonData: any[] = [];
  dailyLogEntry: any[] = [];
  empDataById: any;

  empName: any = [];
  empLeave: any = [];
  empHoliday: any = [];
  empDaysPresent: any = [];

  selectedRange: { startDate: moment.Moment; endDate: moment.Moment } = {
    startDate: moment().subtract(29, 'days'),
    endDate: moment(),
  };

  constructor(private reportService: ReportsService, private cdr: ChangeDetectorRef, private auth: AuthService) {
  }


  ngOnInit(): void {
    // this.getEmployeeChart();
    // this.getDailyLog();
    this.loginData = this.auth.getAuthFromLocalStorage();
    this.userRoles = this.loginData.user.roles
    console.log('userRoles', this.userRoles);
    this.lastRole = this.userRoles[0];
    if (this.lastRole === "Employee") {
      this.lastRole = "emp";
    }
    console.log('userRole-----', this.lastRole);
    this.getEmployeeChartByid();


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


  getEmployeeChartByid() {

    this.reportService.getReportChartById(this.lastRole, this.fromDate, this.toDate).
      subscribe((res) => {
        this.empDataById = res[0][0];
        console.log('datain empDataById', this.empDataById);

        this.pieChartOptions = {
          series: [this.empDataById.leaveDays, this.empDataById.presentDays, this.empDataById.holiday],
          chart: {
            type: "donut",
            height: 350
          },
          title: {
            text: "Employee Attendance Overview", // Title for the pie chart
            align: "center",
            style: {
              fontSize: "18px",
              fontWeight: "bold",
            },
          },

          labels: ["Leave Days", "Present Days", "Holidays"],
          colors: ["#dc3545", "#28a745", "#ffc107"], // Green, Red, Yellow
          responsive: [
            {
              breakpoint: 480,
              options: {
                chart: {
                  width: 300,
                },
                legend: {
                  position: "bottom",
                },
              },
            },
          ],
        };


      })

  }


}