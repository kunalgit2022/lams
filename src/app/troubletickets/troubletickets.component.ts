import { Component, OnInit } from '@angular/core';
declare var jQuery: any;

@Component({
  selector: 'app-troubletickets',
  templateUrl: './troubletickets.component.html',
  styleUrls: ['./troubletickets.component.css']
})
export class TroubleticketsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    (function($){

      //------- Datatable --------
      $(document).ready(function () {
        $('#troubleTicketsDatatable').DataTable({
          dom: 'Bfrtip',
          buttons: [
            'excel', 'pdf', 'print'
          ]
        });
      });

      //------- Datepicker -------
      $("#datepicker, #datepicker2").datepicker({ 
        autoclose: true, 
        todayHighlight: true,
        format: 'dd/mm/yyyy'
      }).datepicker('update', new Date());

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
