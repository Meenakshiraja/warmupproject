import { Component, OnInit, Output,EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';

@Component({
  selector: 'app-mobile',
  templateUrl: './mobile.component.html',
  styleUrls: ['./mobile.component.css']
})
export class MobileComponent implements OnInit {

  @Output() mobileno:EventEmitter<string>=new EventEmitter<string>();

  form!:FormGroup;

  constructor(private fb:FormBuilder) { }

  ngOnInit(): void {
    this.form=this.fb.group({
      code:[],
      mobileno:[,[Validators.required,Validators.pattern('[0-9]{10}')]]
    })
  }

  addmobile(code:any,no:any){
    let value:string=code+no;
    this.mobileno.emit(value);
  }

  get f()
  {
    return this.form.get('mobileno');
  }
}
