addLayer("l", {
    name: "loot", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "L", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 4, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
        best: new Decimal(0),
    }},
    effect() {
        eff = player[this.layer].best.add(1).pow(0.75);

        let qEff = player.q.total.pow(0.6725).plus(1);
        if (hasMilestone("q", 8)) qEff = qEff.times(4);
        if (hasMilestone("q", 9)) qEff = qEff.times(2);
        //softcap
        if (qEff.gte(100)) {
            qEff = qEff.sub(98).log2().plus(99);
        }

        eff = eff.pow(qEff);
        eff = eff.pow((hasMilestone("q", 1) ? new Decimal(2) : new Decimal(1)));

        if (hasUpgrade('r', 14)) {
            let rubyEff = player.r.points.add(1).log2().add(1).pow(5);
            if (hasUpgrade("r", 13)) {
                rubyEff = rubyEff.times(Decimal.max(Decimal.times(player.r.best, player.r.best), new Decimal(1)));
            }
            if (hasMilestone("r", 3)) {
                rubyEff = rubyEff.pow(2);
            }
            rubyEff = rubyEff.pow(layers.q.challenges[13].rewardEffect());
            eff = eff.times(rubyEff.pow(0.5));
        }

        return eff
        },
    effectDescription() {
        eff = this.effect();
        return "loot will help you level up much faster, your best loot will multiply your Lv & XP gain by "+format(eff)+
        ". (You should wait at least until 100 or 1,000 for better effect)"
    },
    color: "#33D8FF",
    requires() {
        let req = new Decimal(5e9);
        if (hasMilestone("r", 4)) req = req.div(5000);
        return req;
    },
    resource: "loot", // Name of prestige currency
    baseResource: "gold", // Name of resource prestige is based on
    baseAmount() {return player.g.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    resetsNothing: () => (hasMilestone("q", 3)),
    softcap: new Decimal("1e10000"),
    exponent() {
        let baseExp = 0.25;
        if (hasUpgrade("g", 33)) baseExp -= 0.05;
        if (hasUpgrade("xp", 52)) baseExp -= 0.075;
        if (hasUpgrade("xp", 53)) baseExp -= 0.025;
        baseExp = baseExp / layers.q.challenges[15].rewardEffect();
        return baseExp;
    }, // Prestige currency exponent
    base: 2.25,
    canBuyMax: true,
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1);
        let xpLogMult = player.xp.points.add(1).log10().div(10).add(1).pow(2);
        if (hasUpgrade("xp", 51)) xpLogMult = xpLogMult.pow(2);
        mult = mult.div(xpLogMult);
        mult = mult.div((hasUpgrade("l", 31)) ? upgradeEffect("l", 31) : new Decimal(1));
        mult = mult.div((hasUpgrade("xp", 45)) ? new Decimal(1000) : new Decimal(1));

        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        let expon = new Decimal(1);
        expon = expon.times((hasUpgrade("l", 15)) ? upgradeEffect("l", 15) : new Decimal(1));
        expon = expon.pow((hasUpgrade("l", 24)) ? upgradeEffect("l", 24) : new Decimal(1));
        expon = expon.pow((hasUpgrade("l", 25)) ? upgradeEffect("l", 25) : new Decimal(1));

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
            description: "level gain is powered by 1.02",
            cost: new Decimal(100),
            currencyDisplayName: "levels",
            currencyInternalName: "points",
            currencyLayer: "",
            unlocked() { return (hasUpgrade(this.layer, 15)) },
            effect() { 
                return new Decimal(1.02);
            },
            effectDisplay() { return "^" + format(this.effect()) }, // Add formatting to the effect
        },
        22: {
            title: "It's more powerful as it seems",
            description: "XP gain is powered by 1.03",
            cost: new Decimal(102),
            currencyDisplayName: "levels",
            currencyInternalName: "points",
            currencyLayer: "",
            unlocked() { return (hasUpgrade(this.layer, 21)) },
            effect() { 
                return new Decimal(1.03);
            },
            effectDisplay() { return "^" + format(this.effect()) }, // Add formatting to the effect
        },
        23: {
            title: "Golden Mine",
            description: "Gold gain is powered by 1.05",
            cost: new Decimal(104),
            currencyDisplayName: "levels",
            currencyInternalName: "points",
            currencyLayer: "",
            unlocked() { return (hasUpgrade(this.layer, 22)) },
            effect() { 
                return new Decimal(1.05);
            },
            effectDisplay() { return "^" + format(this.effect()) }, // Add formatting to the effect
        },
        24: {
            title: "Loot Loot Loot",
            description: "Loot gain base is powered by 2",
            cost: new Decimal(106),
            currencyDisplayName: "levels",
            currencyInternalName: "points",
            currencyLayer: "",
            unlocked() { return (hasUpgrade(this.layer, 23)) },
            effect() { 
                return new Decimal(2);
            },
            effectDisplay() { return "^" + format(this.effect()) }, // Add formatting to the effect
        },
        25: {
            title: "Loot Era",
            description: "Unlocks two buyable upgrades and loot gain base & xp gain is powered by 1.1",
            cost: new Decimal(110),
            currencyDisplayName: "levels",
            currencyInternalName: "points",
            currencyLayer: "",
            unlocked() { return (hasUpgrade(this.layer, 24)) },
            effect() { 
                return new Decimal(1.1);
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
        41: {
            title: "Where it was earlier?",
            description: "Multiplies your xp, gold and level gain by your loot amount powered to 4",
            cost: new Decimal("1e50"),
            unlocked() { return ((hasUpgrade(this.layer, 35) && hasUpgrade("xp", 55)) || hasUpgrade(this.layer, 41)) },
            effect() {
                let eff = player.l.points.pow(4);
                return eff;
            },
            effectDisplay() { return format(this.effect()) + "x" }, // Add formatting to the effect
        },
        42: {
            title: "Another exponents!",
            description: "Xp base exponent is increased by 1",
            cost: new Decimal("1e58"),
            unlocked() { return (hasUpgrade(this.layer, 41)) },
        },
        43: {
            title: "Nice.",
            description: "Xp and gold base exponent are increased by 1",
            cost: new Decimal("1e69"),
            unlocked() { return (hasUpgrade(this.layer, 42)) },
        },
        44: {
            title: "Great for quests!",
            description: "Xp and gold base exponent are increased by 10. Keep 4th layer of xp upgrades.",
            cost: new Decimal("1e87"),
            unlocked() { return (hasUpgrade(this.layer, 43)) },
        },
    },
    update(diff) {
        if (hasMilestone('q', 7)) {
            generatePoints("l", diff * 0.5);
        }
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
