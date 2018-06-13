import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidateService {

  constructor() { }

  validateRegister(user) {
    if (user.username == undefined || user.email == undefined || user.password == undefined) {
      return false;
    }
    else {
      return true;
    }
  }

  validateEmail(email) {
    const re = /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm;
    return re.test(email);
  }
  
}
