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
            return mult
        },
        gainExp() { // Calculate the exponent on main currency from bonuses
            return new Decimal(1)
        },
        row: 0, // Row the layer is in on the tree (0 is the first row)
        hotkeys: [
            {key: "x", description: "Reset for exp", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
        ],
        layerShown(){return true},

        upgrades: {
            rows: 2,
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
                cost: new Decimal(100000),
                unlocked() { return (hasUpgrade(this.layer, 21))},
                effect() {
                    if (hasUpgrade(this.layer, 23)) {
                        let eff = player[this.layer].resetGain.plus(1).pow(0.11);
                        return eff;
                    }
                    else return new Decimal(1);
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
            },
        },
})