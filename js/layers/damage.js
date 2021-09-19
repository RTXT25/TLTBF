addLayer("d", {
    name: "damage", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "D", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
        total: new Decimal(0),
    }},
    effect() {
        eff = player[this.layer].total.times(2).plus(1);
        return eff;
    },
    softcap() {
        return new Decimal(1000000);
    },
    canReset(){ 
        return true;
    },
    effectDescription() {
        eff = this.effect();
        return "Damage helps you get more levels not based on your challenge: x"+
        format(eff) + ". Treasure gain: x" + format(eff);
    },
    color: "#841527",
    requires() {
        let req = new Decimal(1000000);
        return req;
    },
    resource: "damage", // Name of prestige currency
    baseResource: "treasures", // Name of resource prestige is based on
    baseAmount() {return player.t.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent() {
        let baseExp = new Decimal(0.25);

        return baseExp;
    }, // Prestige currency exponent

    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1);

        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        let expon = new Decimal(1);

        return expon;
    },

    upgrades: {
        rows: 5,
        cols: 5,
    },


    milestones: {
        0: {requirementDescription: "Save automation",
            unlocked() {return hasMilestone("d", 0)},
            done() {return player[this.layer].points.gte(1)}, // Used to determine when to give the milestone
            toggles: [
                ["d", "autoBuyAll3"]
            ],
            effect() {
                let eff = new Decimal(1);
                return eff;
            },
            effectDescription() {
                let eff = layers[this.layer].milestones[this.id].effect();
                 return "Keeps 2, 5 and 6th skill milestones on reset, also autobuys treasure upgrades";
            },
        },
    },

    row: 3, // Row the layer is in on the tree (0 is the first row)
    branches: [["t", 2], ["s", 2]],



    update(diff) {
    },

    tabFormat: ["main-display", 
            , "blank", 
            ["display-text", function() {return "Total damage: "+format(player.d.total)},{"font-size": "14px"}],
            ["prestige-button", "", function (){ return false ? {'display': 'none'} : {}}]
            , "blank", "upgrades", "milestones"],

    layerShown(){return (player.t.total.gte(1000000) || player.d.total.gte(1))},
})
