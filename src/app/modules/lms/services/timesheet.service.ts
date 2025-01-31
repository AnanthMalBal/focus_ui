import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { environmentpath } from 'src/app/pages/environments/environments';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class TimesheetService {
  result: any;
  timesheetdata:any;
  subTimesheet:any;
  division="DEV";

  constructor(private http: HttpClient, private router: Router) { }
 
 
  getwork(): Observable<any>{
    return this.http.post<any>(`${environmentpath.getProjectList}`,{"divisionId":this.division})
    .pipe(
      tap(result => console.log("project list fetched:", result)),
      catchError(error => {
        console.error("Error fetching project list:", error);
        return throwError(() => error);
      })
    );
  }

  getdepartment(projectid:any): Observable<any>{
    return this.http.post<any>(`${environmentpath.getProcessList}`,{"projectId":projectid})
    .pipe(
      tap(result => console.log("process list fetched:", result)),
      catchError(error => {
        console.error("Error fetching process list:", error);
        return throwError(() => error);
      })
    );  }

  getTimesheet(date:any): Observable<any>{
    console.log(" getproject",date );
    return this.http.post<any>(`${environmentpath.getTimesheetId}`,{"fromDate":date,"toDate":date})
    .pipe(
      tap(result => console.log("getTimesheet fetched:", result)),
      catchError(error => {
        console.error("Error fetching getTimesheet:", error);
        return throwError(() => error);
      })
    );
  }

  getuserdailylog(timeid:any): Observable<any>{
    console.log(" getdailylog" );
    console.log(" timeid",timeid );
    return this.http.post<any>(`${environmentpath.getDailyLog}`,{"timesheetId" :timeid })
    .pipe(
      tap(result => console.log("getDailyLog:", result)), 
      catchError(error => {
        console.error("Error in getDailyLog:", error);
        return throwError(() => error); 
      })
    );
  }

  getSignDate(): Observable<any>{
    return this.http.post(`${environmentpath.getMarkAttendance}`,{})
    .pipe(
      tap(result => console.log("MarkAttendance fetched:", result)), 
      catchError(error => {
        console.error("Error fetching MarkAttendance:", error);
        return throwError(() => error); 
      })
    );  }
  
  deletedailylog(autoId:any): Observable<any>{
    console.log(" deleted"+autoId );
    return this.http.post<any>(`${environmentpath.deleteDailyLog}`,{"autoId" :autoId })
    .pipe(
      tap(result => console.log("deleteDailyLog:", result)
    ), 
      catchError(error => {
        console.error("Error in deleteDailyLog:", error);
        return throwError(() => error); 
      })
    );
  }

  submitTSheet(data:any): Observable<any>{
    return this.http.post(`${environmentpath.submitTimesheet}`,data )
    .pipe(map((result: any) => {
      this.subTimesheet=result;
      console.log("submitTSheet",result);
      Swal.fire({
        text:
          this.subTimesheet.message,
          confirmButtonColor:"rgb(133, 187, 131)",
      });


    }))

  }

  addTimesheet(data:any): Observable<any> {
    console.log("data",data);
    return this.http.post(`${environmentpath.addDailyLog}`,data )
      .pipe(map((result: any) => {
        this.timesheetdata=result
        Swal.fire({
          text:
            this.timesheetdata.message,
            confirmButtonColor:"rgb(133, 187, 131)",
        });
      }))
    }

}
