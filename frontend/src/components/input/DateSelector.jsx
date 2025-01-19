import React from "react";
import { DayPicker } from "react-day-picker";
import moment from "moment";
import { MdOutlineDateRange, MdClose } from "react-icons/md";

const DateSelector = ({ date, setDate }) => {
  return (
    <div>
        <button className="" onClick={() => {
            setOpenDatePicker(true);
        }}>
            <MdOutlineDateRange className="text-lg" />
            {date
                ? moment(date).format("Do MMM YYYY")
                : moment().format("Do MMM YYYY")}
        </button>
    </div>
  )
}

export default DateSelector