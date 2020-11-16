let countDownDate = undefined;

function setupDate() {
    countDownDate = dayjs();
    if (dayjs().date() > 4) {
        //if it's after the 4th, add a month and set submission time
        countDownDate = countDownDate.add(1, "M").date(5).startOf("day");
    } else {
        //if it's before the 4th, its this month
        countDownDate = countDownDate.date(5).startOf("day");
    }
}

setupDate();

const cd = setInterval(() => {
    const distance = countDownDate.diff(dayjs());

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("bhotmCountdown").innerHTML =
        days + "d " + hours + "h " + minutes + "m " + seconds + "s ";

    if (distance <= 0) {
        setupDate();
    }
}, 1000);
