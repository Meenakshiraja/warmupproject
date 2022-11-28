import { Injectable } from '@angular/core';
import {HttpClient,HttpErrorResponse} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { IStudent } from './student/studentinterface';

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  constructor(private http:HttpClient) { }

  poststudent(data:any){
    return this.http.post<any>("http://localhost:3000/posts",data).
      pipe(catchError(this.handleError));
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
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  getstudent():Observable<IStudent>{
    return this.http.get<IStudent>("http://localhost:3000/posts").
      pipe(catchError(this.handleError));
  }

  updatestudent(data:any,id:number){
    return this.http.put("http://localhost:3000/posts/"+id,data).
      pipe(catchError(this.handleError));
  }

  deletestudent(id:number){
    return this.http.delete("http://localhost:3000/posts/"+id).
      pipe(catchError(this.handleError));
  }
}
