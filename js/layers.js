// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

    let baseGain = new Decimal(1);
    if (hasUpgrade("xp", 11)) {
        baseGain = baseGain.plus(new Decimal(1));
    }
    baseGain = baseGain.times((hasUpgrade("xp", 12)) ? upgradeEffect("xp", 12) : new Decimal(1));
    baseGain = baseGain.times((hasUpgrade("xp", 14)) ? upgradeEffect("xp", 14) : new Decimal(1));
    baseGain = baseGain.times((hasUpgrade("xp", 21)) ? upgradeEffect("xp", 21) : new Decimal(1));
    baseGain = baseGain.times((hasUpgrade("xp", 23)) ? upgradeEffect("xp", 23) : new Decimal(1));
    baseGain = baseGain.times((hasUpgrade("g", 11)) ? upgradeEffect("g", 11) : new Decimal(1));
    baseGain = baseGain.times((hasUpgrade("xp", 31)) ? upgradeEffect("xp", 31) : new Decimal(1));
    baseGain = baseGain.times((hasUpgrade("xp", 33)) ? upgradeEffect("xp", 33) : new Decimal(1));
    baseGain = baseGain.times((hasUpgrade("xp", 34)) ? upgradeEffect("xp", 34) : new Decimal(1));
    baseGain = baseGain.times((hasUpgrade("g", 21)) ? upgradeEffect("g", 21) : new Decimal(1));
    baseGain = baseGain.times((hasUpgrade("g", 23)) ? upgradeEffect("g", 23) : new Decimal(1));

    baseGain = baseGain.pow((hasUpgrade("l", 11)) ? upgradeEffect("l", 11) : new Decimal(1));
    baseGain = baseGain.pow((hasUpgrade("l", 12)) ? upgradeEffect("l", 12) : new Decimal(1));
    baseGain = baseGain.pow((hasUpgrade("l", 13)) ? upgradeEffect("l", 13) : new Decimal(1));
    baseGain = baseGain.times((hasUpgrade("l", 14)) ? upgradeEffect("l", 14) : new Decimal(1));
    baseGain = baseGain.pow((hasUpgrade("l", 15)) ? upgradeEffect("l", 15) : new Decimal(1));

    baseGain = baseGain.tetrate((hasUpgrade("l", 21)) ? upgradeEffect("l", 21) : new Decimal(1));
    baseGain = baseGain.tetrate((hasUpgrade("l", 25)) ? upgradeEffect("l", 25) : new Decimal(1));


    let lootEff = player.l.best.add(1).pow(0.75);
    baseGain = baseGain.times(lootEff);

    let rubyEff = player.r.points.add(1).log2().add(1).pow(3)
    baseGain = baseGain.times(rubyEff);

    
    baseGain = baseGain.times((hasUpgrade("xp", 45)) ? new Decimal(1000) : new Decimal(1));


    let powPower = new Decimal(2);
    if (hasUpgrade("xp", 41)) powPower = new Decimal(1.9);
    if (hasUpgrade("xp", 42)) powPower = new Decimal(1.8);
    if (hasUpgrade("xp", 43)) powPower = new Decimal(1.75);
    if (hasUpgrade("xp", 44)) powPower = new Decimal(1.7);
    if (hasUpgrade("xp", 45)) powPower = new Decimal(1.66666);

    if (hasMilestone("r", 2)) powPower = powPower.sub(new Decimal(1)).times(new Decimal(0.9)).plus(new Decimal(1));


    if (Decimal.gte(player.points, new Decimal(1000))) {
        powPower.plus(player.points.sub(new Decimal(1000).div(new Decimal(1000))));
    }

    let gain1 = Decimal.div(baseGain , Decimal.pow(powPower, player.points));
    let exponentLevelGainLimitOnce = baseGain.plus(1).log(powPower);
    let newPowPower = powPower.add(exponentLevelGainLimitOnce.div(new Decimal(1000)));
    let newExponentLevelGainLimitOnce = baseGain.plus(1).log(newPowPower);
    gain = Decimal.min(gain1, newExponentLevelGainLimitOnce)


	return gain
}



addLayer("xp", {
        name: "exp", // This is optional, only used in a few places, If absent it just uses the layer id.
        symbol: "XP", // This appears on the layer's node. Default is the id with the first letter capitalized
        position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
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

            mult = mult.tetrate((hasUpgrade("l", 22)) ? upgradeEffect("l", 22) : new Decimal(1));
            
            let lootEff = player.l.best.add(1).pow(0.75);
            mult = mult.times(lootEff);
            
            mult = mult.times((hasUpgrade("xp", 45)) ? new Decimal(1000) : new Decimal(1));
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
                cost: new Decimal(5000),
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
                cost: new Decimal(25000),
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
                cost: new Decimal(200000),
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
                cost: new Decimal(500000),
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
                cost: new Decimal(2500000),
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
                unlocked() { return (hasUpgrade("g", 15))},
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
                description: "Base Lvl. Exponent: 2 -> 1.9 (It goes much harder after lv 1000)",
                cost: new Decimal("e250"),
                unlocked() { return (hasUpgrade("xp", 35) && hasUpgrade("l", 35))},
            },
            42: {
                title: "Meta Level Boost",
                description: "Base Lvl. Exponent: 1.9 -> 1.8",
                cost: new Decimal("e320"),
                unlocked() { return (hasUpgrade("xp", 41))},
            },
            43: {
                title: "Extra Level Boost",
                description: "Base Lvl. Exponent: 1.8 -> 1.75",
                cost: (new Decimal("e444")).times(new Decimal(4.444444)),
                unlocked() { return (hasUpgrade("xp", 42))},
            },
            44: {
                title: "Super Level Boost",
                description: "Base Lvl. Exponent: 1.75 -> 1.7",
                cost: (new Decimal("e456")).times(new Decimal(1.23456)),
                unlocked() { return (hasUpgrade("xp", 43))},
            },
            45: {
                title: "How fast do you level up?",
                description: "Base Lvl. Exponent: 1.7 -> 1.666. Multiplies xp, gold, level and loot gain eff. value by 1,000",
                cost: (new Decimal("e466")).times(new Decimal(1)),
                unlocked() { return (hasUpgrade("xp", 44))},
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
        }

})

addLayer("g", {
    name: "gold", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "G", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 6, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
        total: new Decimal(0),
    }},
    color: "#FFE333",
    requires: new Decimal(20), // Can be a function that takes requirement increases into account
    resource: "gold", // Name of prestige currency
    baseResource: "levels", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 3, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1);
        mult = mult.times((hasUpgrade("g", 11)) ? upgradeEffect("g", 11) : new Decimal(1));
        mult = mult.times((hasUpgrade("g", 13)) ? upgradeEffect("g", 13) : new Decimal(1));
        mult = mult.times((hasUpgrade("xp", 32)) ? upgradeEffect("xp", 32) : new Decimal(1));
        mult = mult.times((hasUpgrade("g", 21)) ? upgradeEffect("g", 21) : new Decimal(1));
        mult = mult.times((hasUpgrade("g", 22)) ? upgradeEffect("g", 22) : new Decimal(1));
        mult = mult.times((hasUpgrade("g", 25)) ? upgradeEffect("g", 25) : new Decimal(1));
            
        mult = mult.pow((hasUpgrade("l", 13)) ? upgradeEffect("l", 13) : new Decimal(1));
        mult = mult.pow((hasUpgrade("l", 15)) ? upgradeEffect("l", 15) : new Decimal(1));

        mult = mult.tetrate((hasUpgrade("l", 23)) ? upgradeEffect("l", 23) : new Decimal(1));
        
        mult = mult.times((hasUpgrade("g", 31)) ? upgradeEffect("g", 31) : new Decimal(1));
        mult = mult.times((hasUpgrade("g", 32)) ? upgradeEffect("g", 32) : new Decimal(1));
        mult = mult.times((hasUpgrade("g", 35)) ? upgradeEffect("g", 35) : new Decimal(1));

        let rubyEff = player.r.points.add(1).log2().add(1).pow(3)
        mult = mult.times(rubyEff);

        
        mult = mult.times((hasUpgrade("r", 11)) ? upgradeEffect("r", 11) : new Decimal(1));
        mult = mult.times((hasUpgrade("r", 12)) ? upgradeEffect("r", 12) : new Decimal(1));

        mult = mult.times((hasUpgrade("xp", 45)) ? new Decimal(1000) : new Decimal(1));

        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        let expon = buyableEffect("l", 12);
        return expon
    },
    upgrades: {
        rows: 5,
        cols: 5,
        11: {
            title: "Moneys give levels give moneys",
            description: "Gold and Level gain is multiplied by 10",
            cost: new Decimal(1),
            unlocked() { return player[this.layer].unlocked },
            effect() { 
                let eff = new Decimal(10);
                return eff;
            },
            effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
        },
        12: {
            title: "Gold -> Exp",
            description: "Total gold boosts exp gain",
            cost: new Decimal(100),
            unlocked() { return (hasUpgrade(this.layer, 11)) },
            effect() { 
                let eff = player[this.layer].total.div(10).pow(0.2);
                eff = eff.pow(upgradeEffect("g", 14))
                return eff;
            },
            effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
        },
        13: {
            title: "You still need XP",
            description: "Gold gain is multiplied by log10(xp + 10)",
            cost: new Decimal(250),
            unlocked() { return (hasUpgrade(this.layer, 12)) },
            effect() { 
                let eff = player.xp.points.plus(10).log10();
                return eff;
            },
            effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
        },
        14: {
            title: "More XP from gold",
            cost: new Decimal(1000),
            softcap() { return new Decimal(10) },
            unlocked() { return (hasUpgrade(this.layer, 13)) },
            effect() { 
                let teff = player.g.points.plus(10).log10().pow(0.7);
                if (teff.gte(this.softcap())) {
                    eff = teff.sub(this.softcap()).div(100).plus(this.softcap());
                }
                else {
                    eff = teff;
                }
                return eff;
            },
            description() {
                return (this.effect().gte(this.softcap()) ? "Upgrade 1,2 effect is powered based on gold" : "Upgrade 1,2 effect is powered to log10(gold + 10)^0.7");
            },
            effectDisplay() { 
                return "^"+format(this.effect()) + (this.effect().gte(this.softcap()) ? " (softcapped)" : "");
            }, 
        },
        15: {
            title: "You can't buy this once",
            description: "Unlocks first buyable upgrade and a new row of xp upgrades",
            cost: new Decimal(28),
            currencyDisplayName: "levels",
            currencyInternalName: "points",
            currencyLayer: "",
            unlocked() { return (hasUpgrade(this.layer, 14)) },
        },
        21: {
            title: "Stronk Buff",
            description: "Multiplies XP, gold and lv gain by value of your level + 1",
            cost: new Decimal(100000),
            unlocked() { return (hasUpgrade("xp", 35)) },
            effect() { 
                let eff = player.points.plus(1);
                return eff;
            },
            effectDisplay() { return format(this.effect()) + "x" }, // Add formatting to the effect
        },
        22: {
            title: "Even More Gold",
            description: "Multiplies Gold by log10(xp + 10)",
            cost: new Decimal(1e7),
            unlocked() { return (hasUpgrade("g", 21)) },
            effect() { 
                let eff = player.xp.points.plus(10).log10();
                return eff;
            },
            effectDisplay() { return format(this.effect()) + "x" }, // Add formatting to the effect
        },
        23: {
            title: "Slow road to 100",
            description: "Increases a bit level gain until lvl 100",
            cost: new Decimal(2.5e8),
            unlocked() { return (hasUpgrade("g", 22)) },
            effect() { 
                let maxLv = new Decimal(101);
                let eff = Decimal.max(new Decimal(1), maxLv.sub(player.points))
                eff = eff.pow(1.75);
                return eff;
            },
            effectDisplay() { return format(this.effect()) + "x" }, // Add formatting to the effect
        },
        24: {
            title: "Better passives",
            description: "Passive upgrades effects are multiplied by log10(lv + 10)",
            cost: new Decimal(1e9),
            unlocked() { return (hasUpgrade("g", 23)) },
            effect() { 
                let eff = player.points.plus(10).log10();
                return eff;
            },
            effectDisplay() { return format(this.effect()) + "x" }, // Add formatting to the effect
        },
        25: {
            title: "What is it?",
            description: "Unlocks new layer and multiplies gold gain by π",
            cost: new Decimal(3e9),
            unlocked() { return (hasUpgrade("g", 24)) },
            effect() { 
                let eff = new Decimal(3.1415926535);
                return eff;
            },
            effectDisplay() { return format(this.effect()) + "x" }, // Add formatting to the effect
        },
        31: {
            title: "Gold was pretty slow",
            description: "Multiplies gold gain by log10(max loot + 100)/2",
            cost: new Decimal(1e16),
            unlocked() { return (hasUpgrade("l", 35) && hasUpgrade("g", 25)) },
            effect() { 
                let eff = player.l.best.plus(100).log10().div(2);
                return eff;
            },
            effectDisplay() { return format(this.effect()) + "x" }, // Add formatting to the effect
        },
        32: {
            title: "More Gold!",
            description: "Multiplies gold gain 10",
            cost: new Decimal(3e16),
            unlocked() { return (hasUpgrade("g", 31)) },
            effect() { 
                let eff = new Decimal(10);
                return eff;
            },
        },
        33: {
            title: "Loot MegaBoost!",
            description: "Loot Exponent 4 -> 5",
            cost: new Decimal(1e18),
            unlocked() { return (hasUpgrade("g", 32)) },
        },
        34: {
            title: "Risky but Effective",
            description: "All passive upgrade effects are cubed",
            cost: new Decimal(1e19),
            unlocked() { return (hasUpgrade("g", 33)) },
        },
        35: {
            title: "It will be cool in future",
            description: "Gold gain multiplied by max(1, (lvl^2)/10000). Also unlocks new layer.",
            cost: new Decimal(1e20),
            unlocked() { return (hasUpgrade("g", 34)) },
            effect() { 
                let eff = Decimal.max(new Decimal(1), player.points.times(player.points).div(new Decimal(10000)));
                return eff;
            },
            effectDisplay() { return format(this.effect()) + "x" }, // Add formatting to the effect
        },
    },

    buyables: {
        rows: 1,
        cols: 1,
        showRespec: false,
        11: {
            title: "Passive XP", // Optional, displayed at the top in a larger font
            cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(new Decimal(2), x.pow(1.2));
                cost = cost.times(1000);
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
                return "Cost: " + format(data.cost) + " gold\n\
                Amount: " + player[this.layer].buyables[this.id] + "\n\
                Generate " + (data.effect.lte(10) ? format(data.effect.times(100)) + "%" : "x" + format(data.effect)) + " XP per second";
            },
            unlocked() { return (hasUpgrade(this.layer, 15)) }, 
            canAfford() {
                return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (!hasMilestone("r", 1)) {
                    player[this.layer].points = player[this.layer].points.sub(cost)	
                }
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
            },
        },
    },

    update(diff) {
        generatePoints("g", diff * (buyableEffect("xp", 11) + (hasMilestone("r", 0) ? 1 : 0)));
        if (hasMilestone("r", 1)) {
            if (layers.g.buyables[11].unlocked() && layers.g.buyables[11].canAfford()) {
                layers.g.buyables[11].buy();
            }
            if (layers.xp.buyables[11].unlocked() && layers.xp.buyables[11].canAfford()) {
                layers.xp.buyables[11].buy();
            }
        }
    },

    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
    ],
    layerShown(){return (hasUpgrade("xp", 25) || hasMilestone("r", 0))},
})


addLayer("l", {
    name: "loot", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "L", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 3, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
        best: new Decimal(0),
    }},
    effect() {
        eff = player[this.layer].best.add(1).pow(0.75);
        return eff
        },
    effectDescription() {
        eff = this.effect();
        return "loot will help you level up much faster, your best loot will multiply your Lv & XP gain by "+format(eff)+
        ". (You should wait at least until 100 or 1,000 for better effect)"
    },
    color: "#33D8FF",
    requires: new Decimal(5e9), // Can be a function that takes requirement increases into account
    resource: "loot", // Name of prestige currency
    baseResource: "gold", // Name of resource prestige is based on
    baseAmount() {return player.g.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent() {
        let baseExp = 0.25;
        if (hasUpgrade("g", 33)) baseExp -= 0.05;
        return baseExp;
    }, // Prestige currency exponent
    base: 2.25,
    canBuyMax: true,
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1);
        let xpLogMult = player.xp.points.add(1).log10().div(10).add(1).pow(2);
        mult = mult.div(xpLogMult);
        mult = mult.div((hasUpgrade("l", 31)) ? upgradeEffect("l", 31) : new Decimal(1));
        mult = mult.div((hasUpgrade("xp", 45)) ? new Decimal(1000) : new Decimal(1));

        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        let expon = new Decimal(1);
        expon = expon.times((hasUpgrade("l", 15)) ? upgradeEffect("l", 15) : new Decimal(1));
        expon = expon.tetrate((hasUpgrade("l", 24)) ? upgradeEffect("l", 24) : new Decimal(1));

        return expon;
    },
    upgrades: {
        rows: 5,
        cols: 5,
        11: {
            title: "You listened to me",
            description: "Base level gain is powered to ^1.1",
            cost: new Decimal(100),
            unlocked() { return player[this.layer].unlocked },
            effect() { 
                let eff = new Decimal(1.1);
                return eff;
            },
            effectDisplay() { return "^" + format(this.effect()) }, // Add formatting to the effect
        },
        12: {
            title: "You listened to me very well",
            description: "Base level gain is powered to ^1.1 again",
            cost: new Decimal(900),
            unlocked() { return (hasUpgrade(this.layer, 11)) },
            effect() { 
                let eff = new Decimal(1.1);
                return eff;
            },
            effectDisplay() { return "^" + format(this.effect()) }, // Add formatting to the effect
        },
        13: {
            title: "Not only levels now",
            description: "Base level, xp & gold gain is powered to ^1.05 (before this layer effect)",
            cost: new Decimal(2000),
            unlocked() { return (hasUpgrade(this.layer, 12)) },
            effect() { 
                let eff = new Decimal(1.05);
                return eff;
            },
            effectDisplay() { return "^" + format(this.effect()) }, // Add formatting to the effect
        },
        14: {
            title: "Fast road to 100 from the beginning",
            description: "Level UP until level 100 much faster",
            cost: new Decimal(5000),
            unlocked() { return (hasUpgrade(this.layer, 13)) },
            effect() { 
                let maxLv = new Decimal(101);
                let eff = Decimal.max(new Decimal(1), maxLv.sub(player.points))
                eff = eff.pow(2);
                return eff;
            },
            effectDisplay() { return format(this.effect()) + "x" }, // Add formatting to the effect
        },
        15: {
            title: "Powered Loot",
            description: "Loot, XP, Gold and Level gain is powered to ^1.2",
            cost: new Decimal(10000),
            unlocked() { return (hasUpgrade(this.layer, 14)) },
            effect() { 
                let eff = new Decimal(1.2);
                return eff;
            },
            effectDisplay() { return "^" + format(this.effect()) }, // Add formatting to the effect
        },
        21: {
            title: "Are you ready for 200?",
            description: "level gain is tetrated by 1.001",
            cost: new Decimal(100),
            currencyDisplayName: "levels",
            currencyInternalName: "points",
            currencyLayer: "",
            unlocked() { return (hasUpgrade(this.layer, 15)) },
            effect() { 
                return new Decimal(1.001);
            },
            effectDisplay() { return "^^" + format(this.effect()) }, // Add formatting to the effect
        },
        22: {
            title: "It's more powerful as it seems",
            description: "XP gain is tetrated by 1.001",
            cost: new Decimal(105),
            currencyDisplayName: "levels",
            currencyInternalName: "points",
            currencyLayer: "",
            unlocked() { return (hasUpgrade(this.layer, 21)) },
            effect() { 
                return new Decimal(1.001);
            },
            effectDisplay() { return "^^" + format(this.effect()) }, // Add formatting to the effect
        },
        23: {
            title: "Golden Mine",
            description: "Gold gain is tetrated by 1.001",
            cost: new Decimal(110),
            currencyDisplayName: "levels",
            currencyInternalName: "points",
            currencyLayer: "",
            unlocked() { return (hasUpgrade(this.layer, 22)) },
            effect() { 
                return new Decimal(1.001);
            },
            effectDisplay() { return "^^" + format(this.effect()) }, // Add formatting to the effect
        },
        24: {
            title: "Loot Loot Loot",
            description: "Loot gain is tetrated by 1.001",
            cost: new Decimal(115),
            currencyDisplayName: "levels",
            currencyInternalName: "points",
            currencyLayer: "",
            unlocked() { return (hasUpgrade(this.layer, 23)) },
            effect() { 
                return new Decimal(1.001);
            },
            effectDisplay() { return "^^" + format(this.effect()) }, // Add formatting to the effect
        },
        25: {
            title: "Loot Era",
            description: "Unlocks two buyable upgrades and loot gain is xp gain is tetrated by 1.0005",
            cost: new Decimal(120),
            currencyDisplayName: "levels",
            currencyInternalName: "points",
            currencyLayer: "",
            unlocked() { return (hasUpgrade(this.layer, 24)) },
            effect() { 
                return new Decimal(1.0005);
            },
        },
        31: {
            title: "> Level > Loot",
            description() {
                let str = "Loot Gain eff. value is multiplied by 1/10th power of level (Mult. to gold -> loot)";
                if (hasUpgrade(this.layer, 32)) str = "Loot Gain eff. value is multiplied by 1/8th power of level (Mult. to gold -> loot)"
                if (hasUpgrade(this.layer, 33)) str = "Loot Gain eff. value is multiplied by 1/5th power of level (Mult. to gold -> loot)"
                if (hasUpgrade(this.layer, 34)) str = "Loot Gain eff. value is multiplied by 1/3th power of level (Mult. to gold -> loot)"
                if (hasUpgrade(this.layer, 35)) str = "Loot Gain eff. value is multiplied by 1/2th power of level (Mult. to gold -> loot)"
                return str;
            },
            cost: new Decimal(500000),
            unlocked() { return (hasUpgrade(this.layer, 25)) },
            effect() {
                let eff = player.points.plus(1).pow(new Decimal(0.1));
                if (hasUpgrade(this.layer, 32)) eff = player.points.plus(1).pow(new Decimal(0.125));
                if (hasUpgrade(this.layer, 33)) eff = player.points.plus(1).pow(new Decimal(0.2));
                if (hasUpgrade(this.layer, 34)) eff = player.points.plus(1).pow(new Decimal(0.3333));
                if (hasUpgrade(this.layer, 35)) eff = player.points.plus(1).pow(new Decimal(0.5));
                return eff;
            },
            effectDisplay() { return format(this.effect()) + "x" }, // Add formatting to the effect
        },
        32: {
            title: "Inversed Power Decremention",
            description: "Upgrade 3,1 power goes from 1/10 to 1/8",
            cost: new Decimal(700000),
            unlocked() { return (hasUpgrade(this.layer, 31)) },
        },
        33: {
            title: "It feels better",
            description: "Upgrade 3,1 power goes from 1/8 to 1/5",
            cost: new Decimal(1000000),
            unlocked() { return (hasUpgrade(this.layer, 32)) },
        },
        34: {
            title: "It feels even better",
            description: "Upgrade 3,1 power goes from 1/5 to 1/3",
            cost: new Decimal(1000000),
            unlocked() { return (hasUpgrade(this.layer, 33)) },
        },
        35: {
            title: "It is really good",
            description: "Upgrade 3,1 power goes from 1/3 to 1/2. Unlocks new rows of xp and gold upgrades.",
            cost: new Decimal(1000000),
            unlocked() { return (hasUpgrade(this.layer, 34)) },
        },
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
    ],
    branches: [["xp", 2], ["g", 2]],

    buyables: {
        rows: 1,
        cols: 2,
        showRespec: false,
        11: {
            title: "Exp Exponent", // Optional, displayed at the top in a larger font
            cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(new Decimal(1.5), x.pow(1.6));
                cost = cost.times(125000);
                return cost.floor()
            },
            effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
                let eff = x.times(0.01).plus(1);
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " loot\n\
                Amount: " + player[this.layer].buyables[this.id] + "\n\
                XP Gain is powered to ^" + format(data.effect)
            },
            unlocked() { return (hasUpgrade(this.layer, 25)) }, 
            canAfford() {
                return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                player[this.layer].points = player[this.layer].points.sub(cost)	
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
            },
        },

        12: {
            title: "Gold Exponent", // Optional, displayed at the top in a larger font
            cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(new Decimal(1.6), x.pow(1.5));
                cost = cost.times(125000);
                return cost.floor();
            },
            effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
                let eff = x.times(0.01).plus(1);
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " loot\n\
                Amount: " + player[this.layer].buyables[this.id] + "\n\
                Gold Gain is powered to ^" + format(data.effect)
            },
            unlocked() { return (hasUpgrade(this.layer, 25)) }, 
            canAfford() {
                return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                player[this.layer].points = player[this.layer].points.sub(cost)	
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
            },
        },
    },
    layerShown(){return (hasUpgrade("g", 25) || player.l.best.gte(1))},
})

addLayer("r", {
    name: "rubies", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "R", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 5, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
        best: new Decimal(0),
    }},
    effect() {
        eff = player[this.layer].points.add(1).log2().add(1).pow(5);
        if (hasMilestone("r", 3)) {
            eff = eff.pow(2);
        }
        return eff
        },
    effectDescription() {
        eff = this.effect();
        return "Rubies make you richer! Gold gain and level gain are multiplied by "+format(eff)+
        "x.";
    },
    color: "#FF335B",
    requires: new Decimal(2e20), // Can be a function that takes requirement increases into account
    resource: "rubies", // Name of prestige currency
    baseResource: "gold", // Name of resource prestige is based on
    baseAmount() {return player.g.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent() {
        let baseExp = 3;
        if (hasMilestone("r", 3)) {
            baseExp *= 0.8;
        }
        return baseExp;
    }, // Prestige currency exponent
    base: 2500,
    canBuyMax: true,
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1.5);
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        let expon = new Decimal(1.25);
        return expon;
    },
    upgrades: {
        rows: 5,
        cols: 5,
        11: {
            title: "Make it easier",
            description: "Multiplies gold gain by 1,000",
            cost: new Decimal(1),
            unlocked() { return player[this.layer].unlocked },
            effect() { 
                let eff = new Decimal(1000);
                return eff;
            },
        },
        12: {
            title: "I think this mult is close to previous now",
            description: "Multiplies gold gain by (lvl+1)^1.34",
            cost: new Decimal(2),
            unlocked() { return (hasUpgrade(this.layer, 11)) },
            effect() { 
                let eff = player.points.plus(1).pow(1.34);
                return eff;
            },
            effectDisplay() { return format(this.effect()) + "x" }, // Add formatting to the effect
        },
    },

    milestones: {
        0: {requirementDescription: "Get 1 max ruby",
            done() {return player[this.layer].best.gte(1)}, // Used to determine when to give the milestone
            effectDescription: "Adds additional 100% to passive gold and xp gain. Keeps gold layer unlocked.",
        },
        1: {requirementDescription: "Get 2 max rubies",
            unlocked() {return hasMilestone("r", 0)},
            done() {return player[this.layer].best.gte(2)}, // Used to determine when to give the milestone
            effectDescription: "Passive upgrades doesn't cost anything. Also they are 1.5x times more efficient and are bought automatically.",
        },
        2: {requirementDescription: "Get 3 max rubies",
            unlocked() {return hasMilestone("r", 1)},
            done() {return player[this.layer].best.gte(3)}, // Used to determine when to give the milestone
            effectDescription: "Base level exponent is decreased by 10 percent.",
        },
        3: {requirementDescription: "Get 4 max rubies",
            unlocked() {return hasMilestone("r", 2)},
            done() {return player[this.layer].best.gte(5)}, // Used to determine when to give the milestone
            effectDescription: "Ruby exponent is decreased by 20 percent. Ruby bonus is squared.",
        },
    },
   
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
    ],
    branches: [["g", 3]],

    layerShown(){return (hasUpgrade("g", 35) || player.r.best.gte(1))},
})