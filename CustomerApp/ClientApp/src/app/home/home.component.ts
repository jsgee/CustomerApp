import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Customer, CustomerColumns } from '../models/customer';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { CustomerService } from '../services/customer.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  displayedColumns: string[] = CustomerColumns.map((col) => col.key);
  columnsSchema: any = CustomerColumns;
  dataSource = new MatTableDataSource<Customer>();

  constructor(public dialog: MatDialog, private customerService: CustomerService, private changeDetectorRefs: ChangeDetectorRef) { }

  async ngOnInit() {
    await this.getCustomers();
  }



   getCustomers() {
     this.customerService.getCustomers().subscribe((res: any) => {
      this.dataSource.data = res;
      this.changeDetectorRefs.detectChanges();
    });
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
