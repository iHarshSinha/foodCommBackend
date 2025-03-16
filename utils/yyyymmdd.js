// now we will make a function that will take a string in yyyy-mm-dd format and return a date object
function convertToDateYYYYMMDD(dateStr) {
    const [year, month, day] = dateStr.split("-");
    return new Date(year, month-1, day);
}
module.exports=convertToDateYYYYMMDD;