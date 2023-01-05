import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { ApiService } from '../core/api.service';
import { NotificationService } from '../core/notification.service';
declare var jQuery: any;

@Component({
  selector: 'app-managerole',
  templateUrl: './managerole.component.html',
  styleUrls: ['./managerole.component.css']
})
export class ManageroleComponent implements OnInit {
  allPermissionLink: any;
  allPermission = new Array();
  role_name: any;
  Addrole: any;
  disableCreat = true;
  rollList: any;
  dtOptions: any;
  dtTrigger: Subject<any> = new Subject<any>();
  element: any;
  permissionRole: any;
  editroleform: any;
  AssignedPermission: any;
  updatedData = new Array();
  roleId: any;
  constructor(private apiservice: ApiService, private fromBuilder: FormBuilder, private notifyService: NotificationService,) { }

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
      // $(document).ready(function () {
      //   $('#manageRoleDatatable').DataTable({
      //     dom: 'Bfrtip',
      //     buttons: [
      //       'excel', 'pdf', 'print'
      //     ]
      //   });
      // });

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

    })(jQuery);

    this.Addrole = this.fromBuilder.group({
      roleName: new FormControl('', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(20), Validators.pattern("^[a-zA-Z]+[_a-zA-Z.-]{1,20}$")])),
      permission: new FormControl('',)
    });

    this.editroleform = this.fromBuilder.group({
      editrole: new FormControl('', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(20), Validators.pattern("^[a-zA-Z]+[_a-zA-Z.-]{1,20}$")])),
    });

    this.apiservice.rolePermissionList().subscribe(data => {
      if (data) {
        this.allPermissionLink = data;
      }
    });
    this.getData();
    
  }


  getData() {
    this.apiservice.findAllroleList().subscribe(data => {
      this.rollList = data;

      jQuery("#manageRoleDatatable").DataTable().destroy();
      this.dtTrigger.next(data);
    })
  }
  findpermission(e: any, id: any) {
    if (e.target.checked == true) {
      this.disableCreat = false;
      this.allPermission.push(id);
      console.log(this.allPermission);
    }
    else {
      if (e.target.checked != true) {
        for (let i = 0; i < this.allPermission.length; i++) {
          if (this.allPermission[i] == id) {
            this.allPermission.splice(i, 1);
          }
        }
      }
      console.log(this.allPermission);
    }
  }
  AddRole() {
    if (this.Addrole.value.roleName != null && this.Addrole.value.roleName != '' && this.Addrole.value.roleName != 0) {
      var roleName = {
        roleName: this.Addrole.value.roleName
      }
      if (confirm(`Are you sure want to Add "${this.Addrole.value.roleName} "?`)) {
        this.apiservice.AddRoleManageMent(roleName).subscribe(data => {
          if (data != null) {
            let cnt = 0;
            for (let i = 0; i < this.allPermission.length; i++) {
              cnt += 1;
              var reqData = {
                roleid: data.id,
                pid: this.allPermission[i]
              };

              this.apiservice.AddRolepermission(reqData).subscribe(data => {
                console.log("----<", data);
                if (cnt == (i + 1)) {
                  this.allPermission = [];
                  this.Addrole.reset();
                  jQuery('#modalCreateRole').modal("hide");
                  this.getData();
                }
              })
            }

          }
          this.notifyService.showSuccess("role created sucessfuly");
        })
      }
    }

  }

  showAllPermission(id: any) {
    this.apiservice.GetAllPermissionList(id).subscribe(data => {
      this.permissionRole = data;

    })
  }

  deletRole(id: any) {
    if (confirm(`Are you sure want to delete "${this.Addrole.value.roleName}"`)) {
      this.apiservice.deleteRole(id).subscribe(data => {
        if (data["deleted"] = true) {
          this.notifyService.showSuccess("Your role is deleted");
          this.getData();
        }
        else {
          this.notifyService.showError("your role is not deleted");
        }
      })
    }



  }
  editRolePermission(item: any, id: any) {
    this.roleId = id;
    this.apiservice.GetAllPermissionList(id).subscribe(data => {
      console.log(data);
      this.AssignedPermission = data;
      this.bindData();
    });
    this.editroleform = this.fromBuilder.group({
      editrole: new FormControl(item.roleName, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(20), Validators.pattern("^[a-zA-Z]+[_a-zA-Z.-]{1,20}$")])),
    });
  }
  bindData() {
    this.updatedData = [];
    for (let i = 0; i < this.allPermissionLink.length; i++) {
      jQuery('#editCheckbox' + this.allPermissionLink[i].id).prop('checked', false);
    }
    for (let i = 0; i < this.AssignedPermission.length; i++) {
      this.updatedData.push(Number(this.AssignedPermission[i].permissionid));
      jQuery('#editCheckbox' + this.AssignedPermission[i].permissionid).prop('checked', true);
    }
  }
  getUpdatedPermission(e: any, id: any) {
    if (e.target.checked == true) {
      this.updatedData.push(id);
      console.log(this.updatedData);
    }
    else {
      if (e.target.checked != true) {
        for (let i = 0; i < this.updatedData.length; i++) {
          if (this.updatedData[i] == id) {
            this.updatedData.splice(i, 1);
          }
        }
      }
      console.log(this.updatedData);
    }
  }
  updateRoleForm() {
    if (confirm(`Are you sure want to Update "${this.editroleform.value.editrole}"?`)) {
      this.apiservice.removePermission(this.roleId).subscribe(data => {
        if (data != null) {
          let cnt = 0;
          for (let i = 0; i < this.updatedData.length; i++) {
            cnt += 1;
            var reqData = {
              roleid: this.roleId,
              pid: this.updatedData[i]
            };
            this.apiservice.AddRolepermission(reqData).subscribe(data => {
              console.log("----<", data);
              if (cnt == (i + 1)) {
                this.allPermission = [];
                this.Addrole.reset();
                jQuery('#modalEditRole').modal("hide");
                this.getData();
              }
            })
          }
          this.notifyService.showSuccess("your role is updated Sucessfully")
        }
      })
    }

  }
}
