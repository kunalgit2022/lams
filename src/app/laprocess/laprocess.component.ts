import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { data } from 'jquery';
import { Subject } from 'rxjs';
import { ApiService } from '../core/api.service';
declare var jQuery: any;

@Component({
  selector: 'app-laprocess',
  templateUrl: './laprocess.component.html',
  styleUrls: ['./laprocess.component.css']
})
export class LaprocessComponent implements OnInit {
  
  public loader: boolean = false;
  landclass: any;
  laForm: any;
  laTableData: any;
  dtOptions: any;
  dtTrigger: Subject<any> = new Subject<any>();
  durationDays: number = 0;
  constructor(private apiService: ApiService, private fromBuilder: FormBuilder) { }

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
        $('#laProcessDatatable').DataTable({
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

    })(jQuery);
    this.laForm = this.fromBuilder.group({
      landClassBind: new FormControl(''),
    })


    this.apiService.getLandClass().subscribe(data => {
      this.landclass = data;
    })
  }
  findLaData() {
    this.durationDays = 0;
    this.loader = true;
    this.apiService.laProcess(this.laForm.value.landClassBind).subscribe(data => {
      this.laTableData = data;
      this.loader = false;
      jQuery("#laProcessDatatable").DataTable().destroy();
      this.dtTrigger.next(data);
      this.sum(data)
    })
  }
  sum(data: any) {
    for (let j = 0; j < data.length; j++) {
      this.durationDays += data[j]['duration'];
    }

  }

}
