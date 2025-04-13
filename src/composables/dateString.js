export function get_date_string(date) {
    if (!date || typeof date.seconds !== "number") {
        return "Invalid date";
    }

    const jsDate = new Date(date.seconds * 1000);
    return jsDate.toLocaleString("fr-FR", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
}
