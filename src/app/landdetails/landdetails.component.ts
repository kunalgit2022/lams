import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subject, window } from 'rxjs';
import { ApiService } from '../core/api.service';
import { NotificationService } from '../core/notification.service';
import Map from 'ol/Map';
import View from 'ol/View';
import Tile from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import * as proj from 'ol/proj';
import * as control from 'ol/control';
import Image from 'ol/layer/Image';
import ImageWMS from 'ol/source/ImageWMS';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';
import { environment } from 'src/environments/environment.prod';
import { BingMaps, Stamen, TileWMS, Vector as VectorSource, XYZ } from 'ol/source';
import { Circle, Circle as CircleStyle, Fill, RegularShape, Stroke, Style, Text, Icon } from 'ol/style';
import { Vector as VectorLayer } from 'ol/layer';
import { WFS, GeoJSON } from 'ol/format';
declare var jQuery: any;
const GEOSERVER_WFS_URL = environment.GEOSERVER_WFS_URL;
const GEOSERVER_WMS_URL = environment.GEOSERVER_WMS_URL;

@Component({
  selector: 'app-landdetails',
  templateUrl: './landdetails.component.html',
  styleUrls: ['./landdetails.component.css']
})
export class LanddetailsComponent implements OnInit {
  public loader: boolean = false;
  Allvillage: any;
  Landclass: any;
  LandDetailsFrom: any;
  dtOptions: any;
  dtTrigger: Subject<any> = new Subject<any>();
  rorAreaSum: number = 0;
  requiredArea: number = 0;
  khataNos: any;
  noofplot: any;
  noofkhata = new Array();
  landInformationData = new Array();
  unick_khata_no: any;
  FinallandDetails: any;
  baseMap: any;
  lamsmap: Map;
  tab2Show: any;
  plotInfo: any;
  showSearch = false;
  SearchCnt = 0;
  getSearchData: any;

  constructor(private notifyService: NotificationService, private apiservice: ApiService, private fromBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.Allvillage = null;
    this.Landclass = null;
    this.dtOptions = {
      pagingType: 'full_numbers',
      dom: 'Bfrtip',
      buttons: [
        'excel', 'pdf', 'print'
      ]
    };
    (function ($) {

      //------- Datatable --------
      // $(document).ready(function () {
      //   $('#landDetailsDatatable').DataTable({
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

      //-------- Multiselect Checkbox --------
      // $(document).ready(function() {
      //   $('#multiple-checkboxes').multiselect({
      //     includeSelectAllOption: true,
      //   });
      // });

      // Toggle div with text change
      $("#advanceOption").click(function () {
        $(".advancePanel, .advPanel").slideToggle("slow");
        $("#advanceOption, #advPanel").toggleClass("active");

        if ($("#advanceOption").text() == "Hide Additional Query")
          $("#advanceOption").text("Open Additional Query")
        else
          $("#advanceOption").text("Hide Additional Query");
      });

      //---------- Tab clickable ------------
      $(function () {
        $("#clicktab2").click(function () {
          $('#tabs li:nth-child(2) a').tab('show')
        });
      });


    })(jQuery);

    // this.initializeMap();

    this.LandDetailsFrom = this.fromBuilder.group({
      phase: new FormControl('0'),
      village: new FormControl('0'),
      ownership: new FormControl('0'),
      landclass: new FormControl('0'),
      khata: new FormControl('0'),
      kissam: new FormControl('0'),
      Rarea: new FormControl('0'),
      operator: new FormControl('0'),
      Forest: new FormControl('0')
    });

  }

  getPhase(e: any) {
    if (e.target.value == 'Phase 1') {
      this.apiservice.phasewisevillage().subscribe(data => {
        this.Allvillage = data;
      });

    }
    else if (e.target.value == 'Phase 2') {
      this.notifyService.showInfo("Phase 2 data is not available");
    }
    else {
      this.ngOnInit();
    }
  }

  finddLandeatils() {
    // console.log(this.LandDetailsFrom.value);

    if (this.LandDetailsFrom.value.phase != "0" && this.LandDetailsFrom.value.village != "0") {
      this.rorAreaSum = 0;
      this.requiredArea = 0;
      var ownership, khataNo, landclassNo;
      console.log(this.LandDetailsFrom.value.khata);

      if (this.LandDetailsFrom.value.ownership != '0') {
        ownership = this.LandDetailsFrom.value.ownership;
      } else {
        ownership = 0;
      }
      if (this.LandDetailsFrom.value.khata != '0') {
        khataNo = this.LandDetailsFrom.value.khata;
      } else {
        khataNo = 0;
      }
      if (this.LandDetailsFrom.value.landclass != '0') {
        landclassNo = this.LandDetailsFrom.value.landclass;
      } else {
        landclassNo = 0;
      }
      this.apiservice.landInformation(this.LandDetailsFrom.value.phase, this.LandDetailsFrom.value.village, ownership, khataNo, landclassNo).subscribe(data => {
        console.log(data);
        this.FinallandDetails = data;
        this.sum(data);
        this.totalKhata(data);
        this.noofplot = this.FinallandDetails.length;
        jQuery("#table1").DataTable().destroy();
        this.dtTrigger.next(null);

      })
    } else {
      this.notifyService.showWarning("please select Phase & Village")
    }
  }

  sum(data: any) {
    for (let j = 0; j < data.length; j++) {
      this.rorAreaSum += data[j]['rorArea'];
      this.requiredArea += data[j]['reqareaac'];
    }
  }
  totalKhata(data: any) {
    this.noofkhata = [];
    for (let k = 0; k < data.length; k++) {
      if (data[k].khataNo != null && data[k].khataNo != 'NA' && data[k].khataNo != '') {
        this.noofkhata.push(data[k].khataNo);
      }
    }
    let unickhatano = [];
    unickhatano = [... new Set(this.noofkhata)];
    this.unick_khata_no = unickhatano.length;
  }

  selectVillage(e: any) {
    this.getKhataNo();
  }
  selectOwnership(e: any) {
    if (this.LandDetailsFrom.value.phase == 'Phase 1') {
      this.loader = false;
      this.getKhataNo();
      this.apiservice.phasewiselandclass(this.LandDetailsFrom.value.ownership).subscribe(data => {
        this.Landclass = data;
      })
    }
    else {
      this.notifyService.showError(' Please select Pahse')
    }
  }
  selectlandclass(e: any) {
    this.loader = false;
  }

  getKhataNo() {
    this.apiservice.getKhataNos(this.LandDetailsFrom.value.phase, this.LandDetailsFrom.value.village, this.LandDetailsFrom.value.ownership, this.LandDetailsFrom.value.landclass).subscribe(data => {
      this.khataNos = data;
    })
  }

  openLand() {
    this.showSearch = false;
  }
  openMap() {
    if (this.SearchCnt == 1) {
      this.showSearch = true;
    } else {
      this.showSearch = false;
    }
  }

  viewDataOnMap(phase: any, plot: any, vill: any, khatano: any, item: any) {
    this.showSearch = true;
    this.SearchCnt = 1;
    this.tab2Show = document.getElementById("tab2Show") as HTMLButtonElement;
    console.log(this.tab2Show.click());
    this.tab2Show.click();
    if (this.lamsmap == null) {
      this.initializeMap();
    }
    this.showPlot(phase, plot, vill, khatano, item);
  }

  initializeMap() {
    const osm = new Tile({
      source: new OSM({
        url: 'https://mt{0-3}.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}',
      })
    });
    this.baseMap = osm;
    //VIEW
    const view = new View({
      center: proj.fromLonLat([86.6664, 20.3617]),
      zoom: 12.6,
      // maxZoom: 16
    });
    this.lamsmap = new Map({
      target: 'map',
      layers: [
        this.baseMap,
      ],
      controls: [
        // new control.ZoomSlider(),
        new control.Zoom()
      ],
      view: view,
    });
  }
  showPlot(phase: any, plot: any, vill: any, khata: any, item: any) {
    console.log(item);
    this.plotInfo = item;

    for (let j = (this.landInformationData.length - 1); j >= 0; j--) {
      if (this.landInformationData[j].get('name') == 'AMNS:amns_phase1_4578_ror_final') {
        this.lamsmap.removeLayer(this.landInformationData[j]);
        this.landInformationData.splice(j, 1);
      }
    }

    if (phase == 'Phase 1') {
      let wmslayerData = new Tile({
        source: new TileWMS({
          url: GEOSERVER_WMS_URL,
          params: {
            TILED: true,
            STYLES: '',
            LAYERS: 'AMNS:amns_phase1_4578_ror_final',
          },
          serverType: 'geoserver',
          crossOrigin: 'anonymous'
        })
      });
      wmslayerData.set('name', 'AMNS:amns_phase1_4578_ror_final');
      this.lamsmap.addLayer(wmslayerData);
      this.landInformationData.push(wmslayerData);

      let query = `plot_no='${plot}' AND village='${vill}' AND khata_no	='${khata}'`
      let layerData = new VectorSource({
        url: `${GEOSERVER_WFS_URL}?service=WFS&version=1.1.0&request=GetFeature&typeName=` + 'AMNS:amns_phase1_4578_ror_final' + '&maxFeatures=2000&outputFormat=application/json&srsname=EPSG:3857&CQL_FILTER=' + query,
        format: new GeoJSON(),
        wrapX: false,
      });
      var style = new Style({
        stroke: new Stroke({
          color: '#010180',
          // lineDash: [pLayer.linedash],
          width: 0.5
        }),
        fill: new Fill({
          color: 'rgba(201,48,150,0.7)',
        }),
      });
      var vectorparcelextend = new VectorLayer({
        source: layerData,
        style: style
      });
      this.lamsmap.addLayer(vectorparcelextend);

      vectorparcelextend.setVisible(true);

      vectorparcelextend.set('name', 'AMNS:amns_phase1_4578_ror_final');
      this.landInformationData.push(vectorparcelextend);
      vectorparcelextend.getSource()?.on('addfeature', (e: any) => {
        this.lamsmap.getView().fit(layerData.getExtent(), { duration: 3000, maxZoom: 16 });
      });
    }

    if (phase == 'Phase 2') {

    }
  }
  showSearchMap() {
    for (let j = (this.landInformationData.length - 1); j >= 0; j--) {
      if (this.landInformationData[j].get('name') == 'AMNS:amns_phase1_4578_ror_final') {
        this.lamsmap.removeLayer(this.landInformationData[j]);
        this.landInformationData.splice(j, 1);
      }
    }
    if (this.LandDetailsFrom.value.phase == 'Phase 1') {
      let wmslayerData = new Tile({
        source: new TileWMS({
          url: GEOSERVER_WMS_URL,
          params: {
            TILED: true,
            STYLES: '',
            LAYERS: 'AMNS:amns_phase1_4578_ror_final',
          },
          serverType: 'geoserver',
          crossOrigin: 'anonymous'
        })
      });
      wmslayerData.set('name', 'AMNS:amns_phase1_4578_ror_final');
      this.lamsmap.addLayer(wmslayerData);
      this.landInformationData.push(wmslayerData);

      let query = `plot_no='${this.getSearchData}' AND village='${this.LandDetailsFrom.value.village}'`
      let layerData = new VectorSource({
        url: `${GEOSERVER_WFS_URL}?service=WFS&version=1.1.0&request=GetFeature&typeName=` + 'AMNS:amns_phase1_4578_ror_final' + '&maxFeatures=2000&outputFormat=application/json&srsname=EPSG:3857&CQL_FILTER=' + query,
        format: new GeoJSON(),
        wrapX: false,
      });
      var style = new Style({
        stroke: new Stroke({
          color: '#010180',
          // lineDash: [pLayer.linedash],
          width: 0.5
        }),
        fill: new Fill({
          color: 'rgba(201,48,150,0.7)',
        }),
      });
      var vectorparcelextend = new VectorLayer({
        source: layerData,
        style: style
      });
      this.lamsmap.addLayer(vectorparcelextend);

      vectorparcelextend.setVisible(true);

      vectorparcelextend.set('name', 'AMNS:amns_phase1_4578_ror_final');
      this.landInformationData.push(vectorparcelextend);
      vectorparcelextend.getSource()?.on('addfeature', (e: any) => {
        this.lamsmap.getView().fit(layerData.getExtent(), { duration: 3000, maxZoom: 16 });
      });
      this.FinallandDetails.map((item: any) => {
        if (item.plotNo == this.getSearchData) {
          console.log(item);
          this.plotInfo = item;
        }
      });
      this.getSearchData = null;
    }
  }
  executeFunction() {
    this.showSearchMap();
  }
}
