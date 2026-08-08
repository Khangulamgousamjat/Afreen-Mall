export interface StaffMember {
  staffId: number;
  username: string;
  name: string;
  role: string;
}

export const INITIAL_STAFF_LIST: StaffMember[] = [
  { staffId: 300000, username: 'Superkhan', name: 'Gous Khan', role: 'SUPER_ADMIN' },
  { staffId: 300001, username: 'manager1', name: 'Sanjay Gupta', role: 'STORE_MANAGER' },
  { staffId: 300002, username: 'pooja1', name: 'Pooja Sharma', role: 'CASHIER' },
  { staffId: 300003, username: 'vinayak1', name: 'Vinayak Shinde', role: 'CASHIER' },
  { staffId: 300004, username: 'babuji1', name: 'Babuji Namole', role: 'CASH_OFFICER' },
  { staffId: 300005, username: 'amit1', name: 'Amit Verma', role: 'ACCOUNTANT' },
  { staffId: 300006, username: 'auditor1', name: 'Rajesh Deshmukh', role: 'AUDITOR' },
  { staffId: 300010, username: 'rohan1', name: 'Rohan Kadam', role: 'CASHIER' },
  { staffId: 300011, username: 'sunita1', name: 'Sunita Pawar', role: 'CASHIER' },
  { staffId: 300012, username: 'mahesh1', name: 'Mahesh Patil', role: 'CASHIER' },
  { staffId: 300013, username: 'sachin1', name: 'Sachin Jadhav', role: 'CASHIER' },
  { staffId: 300014, username: 'priya1', name: 'Priya Kulkarni', role: 'CASHIER' },
  { staffId: 300015, username: 'rahul1', name: 'Rahul Chavan', role: 'CASHIER' },
  { staffId: 300016, username: 'deepak1', name: 'Deepak Gaikwad', role: 'CASHIER' },
  { staffId: 300017, username: 'sneha1', name: 'Sneha Joshi', role: 'CASHIER' },
  { staffId: 300018, username: 'nitin1', name: 'Nitin More', role: 'CASHIER' },
  { staffId: 300019, username: 'aniket1', name: 'Aniket Salunkhe', role: 'CASHIER' },
];
