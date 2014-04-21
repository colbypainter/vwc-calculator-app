


/* Once calculation has already run, if user updates Weeks Due this will clear out End Date and Comp Due. */
function clearWeeks() {
	var weeksDue = document.getElementById("weeksDue").value;
	if (weeksDue != "") {
		document.getElementById("weeksDue").value = "";
		document.getElementById("compensationDue").value = "";
	}
}

function clearEnd() {
	var endDate = document.getElementById("endDate").value;
	if (endDate != "") {
		document.getElementById("endDate").value = "";
		document.getElementById("compensationDue").value = "";
	}
}

