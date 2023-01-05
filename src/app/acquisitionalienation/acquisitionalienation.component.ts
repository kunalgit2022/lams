import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { ApiService } from '../core/api.service';
import { NotificationService } from '../core/notification.service';
declare var jQuery: any;

@Component({
  selector: 'app-acquisitionalienation',
  templateUrl: './acquisitionalienation.component.html',
  styleUrls: ['./acquisitionalienation.component.css']
})
export class AcquisitionalienationComponent implements OnInit {
  phaseData: any;
  getVillageData: any;
  getLandClassData: any;
  selectedVillId: any;
  selectedVillName: any;
  landClassData: any
  leaseCaseNoData: any;
  leasecaseNo: any;
  fetchPlotDetails: any;
  dtOptions: any;
  dtTrigger: Subject<any> = new Subject<any>();
  primaryCheckData = new Array();
  stageData: any;
  stageUpdate: any;
  fileName: any;
  selectStageCode: any;
  selectStagePhase: any;
  stageDescription: any;
  removeFile: any;
  checkBoxChecked = false;

  constructor(private _apiService: ApiService, private _notify: NotificationService) { }

  ngOnInit(): void {
    this.leasecaseNo = 0;
    this.dtOptions = {
      pagingType: 'full_numbers',
      dom: 'Bfrtip',
      buttons: [
        'copy', 'excel', 'pdf', 'print'
      ]
    };

    (function ($) {

      //------- Datatable --------
      $(document).ready(function () {
        $('#acquisitionDatatable').DataTable({
          dom: 'Bfrtip',
          buttons: [
            'excel', 'pdf', 'print'
          ]
        });
      });

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

    this.stageUpdate = new FormGroup({
      stage: new FormControl('0', Validators.required),
      remark: new FormControl('', Validators.required),
      file: new FormControl('', Validators.required)
    });

  }

  onPhaseSelectAll(e: any) {
    this.phaseData = e.target.value;
    // console.log(this.phaseData);
    if (this.phaseData != 'Phase 2') {
      this._apiService.GetPhaseWiseVillage(this.phaseData).subscribe(data => {
        this.getVillageData = data;
        // console.log(this.getVillageData);
      });

      this._apiService.getLandClass().subscribe(data => {
        this.getLandClassData = data;
        // console.log(this.getLandClassData);
      })
    } else {
      this._notify.showWarning("Phase 2 Data is not Available");
    }
    if (this.phaseData == 'Phase 2') {
      this.getVillageData = [];
      this.getLandClassData = [];
      this.leaseCaseNoData = [];
    }
  }

  stringify(val: any) {
    return JSON.stringify(val);
  }

  onVillageSelect(data: any) {
    data = JSON.parse(data);
    this.selectedVillId = data.id;
    this.selectedVillName = data.village;
    this.leaseCaseData();
  }

  getLandClassWiseLeaseCaseNoData(e: any) {
    this.landClassData = e.target.value;
    this.leaseCaseData();
  }

  leaseCaseData() {
    if (this.selectedVillId != 0 && this.selectedVillId != undefined) {
      if (this.landClassData != '0') {
        this._apiService.bindLeaseCaseAsPerVillageAndLandclass(this.selectedVillId, this.landClassData).subscribe(data => {
          this.leaseCaseNoData = data;
        })
      }
    }
  }

  onStageselect(data: any) {
    // console.log(data);
    data = JSON.parse(data);
    this.selectStageCode = data.stageCode;
    this.selectStagePhase = data.phase;
    this.stageDescription = data.stageDesc;
    // this.stageUpdate.get('stage').setValue(this.selectStageCode);

    // console.log(this.selectStageId);
    // console.log(this.selectStagePhase);

  }

  searchData() {
    if (this.phaseData != 'Phase 2') {
      this.checkBoxChecked = true;
      if (this.phaseData != undefined && this.phaseData != 0) {
        if (this.selectedVillName != undefined && this.selectedVillName != 0) {
          if (this.landClassData != undefined && this.landClassData != 0) {
            // console.log(this.leasecaseNo);
            if (this.leasecaseNo != undefined && this.leasecaseNo != 0) {
              this._apiService.getPlotDetails(this.phaseData, this.selectedVillName, this.landClassData, this.leasecaseNo).subscribe(data => {
                this.fetchPlotDetails = data;
                console.log('Fetch Plot Details >>', this.fetchPlotDetails);
                if (data.length != 0) {
                  this.fetchPlotDetails = data;
                  jQuery("#acquisitionDatatable").DataTable().destroy();
                  this.dtTrigger.next(this.fetchPlotDetails);
                }
              })
            } else {
              this._notify.showWarning("Please Select The Lease Case No");
            }

          } else {
            this._notify.showWarning("Please Select The Land Class");
          }

        } else {
          this._notify.showWarning("Please Select The Village");
        }

      } else {
        this._notify.showWarning("Please Select The Phase");
      }
    }
  }

  primaryCheck(e: any) {
    if (e.target.checked == true) {
      this.primaryCheckData.push(parseInt(e.target.value));
      this.checkBoxChecked = false;
      // console.log(this.primaryCheckData);
    }
    else {
      for (let i = 0; i < this.primaryCheckData.length; i++) {
        if (e.target.value == this.primaryCheckData[i]) {
          this.primaryCheckData.splice(i, 1);
          // console.log(this.primaryCheckData);
        }
      }
      if (this.primaryCheckData.length == 0) {
        this.checkBoxChecked = true;
      }
    }
  }

  updateStage() {
    this._apiService.bindingStageCodeToDropdown(this.landClassData).subscribe(data => {
      this.stageData = data;
      // console.log(this.stageData);
    })
  }

  onFileSelect(event: any) {
    this.removeFile = event;
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.stageUpdate.get('file').setValue(file);
    }
  }

  submitUpdateStage() {
    const date = new Date();
    var formData = new FormData();
    formData.append('file', this.stageUpdate.get('file').value);
    this._apiService.UploadDocumentAndGetFileNameReasponseForUpdateLeaseCase(this.leasecaseNo, this.stageUpdate.value.stage, this.landClassData, this.selectedVillName, formData).subscribe(data => {
      this.fileName = data.filename;
      // console.log('File Name Is >>',this.fileNmae);

      if (this.fileName != null || this.fileName != undefined) {

        var historyData = {
          vilCode: this.selectedVillId,
          landClass: this.landClassData,
          leaseCase: this.leasecaseNo,
          acqStage: this.selectStageCode,
          acqPhase: this.selectStagePhase,
          docRef: this.fileName,
          remarks: this.stageUpdate.value.remark,
          updatedAt: date,
          updatedBy: 1,
          descrption: this.stageDescription
        }
        this._apiService.insertToHistoryTable(historyData).subscribe(data => {
          console.log('Insert In To History Table >>', data);
          this.stageUpdate.get('file').setValue('');
          this.removeFile.target.value = null;
          this.stageUpdate.reset();
          this.primaryCheckData = [];
        });
      }
    });

    var stageUpdateData = {
      curStage: this.selectStageCode,
      curPhase: this.selectStagePhase,
      lastUpdated: date
    };

    this._apiService.updateStagesInLeaseAndVilageTable(this.selectedVillId, this.landClassData, this.leasecaseNo, stageUpdateData).subscribe(data => {
      console.log('Update Stages In Lease And Village Table >>>', data);
    });

    var updateData = {
      acqStage: this.selectStageCode,
      acqPhase: this.selectStagePhase
    };

    for (let i = 0; i < this.primaryCheckData.length; i++) {
      this._apiService.updateStagesInRorTableByPlotId(this.phaseData, this.primaryCheckData[i], updateData).subscribe(data => {
        console.log('Update Stages In ROR Table By Plot Id >>', data);
        this.searchData();
      });
    }

    jQuery('#modalUpdateStage').modal('hide');
    this._notify.showSuccess("Update Lease Case Successfully");
  }

}
