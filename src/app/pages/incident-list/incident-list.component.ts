import { IncidentService } from './../../modules/services/incident.service';
import { Component, OnInit } from '@angular/core';
import { SharedModule } from "../../_metronic/shared/shared.module";
import { Incident } from 'src/app/modules/auth/models/incident.model';
import { CommonModule } from '@angular/common';
import { catchError, of, tap } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-incident-list',
  standalone: true,
  imports: [SharedModule,CommonModule],
  templateUrl: './incident-list.component.html',
  styleUrl: './incident-list.component.scss'
})
export class IncidentListComponent implements OnInit{
  formGroup: FormGroup;
    allCustomers: Incident[];
    incidentForm!:FormGroup;

    constructor(   public incidentService:IncidentService) {
 this.formGroup = new FormGroup({
        // customerId:
        cookBookName:new FormControl(),
        categoryName: new FormControl(),
        mobileNumber: new FormControl(),
        priority: new FormControl(),


      })
    }
      allIncident: Incident[];

      ngOnInit():void{
        this.searchIncedent("");
      }

      addIncident():void{
        // addIncident(): void {
          console.log("Welcome to Add Incident");

          if (this.incidentForm.valid) {
                  // const newMember = this.incidentForm.value;  // Get form data
                  // console.log('New Incident:', newMember);
               // Call the addCustomer service method to send data to the API
              this.incidentService.addIncident(this.incidentForm.value).subscribe(
                (response) => {
                  console.log('Member added successfully:', response);

                  // Reset the form and close the modal
                  this.incidentForm.reset();
                  const modalElement = document.getElementById('newIncidentModal');
                  const modal = bootstrap.Modal.getInstance(modalElement as Element);
                  modal?.hide();
                },
                (error) => {
                  console.error('Error adding member:', error);
                }
              );

        }
        }

        searchIncedent(searchText:string){
          this.incidentService.searchIncident(searchText).pipe(
            tap((res) => {
              // console.log("ResIncident Data",res);
              this.allIncident= res.data;
        }),
            catchError((errorMessage) => {
              console.log(errorMessage,"X");
              return of();
            }),
          ).subscribe(res =>console.log(res,"!!"));

        }
      }
