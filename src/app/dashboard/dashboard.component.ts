import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ApiService } from '../core/api.service';
declare var jQuery: any;
declare var Highcharts: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  getAllPieChartData: any;
  stackColumnData: any;
  VillageWiseLandAbstractData: any;
  phaseType = 'All';
  ahType = 'a';

  govtLand: number = 0;
  privateLand: number = 0;
  forestLand: number = 0;
  villageWiseTotalAc: number = 0;

  notStarted: number = 0;
  initialStage: number = 0;
  processingStage: number = 0;
  finalStage: number = 0;
  landClassWiseTotalAc: number = 0;
  AreaType: any;

  constructor(private _apiService: ApiService, private http: HttpClient) { }

  ngOnInit(): void {
    this.initial();
    this.AreaType = 'Acre';

    (function ($) {
      //   //------- Pie Highchart --------
      //   // Highcharts.chart('pieChart', {
      //   //   chart: {
      //   //     plotBackgroundColor: null,
      //   //     plotBorderWidth: null,
      //   //     plotShadow: false,
      //   //     type: 'pie'
      //   //   },
      //   //   title: {
      //   //     text: 'Land Classification - Required Area'
      //   //   },
      //   //   tooltip: {
      //   //     // pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      //   //   },
      //   //   accessibility: {
      //   //     point: {
      //   //       // valueSuffix: '%'
      //   //     }
      //   //   },
      //   //   plotOptions: {
      //   //     pie: {
      //   //       allowPointSelect: true,
      //   //       cursor: 'pointer',
      //   //       dataLabels: {
      //   //         enabled: true,
      //   //         // format: '<b>{point.name}</b>: {point.percentage:.1f} %'
      //   //       }
      //   //     }
      //   //   },
      //   //   series: [{
      //   //     name: 'Acre',
      //   //     colorByPoint: true,
      //   //     data: [{
      //   //       name: 'x',
      //   //       color: 'green',
      //   //       y: 212,
      //   //       sliced: true,
      //   //       selected: true
      //   //     }, {
      //   //       name: 'Private Land',
      //   //       color: '#4a90d7',
      //   //       y: 145
      //   //     }, {
      //   //       name: 'Govt. Land',
      //   //       color: 'orange',
      //   //       y: 118
      //   //     }]
      //   //   }]
      //   // });

      //   //--------- Stack Column ---------
      //   // Highcharts.chart('stackChart', {
      //   //   chart: {
      //   //     type: 'column'
      //   //   },
      //   //   title: {
      //   //     text: 'Land Class wise Progress - Required Area',
      //   //     align: 'center'
      //   //   },
      //   //   xAxis: {
      //   //     categories: ['Leasable Land', 'Communal Land', 'Departmental Land', 'Gochar Land', 'Forest Land', 'Private Land']
      //   //   },
      //   //   yAxis: {
      //   //     min: 0,
      //   //     title: {
      //   //       text: 'Area (Acre)'
      //   //     },
      //   //     stackLabels: {
      //   //       enabled: true,
      //   //       style: {
      //   //         fontWeight: 'bold',
      //   //         color: ( // theme
      //   //           Highcharts.defaultOptions.title.style &&
      //   //           Highcharts.defaultOptions.title.style.color
      //   //         ) || 'gray',
      //   //         textOutline: 'none'
      //   //       }
      //   //     }
      //   //   },
      //   //   legend: {
      //   //     align: 'left',
      //   //     x: 70,
      //   //     verticalAlign: 'top',
      //   //     y: 70,
      //   //     floating: true,
      //   //     backgroundColor:
      //   //       Highcharts.defaultOptions.legend.backgroundColor || 'white',
      //   //     borderColor: '#CCC',
      //   //     borderWidth: 1,
      //   //     shadow: false
      //   //   },
      //   //   tooltip: {
      //   //     headerFormat: '<b>{point.x}</b><br/>',
      //   //     pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
      //   //   },
      //   //   plotOptions: {
      //   //     column: {
      //   //       stacking: 'normal',
      //   //       dataLabels: {
      //   //         enabled: true
      //   //       }
      //   //     }
      //   //   },
      //   //   series: [{
      //   //     name: 'Final Stage',
      //   //     color: 'green',
      //   //     data: [3, 5, 1, 13, 11, 7]
      //   //   }, {
      //   //     name: 'Processing Stage',
      //   //     color: 'orange',
      //   //     data: [14, 8, 8, 12, 10, 8]
      //   //   }, {
      //   //     name: 'Initial Stage',
      //   //     color: '#4a90d7',
      //   //     data: [14, 8, 8, 12, 10, 8]
      //   //   }, {
      //   //     name: 'Not Started',
      //   //     color: '#f35f55',
      //   //     data: [3, 2, 6, 3, 7, 8]
      //   //   }]
      //   // });

      //-------- Multiselect Checkbox --------
      // $(document).ready(function () {
      //   $('#multiple-checkboxes').multiselect({
      //     includeSelectAllOption: true,
      //   });
      // });

      //-------- Highcharts Separator ---------
      Highcharts.setOptions({
        lang: {
          thousandsSep: ','
        }
      });

    })(jQuery);
  }

  initial() {
    this._apiService.pieChartGetAll(this.phaseType, this.ahType).subscribe(data => {
      this.getAllPieChartData = data;
      // console.log(this.getAllPieChartData);
      (($) => {
        Highcharts.chart('pieChart', {
          chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
          },
          title: {
            text: 'Land Classification'
          },
          tooltip: {
            // pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
          },
          accessibility: {
            point: {
              // valueSuffix: '%'
            }
          },
          plotOptions: {
            pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.percentage:.1f} %'
              }
            }
          },
          series: [{
            name: 'Acre',
            colorByPoint: true,
            data: [{
              name: this.getAllPieChartData[0].landtype,
              color: '#8abef2',
              y: parseFloat(this.getAllPieChartData[0].area),
              sliced: true,
              selected: true
            }, {
              name: this.getAllPieChartData[1].landtype,
              color: '#76ba6c',
              y: parseFloat(this.getAllPieChartData[1].area)
            }, {
              name: this.getAllPieChartData[2]['landtype'],
              color: '#f6c063',
              y: parseFloat(this.getAllPieChartData[2].area)
            }]
          }]
        });
      })(jQuery);
    });

    this._apiService.landClassWiseProgrss(this.phaseType, this.ahType).subscribe(data => {
      this.stackColumnData = data;
      // console.log(this.stackColumnData);
      for (let i = 0; i < this.stackColumnData.length; i++) {
        this.notStarted = this.notStarted + parseFloat(this.stackColumnData[i].notstarted);
        this.initialStage = this.initialStage + parseFloat(this.stackColumnData[i].initial);
        this.processingStage = this.processingStage + parseFloat(this.stackColumnData[i].processing);
        this.finalStage = this.finalStage + parseFloat(this.stackColumnData[i].finalst);
        this.landClassWiseTotalAc = this.landClassWiseTotalAc + parseFloat(this.stackColumnData[i].total);
      }

      Highcharts.chart('stackChart', {
        chart: {
          type: 'column'
        },
        title: {
          text: 'Land Class wise progress of Land Acquisition / Alienation',
          align: 'center'
        },
        xAxis: {
          categories: ['Leasable Land', 'Communal Land', 'Departmental Land', 'Gochar Land', 'Forest Land', 'Private Land']
        },
        yAxis: {
          min: 0,
          title: {
            text: `Area (${this.AreaType})`
          },
          stackLabels: {
            enabled: true,
            style: {
              fontWeight: 'bold',
              color: ( // theme
                Highcharts.defaultOptions.title.style &&
                Highcharts.defaultOptions.title.style.color
              ) || 'gray',
              textOutline: 'none'
            }
          }
        },
        legend: {
          align: 'left',
          x: 70,
          verticalAlign: 'top',
          y: 70,
          floating: true,
          backgroundColor:
            Highcharts.defaultOptions.legend.backgroundColor || 'white',
          borderColor: '#CCC',
          borderWidth: 1,
          shadow: false
        },
        tooltip: {
          headerFormat: '<b>{point.x}</b><br/>',
          pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
        },
        plotOptions: {
          column: {
            stacking: 'normal',
            dataLabels: {
              enabled: true
            }
          }
        },
        series: [{
          name: 'Final Stage',
          color: '#6bb567',
          data: [
            parseFloat(this.stackColumnData[0].finalst),
            parseFloat(this.stackColumnData[1].finalst),
            parseFloat(this.stackColumnData[2].finalst),
            parseFloat(this.stackColumnData[3].finalst),
            parseFloat(this.stackColumnData[4].finalst),
            parseFloat(this.stackColumnData[5].finalst),
          ]
        }, {
          name: 'Processing Stage',
          color: '#dba181',
          data: [
            parseFloat(this.stackColumnData[0].processing),
            parseFloat(this.stackColumnData[1].processing),
            parseFloat(this.stackColumnData[2].processing),
            parseFloat(this.stackColumnData[3].processing),
            parseFloat(this.stackColumnData[4].processing),
            parseFloat(this.stackColumnData[5].processing),
          ]
        }, {
          name: 'Initial Stage',
          color: '#6098d1',
          data: [
            parseFloat(this.stackColumnData[0].initial),
            parseFloat(this.stackColumnData[1].initial),
            parseFloat(this.stackColumnData[2].initial),
            parseFloat(this.stackColumnData[3].initial),
            parseFloat(this.stackColumnData[4].initial),
            parseFloat(this.stackColumnData[5].initial),
          ]
        }, {
          name: 'Not Started',
          color: '#fa7e75',
          data: [
            parseFloat(this.stackColumnData[0].notstarted),
            parseFloat(this.stackColumnData[1].notstarted),
            parseFloat(this.stackColumnData[2].notstarted),
            parseFloat(this.stackColumnData[3].notstarted),
            parseFloat(this.stackColumnData[4].notstarted),
            parseFloat(this.stackColumnData[5].notstarted),
          ]
        }]
      });

    });

    this._apiService.VillageWiseLandAbstract(this.phaseType, this.ahType).subscribe(data => {
      this.VillageWiseLandAbstractData = data;
      for (let i = 0; i < this.VillageWiseLandAbstractData.length; i++) {
        this.govtLand = this.govtLand + parseFloat(this.VillageWiseLandAbstractData[i].govtarea);
        this.privateLand = this.privateLand + parseFloat(this.VillageWiseLandAbstractData[i].pvtarea);
        this.forestLand = this.forestLand + parseFloat(this.VillageWiseLandAbstractData[i].forarea);
        this.villageWiseTotalAc = this.villageWiseTotalAc + parseFloat(this.VillageWiseLandAbstractData[i].totarea);
      }
      // console.log(this.VillageWiseLandAbstractData);
    });
  }

  Total(Ac: any) {
    throw new Error('Method not implemented.');
  }
  onPhaseSelectAll(e: any) {
    this.phaseType = e.target.value;
    // console.log(e.target.value);

    this._apiService.pieChartGetAll(this.phaseType, this.ahType).subscribe(data => {
      this.getAllPieChartData = data;
      // console.log(this.getAllPieChartData);
      (($) => {
        Highcharts.chart('pieChart', {
          chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
          },
          title: {
            text: 'Land Classification - Required Area'
          },
          tooltip: {
            // pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
          },
          accessibility: {
            point: {
              // valueSuffix: '%'
            }
          },
          plotOptions: {
            pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.percentage:.1f} %'
              }
            }
          },
          series: [{
            name: 'Acre',
            colorByPoint: true,
            data: [{
              name: this.getAllPieChartData[0].landtype,
              color: 'green',
              y: parseFloat(this.getAllPieChartData[0].area),
              sliced: true,
              selected: true
            }, {
              name: this.getAllPieChartData[1].landtype,
              color: '#4a90d7',
              y: parseFloat(this.getAllPieChartData[1].area)
            }, {
              name: this.getAllPieChartData[2]['landtype'],
              color: 'orange',
              y: parseFloat(this.getAllPieChartData[2].area)
            }]
          }]
        });
      })(jQuery);
    });

    this._apiService.landClassWiseProgrss(this.phaseType, this.ahType).subscribe(data => {

      this.stackColumnData = data;
      // console.log(this.stackColumnData);
      this.notStarted = 0;
      this.initialStage = 0;
      this.processingStage = 0;
      this.finalStage = 0;
      this.landClassWiseTotalAc = 0;
      for (let i = 0; i < this.stackColumnData.length; i++) {
        this.notStarted = this.notStarted + parseFloat(this.stackColumnData[i].notstarted);
        this.initialStage = this.initialStage + parseFloat(this.stackColumnData[i].initial);
        this.processingStage = this.processingStage + parseFloat(this.stackColumnData[i].processing);
        this.finalStage = this.finalStage + parseFloat(this.stackColumnData[i].finalst);
        this.landClassWiseTotalAc = this.landClassWiseTotalAc + parseFloat(this.stackColumnData[i].total);
      }
      if (this.stackColumnData != "") {
        Highcharts.chart('stackChart', {
          chart: {
            type: 'column'
          },
          title: {
            text: 'Land Class wise Progress - Required Area',
            align: 'center'
          },
          xAxis: {
            categories: ['Leasable Land', 'Communal Land', 'Departmental Land', 'Gochar Land', 'Forest Land', 'Private Land']
          },
          yAxis: {
            min: 0,
            title: {
              text: `Area (${this.AreaType})`
            },
            stackLabels: {
              enabled: true,
              style: {
                fontWeight: 'bold',
                color: ( // theme
                  Highcharts.defaultOptions.title.style &&
                  Highcharts.defaultOptions.title.style.color
                ) || 'gray',
                textOutline: 'none'
              }
            }
          },
          legend: {
            align: 'left',
            x: 70,
            verticalAlign: 'top',
            y: 70,
            floating: true,
            backgroundColor:
              Highcharts.defaultOptions.legend.backgroundColor || 'white',
            borderColor: '#CCC',
            borderWidth: 1,
            shadow: false
          },
          tooltip: {
            headerFormat: '<b>{point.x}</b><br/>',
            pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
          },
          plotOptions: {
            column: {
              stacking: 'normal',
              dataLabels: {
                enabled: true
              }
            }
          },
          series: [{
            name: 'Final Stage',
            color: 'green',
            data: [
              parseFloat(this.stackColumnData[0].finalst),
              parseFloat(this.stackColumnData[1].finalst),
              parseFloat(this.stackColumnData[2].finalst),
              parseFloat(this.stackColumnData[3].finalst),
              parseFloat(this.stackColumnData[4].finalst),
              parseFloat(this.stackColumnData[5].finalst),
            ]
          }, {
            name: 'Processing Stage',
            color: 'orange',
            data: [
              parseFloat(this.stackColumnData[0].processing),
              parseFloat(this.stackColumnData[1].processing),
              parseFloat(this.stackColumnData[2].processing),
              parseFloat(this.stackColumnData[3].processing),
              parseFloat(this.stackColumnData[4].processing),
              parseFloat(this.stackColumnData[5].processing),
            ]
          }, {
            name: 'Initial Stage',
            color: '#4a90d7',
            data: [
              parseFloat(this.stackColumnData[0].initial),
              parseFloat(this.stackColumnData[1].initial),
              parseFloat(this.stackColumnData[2].initial),
              parseFloat(this.stackColumnData[3].initial),
              parseFloat(this.stackColumnData[4].initial),
              parseFloat(this.stackColumnData[5].initial),
            ]
          }, {
            name: 'Not Started',
            color: '#f35f55',
            data: [
              parseFloat(this.stackColumnData[0].notstarted),
              parseFloat(this.stackColumnData[1].notstarted),
              parseFloat(this.stackColumnData[2].notstarted),
              parseFloat(this.stackColumnData[3].notstarted),
              parseFloat(this.stackColumnData[4].notstarted),
              parseFloat(this.stackColumnData[5].notstarted),
            ]
          }]
        });

      } else {
        if (this.stackColumnData.length == 0) {
          // console.log('hii');
          Highcharts.chart('stackChart', {
            chart: {
              type: 'column'
            },
            title: {
              text: 'Land Class wise Progress - Required Area',
              align: 'center'
            },
            xAxis: {
              categories: ['Leasable Land', 'Communal Land', 'Departmental Land', 'Gochar Land', 'Forest Land', 'Private Land']
            },
            yAxis: {
              min: 0,
              title: {
                text: `Area (${this.AreaType})`
              },
              stackLabels: {
                enabled: true,
                style: {
                  fontWeight: 'bold',
                  color: ( // theme
                    Highcharts.defaultOptions.title.style &&
                    Highcharts.defaultOptions.title.style.color
                  ) || 'gray',
                  textOutline: 'none'
                }
              }
            },
            legend: {
              align: 'left',
              x: 70,
              verticalAlign: 'top',
              y: 70,
              floating: true,
              backgroundColor:
                Highcharts.defaultOptions.legend.backgroundColor || 'white',
              borderColor: '#CCC',
              borderWidth: 1,
              shadow: false
            },
            tooltip: {
              headerFormat: '<b>{point.x}</b><br/>',
              pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
            },
            plotOptions: {
              column: {
                stacking: 'normal',
                dataLabels: {
                  enabled: true
                }
              }
            },
            series: [{
              name: 'Final Stage',
              color: 'green',
              data: [
                this.stackColumnData[0] = 0,
                this.stackColumnData[1] = 0,
                this.stackColumnData[2] = 0,
                this.stackColumnData[3] = 0,
                this.stackColumnData[4] = 0,
                this.stackColumnData[5] = 0,
              ]
            }, {
              name: 'Processing Stage',
              color: 'orange',
              data: [
                this.stackColumnData[0] = 0,
                this.stackColumnData[1] = 0,
                this.stackColumnData[2] = 0,
                this.stackColumnData[3] = 0,
                this.stackColumnData[4] = 0,
                this.stackColumnData[5] = 0,
              ]
            }, {
              name: 'Initial Stage',
              color: '#4a90d7',
              data: [
                this.stackColumnData[0] = 0,
                this.stackColumnData[1] = 0,
                this.stackColumnData[2] = 0,
                this.stackColumnData[3] = 0,
                this.stackColumnData[4] = 0,
                this.stackColumnData[5] = 0,
              ]
            }, {
              name: 'Not Started',
              color: '#f35f55',
              data: [
                this.stackColumnData[0] = 0,
                this.stackColumnData[1] = 0,
                this.stackColumnData[2] = 0,
                this.stackColumnData[3] = 0,
                this.stackColumnData[4] = 0,
                this.stackColumnData[5] = 0,
              ]
            }]
          });
        }
      }

    });

    this._apiService.VillageWiseLandAbstract(this.phaseType, this.ahType).subscribe(data => {
      this.VillageWiseLandAbstractData = data;
      // console.log(this.VillageWiseLandAbstractData);

      this.govtLand = 0;
      this.privateLand = 0;
      this.forestLand = 0;
      this.villageWiseTotalAc = 0;
      for (let i = 0; i < this.VillageWiseLandAbstractData.length; i++) {
        this.govtLand = this.govtLand + parseFloat(this.VillageWiseLandAbstractData[i].govtarea);
        this.privateLand = this.privateLand + parseFloat(this.VillageWiseLandAbstractData[i].pvtarea);
        this.forestLand = this.forestLand + parseFloat(this.VillageWiseLandAbstractData[i].forarea);
        this.villageWiseTotalAc = this.villageWiseTotalAc + parseFloat(this.VillageWiseLandAbstractData[i].totarea);
      }
    });
  }

  onAcreHectareSelectAll(data: any) {
    if (this.phaseType != 'Phase 2') {
      this.ahType = data.target.value;

      if (this.ahType == 'a') {
        this.AreaType = 'Acre';
        this.initial();
      }
      if (this.ahType == 'h') {
        this.AreaType = 'Hectare';
        this.initial();
      }
    }
  }

}
