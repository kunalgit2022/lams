import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MasterheaderComponent } from './masterheader/masterheader.component';
import { MasterfooterComponent } from './masterfooter/masterfooter.component';
import { AcquisionprocessComponent } from './acquisionprocess/acquisionprocess.component';
import { LandabstractComponent } from './landabstract/landabstract.component';
import { MapviewComponent } from './mapview/mapview.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LanddetailsComponent } from './landdetails/landdetails.component';
import { LeasecaseComponent } from './leasecase/leasecase.component';
import { AcquisitionalienationComponent } from './acquisitionalienation/acquisitionalienation.component';
import { LandacquisitionprogressComponent } from './landacquisitionprogress/landacquisitionprogress.component';
import { LandacquisitionprogressviewComponent } from './landacquisitionprogressview/landacquisitionprogressview.component';
import { TroubleticketsComponent } from './troubletickets/troubletickets.component';
import { ManageuserComponent } from './manageuser/manageuser.component';
import { ManageroleComponent } from './managerole/managerole.component';
import { LaprocessComponent } from './laprocess/laprocess.component';
import { LahistoryComponent } from './lahistory/lahistory.component';
import { ApiService } from './core/api.service';
import { TokenIntercepterService } from './core/token-intercepter.service';
import { AuthGuard } from './core/auth.guard';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SidebarComponent,
    MasterheaderComponent,
    MasterfooterComponent,
    AcquisionprocessComponent,
    LandabstractComponent,
    MapviewComponent,
    DashboardComponent,
    LanddetailsComponent,
    LeasecaseComponent,
    AcquisitionalienationComponent,
    LandacquisitionprogressComponent,
    LandacquisitionprogressviewComponent,
    TroubleticketsComponent,
    ManageuserComponent,
    ManageroleComponent,
    LaprocessComponent,
    LahistoryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    DataTablesModule,
    BrowserAnimationsModule,
    FormsModule,
    NgMultiSelectDropDownModule.forRoot(),
    HttpClientModule,
    ToastrModule.forRoot(
      {
        timeOut: 5000,
        positionClass: 'toast-top-center',
        preventDuplicates: true,
      }
    )
  ],
  providers: [ApiService, AuthGuard, { provide: HTTP_INTERCEPTORS, useClass: TokenIntercepterService, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
