import { Injectable } from '@angular/core';
import {HttpClient,HttpErrorResponse} from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  constructor(private http:HttpClient) { }

  poststudent(data:any){
    return this.http.post<any>("http://localhost:3000/posts",data).
      pipe(map(res=>{
        return res;
      }))
      // catchError(this.handleError))
  }  

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    // return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  getstudent(){
    return this.http.get("http://localhost:3000/posts").
      pipe(map(res=>{
        return res;
      }))
  }

  updatestudent(data:any,id:number){
    return this.http.put("http://localhost:3000/posts/"+id,data).
      pipe(map(res=>{
        return res;
      }))
  }

  deletestudent(id:number){
    return this.http.delete("http://localhost:3000/posts/"+id).
      pipe(map(res=>{
        return res;
      }))
  }
}
