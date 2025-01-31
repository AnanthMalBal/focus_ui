import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environmentpath } from 'src/app/pages/environments/environments';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { AuthModel } from '../../auth/models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;

  getdata: any;

  constructor(private http: HttpClient) { }

  addAttendance(symbol: any, mode: any): Observable<any> {
    console.log("symbolMode", symbol, mode);
    const auth = this.getAuthFromLocalStorage(); // Get token from localStorage

    const httpHeaders = new HttpHeaders({
      Authorization: `${auth ? auth.authToken : ""}`,
    });

    return this.http.post(`${environmentpath.markAttendance}`, { "symbol": symbol, "mode": mode },
      { headers: httpHeaders })
      .pipe(map((result: any) => {
        console.log(result);


      }))
  }


  private getAuthFromLocalStorage(): AuthModel | undefined {
    try {
      const lsValue = localStorage.getItem(this.authLocalStorageToken);
      if (!lsValue) {
        return undefined;
      }

      const authData = JSON.parse(lsValue);
      return authData;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }




}
