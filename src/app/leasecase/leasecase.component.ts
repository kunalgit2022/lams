import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { data } from 'jquery';
import { Subject } from 'rxjs';
import { ApiService } from '../core/api.service';
import { NotificationService } from '../core/notification.service';
declare var jQuery: any;

@Component({
  selector: 'app-leasecase',
  templateUrl: './leasecase.component.html',
  styleUrls: ['./leasecase.component.css']
})
export class LeasecaseComponent implements OnInit {
  getVillageData: any;
  getLandClassData: any;
  landClassData: any;
  fetchLandData: any;
  phaseData: any;
  dtOptions: any;
  dtTrigger: Subject<any> = new Subject<any>();
  primaryCheckData = new Array();
  allCheckedData = new Array();
  leaseCaseNo: any;
  fileName: any;
  assignLeaseCase: any;
  selectedVillId: any = '';
  selectedVillName: any = '';
  updateLeaseCaseNo: any;
  removeFile: any;
  checkBoxChecked = true;

  // @ViewChild('startDate') startDate: ElementRef;

  constructor(private _apiService: ApiService, private _notify: NotificationService) { }

  ngOnInit(): void {
    this.selectedVillName = '0';
    this.landClassData = '0';

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
        $('#leaseCaseDatatable').DataTable({
          dom: 'Bfrtip',
          buttons: [
            'excel', 'pdf', 'print'
          ]
        });
      });

      //------- Datepicker -------
      $("#datepicker").datepicker({
        autoclose: true,
        todayHighlight: true,
        format: 'dd/mm/yyyy'
      }).datepicker('update', new Date());

      //If check_all checked then check all table rows
      $("#check_all").on("click", function () {
        if ($("input:checkbox").prop("checked")) {
          $("input:checkbox[name='row-check']").prop("checked", true);
        } else {
          $("input:checkbox[name='row-check']").prop("checked", false);
        }
      });

      // Check each table row checkbox
      $("input:checkbox[name='row-check']").on("change", function () {
        var total_check_boxes = $("input:checkbox[name='row-check']").length;
        var total_checked_boxes = $("input:checkbox[name='row-check']:checked").length;

        // If all checked manually then check check_all checkbox
        if (total_check_boxes === total_checked_boxes) {
          $("#check_all").prop("checked", true);
        }
        else {
          $("#check_all").prop("checked", false);
        }
      });

    })(jQuery);

    this.assignLeaseCase = new FormGroup({
      leaseCaseNo: new FormControl('', Validators.required),
      datee: new FormControl('', Validators.required),
      file: new FormControl('', Validators.required)
    });
  }

  onPhaseSelectAll(e: any) {
    this.phaseData = e.target.value;
    if (e.target.value != 'Phase 2') {
      this._apiService.GetPhaseWiseVillage(e.target.value).subscribe(data => {
        this.getVillageData = data;
      });

      this._apiService.getLandClass().subscribe(data => {
        this.getLandClassData = data;
      })
    } else {
      this._notify.showWarning("Phase 2 Data is not Available.");
      this.getVillageData = [];
      this.getLandClassData = [];
    }
  }

  stringify(val: any) {
    return JSON.stringify(val);
  }

  onVillageSelect(data: any) {
    data = JSON.parse(data);
    this.selectedVillId = data.id;
    this.selectedVillName = data.village;
  }

  searchData() {
    if (this.phaseData != 'Phase 2') {
      this.checkBoxChecked = true;
      if (this.phaseData != undefined) {
        if (this.selectedVillName != 0) {
          if (this.landClassData != 0) {
            this._apiService.fetchLandDetails(this.phaseData, this.selectedVillName, this.landClassData).subscribe(data => {
              if (data.length != 0) {
                this.fetchLandData = data;
                console.log('Fetch Details Data >>', this.fetchLandData);
                jQuery("#leaseCaseDatatable").DataTable().destroy();
                this.dtTrigger.next(this.fetchLandData);
              }
            })
          } else {
            this._notify.showWarning("Please Select Land Class");
          }
        } else {
          this._notify.showWarning("Please Select Village");
        }
      } else {
        this._notify.showWarning("Please Select Phase");
      }
    }
  }

  allCheck(event: any) {
    if (event.target.checked == true) {
      this.checkBoxChecked = false;
      for (let i = 0; i < this.fetchLandData.length; i++) {
        for (let j = 0; j < this.primaryCheckData.length; j++) {
          if (this.primaryCheckData[j] == this.fetchLandData[i].gid) {
            this.primaryCheckData.splice(j, 1);
          }
        }
        this.primaryCheckData.push(this.fetchLandData[i].gid);
      }
    } else {
      this.primaryCheckData = [];
    }
    console.log("All Checked Data >>", this.primaryCheckData);
    if (this.primaryCheckData.length == 0) {
      this.checkBoxChecked = true;
    }
  }

  primaryCheck(e: any) {
    if (e.target.checked == true) {
      this.primaryCheckData.push(parseInt(e.target.value));
      this.checkBoxChecked = false;
      console.log(this.primaryCheckData);
      // if (this.primaryCheckData.length == this.fetchLandData.length) {
      //   $(".check_all").prop('checked', true);
      // } else {
      //   $(".check_all").prop('checked', false);
      // }
    }
    else {
      for (let i = 0; i < this.primaryCheckData.length; i++) {
        if (e.target.value == this.primaryCheckData[i]) {
          this.primaryCheckData.splice(i, 1);
          console.log(this.primaryCheckData);
        }
      }
      // if (this.primaryCheckData.length == this.fetchLandData.length) {
      //   $(".check_all").prop('checked', true);
      // } else {
      //   $(".check_all").prop('checked', false);
      // }

      if (this.primaryCheckData.length == 0) {
        this.checkBoxChecked = true;
      }
    }
  }

  onFileSelect(event: any) {
    this.removeFile = event;
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.assignLeaseCase.get('file').setValue(file);
    }
  }

  assignLeaseCaseNo() {
    // var sDate = this.startDate.nativeElement.value;
    // let dateExtract = sDate.split('/');
    // var day = dateExtract[0];
    // var month = dateExtract[1];
    // var year = dateExtract[2];
    // var fullDate = year + '-' + month + '-' + day;

    var formData = new FormData();
    formData.append("file", this.assignLeaseCase.get('file').value);
    this._apiService.uploadDocumentAndGetFileNameResponse(this.selectedVillName, this.landClassData, formData).subscribe(data => {
      this.fileName = data.filename;

      if (this.fileName != (undefined || null)) {
        var lcVillageData = {
          vilCode: this.selectedVillId,
          landClass: this.landClassData,
          leaseCaseno: this.assignLeaseCase.value.leaseCaseNo,
          startDate: this.assignLeaseCase.value.datee,
          docRef: this.fileName
        };

        this._apiService.createLeaseCaseForVillageAndLandclass(lcVillageData).subscribe(data => {
          this.updateLeaseCaseNo = {
            leaseCase: this.assignLeaseCase.value.leaseCaseNo
          }
          if (data != null) {
            for (let j = 0; j < this.primaryCheckData.length; j++) {
              this._apiService.updatePlotWiseLeaseCaseCheckedPlots(this.phaseData, this.primaryCheckData[j], this.updateLeaseCaseNo).subscribe(data => {
                this.searchData();
              });
            }
            this.assignLeaseCase.get('file').setValue('');
            this.removeFile.target.value = null;
            this.assignLeaseCase.reset();
            this.primaryCheckData = [];

            jQuery('#modalAssignLease').modal('hide');
            this._notify.showSuccess("Assigned Lease Case Successfully");
          }
        });
      }
    })
  }
}
