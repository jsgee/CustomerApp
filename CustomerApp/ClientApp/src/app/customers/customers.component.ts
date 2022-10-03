import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {MatTable, MatTableDataSource } from '@angular/material/table';
import { startWith, tap } from 'rxjs/operators';
import { Customer, CustomerColumns } from '../models/customer';
import { CustomerService } from '../services/customer.service';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

//const ELEMENT_DATA: PeriodicElement[] = [
//  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
//  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
//  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
//  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
//  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
//  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
//  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
//  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
//  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
//  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
//  { position: 11, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
//];

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})


export class CustomersComponent implements OnInit {

  constructor(private customerService: CustomerService,
    private fb: FormBuilder,
    private _formBuilder: FormBuilder) { }


  displayedColumns: string[] = ['id', 'firstName', 'lastName', 'email', 'created', 'updated']
  dataSource: any = new MatTableDataSource<Customer>();
  customersData!: Customer[];
  isLoading = true;
  pageNumber: number = 1;
  CustomersForm!: FormGroup;
  isEditableNew: boolean = true;
 

  ngOnInit(): void {
    this.getCustomers();
    this.CustomersForm = this._formBuilder.group({
      CustomerRows: this._formBuilder.array([])
    });

    this.CustomersForm = this.fb.group({
      CustomerRows: this.fb.array(this.customersData.map(val => this.fb.group({
        id: new FormControl(val.id),
        firstName: new FormControl(val.firstName),
        lastName: new FormControl(val.lastName),
        email: new FormControl(val.email),
        created: new FormControl(val.created),
        updated: new FormControl(val.updated),
        action: new FormControl('existingRecord'),
        isEditable: new FormControl(true),
        isNewRow: new FormControl(false),
      })
      )) //end of fb array
    }); // end of form group creation
    this.isLoading = false;
    this.dataSource = new MatTableDataSource((this.CustomersForm.get('CustomerRows') as FormArray).controls);


    }

    //Custom filter according to name column
    // this.dataSource.filterPredicate = (data: {name: string}, filterValue: string) =>
    //   data.name.trim().toLowerCase().indexOf(filterValue) !== -1;
  

  getCustomers() {
    this.customerService.getCustomers().subscribe((res: any) => {
      this.customersData = res;
     //this.dataSource.data = res;
    });
  }
   editElement(element: any) {

    element.disabled = false;
    for (let item of this.dataSource) {
      if (item.symbol !== element.symbol) {
        item.disabled = true;
      }
    }
  }
  editRow(row: Customer) {
    if (row.id === 0) {
      this.customerService.addCustomer(row).subscribe(() => {
        row.isEdit = false;
        this.getCustomers();
      });
    } else {
      this.customerService.updateCustomer(row).subscribe(() => {
        row.isEdit = false
        this.getCustomers();
      });
    }
  }


  @ViewChild('table')
    table!: MatTable<Customer>;
  AddNewRow() {
    // this.getBasicDetails();
    const control = this.CustomersForm.get('CustomerRows') as FormArray;
    control.insert(0, this.initiateCustomersForm());
    this.dataSource = new MatTableDataSource(control.controls)
    // control.controls.unshift(this.initiateVOForm());
    // this.openPanel(panel);
    // this.table.renderRows();
    // this.dataSource.data = this.dataSource.data;
  }

  // this function will enabled the select field for editd
  EditSVO(customerFormElement:any, i:number) {

    // VOFormElement.get('VORows').at(i).get('name').disabled(false)
   customerFormElement.get('CustomerRows').at(i).get('isEditable').patchValue(false);
    // this.isEditableNew = true;

  }

  // On click of correct button in table (after click on edit) this method will call
  SaveVO(customerFormELement: any, i: number) {
    // alert('SaveVO')
    customerFormELement.get('CustomerRows').at(i).get('isEditable').patchValue(true);
  }

  // On click of cancel button in the table (after click on edit) this method will call and reset the previous data
  CancelSVO(customerFormElement: any, i: number) {
    customerFormElement.get('CustomerRows').at(i).get('isEditable').patchValue(true);
  }

  initiateCustomersForm(): FormGroup {
    return this.fb.group({

      id: new FormControl(234),
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      email: new FormControl(''),
      action: new FormControl('newRecord'),
      isEditable: new FormControl(false),
      isNewRow: new FormControl(true),
    });
  }

}

