const monthMapping = {
    "Jan": "01",
    "Feb": "02",
    "Mar": "03",
    "Apr": "04",
    "May": "05",
    "Jun": "06",
    "Jul": "07",
    "Aug": "08",
    "Sep": "09",
    "Oct": "10",
    "Nov": "11",
    "Dec": "12"
};
function convertToDate(dateStr) {
    const [day, month, year] = dateStr.split(" ");
    const formattedDay = day.padStart(2, "0");
    const formattedMonth = monthMapping[month];

    // Construct a date object with IST (without UTC shifting)
    const date = new Date(Number(`20${year}`), Number(formattedMonth) - 1, Number(formattedDay));
    return date;
}

module.exports = convertToDate;