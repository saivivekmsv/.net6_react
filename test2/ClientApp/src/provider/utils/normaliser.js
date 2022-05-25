export const bankAccountNumberNormalizer = (value) => {
  if (!value) {
    return value;
  }
  const part1Regex = /^([\d]{4}\s?){1,6}$/;
  const wholeRegex = /^([\d]{4}\s?)([\d]{4}\s?)([\d]{4}\s?)([\d]{4}\s?)([\d]{4}\s?)([\d]{4}\s?)([\d]{6}){1}$/;
  if (part1Regex.test(value)) {
    return value.replace(/([\d]{4})$/, "$1 ");
  } else if (wholeRegex.test(value)) {
    return value.replace(wholeRegex, "$1 $2 $3 $4 $5 $6 $7");
  }
  return value;
};

export const maskedBankAccountNumberNormalizer = (value) => {
  if (!value) {
    return value;
  }
  return `XXXXXXXXXXX${value.slice(-4)}`;
};

export const getDateWithSlash = (value) => {
  if (!value) {
    return value;
  } 
  //console.log(value);
  var date = new Date(Date.parse(value));
  return (date.getMonth() + 1) + "/" + (date.getDate() + "/" + date.getFullYear() );
};

export const getDateTimeAMPM = (value) => {
  if (!value) {
    return value;
  } 
  var date = new Date(Date.parse(value));
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var seconds = date.getSeconds();
  var ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  hours = hours < 10 ? '0'+hours : hours;
  seconds = seconds < 10 ? '0'+seconds : seconds;
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ':' + seconds + ' ' + ampm;
  return (date.getMonth() + 1) + "/" + (date.getDate() + "/" + date.getFullYear() + "  " + strTime );
  
};

export const abaRoutingNumber = (value) => {
  if (!value) {
    return value;
  }
  const part1Regex = /^(\d{6}\s?){1,5}$/;
  const wholeRegex = /^([\d]{6}\s?)([\d]{6}\s?)([\d]{6}\s?)([\d]{6}\s?)([\d]{6}\s?)([\d]{6})$/;
  if (part1Regex.test(value)) {
    return value.replace(/(\d{6})$/, "$1 ");
  } else if (wholeRegex.test(value)) {
    return value.replace(wholeRegex, "$1 $2 $3 $4 $5 $6");
  }
  return value;
};
