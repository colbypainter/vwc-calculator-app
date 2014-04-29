

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
    this.rateYear = "";
    this.colaDue = "";
    this.colaPeriods = {};

    this.rates = {
    "1975": {"COLA": "0", "MAX": "149", "MIN": "37.25"},
    "1976": {"COLA": "7", "MAX": "162", "MIN": "40"},
    "1977": {"COLA": "4.8", "MAX": "175", "MIN": "43.75"},
    "1978": {"COLA": "6.8", "MAX": "187", "MIN": "46.75"},
    "1979": {"COLA": "9", "MAX": "199", "MIN": "49.75"},
    "1980": {"COLA": "1.33", "MAX": "213", "MIN": "53.24"},
    "1981": {"COLA": "12.45", "MAX": "231", "MIN": "57.75"},
    "1982": {"COLA": "8.8", "MAX": "253", "MIN": "63.25"},
    "1983": {"COLA": "3.9", "MAX": "277", "MIN": "69.25"},
    "1984": {"COLA": "3.55", "MAX": "295", "MIN": "73.75"},
    "1985": {"COLA": "3.75", "MAX": "311", "MIN": "77.75"},
    "1986": {"COLA": "3.7", "MAX": "326", "MIN": "81.5"},
    "1987": {"COLA": "0.9", "MAX": "344", "MIN": "86"},
    "1988": {"COLA": "4.5", "MAX": "362", "MIN": "90.5"},
    "1989": {"COLA": "4.4", "MAX": "382", "MIN": "95.5"},
    "1990": {"COLA": "4.6", "MAX": "404", "MIN": "101"},
    "1991": {"COLA": "6.1", "MAX": "418", "MIN": "104.5"},
    "1992": {"COLA": "2.95", "MAX": "434", "MIN": "108.5"},
    "1993": {"COLA": "2.9", "MAX": "451", "MIN": "112.75"},
    "1994": {"COLA": "2.6", "MAX": "466", "MIN": "116.5"},
    "1995": {"COLA": "2.7", "MAX": "480", "MIN": "120"},
    "1996": {"COLA": "2.5", "MAX": "496", "MIN": "124"},
    "1997": {"COLA": "3.3", "MAX": "513", "MIN": "128.25"},
    "1998": {"COLA": "1.6", "MAX": "534", "MIN": "133.5"},
    "1999": {"COLA": "1.6", "MAX": "567", "MIN": "141.75"},
    "2000": {"COLA": "2.7", "MAX": "606", "MIN": "151.5"},
    "2001": {"COLA": "3.4", "MAX": "645", "MIN": "161.25"},
    "2002": {"COLA": "1.45", "MAX": "681", "MIN": "170.25"},
    "2003": {"COLA": "2.4", "MAX": "691", "MIN": "172.75"},
    "2004": {"COLA": "1.75", "MAX": "706", "MIN": "176.5"},
    "2005": {"COLA": "3.35", "MAX": "736", "MIN": "184"},
    "2006": {"COLA": "3.45", "MAX": "773", "MIN": "193.25"},
    "2007": {"COLA": "2.45", "MAX": "816", "MIN": "204"},
    "2008": {"COLA": "4.2", "MAX": "841", "MIN": "210.25"},
    "2009": {"COLA": "0.25", "MAX": "895", "MIN": "223.75"},
    "2010": {"COLA": "3.05", "MAX": "885", "MIN": "221.25"},
    "2011": {"COLA": "1.6", "MAX": "905", "MIN": "226.25"},
    "2012": {"COLA": "3.1", "MAX": "935", "MIN": "233.75"},
    "2013": {"COLA": "1.7", "MAX": "955", "MIN": "238.75"},
    "2014": {"COLA": "", "MAX": "", "MIN": ""}
    };

    this.setWeeksDueWithDates = setWeeksDueWithDates; 

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

    this.getCola = getCola;
    function getCola() {
        setRateYear(this.DOI);
        var startYear = new date(this.startDate);
        startYear = startYear.getFullYear();
        var endYear = new date(this.endDate);
        endYear = endYear.getFullYear();
        var rateYear = Number(this.rateYear);
        var begDate = this.startDate;
        var endDate = this.endDate;
        var weeksDue = this.weeksDue;
        var colaDue = this.colaDue;
        var compRate = this.compRate;
        var benPeriod = {};
        var DOI = new Date(this.DOI);
        var colaYearOne = new Date("07/01/1975");

        if (DOI.getTime() < colaYearOne.getTime()) {
            this.colaDue = 0;
        } 
        if (rateYear < startYear) {
            while (rateYear > 1974 && rateYear < startYear) {
                begDate = this.startDate;
                endDate = this.endDate;
                weeksDue = setWeeksDueWithDates();
                colaDue = this.rates[rateYear]["COLA"]*(weeksDue)*this.compRate;
                benPeriod = {
                    "year": rateYear,
                    "begin": begDate,
                    "end": endDate,
                    "wd": weeksDue,
                    "cr": compRate,
                    "cd": colaDue
                };
                this.colaPeriods.push(benPeriod);
                rateYear = rateYear + 1;
                this.colaDue = this.colaDue + colaDue;
                this.compRate = (1 + this.rates[rateYear]["COLA"])*this.compRate;
            } 

        }
        if (rateYear >= startYear && rateYear < endYear) {
                begDate = this.startDate;
                var startMonth = begDate.getMonth() + 1;
                endDate = this.endDate;
                if (startMonth < 10) {
                    begDate = "10" + "/" + "01" + "/" + rateYear;
                    begDate = new Date(begDate);
                }
                this.startDate = begDate;
                weeksDue = setWeeksDueWithDates();
                colaDue = this.rates[rateYear]["COLA"]*(weeksDue)*this.compRate;
                benPeriod = {
                    "year": rateYear,
                    "begin": begDate,
                    "end": endDate,
                    "wd": weeksDue,
                    "cr": compRate,
                    "cd": colaDue
                    
                };
                this.colaPeriods.push(benPeriod);
                rateYear = rateYear + 1;
                this.colaDue = this.colaDue + colaDue;
                this.compRate = (1 + this.rates[rateYear]["COLA"])*this.compRate;

            }
            return this.colaDue;
    }

    this.setRateYear = setRateYear;

    function setRateYear(x) {
        var accDate = new Date(x);
        var rateYear = accDate.getFullYear();
        var month = accDate.getMonth() + 1;
        if (month < 7) {
            rateYear = rateYear - 1;
            this.rateYear = String(rateYear);
        } else {
            this.rateYear = String(rateYear);
        }
        return this.rateYear;
    }

    this.setCompRate = setCompRate;
    function setCompRate() {
        var rateYear = setRateYear(this.DOI);
        if ((this.AWW - this.PWW) < this.rates[rateYear]["MIN"]) {
            this.compRate = (this.AWW - this.PWW);
        } else {
            if (this.benType == "TP") {
                this.compRate = (this.AWW - this.PWW) * (2 / 3);
            } else {
                this.compRate = (this.AWW * (2 / 3));
            }
            this.compRate = Math.round(this.compRate * 100)/100;
            if (this.compRate > this.rates[rateYear]["MAX"]) {
                this.compRate = this.rates[rateYear]["MAX"];
            } else if (this.compRate < this.rates[rateYear]["MIN"]) {
                this.compRate = this.rates[rateYear]["MIN"];
            }
        }
        return this.compRate;
    }

    this.getCompDue = getCompDue; 

    function getCompDue() {
        var compDue = this.weeksDue * this.compRate;
        compDue = Math.round(compDue * 100);
        compDue = compDue / 100;
        return compDue;

    }

    this.getWeeksPP = getWeeksPP; /* Passed test, BUT body part needs to be an array not pulled from HTML */

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


