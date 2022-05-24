var options = { weekday: 'long', month: 'long', day: 'numeric' };
var today = new Date;
var Day = today.toLocaleDateString(undefined, options)

document.querySelector(".date").innerHTML = Day;