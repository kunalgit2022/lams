import { query } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }
  baseurl = environment.baseurl;

  public getVillages(): Observable<any> {
    return this.http.get(`${this.baseurl}api/v1/village`);
  }
  public phasewisevillage(): Observable<any> {
    return this.http.get(this.baseurl + 'api/v1/phasewisevillage/Phase 1');
  }
  public phasewiselandclass(data: any): Observable<any> {
    return this.http.get(this.baseurl + 'api/v1/landclass/' + data);
  }
  public laProcess(data: any): Observable<any> {
    return this.http.get(this.baseurl + 'api/v1/stage/' + data);
  }
  getLandClass(): Observable<any> {
    return this.http.get(`${this.baseurl}api/v1/landclass`);
  }
  pieChartGetAll(phaseData: any, ahData: any): Observable<any> {
    return this.http.get(`${this.baseurl}api/v1/dashboardpiechart?phase=${phaseData}&munit=${ahData}`);
  }
  landClassWiseProgrss(phaseData: any, ahData: any): Observable<any> {
    return this.http.get(`${this.baseurl}api/v1/dashboardlandprogress?phase=${phaseData}&munit=${ahData}`);
  }
  VillageWiseLandAbstract(phaseData: any, ahData: any): Observable<any> {
    return this.http.get(`${this.baseurl}api/v1/dashboardvillageabstract?phase=${phaseData}&munit=${ahData}`);
  }
  getKhataNos(phaseNo: any, village: any, owner: any, landclass: any): Observable<any> {
    var query = "phase=" + phaseNo + "&village=" + village + "&owner=" + owner + "&landclass=" + landclass;
    return this.http.get(`${this.baseurl}api/v1/getkhatanos?` + query);
  }
  landInformation(phaseNo: any, village: any, owner: any, khata: any, landcalss: any): Observable<any> {
    return this.http.get(`${this.baseurl}api/v1/landdetails?phase=${phaseNo}&village=${village}&ownership=${owner}&landclass=${landcalss}&khatano=${khata}&kissam=0&operator=0&reqarea=0&forest=0`);
  }
  GetPhaseWiseVillage(data: any): Observable<any> {
    return this.http.get(`${this.baseurl}api/v1/phasewisevillage/${data}`)
  }
  fetchLandDetails(phase: any, vill: any, landClass: any): Observable<any> {
    return this.http.get(`${this.baseurl}api/v1/phase1plotsbyvillagelandclass/${phase}/${vill}/${landClass}`);
  }
  getkhatanosForMap(phase: any, village: any): Observable<any> {
    return this.http.get(`${this.baseurl}api/v1/getkhatanos?phase=${phase}&village=${village}&owner=0&landclass=0`)
  }
  uploadDocumentAndGetFileNameResponse(vill: any, lClass: any, file: any): Observable<any> {
    return this.http.post(`${this.baseurl}uploadFile?fname=${vill}-${lClass}-lcdoc`, file);
  }
  createLeaseCaseForVillageAndLandclass(data: any): Observable<any> {
    return this.http.post(`${this.baseurl}api/v1/lcvillage`, data);
  }
  updatePlotWiseLeaseCaseCheckedPlots(phase: any, gid: any, data: any): Observable<any> {
    return this.http.put(`${this.baseurl}api/v1/updateplotleasecase/${phase}/${gid}`, data);
  }
  rolePermissionList(): Observable<any> {
    return this.http.get(`${this.baseurl}api/v1/primarylink`);
  }
  bindLeaseCaseAsPerVillageAndLandclass(villId: any, landClass: any): Observable<any> {
    return this.http.get(`${this.baseurl}api/v1/getleasecase/${villId}/${landClass}`);
  }
  getPlotDetails(phase: any, village: any, landClass: any, leaseCaseNo: any): Observable<any> {
    return this.http.get(`${this.baseurl}api/v1/phase1plotsbyvillagelandclasslease/${phase}/${village}/${landClass}/${leaseCaseNo}`);
  }
  AddRoleManageMent(data: any): Observable<any> {
    return this.http.post(`${this.baseurl}api/v1/role/`, data);
  }
  AddRolepermission(data: any): Observable<any> {
    return this.http.post(`${this.baseurl}api/v1/permission`, data);
  }
  findAllroleList(): Observable<any> {
    return this.http.get(`${this.baseurl}api/v1/role`);
  }
  GetAllPermissionList(data: any): Observable<any> {
    return this.http.get(`${this.baseurl}api/v1/permissionbyroleid?roleid=${data}`);
  }
  deleteRole(data: any): Observable<any> {
    return this.http.delete(`${this.baseurl}api/v1/deleterole?roleid=${data}`);
  }
  bindingStageCodeToDropdown(landClass: any): Observable<any> {
    return this.http.get(`${this.baseurl}api/v1/stage/${landClass}`);
  }
  removePermission(data: any): Observable<any> {
    return this.http.get(`${this.baseurl}api/v1/removepermission?roleid=${data}`);
  }
  UploadDocumentAndGetFileNameReasponseForUpdateLeaseCase(leaseCase: any, stage: any, landClass: any, village: any, file: any): Observable<any> {
    return this.http.post(`${this.baseurl}uploadFile?fname=${leaseCase}-${stage}-${landClass}-${village}`, file);
  }
  updateStagesInLeaseAndVilageTable(villId: any, landClass: any, leaseCaseNo: any, data: any): Observable<any> {
    return this.http.put(`${this.baseurl}api/v1/lcupdate/${villId}/${landClass}/${leaseCaseNo}`, data);
  }
  updateStagesInRorTableByPlotId(Phase: any, plotId: any, data: any): Observable<any> {
    return this.http.put(`${this.baseurl}api/v1/updateplotwisestage/${Phase}/${plotId}`, data);
  }
  insertToHistoryTable(data: any): Observable<any> {
    return this.http.post(`${this.baseurl}api/v1/leasecasehistory`, data);
  }
  login(data: any): Observable<any> {
    return this.http.post(`${this.baseurl}api/auth/login`, data);
  }
  islogedIn() {
    return sessionStorage.getItem('token') != null;
  }
  getToken() {
    if (sessionStorage.getItem('token') != null) {
      return sessionStorage.getItem('token');
    } else {
      return null;
    }
  }
  findAlldepartment(): Observable<any> {
    return this.http.get(`${this.baseurl}api/v1/department`);
  }
  createuser(data: any): Observable<any> {
    return this.http.post(`${this.baseurl}api/auth/registerUser`, data);
  }
  findAllUser(): Observable<any> {
    return this.http.get(`${this.baseurl}api/auth/getuser`);
  }
  findStageDescripton(stage: any): Observable<any> {
    return this.http.get(`${this.baseurl}api/v1/findstage/${stage}`);
  }
  editUserj(data: any): Observable<any> {
    return this.http.get(`${this.baseurl}api/auth/user/${data}`);
  }
  deletUser(data: any): Observable<any> {
    return this.http.delete(`${this.baseurl}api/auth/user/${data}`);
  }
  updateUser(id:any,data: any): Observable<any> {
    return this.http.put(`${this.baseurl}api/auth/user/${id}`,data);
  }
}
