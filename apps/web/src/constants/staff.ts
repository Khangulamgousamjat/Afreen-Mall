export interface StaffMember {
  staffId: number;
  username: string;
  name: string;
  role: string;
  defaultPassword?: string;
}

export const INITIAL_STAFF_LIST: StaffMember[] = [
  { staffId: 300000, username: 'Superkhan', name: 'Gous Khan', role: 'SUPER_ADMIN', defaultPassword: 'Kingkhan@12' },
  { staffId: 300001, username: 'manager1', name: 'Sanjay Gupta', role: 'STORE_MANAGER', defaultPassword: 'Pass@123' },
  { staffId: 300002, username: 'pooja1', name: 'Pooja Sharma', role: 'CASHIER', defaultPassword: 'Pass@123' },
  { staffId: 300003, username: 'vinayak1', name: 'Vinayak Shinde', role: 'CASHIER', defaultPassword: 'Pass@123' },
  { staffId: 300004, username: 'babuji1', name: 'Babuji Namole', role: 'CASH_OFFICER', defaultPassword: 'Pass@123' },
  { staffId: 300005, username: 'amit1', name: 'Amit Verma', role: 'ACCOUNTANT', defaultPassword: 'Pass@123' },
  { staffId: 300006, username: 'auditor1', name: 'Rajesh Deshmukh', role: 'AUDITOR', defaultPassword: 'Pass@123' },
  { staffId: 300010, username: 'rohan1', name: 'Rohan Kadam', role: 'CASHIER', defaultPassword: 'P23' },
  { staffId: 300011, username: 'sunita1', name: 'Sunita Pawar', role: 'CASHIER', defaultPassword: 'Pass@123' },
  { staffId: 300012, username: 'mahesh1', name: 'Mahesh Patil', role: 'CASHIER', defaultPassword: 'Pass@123' },
  { staffId: 300013, username: 'sachin1', name: 'Sachin Jadhav', role: 'CASHIER', defaultPassword: 'Pass@123' },
  { staffId: 300014, username: 'priya1', name: 'Priya Kulkarni', role: 'CASHIER', defaultPassword: 'Pass@123' },
  { staffId: 300015, username: 'rahul1', name: 'Rahul Chavan', role: 'CASHIER', defaultPassword: 'Pass@123' },
  { staffId: 300016, username: 'deepak1', name: 'Deepak Gaikwad', role: 'CASHIER', defaultPassword: 'Pass@123' },
  { staffId: 300017, username: 'sneha1', name: 'Sneha Joshi', role: 'CASHIER', defaultPassword: 'Pass@123' },
  { staffId: 300018, username: 'nitin1', name: 'Nitin More', role: 'CASHIER', defaultPassword: 'Pass@123' },
  { staffId: 300019, username: 'aniket1', name: 'Aniket Salunkhe', role: 'CASHIER', defaultPassword: 'Pass@123' },
];
