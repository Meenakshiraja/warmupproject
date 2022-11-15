import { Component, OnInit } from '@angular/core';
import { FormBuilder,Validators } from '@angular/forms';
import { IState, ICity } from 'country-state-city';



@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {

  dropdownsetting:any;
  states:IState[]=[];
  districts:ICity[]=[];
  stateiso:any=[];
  csc = require('country-state-city').State;
  cscity = require('country-state-city').City;
  genders=['Male','Female','Other'];
  statecity=[
    {state:"TamilNadu",city:["Chennai","Sivakasi","Virudhunagar","Madurai","Salem"]},
    {state:"Andhra Pradesh",city:["Vijayawada","Visakhapatnam","Tirupati","Nellore"]},
    {state:"Kerala",city:["Thiruvananthapuram","Kozhikode","Kochi"]}
  ];
  city:string[]=this.statecity[0].city;

  constructor(private fb:FormBuilder) { }

  ngOnInit(): void {
    this.initDropdownSettings();
    this.getStates();
    this.handleValueChanges();
  }

  studentform = this.fb.group
  ({
    name:['',Validators.compose([Validators.required,Validators.pattern('[a-zA-Z .]*')])],
    dob:['',Validators.required],
    email:['', Validators.compose([Validators.required, Validators.email])],
    mobile:['',Validators.compose([Validators.required,Validators.pattern('[0-9]{10}')])],
    gender:['',Validators.required],
    currentaddress:['',Validators.required],
    permanentaddress:['',Validators.required],
    sameaddress:[false],
    state:['',Validators.required],
    district:['',Validators.required],
    state1:['',Validators.required],
    district1:['',Validators.required],
    roll:['',Validators.compose([Validators.required,Validators.pattern('[a-zA-Z0-9 .]*')])],
    schoolname:['',Validators.compose([Validators.required,Validators.pattern('[a-zA-Z0-9 .]*')])],
  });

  aftermobileadd(e:any)
  {
    console.log(e);
  }
  initDropdownSettings(){
    this.dropdownsetting={
      singleSelection:true,
      idField:'isoCode',
      textField:'name',
      itemsShowLimit:5,
      allowSearchFilter:true,
      maxHeight:'100',
    };
  }

  onstatechange()
  {
    let s=this.studentform.get('state1')?.value;
    for(let i=0;i<this.statecity.length;i++)
    {
      if(s==this.statecity[i].state)
      {
        this.city=this.statecity[i].city;
      }
    }
    console.log(this.city);

  }
  getStates()
  {
    this.states=this.csc.getAllStates();
  }
  
  getDistrict(statecode:string)
  {
    this.districts=this.cscity.getCitiesOfState("IN",statecode);
  }
  handleValueChanges()
  {
    this.studentform.get('state')?.valueChanges.subscribe((response)=>{
      this.stateiso=response;
      this.getDistrict(this.stateiso[0].isoCode);  
    });
  }
  checkboxinput(e:any)
  {
    if(e.checked==true)
    {
      this.studentform.patchValue({permanentaddress:this.studentform.value.currentaddress});
    }
    if(e.checked==false)
    {
      this.studentform.patchValue({permanentaddress:''});
    }
  }

  valid(e:string)
  {
    let y:number;
    y=Number(e.substring(4,-4));
    if(y>2000)
    {
      alert("Allowed year of birth is <=2000");
    }
  }

  get form()
  {
    return this.studentform.controls;
  }
}
