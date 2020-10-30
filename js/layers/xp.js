addLayer("xp", {
    name: "exp", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "XP", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 3, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},
    color: "#4BDC13",
    requires: new Decimal(1), // Can be a function that takes requirement increases into account
    resource: "experience", // Name of prestige currency
    baseResource: "levels", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 2, // Prestige currency exponent
    softcap() {
        let scap = new Decimal("1e1000");
        if (hasMilestone('q', 8)) {
            scap = scap.times(new Decimal("1e1000"));
        }
        if (hasMilestone('q', 9)) {
            scap = scap.times(new Decimal("1e1000"));
        }
        return scap;
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1);
        mult = mult.times((hasUpgrade("xp", 13)) ? upgradeEffect("xp", 13) : new Decimal(1));
        mult = mult.times((hasUpgrade("xp", 15)) ? upgradeEffect("xp", 15) : new Decimal(1));
        mult = mult.times((hasUpgrade("xp", 22)) ? upgradeEffect("xp", 22) : new Decimal(1));
        mult = mult.times((hasUpgrade("xp", 25)) ? upgradeEffect("xp", 25) : new Decimal(1));
        mult = mult.times((hasUpgrade("g", 12)) ? upgradeEffect("g", 12) : new Decimal(1));
        mult = mult.times((hasUpgrade("g", 21)) ? upgradeEffect("g", 21) : new Decimal(1));
        
        mult = mult.pow((hasUpgrade("l", 13)) ? upgradeEffect("l", 13) : new Decimal(1));
        mult = mult.pow((hasUpgrade("l", 15)) ? upgradeEffect("l", 15) : new Decimal(1));

        mult = mult.pow((hasUpgrade("l", 22)) ? upgradeEffect("l", 22) : new Decimal(1));
        
        let lootEff = player.l.best.add(1).pow(0.75);
        let qEff = player.q.total.pow(0.6725).plus(1);
        lootEff = lootEff.pow(qEff);
        mult = mult.times(lootEff);
        
        mult = mult.times((hasUpgrade("xp", 45)) ? new Decimal(1000) : new Decimal(1));

        mult = mult.times((hasUpgrade("l", 41)) ? upgradeEffect("l", 41) : new Decimal(1));
        
        if (inChallenge("q", 11)) mult = mult.pow(challengeVar("q", 11));
        else {
            mult = mult.pow(layers.q.challenges[11].rewardEffect());
        }
        if (inChallenge("q", 12)) mult = mult.tetrate(challengeVar("q", 12));

       
        if (inChallenge("q", 15)) {
            mult = mult.plus(1).log(challengeVar("q", 15));
            if (isNaN(mult)) mult = new Decimal(1);
        }

        if (inChallenge("q", 13)) mult = mult.times(new Decimal("1e-9999999999").pow(new Decimal("1e9999999999")));

        //soft cap
        if (mult.gte(layers.xp.softcap())) {
            let getSCP = layers.xp.softcap();
            let softCapDivider = mult.log10().sub(getSCP.log10().sub(1)).pow(mult.log10().sub(getSCP.log10().sub(1)).div(250).plus(2));
            mult = mult.div(softCapDivider);
        }

        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        let expon = buyableEffect("l", 11);
        return expon;
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return true},

    upgrades: {
        rows: 5,
        cols: 5,
        11: {
            title: "Bonus level gain",
            description: "+ 1 base lv gain / sec",
            cost: new Decimal(10),
            unlocked() { return player[this.layer].unlocked },
        },
        12: {
            title: "XP to level",
            description: "Level gain is also based on your unspent xp, softcap after x100",
            cost: new Decimal(50),
            unlocked() { return (hasUpgrade(this.layer, 11))},
            effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
                let eff = player[this.layer].points.div(10).add(1);
                if (eff.gte(100)) eff = eff.div(100).log2().plus(100)
                return eff;
            },
            effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
        },
        13: {
            title: "XP to XP",
            description: "XP gain is also based on your unspent xp",
            cost: new Decimal(1000),
            unlocked() { return (hasUpgrade(this.layer, 12))},
            effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
                let eff = player[this.layer].points.add(1).ln().div(10).add(1);
                eff = eff.pow(upgradeEffect("xp", 24));
                return eff;
            },
            effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
        },
        14: {
            title: "Level to Level",
            description: "Level gain is multiplied by your level + 1",
            cost: new Decimal(3000),
            unlocked() { return (hasUpgrade(this.layer, 13))},
            effect() {
                let eff = player.points.plus(1);
                return eff;
            },
            effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
        },
        15: {
            title: "Level to XP",
            description: "XP gain is multiplied by 1 + (level^2)/100",
            cost: new Decimal(15),
            currencyDisplayName: "levels",
            currencyInternalName: "points",
            currencyLayer: "",
            unlocked() { return (hasUpgrade(this.layer, 14))},
            effect() {
                let eff = player.points.times(player.points).div(100).plus(1);
                return eff;
            },
            effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
        },
        21: {
            title: "Faster levels I",
            description: "Multiplies level gain by 10",
            cost: new Decimal(15000),
            unlocked() { return (hasUpgrade(this.layer, 15))},
            effect() {
                let eff = new Decimal(10);
                return eff;
            },
            effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
        },
        22: {
            title: "Faster XP I",
            description: "Multiplies XP gain by 10",
            cost: new Decimal(20),
            currencyDisplayName: "levels",
            currencyInternalName: "points",
            currencyLayer: "",
            unlocked() { return (hasUpgrade(this.layer, 21))},
            effect() {
                let eff = new Decimal(10);
                return eff;
            },
            effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
        },
        23: {
            title: "Longer Runs",
            description: "Level gain in multiplied by XP gain",
            cost: new Decimal(150000),
            unlocked() { return (hasUpgrade(this.layer, 22))},
            effect() {
                let gainGet = tmp[this.layer].resetGain;
                let eff = Decimal.plus(gainGet, new Decimal(1)).pow(0.11);
                return eff;
            },
            effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
        },
        24: {
            title: "More and More XP",
            description: "XP to XP effect is powered to (level / 10)",
            cost: new Decimal(300000),
            softcap() { return new Decimal(50) },
            unlocked() { return (hasUpgrade(this.layer, 23))},
            effect() {
                let eff = player.points.div(10);
                if (eff.gte(this.softcap())) {
                    eff = eff.sub(this.softcap()).divide(new Decimal(10)).plus(this.softcap())
                }
                return eff;
            },
            description() {
                if (this.effect().gte(this.softcap())) {
                    return "XP to XP effect is powered based on your lvl";
                }
                else {
                    return "XP to XP effect is powered to (level / 10)";
                }
            },
            effectDisplay() { return "^"+format(this.effect()) + ((this.effect().gte(this.softcap())) 
            ? " (softcapped) " : "")}, // Add formatting to the effect
        },
        25: {
            title() { 
                return (!hasMilestone("r", 0) ? "G means Gold" : "Woah, a new upgrade here?");
            },
            description() {
                return (!hasMilestone("r", 0) ? "Unlocks Gold Layer" : "Multiplies XP gain by 2^sqrt(rubies)");
            },
            cost: new Decimal(1000000),
            unlocked() { return (hasUpgrade(this.layer, 24))},
            effect() {
                let eff = Decimal.pow(new Decimal(2), player.r.points.pow(0.5))
                return (hasMilestone("r", 0) ? eff : new Decimal(1));
            },
            effectDisplay() { return (hasMilestone("r", 0) ? format(this.effect()) + "x" : "") }, // Add formatting to the effect
        },
        31: {
            title: "Fast Start",
            description: "Level UP much faster before Lv.30",
            cost: new Decimal(5e7),
            unlocked() { return ((hasUpgrade("g", 15) && hasUpgrade("xp", 25)) || inChallenge("q", 14)) },
            effect() {
                let maxLv = new Decimal(31);
                let eff = Decimal.max(new Decimal(1), maxLv.sub(player.points))
                eff = eff.pow(3);
                return eff;
            },
            effectDisplay() { return format(this.effect()) + "x" }, // Add formatting to the effect
        },
        32: {
            title: "Yeae, you reached 30!",
            description: "Gold gain is multiplied by (lv/10)+1",
            cost: new Decimal(30),
            currencyDisplayName: "levels",
            currencyInternalName: "points",
            currencyLayer: "",
            unlocked() { return (hasUpgrade("xp", 31))},
            effect() {
                let eff = player.points.div(10).plus(1)
                return eff;
            },
            effectDisplay() { return format(this.effect()) + "x" }, // Add formatting to the effect
        },
        33: {
            title: "Faster Levels II",
            description: "Multiplies level gain by 100",
            cost: new Decimal(1e9),
            unlocked() { return (hasUpgrade("xp", 32))},
            effect() {
                let eff = new Decimal(100);
                return eff;
            },
            effectDisplay() { return format(this.effect()) + "x" }, // Add formatting to the effect
        },
        34: {
            title: "To Level 40!",
            description: "Level UP much too faster before Lv.40",
            cost: new Decimal(1e10),
            unlocked() { return (hasUpgrade("xp", 33))},
            effect() {
                let maxLv = new Decimal(41);
                let eff = Decimal.max(new Decimal(1), maxLv.sub(player.points))
                eff = eff.pow(4);
                return eff;
            },
            effectDisplay() { return format(this.effect()) + "x" }, // Add formatting to the effect
        },
        35: {
            title: "So close",
            description: "Unlocks XP buyable upgrade and a new row of gold upgrades",
            cost: new Decimal(39.9),
            currencyDisplayName: "levels",
            currencyInternalName: "points",
            currencyLayer: "",
            unlocked() { return (hasUpgrade("xp", 34))},
        },
        41: {
            title: "Level Boost",
            description: "Base Lvl. Exponent: 2 -> 1.9 (It goes much harder after lv 3,000)",
            cost: new Decimal("e160"),
            unlocked() { return (hasUpgrade("xp", 35) && hasUpgrade("l", 35))},
        },
        42: {
            title: "Meta Level Boost",
            description: "Base Lvl. Exponent: 1.9 -> 1.8",
            cost: new Decimal("e170"),
            unlocked() { return (hasUpgrade("xp", 41))},
        },
        43: {
            title: "Extra Level Boost",
            description: "Base Lvl. Exponent: 1.8 -> 1.75",
            cost: (new Decimal("e175")).times(new Decimal(4.444444)),
            unlocked() { return (hasUpgrade("xp", 42))},
        },
        44: {
            title: "Super Level Boost",
            description: "Base Lvl. Exponent: 1.75 -> 1.7",
            cost: (new Decimal("1e181")),
            unlocked() { return (hasUpgrade("xp", 43))},
        },
        45: {
            title: "How fast do you level up?",
            description: "Base Lvl. Exponent: 1.7 -> 1.666. Multiplies xp, gold, level and loot gain eff. value by 1,000",
            cost: (new Decimal("1e188")).times(new Decimal(1)),
            unlocked() { return (hasUpgrade("xp", 44))},
        },
        51: {
            title: "Get more loot from XP",
            description: "XP multiplier to loot gain is powered to ^2",
            cost: (new Decimal("e777")).times(new Decimal(7.77)),
            unlocked() { return (hasUpgrade("xp", 45) && hasMilestone("q", 4))},
        },
        52: {
            title: "Loot ExtraBoost!",
            description: "Loot Base Exponent 1/5 -> 1/8",
            cost: (new Decimal("e888")).times(new Decimal(8.88)),
            unlocked() { return (hasUpgrade("g", 33) && hasUpgrade("xp", 51)) },
        },
        53: {
            title: "Loot ZetaBoost!",
            description: "Loot Base Exponent 1/8 -> 1/10",
            cost: (new Decimal("e1111")).times(new Decimal(1.11)),
            unlocked() { return (hasUpgrade("xp", 52)) },
        },
        54: {
            title: "Good for Gold",
            description: "Boosts gold gain by ^0.1 of your current xp",
            cost: (new Decimal("e1600")),
            unlocked() { return (hasUpgrade("xp", 53)) },
            effect() {
                let eff = player.xp.points.pow(0.1);
                return eff;
            },
            effectDisplay() { return format(this.effect()) + "x" }, // Add formatting to the effect
        },
        55: {
            title: "Is this the end?",
            description: "Ruby gain exponent is multiplied by 2. Unlocks next 2 rows of loot upgrades.",
            cost: (new Decimal("e2000")),
            unlocked() { return (hasUpgrade("xp", 54)) },
        },
    },

    buyables: {
        rows: 1,
        cols: 1,
        showRespec: false,
        11: {
            title: "Passive Gold", // Optional, displayed at the top in a larger font
            cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(new Decimal(2.5), x.pow(1.25));
                cost = cost.times(1e11);
                return cost.floor()
            },
            effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
                let eff = x.times(0.01);
                eff = eff.times(hasUpgrade('g', 24) ? upgradeEffect("g", 24) : new Decimal(1));
                eff = eff.pow(hasUpgrade('g', 34) ? new Decimal(3) : new Decimal(1));
                if (hasMilestone("r", 1)) eff = eff.times(1.5);
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " xp\n\
                Amount: " + player[this.layer].buyables[this.id] + "\n\
                Generate " + (data.effect.lte(10) ? format(data.effect.times(100)) + "%" : "x" + format(data.effect)) + " gold per second, lol it's kinda obvious";
            },
            unlocked() { return (hasUpgrade(this.layer, 35)) }, 
            canAfford() {
                return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (!hasMilestone("r", 1)) {
                    player[this.layer].points = player[this.layer].points.sub(cost);
                }
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
            },
        },
    },

    update(diff) {
        generatePoints("xp", diff * (buyableEffect("g", 11) + (hasMilestone("r", 0) ? 1 : 0)));
    },

    automate() {
        if (player["q"].autoBuyXP) {
            for (let x = 10; x <= 50; x += 10){ 
                for (let y = 1; y <= 5; y++) {
                    let z = x + y;
                    if (!hasUpgrade("xp", z) && canAffordUpgrade("xp", z) && hasMilestone("q", 1) && layers["xp"].upgrades[z].unlocked()===true) {
                        buyUpg("xp", z);
                    }
                }
            }
        }
    },

})