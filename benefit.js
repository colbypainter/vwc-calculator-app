

function benefit() {
    this.benType = "";
    this.DOI = "";
    this.startDate = "";
    this.endDate = "";
    this.bodyPart = "";
    this.percentLoss = "";
    this.AWW = "";
    this.PWW = "";
    this.weeksDue = "";
    this.compRate = "";

    var rates = {
    "1975": {"COLA": "0", "MAX": "149", "MIN": "37.25"},
    "1976": {"COLA": "7", "MAX": "162", "MIN": "40"},
    "1977": {"COLA": "4.8", "MAX": "175", "MIN": "43.75"},
    "1978": {"COLA": "6.8", "MAX": "187", "MIN": "46.75"},
    "1979": {"COLA": "9", "MAX": "199", "MIN": "49.75"},

    }

    this.setWeeksDueWithDates = setWeeksDueWithDates; /* passed test. didn't when date passed in wasn't in quotes */

    function setWeeksDueWithDates() {
        var startDate = new Date(this.startDate);
        var endDate = new Date(this.endDate);
        var daysDue = endDate.getTime() - startDate.getTime();
        daysDue = daysDue / 1000 / 60 / 60 / 24;
        daysDue = Math.round(daysDue);
        daysDue = daysDue + 1;
        this.weeksDue = daysDue / 7;
        /* Round Weeks Due to 5 decimal places */
        this.weeksDue = Math.round(this.weeksDue * 100000);
        this.weeksDue = this.weeksDue / 100000;
        return this.weeksDue;
    }

    this.setCompRate = setCompRate;
    function setCompRate() {
        if ((this.PWW !== "") && (this.AWW !== "")) {
            this.compRate = (this.AWW - this.PWW) * (2 / 3);
        } else {
            this.compRate = (this.AWW * (2 / 3));
        }
        this.compRate = Math.round(this.compRate * 100)/100;
        return this.compRate;
    }

    this.getCompDue = getCompDue; /* Passed test */

    function getCompDue() {
        var compDue = this.weeksDue * this.compRate;
        compDue = Math.round(compDue * 100);
        compDue = compDue / 100;
        return compDue;

    }

    this.getWeeksPP = getWeeksPP; /* Passed test, BUT body part needs an associative array */

    function getWeeksPP() {
        this.weeksDue = this.bodyPart * (this.percentLoss / 100);
        /* Round Weeks Due to 5 decimal places */
        this.weeksDue = Math.round(this.weeksDue * 100000);
        this.weeksDue = this.weeksDue / 100000;
        return this.weeksDue;
    }

    this.getEndDate = getEndDate; 

    function getEndDate() {
        var beginDate = new Date(this.startDate);
        var weeksDue = this.weeksDue;

        var splitWeeks = weeksDue.toString().split(".");
        var days = ("." + splitWeeks[1]);
        var weeks = Number(splitWeeks[0]);

        if (days > 0 && days < .14286) {
            splitWeeks[1] = .14286;
            weeksDue = Number(splitWeeks[0]) + Number(splitWeeks[1]);
        } else if (days > .14286 && days <= .28571) {
            splitWeeks[1] = .29;
            weeksDue = Number(splitWeeks[0]) + Number(splitWeeks[1]);
        } else if (days > .28571 && days <= .42857) {
            splitWeeks[1] = .43;
            weeksDue = Number(splitWeeks[0]) + Number(splitWeeks[1]);
        } else if (days > .42857 && days <= .57143) {
            splitWeeks[1] = .57;
            weeksDue = Number(splitWeeks[0]) + Number(splitWeeks[1]);
        } else if (days > .57143 && days <= .71429) {
            splitWeeks[1] = .71;
            weeksDue = Number(splitWeeks[0]) + Number(splitWeeks[1]);
        } else if (days > .71429 && days <= .85714) {
            splitWeeks[1] = .86;
            weeksDue = Number(splitWeeks[0]) + Number(splitWeeks[1]);
        } else if (days > .85714) {
            splitWeeks[1] = .86;
            weeksDue = Number(splitWeeks[0]) + Number(splitWeeks[1]);
        }

        weeksDue = weeksDue * 7 * 24 * 60 * 60 * 1000;
        var endingDate = beginDate.getTime() + weeksDue - 86400000;
        endingDate = new Date(endingDate);
        endDate = formatDate(endingDate);
        return endDate;
    }
    this.calc = calc;

    function calc() {
        switch (this.benType) {
            case "TT":
                if (this.endDate !== "" && this.weeksDue === "") {
                    this.weeksDue = this.setWeeksDueWithDates();
                } else if (this.endDate === "" && this.weeksDue !== "") {
                    this.endDate = this.getEndDate();
                }
                break;

            case "PP":                                                
                if (this.endDate === "" && this.weeksDue === "") {  
                        this.weeksDue = this.getWeeksPP();
                        this.endDate = this.getEndDate();
                } else if (this.endDate === "" && this.weeksDue !== "") { 
                        this.endDate = this.getEndDate();
                } else if (this.endDate !== "" && this.weeksDue === "") {  
                        this.weeksDue = this.setWeeksDueWithDates();  
                }                                                   
            break;
           
            case "TP":
                if (this.endDate !== "" && this.weeksDue === "") {
                    this.weeksDue = this.setWeeksDueWithDates();
                } else if (this.endDate === "" && this.weeksDue !== "") {
                    this.endDate = this.getEndDate();
                }
                
        }
    }
}


/* Gets the amount still due after an amount has already been paid  */
function getDiff(x,y) {
var compDue = x;
var paid = y;
var diff = 0;
    if (compDue != "" && paid == "") {
        diff = compDue;
    } else if (compDue != "" && paid != "") {
        diff = compDue - paid;
    } else {
        diff = 0 - paid;
    }
diff = Math.round(diff*100)/100;
return diff;
}


/* Formats Date for output to form */
function formatDate(x) {
    var d = new Date(x);
    var date = d.getDate();
    var month = d.getMonth();
    month = month + 1;
    var year = d.getFullYear();
    d = month + "/" + date + "/" + year;
    return d;
}


