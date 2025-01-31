import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environmentpath } from 'src/app/pages/environments/environments';
import { environment } from 'src/environments/environment';
import { AuthModel } from '../auth/models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  constructor(private http: HttpClient) { }

  addAttendance(symbol: any, mode: any): Observable<any> {
    console.log("symbolMode", symbol, mode);

    return this.http.post(`${environmentpath.markAttendance}`, { "symbol": symbol, "mode": mode }    )
    
      .pipe(map((result: any) => {
        console.log(result);

      }))
  }


}
