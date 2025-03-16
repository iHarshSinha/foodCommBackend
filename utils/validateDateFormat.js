function validateDateFormat(date){
    // first we should get the month in three letter format
    let month = date.substring(3,6);
    let months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    if(!months.includes(month)){
        return false;
    }
    // now according to month we should see that appropriate days are there or not
    let monthIndex = months.indexOf(month);
    let daysInMonth = [31,28,31,30,31,30,31,31,30,31,30,31];
    let day = parseInt(date.substring(0,2));
    let year = parseInt(date.substring(7));
    if(year%4==0){
        daysInMonth[1]=29;
    }
    if(day>daysInMonth[monthIndex]){
        return false;
    }
    // now year is only two digit
    if(year<0 || year>99){
        return false;
    }
    return true;
}
module.exports=validateDateFormat;