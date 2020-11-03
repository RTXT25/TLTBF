addLayer("r", {
    name: "rubies", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "R", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 8, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
        best: new Decimal(0),
    }},
    effect() {
        eff = player[this.layer].points.add(1).log2().add(1).pow(5);
        if (hasUpgrade("r", 13)) {
            eff = eff.times(Decimal.max(Decimal.times(player.r.best, player.r.best), new Decimal(1)));
        }
        if (hasMilestone("r", 3)) {
            eff = eff.pow(2);
        }
        if (hasMilestone("r", 5)) {
            eff = eff.pow(2);
        }
        eff = eff.pow(layers.q.challenges[13].rewardEffect());
        return eff
        },
    effectDescription() {
        eff = this.effect();
        return "Rubies make you richer! Gold gain and level gain are multiplied by "+format(eff)+
        "x.";
    },
    color: "#FF335B",
    requires() {
        let baseVal = new Decimal(2e20);
        baseVal = baseVal.div(layers.q.challenges[14].rewardEffect());
        return baseVal;
    }, // Can be a function that takes requirement increases into account
    resource: "rubies", // Name of prestige currency
    baseResource: "gold", // Name of resource prestige is based on
    softcap: new Decimal("1e1000"),
    baseAmount() {return player.g.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent() {
        let baseExp = 2.7;
        if (hasMilestone("r", 3)) {
            baseExp *= 0.8;
        }
        if (hasUpgrade("r", 13)) {
            baseExp *= 0.99;
        }
        if (hasUpgrade("xp", 55)) {
            baseExp /= 2;
        }
        baseExp = baseExp / layers.q.challenges[18].rewardEffect();
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
        13: {
            title: "Era of Adventures",
            description: "Decreases ruby and level exponent by 1%. Ruby bonus is multiplied by square of your best rubies. Unlocks new layer.",
            cost: new Decimal(3),
            unlocked() { return ((hasUpgrade(this.layer, 12) && hasUpgrade("xp", 45)) || hasUpgrade(this.layer, 13)) },
        },
        14: {
            title: "Bonus Bonus",
            description: "Loot effect is also multiplied by the sqrt value of ruby effect",
            cost: new Decimal(6),
            unlocked() { return ((hasUpgrade(this.layer, 13) && player.r.points.gte(6)) || hasUpgrade(this.layer, 14)) },
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
            done() {return player[this.layer].best.gte(4)}, // Used to determine when to give the milestone
            effectDescription: "Ruby exponent is decreased by 20 percent. Ruby bonus is squared.",
        },
        4: {requirementDescription: "Get 10 max rubies",
            unlocked() {return hasMilestone("r", 3)},
            done() {return player[this.layer].best.gte(10)}, // Used to determine when to give the milestone
            effectDescription: "Loot base requirement is divided by 5,000",
        },
        5: {requirementDescription: "Get 300 max rubies",
            unlocked() {return hasMilestone("r", 4)},
            done() {return player[this.layer].best.gte(300)}, // Used to determine when to give the milestone
            effectDescription: "Ruby effect is squared. Again.",
        },
    },
    buyables: {
        rows: 1,
        cols: 1,
        showRespec: false,
        11: {
            title: "Better Exponents", // Optional, displayed at the top in a larger font
            cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(new Decimal(1.1), x.pow(2));
                cost = cost.times("1e12");
                return cost.floor()
            },
            effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
                let eff = x.times(0.05).plus(1);
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " loot\n\
                Amount: " + player[this.layer].buyables[this.id] + "\n\
                XP and gold base exponents are powered to ^" + format(data.effect)
            },
            unlocked() { return (hasUpgrade("l", 55)) }, 
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

    row: 1, // Row the layer is in on the tree (0 is the first row)

    hotkeys: [
    ],
    branches: [["g", 3], ["xp", 3]],

    layerShown(){return (hasUpgrade("g", 35) || player.r.best.gte(1))},
})
