import { Component, OnInit, Output,EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';

@Component({
  selector: 'app-mobile',
  templateUrl: './mobile.component.html',
  styleUrls: ['./mobile.component.css']
})
export class MobileComponent implements OnInit {

  @Output() mobileno:EventEmitter<string>=new EventEmitter<string>();
  @Input() public mobile:any='';

  form!:FormGroup;

  constructor(private fb:FormBuilder) { }

  ngOnInit(): void {
     if(this.mobile!=''){
      console.log(this.mobile);
      this.form=this.fb.group({
        code:[this.mobile.substring(0,3)],
        mobileno:[this.mobile.substring(3),[Validators.required,Validators.pattern('[0-9]{10}')]]
    })
    }
    else{
      this.form=this.fb.group({
        code:[],
        mobileno:[,[Validators.required,Validators.pattern('[0-9]{10}')]]
      })
    }
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
