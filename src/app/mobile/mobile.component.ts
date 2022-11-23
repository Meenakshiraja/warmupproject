import { Component, OnInit, Output,EventEmitter } from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-mobile',
  templateUrl: './mobile.component.html',
  styleUrls: ['./mobile.component.css']
})
export class MobileComponent implements OnInit {

  @Output() mobileno:EventEmitter<string>=new EventEmitter<string>();

  form!:FormGroup;

  constructor(private rootform:FormGroupDirective) { }

  ngOnInit(): void {
    this.form=this.rootform.control;
  }

  addmobile(code:any,no:any){
    let value:string=code+no;
    this.mobileno.emit(value);
  }
}
