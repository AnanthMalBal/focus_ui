export const environmentpath={
  searchCustomer :'http://localhost:9200/stashook/searchCustomer',
  addCustomer :'http://localhost:9200/stashook/addCustomer',

  searchIncident : 'http://localhost:9200/stashook/searchIncident',
  addIncident :'http://localhost:9200/stashook/createIncident',

  apiUrl: 'http://localhost:9000',
  menuUrl:"http://localhost:9000/stashook/menuList",

  forgotPassword:"http://localhost:9000/stashook/forgotPassword",
  changePassword:"http://localhost:9000/stashook/changePassword",

  markAttendance:"http://localhost:9100/stashook/markAttendance",
  getMarkAttendance:"http://localhost:9100/stashook/getMarkedAttendance",

  getProjectList:"http://localhost:9100/stashook/getProjectList",
  getProcessList:"http://localhost:9100/stashook/getProcessList",
  getTimesheetId:"http://localhost:9100/stashook/getTimesheetByDateRange",
  
  addDailyLog:"http://localhost:9100/stashook/addUserDailyLog",
  getDailyLog:"http://localhost:9100/stashook/getUserDailyLog",
  deleteDailyLog:"http://localhost:9100/stashook/deleteUserDailyLog",
  submitTimesheet:"http://localhost:9100/stashook/updateTimesheet",

  applyLeave:"http://localhost:9100/stashook/applyLeave",
  cancelLeave:"http://localhost:9100/stashook/cancelLeave",
  getLeaveType:"http://localhost:9100/stashook/getLeaveTypeList",
  searchLeave:"http://localhost:9100/stashook/searchLeave",
  getLeaveHolidayColor:"http://localhost:9100/stashook/getLeaveHolidayColor",
  getLeaveBalance:"http://localhost:9100/stashook/getLeaveBalance",

  getEmpChart:"http://localhost:3000/leave",
  getEmpChartById:"http://localhost:3000/leave?empId=",
  getDailyLogEntry:"http://localhost:3000/dailyLogEntry",

  // searchCustomer :'http://localhost:9201/stashook/searchCustomer',
  // addCustomer :'http://localhost:9201/stashook/addCustomer',
  // searchIncident : 'http://localhost:9201/stashook/searchIncident',
  // apiUrl: 'http://localhost:9000',
  // menuUrl:"http://localhost:9000/stashook/menuList",
  // markAttendance:"http://localhost:9200/stashook/markAttendance",
};
