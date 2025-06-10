import { CanActivateFn } from '@angular/router';

export const sellerGuard: CanActivateFn = (route, state) => {
  const user = localStorage.getItem('user');

  if (!user) {
    alert('Please login first');
    return false;
  }

  const userData = JSON.parse(user);

  if (userData.role === 'admin') {
    return true;
  } else {
    alert('You are not authorized to access this page');
    return false;
  }
};
