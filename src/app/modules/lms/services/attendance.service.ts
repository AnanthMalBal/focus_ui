import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { environmentpath } from 'src/app/pages/environments/environments';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { AuthModel } from '../../auth/models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  getdata: any;

  constructor(private http: HttpClient) { }

  addAttendance(symbol: any, mode: any): Observable<any> {
    console.log("symbolMode", symbol, mode);
    return this.http.post(`${environmentpath.markAttendance}`, { "symbol": symbol, "mode": mode },
     )
      .pipe(map((result: any) => {
        console.log(result);


      }))
  }

  getMarkattendance(): Observable<any>{
    return this.http.post(`${environmentpath.getMarkAttendance}`,{})
    .pipe(
      tap(result => console.log("MarkAttendance fetched:", result)), 
      catchError(error => {
        console.error("Error fetching MarkAttendance:", error);
        return throwError(() => error); 
      })
    );  }







}
