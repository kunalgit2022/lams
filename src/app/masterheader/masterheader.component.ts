import { Component, OnInit } from '@angular/core';
declare var jQuery: any;

@Component({
  selector: 'app-masterheader',
  templateUrl: './masterheader.component.html',
  styleUrls: ['./masterheader.component.css']
})
export class MasterheaderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    (function ($) {

      $('.header-expand').click(function () {
        $("span i").toggleClass("mdi mdi-chevron-triple-right mdi mdi-chevron-triple-left");
      });

      //---------- Show / Hide Password ------------
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

      $("#show_hide_password_2 a").on('click', function (event: any) {
        event.preventDefault();
        if ($('#show_hide_password_2 input').attr("type") == "text") {
          $('#show_hide_password_2 input').attr('type', 'password');
          $('#show_hide_password_2 i').addClass("fa-eye-slash");
          $('#show_hide_password_2 i').removeClass("fa-eye");
        } else if ($('#show_hide_password_2 input').attr("type") == "password") {
          $('#show_hide_password_2 input').attr('type', 'text');
          $('#show_hide_password_2 i').removeClass("fa-eye-slash");
          $('#show_hide_password_2 i').addClass("fa-eye");
        }
      });

      $("#show_hide_password_3 a").on('click', function (event: any) {
        event.preventDefault();
        if ($('#show_hide_password_3 input').attr("type") == "text") {
          $('#show_hide_password_3 input').attr('type', 'password');
          $('#show_hide_password_3 i').addClass("fa-eye-slash");
          $('#show_hide_password_3 i').removeClass("fa-eye");
        } else if ($('#show_hide_password_3 input').attr("type") == "password") {
          $('#show_hide_password_3 input').attr('type', 'text');
          $('#show_hide_password_3 i').removeClass("fa-eye-slash");
          $('#show_hide_password_3 i').addClass("fa-eye");
        }
      });
      
    })(jQuery)
  }

}
