const Joi = require('joi');

const sickMeal = Joi.object({
    name: Joi.string().required(),
    room: Joi.string().required(),
    mealType: Joi.string().required(),
    startDate: Joi.string().required(),
    endDate: Joi.string().required(),
    instructions: Joi.string().optional(),
    meals: Joi.array().items(Joi.string()).min(1).required() // At least one string element in the array
});

module.exports = { sickMeal };
