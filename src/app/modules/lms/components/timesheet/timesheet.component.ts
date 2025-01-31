import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { TimesheetModel } from '../../models/timesheet-model';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TimesheetService } from '../../services/timesheet.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-timesheet',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './timesheet.component.html',
  styleUrl: './timesheet.component.scss'
})
export class TimesheetComponent {

  workdata: any;
  depdata: any;
  projectdata: any;
  timesheetform!: FormGroup;
  sentDate: any
  empData: any;
  signindata: any;
  selectedBillType: string = '';
  dailylogData: any = [];
  timesheetid: any;
  totalActualTime: any;
  workingMin: any;
  buttonenable: boolean = true;
  attendancedate:any;
  modelData:any;
  timesheetData:any;

  constructor(private timesheetservice: TimesheetService,
    private fb: FormBuilder,
    private homeRoute: ActivatedRoute,
    private router: Router

  ) {  }

  ngOnInit(): void {

    this.homeRoute.params.subscribe((params: Params) =>
      this.sentDate = params[('date')],);
    console.log('getdate', this.sentDate)

    this.getsignin();
    this.getTimesheetId();
    this.workfor();


    this.timesheetform = this.fb.group({
      projectId: ['', Validators.required],
      processId: ['', Validators.required],
      // timesheetId: ['', Validators.required],
      actualTime: ['', Validators.required],
      description: ['', Validators.required],
      billType:['', Validators.required],
      attendanceDate:this.attendancedate,

    })
  }

  onProcessChange(): void {
    const processId = this.timesheetform.get('processId')?.value;
    const selectedProcess = this.depdata.find((dept: any) => dept.processId === processId);
    this.selectedBillType = selectedProcess ? selectedProcess.billType : '';
  }

  onProjectChange(){
    const processId = this.timesheetform.get('projectId')?.value;
    this.departmentfor(processId);
  }

  addTimesheet() {
    console.log(this.timesheetform.value);
    this.timesheetData=this.timesheetform.value

    this.modelData= new TimesheetModel();
    this.modelData.projectId=this.timesheetData.projectId;
    this.modelData.processId=this.timesheetData.processId;
    this.modelData.timesheetId=this.timesheetid;
    this.modelData.description=this.timesheetData.description;
    this.modelData.attendanceDate=this.attendancedate;
    this.modelData.actualTime=this.timesheetData.actualTime;

    console.log('modeldata timesheet',this.modelData);
    this.timesheetservice.addTimesheet(this.modelData)
      .subscribe((result: any) => {
        console.log(result)
        this.getDailylog(this.timesheetid);

      })
    this.timesheetform.reset();
  }

  submitTimesheet(){
    const totals = this.dailylogData.reduce(
      (acc:any, item:any) => {
        acc[item.billType] = (acc[item.billType] || 0) + item.actualTime;
        return acc;
      },
      {}
    );
    
    console.log("NBP Total:", totals["NBP"] || 0);
    console.log("B Total:", totals["B"] || 0);
    console.log("NBNP Total:", totals["NBNP"] || 0);

    const timesheetdata=new TimesheetModel();
    timesheetdata.timesheetId=this.timesheetid;
    timesheetdata.hoursNBNP=totals["NBNP"] || 0;
    timesheetdata.hoursNBP=totals["NBP"] || 0;
    timesheetdata.hoursBillable=totals["B"] || 0;
    this.timesheetservice.submitTSheet(timesheetdata)
    .subscribe(res=>{
      console.log("submit timesheet :", res);
 
    })
  }

  workfor() {
    this.timesheetservice.getwork().subscribe(data => {
      this.workdata = data
      console.log("work", this.workdata)
    })
  }

  departmentfor(id:any) {
    this.timesheetservice.getdepartment(id).subscribe(data => {
      this.depdata = data
      console.log("dep", this.depdata)
    })
  }

  getsignin() {
    this.timesheetservice.getSignDate()
      .subscribe((res) => {
        this.signindata = res;
        this.workingMin = this.signindata.workingHours * 60;
        console.log("signindata", this.signindata);
        console.log("signindata1", this.signindata.markedTime)

      })
  }

  getTimesheetId() {
    this.timesheetservice.getTimesheet(this.sentDate).subscribe(data => {
      this.projectdata = data[0];
      this.timesheetid = this.projectdata.timesheetId;
      this.attendancedate = this.projectdata._date
      console.log("timesheetid", this.timesheetid,this.attendancedate);
      this.getDailylog(this.timesheetid)


    })

  }

  getDailylog(timeId: any) {
    this.timesheetservice.getuserdailylog(timeId)
      .subscribe((res) => {
        this.dailylogData = res;
        console.log("dailylogdata", this.dailylogData);
        this.totalActualTime = this.dailylogData.reduce((sum: any, item: any) => sum + item.actualTime, 0);
        console.log("totaltime", this.totalActualTime, this.workingMin ,this.totalActualTime);
        if (this.totalActualTime >= this.workingMin) {
          console.log("iam there", );
          this.buttonenable = false;
        }else{
          this.buttonenable = true;

        }

      })

  }

  deletelog(id:any) {
    this.timesheetservice.deletedailylog(id)
    .subscribe((res)=>{
      console.log(" delete daily log",res)
      Swal.fire({
        text:res.message,
        confirmButtonColor:"rgb(133, 187, 131)",

      })
      this.getDailylog(this.timesheetid)
    })
  }

}
