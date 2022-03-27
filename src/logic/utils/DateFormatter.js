class DateFormatter {
    static toMinutesAndHours(date) {
        // If it lasts into the hours
        if (date.getUTCHours())
            return `${date.getUTCHours().toString()}:${date.getUTCMinutes()}:${date.getUTCSeconds().toString().padStart(2, "0")}`
        else
            return `${date.getUTCMinutes()}:${date.getUTCSeconds().toString().padStart(2, "0")}`
    }
}

export default DateFormatter