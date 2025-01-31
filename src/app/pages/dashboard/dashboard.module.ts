import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { CustomerListComponent } from '../customer-list/customer-list.component';
// import { CustomerListComponent } from "../customer-list/customer-list.component";
// import { SearchComponent } from 'src/app/_metronic/kt/components';
import { SearchResultInnerComponent } from 'src/app/_metronic/partials/layout/extras/dropdown-inner/search-result-inner/search-result-inner.component';
// import { KeeniconComponent } from 'src/app/_metronic/shared/keenicon/keenicon.component';
import { SharedModule } from 'src/app/_metronic/shared/shared.module';
import { IncidentListComponent } from "../incident-list/incident-list.component";
import { SearchComponent } from 'src/app/_metronic/layout/components/aside/tabs/projects-tab/search/search.component';

// KeeniconComponent
// D:\2025\newprojects\focus_ui\src\app\_metronic\shared\shared.module.ts
@NgModule({
    declarations: [DashboardComponent,],
    imports: [
        CommonModule,
        SharedModule,
        CustomerListComponent,
        RouterModule.forChild([
            {
                path: '',
                component: DashboardComponent,
            },
            {
                path: '',
                component: SearchComponent
            },
            {
                path: '',
                component: SearchResultInnerComponent
            }
        ]),
        IncidentListComponent
    ],
})
export class DashboardModule { }
