let xlsx = require('xlsx');
let axios = require('axios');

const parseExcelFromUrl = async (url) => {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data, 'binary');
    const workbook = xlsx.read(buffer, { type: 'buffer' });
    return workbook.Sheets[workbook.SheetNames[0]];  // Assuming you want the first worksheet
};


const processExcelData = (worksheet) => {
    const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

    // Filter out rows that contain only empty cells
    const filteredData = data.filter(row => row.some(cell => cell !== undefined && cell !== null && cell.toString().trim() !== ''));

    const menu = {};

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const convertExcelDate = (serial) => {
        const date = new Date((serial - (25567 + 2)) * 86400 * 1000);
        const day = date.getUTCDate();
        const month = monthNames[date.getUTCMonth()];
        const year = date.getUTCFullYear().toString().slice(-2); // Last two digits of the year
        return `${day} ${month} ${year}`;
    };

    for (let col = 0; col < 7; col++) { // Assuming columns A to G (Monday to Sunday)
        const day = filteredData[0][col];
        const date1 = filteredData[1][col];
        const date2 = filteredData[2][col];

        const processItems = (start, end) => filteredData.slice(start, end).map(row => {
            const cell = row[col];
            if (typeof cell === 'string') {
                return cell.trim();
            } else {
                return cell;
            }
        }).filter(item => item !== undefined && item !== null && item !== '');

        const breakfast = processItems(4, 11);
        const lunch = processItems(12, 22);
        const snacks = processItems(23, 26);
        const dinner = processItems(27, 40);

        menu[day] = {
            dates: [
                convertExcelDate(date1),
                convertExcelDate(date2)
            ],
            meals: {
                breakfast,
                lunch,
                snacks,
                dinner
            }
        };
    }

    return menu;
};
module.exports = {processExcelData, parseExcelFromUrl};