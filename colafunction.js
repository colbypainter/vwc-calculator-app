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
        var incYear = String(startYear);
        /* don't know what tempRateYear is for, should probably kill it */
        var tempRateYear = rateYear;
        /* get the rate year for the year of the benefit start date */
        var startRateYear = setRateYear(begDate);
        /* don't know the purpose here, kill it */
        this.rateYear = tempRateYear;

        /* Handles edge case where first year exceeds the max cola. Adds an empty benefit so the resulting array still 
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
            /* B:1 MAX BLOCK */
            while ((this.compRate > this.rates[startRateYear]["MAX"]) && (rateYear > 1974 && rateYear < startYear)) {
                begDate = this.startDate;
                endDate = this.endDate;
                var endDateDate = new Date(endDate);
                /* Is end date in another year?  If so, end the benefit at 06/30 of the current year */
                if (endDateDate.getFullYear() > Number(rateYear)) {
                    endDate = "06" + "/" + "30" + "/" + incYear;
                }
                weeksDue = getWeeks(begDate, endDate);
                compRate = Number(this.compRate);
                var effectiveRateYear = "";
                /* This will determine what rate to use based on whether the current start date is greater 
                               than the initial year */
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
                colaDue = weeksDue * cola;
                benPeriod = {
                    "year": rateYear,
                        "test": "a",
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
                console.log(benPeriod);
                this.colaPeriods.push(benPeriod);

                /* This block will run the remaining weeks out for the rate year */
                if (endDateDate.getFullYear() > Number(rateYear)) {
                    var localRateYear = rateYear;
                    while (incYear <= endYear) {
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
                                    "cola": Math.round(cola * 100) / 100,
                                    "comp-rate": Math.round(compRate * 100) / 100,
                                    "cola-due": Math.round(colaDue * 100) / 100,
                                    "previous-rate": Math.round(prevRate * 100) / 100,
                                    "max": this.rates[effectiveRateYear]["MAX"],
                                    "cola-rate": this.rates[rateYear]["COLA"]
                            };
                            this.colaPeriods.push(benPeriod);
                            this.startDate = "07" + "/" + "01" + "/" + incYear;
                            localRateYear = Number(localRateYear) + 1;
                            incYear = incYear + 1;
                        } else {
                            endDate = this.endDate;
                            weeks = getWeeks(begDate, endDate);
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
                            this.colaPeriods.push(benPeriod);
                            this.startDate = "07" + "/" + "01" + "/" + incYear;
                            localRateYear = Number(localRateYear) + 1;
                            incYear = incYear + 1;
                        }
                        this.compRate = (1 + colaRate) * this.compRate;
                    }
                }
                rateYear = String(Number(rateYear) + 1);
                /*
                            this.startDate = String(Number(permStartDate.getMonth() + 1)) + "/" + String(permStartDate.getDate()) + "/" + incYear;
                            */
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
                colaDue = cola * (weeksDue);
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
                        "max": this.rates[startRateYear]["MAX"],
                        "cola-rate": this.rates[rateYear]["COLA"]
                };
                this.colaPeriods.push(benPeriod);
                rateYear = String(Number(rateYear) + 1);
                this.colaDue = this.colaDue + colaDue;
                var colaRate = Number(this.rates[rateYear]["COLA"]) / 100;
                prevRate = this.compRate;
                this.compRate = (1 + colaRate) * this.compRate;
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
                        "cola": Math.round(cola * 100) / 100,
                        "comp-rate": Math.round(compRate * 100) / 100,
                        "cola-due": Math.round(colaDue * 100) / 100,
                        "previous-rate": Math.round(prevRate * 100) / 100,
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
                colaDue = cola * (weeksDue);
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
                this.colaPeriods.push(benPeriod);
                rateYear = String(Number(rateYear) + 1);
                this.colaDue = this.colaDue + colaDue;
                var colaRate = Number(this.rates[rateYear]["COLA"]) / 100;
                prevRate = this.compRate;
                this.compRate = (1 + colaRate) * this.compRate;
                begDate = new Date(begDate);
                var begMonth = String(begDate.getMonth() + 1);
                var begDay = String(begDate.getDate());
                var begYear = String(begDate.getFullYear() + 1);
                this.startDate = String(begMonth + "/" + begDay + "/" + begYear);
            }
        }
        return this.colaDue;
    }