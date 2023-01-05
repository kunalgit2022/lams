import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import { ApiService } from '../core/api.service';

declare var jQuery: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public loader: boolean = false;
  loginForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, private _apiService: ApiService, private router: Router) { }

  ngOnInit(): void {
    (function ($) {

      $("#show_hide_password a").on('click', function (event: any) {
        event.preventDefault();
        if ($('#show_hide_password input').attr("type") == "text") {
          $('#show_hide_password input').attr('type', 'password');
          $('#show_hide_password i').addClass("fa-eye-slash");
          $('#show_hide_password i').removeClass("fa-eye");
        } else if ($('#show_hide_password input').attr("type") == "password") {
          $('#show_hide_password input').attr('type', 'text');
          $('#show_hide_password i').removeClass("fa-eye-slash");
          $('#show_hide_password i').addClass("fa-eye");
        }
      });

    })(jQuery)

    this.loginForm = this.formBuilder.group({
      userName: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])]
    });
  }

  login() {
    let reqData = {
      userId: this.loginForm.value.userName,
      password: this.loginForm.value.password
    };

    
    console.log(reqData);

    this._apiService.login(reqData).subscribe(data => {
      if (data != null) {
        console.log(data);
        sessionStorage.setItem("token", data.jwt);
        this.router.navigate(['/dashboard']);
      }
    })
  }

}
