import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Customer, CustomerColumns } from '../models/customer';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { CustomerService } from '../services/customer.service';
import { LuxonModule } from 'luxon-angular';
import { DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SessionStorageService } from '../services/session-storage.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  constructor(public dialog: MatDialog,
    private customerService: CustomerService,
    private sessionStorage: SessionStorageService,
    private changeDetectorRefs: ChangeDetectorRef,
    private datePipe: DatePipe,
    private fb: FormBuilder) {
      this.customerForm = this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', Validators.required]
      }); }

  customerForm: FormGroup;
  displayedColumns: string[] = CustomerColumns.map((col) => col.key);
  columnsSchema: any = CustomerColumns;
  dataSource = new MatTableDataSource<Customer>();
  showCustomerForm: boolean = false; 
   
  async ngOnInit() {
    await this.getCustomers();
  }

  getCustomers() {
    this.customerService.getCustomers().subscribe((res: Customer[]) => {
      res = this.setIsLastAddedRow(res);
      this.dataSource.data = res;
      this.changeDetectorRefs.detectChanges();
    });
  }

  addCustomer() {
    let newCustomer: Customer = {
      id: 0,
      firstName: this.customerForm.get("firstName")?.value,
      lastName: this.customerForm.get("lastName")?.value,
      email: this.customerForm.get("email")?.value
    };
    this.customerService.addCustomer(newCustomer).subscribe(() => {
      newCustomer.isEdit = false;
      this.customerForm.reset();
      this.showCustomerForm = false;
      this.unsetIsLastAddedRow();
      this.sessionStorage.setSessionItem("email", newCustomer.email);
      this.getCustomers();
    });
  }

  setIsLastAddedRow(customers: Customer[]): Customer[] {
    if (this.sessionStorage.length) {
      let lastAddedEmail = this.sessionStorage.getSessionItem("email");
      let lastAddedCustomer = customers.find(c => c.email === lastAddedEmail);
      if (lastAddedCustomer !== undefined) {
        lastAddedCustomer.isLastAddedRow = true;
      }
    }

    return customers;
  }

  unsetIsLastAddedRow(): void {
    let lastAddedCustomerEmail = this.sessionStorage.getSessionItem("email");
    let lastAddedCustomer = this.dataSource.data.find(c => c.email === lastAddedCustomerEmail);
    if (lastAddedCustomer !== undefined) {
      lastAddedCustomer.isLastAddedRow = false;
    }
    this.sessionStorage.clearSessionStorage();
  }

  editRow(row: Customer) {
      this.customerService.updateCustomer(row).subscribe(() => {
        row.isEdit = false
        this.getCustomers();
      });
  }

  addRow() {
    const newRow: Customer = {
      id: 0,
      firstName: '',
      lastName: '',
      email: '',
      isEdit: true
    };

    this.dataSource.data = [newRow, ... this.dataSource.data];

  }
}
