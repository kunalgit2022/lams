import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import Tile from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import * as proj from 'ol/proj';
import * as control from 'ol/control';
import KML from 'ol/format/KML.js';
import Image from 'ol/layer/Image';
import ImageWMS from 'ol/source/ImageWMS';
import { BingMaps, Stamen, TileWMS, Vector as VectorSource, XYZ } from 'ol/source';
import { Circle, Circle as CircleStyle, Fill, RegularShape, Stroke, Style, Text, Icon } from 'ol/style';
import { Modify, DragZoom, Select } from 'ol/interaction';
import { getArea, getLength } from 'ol/sphere';
import { LineString, Point, MultiLineString, MultiPoint, MultiPolygon, Polygon, LinearRing } from 'ol/geom';
import { Vector as VectorLayer } from 'ol/layer';
import { WFS, GeoJSON } from 'ol/format';
import { bbox as bboxStrategy } from 'ol/loadingstrategy';
import { environment } from 'src/environments/environment.prod';
import Draw, {
  createBox,
  createRegularPolygon,
} from 'ol/interaction/Draw';
import Overlay from 'ol/Overlay';
import { loadFeaturesXhr } from 'ol/featureloader';
import { LoginComponent } from '../login/login.component';
import { NotificationService } from '../core/notification.service';
import { ApiService } from '../core/api.service';
declare var jQuery: any;
declare var Tree: any;
declare var Slider: any;
const GEOSERVER_WFS_URL = environment.GEOSERVER_WFS_URL;
const GEOSERVER_WMS_URL = environment.GEOSERVER_WMS_URL;


@Component({
  selector: 'app-mapview',
  templateUrl: './mapview.component.html',
  styleUrls: ['./mapview.component.css']
})
export class MapviewComponent implements OnInit {
  baseMap: any;
  lamsmap: any;
  baseLayerValue: any;
  draw: any;
  Vectorsource: any;
  modify: any;
  vector: any;
  tipPoint: any;
  measure_type: any;
  modifyStyle: any;
  layerList = new Array();
  _overlay: any;
  _closer: any;
  selectSingleClick: any;
  popupCnt = 0;
  landClassData = new Array();
  landClassid: any;
  queryData: any;
  zoomPhaseData = new Array();
  dlcForest = new Array();
  selectMap = new Array();
  villageData = new Array();
  khataData = new Array();
  plotData = new Array();
  kmlData = new Array();
  zoomArea: any;
  phaseValue: any;
  showLandClassification = '0';
  phaseWiseVillage: any;
  villageWiseKhata: any;
  villageWiseKhataData: any;
  kmlFile: any;
  stageDesc: any;
  getPlotValue: any;
  allLayerList = [
    {
      gid: '1', gName: 'Administrative Layers', activeStatus: true, pLayer: [
        { pid: "11", pName: 'AOI Boundary : Phase1', url: 'AMNS:phase1_aoi_revised_4578', activeStatus: true, type: 'WMS', stroke: 'background-color:#00FF7F;', fill: 'rgba(152,251,152, 0.33)', width: 0.2, linedash: 0 },
        { pid: "12", pName: 'AOI Boundary : Phase2', url: 'AMNS:phase2_aoi_revised', activeStatus: true, type: 'WMS', stroke: 'background-color:#FA8122;', fill: 'rgba(255,130,67,0.33)', width: 0.2, linedash: 0 },
        { pid: "13", pName: 'Village Boundary : Phase1', url: 'AMNS:phase1_vill_poly_4578', activeStatus: false, type: 'WMS', stroke: 'background-color:#FF0000;', fill: 'transparent', width: 0.2, linedash: 6 },
        { pid: "14", pName: 'Village Boundary : Phase2', url: '', activeStatus: false, type: 'WMS', stroke: '', fill: 'transparent', width: 0.2, linedash: 0 },
        { pid: "15", pName: 'AOI Plot Boundary : Phase1', url: 'AMNS:amns_phase1_4578_ror_final', activeStatus: false, type: 'WMS', stroke: 'background-color:#f2f26b;', fill: 'rgba(245,243,157,0.83)', width: 0.2, linedash: 0 },
        { pid: "16", pName: 'AOI Plot Boundary : Phase2', url: '', activeStatus: false, type: 'WMS', stroke: '', fill: '#F0E68C', width: 0.2, linedash: 0 },
        { pid: "17", pName: 'Plant Layout : Phase1', url: '', activeStatus: false, type: 'WMS', stroke: '', fill: '#F0E68C', width: 0.2, linedash: 0 },
        { pid: "18", pName: 'Plant Layout : Phase2', url: '', activeStatus: false, type: 'WMS', stroke: '', fill: '#F0E68C', width: 0.2, linedash: 0 },
      ]
    },
    {
      gid: 2, gName: 'Water Bodies', activeStatus: false, pLayer: [
        { pid: "21", pName: 'River', url: 'AMNS:river', activeStatus: false, type: 'WMS', stroke: 'background-color:#9BBFF4;', fill: '#2ac5f5', width: 0.2, linedash: 0 }
      ]
    },
    {
      gid: 3, gName: 'Eco Sensitive Zone', activeStatus: false, pLayer: [
        { pid: "31", pName: 'Bhitarkanika Santuary Boundary', url: 'AMNS:bhitarkanika_sanctuary_new', activeStatus: false, type: 'WMS', stroke: 'background-color:#99FF99;', fill: 'rgba(128,0,0, 0.33)', width: 0.2, linedash: 0 },
        { pid: "32", pName: 'Gahirmatha Santuary Boundary', url: 'AMNS:gahirmatha_marine_sanctuary1', activeStatus: false, type: 'WMS', stroke: 'background-color:#99FF99;', fill: 'rgba(255, 234, 0, 0.33)', width: 0.2, linedash: 0 },
        { pid: "33", pName: 'BKGM Combined ESZ Old', url: 'AMNS:combined_esz_old', activeStatus: false, type: 'WMS', stroke: 'background-color:#99FF99;', fill: 'rgba(25,25,112, 0.33)', width: 0.2, linedash: 0 },
        { pid: "34", pName: 'BKGM Combined ESZ 2021 Draft', url: 'AMNS:combined_esz_new', activeStatus: false, type: 'WMS', stroke: 'background-color:#99FF99;', fill: 'rgba(0,128,128, 0.33)', width: 0.2, linedash: 0 },
        { pid: "35", pName: 'BKGM Combined ESZ S.C. 2022', url: 'AMNS:ESZ_SC_2022', activeStatus: false, type: 'WMS', stroke: 'background-color:#99FF99;', fill: 'rgba(221,160,221, 0.33)', width: 0.2, linedash: 0 },
      ]
    },
    {
      gid: 4, gName: 'Road Network', activeStatus: false, pLayer: [
        { pid: "41", pName: 'NH', url: 'AMNS:kendrapara_nh', activeStatus: false, type: 'WMS', stroke: 'background-color:#decd49;', fill: 'transparent', width: 0.2, linedash: 0 },
        { pid: "42", pName: 'SH', url: 'AMNS:kendrapara_sh', activeStatus: false, type: 'WMS', stroke: 'background-color:#fce635;', fill: 'transparent', width: 0.2, linedash: 0 },
        { pid: "43", pName: 'Other Road', url: 'AMNS:kendrapara_other_road', activeStatus: false, type: 'WMS', stroke: 'background-color:#ef79f7;', fill: 'transparent', width: 0.2, linedash: 0 },]
    },
    {
      gid: 5, gName: 'CRZ Boundary', activeStatus: false, pLayer: [
        { pid: "51", pName: 'CRZ Boundary', url: 'AMNS:crz_boundary', activeStatus: false, type: 'WMS', stroke: 'background-color:#4f24d1;', fill: 'transparent', width: 0.2, linedash: 0 },
      ]
    },
    {
      gid: 6, gName: 'Toposheets', activeStatus: false, pLayer: [
        { pid: "61", pName: 'OSM Topo Old', url: '', activeStatus: false, type: 'WMS', stroke: '', fill: 'transparent', width: 0.2, linedash: 0 },
        { pid: "62", pName: 'OSM Topo New', url: '', activeStatus: false, type: 'WMS', stroke: '', fill: 'transparent', width: 0.2, linedash: 0 },
        { pid: "63", pName: 'CRZ Toposheet 50K', url: '', activeStatus: false, type: 'WMS', stroke: '', fill: 'transparent', width: 0.2, linedash: 0 },
      ]
    },
  ];

  @ViewChild('myInput')
  myInputVariable: ElementRef;

  constructor(private _notification: NotificationService, private _apiService: ApiService) { }

  ngOnInit(): void {

    (function ($) {
      //---------- Map Tool Onclick Function ----------
      $('.mapFilter').click(function () {
        $('#mapFilterContent').toggle();
      });
      $('.mapLayers').click(function () {
        $('#mapLayersContent').toggle();
      });
      $('.mapBase').click(function () {
        $('#mapBaseContent').toggle();
      });
      $('.mapLegend').click(function () {
        $('#mapLegendContent').toggle();
      });
      $('.mapMeasurement').click(function () {
        $('#mapMeasurementContent').toggle();
      });
      $('.mapSlider').click(function () {
        $('#mapSliderContent').toggle();
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

      //--------- Select All Checkbox ---------
      $(document).ready(function () {
        $('input[name="all"],input[name="title"]').bind('click', function () {
          var status = $('input:checkbox').is(':checked');
          $('input[type="checkbox"]', $('input:checkbox').parent('li.custom-all')).attr('checked', status);
        });
      });

      //---------- Draggable ---------
      $(document).ready(function () {
        $('#mapFilterContent, #mapLayersContent, #mapBaseContent, #mapLegendContent, #mapSliderContent').drags({ handle: ".layer-header" });
      });

      //---------- Tree Checkbox Control ---------
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

      //------- Range Slider -------
      var slider = new Slider("#basic", {
        tooltip: 'always'
      });

    })(jQuery)
    this.initialize();
    this.allLayerList.map(item => {
      item.pLayer.map(data => {
        if (data.activeStatus == true) {
          if (data.type == 'WMS') {
            let layerData = new Tile({
              source: new TileWMS({
                url: GEOSERVER_WMS_URL,
                params: {
                  'FORMAT': 'image/png',
                  'VERSION': '1.1.0',
                  STYLES: '',
                  LAYERS: data.url,
                },
                serverType: 'geoserver',
                crossOrigin: 'anonymous'
              }),
              visible: true
            });
            let source = new TileWMS({
              url: GEOSERVER_WMS_URL,
              params: {
                TILED: true,
                STYLES: '',
                LAYERS: data.url,
              },
              serverType: 'geoserver',
              crossOrigin: 'anonymous'
            });
            layerData.set('name', data.url);
            layerData.set('desc', data.pName);
            layerData.set('stroke', data.stroke);
            layerData.set('width', data.width);
            layerData.set('fill', data.fill);
            layerData.set('source', source);
            layerData.setZIndex(this.layerList.length + 1);
            this.lamsmap.addLayer(layerData);
            this.layerList.push(layerData);
          }
          if (data.type == 'WFS') {
            var layerData = new VectorSource({
              url: `${GEOSERVER_WFS_URL}?service=WFS&version=1.1.0&request=GetFeature&typeName=` + data.url + '&maxFeatures=2000&outputFormat=application/json&srsname=EPSG:3857',
              format: new GeoJSON(),
              wrapX: false,
            });
            var style = new Style({
              stroke: new Stroke({
                color: data.stroke,
                lineDash: [data.linedash],
                width: data.width
              }),
              fill: new Fill({
                color: data.fill,
              }),
            });
            var vectorparcelextend = new VectorLayer({
              source: layerData,
              style: style
            });
            this.lamsmap.addLayer(vectorparcelextend);

            vectorparcelextend.setVisible(true);

            vectorparcelextend.setZIndex(this.layerList.length + 1);
            vectorparcelextend.set('name', data.url);
            vectorparcelextend.set('desc', data.pName);
            vectorparcelextend.set('stroke', data.stroke);
            vectorparcelextend.set('width', data.width);
            vectorparcelextend.set('fill', data.fill);
            this.layerList.push(vectorparcelextend);
            // vectorparcelextend.getSource()?.on('addfeature', (e) => {
            //   this.lamsmap.getView().fit(layerData.getExtent(), { "maxZoom": 12.8 });
            // });
          }
        }
      })
    });
  }
  initialize() {
    var _this = this;
    const container = document.getElementById('popup') as HTMLElement;
    const content = document.getElementById('popup-content') as HTMLElement;
    const closer = document.getElementById('popup-closer') as HTMLElement;
    const overlay = new Overlay({
      element: container,
      autoPan: {
        animation: {
          duration: 250,
        },
      },
    });



    this._overlay = overlay;
    this._closer = closer;
    closer.onclick = function () {
      overlay.setPosition(undefined);
      closer.blur();
      _this.lamsmap.removeInteraction(_this.selectSingleClick);
      for (let j = (_this.zoomPhaseData.length - 1); j >= 0; j--) {
        _this.lamsmap.removeLayer(_this.zoomPhaseData[j]);
        _this.zoomPhaseData.splice(j, 1);
      }
      for (let i = (_this.selectMap.length - 1); i >= 0; i--) {
        _this.lamsmap.removeLayer(_this.selectMap[i]);
        _this.selectMap.splice(i, 1);
      }
      return false;
    };
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
      overlays: [overlay],
      controls: [
        // new control.ZoomSlider(),
        new control.Zoom()
      ],
      view: view,
    });

    this.selectSingleClick = new Select();
    this.lamsmap.on('singleclick', function (evt: any) {
      if (_this.popupCnt == 0) {
        _this.lamsmap.addInteraction(_this.selectSingleClick);
        // _this.lamsmap.getView().fit(_this.selectSingleClick.getExtent(), { "maxZoom": 13 });
        // _this.selectSingleClick.getSource()?.on('addfeature', (e:any) => {
        //   _this.lamsmap.getView().fit(_this.selectSingleClick.getExtent(), { "maxZoom": 13 });
        // });
        const coordinate = evt.coordinate;
        const res = _this.lamsmap.getView().getResolution();
        _this.layerList.map(item => {
          // console.log(item.values_.name);
          if (item.values_.name == 'AMNS:amns_phase1_4578_ror_final') {
            const url = item.values_.source.getFeatureInfoUrl(coordinate, res, 'EPSG:3857', { 'INFO_FORMAT': 'application/json' });
            if (url) {
              for (let j = (_this.zoomPhaseData.length - 1); j >= 0; j--) {
                _this.lamsmap.removeLayer(_this.zoomPhaseData[j]);
                _this.zoomPhaseData.splice(j, 1);
              }
              for (let i = (_this.selectMap.length - 1); i >= 0; i--) {
                _this.lamsmap.removeLayer(_this.selectMap[i]);
                _this.selectMap.splice(i, 1);
              }

              fetch(url)
                .then((response) => response.text())
                .then((html) => {
                  let data = JSON.parse(html);
                  _this.zoomArea = data.features[0].properties.sl;

                  overlay.setPosition(undefined);
                  closer.blur();
                  const coordinate = evt.coordinate;
                  const res = _this.lamsmap.getView().getResolution();
                  var lonlat = proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:3857');
                  let lon = lonlat[0].toString().substring(0, 9);
                  let lat = lonlat[1].toString().substring(0, 9);

                  let query = `sl='${data.features[0].properties.sl}'`
                  let layerData = new VectorSource({
                    url: `${GEOSERVER_WFS_URL}?service=WFS&version=1.1.0&request=GetFeature&typeName=` + 'AMNS:amns_phase1_4578_ror_final' + '&maxFeatures=2000&outputFormat=application/json&srsname=EPSG:3857&CQL_FILTER=' + query,
                    format: new GeoJSON(),
                    wrapX: false,
                  });
                  var style = new Style({
                    stroke: new Stroke({
                      color: 'blue',
                      // lineDash: [pLayer.linedash],
                      width: 1
                    }),
                    fill: new Fill({
                      color: 'rgba(224,255,255, 0.33)',
                    }),
                  });
                  var vectorparcelextend = new VectorLayer({
                    source: layerData,
                    style: style
                  });
                  _this.lamsmap.addLayer(vectorparcelextend);

                  vectorparcelextend.setVisible(true);
                  _this.selectMap.push(vectorparcelextend);

                  vectorparcelextend.setZIndex(_this.layerList.length + 1);
                  _this._apiService.findStageDescripton(data.features[0].properties.acq_stage).subscribe(stageData => {
                    if (stageData.length > 0) {
                      _this.stageDesc = stageData[0].stageDesc;
                      if (data.features[0].properties.dist != undefined) {
                        content.innerHTML = `<table class="table table-sm table-bordered mb-0">
                        <tr>
                        <td><strong>Plot No.:</strong></td>
                        <td>${data.features[0].properties.plot_no}</td>
                        </tr>
                        <tr>
                        <td><strong>Khata No.:</strong></td>
                        <td>${data.features[0].properties.khata_no}</td>
                        </tr>
                        <tr>
                        <td><strong>Type of Rights:</strong></td>
                        <td>${data.features[0].properties.owner}</td>
                        </tr>
                        <tr>
                        <td><strong>Dept. Ownership:</strong></td>
                        <td>${data.features[0].properties.dept_ownership}</td>
                        </tr>
                        <tr>
                        <td><strong>Kissam:</strong></td>
                        <td>${data.features[0].properties.kissam}</td>
                        </tr>
                        <tr>
                        <td><strong>DLC Status.:</strong></td>
                        <td>${data.features[0].properties.dlc_sts}</td>
                        </tr>
                        <tr>
                        <td><strong>Land Class:</strong></td>
                        <td>${data.features[0].properties.land_class}</td>
                        </tr>
                        <tr>
                        <td><strong>RoR Area (ac):</strong></td>
                        <td>${data.features[0].properties.rorarea_ac}</td>
                        </tr>
                        <tr>
                        <td><strong>Proposed Area (ac):</strong></td>
                        <td>${data.features[0].properties.reqareaac}</td>
                        </tr>
                        <tr>
                        <td><strong>Current Phase :</strong></td>
                        <td>${data.features[0].properties.acq_phase}</td>
                        </tr>
                        <tr>
                        <td><strong>Current Stage :</strong></td>
                        <td>${data.features[0].properties.acq_stage}</td>
                        </tr>
                        <tr>
                        <td><strong>Stage Desc:</strong></td>
                        <td>${_this.stageDesc}</td>
                        </tr>
                        <tr>
                        <td><strong>Part Plot :</strong></td>
                        <td>${data.features[0].properties.part_plot_sts}</td>
                        </tr>
                        <tr>
                        <td><strong>Thana Name :</strong></td>
                        <td>${data.features[0].properties.thana_name}</td>
                        </tr>
                        <tr>
                        <td><strong>Village :</strong></td>
                        <td>${data.features[0].properties.village}</td>
                        </tr>
                        </table>`
                        overlay.setPosition(coordinate);
                      }
                    } else {
                      _this.stageDesc = '';
                      if (data.features[0].properties.dist != undefined) {
                        content.innerHTML = `<table class="table table-sm table-bordered mb-0">
                        <tr>
                        <td><strong>Plot No.:</strong></td>
                        <td>${data.features[0].properties.plot_no}</td>
                        </tr>
                        <tr>
                        <td><strong>Khata No.:</strong></td>
                        <td>${data.features[0].properties.khata_no}</td>
                        </tr>
                        <tr>
                        <td><strong>Type of Rights:</strong></td>
                        <td>${data.features[0].properties.owner}</td>
                        </tr>
                        <tr>
                        <td><strong>Dept. Ownership:</strong></td>
                        <td>${data.features[0].properties.dept_ownership}</td>
                        </tr>
                        <tr>
                        <td><strong>Kissam:</strong></td>
                        <td>${data.features[0].properties.kissam}</td>
                        </tr>
                        <tr>
                        <td><strong>DLC Status.:</strong></td>
                        <td>${data.features[0].properties.dlc_sts}</td>
                        </tr>
                        <tr>
                        <td><strong>Land Class:</strong></td>
                        <td>${data.features[0].properties.land_class}</td>
                        </tr>
                        <tr>
                        <td><strong>RoR Area (ac):</strong></td>
                        <td>${data.features[0].properties.rorarea_ac}</td>
                        </tr>
                        <tr>
                        <td><strong>Proposed Area (ac):</strong></td>
                        <td>${data.features[0].properties.reqareaac}</td>
                        </tr>
                        <tr>
                        <td><strong>Current Phase :</strong></td>
                        <td>${data.features[0].properties.acq_phase}</td>
                        </tr>
                        <tr>
                        <td><strong>Current Stage :</strong></td>
                        <td>${data.features[0].properties.acq_stage}</td>
                        </tr>
                        <tr>
                        <td><strong>Stage Desc:</strong></td>
                        <td></td>
                        </tr>
                        <tr>
                        <td><strong>Part Plot :</strong></td>
                        <td>${data.features[0].properties.part_plot_sts}</td>
                        </tr>
                        <tr>
                        <td><strong>Thana Name :</strong></td>
                        <td>${data.features[0].properties.thana_name}</td>
                        </tr>
                        <tr>
                        <td><strong>Village :</strong></td>
                        <td>${data.features[0].properties.village}</td>
                        </tr>
                        </table>`
                        overlay.setPosition(coordinate);
                      }
                    }
                  });
                });
            }
          }
        })


        // var feature = _this.lamsmap.forEachFeatureAtPixel(evt.pixel, function (feature: any, layer: any) {
        //   return feature;
        // });
        // if (feature) {
        //   for (let j = (_this.zoomPhaseData.length - 1); j >= 0; j--) {
        //     _this.lamsmap.removeLayer(_this.zoomPhaseData[j]);
        //     _this.zoomPhaseData.splice(j, 1);
        //   }
        //   var props = feature.getProperties();
        //   _this.zoomArea = props.sl;
        // }
        // overlay.setPosition(undefined);
        // closer.blur();
        // const coordinate = evt.coordinate;
        // const res = _this.lamsmap.getView().getResolution();
        // var lonlat = proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:3857');
        // let lon = lonlat[0].toString().substring(0, 9);
        // let lat = lonlat[1].toString().substring(0, 9);
        // if (props.dist != undefined) {
        //   content.innerHTML = `<table class="table table-sm table-bordered mb-0">
        //   <tr>
        //   <td><strong>Plot No.:</strong></td>
        //   <td>${props.plot_no}</td>
        //   </tr>
        //   <tr>
        //   <td><strong>Khata No.:</strong></td>
        //   <td>${props.khata_no}</td>
        //   </tr>
        //   <tr>
        //   <td><strong>Owner:</strong></td>
        //   <td>${props.owner}</td>
        //   </tr>
        //   <tr>
        //   <td><strong>Dept.Ownership:</strong></td>
        //   <td>${props.dept_ownership}</td>
        //   </tr>
        //   <tr>
        //   <td><strong>Kissam:</strong></td>
        //   <td>${props.kissam}</td>
        //   </tr>
        //   <tr>
        //   <td><strong>DLC sts.:</strong></td>
        //   <td>${props.dlc_sts}</td>
        //   </tr>
        //   <tr>
        //   <td><strong>land class:</strong></td>
        //   <td>${props.land_class}</td>
        //   </tr>
        //   <tr>
        //   <td><strong>RoR area ac:</strong></td>
        //   <td>${props.rorarea_ac}</td>
        //   </tr>
        //   <tr>
        //   <td><strong>proposed. area ac:</strong></td>
        //   <td>${props.reqareaac}</td>
        //   </tr>
        //   <tr>
        //   <td><strong>Thana Name :</strong></td>
        //   <td>${props.thana_name}</td>
        //   </tr>
        //   <tr>
        //   <td><strong>Village :</strong></td>
        //   <td>${props.village}</td>
        //   </tr>
        //   <tr>
        //   <td><strong>Tahasil :</strong></td>
        //   <td>${props.tahasil}</td>
        //   </tr>
        //   <tr>
        //   <td><strong>District :</strong></td>
        //   <td>${props.dist}</td>
        //   </tr>
        //   </table>`
        //   overlay.setPosition(coordinate);
        // }
      }
    });
  }
  //Change basemap according to user
  changeBaseMap(LayerValue: any) {
    this.lamsmap.removeLayer(this.baseMap);
    switch (LayerValue) {
      case "road":
        this.baseLayerValue = new Tile({
          source: new XYZ({
            url: 'http://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}'
          })
        });
        this.lamsmap.addLayer(this.baseLayerValue);
        this.baseMap = this.baseLayerValue;
        break;
      case "satellite":
        this.baseLayerValue = new Tile({
          source: new OSM({
            url: 'https://mt{0-3}.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}',
          })
        });
        this.lamsmap.addLayer(this.baseLayerValue);
        this.baseMap = this.baseLayerValue;
        break;
      case "googlehybrid":
        this.baseLayerValue = new Tile({
          source: new OSM({
            url: 'https://mt{0-3}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
          })
        });
        this.lamsmap.addLayer(this.baseLayerValue);
        this.baseMap = this.baseLayerValue;
        break;
      case "terrain":
        this.baseLayerValue = new Tile({
          source: new OSM({
            url: 'https://mt0.google.com/vt/lyrs=p&hl=en&x={x}&y={y}&z={z}',
          })
        });
        this.lamsmap.addLayer(this.baseLayerValue);
        this.baseMap = this.baseLayerValue;
        break;
      case "bingmaps":
        this.baseLayerValue = new Tile({
          source: new BingMaps({
            imagerySet: 'AerialWithLabels',
            key: 'voi3DlahFqo0MOrFalC2~6BX9iFreRSXk_hCsSHtZ0A~AuXzxBFu7NJaGwZO6oX2bEbHUKwhiif5YTYYqOZvgRiSl3Rt2zrcB6Addylvwat9'
          }),
        });
        this.lamsmap.addLayer(this.baseLayerValue);
        this.baseMap = this.baseLayerValue;
        break;
      case "cartography":
        this.baseLayerValue = new Tile({
          source: new XYZ({
            url: 'https://{1-4}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'
          })
        });
        this.lamsmap.addLayer(this.baseLayerValue);
        this.baseMap = this.baseLayerValue;
        break;
      case "ocean":
        this.baseLayerValue = new Tile({
          source: new Stamen({
            layer: 'watercolor'
          })
        });
        this.lamsmap.addLayer(this.baseLayerValue);
        this.baseMap = this.baseLayerValue;
        break;
      case "noMap":
        this.lamsmap.removeLayer(this.baseMap);
        break;
      default:
        this.baseLayerValue = new Tile({ source: new OSM() });
        this.lamsmap.addLayer(this.baseLayerValue);
        this.baseMap = this.baseLayerValue;
    }
  }
  //Draw measurement according to type(line,polygon)
  measurement(type: any) {
    this.popupCnt = 1;
    this._overlay.setPosition(undefined);
    this.lamsmap.removeInteraction(this.selectSingleClick);
    this._closer.blur();
    if (type == 'clear') {
      this.lamsmap.removeInteraction(this.draw);
      this.lamsmap.removeInteraction(this.modify);
      this.lamsmap.removeLayer(this.vector);
      this.popupCnt = 0;
    }
    if (type != 'clear') {
      this.lamsmap.removeInteraction(this.draw);
      this.lamsmap.removeInteraction(this.modify);
      this.lamsmap.removeLayer(this.vector);
      this.measure_type = type;
      this.modifyStyle = new Style({
        image: new CircleStyle({
          radius: 5,
          stroke: new Stroke({
            color: '#ed0e94',
          }),
          fill: new Fill({
            color: 'rgba(0, 0, 102, 0.4)',
          }),
        }),
        text: new Text({
          text: 'Drag to modify',
          font: '12px Calibri,sans-serif',
          fill: new Fill({
            color: 'rgba(32, 32, 32, 1)',
          }),
          backgroundFill: new Fill({
            color: 'rgba(255,178,102,1)',
          }),
          padding: [2, 2, 2, 2],
          textAlign: 'left',
          offsetX: 15,
        }),
      });
      this.Vectorsource = new VectorSource();

      this.modify = new Modify({ source: this.Vectorsource, style: this.modifyStyle });
      this.lamsmap.addInteraction(this.modify);
      this.addInteraction();
    }
  }
  //Calculate length
  formatLength = function (line: any) {
    const length = getLength(line);
    let output;
    if (length > 100) {
      output = Math.round((length / 1000) * 100) / 100 + ' km';
    } else {
      output = Math.round(length * 100) / 100 + ' m';
    }
    return output;
  };
  //Calculate Area
  formatArea = function (polygon: any) {
    const area = getArea(polygon);
    let output;
    if (area > 10000) {
      output = Math.round((area / 1000000) * 100) / 100 + ' km\xB2';
    } else {
      output = Math.round(area * 100) / 100 + ' m\xB2';
    }
    return output;
  };
  //Style for measurement(line,polygon)
  styleFunction(feature: any, segments: any, drawType: any, tip: any) {
    const segmentStyle = new Style({
      text: new Text({
        font: '12px Calibri,sans-serif',
        fill: new Fill({
          color: 'rgba(255, 255, 255, 1)',
        }),
        backgroundFill: new Fill({
          color: '#182e30',
        }),
        padding: [2, 2, 2, 2],
        textBaseline: 'bottom',
        offsetY: -12,
      }),
      image: new RegularShape({
        radius: 6,
        points: 3,
        angle: Math.PI,
        displacement: [0, 8],
        fill: new Fill({
          color: 'rgba(0, 0, 0, 0.4)',
        }),
      }),
    });
    const labelStyle = new Style({
      text: new Text({
        font: '14px Calibri,sans-serif',
        fill: new Fill({
          color: 'rgba(255, 255, 255, 1)',
        }),
        backgroundFill: new Fill({
          color: '#331b36',
        }),
        padding: [3, 3, 3, 3],
        textBaseline: 'bottom',
        offsetY: -15,
      }),
      image: new RegularShape({
        radius: 8,
        points: 3,
        angle: Math.PI,
        displacement: [0, 10],
        fill: new Fill({
          color: 'rgba(0, 0, 0, 0.7)',
        }),
      }),
    });
    const tipStyle = new Style({
      text: new Text({
        font: '12px Calibri,sans-serif',
        fill: new Fill({
          color: 'rgba(255, 255, 255, 1)',
        }),
        backgroundFill: new Fill({
          color: 'rgba(0, 0, 0, 0.4)',
        }),
        padding: [2, 2, 2, 2],
        textAlign: 'left',
        offsetX: 15,
      }),
    });
    const style = new Style({
      fill: new Fill({
        color: 'rgba(255, 255, 255, 0.2)',
      }),
      stroke: new Stroke({
        color: 'rgba(252, 186, 3)',
        lineDash: [10, 10],
        width: 1.3,
      }),
      image: new CircleStyle({
        radius: 5,
        stroke: new Stroke({
          color: 'rgba(0, 0, 0, 0.7)',
        }),
        fill: new Fill({
          color: 'rgba(255, 255, 255, 0.2)',
        }),
      }),
    });
    const segmentStyles = [segmentStyle];
    var ds = this;
    const styles = [style];
    const geometry = feature.getGeometry();
    const type = geometry.getType();
    let point, label, line;
    if (!drawType || drawType === type) {
      if (type === 'Polygon') {
        point = geometry.getInteriorPoint();
        label = this.formatArea(geometry);
        line = new LineString(geometry.getCoordinates()[0]);
      } else if (type === 'LineString') {
        point = new Point(geometry.getLastCoordinate());
        label = this.formatLength(geometry);
        line = geometry;
      }
    }
    if (segments && line) {
      let count = 0;
      line.forEachSegment(function (a: any, b: any) {
        const segment = new LineString([a, b]);
        const label = ds.formatLength(segment);
        if (segmentStyles.length - 1 < count) {
          segmentStyles.push(segmentStyle.clone());
        }
        const segmentPoint = new Point(segment.getCoordinateAt(0.5));
        segmentStyles[count].setGeometry(segmentPoint);
        segmentStyles[count].getText().setText(label);
        styles.push(segmentStyles[count]);
        count++;
      });
    }
    if (label) {
      labelStyle.setGeometry(point);
      labelStyle.getText().setText(label);
      styles.push(labelStyle);
    }
    if (
      tip &&
      type === 'Point' &&
      !ds.modify.getOverlay().getSource().getFeatures().length
    ) {
      ds.tipPoint = geometry;
      tipStyle.getText().setText(tip);
      styles.push(tipStyle);
    }
    return styles;
  }
  addInteraction() {
    var _this = this;
    const drawType = this.measure_type;
    this.vector = new VectorLayer({
      source: this.Vectorsource,
      style: function (feature) {
        return _this.styleFunction(feature, true, drawType, tip);
      },
    });
    this.lamsmap.addLayer(this.vector);
    this.vector.setZIndex((this.layerList.length + 3));
    const activeTip =
      'Click to continue drawing the ' +
      (drawType === 'Polygon' ? 'polygon' : 'line');
    const idleTip = 'Click to start measuring';
    let tip = idleTip;
    this.draw = new Draw({
      source: this.Vectorsource,
      type: drawType,
      style: function (feature) {
        return _this.styleFunction(feature, true, drawType, tip);
      },
    });
    this.draw.on('drawstart', function () {
      _this.modify.setActive(false);
      tip = activeTip;
    });
    this.draw.on('drawend', function () {
      _this.modifyStyle.setGeometry(_this.tipPoint);
      _this.modify.setActive(true);
      _this.lamsmap.once('pointermove', function () {
        _this.modifyStyle.setGeometry();
      });
      tip = idleTip;
      _this.lamsmap.removeInteraction(_this.draw);
    });
    _this.modify.setActive(true);
    _this.lamsmap.addInteraction(_this.draw);
  }

  // collapseExpandLayer(id: any, uid: any) {
  //   jQuery('#' + uid).toggleClass("customDisplay");
  //   if (jQuery('#' + id).hasClass("plus")) {
  //     console.log(id);
  //     console.log(uid);

  //     jQuery('#' + id).removeClass("plus");
  //     jQuery('#' + id).addClass("minus");
  //     jQuery('#' + uid).toggleClass("customDisplay");
  //   } else {
  //     console.log(id);
  //     console.log(uid);
  //     jQuery('#' + id).addClass("plus");
  //     jQuery('#' + id).removeClass("minus");
  //     jQuery('#' + uid).toggleClass("customDisplay");
  //   }
  // }

  getGlobalLayer(e: any, pLayer: any) {
    if (e.target.checked == true) {
      for (let i = 0; i < pLayer.length; i++) {
        for (let j = (this.layerList.length - 1); j >= 0; j--) {
          if (pLayer[i].url == 'AMNS:amns_phase1_4578_ror_final') {
            for (let i = (this.landClassData.length - 1); i >= 0; i--) {
              if (this.landClassData[i].get('name') == 'AMNS:amns_phase1_4578_ror_final') {
                this.lamsmap.removeLayer(this.landClassData[i]);
                this.landClassData.splice(i, 1);
              }
            }
          }
          if (this.layerList[j].get('name') === pLayer[i].url) {
            this.lamsmap.removeLayer(this.layerList[j]);
            this.layerList.splice(j, 1);
          }
        }
      }
      for (let i = 0; i < pLayer.length; i++) {
        if (pLayer[i].type == 'WMS') {
          let layerData = new Tile({
            source: new TileWMS({
              url: GEOSERVER_WMS_URL,
              params: {
                'FORMAT': 'image/png',
                'VERSION': '1.1.0',
                STYLES: '',
                LAYERS: pLayer[i].url,
              },
              serverType: 'geoserver',
              crossOrigin: 'anonymous'
            }),
            visible: true
          });
          let source = new TileWMS({
            url: GEOSERVER_WMS_URL,
            params: {
              TILED: true,
              STYLES: '',
              LAYERS: pLayer[i].url,
            },
            serverType: 'geoserver',
            crossOrigin: 'anonymous'
          });
          layerData.set('name', pLayer[i].url);
          layerData.set('desc', pLayer[i].pName);
          layerData.set('stroke', pLayer[i].stroke);
          layerData.set('width', pLayer[i].width);
          layerData.set('fill', pLayer[i].fill);
          layerData.set('source', source);
          layerData.setZIndex(this.layerList.length + 1);
          this.lamsmap.addLayer(layerData);
          this.layerList.push(layerData);
        }
        if (pLayer[i].type == 'WFS') {
          let layerData = new VectorSource({
            url: `${GEOSERVER_WFS_URL}?service=WFS&version=1.1.0&request=GetFeature&typeName=` + pLayer[i].url + '&maxFeatures=2000&outputFormat=application/json&srsname=EPSG:3857',
            format: new GeoJSON(),
            wrapX: false,
          });
          var style = new Style({
            stroke: new Stroke({
              color: pLayer[i].stroke,
              lineDash: [pLayer[i].linedash],
              width: pLayer[i].width
            }),
            fill: new Fill({
              color: pLayer[i].fill,
            }),
          });
          var vectorparcelextend = new VectorLayer({
            source: layerData,
            style: style
          });
          this.lamsmap.addLayer(vectorparcelextend);

          vectorparcelextend.setVisible(true);

          vectorparcelextend.setZIndex(this.layerList.length + 1);
          vectorparcelextend.set('name', pLayer[i].url);
          vectorparcelextend.set('desc', pLayer[i].pName);
          vectorparcelextend.set('stroke', pLayer[i].stroke);
          vectorparcelextend.set('width', pLayer[i].width);
          vectorparcelextend.set('fill', pLayer[i].fill);
          this.layerList.push(vectorparcelextend);
          // vectorparcelextend.getSource()?.on('addfeature', (e) => {
          //   this.lamsmap.getView().fit(layerData.getExtent(), { "maxZoom": 13 });
          // });
        }
        if (pLayer[i].url == 'AMNS:amns_phase1_4578_ror_final') {
          if (this.queryData != null) {
            this.queryData.map((qItem: any) => {
              let query = `dept_ownership='${qItem.type}'`
              let layerData = new VectorSource({
                url: `${GEOSERVER_WFS_URL}?service=WFS&version=1.1.0&request=GetFeature&typeName=` + 'AMNS:amns_phase1_4578_ror_final' + '&maxFeatures=2000&outputFormat=application/json&srsname=EPSG:3857&CQL_FILTER=' + query,
                format: new GeoJSON(),
                wrapX: false,
              });
              var style = new Style({
                stroke: new Stroke({
                  color: qItem.stroke,
                  // lineDash: [pLayer.linedash],
                  width: qItem.width
                }),
                fill: new Fill({
                  color: qItem.fill,
                }),
              });
              var vectorparcelextend = new VectorLayer({
                source: layerData,
                style: style
              });
              this.lamsmap.addLayer(vectorparcelextend);

              vectorparcelextend.setVisible(true);

              vectorparcelextend.setZIndex(this.layerList.length + 1);
              vectorparcelextend.set('name', 'AMNS:amns_phase1_4578_ror_final');
              this.landClassData.push(vectorparcelextend);
            })
          }
        }
      }
    } else {
      if (e.target.checked !== true) {
        for (let i = 0; i < pLayer.length; i++) {
          for (let j = (this.layerList.length - 1); j >= 0; j--) {
            if (pLayer[i].url == 'AMNS:amns_phase1_4578_ror_final') {
              for (let i = (this.landClassData.length - 1); i >= 0; i--) {
                if (this.landClassData[i].get('name') == 'AMNS:amns_phase1_4578_ror_final') {
                  this.lamsmap.removeLayer(this.landClassData[i]);
                  this.landClassData.splice(i, 1);
                }
              }
              this.queryData = null;
              this.villageWiseKhataData = [];
              this.phaseWiseVillage = [];
              this.getPlotValue = '';
              this.villageWiseKhata = '';
              jQuery('#' + this.landClassid).prop('checked', false);
              this._overlay.setPosition(undefined);
              this._closer.blur();
              for (let i = (this.selectMap.length - 1); i >= 0; i--) {
                this.lamsmap.removeLayer(this.selectMap[i]);
                this.selectMap.splice(i, 1);
              }
              for (let j = (this.zoomPhaseData.length - 1); j >= 0; j--) {
                this.lamsmap.removeLayer(this.zoomPhaseData[j]);
                this.zoomPhaseData.splice(j, 1);
              }
              for (let j = (this.villageData.length - 1); j >= 0; j--) {
                this.lamsmap.removeLayer(this.villageData[j]);
                this.villageData.splice(j, 1);
              }
              for (let j = (this.khataData.length - 1); j >= 0; j--) {
                this.lamsmap.removeLayer(this.khataData[j]);
                this.khataData.splice(j, 1);
              }
              for (let j = (this.plotData.length - 1); j >= 0; j--) {
                this.lamsmap.removeLayer(this.plotData[j]);
                this.plotData.splice(j, 1);
              }
            }
            if (this.layerList[j].get('name') === pLayer[i].url) {
              this.lamsmap.removeLayer(this.layerList[j]);
              this.layerList.splice(j, 1);
            }
          }
        }
      }
    }
  }
  getPrimaryLayer(e: any, pLayer: any) {
    if (e.target.checked == true) {
      if (pLayer.type == 'WMS') {
        let layerData = new Tile({
          source: new TileWMS({
            url: GEOSERVER_WMS_URL,
            params: {
              TILED: true,
              STYLES: '',
              LAYERS: pLayer.url,
            },
            serverType: 'geoserver',
            crossOrigin: 'anonymous'
          })
        });
        var source = new TileWMS({
          url: GEOSERVER_WMS_URL,
          params: {
            TILED: true,
            STYLES: '',
            LAYERS: pLayer.url,
          },
          serverType: 'geoserver',
          crossOrigin: 'anonymous'
        });
        layerData.set('name', pLayer.url);
        layerData.set('desc', pLayer.pName);
        layerData.set('stroke', pLayer.stroke);
        layerData.set('width', pLayer.width);
        layerData.set('fill', pLayer.fill);
        layerData.set('source', source);
        layerData.setZIndex(this.layerList.length + 1);
        this.lamsmap.addLayer(layerData);
        this.layerList.push(layerData);
      }
      if (pLayer.type == 'WFS') {
        let layerData = new VectorSource({
          url: `${GEOSERVER_WFS_URL}?service=WFS&version=1.1.0&request=GetFeature&typeName=` + pLayer.url + '&maxFeatures=2000&outputFormat=application/json&srsname=EPSG:3857',
          format: new GeoJSON(),
          wrapX: false,
        });
        var style = new Style({
          stroke: new Stroke({
            color: pLayer.stroke,
            lineDash: [pLayer.linedash],
            width: pLayer.width
          }),
          fill: new Fill({
            color: pLayer.fill,
          }),
        });
        var vectorparcelextend = new VectorLayer({
          source: layerData,
          style: style
        });
        this.lamsmap.addLayer(vectorparcelextend);

        vectorparcelextend.setVisible(true);

        vectorparcelextend.setZIndex(this.layerList.length + 1);
        vectorparcelextend.set('name', pLayer.url);
        vectorparcelextend.set('desc', pLayer.pName);
        vectorparcelextend.set('stroke', pLayer.stroke);
        vectorparcelextend.set('width', pLayer.width);
        vectorparcelextend.set('fill', pLayer.fill);
        this.layerList.push(vectorparcelextend);
        // vectorparcelextend.getSource()?.on('addfeature', (e) => {
        //   this.lamsmap.getView().fit(layerData.getExtent(), { "maxZoom": 13 });
        // });
      }
    }
    else {
      if (e.target.checked != true) {
        for (let j = (this.layerList.length - 1); j >= 0; j--) {
          if (this.layerList[j].get('name') == 'AMNS:amns_phase1_4578_ror_final') {
            for (let i = (this.landClassData.length - 1); i >= 0; i--) {
              if (this.landClassData[i].get('name') == 'AMNS:amns_phase1_4578_ror_final') {
                this.lamsmap.removeLayer(this.landClassData[i]);
                this.landClassData.splice(i, 1);
              }
            }
            this.queryData = [];
            this.villageWiseKhataData = [];
            this.phaseWiseVillage = [];
            this.getPlotValue = '';
            this.villageWiseKhata = '';
            jQuery('#' + this.landClassid).prop('checked', false);
            this._overlay.setPosition(undefined);
            this._closer.blur();
            for (let i = (this.selectMap.length - 1); i >= 0; i--) {
              this.lamsmap.removeLayer(this.selectMap[i]);
              this.selectMap.splice(i, 1);
            }
            for (let j = (this.zoomPhaseData.length - 1); j >= 0; j--) {
              this.lamsmap.removeLayer(this.zoomPhaseData[j]);
              this.zoomPhaseData.splice(j, 1);
            }
            for (let j = (this.villageData.length - 1); j >= 0; j--) {
              this.lamsmap.removeLayer(this.villageData[j]);
              this.villageData.splice(j, 1);
            }
            for (let j = (this.khataData.length - 1); j >= 0; j--) {
              this.lamsmap.removeLayer(this.khataData[j]);
              this.khataData.splice(j, 1);
            }
            for (let j = (this.plotData.length - 1); j >= 0; j--) {
              this.lamsmap.removeLayer(this.plotData[j]);
              this.plotData.splice(j, 1);
            }
          }
          if (this.layerList[j].get('name') == e.target.value) {
            this.lamsmap.removeLayer(this.layerList[j]);
            this.layerList.splice(j, 1);
          }
        }
      }
    }
  }
  //show chosen layer on the top
  getActiveLayer(e: any) {
    if (e.target.value != '0') {
      for (let j = (this.layerList.length - 1); j >= 0; j--) {
        if (this.layerList[j].get('name') == e.target.value) {
          this.lamsmap.removeLayer(this.layerList[j]);
          var removeData = this.layerList.splice(j, 1);
          if (removeData != null) {
            let layerData = new VectorSource({
              url: `${GEOSERVER_WFS_URL}?service=WFS&version=1.1.0&request=GetFeature&typeName=` + removeData[0].values_.name + '&maxFeatures=2000&outputFormat=application/json&srsname=EPSG:3857',
              format: new GeoJSON(),
              wrapX: false,
            });
            var style = new Style({
              stroke: new Stroke({
                color: removeData[0].values_.stroke,
                lineDash: [removeData[0].linedash],
                width: removeData[0].values_.width
              }),
              fill: new Fill({
                color: removeData[0].values_.fill,
              }),
            });
            var vectorparcelextend = new VectorLayer({
              source: layerData,
              style: style
            });
            this.lamsmap.addLayer(vectorparcelextend);

            vectorparcelextend.setVisible(true);

            vectorparcelextend.setZIndex(this.layerList.length + 1);
            vectorparcelextend.set('name', removeData[0].values_.name);
            vectorparcelextend.set('desc', removeData[0].values_.desc);
            vectorparcelextend.set('stroke', removeData[0].values_.stroke);
            vectorparcelextend.set('width', removeData[0].values_.width);
            vectorparcelextend.set('fill', removeData[0].values_.fill);
            this.layerList.push(vectorparcelextend);
            // vectorparcelextend.getSource()?.on('addfeature', (e) => {
            //   this.lamsmap.getView().fit(layerData.getExtent(), { "maxZoom": 13 });
            // });
          }
        }
      }
    } else {
      if (e.target.value == '0') {
        alert("Please select a Layer");
      }
    }
  }
  getTransparencyLayer(e: any) {
    if (e.target.value != '0') {
      for (let j = (this.layerList.length - 1); j >= 0; j--) {
        if (this.layerList[j].get('name') == e.target.value) {
          this.lamsmap.removeLayer(this.layerList[j]);
          var removeData = this.layerList.splice(j, 1);
          if (removeData != null) {
            let layerData = new VectorSource({
              url: `${GEOSERVER_WFS_URL}?service=WFS&version=1.1.0&request=GetFeature&typeName=` + removeData[0].values_.name + '&maxFeatures=2000&outputFormat=application/json&srsname=EPSG:3857',
              format: new GeoJSON(),
              wrapX: false,
            });
            var style = new Style({
              stroke: new Stroke({
                color: removeData[0].values_.stroke,
                lineDash: [removeData[0].linedash],
                width: removeData[0].values_.width
              }),
              fill: new Fill({
                color: 'transparent',
              }),
            });
            var vectorparcelextend = new VectorLayer({
              source: layerData,
              style: style
            });
            this.lamsmap.addLayer(vectorparcelextend);

            vectorparcelextend.setVisible(true);

            vectorparcelextend.setZIndex(this.layerList.length + 1);
            vectorparcelextend.set('name', removeData[0].values_.name);
            vectorparcelextend.set('desc', removeData[0].values_.desc);
            vectorparcelextend.set('stroke', removeData[0].values_.stroke);
            vectorparcelextend.set('width', removeData[0].values_.width);
            vectorparcelextend.set('fill', removeData[0].values_.fill);
            this.layerList.push(vectorparcelextend);
            // vectorparcelextend.getSource()?.on('addfeature', (e) => {
            //   this.lamsmap.getView().fit(layerData.getExtent(), { "maxZoom": 13 });
            // });
          }
        }
      }
    } else {
      if (e.target.value == '0') {
        alert("Please select a Layer");
      }
    }
  }
  zoomify() {
    let query = `sl='${this.zoomArea}'`
    let layerData = new VectorSource({
      url: `${GEOSERVER_WFS_URL}?service=WFS&version=1.1.0&request=GetFeature&typeName=` + 'AMNS:amns_phase1_4578_ror_final' + '&maxFeatures=2000&outputFormat=application/json&srsname=EPSG:3857&CQL_FILTER=' + query,
      format: new GeoJSON(),
      wrapX: false,
    });
    var style = new Style({
      stroke: new Stroke({
        color: 'blue',
        // lineDash: [pLayer.linedash],
        width: 0.5
      }),
      fill: new Fill({
        color: 'rgba(224,255,255, 0.33)',
      }),
    });
    var vectorparcelextend = new VectorLayer({
      source: layerData,
      style: style
    });
    this.lamsmap.removeLayer(vectorparcelextend);
    this.lamsmap.addLayer(vectorparcelextend);

    vectorparcelextend.setVisible(true);

    vectorparcelextend.setZIndex(this.layerList.length + 1);
    // vectorparcelextend.set('name', 'AMNS:amns_phase1_4578_ror_final');
    this.zoomPhaseData.push(vectorparcelextend);
    vectorparcelextend.getSource()?.on('addfeature', (e: any) => {
      this.lamsmap.getView().fit(layerData.getExtent(), { duration: 3000, maxZoom: 16 });
    });
  }
  //Show all the DLC Forest when checked
  showDLCForest(e: any) {
    if (e.target.checked == true) {
      let query = `dlc_sts='${e.target.value}'`;
      let layerData = new VectorSource({
        url: `${GEOSERVER_WFS_URL}?service=WFS&version=1.1.0&request=GetFeature&typeName=` + 'AMNS:amns_phase1_4578_ror_final' + '&maxFeatures=2000&outputFormat=application/json&srsname=EPSG:3857&CQL_FILTER=' + query,
        format: new GeoJSON(),
        wrapX: false,
      });
      var style = new Style({
        stroke: new Stroke({
          color: 'black',
          // lineDash: [pLayer.linedash],
          width: 0.2
        }),
        fill: new Fill({
          color: 'rgba(20, 87, 16,0.56)',
        }),
      });
      var vectorparcelextend = new VectorLayer({
        source: layerData,
        style: style
      });
      this.lamsmap.addLayer(vectorparcelextend);

      vectorparcelextend.setVisible(true);

      vectorparcelextend.setZIndex(this.layerList.length + 1);
      vectorparcelextend.set('name', 'AMNS:amns_phase1_4578_ror_final');
      this.dlcForest.push(vectorparcelextend);
      // vectorparcelextend.getSource()?.on('addfeature', (e: any) => {
      //   this.lamsmap.getView().fit(layerData.getExtent(),{duration:3000});
      // });
    } else {
      if (e.target.checked != true) {
        for (let i = (this.dlcForest.length - 1); i >= 0; i--) {
          if (this.dlcForest[i].get('name') == 'AMNS:amns_phase1_4578_ror_final') {
            this.lamsmap.removeLayer(this.dlcForest[i]);
            this.dlcForest.splice(i, 1);
          }
        }
      }
    }
  }
  showPhase(e: any) {
    this.villageWiseKhataData = [];
    this.getPlotValue = '';
    if (e.target.value != '0' && e.target.value == 'Phase 1') {
      for (let j = (this.landClassData.length - 1); j >= 0; j--) {
        if (this.landClassData[j].get('name') == 'AMNS:amns_phase1_4578_ror_final') {
          this.lamsmap.removeLayer(this.landClassData[j]);
          this.landClassData.splice(j, 1);
        }
      }
      for (let j = (this.plotData.length - 1); j >= 0; j--) {
        this.lamsmap.removeLayer(this.plotData[j]);
        this.plotData.splice(j, 1);
      }
      this.queryData = [];
      jQuery('#' + this.landClassid).prop('checked', false);
      for (let j = (this.villageData.length - 1); j >= 0; j--) {
        this.lamsmap.removeLayer(this.villageData[j]);
        this.villageData.splice(j, 1);
      }

      this.showLandClassification = e.target.value;
      let phaseCnt = 0;
      for (let i = 0; i < this.layerList.length; i++) {
        if (this.layerList[i].values_.name == 'AMNS:phase1_aoi_revised_4578') {
          phaseCnt = 0;
          break;
        }
        if (this.layerList[i].values_.name != 'AMNS:phase1_aoi_revised_4578') {
          phaseCnt = 1;
        }
      }
      if (phaseCnt != 0) {
        this._notification.showWarning("Please first add AOI Village Boundary : Phase1");
        e.target.value = '0';
      }
      this._apiService.GetPhaseWiseVillage(this.showLandClassification).subscribe(data => {
        // console.log(data);
        this.phaseWiseVillage = data;
      });
      for (let j = (this.khataData.length - 1); j >= 0; j--) {
        this.lamsmap.removeLayer(this.khataData[j]);
        this.khataData.splice(j, 1);
      }
    }
    if (e.target.value != '0' && e.target.value == 'Phase 2') {
      for (let j = (this.landClassData.length - 1); j >= 0; j--) {
        if (this.landClassData[j].get('name') == 'AMNS:amns_phase1_4578_ror_final') {
          this.lamsmap.removeLayer(this.landClassData[j]);
          this.landClassData.splice(j, 1);
        }
      }
      for (let j = (this.plotData.length - 1); j >= 0; j--) {
        this.lamsmap.removeLayer(this.plotData[j]);
        this.plotData.splice(j, 1);
      }
      this.queryData = [];
      jQuery('#' + this.landClassid).prop('checked', false);
      for (let j = (this.villageData.length - 1); j >= 0; j--) {
        this.lamsmap.removeLayer(this.villageData[j]);
        this.villageData.splice(j, 1);
      }

      this.showLandClassification = e.target.value;
      let phaseCnt = 0;
      for (let i = 0; i < this.layerList.length; i++) {
        if (this.layerList[i].values_.name == 'AMNS:phase2_aoi_revised') {
          phaseCnt = 0;
          break;
        }
        if (this.layerList[i].values_.name != 'AMNS:phase2_aoi_revised') {
          phaseCnt = 1;
        }
      }
      if (phaseCnt != 0) {
        this._notification.showWarning("Please first add AOI Village Boundary : Phase2");
        e.target.value = '0';
      }
      this._apiService.GetPhaseWiseVillage(this.showLandClassification).subscribe(data => {
        // console.log(data);
        this.phaseWiseVillage = data;
      });
      for (let j = (this.khataData.length - 1); j >= 0; j--) {
        this.lamsmap.removeLayer(this.khataData[j]);
        this.khataData.splice(j, 1);
      }
    }
    if (e.target.value == '0') {
      this.showLandClassification = e.target.value;
    }
  }
  getLandClassification(e: any) {
    for (let j = (this.landClassData.length - 1); j >= 0; j--) {
      if (this.landClassData[j].get('name') == 'AMNS:amns_phase1_4578_ror_final') {
        this.lamsmap.removeLayer(this.landClassData[j]);
        this.landClassData.splice(j, 1);
      }
    }
    if (e.target.checked == true) {
      this.landClassid = e.target.id;
      var plotLayerCnt = 0;
      this.layerList.map(item => {
        if (item.values_.name == 'AMNS:amns_phase1_4578_ror_final') {
          if (this.showLandClassification == 'Phase 1') {
            plotLayerCnt = 1;
            if (e.target.value == "Ownership") {
              this.queryData = [
                { type: 'Government', stroke: 'black', fill: '#f7c163', width: 0.2, img: 'ownership01.png' },
                { type: 'Private', stroke: 'black', fill: '#8abef2', width: 0.2, img: 'ownership03.png' },
                { type: 'Forest', stroke: 'black', fill: '#76ba6c', width: 0.2, img: 'ownership02.png' },
              ];
              this.queryData.map((qItem: any) => {
                let query = `dept_ownership='${qItem.type}'`
                let layerData = new VectorSource({
                  url: `${GEOSERVER_WFS_URL}?service=WFS&version=1.1.0&request=GetFeature&typeName=` + 'AMNS:amns_phase1_4578_ror_final' + '&maxFeatures=2000&outputFormat=application/json&srsname=EPSG:3857&CQL_FILTER=' + query,
                  format: new GeoJSON(),
                  wrapX: false,
                });
                var style = new Style({
                  stroke: new Stroke({
                    color: qItem.stroke,
                    // lineDash: [pLayer.linedash],
                    width: qItem.width
                  }),
                  fill: new Fill({
                    color: qItem.fill,
                  }),
                });
                var vectorparcelextend = new VectorLayer({
                  source: layerData,
                  style: style
                });
                this.lamsmap.addLayer(vectorparcelextend);

                vectorparcelextend.setVisible(true);

                vectorparcelextend.setZIndex(this.layerList.length + 1);
                vectorparcelextend.set('name', 'AMNS:amns_phase1_4578_ror_final');
                this.landClassData.push(vectorparcelextend);
              });

              let wmslayerData = new Tile({
                source: new TileWMS({
                  url: GEOSERVER_WMS_URL,
                  params: {
                    TILED: true,
                    STYLES: '',
                    LAYERS: 'AMNS:amns_phase1_plot_blank',
                  },
                  serverType: 'geoserver',
                  crossOrigin: 'anonymous'
                })
              });
              wmslayerData.set('name', 'AMNS:amns_phase1_4578_ror_final');
              wmslayerData.setZIndex(this.layerList.length + 1);
              this.lamsmap.addLayer(wmslayerData);
              this.landClassData.push(wmslayerData);

            }
            if (e.target.value == "Land Class") {
              this.queryData = [
                { type: 'Communal', stroke: 'black', fill: '#f52f56', width: 0.2, img: "landclass01.png" },
                { type: 'Departmental', stroke: 'black', fill: '#537efc', width: 0.2, img: "landclass02.png" },
                { type: 'Leasable', stroke: 'black', fill: '#F4A460', width: 0.2, img: "landclass03.png" },
                { type: 'Forest', stroke: 'black', fill: '#93a66d', width: 0.2, img: "landclass04.png" },
                { type: 'Private', stroke: 'black', fill: '#f7926d', width: 0.2, img: "landclass05.png" },
                { type: 'Gochara', stroke: 'black', fill: '#9385a6', width: 0.2, img: "landclass06.png" },
              ];
              this.queryData.map((qItem: any) => {
                let query = `land_class='${qItem.type}'`
                let layerData = new VectorSource({
                  url: `${GEOSERVER_WFS_URL}?service=WFS&version=1.1.0&request=GetFeature&typeName=` + 'AMNS:amns_phase1_4578_ror_final' + '&maxFeatures=2000&outputFormat=application/json&srsname=EPSG:3857&CQL_FILTER=' + query,
                  format: new GeoJSON(),
                  wrapX: false,
                });
                var style = new Style({
                  stroke: new Stroke({
                    color: qItem.stroke,
                    // lineDash: [pLayer.linedash],
                    width: qItem.width
                  }),
                  fill: new Fill({
                    color: qItem.fill,
                  }),
                });
                var vectorparcelextend = new VectorLayer({
                  source: layerData,
                  style: style
                });
                this.lamsmap.addLayer(vectorparcelextend);

                vectorparcelextend.setVisible(true);

                vectorparcelextend.setZIndex(this.layerList.length + 1);
                vectorparcelextend.set('name', 'AMNS:amns_phase1_4578_ror_final');
                this.landClassData.push(vectorparcelextend);
              });

              let wmslayerData = new Tile({
                source: new TileWMS({
                  url: GEOSERVER_WMS_URL,
                  params: {
                    TILED: true,
                    STYLES: '',
                    LAYERS: 'AMNS:amns_phase1_plot_blank',
                  },
                  serverType: 'geoserver',
                  crossOrigin: 'anonymous'
                })
              });
              wmslayerData.set('name', 'AMNS:amns_phase1_4578_ror_final');
              wmslayerData.setZIndex(this.layerList.length + 1);
              this.lamsmap.addLayer(wmslayerData);
              this.landClassData.push(wmslayerData);

            }
            if (e.target.value == "Land Progress") {
              this.queryData = [
                { type: 'Not started', stroke: 'black', fill: '#fa7e75', width: 0.2, img: "landprogress01.png" },
                { type: 'Initial', stroke: 'black', fill: '#6098d1', width: 0.2, img: "landprogress02.png" },
                { type: 'Processing', stroke: 'black', fill: '#dba181', width: 0.2, img: "landprogress03.png" },
                { type: 'Final', stroke: 'black', fill: '#6bb567', width: 0.2, img: "landprogress04.png" },
              ];
              this.queryData.map((qItem: any) => {
                let query = `acq_stage='${qItem.type}'`
                let layerData = new VectorSource({
                  url: `${GEOSERVER_WFS_URL}?service=WFS&version=1.1.0&request=GetFeature&typeName=` + 'AMNS:amns_phase1_4578_ror_final' + '&maxFeatures=2000&outputFormat=application/json&srsname=EPSG:3857&CQL_FILTER=' + query,
                  format: new GeoJSON(),
                  wrapX: false,
                });
                var style = new Style({
                  stroke: new Stroke({
                    color: qItem.stroke,
                    // lineDash: [pLayer.linedash],
                    width: qItem.width
                  }),
                  fill: new Fill({
                    color: qItem.fill,
                  }),
                });
                var vectorparcelextend = new VectorLayer({
                  source: layerData,
                  style: style
                });
                this.lamsmap.addLayer(vectorparcelextend);

                vectorparcelextend.setVisible(true);

                vectorparcelextend.setZIndex(this.layerList.length + 1);
                vectorparcelextend.set('name', 'AMNS:amns_phase1_4578_ror_final');
                this.landClassData.push(vectorparcelextend);
              });

              let wmslayerData = new Tile({
                source: new TileWMS({
                  url: GEOSERVER_WMS_URL,
                  params: {
                    TILED: true,
                    STYLES: '',
                    LAYERS: 'AMNS:amns_phase1_plot_blank',
                  },
                  serverType: 'geoserver',
                  crossOrigin: 'anonymous'
                })
              });
              wmslayerData.set('name', 'AMNS:amns_phase1_4578_ror_final');
              wmslayerData.setZIndex(this.layerList.length + 1);
              this.lamsmap.addLayer(wmslayerData);
              this.landClassData.push(wmslayerData);
            }
            if (e.target.value == "None") {
              this.queryData = [];
            }
          }
        }
      });
      if (plotLayerCnt == 0) {
        e.target.checked = false;
        this._notification.showWarning("plese first select/add  AOI Plot Boundary : Phase1 Layer");
      }
    }
  }
  showVillage(e: any) {
    this.villageWiseKhata = e.target.value;
    if (e.target.value != '0') {
      let cnt = 0;
      for (let i = 0; i < this.layerList.length; i++) {
        if (this.layerList[i].values_.name == 'AMNS:amns_phase1_4578_ror_final') {
          cnt = 1;
          break;
        }
        if (this.layerList[i].values_.name != 'AMNS:amns_phase1_4578_ror_final') {
          cnt = 0;
        }
      }
      if (cnt != 0) {
        for (let j = (this.villageData.length - 1); j >= 0; j--) {
          this.lamsmap.removeLayer(this.villageData[j]);
          this.villageData.splice(j, 1);
        }
        for (let j = (this.khataData.length - 1); j >= 0; j--) {
          this.lamsmap.removeLayer(this.khataData[j]);
          this.khataData.splice(j, 1);
        }
        let query = `village='${e.target.value}'`
        let layerData = new VectorSource({
          url: `${GEOSERVER_WFS_URL}?service=WFS&version=1.1.0&request=GetFeature&typeName=` + 'AMNS:amns_phase1_4578_ror_final' + '&maxFeatures=2000&outputFormat=application/json&srsname=EPSG:3857&CQL_FILTER=' + query,
          format: new GeoJSON(),
          wrapX: false,
        });
        var style = new Style({
          stroke: new Stroke({
            color: 'blue',
            // lineDash: [pLayer.linedash],
            width: 0.5
          }),
          fill: new Fill({
            color: 'rgba(237,81,9,0.45)',
          }),
        });
        var vectorparcelextend = new VectorLayer({
          source: layerData,
          style: style
        });
        this.lamsmap.removeLayer(vectorparcelextend);
        this.lamsmap.addLayer(vectorparcelextend);

        vectorparcelextend.setVisible(true);

        vectorparcelextend.setZIndex(this.layerList.length + 1);
        // vectorparcelextend.set('name', 'AMNS:amns_phase1_4578_ror_final');
        this.villageData.push(vectorparcelextend);
        vectorparcelextend.getSource()?.on('addfeature', (e: any) => {
          this.lamsmap.getView().fit(layerData.getExtent(), { duration: 3000, maxZoom: 16 });
        });
        if (this.villageWiseKhata != '0' && this.villageWiseKhata != 'Phase 2') {
          this._apiService.getkhatanosForMap(this.showLandClassification, this.villageWiseKhata).subscribe(data => {
            // console.log(data);
            this.villageWiseKhataData = data;
          })
        }
      } else {
        e.target.value = '0';
        this._notification.showWarning("plese first select/add  AOI Plot Boundary : Phase1 Layer");
      }
    }
  }
  showKhata(e: any) {
    if (this.villageWiseKhata == '0') {
      this._notification.showWarning("Please first select Village");
    }
    if (e.target.value != '0') {
      for (let j = (this.khataData.length - 1); j >= 0; j--) {
        this.lamsmap.removeLayer(this.khataData[j]);
        this.khataData.splice(j, 1);
      }
      let query = `village='${this.villageWiseKhata}' AND khata_no='${e.target.value}'`
      let layerData = new VectorSource({
        url: `${GEOSERVER_WFS_URL}?service=WFS&version=1.1.0&request=GetFeature&typeName=` + 'AMNS:amns_phase1_4578_ror_final' + '&maxFeatures=2000&outputFormat=application/json&srsname=EPSG:3857&CQL_FILTER=' + query,
        format: new GeoJSON(),
        wrapX: false,
      });
      var style = new Style({
        stroke: new Stroke({
          color: '#730a17',
          // lineDash: [pLayer.linedash],
          width: 0.5
        }),
        fill: new Fill({
          color: 'rgba(33,47,204,0.45)',
        }),
      });
      var vectorparcelextend = new VectorLayer({
        source: layerData,
        style: style
      });
      this.lamsmap.removeLayer(vectorparcelextend);
      this.lamsmap.addLayer(vectorparcelextend);

      vectorparcelextend.setVisible(true);

      vectorparcelextend.setZIndex(this.layerList.length + 1);
      // vectorparcelextend.set('name', 'AMNS:amns_phase1_4578_ror_final');
      this.khataData.push(vectorparcelextend);
      vectorparcelextend.getSource()?.on('addfeature', (e: any) => {
        this.lamsmap.getView().fit(layerData.getExtent(), { duration: 3000, maxZoom: 17 });
      });
    }
  }
  showPlot() {
    if (this.showLandClassification != '0') {
      if (this.villageWiseKhata != undefined && this.villageWiseKhata != null && this.villageWiseKhata != '') {
        if (this.getPlotValue != undefined || null || '') {
          for (let j = (this.plotData.length - 1); j >= 0; j--) {
            this.lamsmap.removeLayer(this.plotData[j]);
            this.plotData.splice(j, 1);
          }

          let query = `village='${this.villageWiseKhata}' AND plot_no='${this.getPlotValue}'`
          let layerData = new VectorSource({
            url: `${GEOSERVER_WFS_URL}?service=WFS&version=1.1.0&request=GetFeature&typeName=` + 'AMNS:amns_phase1_4578_ror_final' + '&maxFeatures=2000&outputFormat=application/json&srsname=EPSG:3857&CQL_FILTER=' + query,
            format: new GeoJSON(),
            wrapX: false,
          });
          var style = new Style({
            stroke: new Stroke({
              color: '#730a17',
              // lineDash: [pLayer.linedash],
              width: 0.5
            }),
            fill: new Fill({
              color: 'rgba(3,128,133,0.45)',
            }),
          });
          var vectorparcelextend = new VectorLayer({
            source: layerData,
            style: style
          });
          this.lamsmap.removeLayer(vectorparcelextend);
          this.lamsmap.addLayer(vectorparcelextend);

          vectorparcelextend.setVisible(true);

          vectorparcelextend.setZIndex(this.layerList.length + 1);
          this.plotData.push(vectorparcelextend);
          vectorparcelextend.getSource()?.on('addfeature', (e: any) => {
            this.lamsmap.getView().fit(layerData.getExtent(), { duration: 3000, maxZoom: 17 });
          });
          this.getPlotValue = '';
        } else {
          if (this.getPlotValue == undefined || null || '') {
            this._notification.showError("Please first give plot value");
            this.getPlotValue = '';
          }
        }
      } else {
        if (this.villageWiseKhata == undefined || this.villageWiseKhata == null || this.villageWiseKhata == '') {
          this._notification.showError("Please first select village");
          this.getPlotValue = '';
        }
        if (this.villageWiseKhata == null) {
          this._notification.showError("Please first select village");
          this.getPlotValue = '';
        }
        if (this.villageWiseKhata == '') {
          this._notification.showError("Please first select village");
          this.getPlotValue = '';
        }
      }
    } else {
      if (this.showLandClassification == '0') {
        this._notification.showError("Please first select phase");
        this.getPlotValue = '';
      }
    }
  }
  //reposition the base map into deafult 
  reCenterzoom() {
    this.lamsmap.setView(new View({
      center: proj.fromLonLat([86.6664, 20.3617]),
      zoom: 12.6,
      // maxZoom: 16
    }));
  }
  getKMLFile(event: any) {
    // console.log(event.target.files[0]);
    // console.log(event.target.files[0].name);

    //get the uploded KML file.
    this.kmlFile = event.target.files[0];
  }
  //Add the uploaded KML file.
  addKMLFile() {
    //in every every click of show on map remove file from template
    this.myInputVariable.nativeElement.value = "";
    var _this = this;
    if (this.kmlFile != undefined) {
      //get KML file value and show on base map
      var reader = new FileReader();
      reader.onload = function () {
        var style = new Style({
          stroke: new Stroke({
            color: 'red',
            // lineDash: [pLayer.linedash],
            width: 0.1
          }),
          fill: new Fill({
            color: 'red',
          }),
        });

        var vectorLayer = new VectorSource({
          url: reader.result as string,
          format: new KML({
            extractStyles: true
          })
        });

        var kmlVectorLayer = new VectorLayer({
          source: vectorLayer,
          style: style
        });
        _this.lamsmap.addLayer(kmlVectorLayer);
        _this.kmlData.push(kmlVectorLayer);
        kmlVectorLayer.getSource()?.on('addfeature', (e: any) => {
          _this.lamsmap.getView().fit(vectorLayer.getExtent(), { duration: 3000, maxZoom: 17 });
        });
      }
      reader.readAsDataURL(this.kmlFile);
    } else {
      if (this.kmlFile == undefined || null || '') {
        this._notification.showError("Please first choose KML file");
      }
    }
  }
  //remove the uploaded KML file.
  removeKMLFile() {
    for (let j = (this.kmlData.length - 1); j >= 0; j--) {
      //remove KML file from base map.
      this.lamsmap.removeLayer(this.kmlData[j]);
      this.kmlData.splice(j, 1);
    }
  }
}
