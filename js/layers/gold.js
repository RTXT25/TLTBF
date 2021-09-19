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
    costDecrement() {
        if (hasUpgrade('l', 54)) {
            return 0.05;
        }
        else {
            return 1;
        }
    },
    exponent() {
        let bExp = new Decimal(3);
        if (hasUpgrade('l', 43)) {
            bExp = bExp.plus(1);
        }
        if (hasUpgrade('l', 44)) {
            bExp = bExp.plus(100);
        }
        bExp = bExp.plus(layers.q.challenges[17].rewardEffect());

        if (hasUpgrade('l', 53)) {
            bExp = bExp.times(10);
        }

        bExp = bExp.pow(buyableEffect("r", 11));
        
        bExp = bExp.times(layers["s"].effect2());

        if (inChallenge("q", 18)) {
            bExp = bExp.plus(1).log(1000);
        }

        if (inChallenge("q", 19)) {
            bExp = bExp.plus(1).log(1000000).plus(1).log(1000000);
        }

        return bExp;

    },
    softcap() {
        return new Decimal("1e10000");
    },
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

        mult = mult.pow((hasUpgrade("l", 23)) ? upgradeEffect("l", 23) : new Decimal(1));
        
        mult = mult.times((hasUpgrade("g", 31)) ? upgradeEffect("g", 31) : new Decimal(1));
        mult = mult.times((hasUpgrade("g", 32)) ? upgradeEffect("g", 32) : new Decimal(1));
        mult = mult.times((hasUpgrade("g", 35)) ? upgradeEffect("g", 35) : new Decimal(1));


        let rubyEff = player.r.points.add(1).log2().add(1).pow(5);
        if (hasUpgrade("r", 13)) {
            rubyEff = rubyEff.times(Decimal.max(Decimal.times(player.r.best, player.r.best), new Decimal(1)));
        }
        if (hasMilestone("r", 3)) {
            rubyEff = rubyEff.pow(2);
        }
        rubyEff = rubyEff.pow(layers.q.challenges[13].rewardEffect());
        
        mult = mult.times(rubyEff); 

        
        mult = mult.times((hasUpgrade("r", 11)) ? upgradeEffect("r", 11) : new Decimal(1));
        mult = mult.times((hasUpgrade("r", 12)) ? upgradeEffect("r", 12) : new Decimal(1));

        mult = mult.times((hasUpgrade("xp", 45)) ? new Decimal(1000) : new Decimal(1));
        mult = mult.times((hasUpgrade("xp", 54)) ? upgradeEffect("xp", 54) : new Decimal(1));

        mult = mult.times((hasUpgrade("l", 41)) ? upgradeEffect("l", 41) : new Decimal(1));

        mult = mult.pow(player.points.div(layers.q.challenges[16].rewardEffect()).plus(1));


        mult = mult.times((hasUpgrade("l", 52)) ? upgradeEffect("l", 52) : new Decimal(1));

        if (hasMilestone("s", 0)) {
            mult = mult.times(layers["s"].milestones[0].effect());
        }
        
        if (inChallenge("q", 11)) mult = mult = mult.pow(challengeVar("q", 11));
        else {
            mult = mult.pow(layers.q.challenges[11].rewardEffect());
        }
        if (inChallenge("q", 12)) mult = mult = mult.tetrate(challengeVar("q", 12));

        
        if (inChallenge("q", 15)) {
            mult = mult.plus(1).log(challengeVar("q", 15));
            if (isNaN(mult)) mult = new Decimal(1);
        }

        if (inChallenge("q", 16)) {
            let chavarVal = new Decimal(challengeVar("q", 16));
            mult = mult.pow(new Decimal(1).div(player.points.times(chavarVal).plus(1)));
            if (isNaN(mult)) mult = new Decimal(1);
        }
        
        if (inChallenge("q", 18)) {
            mult = mult.plus(1).log(1000).plus(1).log(1000);
            if (isNaN(mult)) mult = new Decimal(1);
        }
        
        if (inChallenge("q", 19)) {
            mult = mult.plus(1).log(1000000).plus(1).log(1000000).plus(1).log(1000000);
            if (isNaN(mult)) mult = new Decimal(1);
        }

        if (inChallenge("q", 14) || inChallenge("q", 17)) mult = mult.times(new Decimal("1e-9999999999").pow(new Decimal("1e9999999999")));


        if (hasUpgrade("r", 15)) {
            mult = mult.times(2);
        }

        //soft cap
        if (mult.gte(layers.g.softcap())) {
            let getSCP = layers.g.softcap();
            let softCapDivider = mult.log10().sub(getSCP.log10().sub(1)).pow(mult.log10().sub(getSCP.log10().sub(1)).div(250).plus(2));

            if (softCapDivider.gte("e1e200")) {
                softCapDivider = new Decimal("e1e200");
                mult = mult.div(softCapDivider);
            }
            else {
                mult = mult.div(softCapDivider);
            }
        }


        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        let expon = buyableEffect("l", 12);

        if (inChallenge("q", 19)) {
            expon = expon.plus(1).log(1000000);
            if (isNaN(expon)) expon = new Decimal(1);
        }

        return expon
    },
    upgrades: {
        rows: 5,
        cols: 5,
        11: {
            title: "Moneys give levels give moneys",
            description: "Gold and Level gain is multiplied by 10",
            cost() { return new Decimal(5).pow(layers.g.costDecrement()) },
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
            cost() { return new Decimal(50).pow(layers.g.costDecrement()) },
            unlocked() { return (hasUpgrade(this.layer, 11)) },
            effect() { 
                let eff = player[this.layer].total.div(10).pow(0.2);
                if (hasUpgrade(this.layer, 14)) eff = eff.pow(upgradeEffect("g", 14));
                if (eff.gte(new Decimal("1e125"))) {
                    eff = eff.div(new Decimal("1e125")).pow(0.05).times(new Decimal("1e125"));
                    //softcap
                }
                if (eff.gte(new Decimal("1e2500"))) {
                    eff = eff.div(new Decimal("1e2500")).pow(0.001).times(new Decimal("1e2500"));
                    //hardcap
                }
                if (eff.gte(new Decimal("1e10000"))) {
                    eff = eff.div(new Decimal("1e10000")).pow(0.0001).times(new Decimal("1e10000"));
                    //very hardcap
                }
                return eff;
            },
            effectDisplay() {
                let eff = this.effect();
                if (eff.lte(new Decimal("1e125"))) {
                    return format(this.effect())+"x " ;
                }
                else if (eff.lte(new Decimal("1e2500"))) {
                    return format(this.effect())+"x (softcapped)";
                }
                else if (eff.lte(new Decimal("1e10000"))) {
                    return format(this.effect())+"x (hardcapped)";
                }
                else {
                    return format(this.effect())+"x (very hardcapped)";
                }
               
            }, // Add formatting to the effect
        },
        13: {
            title: "You still need XP",
            description: "Gold gain is multiplied by log10(xp + 10)",
            cost() { return new Decimal(100).pow(layers.g.costDecrement()) },
            unlocked() { return (hasUpgrade(this.layer, 12)) },
            effect() { 
                let eff = player.xp.points.plus(10).log10();
                return eff;
            },
            effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
        },
        14: {
            title: "More XP from gold",
            cost() { return new Decimal(500).pow(layers.g.costDecrement()) },
            softcap() { return new Decimal(10) },
            hardcap() { return new Decimal(100) },
            very_hardcap() { return new Decimal(100000) },
            unlocked() { return (hasUpgrade(this.layer, 13)) },
            effect() { 
                let teff = player.g.points.plus(10).log10().pow(0.7);
                if (teff.gte(this.softcap())) {
                    eff = teff.sub(this.softcap()).div(100).plus(this.softcap());
                    if (eff.gte(this.hardcap())) {
                        eff = eff.sub(this.hardcap()).div(1000000).plus(this.hardcap());

                        if (eff.gte(this.very_hardcap())) {
                            eff = eff.div(this.very_hardcap()).plus(1000).log(1000).times(this.very_hardcap());
                        }

                    }
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
                if (this.effect().gte(this.very_hardcap())) {
                    return "^"+format(this.effect()) + " (very hardcapped)";
                }
                else if (this.effect().gte(this.hardcap())) {
                    return "^"+format(this.effect()) + " (hardcapped)";
                }
                else {
                    return "^"+format(this.effect()) + (this.effect().gte(this.softcap()) ? " (softcapped)" : "");
                }
            }, 
        },
        15: {
            title: "You can't buy this once",
            description: "Unlocks first buyable upgrade and a new row of xp upgrades",
            cost() { return new Decimal(27).pow(layers.g.costDecrement()).times((hasMilestone("s", 6) ? 0 : 1)) },
            currencyDisplayName: "levels",
            currencyInternalName: "points",
            currencyLayer: "",
            unlocked() { return (hasUpgrade(this.layer, 14)) },
        },
        21: {
            title: "Stronk Buff",
            description: "Multiplies XP, gold and lv gain by value of your level + 1",
            cost() { return new Decimal(1e5).pow(layers.g.costDecrement()) },
            unlocked() { return ((hasUpgrade("xp", 35) && hasUpgrade("g", 15)) || inChallenge("q", 13)) },
            effect() { 
                let eff = player.points.plus(1);
                return eff;
            },
            effectDisplay() { return format(this.effect()) + "x" }, // Add formatting to the effect
        },
        22: {
            title: "Even More Gold",
            description: "Multiplies Gold by log10(xp + 10)",
            cost() { return new Decimal(5e7).pow(layers.g.costDecrement()) },
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
            cost() { return new Decimal(1e9).pow(layers.g.costDecrement()) },
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
            cost() { return new Decimal(2e9).pow(layers.g.costDecrement()) },
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
            cost() { return new Decimal(3e9).pow(layers.g.costDecrement()) },
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
            cost() { return new Decimal(1e16).pow(layers.g.costDecrement()) },
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
            cost() { return new Decimal(3e16).pow(layers.g.costDecrement()) },
            unlocked() { return (hasUpgrade("g", 31)) },
            effect() { 
                let eff = new Decimal(10);
                return eff;
            },
        },
        33: {
            title: "Loot MegaBoost!",
            description: "Loot Base Exponent 1/4 -> 1/5",
            cost() { return new Decimal(1e18).pow(layers.g.costDecrement()) },
            unlocked() { return (hasUpgrade("g", 32)) },
        },
        34: {
            title: "Risky but Effective",
            description: "All passive upgrade effects are cubed",
            cost() { return new Decimal(1e19).pow(layers.g.costDecrement()) },
            unlocked() { return (hasUpgrade("g", 33)) },
        },
        35: {
            title: "It will be cool in future",
            description: "Gold gain multiplied by max(1, (lvl^2)/10000). Also unlocks new layer.",
            cost() { return new Decimal(1e20).pow(layers.g.costDecrement()) },
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
                if (hasMilestone("s", 23)) eff = eff.pow(2);
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " gold\n\
                Amount: " + format(player[this.layer].buyables[this.id]) + "\n\
                Generate " + (data.effect.lte(10) ? format(data.effect.times(100)) + "%" : "x" + format(data.effect)) + " XP per second";
            },
            unlocked() { return (hasUpgrade(this.layer, 15)) }, 
            canAfford() {
                return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},

            buy(ticks=new Decimal(1)) { 

                cost = tmp[this.layer].buyables[this.id].cost

                let x = new Decimal(player[this.layer].buyables[this.id].plus(ticks).sub(1));
                let newCost = Decimal.pow(new Decimal(2), x.pow(1.2));
                newCost = newCost.times(1000);
                newCost = newCost.floor();

                if (player[this.layer].points.gte(newCost) && ticks.gte(1)) {
                    if (!hasMilestone("r", 1) && !hasMilestone("s", 4)) {
                        player[this.layer].points = player[this.layer].points.sub(cost)	
                    }
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(ticks)
                    player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
                }
                else {
                    if (ticks.gte(new Decimal(1))) layers.g.buyables[11].buy(ticks.div(2));
                }
            },
        },
    },

    update(diff) {
        generatePoints("g", new Decimal(diff).times(buyableEffect("xp", 11).plus(hasMilestone("r", 0) ? 1 : 0).plus(hasMilestone("s", 3) ? 10 : 0)));
        if (hasMilestone("r", 1) || hasMilestone("s", 4)) {
            let ticks = hasMilestone("r", 1) + (hasMilestone("s", 4) * 10) + (hasMilestone("s", 21) * 1e9) + (hasMilestone("s", 22) * 1e90);
            if (hasMilestone("q", 5)) ticks = 20 + (hasMilestone("s", 4) * 10) + (hasMilestone("s", 21) * 1e9) + (hasMilestone("s", 22) * 1e90);
            if (hasMilestone("q", 14)) ticks = 1000 + (hasMilestone("s", 4) * 10) + (hasMilestone("s", 21) * 1e9) + (hasMilestone("s", 22) * 1e90);
            if (hasMilestone("q", 15)) ticks = 100000 + (hasMilestone("s", 4) * 10) + (hasMilestone("s", 21) * 1e9) + (hasMilestone("s", 22) * 1e90);
            
            ticks = new Decimal(ticks);
            if (hasMilestone("s", 23)) {
                ticks = new Decimal(ticks).plus("1e100");
            }

            if (layers.g.buyables[11].unlocked() && layers.g.buyables[11].canAfford()) {
                layers.g.buyables[11].buy(ticks);
            }
            if (layers.xp.buyables[11].unlocked() && layers.xp.buyables[11].canAfford()) {
                layers.xp.buyables[11].buy(ticks);
            }
        }
    },

    automate() {
        if (player["q"].autoBuyGold || player["s"].autoBuyAll2) {
            for (let x = 10; x <= 30; x += 10){ 
                for (let y = 1; y <= 5; y++) {
                    var z = x + y
                    if (!hasUpgrade("g", z) && canAffordUpgrade("g", z) && 
                    (hasMilestone("q", 2) || hasMilestone("s", 4)) && layers["g"].upgrades[z].unlocked()===true) {
                        buyUpg("g", z);
                    }
                }
            }
        }
    },

    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
    ],
    layerShown(){return (hasUpgrade("xp", 25) || hasMilestone("r", 0))},
})
