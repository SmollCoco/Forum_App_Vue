export function DateFilter(DiscList, ordre) {
    if (ordre == "arrow_upward") {
        DiscList.sort((a, b) => a.date.seconds - b.date.seconds);
    } else if (ordre == "arrow_downward") {
        DiscList.sort((a, b) => b.date.seconds - a.date.seconds);
    }
    return DiscList;
}
