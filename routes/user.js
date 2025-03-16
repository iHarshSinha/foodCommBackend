let express=require("express")
let router=express.Router()

let wrapForError=require("../utils/catchAsync")
let UserMethods=require("../controller/user")
let middleware=require("../middleware")
let upload=require("../cloudinary/uploadMiddleware")


router.get("/menu",wrapForError(UserMethods.getMenu))
router.post("/sick",middleware.validateSickMeal,wrapForError(UserMethods.sick))
router.put("/rating/:id",wrapForError(UserMethods.updateRating))
router.put("/feast/rating/:id",wrapForError(UserMethods.updateFeastRating))
router.get("/feast",wrapForError(UserMethods.getFeast))
router.post("/review",upload,wrapForError(UserMethods.addReview))

module.exports=router
