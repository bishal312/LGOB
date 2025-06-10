import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const userData=localStorage.getItem('user')
  if(!userData){
    alert("Please login first ")
    return false
  }
  const user=JSON.parse(userData)
   if(user.role==='admin'){
    alert('Why you want to purchase from your own store?')
    return false
  }
  else if(user.role==='customer'){
    return true
  }
  else{
    return false
  }
};
