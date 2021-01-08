import BhotmMonthPageContent, {
    bhotmMonthPageContent,
} from "./bhotmMonthPageContent";
import React, { useState, useEffect } from "react";
import { showPageError } from "../../utils/helpers";
import { getMonth } from "../api/bhotmMonthApi";

// Fully rendered page displaying a whole month of BHotM

const MonthPage = (props) => {
    const [month, setMonth] = useState(null);

    // Load the data
    useEffect(() => {
        getMonth(props.match.params.monthId)
            .then((month) => {
                document.title = `${month.month} - BHotM - The Broumvirate`;
                month.submissions.sort((a, b) => a.place - b.place);
                if (month.isBhoty) {
                    month.submissions.sort(
                        (a, b) => b.bhotyPlace - a.bhotyPlace
                    );
                }
                setMonth({ ...month });
            })
            .catch((error) => {
                showPageError(error);
            });
    }, [props.match.params.monthId]);

    if (month !== null) {
        return <BhotmMonthPageContent month={month} />;
    } else {
        return <div className="container mt-4"></div>;
    }
};

export default MonthPage;
