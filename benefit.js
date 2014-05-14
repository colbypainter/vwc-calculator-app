

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
    this.colaDue = 0;
    this.maxInEffect = "";
    this.compoundedCompRate = "";
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
    "2014": {"COLA": "1.5", "MAX": "967", "MIN": "241.75"},
    "2015": {"COLA": " ", "MAX": " ", "MIN": " "},
    "2016": {"COLA": " ", "MAX": " ", "MIN": " "},
    "2017": {"COLA": " ", "MAX": " ", "MIN": " "},
    "2018": {"COLA": " ", "MAX": " ", "MIN": " "},
    "2019": {"COLA": " ", "MAX": " ", "MIN": " "},
    "2020": {"COLA": " ", "MAX": " ", "MIN": " "},
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
        /* startYear is the year of the benefit start date */
        var startYear = new Date(this.startDate);
        startYear = startYear.getFullYear();
        /* endYear is the year of the benefit end date */
        var endYear = new Date(this.endDate);
        endYear = endYear.getFullYear();
        /* since start date changes through the function, store the start date here permanently */
        var permStartDate = new Date(this.startDate);
        /* begDate is the benefit start date. it will change throughout the function */
        var begDate = this.startDate;
        /* store the begin date here permanently */
        var permBegDate = this.startDate;
        /* endDate is the benefit end date. it will change throughout the function */
        var endDate = this.endDate;
        /* pull weeks due from the form */
        var weeksDue = this.weeksDue;
        /* initialize the cola amount */
        var cola = 0;
        /* initialize colaDue */
        var colaDue = this.colaDue;
        /* pull comp rate from the form and convert it to a number */
        var compRate = Number(this.compRate);
        /* create an empty object to store benefit periods before pushing them to colaPeriods */
        var benPeriod = {};
        /* initialize the accident date */
        var DOI = new Date(this.DOI);
        /* no cola benefits are eligible for accidents prior to 07/01/75 */
        var colaYearOne = new Date("07/01/1975");
        /* initialize previous rate. this will go up throughout the function */
        var prevRate = this.compRate;
        /* use incYear to iterate the year up in the MAX branch without changing the start date */
        var incYear = startYear;
        /* don't know what tempRateYear is for, should probably kill it */
        var tempRateYear = rateYear;
        /* get the rate year for the year of the benefit start date */
        var startRateYear = setRateYear(begDate);
        /* effective rate year will be adjusted throughout the run of benefits */
        var effectiveRateYear = setRateYear(begDate);
        /* permanent start rate year for the A block */
        var permStartRateYear = startRateYear;
        /* use the next two variables to prevent blocks from running if the newest start */
        var startDateDate = new Date(begDate);
        var endDateDate = new Date(endDate);
        /* cola rate variable to increase the rate through each iteration */
        var colaRate = 0;
        /* don't know the purpose here, kill it */
        this.rateYear = tempRateYear;
        /* REVISIT ASAP: Handles edge case where first year exceeds the max cola. Adds an empty benefit so the resulting array still
        begins at [1]. 
        */

        if ((Number(this.compRate) > Number(this.rates[startRateYear]["MAX"])) && (Number(rateYear) > 1974 && Number(rateYear) <= startYear)) {
            benPeriod = {};
            this.colaPeriods.push(benPeriod);
            colaRate = Number(this.rates[String(Number(rateYear) + 1)]["COLA"]) / 100;
            this.compRate = (1 + colaRate) * this.compRate;
        } else if((Number(this.compRate) > Number(this.rates[startRateYear]["MAX"])) && (Number(rateYear) > 1974 && Number(rateYear) == startYear)) {
            benPeriod = {};
            this.colaPeriods.push(benPeriod);
            colaRate = Number(this.rates[rateYear]["COLA"]) / 100;
            this.compRate = (1 + colaRate) * this.compRate;
            /*
            console.log(benPeriod);
            */

        }
        /* A:0 If Accident Date is before 07/01/75, it is COLA ineligible */
        if (DOI.getTime() < colaYearOne.getTime()) {
            this.colaDue = 0;
        }
        /* B: Run through each rate year from Accident Date through the beginning of the benefit, generating benefits
the full length of the benefit. */
        while (rateYear > 1974 && rateYear < startYear) {
            /* B:1 If rate exceeds maximum allowed for the rate year, use this block to break down into yearly bens*/
            while ((this.compRate > this.rates[effectiveRateYear]["MAX"]) && (rateYear > 1974 && rateYear < startYear)) {
                begDate = this.startDate;
                endDate = this.endDate;
                incYear = startYear + 1;
                var endDateDate = new Date(endDate);
                var beginDateDate = new Date(begDate);
                /* Since we are in the MAX block, this checks to see if the end date is in another year. If
so, end the benefit at 06/30 of the current year */
                if (endDateDate.getFullYear() > Number(rateYear) && beginDateDate.getMonth() >= 6) {
                    endDate = "06" + "/" + "30" + "/" + incYear;
                } else if (endDateDate.getFullYear() > Number(rateYear) && beginDateDate.getMonth() < 6) {
                    endDate = "06" + "/" + "30" + "/" + (incYear - 1);
                    incYear = incYear - 1;
                }
                var currentEndDate = new Date(endDate);
                if (currentEndDate.getTime() > endDateDate.getTime()) {
                    endDate = this.endDate;
                }
                weeks = getWeeks(begDate, endDate);
                compRate = Number(this.compRate);

                effectiveRateYear = String(setRateYear(beginDateDate));
                /* Determine the COLA amount */
                if (Number(prevRate) > Number(this.rates[effectiveRateYear]["MAX"]) && compRate > Number(this.rates[effectiveRateYear]["MAX"])) {
                    cola = 0;
                } else if(compRate > Number(this.rates[effectiveRateYear]["MAX"])) {
                    cola = Number(this.rates[effectiveRateYear]["MAX"]) - prevRate;
                } else {
                    cola = compRate - prevRate;
                }
                colaDue = weeks * (Math.round(cola*100)/100);

                benPeriod = {
                        "year": rateYear,
                        "test": "a",
                        "begin": begDate,
                        "end": endDate,
                        "weeks-due": weeks,
                        "cola": Math.round(cola * 100) / 100,
                        "comp-rate": Math.round(compRate * 100) / 100,
                        "cola-due": Math.round(colaDue * 100) / 100,
                        "previous-rate": Math.round(prevRate * 100) / 100,
                        "max": this.rates[effectiveRateYear]["MAX"],
                        "cola-rate": this.rates[rateYear]["COLA"]
                };
                this.maxInEffect = this.rates[effectiveRateYear]["MAX"];
                this.compoundedCompRate = Math.round(compRate * 100) / 100;
                this.colaDue = this.colaDue + Number(colaDue);

                /*
                    console.log(benPeriod);
                */

                this.colaPeriods.push(benPeriod);
                /* This block will run the remaining weeks out for the rate year */
                if (endDateDate.getFullYear() > Number(rateYear)) {
                    /* This won't work, must figure out the while loop criteria */
                    var localRateYear = rateYear;
                    while (localRateYear <= endYear && currentEndDate.getTime() < endDateDate.getTime()) {
                        var weeks = 0;
                        begDate = "07" + "/" + "01" + "/" + incYear;
                        weeksDue = getWeeks(begDate, endDate)
                        incYear = String(Number(incYear) + 1);
                        startRateYear = String(Number(startRateYear) + 1);

                        effectiveRateYear = String(setRateYear(begDate));
                        if ((this.compRate > this.rates[effectiveRateYear]["MAX"]) && (rateYear > 1974 && localRateYear < startYear)) {
                            endDate = "06" + "/" + "30" + "/" + incYear;
                            var localCurrentEndDate = new Date(endDate);
                            if (localCurrentEndDate.getTime() > endDateDate.getTime()) {
                                endDate = this.endDate;
                            }
                            weeks = getWeeks(begDate, endDate);
                            effectiveRateYear = String(setRateYear(begDate));
                            /* Determine the COLA amount */
                            if (Number(prevRate) > Number(this.rates[effectiveRateYear]["MAX"]) && compRate > Number(this.rates[effectiveRateYear]["MAX"])) {
                                cola = 0;
                            } else if(compRate > Number(this.rates[effectiveRateYear]["MAX"])) {
                                cola = Number(this.rates[effectiveRateYear]["MAX"]) - prevRate;
                            } else {
                                cola = compRate - prevRate;
                            }
                            colaDue = weeks * (Math.round(cola*100)/100);

                            benPeriod = {
                                "year": rateYear,
                                "localrate": localRateYear,
                                "startrateyear": startRateYear,
                                "effectiveRateYear": effectiveRateYear,
                                "test": "a-1",
                                "begin": begDate,
                                "end": endDate,
                                "weeks-due": weeks,
                                "cola": Math.round(cola * 100) / 100,
                                "comp-rate": Math.round(compRate * 100) / 100,
                                "cola-due": Math.round(colaDue * 100) / 100,
                                "previous-rate": Math.round(prevRate * 100) / 100,
                                "max": this.rates[effectiveRateYear]["MAX"],
                                "cola-rate": this.rates[rateYear]["COLA"]
                            };
                            this.maxInEffect = this.rates[effectiveRateYear]["MAX"];
                            this.compoundedCompRate = Math.round(compRate * 100) / 100;
                            this.colaPeriods.push(benPeriod);
                            this.colaDue = this.colaDue + Number(colaDue);

                            /*
                            console.log(benPeriod);
                            */

                            this.startDate = "07" + "/" + "01" + "/" + incYear;
                            localRateYear = Number(localRateYear) + 1;
                            currentEndDate = new Date(endDate);
                            
                            } else {
                                endDate = this.endDate;
                                weeks = getWeeks(begDate, endDate);
                                /* Determine the COLA amount */
                                if (Number(prevRate) > Number(this.rates[effectiveRateYear]["MAX"]) && compRate > Number(this.rates[effectiveRateYear]["MAX"])) {
                                    cola = 0;
                                } else if(compRate > Number(this.rates[effectiveRateYear]["MAX"])) {
                                    cola = Number(this.rates[effectiveRateYear]["MAX"]) - prevRate;
                                } else {
                                    cola = compRate - prevRate;
                                }
                                colaDue = weeks * (Math.round(cola*100)/100);
                                localRateYear = endYear;
                                benPeriod = {
                                    "year": rateYear,
                                        "test": "a-2",
                                        "begin": begDate,
                                        "end": endDate,
                                        "weeks-due": weeks,
                                        "cola": Math.round(cola * 100) / 100,
                                        "comp-rate": Math.round(compRate * 100) / 100,
                                        "cola-due": Math.round(colaDue * 100) / 100,
                                        "previous-rate": Math.round(prevRate * 100) / 100,
                                        "max": this.rates[effectiveRateYear]["MAX"],
                                        "cola-rate": this.rates[rateYear]["COLA"]
                                };
                                this.maxInEffect = this.rates[effectiveRateYear]["MAX"];
                                this.compoundedCompRate = Math.round(compRate * 100) / 100;
                                this.colaPeriods.push(benPeriod);
                                this.colaDue = this.colaDue + Number(colaDue);

                                /*
                                console.log(benPeriod);
                                */

                                this.startDate = "07" + "/" + "01" + "/" + incYear;
                                localRateYear = Number(localRateYear) + 1;
                                currentEndDate = new Date(endDate);
                            }
                    }
                }
                rateYear = String(Number(rateYear) + 1);
                colaRate = Number(this.rates[rateYear]["COLA"]) / 100;
                prevRate = this.compRate;
                this.compRate = (1 + colaRate) * this.compRate;
                /* This might mess things up, trying to fix the 06/05 bug */
                if (rateYear == startYear - 1 && permStartDate.getMonth() < 6) {
                    this.startDate = "10" + "/" + "01" + "/" + startYear;
                } else {
                    this.startDate = String(Number(permStartDate.getMonth() + 1)) + "/" + String(permStartDate.getDate()) + "/" + startYear;
                }

                incYear = rateYear;
                effectiveRateYear = new Date(this.startDate);
                effectiveRateYear = setRateYear(effectiveRateYear);
                startDateDate = new Date (this.startDate);
            }
            /* B:2 If rate is below max, run the benefit with same begin and end for each rate year until the start date year */
            while ((this.compRate <= this.rates[effectiveRateYear]["MAX"]) && (rateYear > 1974 && rateYear < startYear)) {

                begDate = this.startDate;
                endDate = this.endDate;
                effectiveRateYear = String(setRateYear(begDate));
                this.setWeeksDueWithDates();
                compRate = Number(this.compRate);
                weeksDue = this.weeksDue;
                cola = compRate - prevRate;
                colaDue = (Math.round(cola*100)/100) * (weeksDue);
                benPeriod = {
                    "year": rateYear,
                        "test": "b",
                        "begin": begDate,
                        "end": endDate,
                        "weeks-due": weeksDue,
                        "cola": Math.round(cola * 100) / 100,
                        "comp-rate": Math.round(compRate * 100) / 100,
                        "cola-due": Math.round(colaDue * 100) / 100,
                        "previous-rate": Math.round(prevRate * 100) / 100,
                        "max": this.rates[effectiveRateYear]["MAX"],
                        "cola-rate": this.rates[rateYear]["COLA"]
                };
                this.maxInEffect = this.rates[effectiveRateYear]["MAX"];
                this.compoundedCompRate = Math.round(compRate * 100) / 100;
                this.colaPeriods.push(benPeriod);
                this.colaDue = this.colaDue + Number(colaDue);

                /*
                console.log(benPeriod);
                */

                rateYear = String(Number(rateYear) + 1);
                colaRate = Number(this.rates[rateYear]["COLA"]) / 100;
                prevRate = this.compRate;
                this.compRate = (1 + colaRate) * this.compRate;
            }
        }
        /* C: Iterate through rate years for all years from benefit start year through benefit end year */
        while (rateYear >= startYear && rateYear <= endYear) {
            while ((this.compRate > this.rates[rateYear]["MAX"]) && (rateYear >= startYear && rateYear <= endYear)) {
                begDate = this.startDate;
                var startMonth = new Date(begDate);
                startMonth = startMonth.getMonth() + 1;
                endDate = this.endDate;

                if(rateYear != startYear || startMonth < 10 && (Number(permStartDate.getMonth()) + 1) < 10) {
                    begDate = "10" + "/" + "01" + "/" + rateYear;
                }
                this.startDate = begDate;
                begDate = this.startDate;
                endDate = this.endDate;
                var endDateDate = new Date(endDate);
                if (endDateDate.getFullYear() > Number(rateYear)) {
                    endDate = "06" + "/" + "30" + "/" + String(Number(rateYear) + 1);
                }
                var currentEndDate = new Date(endDate);
                if (currentEndDate.getTime() > endDateDate.getTime()) {
                    endDate = this.endDate;
                }
                var tempEndDate = this.endDate;
                this.endDate = endDate;
                this.setWeeksDueWithDates();
                this.endDate = tempEndDate;
                compRate = Number(this.compRate);
                /* Determine the COLA amount */
                if (Number(prevRate) > Number(this.rates[rateYear]["MAX"]) && compRate > Number(this.rates[rateYear]["MAX"])) {
                    cola = 0;
                } else if(compRate > Number(this.rates[rateYear]["MAX"])) {
                    cola = Number(this.rates[rateYear]["MAX"]) - prevRate;
                } else {
                    cola = compRate - prevRate;
                }
                colaDue = this.weeksDue * (Math.round(cola*100)/100);
                weeksDue = this.weeksDue;
                benPeriod = {
                    "year": rateYear,
                        "test": "c",
                        "rate": rateYear,
                        "begin": begDate,
                        "incYear": incYear,
                        "end": endDate,
                        "weeks-due": weeksDue,
                        "cola": Math.round(cola * 100) / 100,
                        "comp-rate": Math.round(compRate * 100) / 100,
                        "cola-due": Math.round(colaDue * 100) / 100,
                        "previous-rate": Math.round(prevRate * 100) / 100,
                        "max": this.rates[rateYear]["MAX"],
                        "cola-rate": this.rates[rateYear]["COLA"]
                };

                /*
                    console.log(benPeriod);
                */

                /* This should probably be handled differently, but the final year, if the start date is after end date,
                weeks due will be negative. Since this should be the last benefit that runs, just don't push it.
                But will probably cause issues with the comp rate if this non-created benefit isn't the last one. */
                if (weeksDue > 0) {
                    this.colaPeriods.push(benPeriod);
                    this.colaDue = this.colaDue + Number(colaDue);
                    this.maxInEffect = this.rates[rateYear]["MAX"];
                    this.compoundedCompRate = Math.round(compRate * 100) / 100;
                }
                /* This block will run the remaining weeks out for the rate year */
                if (endDateDate.getFullYear() > Number(rateYear)) {

                    var localRateYear = rateYear;
                    while (localRateYear <= endYear && currentEndDate.getTime() <= endDateDate.getTime()) {
                        var weeks = 0;
                        incYear = String(Number(incYear) + 1);
                        begDate = "07" + "/" + "01" + "/" + String(Number(localRateYear) + 1);
                        weeksDue = getWeeks(begDate, endDate)

                        effectiveRateYear = String(setRateYear(begDate));
                        startRateYear = String(Number(startRateYear) + 1);
                        if ((compRate > this.rates[effectiveRateYear]["MAX"]) && (rateYear > 1974 && localRateYear <= (startYear + 2))) {
                            endDate = "06" + "/" + "30" + "/" + String(Number(localRateYear) + 2);
                            weeks = getWeeks(begDate, endDate);
                            effectiveRateYear = String(setRateYear(begDate));
                            /* Determine the COLA amount */
                            if (Number(prevRate) > Number(this.rates[effectiveRateYear]["MAX"]) && compRate > Number(this.rates[effectiveRateYear]["MAX"])) {
                                cola = 0;
                            } else if(compRate > Number(this.rates[effectiveRateYear]["MAX"])) {
                                cola = Number(this.rates[effectiveRateYear]["MAX"]) - prevRate;
                            } else {
                                cola = compRate - prevRate;
                            }
                            colaDue = weeks * (Math.round(cola*100)/100);

                            benPeriod = {
                                "year": rateYear,
                                    "localrate": localRateYear,
                                    "startrateyear": startRateYear,
                                    "effectiveRateYear": effectiveRateYear,
                                    "test": "c-1",
                                    "begin": begDate,
                                    "end": endDate,
                                    "weeks-due": weeks,
                                    "cola": Math.round(cola * 100) / 100,
                                    "comp-rate": Math.round(compRate * 100) / 100,
                                    "cola-due": Math.round(colaDue * 100) / 100,
                                    "previous-rate": Math.round(prevRate * 100) / 100,
                                    "max": this.rates[effectiveRateYear]["MAX"],
                                    "cola-rate": this.rates[rateYear]["COLA"]
                            };
                            this.maxInEffect = this.rates[effectiveRateYear]["MAX"];
                            this.compoundedCompRate = Math.round(compRate * 100) / 100;
                            this.colaPeriods.push(benPeriod);
                            /*
                            console.log(benPeriod);
                            */ 
                            
                            this.colaDue = this.colaDue + Number(colaDue);
                            this.startDate = "07" + "/" + "01" + "/" + incYear;
                            localRateYear = Number(localRateYear) + 1;
                            
                            } else {
                                endDate = this.endDate;
                                weeks = getWeeks(begDate, endDate);
                                localRateYear = endYear;
                                /* Determine the COLA amount */
                                if (Number(prevRate) > Number(this.rates[effectiveRateYear]["MAX"]) && compRate > Number(this.rates[effectiveRateYear]["MAX"])) {
                                    cola = 0;
                                } else if(compRate > Number(this.rates[effectiveRateYear]["MAX"])) {
                                    cola = Number(this.rates[effectiveRateYear]["MAX"]) - prevRate;
                                } else {
                                    cola = compRate - prevRate;
                                }
                                colaDue = weeks * (Math.round(cola*100)/100);
                                benPeriod = {
                                    "year": rateYear,
                                        "test": "c-2",
                                        "begin": begDate,
                                        "localrate": localRateYear,
                                        "end": endDate,
                                        "weeks-due": weeks,
                                        "cola": Math.round(cola * 100) / 100,
                                        "comp-rate": Math.round(compRate * 100) / 100,
                                        "cola-due": Math.round(colaDue * 100) / 100,
                                        "previous-rate": Math.round(prevRate * 100) / 100,
                                        "max": this.rates[effectiveRateYear]["MAX"],
                                        "cola-rate": this.rates[rateYear]["COLA"]
                                };
                                this.maxInEffect = this.rates[effectiveRateYear]["MAX"];
                                this.compoundedCompRate = Math.round(compRate * 100) / 100;
                                this.colaPeriods.push(benPeriod);
                                this.colaDue = this.colaDue + Number(colaDue);

                                
                                // console.log(benPeriod);
                                

                                this.startDate = "07" + "/" + "01" + "/" + incYear;
                                localRateYear = Number(localRateYear) + 1;
                                
                            }
                        }
                }
                rateYear = String(Number(rateYear) + 1);
                colaRate = Number(this.rates[rateYear]["COLA"]) / 100;
                prevRate = this.compRate;
                this.compRate = (1 + colaRate) * this.compRate;
                this.startDate = String(Number(permStartDate.getMonth() + 1)) + "/" + String(permStartDate.getDate()) + "/" + rateYear;
                incYear = rateYear;
            }
            while ((this.compRate <= this.rates[rateYear]["MAX"]) && (rateYear >= startYear && rateYear <= endYear)) {
                begDate = this.startDate;
                var startMonth = new Date(begDate);
                startMonth = startMonth.getMonth() + 1;
                endDate = this.endDate;
                
                /*
                if (startMonth < 10 && (Number(permStartDate.getMonth()) + 1) < 10) {
                */
                if(rateYear != startYear || startMonth < 10 && (Number(permStartDate.getMonth()) + 1) < 10) {
                    begDate = "10" + "/" + "01" + "/" + rateYear;
                }
                /*
                } else if (startMonth < 10 && (Number(permStartDate.getMonth()) + 1) > 10 && ((Number(permStartDate.getMonth()) + 1) <= 12)) {
                begDate = String(Number(permStartDate.getMonth() + 1)) + "/" + String(permStartDate.getDate()) + "/" + rateyear;
                }
                */
                this.startDate = begDate;
                this.setWeeksDueWithDates();
                compRate = Number(this.compRate);
                weeksDue = this.weeksDue;
                cola = compRate - prevRate;
                colaDue = (Math.round(cola*100)/100) * (weeksDue);
                benPeriod = {
                    "year": rateYear,
                        "test": "d",
                        "begin": begDate,
                        "end": endDate,
                        "weeks-due": weeksDue,
                        "cola": Math.round(cola * 100) / 100,
                        "comp-rate": Math.round(compRate * 100) / 100,
                        "cola-due": Math.round(colaDue * 100) / 100,
                        "previous-rate": Math.round(prevRate * 100) / 100,
                        "max": this.rates[rateYear]["MAX"],
                        "cola-rate": this.rates[rateYear]["COLA"]
                };
                if (weeksDue > 0) {
                    this.colaPeriods.push(benPeriod);
                    this.colaDue = this.colaDue + Number(colaDue);
                    this.maxInEffect = this.rates[rateYear]["MAX"];
                    this.compoundedCompRate = Math.round(compRate * 100) / 100;
                }

                /*
                    console.log(benPeriod);
                */

                rateYear = String(Number(rateYear) + 1);
                colaRate = Number(this.rates[rateYear]["COLA"]) / 100;
                prevRate = this.compRate;
                this.compRate = (1 + colaRate) * this.compRate;
                begDate = new Date(begDate);
                var begMonth = String(begDate.getMonth() + 1);
                var begDay = String(begDate.getDate());
                var begYear = String(begDate.getFullYear() + 1);
                this.startDate = String(begMonth + "/" + begDay + "/" + begYear);
            }
        }

        this.colaDue = Math.round(this.colaDue * 100)/100;
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
        if (Number(this.AWW - this.PWW) < Number(this.rates[rateYear]["MIN"]) && this.benType == "TP") {
            this.compRate = (this.AWW - this.PWW)*(2/3);
            this.compRate = Math.round(this.compRate * 100)/100;
        } else if (Number(this.AWW) < Number(this.rates[rateYear]["MIN"])) {
            this.compRate = this.AWW;
        } else {
            this.compRate = (this.AWW - this.PWW) * (2 / 3);
            this.compRate = Math.round(this.compRate * 100)/100;
            if (this.compRate > this.rates[rateYear]["MAX"]) {
                this.compRate = this.rates[rateYear]["MAX"];
            } else if (this.compRate < this.rates[rateYear]["MIN"] && this.benType != "TP") {
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

    this.getWeeksPP = getWeeksPP; 

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