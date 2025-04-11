export function get_date_string(date) {
  const timestamp = date;

  if (timestamp && typeof timestamp.seconds === "number") {
    const jsDate = new Date(timestamp.seconds * 1000);

    return jsDate.toLocaleString("fr-FR", {
      weekday: "long", // optionnel : "jeudi"
      day: "2-digit", // "10"
      month: "long", // "avril"
      year: "numeric", // "2025"
      hour: "2-digit", // "14"
      minute: "2-digit", // "05"
      hour12: false, // format 24h
    });
  }

  return "Date invalide";
};
