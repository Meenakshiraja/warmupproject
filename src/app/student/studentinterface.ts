export interface IStudent{
    name:string;
    dob:any;
    email:string;
    mobile:number;
    gender:string;
    currentaddress:string;
    permanentaddress:string;
    sameaddress:boolean;
    state:string;
    district:string;
    roll:string;
    schoolname:string;
    studentmark:{
        subject:string;
        mark:number;
    }[];    
}