export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  created?: Date;
  updated?: Date;
  isEdit: boolean;
}

export const CustomerColumns = [
 
  {
    key: 'id',
    type: 'number',
    label: 'Customer Id',
    isEditable: false,
  },
  {
    key: 'firstName',
    type: 'text',
    label: 'First Name',
    isEditable: true,
  },
  {
    key: 'lastName',
    type: 'text',
    label: 'Last Name',
    isEditable: true,
  },
  {
    key: 'email',
    type: 'email',
    label: 'Email',
    isEditable: true,
  },
  {
    key: 'created',
    type: 'date',
    label: 'Created',
    isEditable: false,
  },
  {
    key: 'updated',
    type: 'date',
    label: 'Updated',
    isEditable: false,
  },
  {
    key: 'isEdit',
    type: 'isEdit',
    label: '',
    isEditable: true,
  },
];
