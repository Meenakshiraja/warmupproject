import { Component, OnInit } from '@angular/core';
import { FormBuilder,Validators,FormArray,FormGroup } from '@angular/forms';
import { IState, ICity } from 'country-state-city';
import { IStudent } from './studentinterface';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {

  studentmodel={} as IStudent;

  dropdownsetting:any;
  states:IState[]=[];
  districts:ICity[]=[];
  stateiso:any=[];
  csc = require('country-state-city').State;
  cscity = require('country-state-city').City;
  genders=['Male','Female','Other'];
  // statecity=[
  //   {state:"TamilNadu",city:["Chennai","Sivakasi","Virudhunagar","Madurai","Salem"]},
  //   {state:"Andhra Pradesh",city:["Vijayawada","Visakhapatnam","Tirupati","Nellore"]},
  //   {state:"Kerala",city:["Thiruvananthapuram","Kozhikode","Kochi"]}
  // ];
  // city:string[]=[];

  constructor(private fb:FormBuilder,private apiservice:ApiService) { }

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
    // state1:['',Validators.required],
    // district1:['',Validators.required],
    roll:['',Validators.compose([Validators.required,Validators.pattern('[a-zA-Z0-9 .]*')])],
    schoolname:['',Validators.compose([Validators.required,Validators.pattern('[a-zA-Z0-9 .]*')])],
    studentmark:this.fb.array([],Validators.compose([Validators.required,Validators.minLength(5)])),
    agree:[false,Validators.requiredTrue],
    captcha:['',[Validators.required,Validators.pattern('[263S2V]{6}')]],
  });

  poststudentdetails()
  {
    this.studentmodel.name=String(this.studentform.value.name);
    this.studentmodel.dob=this.studentform.value.dob;
    this.studentmodel.email=String(this.studentform.value.email);
    this.studentmodel.mobile=Number(this.studentform.value.mobile);
    this.studentmodel.gender=String(this.studentform.value.gender);
    this.studentmodel.currentaddress=String(this.studentform.value.currentaddress);
    this.studentmodel.permanentaddress=String(this.studentform.value.permanentaddress);
    this.studentmodel.sameaddress=Boolean(this.studentform.value.sameaddress);
    this.studentmodel.state=String(this.studentform.value.state);
    this.studentmodel.district=String(this.studentform.value.district);
    this.studentmodel.roll=String(this.studentform.value.roll);
    this.studentmodel.schoolname=String(this.studentform.value.schoolname);

    // this.studentmodel.studentmark[]=this.studentform.value.studentmark;

    this.apiservice.poststudent(this.studentmodel).subscribe(res=>{
      console.log(res);
      alert("Student added Successfully")
    });
  }

  addmark()
  {
    ((this.studentform as FormGroup).get('studentmark') as FormArray).push(this.fb.group({
      subject:['',Validators.compose([Validators.required,Validators.pattern('[a-zA-Z0-9 .]*')])],
      mark:['',Validators.compose([Validators.required,Validators.max(100)])]
  }));
  }

  deletemark(i:number)
  {
    const consent = confirm("Are you sure, want to delete this mark?");
    if (!consent) return;
    ((this.studentform as FormGroup).get('studentmark') as FormArray).removeAt(i);
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

  // onstatechange()
  // {
  //   let s=this.studentform.get('state1')?.value;
  //   for(let i=0;i<this.statecity.length;i++)
  //   {
  //     if(s==this.statecity[i].state)
  //     {
  //       this.city=this.statecity[i].city;
  //     }
  //   }
  // }
  submitformdata()
  {
    console.log(this.studentform.value);
    console.log(this.studentform.valid);
    console.log(this.studentform);
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

  get studentmarks() {
    return ((this.studentform as FormGroup).get('studentmark') as FormArray);
  }
}
