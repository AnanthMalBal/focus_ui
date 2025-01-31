import { Injectable } from '@angular/core';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { LeaveModel } from '../models/leave-model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environmentpath } from 'src/app/pages/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {
  result: any;
  applyleavedata: any;
  leavemodel: any

  constructor(private http: HttpClient, private router: Router) { }

  getLeaveType(): Observable<any> {
    console.log("getleaveTypa");
    return this.http.post(`${environmentpath.getLeaveType}`, {})
      .pipe(
        tap(result => console.log("Leave Typa fetched:", result)),
        catchError(error => {
          console.error("Error fetching leave type:", error);
          return throwError(() => error);
        })
      );
  }

  addleave(data: LeaveModel): Observable<any> {
    console.log("applyleavedata in service", data);
    return this.http.post(`${environmentpath.applyLeave}`, data)
      .pipe(map((result: any) => {
        this.applyleavedata = result
        console.log(result);
        Swal.fire({
          text:
            this.applyleavedata.message,
          confirmButtonColor: '#2ecc71',
        });

      }))
  }

  getleavehistory(data: any): Observable<any> {
    return this.http.post(`${environmentpath.searchLeave}`, data)
      .pipe(tap(result => console.log("leavehistory fetched:", result)),
        catchError(error => {
          console.error("Error fetching leave type:", error);
          return throwError(() => error);
        }))
}


cancelLeave(leaveId: any): Observable < any > {
  return this.http.post<any>(`${environmentpath.cancelLeave}`, { leaveId })

}
}
