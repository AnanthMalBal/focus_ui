import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LeaveModel } from '../../models/leave-model';
import Swal from 'sweetalert2';
import { LeaveService } from '../../services/leave.service';
import { LmsserviceService } from '../../services/lmsservice.service';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-applyleave',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './applyleave.component.html',
  styleUrl: './applyleave.component.scss'
})
export class ApplyleaveComponent {

  leavedata:any;
  leaveform!:FormGroup;
  loginData:any;
  newdata:any;
  addleavemessage:any;
  leavebal:any;
  from:any='';
  to:any='';
  noDays:any='';
  capturedValue:any;
  daysdiff:any='';
  minDate: string = '';
  maxDate: string = '';
  count:any;
  description:any;


  constructor(
    private leaveservice:LeaveService,
    private fb:FormBuilder,
    private authservice:AuthService,
    private lmsservice:LmsserviceService,
    private router:Router
  ){
    //  authservice.apiData$.subscribe((data: any) => this.loginData = data)
    }

  ngOnInit(): void {
    this.getLeave();
    this.leavebalance();

    this.leaveform= this.fb.group({
      symbol: ['', [Validators.required]],
      fromDate: ['', [Validators.required]],
      toDate: ['', [Validators.required]],
      reason: ['', [Validators.required]],
      noOfDays: ['', [Validators.required]]

    })
    console.log("data",this.loginData)

    const currentDate = new Date();
    this.from=this.formatDate(currentDate);
    this.to=this.formatDate(currentDate);

    console.log("from",this.from)
    this.minDate = this.formatDate(currentDate);
    this.maxDate = this.formatDate(currentDate);   
  }

  formatDate(date: Date): string {
    // Format date as yyyy-MM-dd
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onLeaveTypeChange(): void {
    console.log("leavetypeevent")
    const leavetype=this.leaveform.get('symbol')?.value;
    const selectedLeaveType = this.leavedata.find(
      (leave:any) => leave.leaveTypeId ===leavetype
    );

    if (selectedLeaveType) {
      const maxDays = selectedLeaveType.maxDays;
      console.log("+++(selectedLeaveType++")
  
      // Calculate max date based on maxDays
      const currentDate = new Date();
      this.from=this.formatDate(currentDate);
      this.to=this.formatDate(currentDate);
      const maxDate = new Date(currentDate);
      maxDate.setDate(currentDate.getDate() + maxDays);

      // Update min and max dates
      this.minDate = this.formatDate(currentDate);
      this.maxDate = this.formatDate(maxDate);
      console.log("+++(selectedLeaveType++",this.minDate,this.maxDate)


    }
  }

  updateNoOfDays(daysdiff: number) {
    this.leaveform.patchValue({
      noOfDays: daysdiff
    });
  }

  sumbitLeave(){
    console.log("form",this.leaveform.value)

    const leaveformData = this.leaveform.value;
    var from=leaveformData.fromDate.split('T');
     var to=leaveformData.toDate.split('T');
    console.log('dates',from[0],to[0],from,to);
    this.newdata= new LeaveModel();
    this.newdata.fromDate=from[0];
    this.newdata.toDate=to[0];
    this.newdata.symbol=leaveformData.symbol
    this.newdata.reason=leaveformData.reason;
    this.leaveservice.addleave(this.newdata)
    .subscribe((res: any)=>{
      this.addleavemessage=res
      console.log(this.addleavemessage);
      Swal.fire({
        text:
        this.addleavemessage.message,
      });
    })
    this.leaveform.reset();
    const currentDate = new Date();
    this.from=this.formatDate(currentDate);
    this.to=this.formatDate(currentDate);


  }

  clearform(){
    this.leaveform.reset();
    const currentDate = new Date();
    this.from=this.formatDate(currentDate);
    this.to=this.formatDate(currentDate);


  }

  getLeave(){
    this.leaveservice.getLeaveType()
    .subscribe((result: any)=>{
      this.leavedata=result
      console.log("leavedata",this.leavedata)

    })
  }

  onInputChange() {
    console.log("diff of days");
    const fdate = new Date( this.leaveform.get('fromDate')?.value);
    const tdate = new Date( this.leaveform.get('toDate')?.value);
    console.log("diff of days====",fdate,tdate);
    const timeDifference = tdate.getTime() - fdate.getTime();
    this.daysdiff = timeDifference / (1000 * 3600 * 24);
    console.log("diff of days==",this.daysdiff);

  }

  leavebalance(){
    this.lmsservice.getleavebalance().subscribe((data:any)=>{
      this.leavebal=data
      console.log("leavebal",this.leavebal);
      this.count=this.leavebal.Count;
      this.description=this.leavebal.Description;

    })
  }

  leavehistory(){
    this.router.navigate(["leavehistory"])
  }

}
