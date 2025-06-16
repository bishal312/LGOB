import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const userData=localStorage.getItem('user')
  const router=inject(Router)
  if(!userData){
    alert("Please login first ")
    router.navigate(['/login'])

    return false
  }
  const user=JSON.parse(userData)
   if(user.role==='admin'){
    alert('Why you want to purchase from your own store?')
    return false
  }
 return user.role === "customer";
};
