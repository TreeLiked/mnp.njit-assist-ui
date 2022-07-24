function getCurrentMonthFirst() {
  let date = new Date();
  return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
}

function getDate() {
  let date = new Date();
  return date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate() + "日";
}

function getDateWithoutYear() {
  let date = new Date();
  return (date.getMonth() + 1) + "月" + date.getDate() + "日";
}

function getTimeRan() {
  let date = new Date();
  let hour = date.getHours();
  if (hour <= 3) {
    return "已经是深夜了"
  } else if (hour < 6) {
    return "现在是凌晨"
  } else if (hour <= 10) {
    return "早上好 🥳"
  } else if (hour <= 13) {
    return "中午好 🥰"
  } else if (hour <= 18) {
    return "下午好 🤗"
  } else if (hour <= 23) {
    return "晚上好 🌙"
  } {
    return "今天加油吧！";
  }

}

function getWeek() {
  let a = new Date()
  const myxingqi = a.getDay()
  let b
  switch (myxingqi) {
    case 0:
      b = "周末";
      break;
    case 1:
      b = "星期一";
      break;
    case 2:
      b = "星期二";
      break;
    case 3:
      b = "星期三";
      break;
    case 4:
      b = "星期四";
      break;
    case 5:
      b = "星期五";
      break;
    case 6:
      b = "周六";
      break;
    default:
      b = "系统错误，无法读取日期！";
  }
  return b;
}

function getWeekDate() {
  let date = new Date();
  let curMonth = date.getMonth() + 1;
  let weekDay = date.getDay();
  if (weekDay == 0) {
    weekDay = 7;
  }
  var array = Array(8);

  array[0] = {
    'str': curMonth + "月",
    'red': true
  };
  let thisMonthDays = getDaysInYearMonth(date.getYear(), curMonth);
  // 隔月，是否本周跨了一个月
  let hasAddMonth = false;
  let thisWeekMondayDate = getWeekStartDate();
  array[1] = {
    'str': thisWeekMondayDate,
    'red': weekDay == 1,
  };
  let next = thisWeekMondayDate + 1;
  if (next > thisMonthDays) {
    next = 1;
    hasAddMonth = true;
  }
  array[2] = {
    'str': next,
    'red': weekDay == 2,
  };
  next = next + 1;
  if (next > thisMonthDays && !hasAddMonth) {
    next = 1;
    hasAddMonth = true;
  }
  array[3] = {
    'str': next,
    'red': weekDay == 3,
  };
  next = next + 1;
  if (next > thisMonthDays && !hasAddMonth) {
    next = 1;
    hasAddMonth = true;
  }
  array[4] = {
    'str': next,
    'red': weekDay == 4,
  };
  next = next + 1;
  if (next > thisMonthDays && !hasAddMonth) {
    next = 1;
    hasAddMonth = true;
  }
  array[5] = {
    'str': next,
    'red': weekDay == 5,
  };
  next = next + 1;
  if (next > thisMonthDays && !hasAddMonth) {
    next = 1;
    hasAddMonth = true;
  }
  array[6] = {
    'str': next,
    'red': weekDay == 6,
  };
  next = next + 1;
  if (next > thisMonthDays && !hasAddMonth) {
    next = 1;
    hasAddMonth = true;
  }
  array[7] = {
    'str': next,
    'red': weekDay == 7,
  };
  console.log(array);
  

  return array;

}

function getDaysInYearMonth(year, month) {
  // 这里的month 已经被加1了
  month = parseInt(month, 10);
  var date = new Date(year, month, 0);
  return date.getDate();
}

function getWeekStartDate() {
  var date = new Date()
  var day = date.getDay() || 7;
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1 - day).getDate();
}



module.exports = {
  getCurrentYMW: getCurrentMonthFirst,
  getDate,
  getWeek,
  getDateWithoutYear,
  getWeekDate,
  getWeekStartDate,
  getTimeRan
}