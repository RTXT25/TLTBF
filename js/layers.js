// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

    let baseGain = new Decimal(1);
    if (hasUpgrade("xp", 11)) {
        baseGain = baseGain.plus(new Decimal(1));
    }
    baseGain = baseGain.times(upgradeEffect("xp", 12));
    baseGain = baseGain.times(upgradeEffect("xp", 14));
    baseGain = baseGain.times(upgradeEffect("xp", 21));
    baseGain = baseGain.times(upgradeEffect("xp", 23));
    baseGain = baseGain.times(upgradeEffect("g", 11));
    baseGain = baseGain.times(upgradeEffect("xp", 31));
    baseGain = baseGain.times(upgradeEffect("xp", 33));
    baseGain = baseGain.times(upgradeEffect("xp", 34));
    baseGain = baseGain.times(upgradeEffect("g", 21));
    baseGain = baseGain.times(upgradeEffect("g", 23));

    let powPower = new Decimal(2);
    let gain1 = Decimal.div(baseGain , Decimal.pow(powPower, player.points));
    let exponentLevelGainLimitOnce = baseGain.plus(1).log(powPower);
    gain = Decimal.min(gain1, exponentLevelGainLimitOnce)


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
            mult = mult.times(upgradeEffect("xp", 13));
            mult = mult.times(upgradeEffect("xp", 15));
            mult = mult.times(upgradeEffect("xp", 22));
            mult = mult.times(upgradeEffect("g", 12));
            mult = mult.times(upgradeEffect("g", 21));
            return mult
        },
        gainExp() { // Calculate the exponent on main currency from bonuses
            return new Decimal(1)
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
                description: "Level gain is also based on your unspent xp",
                cost: new Decimal(50),
                unlocked() { return (hasUpgrade(this.layer, 11))},
                effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
                    if (hasUpgrade(this.layer, 12)) {
                        let eff = player[this.layer].points.div(10).add(1);
                        if (eff.gte(100)) eff = eff.div(100).log2().plus(100)
                        return eff;
                    }
                    else return new Decimal(1);
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
            },
            13: {
                title: "XP to XP",
                description: "XP gain is also based on your unspent xp",
                cost: new Decimal(1000),
                unlocked() { return (hasUpgrade(this.layer, 12))},
                effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
                    if (hasUpgrade(this.layer, 13)) {
                        let eff = player[this.layer].points.add(1).ln().div(10).add(1);
                        eff = eff.pow(upgradeEffect("xp", 24));
                        return eff;
                    }
                    else return new Decimal(1);
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
            },
            14: {
                title: "Level to Level",
                description: "Level gain is multiplied by your level + 1",
                cost: new Decimal(5000),
                unlocked() { return (hasUpgrade(this.layer, 13))},
                effect() {
                    if (hasUpgrade(this.layer, 14)) {
                        let eff = player.points.plus(1);
                        return eff;
                    }
                    else return new Decimal(1);
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
                    if (hasUpgrade(this.layer, 15)) {
                        let eff = player.points.times(player.points).div(100).plus(1);
                        return eff;
                    }
                    else return new Decimal(1);
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
            },
            21: {
                title: "Faster levels I",
                description: "Multiplies level gain by 10",
                cost: new Decimal(25000),
                unlocked() { return (hasUpgrade(this.layer, 15))},
                effect() {
                    if (hasUpgrade(this.layer, 21)) {
                        let eff = new Decimal(10);
                        return eff;
                    }
                    else return new Decimal(1);
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
                    if (hasUpgrade(this.layer, 22)) {
                        let eff = new Decimal(10);
                        return eff;
                    }
                    else return new Decimal(1);
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
            },
            23: {
                title: "Longer Runs",
                description: "Level gain in multiplied by XP gain",
                cost: new Decimal(200000),
                unlocked() { return (hasUpgrade(this.layer, 22))},
                effect() {
                    if (hasUpgrade(this.layer, 23)) {
                        let gainGet = tmp[this.layer].resetGain;
                        let eff = Decimal.plus(gainGet, new Decimal(1)).pow(0.11);
                        return eff;
                    }
                    else return new Decimal(1);
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
            },
            24: {
                title: "More and More XP",
                description: "XP to XP effect is powered to (level / 10)",
                cost: new Decimal(500000),
                unlocked() { return (hasUpgrade(this.layer, 23))},
                effect() {
                    if (hasUpgrade(this.layer, 24)) {
                        let eff = player.points.div(10);
                        return eff;
                    }
                    else return new Decimal(1);
                },
                effectDisplay() { return "^"+format(this.effect()) }, // Add formatting to the effect
            },
            25: {
                title: "G means Gold",
                description: "Unlocks Gold Layer",
                cost: new Decimal(2500000),
                unlocked() { return (hasUpgrade(this.layer, 24))},
            },
            31: {
                title: "Fast Start",
                description: "Level UP much faster before Lv.30",
                cost: new Decimal(5e7),
                unlocked() { return (hasUpgrade("g", 15))},
                effect() {
                    if (hasUpgrade(this.layer, 31)) {
                        let maxLv = new Decimal(31);
                        let eff = Decimal.max(new Decimal(1), maxLv.sub(player.points))
                        eff = eff.pow(3);
                        return eff;
                    }
                    else return new Decimal(1);
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
                    if (hasUpgrade(this.layer, 32)) {
                        let eff = player.points.div(10).plus(1)
                        return eff;
                    }
                    else return new Decimal(1);
                },
                effectDisplay() { return format(this.effect()) + "x" }, // Add formatting to the effect
            },
            33: {
                title: "Faster Levels II",
                description: "Multiplies level gain by 100",
                cost: new Decimal(1e9),
                unlocked() { return (hasUpgrade("xp", 32))},
                effect() {
                    if (hasUpgrade(this.layer, 33)) {
                        let eff = new Decimal(100);
                        return eff;
                    }
                    else return new Decimal(1);
                },
                effectDisplay() { return format(this.effect()) + "x" }, // Add formatting to the effect
            },
            34: {
                title: "To Level 40!",
                description: "Level UP much too faster before Lv.40",
                cost: new Decimal(1e10),
                unlocked() { return (hasUpgrade("xp", 33))},
                effect() {
                    if (hasUpgrade(this.layer, 34)) {
                        let maxLv = new Decimal(41);
                        let eff = Decimal.max(new Decimal(1), maxLv.sub(player.points))
                        eff = eff.pow(4);
                        return eff;
                    }
                    else return new Decimal(1);
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
                    eff = eff.times(upgradeEffect("g", 24));
                    return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Cost: " + format(data.cost) + " xp\n\
                    Amount: " + player[this.layer].buyables[this.id] + "\n\
                    Generate " + format(data.effect.times(100)) + "% gold per second, lol, it was obvious"
                },
                unlocked() { return (hasUpgrade(this.layer, 35)) }, 
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

        update(diff) {
            generatePoints("xp", diff * buyableEffect("g", 11));
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
        mult = mult.times(upgradeEffect("g", 11));
        mult = mult.times(upgradeEffect("g", 13));
        mult = mult.times(upgradeEffect("xp", 32));
        mult = mult.times(upgradeEffect("g", 21));
        mult = mult.times(upgradeEffect("g", 22));
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
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
                if (hasUpgrade(this.layer, 11)) {
                    let eff = new Decimal(10);
                    return eff;
                }
                else return new Decimal(1);
            },
            effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
        },
        12: {
            title: "Gold -> Exp",
            description: "Total gold boosts exp gain",
            cost: new Decimal(100),
            unlocked() { return (hasUpgrade(this.layer, 11)) },
            effect() { 
                if (hasUpgrade(this.layer, 12)) {
                    let eff = player[this.layer].total.div(10).pow(0.2);
                    eff = eff.pow(upgradeEffect("g", 14))
                    return eff;
                }
                else return new Decimal(1);
            },
            effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
        },
        13: {
            title: "You still need XP",
            description: "Gold gain is multiplied by log10(xp + 10)",
            cost: new Decimal(250),
            unlocked() { return (hasUpgrade(this.layer, 12)) },
            effect() { 
                if (hasUpgrade(this.layer, 13)) {
                    let eff = player.xp.points.plus(10).log10();
                    return eff;
                }
                else return new Decimal(1);
            },
            effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
        },
        14: {
            title: "More XP from gold",
            description: "Upgrade 1,2 effect is powered to log10(gold + 10)^0.7",
            cost: new Decimal(1000),
            unlocked() { return (hasUpgrade(this.layer, 13)) },
            effect() { 
                if (hasUpgrade(this.layer, 14)) {
                    let eff = player.g.points.plus(10).log10().pow(0.7);
                    return eff;
                }
                else return new Decimal(1);
            },
            effectDisplay() { return "^"+format(this.effect()) }, // Add formatting to the effect
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
                if (hasUpgrade(this.layer, 21)) {
                    let eff = player.points.plus(1);
                    return eff;
                }
                else return new Decimal(1);
            },
            effectDisplay() { return format(this.effect()) + "x" }, // Add formatting to the effect
        },
        22: {
            title: "Even More Gold",
            description: "Multiplies Gold by log10(xp + 10)",
            cost: new Decimal(1e7),
            unlocked() { return (hasUpgrade("g", 21)) },
            effect() { 
                if (hasUpgrade(this.layer, 22)) {
                    let eff = player.xp.points.plus(10).log10();
                    return eff;
                }
                else return new Decimal(1);
            },
            effectDisplay() { return format(this.effect()) + "x" }, // Add formatting to the effect
        },
        23: {
            title: "Slow road to 100",
            description: "Increases a bit level gain until lvl 100",
            cost: new Decimal(2.5e8),
            unlocked() { return (hasUpgrade("g", 22)) },
            effect() { 
                if (hasUpgrade(this.layer, 23)) {
                    let maxLv = new Decimal(101);
                        let eff = Decimal.max(new Decimal(1), maxLv.sub(player.points))
                        eff = eff.pow(1.75);
                        return eff;
                }
                else return new Decimal(1);
            },
            effectDisplay() { return format(this.effect()) + "x" }, // Add formatting to the effect
        },
        24: {
            title: "Better passives",
            description: "Passive upgrades effects are multiplied by log10(lv + 10)",
            cost: new Decimal(1e9),
            unlocked() { return (hasUpgrade("g", 23)) },
            effect() { 
                if (hasUpgrade(this.layer, 24)) {
                    let eff = player.points.plus(10).log10();
                    return eff;
                }
                else return new Decimal(1);
            },
            effectDisplay() { return format(this.effect()) + "x" }, // Add formatting to the effect
        },
        25: {
            title: "What is it?",
            description: "Unlocks new layer",
            cost: new Decimal(3e9),
            unlocked() { return (hasUpgrade("g", 24)) },
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
                eff = eff.times(upgradeEffect("g", 24));
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " gold\n\
                Amount: " + player[this.layer].buyables[this.id] + "\n\
                Generate " + format(data.effect.times(100)) + "% XP per second"
            },
            unlocked() { return (hasUpgrade(this.layer, 15)) }, 
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

    update(diff) {
        generatePoints("g", diff * buyableEffect("xp", 11));
    },

    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
    ],
    layerShown(){return hasUpgrade("xp", 25)},
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
        return "loot will help you level up much faster, your best loot will multiply your Lv & XP gain by "+format(eff)+"."
    },
    color: "#33D8FF",
    requires: new Decimal(1e10), // Can be a function that takes requirement increases into account
    resource: "loot", // Name of prestige currency
    baseResource: "gold", // Name of resource prestige is based on
    baseAmount() {return player.g.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.25, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1);
        let xpLogMult = player.xp.points.add(1).log10().div(10);
        mult = mult.times(xpLogMult);
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    upgrades: {
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
    ],
    layerShown(){return hasUpgrade("g", 25)},
})