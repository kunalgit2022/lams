import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AcquisionprocessComponent } from './acquisionprocess/acquisionprocess.component';
import { LandabstractComponent } from './landabstract/landabstract.component';
import { MapviewComponent } from './mapview/mapview.component';
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
import { AuthGuard } from './core/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'acquisionprocess',
    component: AcquisionprocessComponent,
    canActivate:[AuthGuard]
  },
  {
    path: 'landabstract',
    component: LandabstractComponent,
    canActivate:[AuthGuard]
  },
  {
    path: 'mapview',
    component: MapviewComponent,
    canActivate:[AuthGuard]
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate:[AuthGuard]
  },
  {
    path: 'landdetails',
    component: LanddetailsComponent,
    canActivate:[AuthGuard]
  },
  {
    path: 'leasecase',
    component: LeasecaseComponent,
    canActivate:[AuthGuard]
  },
  {
    path: 'acquisitionalienation',
    component: AcquisitionalienationComponent,
    canActivate:[AuthGuard]
  },
  {
    path: 'landacquisitionprogress',
    component: LandacquisitionprogressComponent,
    canActivate:[AuthGuard]
  },
  {
    path: 'landacquisitionprogressview',
    component: LandacquisitionprogressviewComponent,
    canActivate:[AuthGuard]
  },
  {
    path: 'troubletickets',
    component: TroubleticketsComponent,
    canActivate:[AuthGuard]
  },
  {
    path: 'manageuser',
    component: ManageuserComponent
  },
  {
    path: 'managerole',
    component: ManageroleComponent
  },
  {
    path: 'laprocess',
    component: LaprocessComponent
  },
  {
    path: 'lahistory',
    component: LahistoryComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
