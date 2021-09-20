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
        if (hasUpgrade("t", 12)) eff = eff.times(1000000);
        return eff;
    },
    effect2() {
        eff2 = player[this.layer].total.plus(1);
        if (hasMilestone("s", 18)) eff2 = eff2.pow(1.25);
        if (hasUpgrade("t", 12)) eff2 = eff2.times(1000000);
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

        if (player[this.layer].points.gte("1e9")) {
            mult = new Decimal(1).div(player[this.layer].points.div("1e9").log(10).plus(1));
        }

        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        let expon = new Decimal(1);

        return expon;
    },


    milestones: {
        0: {requirementDescription: "Let it be faster (Get 1 skill)",
            done() {return player[this.layer].points.gte(1) || hasMilestone("d", 3)}, // Used to determine when to give the milestone
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
            unlocked() {return hasMilestone("s", 0) || hasMilestone("d", 0) || hasMilestone("d", 3)},
            done() {return player[this.layer].points.gte(2) || hasMilestone("d", 0) || hasMilestone("d", 3)}, // Used to determine when to give the milestone
            effectDescription: "Autocomplete quest challenges when you reach the goal.",
        },
        2: {requirementDescription: "Even better boost (Get 3 skills)",
            unlocked() {return hasMilestone("s", 1) || hasMilestone("d", 3)},
            done() {return player[this.layer].points.gte(3) || hasMilestone("d", 3)}, // Used to determine when to give the milestone
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
            unlocked() {return hasMilestone("s", 2) || hasMilestone("d", 3)},
            done() {return player[this.layer].points.gte(4) || hasMilestone("d", 3)}, // Used to determine when to give the milestone
            effectDescription() {
                return "Gain 1000% of xp and gold gain / sec from the beginning";
            },
        },
        4: {requirementDescription: "No need to buy buyables (Get 5 skills)",
            unlocked() {return hasMilestone("s", 3) || hasMilestone("d", 0) || hasMilestone("d", 3)},
            done() {return player[this.layer].points.gte(5) || hasMilestone("d", 0) || hasMilestone("d", 3)}, // Used to determine when to give the milestone
            effectDescription() {
                return "All 1,2nd layers buyables cost nothing and autobuys +10 of them.";
            },
        },
        5: {requirementDescription: "Era of automation (Get 7 skills)",
            toggles: [
                ["s", "autoBuyAll2"]
            ],
            unlocked() {return hasMilestone("s", 4) || hasMilestone("d", 0) || hasMilestone("d", 3)},
            done() {return player[this.layer].points.gte(7) || hasMilestone("d", 0) || hasMilestone("d", 3)}, // Used to determine when to give the milestone
            effectDescription: "Autobuys all prev. layer upgrades now. You don't have to bother about them anymore.",
        },
        6: {requirementDescription: "No more challenge corruptions (Get 8 skills)",
            unlocked() {return hasMilestone("s", 5) || hasMilestone("d", 3)},
            done() {return player[this.layer].points.gte(8) || hasMilestone("d", 3)}, // Used to determine when to give the milestone
            effectDescription: "All upgrades that cost levels are free now. Also buying up to 1,000 more of second ruby buyable / tick.",
        },
        7: {requirementDescription: "Why should I even prestige? (Get 10 skills)",
            unlocked() {return hasMilestone("s", 6) || hasMilestone("d", 0) || hasMilestone("d", 3)},
            done() {return player[this.layer].points.gte(10) || hasMilestone("d", 0) || hasMilestone("d", 3)}, // Used to determine when to give the milestone
            effectDescription: "You get +100% of your loot, quests and rubies / second",
        },
        8: {requirementDescription: "Faster completions (Get 13 skills)",
            unlocked() {return hasMilestone("s", 7) || hasMilestone("d", 3)},
            done() {return player[this.layer].points.gte(13) || hasMilestone("d", 3)}, // Used to determine when to give the milestone
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
            unlocked() {return hasMilestone("s", 8) || hasMilestone("d", 3)},
            done() {return player[this.layer].points.gte(16) || hasMilestone("d", 3)}, // Used to determine when to give the milestone
            effect() {
                let eff = player[this.layer].total.pow(2);
                if (eff.gte(10000)) {
                    eff = eff.div(10000).pow(0.1).times(10000).round();
                }
                if (eff.gte(1000000)) {
                    eff = eff.div(1000000).log(69).plus(1).times(1000000).round();
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
            unlocked() {return hasMilestone("s", 9) || hasMilestone("d", 3)},
            done() {return player[this.layer].points.gte(20) || hasMilestone("d", 3)}, // Used to determine when to give the milestone
            effectDescription() {
                return "First seven quest challenge completions are maxed from the beginning.";
            },
        },
        11: {requirementDescription: "Passive quest? (Get 25 skills)",
            unlocked() {return hasMilestone("s", 10) || hasMilestone("d", 3)},
            done() {return player[this.layer].points.gte(25) || hasMilestone("d", 3)}, // Used to determine when to give the milestone
            effectDescription() {
                return "Get 1 quest C8 completion per second (even if you're not in challenge)";
            },
        },
        12: {requirementDescription: "Passive quest 2? (Get 30 skills)",
            unlocked() {return hasMilestone("s", 11) || hasMilestone("d", 3)},
            done() {return player[this.layer].points.gte(30) || hasMilestone("d", 3)}, // Used to determine when to give the milestone
            effectDescription() {
                return "Previous milestone effect is doubled";
            },
        },
        13: {requirementDescription: "Do we need previous layers? (Get 40 skills)",
            unlocked() {return hasMilestone("s", 12) || hasMilestone("d", 3)},
            done() {return player[this.layer].points.gte(40) || hasMilestone("d", 3)}, // Used to determine when to give the milestone
            effectDescription() {
                let eff = layers[this.layer].milestones[8].effect().times(2);
                return "C8/sec is multiplied by 9th milestone effect value: "+eff;
            },
        },
        14: {requirementDescription: "Skill Automation? (Get 50 skills)",
            unlocked() {return hasMilestone("s", 13) || hasMilestone("d", 3)},
            done() {return player[this.layer].points.gte(50) || hasMilestone("d", 3)}, // Used to determine when to give the milestone
            effectDescription() {
                return "Get 1% of skill gain per second. ";
            },
        },
        15: {requirementDescription: "Guess what? (Get 60 skills)",
            unlocked() {return hasMilestone("s", 14) || hasMilestone("d", 3)},
            done() {return player[this.layer].points.gte(60) || hasMilestone("d", 3)}, // Used to determine when to give the milestone
            effectDescription() {
                return "Unlocks new quest challenge? ";
            },
        },
        16: {requirementDescription: "More exp reduction (Get 80 skills)",
            unlocked() {return hasMilestone("s", 15) || hasMilestone("d", 3)},
            done() {return player[this.layer].points.gte(80) || hasMilestone("d", 3)}, // Used to determine when to give the milestone
            effectDescription() {
                return "+ Autobuy 1,000 to first and 10,000 to second rubies upgrades.";
            },
        },
        17: {requirementDescription: "New Layer. Kek. (Get 100 skills)",
            unlocked() {return hasMilestone("s", 16) || hasMilestone("d", 3)},
            done() {return player[this.layer].points.gte(100) || hasMilestone("d", 3)}, // Used to determine when to give the milestone
            effectDescription() {
                return "New layer. Kek.";
            },
        },
        18: {requirementDescription: "Even faster rubies and better effect (Get 500 skills)",
            unlocked() {return hasMilestone("s", 17) || hasMilestone("d", 3)},
            done() {return player[this.layer].points.gte(500) || hasMilestone("d", 3)}, // Used to determine when to give the milestone
            effectDescription() {
                return "+ Autobuy 1,000 to first and 100,000 to second rubies upgrades. Also powers skill effects to power ^1.25";
            },
        },
        19: {requirementDescription: "3xLog*3 (Get 5,000 skills)",
            unlocked() {return hasMilestone("s", 18) || hasMilestone("d", 3)},
            done() {return player[this.layer].points.gte(5000) || hasMilestone("d", 3)}, // Used to determine when to give the milestone
            effectDescription() {
                return "Get up to 3 triple log completions / once";
            },
        },
        20: {requirementDescription: "Log2 log3 effects (Get 10,000 skills)",
            unlocked() {return hasMilestone("s", 19) || hasMilestone("d", 3)},
            done() {return player[this.layer].points.gte(10000) || hasMilestone("d", 3)}, // Used to determine when to give the milestone
            effectDescription() {
                return "Double log reward is powered to ^(1 + (triple log compl.s)/10)";
            },
        },
        21: {requirementDescription: "Extreme Buying (Get 20,000 skills)",
            unlocked() {return hasMilestone("s", 20) || hasMilestone("d", 3)},
            done() {return player[this.layer].points.gte(20000) || hasMilestone("d", 3)}, // Used to determine when to give the milestone
            effectDescription() {
                return "All buyables are bought up to 1e9 / tick";
            },
        },
        22: {requirementDescription: "EXTReme Buying (Get 100,000 skills)",
            unlocked() {return hasMilestone("s", 21) || hasMilestone("d", 3)},
            done() {return player[this.layer].points.gte(100000) || hasMilestone("d", 3)}, // Used to determine when to give the milestone
            effectDescription() {
                return "All buyables are bought up to 1e90 / tick";
            },
        },
        23: {requirementDescription: "EXTREME BUYING (Get 1,000,000 skills)",
            unlocked() {return hasMilestone("s", 22) || hasMilestone("d", 3)},
            done() {return player[this.layer].points.gte(1000000) || hasMilestone("d", 3)}, // Used to determine when to give the milestone
            effectDescription() {
                return "All buyables are bought up to 1e100 / tick and their effects are powered to ^2";
            },
        },
        24: {requirementDescription: "Small Increase (Get 20,000,000 skills)",
            unlocked() {return hasMilestone("s", 23) || hasMilestone("d", 3)},
            done() {return player[this.layer].points.gte(20000000) || hasMilestone("d", 3)}, // Used to determine when to give the milestone
            effectDescription() {
                return "Treasure exponent is increased by 0.025";
            },
        },
        25: {requirementDescription: "Small Increase II (Get 400,000,000 skills)",
            unlocked() {return hasMilestone("s", 24) || hasMilestone("d", 3)},
            done() {return player[this.layer].points.gte(400000000) || hasMilestone("d", 3)}, // Used to determine when to give the milestone
            effectDescription() {
                return "Treasure exponent is increased by another 0.025";
            },
        },
        26: {requirementDescription: "No need to repeat the challenge (Get 1,000,000,000 skills)",
            unlocked() {return hasMilestone("s", 25) || hasMilestone("d", 3)},
            done() {return player[this.layer].points.gte(1000000000) || hasMilestone("d", 3)}, // Used to determine when to give the milestone
            effectDescription() {
                if (hasUpgrade("t", 31)) {
                    if (!hasMilestone("s", 27)) {
                        return "Removes ability to treasure prestige, but gain "+ 
                        format(new Decimal(10).plus(upgradeEffect("t", 31))) +"% of treasure value / sec";
                    }
                    else {
                        return "Removes ability to treasure prestige, but gain "+ 
                        format(new Decimal(10).plus(upgradeEffect("t", 31).times(3))) +"% of treasure value / sec";
                    }
                }
                else {
                    return "Removes ability to treasure prestige, but gain 10% of treasure value / sec";
                }
            },
        },
        27: {requirementDescription: "Get faster treasures (Get 1e18 skills)",
            unlocked() {return hasMilestone("s", 26) || hasMilestone("d", 3)},
            done() {return player[this.layer].points.gte(1e18) || hasMilestone("d", 3)}, // Used to determine when to give the milestone
            effectDescription() {
                    return "Previous milestone effect is multiplied by 3";
            },
        },
    },

    update(diff) {
        if (hasMilestone("s", 14)) {
            let tic = new Decimal(1);
            if (hasUpgrade("t", 15)) tic = tic.plus(1);
            if (hasUpgrade("t", 25)) tic = tic.plus(upgradeEffect("t", 25));

            generatePoints("s", new Decimal(diff).div(100).times(tic));
        }
    },


    tabFormat: ["main-display", 
            ["display-text",
             function() { 
                let tic = new Decimal(1);
                if (hasUpgrade("t", 15)) tic = tic.plus(1);
                if (hasUpgrade("t", 25)) tic = tic.plus(upgradeEffect("t", 25));

                 return hasUpgrade("t", 32) ? "You are gaining " + 
                 format(new Decimal(tmp["s"].resetGain).times(tic.div(100)))
                  + " skills per second" : ""
                },
                {"font-size": "20px"}], "blank", 
            ["prestige-button", "", function (){ return hasUpgrade("t", 32) ? {'display': 'none'} : {}}], "blank",
            ["display-text", function() {return "You have made a total of "+format(player.s.total)+ " skills"},{"font-size": "16px"}]
            , "blank", "milestones"],

    row: 2, // Row the layer is in on the tree (0 is the first row)
    branches: [["q", 2], ["l", 2], ["r", 2]],

    layerShown(){return (challengeCompletions("q", 18) >= 100 || player.s.total.gte(1) || player.d.total.gte(1))},
})
