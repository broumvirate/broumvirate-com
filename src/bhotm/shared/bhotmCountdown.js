import React, { useState, useEffect } from "react";
import dayjs from "dayjs";

function setupDate() {
    let countDownDate = dayjs();
    if (dayjs().date() > 4) {
        //if it's after the 4th, add a month and set submission time
        countDownDate = countDownDate.add(1, "M").date(5).startOf("day");
    } else {
        //if it's before the 4th, its this month
        countDownDate = countDownDate.date(5).startOf("day");
    }
    return countDownDate;
}

const BhotmCountdown = (props) => {
    const [cdString, setCdString] = useState("");
    const [dueDate, setDueDate] = useState(setupDate());

    useEffect(() => {
        const cd = setInterval(() => {
            const distance = dueDate.diff(dayjs());

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor(
                (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            );
            const minutes = Math.floor(
                (distance % (1000 * 60 * 60)) / (1000 * 60)
            );
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            setCdString(
                days + "d " + hours + "h " + minutes + "m " + seconds + "s "
            );

            if (distance <= 0) {
                setupDate();
            }
        }, 1000);
        return function cleanup() {
            clearInterval(cd);
        };
    });

    return (
        <h3 className="my-4 text-center">
            <strong>Entries Due: </strong>
            <span id="bhotmCountdown">{cdString}</span>
        </h3>
    );
};

export default BhotmCountdown;
