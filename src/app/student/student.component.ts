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

  setting={} as IStudent;
  id:number=0;
  studentform: FormGroup = {} as FormGroup;
  
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
    this.buildform();
  }

onAddClick()
{
  this.setting = {} as IStudent; //empty settings since new form is needed
  this.buildform(); //call build form to open an empty form
}

onEditClick(setting:any,i:number) //invoked from table Edit button click
{
	this.setting = setting; //set the selected setting into the setting variable
	this.buildform(); //call build form to open form with values filled
  this.id=i;
}

buildform()
{
  if (JSON.stringify(this.setting) == '{}') {
    this.setting = {
      name:'',
      dob:'',
      email:'',
      mobile:'',
      gender:'',
      currentaddress:'',
      permanentaddress:'',
      sameaddress:false,
      state1:'',
      district1:'',
      roll:'',
      schoolname:'',
      studentmark:[],
      agree:false,
      captcha:'',
      total:'',
      percentage:'',
      grade:''  
    };
  }
  
  this.studentform = this.fb.group
  ({
    name:[this.setting.name,Validators.compose([Validators.required,Validators.pattern('[a-zA-Z .]*')])],
    dob:[this.setting.dob,Validators.required],
    email:[this.setting.email, Validators.compose([Validators.required, Validators.email])],
    mobile:[this.setting.mobile],
    gender:[this.setting.gender,Validators.required],
    currentaddress:[this.setting.currentaddress,Validators.required],
    permanentaddress:[this.setting.permanentaddress,Validators.required],
    sameaddress:[this.setting.sameaddress],
    // state:['',Validators.required],
    // district:['',Validators.required],
    state1:[this.setting.state1,Validators.required],
    district1:[this.setting.district1,Validators.required],
    roll:[this.setting.roll,Validators.compose([Validators.required,Validators.pattern('[a-zA-Z0-9 .]*')])],
    schoolname:[this.setting.schoolname,Validators.compose([Validators.required,Validators.pattern('[a-zA-Z0-9 .]*')])],
    studentmark:this.fb.array(this.buildmarkform(this.setting.studentmark),Validators.compose([Validators.required,Validators.minLength(5)])),
    total:[this.setting.total],
    percentage:[this.setting.percentage],
    grade:[this.setting.grade],
    agree:[this.setting.agree,Validators.requiredTrue],
    captcha:[this.setting.captcha,[Validators.required,Validators.pattern('[263S2V]{6}')]],
  });
}

buildmarkform(marks:any): any {
  if (!marks) {
    marks = [];
  }
  var marks_array: any[] = [];
  if (marks && marks.length > 0) {
    var section_count = 0;
    for (const mark of marks) {
      marks_array.push(this.fb.group({
        subject: [mark.subject],
        mark: [mark.mark],
      }));
      section_count++;
    }
  }
  const remaining_count = 1 - marks.length;
  if (remaining_count && remaining_count > 0) {
    for (let index = 0; index < remaining_count; index++) {
      marks_array.push(this.fb.group({
        subject: [""],
        mark: [""],
      }));
    }
  }
  return marks_array;
}

  poststudentdetails()
  {
    if (JSON.stringify(this.setting) == '{}') 
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
    }
    else{
      this.apiservice.updatestudent(this.studentform.value,this.id)
          .subscribe(
          {
            next:(res)=>{
            alert("Student data updated Successfully");
          },
          error:(err:any)=>{console.log(err);},
          complete:()=>{}
        });        
    }
    this.s=this.studentform.value;
  }

  delete(id:number){
    this.apiservice.deletestudent(id)
          .subscribe(
          {
            next:(res)=>{
            alert("One record is removed");
          },
          error:(err:any)=>{console.log(err);},
          complete:()=>{}
        });
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
    return ((this.studentform as FormGroup).controls);
  }

  get studentmarks() {
    return ((this.studentform as FormGroup).get('studentmark') as FormArray);
  }
}