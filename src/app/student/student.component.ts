import { Component, OnInit } from '@angular/core';
import { FormBuilder,Validators,FormArray,FormGroup } from '@angular/forms';
// import { IState, ICity } from 'country-state-city';
import { IStudent } from './studentinterface';
import { ApiService } from '../api.service';
import { jsPDF } from "jspdf";
import html2canvas  from 'html2canvas';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {

  studentmodel={} as IStudent;

  // studentform: FormGroup = {} as FormGroup;
  
  percentage:number=0;
  studentinfo:any;
  s:any={};
  
  dropdownsetting:any;
  // states:IState[]=[];
  // districts:ICity[]=[];
  // stateiso:any=[];
  // csc = require('country-state-city').State;
  // cscity = require('country-state-city').City;
  genders=['Male','Female','Other'];
  statecity=[
    {state:"TamilNadu",city:["Coimbatore","Virudhunagar","Madurai","Dindigul","Chennai","Theni"]},
    {state:"Andhra Pradesh",city:["Srikakulam","Visakhapatnam","Tirupati","Chittoor"]},
    {state:"Kerala",city:["Thiruvananthapuram","kollam","Kochi","Palakkad","Alappuzha"]}
  ];
  city:string[]=[];

  constructor(private fb:FormBuilder,private apiservice:ApiService) {
    this.apiservice.getstudent()
    .subscribe(
      {        
        next:(res)=>{
          this.studentinfo=res;
        },
        error:(err:any)=>{console.log(err);},
        complete:()=>{}
      });
   }

  ngOnInit(): void {
    // this.initDropdownSettings();
    // this.getStates();
    // this.handleValueChanges();
  }

  studentform = this.fb.group
  ({
    name:['',Validators.compose([Validators.required,Validators.pattern('[a-zA-Z .]*')])],
    dob:['',Validators.required],
    email:['', Validators.compose([Validators.required, Validators.email])],
    mobile:[],
    gender:['',Validators.required],
    currentaddress:['',Validators.required],
    permanentaddress:['',Validators.required],
    sameaddress:[false],
    // state:['',Validators.required],
    // district:['',Validators.required],
    state1:['',Validators.required],
    district1:['',Validators.required],
    roll:['',Validators.compose([Validators.required,Validators.pattern('[a-zA-Z0-9 .]*')])],
    schoolname:['',Validators.compose([Validators.required,Validators.pattern('[a-zA-Z0-9 .]*')])],
    studentmark:this.fb.array([],Validators.compose([Validators.required,Validators.minLength(5)])),
    total:[0],
    percentage:[0],
    grade:[''],
    agree:[false,Validators.requiredTrue],
    captcha:['',[Validators.required,Validators.pattern('[263S2V]{6}')]],
  });

  poststudentdetails()
  {
    this.apiservice.poststudent(this.studentform.value)
    .subscribe(
      {
        next:(res)=>{
          alert("Student added Successfully");
        },
        error:(err:any)=>{console.log(err);},
        complete:()=>{}
    });        
    this.s=this.studentform.value;
  }

  updatestudent(id:number){

  }

  delete(id:number){

  }

  generatepdf()
  {
    var element=document.getElementById('print-section');

    html2canvas(element!).then((canvas)=>{
      console.log(canvas);
    
      var imgdata=canvas.toDataURL('image/png')
      var doc = new jsPDF('p','mm','a4');
      var width=doc.internal.pageSize.getWidth();
      var height=canvas.height * width / canvas.width;
      doc.addImage(imgdata,'PNG',0,0,width,height);
      doc.save('info.pdf');
    });
  }
  addmark()
  {
    ((this.studentform as FormGroup).get('studentmark') as FormArray).push(this.fb.group({
      subject:['',[Validators.required,Validators.pattern('[a-zA-Z0-9 .]*')]],
      mark:['',[Validators.required,Validators.max(100)]]
    }));
  }
  calc()
  {
    let total=0;
    let grade='-';
    for(let j=0;j<this.studentmarks.length;j++)
    {
      total+=Number(this.studentmarks.value[j].mark);
    }
    
    this.studentform.controls['total'].setValue(total);

    this.percentage=total/((this.studentmarks.length)*100)*100;
    // percentage | number:'1.0-0';
    this.studentform.controls['percentage'].setValue(this.percentage);
    //this.studentform.patchValue({percentage:String(percentage)});
    if((this.percentage<=100)&&(this.percentage>90))
      grade='A';
    if((this.percentage<=90)&&(this.percentage>80))
      grade='B';
    if((this.percentage<=80)&&(this.percentage>60))
      grade='C';
    if((this.percentage<=60)&&(this.percentage>=40))
      grade='D';
    if(this.percentage<40)
      grade='E';
    this.studentform.controls['grade'].setValue(grade);
    //this.studentform.patchValue({grade:grade});
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

  onstatechange()
  {
    let s=this.studentform.get('state1')?.value;
    var city1=this.statecity.filter(a=>a.state==s);
    this.city=city1[0].city;
  }

  // getStates()
  // {
  //   this.states=this.csc.getAllStates();
  // }
  
  // getDistrict(statecode:string)
  // {
  //   this.districts=this.cscity.getCitiesOfState("IN",statecode);
  // }
  // handleValueChanges()
  // {
  //   this.studentform.get('state')?.valueChanges.subscribe((response)=>{
  //     this.stateiso=response;
  //     this.getDistrict(this.stateiso[0].isoCode);  
  //   });
  // }

  after_mobileno_set(e:any){
    console.log(e);
    this.studentform.controls["mobile"].setValue(e);
  }

  checkboxinput(e:any)
  {
    if(e.checked==true)
    {
      this.studentform.controls["permanentaddress"].setValue(this.studentform.value.currentaddress!);
      //this.studentform.patchValue({permanentaddress:this.studentform.value.currentaddress});
    }
    if(e.checked==false)
    {
      this.studentform.controls["permanentaddress"].setValue('');
    }
  }

  valid(e:string)
  {
    let y:number;
    y=Number(e.substring(4,-4));
    if(y>2000)
    {
      alert("Allowed year of birth is <=2000");
      this.studentform.controls['dob'].setValue('');
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
