addLayer("s", {
    name: "skills", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "S", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 4, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
        total: new Decimal(0),
    }},
    effect() {
        eff = player[this.layer].total.div(10).add(1).pow(0.9);
        return eff
    },
    effect2() {
        eff2 = player[this.layer].total.plus(1);
        return eff
    },
    effectDescription() {
        eff = this.effect();
        eff2 = this.effect2();
        return "Skills can make you level up and complete first two layers faster. Total S. divides loot exp by "+format(eff)+
        ". Multiplies XP and gold exponents by "+format(eff2)
    },
    color: "#FFBD4B",
    requires() {
        let req = new Decimal(1000000);
        return req;
    },
    resource: "skills", // Name of prestige currency
    baseResource: "levels", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent() {
        let baseExp = 4;

        return baseExp;
    }, // Prestige currency exponent

    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1);
        if (challengeCompletions("q", 18) < 100) {
            mult *= 0;
        }

        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        let expon = new Decimal(1);

        return expon;
    },

    row: 2, // Row the layer is in on the tree (0 is the first row)
    branches: [["q", 2], ["l", 2], ["r", 2]],

    layerShown(){return (challengeCompletions("q", 18) >= 100 || player.s.total.gte(1))},
})
