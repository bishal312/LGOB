import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Api } from '../../services/api/api';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { Auth } from '../../services/auth/auth';


@Component({
  selector: 'app-login',
  imports: [RouterLink,ReactiveFormsModule,NgClass,NgIf],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  
  toastMessage:string=''
  showToast:boolean=false

  ngOnInit(){
    this.initializeLoginObj()
  }
  auth=inject(Auth)
  api=inject(Api)
  router=inject(Router)
  
  loginObj:FormGroup= new FormGroup({})

  initializeLoginObj(){
    this.loginObj= new FormGroup({
      phoneNumber:new FormControl('',[Validators.required,Validators.pattern(/^(97|98)\d{8}$/)]),
      password:new FormControl('',[Validators.required,Validators.minLength(6)])
    })
  }

  onLogin(){
    this.toastMessage='Login in process...';
    const loginObj=this.loginObj.value
    this.showToast=true
    this.auth.login(loginObj).subscribe((res:any)=>{
      if(res.success){
        this.toastMessage= "Login successful";
        setTimeout(() =>{
          this.showToast=true
          if(res.user.role=='admin'){
          this.router.navigate(['/seller/dashboard']);
        }
        else{
          this.router.navigate(['/shop']);
        }
        }, 2000);
        
        localStorage.setItem('user',JSON.stringify(res.user))
     


      }
      

      
    },error=>{
      this.toastMessage=error.error.message;
      setTimeout(() => this.showToast = true, 2000);
    }
  )
  }
}
