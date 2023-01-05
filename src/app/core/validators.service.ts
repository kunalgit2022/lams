import { AbstractControl,ValidationErrors  } from "@angular/forms";
import { FormGroup } from '@angular/forms';

export class PWChangeValidators {
  ////// Our cross control validators are below
  ////// NOTE: They take in type FormGroup rather than FormControl
  // static newIsNotOld(control: AbstractControl){
  //     var newPW =control.get('newpass');
  //     if(control.get('oldpass').value == newPW.value)
  //         newPW.setErrors({ newIsNotOld: true });
  //     return null;
  // }
  static newMatchesConfirm(control: AbstractControl) {
       if(control && control.value !==null || control.value !==undefined){
        const newPwdcontrol=control.root.get('newpass');
          const confirmPwd=control.value;
          if(newPwdcontrol){
            const passvalue=newPwdcontrol.value;
            if(passvalue !==confirmPwd){
              return{
                pwdsDontMatch: true
              };
            }
          }
       }
       return null;
  }
 }
  export function ConfirmedValidator(controlName: string, matchingControlName: string){
      return (formGroup: FormGroup) => {
          const control = formGroup.controls[controlName];
          const matchingControl = formGroup.controls[matchingControlName];
          if (matchingControl.errors && !matchingControl.errors["confirmedValidator"]) {
              return;
          }
          if (control.value !== matchingControl.value) {
              matchingControl.setErrors({ confirmedValidator: true });
          } else {
              matchingControl.setErrors(null);
          }
      }
  }
  export function PWDExistsValidator(controlName: string, matchingControlName: string){
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];
        if (matchingControl.errors && !matchingControl.errors["pWDExistsValidator"]) {
            return;
        }
        if (control.value == matchingControl.value) {
            matchingControl.setErrors({ pWDExistsValidator: true });
        } else {
            matchingControl.setErrors(null);
        }
    }
  }



