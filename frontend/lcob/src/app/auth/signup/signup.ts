import { Component, inject, OnInit } from '@angular/core';
import { Auth } from '../../services/auth/auth';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Api } from '../../services/api/api';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, NgIf, NgClass, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup implements OnInit {
  //api service inject
  api = inject(Api);

  router = inject(Router);

  auth = inject(Auth);

  toastMessage: string = 'Signing Up ...';
  showToast: boolean = false;
  sellerAlreadyRegistered: boolean = false;

  //form creating
  userSignupObj: FormGroup = new FormGroup({});

  //initializing userSignupObj
  initializeUserSignupObj() {
    this.userSignupObj = new FormGroup({
      fullName: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z]+( [a-zA-Z]+)*$/),
      ]),
      phoneNumber: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(97|98)\d{8}$/),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(
          /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{6,}$/
        ),
      ]),
      whatsapp_consent: new FormControl(false, [Validators.requiredTrue]),
      role: new FormControl('customer'),
    });
  }

  ngOnInit(): void {
    this.auth.getAdmin().subscribe(
      (res) => {
        if (res.adminExists) {
          this.sellerAlreadyRegistered = true;
        } else {
          this.sellerAlreadyRegistered = false;
        }
      },
      (error) => {
        console.log(error);
      }
    );

    this.initializeUserSignupObj();
  }

  userSignUp() {
    const userSignUpObj = this.userSignupObj.value;
    const role = userSignUpObj.role;

    // Show the toast while signing up
    this.toastMessage = 'Signing Up...';
    this.showToast = true; // true means it shows toast

    if (role === 'customer') {
      this.api.userSignup(userSignUpObj).subscribe({
        next: (res) => {
          this.toastMessage = 'Customer registered successfully!';
          setTimeout(() => {
            this.showToast = true; // hide toast after 2 seconds
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (err) => {
          this.toastMessage = err.error.message;
          setTimeout(() => (this.showToast = true), 2000);
        },
      });
    } else if (role === 'admin') {
      this.api.adminSignup(userSignUpObj).subscribe({
        next: (res) => {
          this.toastMessage = 'Admin registered successfully!';
          setTimeout(() => {
            this.showToast = true;
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (err) => {
          console.log(err);
          this.toastMessage = err.error.message;
          setTimeout(() => (this.showToast = true), 2000);
        },
      });
    }
  }
}
