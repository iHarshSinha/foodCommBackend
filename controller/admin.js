let { processExcelData, parseExcelFromUrl } = require("../utils/parseExcel")
let { cloudinary, storage } = require("../cloudinary/index")
let convertToDate = require("../utils/date")
let Item = require("../models/item")
let ExpressError = require("../utils/ExpressError")
let Meal = require("../models/meal")
let Day = require("../models/day")
let Review = require("../models/review")
let Menu = require("../models/menu")
let Feasts = require("../models/feast")
let multer = require("multer")
let upload = multer({ storage })
let yyyymmdd = require("../utils/yyyymmdd")

let validateDateFormat = require("../utils/validateDateFormat")

module.exports.createMenu = async (req, res, next) => {

    let result = await cloudinary.uploader.upload(req.file.path, { resource_type: "raw" });
    let url = result.secure_url;
    let worksheet = await parseExcelFromUrl(url);
    const menuData = processExcelData(worksheet);
    console.log(menuData);

    console.log(menuData['MONDAY'].dates[0])
    console.log(menuData['SUNDAY'].dates[1])
    const startDate = convertToDate(menuData['MONDAY'].dates[0]);
    startDate.setHours(0, 0, 0, 0); // Set to start of day

    const endDate = convertToDate(menuData['SUNDAY'].dates[1]);
    endDate.setHours(23, 59, 59, 999); // Set to end of day

    // Process each day's data
    const daysArray = [];
    for (const [dayName, dayData] of Object.entries(menuData)) {
        // Convert dates
        const dates = dayData.dates.map(date => convertToDate(date));

        // Process meals for the day
        const mealDocuments = [];
        for (const [mealName, items] of Object.entries(dayData.meals)) {
            // Create items
            const itemDocs = await Promise.all(
                items.map(async itemName => {
                    const item = new Item({ name: itemName });
                    await item.save();
                    return item._id;
                })
            );

            // Create meal
            const meal = new Meal({
                name: mealName.toLowerCase(),
                items: itemDocs
            });
            await meal.save();
            mealDocuments.push(meal._id);
        }

        // Create day
        const day = new Day({
            dates: dates,
            meals: mealDocuments
        });
        await day.save();
        daysArray.push(day._id);
    }

    // Create menu
    const menu = new Menu({
        startDate: startDate,
        endDate: endDate,
        days: daysArray
    });
    await menu.save();

    res.status(201).json({
        success: true,
        message: 'Menu created successfully',
        data: {
            menuId: menu._id,
            startDate: startDate,
            endDate: endDate
        }
    });
    // console.log(parsedData);
    // res.json(parsedData);

}
module.exports.createFeast = async (req, res, next) => {
    let { date, meal, items } = req.body;
    if (!date || !meal) {
        return next(new ExpressError("Date and meal are required", 400));
    }
    // now date must be in the form of dd three letter month and yy
    if (!validateDateFormat(date)) {
        return next(new ExpressError("Invalid date format", 400));
    }

    let feastDate = convertToDate(date);
    if (meal != "breakfast" && meal != "lunch" && meal != "snacks" && meal != "dinner") {
        return next(new ExpressError("Invalid meal type", 400));
    }
    if (!items || items.length == 0) {
        return next(new ExpressError("Items are required", 400));
    }

    // now we will find the date which has this date in the dates array
    let day = await Day.findOne({ dates: feastDate }).populate("meals");
    // console.log(day._id);
    if (day) {
        console.log(day);
        // now we will get that meal
        let feastMeal = day.meals.find(m => m.name === meal);
        console.log(feastMeal);
        if (feastMeal) {
            feastMeal.isFeast.status = true;
            feastMeal.isFeast.date = date;
            await feastMeal.save();
        }
    }
    // for each feast the tuple meal and date is unique
    // we should check that if the feast with this meal and date already exists
    // if yes then we will send that feast already exists
    let findFeast = await Feasts.findOne({ name: meal, date: date });
    if (findFeast) {
        return next(new ExpressError("Feast already exists", 400));
    }
    // now we have to make items object from the array of strings that we got
    // we will create items and then save them
    let itemDocs = await Promise.all(
        items.map(async itemName => {
            const item = new Item({ name: itemName });
            await item.save();
            return item._id;
        }));
    let feast = new Feasts({
        name: meal,
        date: date,
        items: itemDocs
    });
    await feast.save();
    return res.json({ message: "Feast created successfully" });
}
module.exports.getReview = async (req, res, next) => {
    let { page, limit } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 1;
    console.log("page and limit received",page,limit)

    const totalReviews = await Review.countDocuments(); // Count total records
    const totalPages = Math.ceil(totalReviews / limit); // Calculate total pages

    const reviews = await Review.find({})
        .skip((page - 1) * limit)
        .limit(limit);

    res.json({
        currentPage: page,
        totalPages: totalPages,
        totalReviews: totalReviews,
        reviews: reviews
    });
};




