addLayer("t", {
    name: "treasures", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "T", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
        total: new Decimal(0),
    }},
    effect() {
        eff = player[this.layer].points.times(100000);
        if (hasUpgrade("t", 11)) eff = eff.times(1.5);

        if (eff.gte(100000000)) {
            eff = eff.div(100000000).log(27).plus(1).times(100000000);
        }
        return eff;
    },
    effect2() {
        eff2 = player[this.layer].points.div(1000).plus(1);
        if (hasUpgrade("t", 11)) eff2 = eff2.sub(1).times(1.5).plus(1);

        if (eff2.gte(10)) {
            eff = eff.sub(9).log(10).add(9);
        }

        return eff2;
    },
    softcap() {
        return new Decimal(1000000);
    },
    canReset(){ 
        return !hasMilestone("s", 26);
    },
    effectDescription() {
        eff = this.effect();
        eff2 = this.effect2();
        return "Treasures help you get more skills. Lol."+
        " Increases your max level by "+format(eff)+
        ". Increases your skill gain by "+format(eff2.sub(1).times(100))+"%. Needs 60 really last" 
        + " (9) quest challenge competitions for treasure prestige."
    },
    color: "#FFFFFF",
    requires() {
        let req = new Decimal(2000000);
        if (challengeCompletions("q", 19) < 60) {
            req = req.pow(1000);
        }
        return req;
    },
    resource: "treasures", // Name of prestige currency
    baseResource: "levels", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent() {
        let baseExp = new Decimal(0.5);
        
        if (hasUpgrade('s', 24)) {
            baseExp = baseExp.plus(0.025);
        }

        if (hasUpgrade('s', 25)) {
            baseExp = baseExp.plus(0.025);
        }

        return baseExp;
    }, // Prestige currency exponent

    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1);
        if (challengeCompletions("q", 19) < 60) {
            mult = mult.times(0);
        }
        if (hasUpgrade("t", 14)) mult = mult.times(upgradeEffect("t", 14));
        if (hasUpgrade("t", 24)) mult = mult.times(upgradeEffect("t", 24));

        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        let expon = new Decimal(1);

        return expon;
    },

    upgrades: {
        rows: 5,
        cols: 5,
        11: {
            title: "Reset all but then better",
            description: "Multiplies treasure effects by 1.5",
            cost() { return new Decimal(10) },
            unlocked() { return player[this.layer].unlocked },
        },
        12: {
            title: "4 Four Faster",
            description: "Multiplies all skill effects by x100",
            cost() { return new Decimal(20) },
            unlocked() { return (hasUpgrade(this.layer, 11)) },
        },
        13: {
            title: "Greater Rewards",
            description: "Triple LOG reward is powered to ^(1+(completions/1,000))",
            cost() { return new Decimal(25) },
            unlocked() { return (hasUpgrade(this.layer, 12)) },
        },
        14: {
            title: "Better Treasures",
            description: "Treasure gain is multiplied by log1000(skills + 1)+1",
            cost() { return new Decimal(30) },
            unlocked() { return (hasUpgrade(this.layer, 13)) },
            effect() { 
                let eff = player["s"].points.plus(1).log(1000).plus(1);
                return eff;
            },
            effectDisplay() {
                return format(this.effect())+"x " ;
            }, 
        },
        15: {
            title: "Skilly skills",
            description: "Gives another +1% of skill/sec",
            cost() { return new Decimal(100) },
            unlocked() { return (hasUpgrade(this.layer, 14)) },
        },
        21: {
            title: "Fun",
            description: "Double log reward is powered to ^10, triple log reward is powered to ^1.025",
            cost() { return new Decimal(150) },
            unlocked() { return (hasUpgrade(this.layer, 15)) },
        },
        22: {
            title: "Double Fun",
            description: "Double log reward is powered to ^(1 + log10(cur. treasures + 1))",
            cost() { return new Decimal(250) },
            unlocked() { return (hasUpgrade(this.layer, 21)) },
            effect() { 
                let eff = player["t"].points.plus(1).log(10).plus(1);
                return eff;
            },
            effectDisplay() {
                return "^"+format(this.effect());
            },
        },
        23: {
            title: "Triple Fun",
            description: "Level gain is multiplied by log10(level+1)+1 NOT DEPENDED ON CURRENT CHALLENGE",
            cost() { return new Decimal(400) },
            unlocked() { return (hasUpgrade(this.layer, 22)) },
            effect() { 
                let eff = player.points.plus(1).log(10).plus(1);
                return eff;
            },
            effectDisplay() {
                return format(this.effect())+"x";
            },
        },
        24: {
            title: "Treasure Fun",
            description: "Treasure gain is multiplied by log69(treasures + 1)+1",
            cost() { return new Decimal(500) },
            unlocked() { return (hasUpgrade(this.layer, 23)) },
            effect() { 
                let eff = player["t"].points.plus(1).log(69).plus(1);
                return eff;
            },
            effectDisplay() {
                return format(this.effect())+"x " ;
            }, 
        },
        25: {
            title: "Autoskill Fun",
            description: "Adds +N% of skill/sec, where N = log[6.18](total treasures + 1)",
            cost() { return new Decimal(618) },
            unlocked() { return (hasUpgrade(this.layer, 24)) },
            effect() { 
                let eff = player["t"].total.plus(1).log(6.18);
                return eff;
            },
            effectDisplay() {
                return "+" + format(this.effect())+"% " ;
            }, 
        },
    },

    row: 2, // Row the layer is in on the tree (0 is the first row)
    branches: [["q", 2], ["l", 2], ["r", 2], ["s", 2]],



    update(diff) {
        if (hasMilestone("s", 26)) player.t.points = player.t.points.plus(layers.a.getResetGain().times(diff).times(0.1))
    },

    tabFormat: ["main-display", 
            ["display-text",
             function() { 
                 return hasMilestone("s", 26) ? "You are gaining " + 
                 format(layers.a.getResetGain().div(10)) + " treasures per second" : "" 
                },
                {"font-size": "20px"}],
            ["prestige-button", "", function (){ return hasMilestone("s", 26) ? {'display': 'none'} : {}}]
            , "blank", "upgrades"],

    layerShown(){return (hasMilestone("s", 17) || player.t.total.gte(1))},
})
