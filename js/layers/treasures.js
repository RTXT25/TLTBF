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
        eff = player[this.layer].total.times(100000);
        return eff;
    },
    effect2() {
        eff2 = player[this.layer].total.div(1000).plus(1);
        return eff2;
    },
    softcap() {
        return new Decimal(1000000);
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
        let baseExp = 0.5;

        return baseExp;
    }, // Prestige currency exponent

    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1);
        if (challengeCompletions("q", 19) < 60) {
            mult = mult.times(0);
        }

        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        let expon = new Decimal(1);

        return expon;
    },

    row: 2, // Row the layer is in on the tree (0 is the first row)
    branches: [["q", 2], ["l", 2], ["r", 2], ["s", 2]],

    layerShown(){return (hasMilestone("s", 17) || player.t.total.gte(1))},
})
