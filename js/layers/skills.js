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
        if (eff.gte(100)) {
            eff = eff.sub(100).pow(0.01).plus(100);
        }
        eff = eff.times(player[this.layer].total.plus(4).log(4));
        if (hasMilestone("s", 18)) eff = eff.pow(1.25);
        if (hasUpgrade("t", 12)) eff = eff.times(100);
        return eff;
    },
    effect2() {
        eff2 = player[this.layer].total.plus(1);
        if (hasMilestone("s", 18)) eff2 = eff2.pow(1.25);
        if (hasUpgrade("t", 12)) eff2 = eff2.times(100);
        return eff2;
    },
    softcap() {
        return new Decimal(1000000);
    },
    effectDescription() {
        eff = this.effect();
        eff2 = this.effect2();
        return "Skills can make you level up and complete first two layers faster. Total S. divides loot,"+
        " quests and ruby exp by "+format(eff)+
        ". Multiplies XP and gold exponents by "+format(eff2)+". Needs 100 last (8) quest challenge competitions for skill prestige."
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
        let baseExp = new Decimal(1.5);
        baseExp = baseExp.times(layers["t"].effect2());

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
                    base = layers[this.layer].milestones[2].effect();
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
                if (hasMilestone("s", 2)) {
                    return "You can progress faster. Multiplies xp, gold and level gain by "+
                    format(layers[this.layer].milestones[2].effect())+"^(total_upgrades). Now: x"+format(eff);
                }
                else {
                    return "You can progress faster. Multiplies xp, gold and level gain by "
                    +"2^(total_upgrades). Now: x"+format(eff);
                }
            },
        },
        1: {requirementDescription: "Yeah. You waited for it (Get 2 skills)",
            unlocked() {return hasMilestone("s", 0)},
            done() {return player[this.layer].points.gte(2)}, // Used to determine when to give the milestone
            effectDescription: "Autocomplete quest challenges when you reach the goal.",
        },
        2: {requirementDescription: "Even better boost (Get 3 skills)",
            unlocked() {return hasMilestone("s", 1)},
            done() {return player[this.layer].points.gte(3)}, // Used to determine when to give the milestone
            effect() {
                let eff = new Decimal(1).plus(player[this.layer].total.pow(0.4));
                return eff;
            },
            effectDescription() {
                let eff = layers[this.layer].milestones[this.id].effect();
                return "First milestone bonus base is now based on your total skills. Now: "+format(eff);
            },
        },
        3: {requirementDescription: "Lol (Get 4 skills)",
            unlocked() {return hasMilestone("s", 2)},
            done() {return player[this.layer].points.gte(4)}, // Used to determine when to give the milestone
            effectDescription() {
                return "Gain 1000% of xp and gold gain / sec from the beginning";
            },
        },
        4: {requirementDescription: "No need to buy buyables (Get 5 skills)",
            unlocked() {return hasMilestone("s", 3)},
            done() {return player[this.layer].points.gte(5)}, // Used to determine when to give the milestone
            effectDescription() {
                return "All 1,2nd layers buyables cost nothing and autobuys +10 of them.";
            },
        },
        5: {requirementDescription: "Era of automation (Get 7 skills)",
            toggles: [
                ["s", "autoBuyAll2"]
            ],
            unlocked() {return hasMilestone("s", 4)},
            done() {return player[this.layer].points.gte(7)}, // Used to determine when to give the milestone
            effectDescription: "Autobuys all prev. layer upgrades now. You don't have to bother about them anymore.",
        },
        6: {requirementDescription: "No more challenge corruptions (Get 8 skills)",
            unlocked() {return hasMilestone("s", 5)},
            done() {return player[this.layer].points.gte(8)}, // Used to determine when to give the milestone
            effectDescription: "All upgrades that cost levels are free now. Also buying up to 1,000 more of second ruby buyable / tick.",
        },
        7: {requirementDescription: "Why should I even prestige? (Get 10 skills)",
            unlocked() {return hasMilestone("s", 6)},
            done() {return player[this.layer].points.gte(10)}, // Used to determine when to give the milestone
            effectDescription: "You get +100% of your loot, quests and rubies / second",
        },
        8: {requirementDescription: "Faster completions (Get 13 skills)",
            unlocked() {return hasMilestone("s", 7)},
            done() {return player[this.layer].points.gte(13)}, // Used to determine when to give the milestone
            effect() {
                let eff = new Decimal(1).plus(player[this.layer].total.div(10).pow(2).floor());
                return eff;
            },
            effectDescription() {
                let eff = layers[this.layer].milestones[this.id].effect();
                return "Gain more completions based on your current skills. Up to"+
            " 1 + floor((skills/10)^2) = "+eff;
            },
        },
        9: {requirementDescription: "Little increase (Get 16 skills)",
            unlocked() {return hasMilestone("s", 8)},
            done() {return player[this.layer].points.gte(16)}, // Used to determine when to give the milestone
            effect() {
                let eff = player[this.layer].total.pow(2);
                if (eff.gte(10000)) {
                    eff = eff.div(10000).pow(0.1).times(10000).round();
                }
                return eff.round();
            },
            effectDescription() {
                let eff = layers[this.layer].milestones[this.id].effect();
                return "Max level is increased by total skills squared: "+
            " +"+format(eff)+" (Hardcapped at 10,000). +2,000 2nd ruby buyables/tick.";
            },
        },
        10: {requirementDescription: "No worries about 7 quests (Get 20 skills)",
            unlocked() {return hasMilestone("s", 9)},
            done() {return player[this.layer].points.gte(20)}, // Used to determine when to give the milestone
            effectDescription() {
                return "First seven quest challenge completions are maxed from the beginning.";
            },
        },
        11: {requirementDescription: "Passive quest? (Get 25 skills)",
            unlocked() {return hasMilestone("s", 10)},
            done() {return player[this.layer].points.gte(25)}, // Used to determine when to give the milestone
            effectDescription() {
                return "Get 1 quest C8 completion per second (even if you're not in challenge)";
            },
        },
        12: {requirementDescription: "Passive quest 2? (Get 30 skills)",
            unlocked() {return hasMilestone("s", 11)},
            done() {return player[this.layer].points.gte(30)}, // Used to determine when to give the milestone
            effectDescription() {
                return "Previous milestone effect is doubled";
            },
        },
        13: {requirementDescription: "Do we need previous layers? (Get 40 skills)",
            unlocked() {return hasMilestone("s", 12)},
            done() {return player[this.layer].points.gte(40)}, // Used to determine when to give the milestone
            effectDescription() {
                let eff = layers[this.layer].milestones[8].effect().times(2);
                return "C8/sec is multiplied by 9th milestone effect value: "+eff;
            },
        },
        14: {requirementDescription: "Skill Automation? (Get 50 skills)",
            unlocked() {return hasMilestone("s", 13)},
            done() {return player[this.layer].points.gte(50)}, // Used to determine when to give the milestone
            effectDescription() {
                return "Get 1% of skill gain per second. ";
            },
        },
        15: {requirementDescription: "Guess what? (Get 100 skills)",
            unlocked() {return hasMilestone("s", 14)},
            done() {return player[this.layer].points.gte(100)}, // Used to determine when to give the milestone
            effectDescription() {
                return "Unlocks new quest challenge? ";
            },
        },
        16: {requirementDescription: "More exp reduction (Get 120 skills)",
            unlocked() {return hasMilestone("s", 15)},
            done() {return player[this.layer].points.gte(120)}, // Used to determine when to give the milestone
            effectDescription() {
                return "+ Autobuy 1,000 to first and 10,000 to second rubies upgrades.";
            },
        },
        17: {requirementDescription: "New Layer. Kek. (Get 200 skills)",
            unlocked() {return hasMilestone("s", 16)},
            done() {return player[this.layer].points.gte(200)}, // Used to determine when to give the milestone
            effectDescription() {
                return "New layer. Kek.";
            },
        },
        18: {requirementDescription: "Even faster rubies and better effect (Get 500 skills)",
            unlocked() {return hasMilestone("s", 17)},
            done() {return player[this.layer].points.gte(500)}, // Used to determine when to give the milestone
            effectDescription() {
                return "+ Autobuy 1,000 to first and 100,000 to second rubies upgrades. Also powers skill effects to power ^1.25";
            },
        },
        19: {requirementDescription: "3xLog*3 (Get 10,000 skills)",
            unlocked() {return hasMilestone("s", 18)},
            done() {return player[this.layer].points.gte(10000)}, // Used to determine when to give the milestone
            effectDescription() {
                return "Get up to 3 triple log completions / once";
            },
        },
    },

    update(diff) {
        if (hasMilestone("s", 14)) {
            generatePoints("s", new Decimal(diff).div(100));
        }
    },

    row: 2, // Row the layer is in on the tree (0 is the first row)
    branches: [["q", 2], ["l", 2], ["r", 2]],

    layerShown(){return (challengeCompletions("q", 18) >= 100 || player.s.total.gte(1))},
})
