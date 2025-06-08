import { Component, inject, OnInit } from '@angular/core';
import { Auth } from '../../services/auth/auth';
import {  SellerLogin } from '../../models/model';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Api } from '../../services/api/api';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule,NgIf,NgClass,RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup implements OnInit {

  //api service inject
  api=inject(Api)

  router=inject(Router)


  auth=inject(Auth)

  sellerAlreadyRegistered:boolean=false

  //form creating
  userSignupObj:FormGroup= new FormGroup({})

  //initializing userSignupObj
  initializeUserSignupObj(){
    this.userSignupObj= new FormGroup({
      fullName:new FormControl('',[Validators.required,Validators.pattern(/^[A-Z][a-z]+( [A-Z][a-z]+)*$/)]),
      phoneNumber:new FormControl('',[Validators.required,Validators.pattern(/^(97|98)\d{8}$/)]),
      password:new FormControl('',[Validators.required,Validators.minLength(6),Validators.pattern(/^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{6,}$/)
])

    })
  }

    
  adminObj:SellerLogin={
    fullName:"Roshan",
    phoneNumber:"9876543210",
    password:"roshan1212",
    role:"admin"
  }
  ngOnInit(): void {
      this.auth.checkSellerCount(this.adminObj).subscribe((res)=>{
      if(res == "Only one admin allowed"){
            console.log("admin is registered")
      }
    },error =>{
      if(error.error?.message == "Only one admin allowed"){
        this.sellerAlreadyRegistered=true
      }
    })

    this.initializeUserSignupObj()


  }
  
  userSignUp(){
    const userSignUpObj=this.userSignupObj.value
    console.log(userSignUpObj)
    this.api.userSignup(userSignUpObj).subscribe((res)=>{
      console.log(res)
      if(res){
        alert("user registered successfully");
        this.router.navigate(['/login'])
      }
    })
    
  }


  sellerSignUp(){
    console.log("seller sign up")
  }

  

}
