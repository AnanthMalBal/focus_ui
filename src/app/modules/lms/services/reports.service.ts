import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environmentpath } from 'src/app/pages/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

 id:any=15002


  constructor(private http:HttpClient) { }

  getReportChart(): Observable<any> {
    console.log("employee reports");
    return this.http.get(`${environmentpath.getEmpChart}`, {})
      .pipe(
        tap(result => console.log("employee reports:", result)),
        catchError(error => {
          console.error("Error fetching employee reports:", error);
          return throwError(() => error);
        })
      );
  }

  getReportChartById(role:any,from:any,to:any): Observable<any> {
    console.log("employee reports by id",role,from,to);
    const bodyData={"empType":role,"fromDate":from,"toDate":to};
    return this.http.post(`${environmentpath.getEmpChartById}`, {"empType":role,"fromDate":from,"toDate":to})
      .pipe(
        tap(result => console.log("employee reports by id:", result)),
        catchError(error => {
          console.error("Error fetching employee reports by id:", error);
          return throwError(() => error);
        })
      );
  }

  getdailyLog(role:any,from:any,to:any): Observable<any> {
    console.log("daily log entry");
    return this.http.post(`${environmentpath.getDailyLogEntry}`, {"empType":role,"fromDate":from,"toDate":to})
      .pipe(
        tap(result => console.log("daily log entry", result)),
        catchError(error => {
          console.error("Error fetching daily log entry:", error);
          return throwError(() => error);
        })
      );
  }
}
