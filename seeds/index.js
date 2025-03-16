if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
//database connection
let mongoose = require("mongoose")
mongoose.connect(process.env.MONGODB_URI);
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Connected to MongoDB");
});

//models
let Item = require("../models/item")
let Meal = require("../models/meal")
let Day = require("../models/day")
let Menu = require("../models/menu")
let Feast = require("../models/feast")
let Review = require("../models/review")

//utils
let convertToDate = require("../utils/date")

//data
let menuData = require("./seedMenu")

// for displaing
let formatDate = require("./formatDate")
let getDayNumber = require("./dayNumber");



let seedData = async () => {
    // let us delete all the data from the database
    await Promise.all([
        Menu.deleteMany({}),
        Day.deleteMany({}),
        Meal.deleteMany({}),
        Item.deleteMany({}),
        Feast.deleteMany({}),
        Review.deleteMany({})
    ]);
    // console.log('Database cleaned successfully');

    // // Calculate next Monday and end date (Sunday after two weeks)
    // const today = new Date();
    // const nextMonday = new Date(today);
    // nextMonday.setDate(today.getDate() + ((8 - today.getDay()) % 7));
    // nextMonday.setHours(0, 0, 0, 0); // Set to start of day

    // const endDate = new Date(nextMonday);
    // endDate.setDate(nextMonday.getDate() + 13); // Add 13 days to reach second Sunday
    // endDate.setHours(23, 59, 59, 999); // Set to end of day

    // console.log(`Creating menu from ${formatDate(nextMonday)} to ${formatDate(endDate)}`);

    // // Process each day's data
    // const daysArray = [];
    // for (const [dayName, dayData] of Object.entries(menuData)) {
    //     // Get the day number (0-6) for this day
    //     const dayOfWeek = getDayNumber(dayName);

    //     // Calculate the dates for this day in the two-week period
    //     const dayDates = [];
    //     let currentDate = new Date(nextMonday);

    //     while (currentDate <= endDate) {
    //         if (currentDate.getDay() === dayOfWeek) {
    //             // Add this date if it's the right day of the week
    //             let mydate=new Date(currentDate);
    //             dayDates.push(mydate);
    //             // console.log(`Added ${formatDate(currentDate)} for ${dayName}`);
    //         }
    //         currentDate.setDate(currentDate.getDate() + 1);
    //     }

    //     // Process meals for the day
    //     const mealDocuments = [];
    //     for (const [mealName, items] of Object.entries(dayData.meals)) {
    //         // Create items
    //         const itemDocs = await Promise.all(
    //             items.map(async itemName => {
    //                 const item = new Item({ name: itemName });
    //                 await item.save();
    //                 return item._id;
    //             })
    //         );

    //         // Create meal
    //         const meal = new Meal({
    //             name: mealName.toLowerCase(),
    //             items: itemDocs
    //         });
    //         await meal.save();
    //         mealDocuments.push(meal._id);
    //     }

    //     // Create day
    //     const day = new Day({
    //         dates: dayDates, // Using our calculated dates
    //         meals: mealDocuments
    //     });
    //     await day.save();
    //     daysArray.push(day._id);
    // }

    // // Create menu
    // const menu = new Menu({
    //     startDate: nextMonday,
    //     endDate: endDate,
    //     days: daysArray
    // });
    // await menu.save();

    // console.log('Database seeded successfully!');
    // console.log(`Menu created with start date: ${formatDate(nextMonday)}`);
    // console.log(`End date: ${formatDate(endDate)}`);
}
let executer = async () => {
    await seedData();
    mongoose.connection.close();
}
executer();

