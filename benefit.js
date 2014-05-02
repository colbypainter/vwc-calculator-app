

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
    this.colaPeriods = [];

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
    "2014": {"COLA": "1.5", "MAX": "967", "MIN": "241.75"}
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
        var rateYear = setRateYear(this.DOI);
        console.log(rateYear);
        var startYear = new Date(this.startDate);
        startYear = startYear.getFullYear();
        var endYear = new Date(this.endDate);
        endYear = endYear.getFullYear();
        var permStartDate = new Date (this.startDate);
        var begDate = this.startDate;
        var permBegDate = this.startDate;
        var endDate = this.endDate;
        var weeksDue = this.weeksDue;
        var cola = 0;
        var colaDue = this.colaDue;
        var compRate = Number(this.compRate);
        var benPeriod = {};
        var DOI = new Date(this.DOI);
        var colaYearOne = new Date("07/01/1975");
        var prevRate = this.compRate;
        var incYear = String(startYear);
        var tempRateYear = rateYear;
        var startRateYear = setRateYear(begDate);
        console.log(startRateYear);
        this.rateYear = tempRateYear;

        /* Handles corner case where first year exceeds the max cola. Adds an empty benefit so the resulting array still 
           begins at [1]
           */
        if ((this.compRate > this.rates[startRateYear]["MAX"]) && (rateYear > 1974 && rateYear < startYear)) {
            benPeriod = {};
            this.colaPeriods.push(benPeriod);
        }

        /* A:0 If Accident Date is before 07/01/75, it is COLA ineligible */
        if (DOI.getTime() < colaYearOne.getTime()) {
            this.colaDue = 0;
        }
        /* B: Run through each rate year from Accident Date through the beginning of the benefit, generating benefits
the full length of the benefit. */
                while (rateYear > 1974 && rateYear < startYear) {
                    /* B:1 If rate exceeds maximum allowed for the rate year, use this block to break down into yearly bens*/
                    
                        while ((this.compRate > this.rates[startRateYear]["MAX"]) && (rateYear > 1974 && rateYear < startYear)) {
                            begDate = this.startDate;
                            endDate = this.endDate;
                            var endDateDate = new Date(endDate);
                            if (endDateDate.getFullYear() > Number(rateYear)) {
                                endDate = "06" + "/" + "30" + "/" + incYear;
                            }
                            weeksDue = getWeeks(begDate, endDate);
                            compRate = Number(this.compRate);
                            var effectiveRateYear = "";
                            if (rateYear > startRateYear) {
                                effectiveRateYear = rateYear;
                            } else {
                                effectiveRateYear = startRateYear;
                            }
                            if (Number(prevRate) > Number(this.rates[effectiveRateYear]["MAX"])) {
                                cola = 0;
                            } else {
                                cola = compRate - prevRate;
                            }
                            colaDue = this.weeksDue * cola;
                            
                            benPeriod = {
                                "year": rateYear,
                                "test": "a",
                                "begin": begDate,
                                "end": endDate,
                                "weeks-due": weeksDue,
                                "cola": cola,
                                "comp-rate": compRate,
                                "cola-due": colaDue,
                                "previous-rate": prevRate,
                                "max": this.rates[effectiveRateYear]["MAX"],
                                "cola-rate": this.rates[rateYear]["COLA"]
                            };
                            console.log(benPeriod);
                            this.colaPeriods.push(benPeriod);

                            /* This block will run the remaining weeks out for the rate year */
                            if (endDateDate.getFullYear() > Number(rateYear)) {
                                var localWeeks = 0;
                                var localRateYear = rateYear;
                                while (localWeeks <= weeksDue) {
                                    var weeks = 0;
                                    begDate = "07" + "/" + "01" + "/" + incYear;
                                    weeksDue = getWeeks(begDate, endDate)
                                    incYear = String(Number(incYear) + 1);
                                    startRateYear = String(Number(startRateYear) + 1);
                                    if (localRateYear > startRateYear) {
                                        effectiveRateYear = localRateYear;
                                    } else {
                                        effectiveRateYear = startRateYear;
                                    }
                                    if ((this.compRate > this.rates[effectiveRateYear]["MAX"]) && (rateYear > 1974 && localRateYear < startYear)) {
                                    endDate = "06" + "/" + "30" + "/" + incYear;
                                    weeks = getWeeks(begDate, endDate);
                                    if (getWeeks(begDate, this.endDate) < weeks) {
                                        endDate = this.endDate;
                                    }

                                    benPeriod = {
                                        "year": rateYear,
                                        "localrate": localRateYear,
                                        "startrateyear": startRateYear,
                                        "effectiveRateYear": effectiveRateYear,
                                        "test": "a-1",
                                        "begin": begDate,
                                        "end": endDate,
                                        "weeks-due": weeks,
                                        "cola": cola,
                                        "comp-rate": compRate,
                                        "cola-due": colaDue,
                                        "previous-rate": prevRate,
                                        "max": this.rates[effectiveRateYear]["MAX"],
                                        "cola-rate": this.rates[rateYear]["COLA"]
                                    };
                                    this.colaPeriods.push(benPeriod);
                                    localWeeks = weeks + localWeeks;
                                    this.startDate = "07" + "/" + "01" + "/" + incYear;
                                    localRateYear = Number(localRateYear) + 1;
                                    

                                    } else {
                                        endDate = this.endDate;
                                        weeks = getWeeks(begDate, endDate);

                                        benPeriod = {
                                            "year": rateYear,
                                            "test": "a-2",
                                            "begin": begDate,
                                            "end": endDate,
                                            "weeks-due": weeks,
                                            "cola": cola,
                                            "comp-rate": compRate,
                                            "cola-due": colaDue,
                                            "previous-rate": prevRate,
                                            "max": this.rates[effectiveRateYear]["MAX"],
                                            "cola-rate": this.rates[rateYear]["COLA"]
                                        };
                                        this.colaPeriods.push(benPeriod);
                                        localWeeks = localWeeks + weeks;
                                        this.startDate = "07" + "/" + "01" + "/" + incYear;
                                        localRateYear = Number(localRateYear) + 1;
                                        
                                    }
                                }
                            }


                            rateYear = String(Number(rateYear) + 1);
                            this.startDate = String(Number(permStartDate.getMonth() + 1)) + "/" + String(permStartDate.getDate()) + "/" + incYear;
                            incYear = String(Number(incYear) + 1);
                            }

                        /* B:2 If rate is below max, run the benefit with same begin and end for each rate year until the start date year */
                        while ((this.compRate < this.rates[startRateYear]["MAX"]) && (rateYear > 1974 && rateYear < startYear)) {
                        
                            begDate = this.startDate;
                            endDate = this.endDate;
                            this.setWeeksDueWithDates();
                            compRate = Number(this.compRate);
                            weeksDue = this.weeksDue;
                            cola = compRate - prevRate;
                            colaDue = cola*(weeksDue);
                            benPeriod = {
                                "year": rateYear,
                                "test": "b",
                                "begin": begDate,
                                "end": endDate,
                                "weeks-due": weeksDue,
                                "cola": cola,
                                "comp-rate": compRate,
                                "cola-due": colaDue,
                                "previous-rate": prevRate,
                                "max": this.rates[startRateYear]["MAX"],
                                "cola-rate": this.rates[rateYear]["COLA"]
                            };
                            this.colaPeriods.push(benPeriod);
                            rateYear = String(Number(rateYear) + 1);
                            this.colaDue = this.colaDue + colaDue;
                            var colaRate = Number(this.rates[rateYear]["COLA"])/100;
                            prevRate = this.compRate;
                            this.compRate = (1 + colaRate)*this.compRate;
                            }
                        }
            /* C: Iterate through rate years for all years from benefit start year through benefit end year */

            while (rateYear >= startYear && rateYear < endYear) {
                        while ((this.compRate > this.rates[rateYear]["MAX"]) && (rateYear >= startYear && rateYear < endYear)) {
                            begDate = this.startDate;
                            endDate = this.endDate;
                            var endDateDate = new Date(endDate);
                            if (endDateDate.getFullYear() > Number(rateYear)) {
                                endDate = "06" + "/" + "30" + "/" + incYear;
                            }
                            var tempEndDate = this.endDate;
                            this.endDate = endDate;
                            this.setWeeksDueWithDates();
                            this.endDate = tempEndDate;
                            compRate = Number(this.compRate);
                            if (Number(prevRate) > Number(this.rates[rateYear]["MAX"])) {
                                cola = 0;
                            } else {
                                cola = compRate - prevRate;
                            }
                            colaDue = this.weeksDue * cola;
                            weeksDue = this.weeksDue;
                            benPeriod = {
                                "year": rateYear,
                                "test": "c",
                                "begin": begDate,
                                "end": endDate,
                                "weeks-due": weeksDue,
                                "cola": cola,
                                "comp-rate": compRate,
                                "cola-due": colaDue,
                                "previous-rate": prevRate,
                                "max": this.rates[rateYear]["MAX"],
                                "cola-rate": this.rates[rateYear]["COLA"]
                            };
                            console.log(benPeriod);
                            this.colaPeriods.push(benPeriod);
                            rateYear = String(Number(rateYear) + 1);
                            this.startDate = "07" + "/" + "01" + "/" + incYear;
                            incYear = String(Number(incYear) + 1);
                            }

                    while ((this.compRate < this.rates[rateYear]["MAX"]) && (rateYear >= startYear && rateYear < endYear)) {
                            begDate = this.startDate;
                            var startMonth = new Date(begDate);
                            startMonth = startMonth.getMonth() + 1;
                            endDate = this.endDate;
                            if (startMonth < 10 && (Number(permStartDate.getMonth()) + 1) < 10) {
                                begDate = "10" + "/" + "01" + "/" + rateYear;
                            } else if (startMonth < 10 && (Number(permStartDate.getMonth()) + 1) > 10 && ((Number(permStartDate.getMonth()) + 1) <= 12)) {
                                begDate = String(Number(permStartDate.getMonth() + 1)) + "/" + String(permStartDate.getDate()) + "/" + rateyear;
                            }
                            this.startDate = begDate;
                            this.setWeeksDueWithDates();
                            compRate = Number(this.compRate);
                            weeksDue = this.weeksDue;
                            cola = compRate - prevRate;
                            colaDue = cola*(weeksDue);
                            benPeriod = {
                                "year": rateYear,
                                "test": "d",
                                "begin": begDate,
                                "end": endDate,
                                "weeks-due": weeksDue,
                                "cola": cola,
                                "comp-rate": compRate,
                                "cola-due": colaDue,
                                "previous-rate": prevRate,
                                "max": this.rates[rateYear]["MAX"],
                                "cola-rate": this.rates[rateYear]["COLA"]
                            };
                            this.colaPeriods.push(benPeriod);
                            rateYear = String(Number(rateYear) + 1);
                            this.colaDue = this.colaDue + colaDue;
                            var colaRate = Number(this.rates[rateYear]["COLA"])/100;
                            prevRate = this.compRate;
                            this.compRate = (1 + colaRate)*this.compRate;
                            begDate = new Date(begDate);
                            var begMonth = String(begDate.getMonth() + 1);
                            var begDay = String(begDate.getDate());
                            var begYear = String(begDate.getFullYear() + 1);
                            this.startDate = String(begMonth + "/" + begDay + "/" + begYear);
                        }
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
            if (this.benType = "TP") {
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

/* Gets the amount still due after an amount has already been paid */
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

/* Identical to the this.setWeeksDueWithDates, only it takes arguments and doesn't update the object. */
function getWeeks(x, y) {
    var startDate = new Date(x);
    var endDate = new Date(y);
    var daysDue = endDate.getTime() - startDate.getTime();
    daysDue = daysDue / 1000 / 60 / 60 / 24;
    daysDue = Math.round(daysDue);
    daysDue = daysDue + 1;
    var weeksDue = daysDue / 7;
    /* Round Weeks Due to 5 decimal places */
    weeksDue = Math.round(weeksDue * 100000);
    weeksDue = weeksDue / 100000;
    return weeksDue;
}

