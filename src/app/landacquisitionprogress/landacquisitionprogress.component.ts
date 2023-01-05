import { Component, OnInit } from '@angular/core';
declare var jQuery: any;

@Component({
  selector: 'app-landacquisitionprogress',
  templateUrl: './landacquisitionprogress.component.html',
  styleUrls: ['./landacquisitionprogress.component.css']
})
export class LandacquisitionprogressComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    (function($){

      //------- Datatable --------
      $(document).ready(function () {
        $('#landProgressDatatable').DataTable({
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

    })(jQuery)

  }

}
