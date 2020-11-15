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
        return eff;
    },
    effect2() {
        eff2 = player[this.layer].total.plus(1);
        return eff2;
    },
    softcap() {
        return new Decimal(1000000);
    },
    effectDescription() {
        eff = this.effect();
        eff2 = this.effect2();
        return "Skills can make you level up and complete first two layers faster. Total S. divides loot exp by "+format(eff)+
        ". Multiplies XP and gold exponents by "+format(eff2)+". Needs 100 last quest challenge competitions for skill prestige."
    },
    color: "#FFBD4B",
    requires() {
        let req = new Decimal(1000000);
        if (challengeCompletions("q", 18) < 100) {
            req = req.pow(1000);
        }
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
            mult = mult.times(0);
        }

        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        let expon = new Decimal(1);

        return expon;
    },


    milestones: {
        0: {requirementDescription: "Let it be faster (Get 1 skill)",
            done() {return player[this.layer].points.gte(1)}, // Used to determine when to give the milestone
            effect() {
                let eff = new Decimal(1);
                let base = new Decimal(2);
                if (hasMilestone("s", 1)) {
                    base = layers[this.layer].milestones[1].effect();
                }
                for (var i = 1 ; i <= 5 ; ++i) {
                    for (var j = 1 ; j <= 5 ; ++j) {
                        if (hasUpgrade("xp", 10*i + j)) eff = eff.times(base); 
                    }
                }
                for (var i = 1 ; i <= 3 ; ++i) {
                    for (var j = 1 ; j <= 5 ; ++j) {
                        if (hasUpgrade("g", 10*i + j)) eff = eff.times(base); 
                    }
                }
                for (var i = 1 ; i <= 5 ; ++i) {
                    for (var j = 1 ; j <= 5 ; ++j) {
                        if (hasUpgrade("l", 10*i + j)) eff = eff.times(base); 
                    }
                }
                for (var i = 1 ; i <= 2 ; ++i) {
                    for (var j = 1 ; j <= 5 ; ++j) {
                        if (hasUpgrade("r", 10*i + j)) eff = eff.times(base); 
                    }
                }
                return eff;
            },
            effectDescription() {
                let eff = layers[this.layer].milestones[this.id].effect();
                if (hasMilestone("s", 1)) {
                    return "You can progress faster. Multiplies xp, gold and level gain by "+
                    format(layers[this.layer].milestones[1].effect())+"^(total_upgrades). Now: x"+format(eff);
                }
                else {
                    return "You can progress faster. Multiplies xp, gold and level gain by "
                    +"2^(total_upgrades). Now: x"+format(eff);
                }
            },
        },
        1: {requirementDescription: "Even better boost (Get 2 skills)",
            unlocked() {return hasMilestone("s", 0)},
            done() {return player[this.layer].points.gte(2)}, // Used to determine when to give the milestone
            effect() {
                let eff = new Decimal(1).plus(player[this.layer].total.pow(0.4));
                return eff;
            },
            effectDescription() {
                let eff = layers[this.layer].milestones[this.id].effect();
                return "Previous milestone bonus base is now based on your total skills. Now: "+format(eff);
            },
        },
        2: {requirementDescription: "Lol (Get 3 skills)",
            unlocked() {return hasMilestone("s", 1)},
            done() {return player[this.layer].points.gte(3)}, // Used to determine when to give the milestone
            effectDescription() {
                return "Gain 1000% of xp and gold gain / sec from the beginning";
            },
        },
        3: {requirementDescription: "No need to buy buyables (Get 4 skills)",
            unlocked() {return hasMilestone("s", 2)},
            done() {return player[this.layer].points.gte(4)}, // Used to determine when to give the milestone
            effectDescription() {
                return "All 1,2nd layers buyables cost nothing and autobuys +10 of them.";
            },
        },
        4: {requirementDescription: "Era of automation (Get 6 skills)",
            toggles: [
                ["s", "autoBuyAll2"]
            ],
            unlocked() {return hasMilestone("s", 3)},
            done() {return player[this.layer].points.gte(6)}, // Used to determine when to give the milestone
            effectDescription: "Autobuys all prev. layer upgrades now. You don't have to bother about them anymore.",
        },
        5: {requirementDescription: "No more challenge corruptions (Get 7 skills)",
            unlocked() {return hasMilestone("s", 4)},
            done() {return player[this.layer].points.gte(7)}, // Used to determine when to give the milestone
            effectDescription: "All upgrades that cost levels are free now.",
        },
        6: {requirementDescription: "Yeah. You waited for it (Get 8 skills)",
            unlocked() {return hasMilestone("s", 5)},
            done() {return player[this.layer].points.gte(8)}, // Used to determine when to give the milestone
            effectDescription: "Autocomplete quest challenges when you reach the goal.",
        },
        7: {requirementDescription: "Why should I even prestige? (Get 10 skills)",
            unlocked() {return hasMilestone("s", 6)},
            done() {return player[this.layer].points.gte(10)}, // Used to determine when to give the milestone
            effectDescription: "You get +100% of your loot, quests and rubies / second",
        },
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    branches: [["q", 2], ["l", 2], ["r", 2]],

    layerShown(){return (challengeCompletions("q", 18) >= 100 || player.s.total.gte(1))},
})
