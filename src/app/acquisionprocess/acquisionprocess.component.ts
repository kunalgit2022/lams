import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
declare var jQuery: any;

@Component({
  selector: 'app-acquisionprocess',
  templateUrl: './acquisionprocess.component.html',
  styleUrls: ['./acquisionprocess.component.css']
})
export class AcquisionprocessComponent implements OnInit {
  public loader: boolean = false;
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: any = {};

  constructor() { }

  ngOnInit(): void {
    this.dtOptions = {
      responsive: true,
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true,
      dom: 'Bfrtip',
      buttons: [
        'copy', 'excel', 'pdf', 'print'
      ]
    };

    (function ($) {

      // $(document).ready(function () {
      //   $('#surveyDatatable').DataTable({
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

    })(jQuery)
  }

}
