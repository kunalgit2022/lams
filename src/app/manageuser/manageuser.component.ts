
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../core/api.service';
import { ConfirmedValidator } from '../core/validators.service';
import { NotificationService } from '../core/notification.service';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
declare var jQuery: any;

@Component({
  selector: 'app-manageuser',
  templateUrl: './manageuser.component.html',
  styleUrls: ['./manageuser.component.css']
})
export class ManageuserComponent implements OnInit {
  manageUser: FormGroup;
  editUserForm: FormGroup;
  roleList: any;
  DepartmentList: any;
  Createdata: any;
  AllUser: any; dtOptions: any;
  dtTrigger: Subject<any> = new Subject<any>();
  collection: any;
  useerId:any;
  constructor(private formbuilder: FormBuilder, private apiService: ApiService, private notification: NotificationService) { }

  ngOnInit(): void {
    this.dtOptions = {
      // responsive: true,
      // pagingType: 'full_numbers',
      // pageLength: 5,
      // processing: true,
      dom: 'Bfrtip',
      buttons: [
        'copy', 'excel', 'pdf', 'print'
      ]
    };

    (function ($) {

      //------- Datatable --------
      $(document).ready(function () {
        $('#manageUserDatatable').DataTable({
          dom: 'Bfrtip',
          buttons: [
            'excel', 'pdf', 'print'
          ]
        });
      });

      //---------- Tooltip ------------
      $('[data-toggle="tooltip"]').tooltip({
        trigger: 'hover',
        'placement': 'top'
      });
      $('[data-toggle="popover"]').popover({
        trigger: 'hover',
        'placement': 'top'
      });
      $('[data-toggle-second="tooltip"]').tooltip({
        trigger: 'hover',
        'placement': 'top'
      });
      $('[data-toggle-second="popover"]').popover({
        trigger: 'hover',
        'placement': 'top'
      });

      //---------- Show / Hide Password ------------
      $("#show_hide_password_4 a").on('click', function (event: any) {
        event.preventDefault();
        if ($('#show_hide_password_4 input').attr("type") == "text") {
          $('#show_hide_password_4 input').attr('type', 'password');
          $('#show_hide_password_4 i').addClass("fa-eye-slash");
          $('#show_hide_password_4 i').removeClass("fa-eye");
        } else if ($('#show_hide_password_4 input').attr("type") == "password") {
          $('#show_hide_password_4 input').attr('type', 'text');
          $('#show_hide_password_4 i').removeClass("fa-eye-slash");
          $('#show_hide_password_4 i').addClass("fa-eye");
        }
      });

      $("#show_hide_password_5 a").on('click', function (event: any) {
        event.preventDefault();
        if ($('#show_hide_password_5 input').attr("type") == "text") {
          $('#show_hide_password_5 input').attr('type', 'password');
          $('#show_hide_password_5 i').addClass("fa-eye-slash");
          $('#show_hide_password_5 i').removeClass("fa-eye");
        } else if ($('#show_hide_password_5 input').attr("type") == "password") {
          $('#show_hide_password_5 input').attr('type', 'text');
          $('#show_hide_password_5 i').removeClass("fa-eye-slash");
          $('#show_hide_password_5 i').addClass("fa-eye");
        }
      });

      $("#show_hide_password_6 a").on('click', function (event: any) {
        event.preventDefault();
        if ($('#show_hide_password_6 input').attr("type") == "text") {
          $('#show_hide_password_6 input').attr('type', 'password');
          $('#show_hide_password_6 i').addClass("fa-eye-slash");
          $('#show_hide_password_6 i').removeClass("fa-eye");
        } else if ($('#show_hide_password_6 input').attr("type") == "password") {
          $('#show_hide_password_6 input').attr('type', 'text');
          $('#show_hide_password_6 i').removeClass("fa-eye-slash");
          $('#show_hide_password_6 i').addClass("fa-eye");
        }
      });

      $("#show_hide_password_7 a").on('click', function (event: any) {
        event.preventDefault();
        if ($('#show_hide_password_7 input').attr("type") == "text") {
          $('#show_hide_password_7 input').attr('type', 'password');
          $('#show_hide_password_7 i').addClass("fa-eye-slash");
          $('#show_hide_password_7 i').removeClass("fa-eye");
        } else if ($('#show_hide_password_7 input').attr("type") == "password") {
          $('#show_hide_password_7 input').attr('type', 'text');
          $('#show_hide_password_7 i').removeClass("fa-eye-slash");
          $('#show_hide_password_7 i').addClass("fa-eye");
        }
      });

    })(jQuery)
    this.apiService.findAllroleList().subscribe(data => {
      this.roleList = data;

    }),
      this.apiService.findAlldepartment().subscribe(data => {
        this.DepartmentList = data;
      })



    this.manageUser = this.formbuilder.group({
      name: ['', Validators.compose([Validators.required, Validators.pattern("[a-zA-Z]+[a-zA-Z]")])],
      Mobile: ['', Validators.compose([Validators.required, Validators.pattern("[1-9][0-9]{9}")])],
      Email: ['', Validators.compose([Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")])],
      UID: ['', Validators.compose([Validators.required, Validators.pattern("[a-zA-Z]+[a-zA-Z0-9]")])],
      Password: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(14), Validators.pattern("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#^&-+=()])(?=\\S+$).{6,20}$")])],
      CPassword: ['', Validators.compose([Validators.required])],
      Department: ['0', Validators.compose([Validators.required,])],
      Designation: ['', Validators.compose([Validators.required, Validators.pattern("[a-zA-Z]+[a-zA-Z0-9.@#$*]{0,20}")])],
      Role: ['0', Validators.compose([Validators.required])],
    }, {
      validator: ConfirmedValidator('Password', 'CPassword')
    });

    this.editUserForm = this.formbuilder.group({
      ename: [, Validators.compose([Validators.required, Validators.pattern("[a-zA-Z]+[a-zA-Z]")])],
      eMobile: [, Validators.compose([Validators.required, Validators.pattern("[1-9][0-9]{9}")])],
      email: [, Validators.compose([Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")])],
      eUid: [, Validators.compose([Validators.required, Validators.pattern("[a-zA-Z]+[a-zA-Z0-9]")])],
      eDepartment: ['0', Validators.compose([Validators.required,])],
      eDesignation: [, Validators.compose([Validators.required, Validators.pattern("[a-zA-Z]+[a-zA-Z0-9.@#$*]{0,20}")])],
      eRole: ['0', Validators.compose([Validators.required])],
    });
    this.findUser();
  }
  findUser() {
    this.apiService.findAllUser().subscribe(data => {
      this.AllUser = data;
      jQuery("#manageUserDatatable").DataTable().destroy();
      this.dtTrigger.next(data);
    })
  }
  findId(e: any, id: any) {

  }
  createuser() {
    this.Createdata = {
      roleId: this.manageUser.value.Role,
      deptId: this.manageUser.value.Department,
      uname: this.manageUser.value.name,
      userId: this.manageUser.value.UID,
      password: this.manageUser.value.Password,
      mobile: this.manageUser.value.Mobile,
      email: this.manageUser.value.Email.toLowerCase(),
      desg: this.manageUser.value.Designation,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    this.apiService.createuser(this.Createdata).subscribe(data => {

      if (data["message"] = "User Register Successfully") {
        this.notification.showSuccess("your user is added Sucessfully");
        this.findUser();
      }
      else {
        this.notification.showError(" User is not added");
        this.findUser();
      }
    })
  }
  editUser(id: any) {
    this.useerId=id;
    this.apiService.editUserj(id).subscribe(data => {

      this.editUserForm = this.formbuilder.group({
        ename: [data[0].uname, Validators.compose([Validators.required, Validators.pattern("[a-zA-Z]+[a-zA-Z]")])],
        eMobile: [data[0].mobile, Validators.compose([Validators.required, Validators.pattern("[1-9][0-9]{9}")])],
        email: [data[0].email, Validators.compose([Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")])],
        eUid: [data[0].userId, Validators.compose([Validators.required, Validators.pattern("[a-zA-Z]+[a-zA-Z]")])],
        eDepartment: [data[0].deptId, Validators.compose([Validators.required,])],
        eDesignation: [data[0].desg, Validators.compose([Validators.required, Validators.pattern("[a-zA-Z]+[a-zA-Z0-9.@#$*]{0,20}")])],
        eRole: [data[0].roleId, Validators.compose([Validators.required])],
      });
    });
  }
  deletUser(id: any) {
    this.apiService.deletUser(id).subscribe(data => {
      if (data['deleted'] = 'true') {
        this.notification.showSuccess("Selected User is deleted");
        this.findUser();
      } else {
        this.notification.showError("selected user is not deleted");
        this.findUser();
      }
    })
  }

  UpdateUser() {
    var updateUserData = {
      roleId: this.editUserForm.value.eRole,
      deptId: this.editUserForm.value.eDepartment,
      uname: this.editUserForm.value.ename,
      userId: this.editUserForm.value.eUid,
      mobile: this.editUserForm.value.eMobile,
      email: this.editUserForm.value.email,
      desg: this.editUserForm.value.eDesignation,
      updatedAt: new Date()
    }
    console.log(updateUserData);
    
    this.apiService.updateUser(this.useerId,updateUserData).subscribe(data => {
      if(data!=null){
        this.notification.showSuccess("User is updated Sucessfully");
        this.findUser();
      }else{
        this.notification.showError("user is not updated");
        this.findUser();
      }
    })
  }
}
