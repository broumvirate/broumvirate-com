let countDownDate = moment();

if(moment().get("date") > 4){ //if it's after the 4th, add a month and set submission time
    countDownDate.add(1, "M").date(5).startOf("day");
}
else{                         //if it's before the 4th, its this month
    countDownDate.date(5).startOf("day");
}

let cd = setInterval(function(){
    let distance = countDownDate.diff(moment());

    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("bhotmCountdown").innerHTML = days + "d " + hours + "h "
    + minutes + "m " + seconds + "s ";

    if(distance < 0) {
        countDownDate.add(1, "M").date(5).startOf("day");
    }

}, 1000);