import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportsService } from '../../services/reports.service';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexLegend, ApexTitleSubtitle, ApexXAxis, ApexYAxis, NgApexchartsModule } from "ng-apexcharts";


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
  imports: [CommonModule, FormsModule, NgApexchartsModule],
  templateUrl: './employee-reports.component.html',
  styleUrl: './employee-reports.component.scss',
})
export class EmployeeReportsComponent {

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
  public dailyLogChart:any;

  jsonData: any[] = [];
  dailyLogEntry:any[] =[];
  empDataById: any;

  empName: any = [];
  empLeave: any = [];
  empHoliday: any = [];
  empDaysPresent: any = [];

  constructor(private reportService: ReportsService, private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.getEmployeeChart();
    this.getEmployeeChartByid();
    this.getDailyLog();

  }

  getEmployeeChart() {
    this.reportService.getReportChart().
      subscribe((res) => {
        this.jsonData = res;
        console.log('datain jsonData', this.jsonData.map(emp => emp.name))
        this.empName = this.jsonData.map(emp => emp.name);
        this.empLeave = this.jsonData.map(emp => emp.leave);
        this.empDaysPresent = this.jsonData.map(emp => emp.daysPresent);
        this.empHoliday = this.jsonData.map(emp => emp.holiday);
        console.log('datain jsonData', this.empLeave);

        this.chartOptions = {
          series: [
            {
              name: 'Leave',
              data: this.empLeave,
              color:'#dc3545'
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

  getEmployeeChartByid() {

    this.reportService.getReportChartById().
      subscribe((res) => {
        this.empDataById = res[0];
        console.log('datain empDataById', this.empDataById);

        this.pieChartOptions = {
          series: [this.empDataById.leave, this.empDataById.daysPresent, this.empDataById.holiday],
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

          labels: ["Days Present", "Leaves", "Holidays"],
          colors: ["#28a745", "#dc3545", "#ffc107"], // Green, Red, Yellow
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

  getDailyLog(){

    this.reportService.getdailyLog().
    subscribe((res) => {
      this.dailyLogEntry = res;
      console.log('data in getdailyLog', this.dailyLogEntry);


      this.dailyLogChart = {
        series: [
          {
            name: 'Leave',
            data: this.dailyLogEntry.map(emp => emp.dailyLogEntry),
            color:'#dc3545'
          },
          {
            name: 'Days Present',
            data:this.dailyLogEntry.map(emp => emp.missedDays),
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
          categories: this.dailyLogEntry.map(emp => emp.name),
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