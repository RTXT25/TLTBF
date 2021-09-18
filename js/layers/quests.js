addLayer("q", {
    name: "quests", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "Q", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
        total: new Decimal(0),
        best: new Decimal(0),
    }},
    effect() {
        eff = player[this.layer].total.pow(0.6725).plus(1);
        if (hasMilestone("q", 8)) eff = eff.times(4);
        if (hasMilestone("q", 9)) eff = eff.times(2);
        //softcap
        if (eff.gte("1e20")) {
            eff = eff.div("1e20").plus(1).log2().times("1e20");
        }
        return eff;
        },
    effectDescription() {
        eff = this.effect();
        let str = "Complete quests and challenges to get more bonuses! Loot Effect Bonus: ^"+format(eff);
        if (eff.gte("1e20")) str += " (softcapped)";
        return str;
    },
    color: "#D895FC",
    requires: new Decimal("e240"), // Can be a function that takes requirement increases into account
    resource: "quests", // Name of prestige currency
    baseResource: "exp", // Name of resource prestige is based on
    baseAmount() {return player.xp.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent() {
        let baseExp = new Decimal(1.6);
        baseExp = baseExp.plus(player.xp.points.plus(1).log(10).plus(1).log(10).div(10000));
        if (hasMilestone('q', 11)) baseExp = baseExp.div(1.1);
        if (hasMilestone('q', 12)) baseExp = baseExp.div(1.1);
        baseExp = baseExp.div(layers.q.challenges[18].rewardEffect());
        baseExp = baseExp.div(layers["s"].effect());
        return baseExp;
    }, // Prestige currency exponent
    base: 1e60,
    canBuyMax: true,
    softcap: new Decimal("1e10000"),
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1.5);
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        let expon = new Decimal(1.1);
        return expon;
    },
    upgrades: {
    },


    challenges: {
        rows: 1,
        cols: 10,
        11: {
            name: "Typical Challenge",
            completionLimit: 12,
            powers() {
                if (challengeCompletions(this.layer, this.id) == 0) return 0.5;
                if (challengeCompletions(this.layer, this.id) == 1) return 0.4;
                if (challengeCompletions(this.layer, this.id) == 2) return 0.32;
                if (challengeCompletions(this.layer, this.id) == 3) return 0.24;
                if (challengeCompletions(this.layer, this.id) == 4) return 0.2;
                if (challengeCompletions(this.layer, this.id) == 5) return 0.16;
                if (challengeCompletions(this.layer, this.id) == 6) return 0.12;
                if (challengeCompletions(this.layer, this.id) == 7) return 0.08;
                if (challengeCompletions(this.layer, this.id) == 8) return 0.04;
                if (challengeCompletions(this.layer, this.id) == 9) return 0.02;
                if (challengeCompletions(this.layer, this.id) == 10) return 0.01;
                if (challengeCompletions(this.layer, this.id) == 11) return 0.001;
                if (challengeCompletions(this.layer, this.id) == 12) return 0.001;
            },
            challengeDescription() {
                return "Level, Exp and Gold gain are powered to ^" + this.powers() 
                + ". This challenge reward doesn't work here.<br>"+challengeCompletions(this.layer, this.id)
                 + "/" + this.completionLimit + " completions";
            },
            unlocked() { return (hasMilestone("q", 0) || inChallenge("q", 11)) },
            goal(){
                if (challengeCompletions(this.layer, this.id) == 0) return new Decimal(1e37);
                if (challengeCompletions(this.layer, this.id) == 1) return new Decimal(1e30);
                if (challengeCompletions(this.layer, this.id) == 2) return new Decimal(1e22);
                if (challengeCompletions(this.layer, this.id) == 3) return new Decimal(1e15);
                if (challengeCompletions(this.layer, this.id) == 4) return new Decimal(1e15);
                if (challengeCompletions(this.layer, this.id) == 5) return new Decimal(1e15);
                if (challengeCompletions(this.layer, this.id) == 6) return new Decimal(1e12);
                if (challengeCompletions(this.layer, this.id) == 7) return new Decimal(1e10);
                if (challengeCompletions(this.layer, this.id) == 8) return new Decimal(3e7);
                if (challengeCompletions(this.layer, this.id) == 9) return new Decimal(16000000);
                if (challengeCompletions(this.layer, this.id) == 10) return new Decimal(10000000);
                if (challengeCompletions(this.layer, this.id) == 11) return new Decimal(1e8);
                if (challengeCompletions(this.layer, this.id) == 12) return new Decimal(1e8);
            },
            currencyDisplayName: "exp", // Use if using a nonstandard currency
            currencyInternalName: "points", // Use if using a nonstandard currency
            currencyLayer: "xp", // Leave empty if not in a layer
            rewards() {
                if (challengeCompletions(this.layer, this.id) == 0) return 1;
                if (challengeCompletions(this.layer, this.id) == 1) return 1.02;
                if (challengeCompletions(this.layer, this.id) == 2) return 1.05;
                if (challengeCompletions(this.layer, this.id) == 3) return 1.1;
                if (challengeCompletions(this.layer, this.id) == 4) return 1.2;
                if (challengeCompletions(this.layer, this.id) == 5) return 1.3;
                if (challengeCompletions(this.layer, this.id) == 6) return 1.4;
                if (challengeCompletions(this.layer, this.id) == 7) return 1.5;
                if (challengeCompletions(this.layer, this.id) == 8) return 1.6;
                if (challengeCompletions(this.layer, this.id) == 9) return 1.7;
                if (challengeCompletions(this.layer, this.id) == 10) return 1.8;
                if (challengeCompletions(this.layer, this.id) == 11) return 2;
                if (challengeCompletions(this.layer, this.id) == 12) return 2.5;
            },
            rewardEffect() {
                let rew = new Decimal(this.rewards());
                return rew;
            },
            rewardDisplay() { return "^" + format(this.rewardEffect())+" to exp/levels/gold gain" },
            rewardDescription: "Powering exp, lv and gold production.",
            onComplete() {} // Called when you complete the challenge
        },
        12: {
            name: "Tetration",
            completionLimit: 13,
            powers() {
                if (challengeCompletions(this.layer, this.id) == 0) return 0.99;
                if (challengeCompletions(this.layer, this.id) == 1) return 0.98;
                if (challengeCompletions(this.layer, this.id) == 2) return 0.96;
                if (challengeCompletions(this.layer, this.id) == 3) return 0.9;
                if (challengeCompletions(this.layer, this.id) == 4) return 0.8;
                if (challengeCompletions(this.layer, this.id) == 5) return 0.7;
                if (challengeCompletions(this.layer, this.id) == 6) return 0.8;
                if (challengeCompletions(this.layer, this.id) == 7) return 0.6;
                if (challengeCompletions(this.layer, this.id) == 8) return 0.4;
                if (challengeCompletions(this.layer, this.id) == 9) return 0.25;
                if (challengeCompletions(this.layer, this.id) == 10) return 0.1;
                if (challengeCompletions(this.layer, this.id) == 11) return 0.01;
                if (challengeCompletions(this.layer, this.id) == 12) return 0.001;
                if (challengeCompletions(this.layer, this.id) == 13) return 0.001;
            },
            challengeDescription() {
                return "Level, Exp and Gold gain are tetrated to ^^" + this.powers() + "<br>"+challengeCompletions(this.layer, this.id)
                 + "/" + this.completionLimit + " completions";
            },
            unlocked() { return (hasMilestone("q", 0) || inChallenge("q", 12)) },
            goal(){
                if (challengeCompletions(this.layer, this.id) == 0) return new Decimal("1e288");
                if (challengeCompletions(this.layer, this.id) == 1) return new Decimal("1.6e308");
                if (challengeCompletions(this.layer, this.id) == 2) return new Decimal("1.6e308");
                if (challengeCompletions(this.layer, this.id) == 3) return new Decimal("1.6e308");
                if (challengeCompletions(this.layer, this.id) == 4) return new Decimal("1.6e308");
                if (challengeCompletions(this.layer, this.id) == 5) return new Decimal("1.6e308");
                if (challengeCompletions(this.layer, this.id) == 6) return new Decimal("1e500");
                if (challengeCompletions(this.layer, this.id) == 7) return new Decimal("1e1000");
                if (challengeCompletions(this.layer, this.id) == 8) return new Decimal("1e1200");
                if (challengeCompletions(this.layer, this.id) == 9) return new Decimal("1e1600");
                if (challengeCompletions(this.layer, this.id) == 10) return new Decimal("1e1500");
                if (challengeCompletions(this.layer, this.id) == 11) return new Decimal("1e1000");
                if (challengeCompletions(this.layer, this.id) == 12) return new Decimal("1e100");
                if (challengeCompletions(this.layer, this.id) == 13) return new Decimal("1e100");
            },
            currencyDisplayName: "exp", // Use if using a nonstandard currency
            currencyInternalName: "points", // Use if using a nonstandard currency
            currencyLayer: "xp", // Leave empty if not in a layer
            rewards() {
                if (challengeCompletions(this.layer, this.id) == 0) return new Decimal(0);
                if (challengeCompletions(this.layer, this.id) == 1) return new Decimal(0.01);
                if (challengeCompletions(this.layer, this.id) == 2) return new Decimal(0.03);
                if (challengeCompletions(this.layer, this.id) == 3) return new Decimal(0.06);
                if (challengeCompletions(this.layer, this.id) == 4) return new Decimal(0.1);
                if (challengeCompletions(this.layer, this.id) == 5) return new Decimal(0.15);
                if (challengeCompletions(this.layer, this.id) == 6) return new Decimal(0.2);
                if (challengeCompletions(this.layer, this.id) == 7) return new Decimal(0.25);
                if (challengeCompletions(this.layer, this.id) == 8) return new Decimal(0.3);
                if (challengeCompletions(this.layer, this.id) == 9) return new Decimal(0.35);
                if (challengeCompletions(this.layer, this.id) == 10) return new Decimal(0.4);
                if (challengeCompletions(this.layer, this.id) == 11) return new Decimal(0.5);
                if (challengeCompletions(this.layer, this.id) == 12) return new Decimal(0.55);
                if (challengeCompletions(this.layer, this.id) == 13) return new Decimal(0.6);
            },
            rewardEffect() {
                let rew = new Decimal(this.rewards());
                return rew;
            },
            rewardDisplay() { return "Base Level Exponent reduced by " + 
            format(this.rewardEffect().times(new Decimal(100)))+"%" },
            rewardDescription: "Decrease base level exponent, it will help you level up faster until Lv.3,000.",
            onComplete() {} // Called when you complete the challenge
        },
        13: {
            name: "No XP",
            completionLimit: 12,
            challengeDescription() {
                return "You can't get any xp in this challenge (gold upgrades can be unlocked)" + "<br>"+challengeCompletions(this.layer, this.id)
                 + "/" + this.completionLimit + " completions";
            },
            unlocked() { return (hasMilestone("q", 2) || inChallenge("q", 13)) },
            goal(){
                if (challengeCompletions(this.layer, this.id) == 0) return new Decimal(165);
                if (challengeCompletions(this.layer, this.id) == 1) return new Decimal(200);
                if (challengeCompletions(this.layer, this.id) == 2) return new Decimal(400);
                if (challengeCompletions(this.layer, this.id) == 3) return new Decimal(500);
                if (challengeCompletions(this.layer, this.id) == 4) return new Decimal(600);
                if (challengeCompletions(this.layer, this.id) == 5) return new Decimal(750);
                if (challengeCompletions(this.layer, this.id) == 6) return new Decimal(1000);
                if (challengeCompletions(this.layer, this.id) == 7) return new Decimal(1250);
                if (challengeCompletions(this.layer, this.id) == 8) return new Decimal(1600);
                if (challengeCompletions(this.layer, this.id) == 9) return new Decimal(2000);
                if (challengeCompletions(this.layer, this.id) == 10) return new Decimal(3000);
                if (challengeCompletions(this.layer, this.id) == 11) return new Decimal(5000);
                if (challengeCompletions(this.layer, this.id) == 12) return new Decimal(5000);
            },
            currencyDisplayName: "level", // Use if using a nonstandard currency
            currencyInternalName: "points", // Use if using a nonstandard currency
            currencyLayer: "", // Leave empty if not in a layer
            rewards() {
                if (challengeCompletions(this.layer, this.id) == 0) return new Decimal(1);
                if (challengeCompletions(this.layer, this.id) == 1) return new Decimal(2);
                if (challengeCompletions(this.layer, this.id) == 2) return new Decimal(3);
                if (challengeCompletions(this.layer, this.id) == 3) return new Decimal(4);
                if (challengeCompletions(this.layer, this.id) == 4) return new Decimal(5);
                if (challengeCompletions(this.layer, this.id) == 5) return new Decimal(6);
                if (challengeCompletions(this.layer, this.id) == 6) return new Decimal(7);
                if (challengeCompletions(this.layer, this.id) == 7) return new Decimal(8);
                if (challengeCompletions(this.layer, this.id) == 8) return new Decimal(9);
                if (challengeCompletions(this.layer, this.id) == 9) return new Decimal(10);
                if (challengeCompletions(this.layer, this.id) == 10) return new Decimal(12);
                if (challengeCompletions(this.layer, this.id) == 11) return new Decimal(15);
                if (challengeCompletions(this.layer, this.id) == 12) return new Decimal(20);
            },
            rewardEffect() {
                let rew = new Decimal(this.rewards());
                return rew;
            },
            rewardDisplay() { return "Ruby effect is powered to ^" + 
            format(this.rewardEffect()) },
            rewardDescription: "Rubies are stronger now!",
            onComplete() {} // Called when you complete the challenge
        },
        14: {
            name: "No Gold",
            completionLimit: 12,
            challengeDescription() {
                return "You can't get any gold in this challenge (xp upgrades can be unlocked)" + "<br>"+challengeCompletions(this.layer, this.id)
                 + "/" + this.completionLimit + " completions";
            },
            unlocked() { return (hasMilestone("q", 2) || inChallenge("q", 14)) },
            goal(){
                if (challengeCompletions(this.layer, this.id) == 0) return new Decimal(350);
                if (challengeCompletions(this.layer, this.id) == 1) return new Decimal(450);
                if (challengeCompletions(this.layer, this.id) == 2) return new Decimal(750);
                if (challengeCompletions(this.layer, this.id) == 3) return new Decimal(1000);
                if (challengeCompletions(this.layer, this.id) == 4) return new Decimal(1500);
                if (challengeCompletions(this.layer, this.id) == 5) return new Decimal(2000);
                if (challengeCompletions(this.layer, this.id) == 6) return new Decimal(2500);
                if (challengeCompletions(this.layer, this.id) == 7) return new Decimal(3000);
                if (challengeCompletions(this.layer, this.id) == 8) return new Decimal(3500);
                if (challengeCompletions(this.layer, this.id) == 9) return new Decimal(4000);
                if (challengeCompletions(this.layer, this.id) == 10) return new Decimal(4500);
                if (challengeCompletions(this.layer, this.id) == 11) return new Decimal(5000);
                if (challengeCompletions(this.layer, this.id) == 12) return new Decimal(5000);
            },
            currencyDisplayName: "level", // Use if using a nonstandard currency
            currencyInternalName: "points", // Use if using a nonstandard currency
            currencyLayer: "", // Leave empty if not in a layer
            rewards() {
                if (challengeCompletions(this.layer, this.id) == 0) return new Decimal(1);
                if (challengeCompletions(this.layer, this.id) == 1) return new Decimal(20);
                if (challengeCompletions(this.layer, this.id) == 2) return new Decimal(400);
                if (challengeCompletions(this.layer, this.id) == 3) return new Decimal(8000);
                if (challengeCompletions(this.layer, this.id) == 4) return new Decimal(160000);
                if (challengeCompletions(this.layer, this.id) == 5) return new Decimal(3200000);
                if (challengeCompletions(this.layer, this.id) == 6) return new Decimal(6.4e7);
                if (challengeCompletions(this.layer, this.id) == 7) return new Decimal(1.28e9);
                if (challengeCompletions(this.layer, this.id) == 8) return new Decimal(2.56e10);
                if (challengeCompletions(this.layer, this.id) == 9) return new Decimal(5.12e11);
                if (challengeCompletions(this.layer, this.id) == 10) return new Decimal(1.024e13);
                if (challengeCompletions(this.layer, this.id) == 11) return new Decimal(2.048e14);
                if (challengeCompletions(this.layer, this.id) == 12) return new Decimal(2e16);
            },
            rewardEffect() {
                let rew = new Decimal(this.rewards());
                return rew;
            },
            rewardDisplay() { return "Rubies base requirement divided by " + 
            format(this.rewardEffect()) },
            rewardDescription: "Now you can get more rubies and faster",
            onComplete() {} // Called when you complete the challenge
        },
        15: {
            name: "Logarithmication",
            completionLimit: 12,
            powers() {
                if (challengeCompletions(this.layer, this.id) == 0) return 1.1;
                if (challengeCompletions(this.layer, this.id) == 1) return 2;
                if (challengeCompletions(this.layer, this.id) == 2) return 3;
                if (challengeCompletions(this.layer, this.id) == 3) return 4;
                if (challengeCompletions(this.layer, this.id) == 4) return 5;
                if (challengeCompletions(this.layer, this.id) == 5) return 6;
                if (challengeCompletions(this.layer, this.id) == 6) return 7;
                if (challengeCompletions(this.layer, this.id) == 7) return 8;
                if (challengeCompletions(this.layer, this.id) == 8) return 9;
                if (challengeCompletions(this.layer, this.id) == 9) return 10;
                if (challengeCompletions(this.layer, this.id) == 10) return 100;
                if (challengeCompletions(this.layer, this.id) == 11) return 1000;
                if (challengeCompletions(this.layer, this.id) == 12) return 1000;
            },
            challengeDescription() {
                return "Level, Exp and Gold gain are set to formula of log" + this.powers() 
                + "(val + 1). <br>"+challengeCompletions(this.layer, this.id)
                 + "/" + this.completionLimit + " completions";
            },
            unlocked() { return (hasMilestone("q", 6) || inChallenge("q", 15)) },
            goal(){
                if (challengeCompletions(this.layer, this.id) == 0) return new Decimal(27);
                if (challengeCompletions(this.layer, this.id) == 1) return new Decimal(24);
                if (challengeCompletions(this.layer, this.id) == 2) return new Decimal(20);
                if (challengeCompletions(this.layer, this.id) == 3) return new Decimal(25);
                if (challengeCompletions(this.layer, this.id) == 4) return new Decimal(25);
                if (challengeCompletions(this.layer, this.id) == 5) return new Decimal(27);
                if (challengeCompletions(this.layer, this.id) == 6) return new Decimal(30);
                if (challengeCompletions(this.layer, this.id) == 7) return new Decimal(32);
                if (challengeCompletions(this.layer, this.id) == 8) return new Decimal(37);
                if (challengeCompletions(this.layer, this.id) == 9) return new Decimal(40);
                if (challengeCompletions(this.layer, this.id) == 10) return new Decimal(40);
                if (challengeCompletions(this.layer, this.id) == 11) return new Decimal(50);
                if (challengeCompletions(this.layer, this.id) == 12) return new Decimal(50);
            },
            currencyDisplayName: "level", // Use if using a nonstandard currency
            currencyInternalName: "points", // Use if using a nonstandard currency
            currencyLayer: "", // Leave empty if not in a layer
            rewards() {
                if (challengeCompletions(this.layer, this.id) == 0) return 1;
                if (challengeCompletions(this.layer, this.id) == 1) return 1.1;
                if (challengeCompletions(this.layer, this.id) == 2) return 1.2;
                if (challengeCompletions(this.layer, this.id) == 3) return 1.3;
                if (challengeCompletions(this.layer, this.id) == 4) return 1.4;
                if (challengeCompletions(this.layer, this.id) == 5) return 1.5;
                if (challengeCompletions(this.layer, this.id) == 6) return 1.6;
                if (challengeCompletions(this.layer, this.id) == 7) return 1.7;
                if (challengeCompletions(this.layer, this.id) == 8) return 1.8;
                if (challengeCompletions(this.layer, this.id) == 9) return 1.9;
                if (challengeCompletions(this.layer, this.id) == 10) return 2;
                if (challengeCompletions(this.layer, this.id) == 11) return 2.5;
                if (challengeCompletions(this.layer, this.id) == 12) return 4;
            },
            rewardEffect() {
                let rew = new Decimal(this.rewards());
                return rew;
            },
            rewardDisplay() { return "loot exponent divided by " + format(this.rewardEffect())+"." },
            rewardDescription: "Boosting loot gain again.",
            onComplete() {} // Called when you complete the challenge
        },
        16: {
            name: "Is the level bad?",
            completionLimit: 12,
            powers() {
                if (challengeCompletions(this.layer, this.id) == 0) return 0.01;
                if (challengeCompletions(this.layer, this.id) == 1) return 0.1;
                if (challengeCompletions(this.layer, this.id) == 2) return 1;
                if (challengeCompletions(this.layer, this.id) == 3) return 2;
                if (challengeCompletions(this.layer, this.id) == 4) return 3;
                if (challengeCompletions(this.layer, this.id) == 5) return 5;
                if (challengeCompletions(this.layer, this.id) == 6) return 10;
                if (challengeCompletions(this.layer, this.id) == 7) return 16;
                if (challengeCompletions(this.layer, this.id) == 8) return 32;
                if (challengeCompletions(this.layer, this.id) == 9) return 64;
                if (challengeCompletions(this.layer, this.id) == 10) return 128;
                if (challengeCompletions(this.layer, this.id) == 11) return player.points;
                if (challengeCompletions(this.layer, this.id) == 12) return player.points;
            },
            challengeDescription() {
                if (challengeCompletions(this.layer, this.id) < 11) {
                    return "Exp, Gold and level gain are powered to 1 / (1 + level*" + this.powers() 
                    + "). <br>"+challengeCompletions(this.layer, this.id)
                    + "/" + this.completionLimit + " completions";
                }
                else {
                    return "Exp, Gold and level gain are powered to 1 / (1 + level^2). <br>"+challengeCompletions(this.layer, this.id)
                    + "/" + this.completionLimit + " completions";
                }
            },
            unlocked() { return (hasMilestone("q", 6) || inChallenge("q", 16)) },
            goal(){
                if (challengeCompletions(this.layer, this.id) == 0) return new Decimal(1024);
                if (challengeCompletions(this.layer, this.id) == 1) return new Decimal(280);
                if (challengeCompletions(this.layer, this.id) == 2) return new Decimal(250);
                if (challengeCompletions(this.layer, this.id) == 3) return new Decimal(225);
                if (challengeCompletions(this.layer, this.id) == 4) return new Decimal(200);
                if (challengeCompletions(this.layer, this.id) == 5) return new Decimal(180);
                if (challengeCompletions(this.layer, this.id) == 6) return new Decimal(160);
                if (challengeCompletions(this.layer, this.id) == 7) return new Decimal(140);
                if (challengeCompletions(this.layer, this.id) == 8) return new Decimal(120);
                if (challengeCompletions(this.layer, this.id) == 9) return new Decimal(120);
                if (challengeCompletions(this.layer, this.id) == 10) return new Decimal(150);
                if (challengeCompletions(this.layer, this.id) == 11) return new Decimal(200);
                if (challengeCompletions(this.layer, this.id) == 12) return new Decimal(200);
            },
            currencyDisplayName: "level", // Use if using a nonstandard currency
            currencyInternalName: "points", // Use if using a nonstandard currency
            currencyLayer: "", // Leave empty if not in a layer
            rewards() {
                if (challengeCompletions(this.layer, this.id) == 0) return 9e199;
                if (challengeCompletions(this.layer, this.id) == 1) return 100000;
                if (challengeCompletions(this.layer, this.id) == 2) return 99000;
                if (challengeCompletions(this.layer, this.id) == 3) return 98000;
                if (challengeCompletions(this.layer, this.id) == 4) return 97000;
                if (challengeCompletions(this.layer, this.id) == 5) return 96000;
                if (challengeCompletions(this.layer, this.id) == 6) return 95000;
                if (challengeCompletions(this.layer, this.id) == 7) return 94000;
                if (challengeCompletions(this.layer, this.id) == 8) return 93000;
                if (challengeCompletions(this.layer, this.id) == 9) return 92000;
                if (challengeCompletions(this.layer, this.id) == 10) return 91000;
                if (challengeCompletions(this.layer, this.id) == 11) return 90000;
                if (challengeCompletions(this.layer, this.id) == 12) return 88000;
            },
            rewardEffect() {
                let rew = new Decimal(this.rewards());
                return rew;
            },
            rewardDisplay() {
                if ((challengeCompletions(this.layer, this.id) > 0)) {
                    return "Exp and gold are powered to ^(1 + lvl/" + format(this.rewardEffect())+")." 
                }
                else {
                    return "Exp and gold are powered to ^1)." 
                }
            },
            rewardDescription: "Powering your currencies!",
            onComplete() {} // Called when you complete the challenge
        },
        17: {
            name: "No Resources",
            completionLimit: 12,
            challengeDescription() {
                return "You can't get any gold or xp in this challenge" + "<br>"+challengeCompletions(this.layer, this.id)
                 + "/" + this.completionLimit + " completions";
            },
            unlocked() { return (hasMilestone("q", 13) || inChallenge("q", 17)) },
            goal(){
                if (challengeCompletions(this.layer, this.id) == 0) return new Decimal(8000);
                if (challengeCompletions(this.layer, this.id) == 1) return new Decimal(10000);
                if (challengeCompletions(this.layer, this.id) == 2) return new Decimal(12000);
                if (challengeCompletions(this.layer, this.id) == 3) return new Decimal(14000);
                if (challengeCompletions(this.layer, this.id) == 4) return new Decimal(16000);
                if (challengeCompletions(this.layer, this.id) == 5) return new Decimal(18000);
                if (challengeCompletions(this.layer, this.id) == 6) return new Decimal(20000);
                if (challengeCompletions(this.layer, this.id) == 7) return new Decimal(22500);
                if (challengeCompletions(this.layer, this.id) == 8) return new Decimal(25000);
                if (challengeCompletions(this.layer, this.id) == 9) return new Decimal(30000);
                if (challengeCompletions(this.layer, this.id) == 10) return new Decimal(35000);
                if (challengeCompletions(this.layer, this.id) == 11) return new Decimal(50000);
                if (challengeCompletions(this.layer, this.id) == 12) return new Decimal(50000);
            },
            currencyDisplayName: "level", // Use if using a nonstandard currency
            currencyInternalName: "points", // Use if using a nonstandard currency
            currencyLayer: "", // Leave empty if not in a layer
            rewards() {
                if (challengeCompletions(this.layer, this.id) == 0) return 0;
                if (challengeCompletions(this.layer, this.id) == 1) return 1;
                if (challengeCompletions(this.layer, this.id) == 2) return 2;
                if (challengeCompletions(this.layer, this.id) == 3) return 3;
                if (challengeCompletions(this.layer, this.id) == 4) return 4;
                if (challengeCompletions(this.layer, this.id) == 5) return 5;
                if (challengeCompletions(this.layer, this.id) == 6) return 6;
                if (challengeCompletions(this.layer, this.id) == 7) return 7;
                if (challengeCompletions(this.layer, this.id) == 8) return 8;
                if (challengeCompletions(this.layer, this.id) == 9) return 9;
                if (challengeCompletions(this.layer, this.id) == 10) return 10;
                if (challengeCompletions(this.layer, this.id) == 11) return 15;
                if (challengeCompletions(this.layer, this.id) == 12) return 25;
            },
            rewardEffect() {
                let rew = this.rewards();
                return rew;
            },
            rewardDisplay() { return "+" + 
            format(this.rewardEffect()) + " base exponents to gold and xp" },
            rewardDescription: "XP and gold exponents. Good for quests.",
            onComplete() {} // Called when you complete the challenge
        },
        18: {
            name: "Double LOG",
            completionLimit: 100,
            challengeDescription() {
                return "Exp, Gold and Level gain are set to log1,000(log1,000(gain +1) + 1). " + 
                "Their base exponents are also set to log1,000(exp + 1)" + "<br>"+challengeCompletions(this.layer, this.id)
                 + "/" + this.completionLimit + " completions";
            },
            unlocked() { return (hasMilestone("q", 15) || inChallenge("q", 18)) },
            goal(){
                if (challengeCompletions(this.layer, this.id) == 0) return new Decimal(8);
                if (challengeCompletions(this.layer, this.id) == 1) return new Decimal(9);
                if (challengeCompletions(this.layer, this.id) == 2) return new Decimal(10);
                if (challengeCompletions(this.layer, this.id) == 3) return new Decimal(11);
                if (challengeCompletions(this.layer, this.id) == 4) return new Decimal(12);
                if (challengeCompletions(this.layer, this.id) == 5) return new Decimal(13);
                if (challengeCompletions(this.layer, this.id) == 6) return new Decimal(14);
                if (challengeCompletions(this.layer, this.id) == 7) return new Decimal(15);
                if (challengeCompletions(this.layer, this.id) == 8) return new Decimal(16);
                if (challengeCompletions(this.layer, this.id) == 9) return new Decimal(17);
                if (challengeCompletions(this.layer, this.id) == 10) return new Decimal(18);
                if (challengeCompletions(this.layer, this.id) == 11) return new Decimal(20);
                if (challengeCompletions(this.layer, this.id) == 12) return new Decimal(21);
                if (challengeCompletions(this.layer, this.id) == 13) return new Decimal(22);
                if (challengeCompletions(this.layer, this.id) == 14) return new Decimal(23);
                if (challengeCompletions(this.layer, this.id) == 15) return new Decimal(24);
                if (challengeCompletions(this.layer, this.id) == 16) return new Decimal(25);
                if (challengeCompletions(this.layer, this.id) == 17) return new Decimal(26);
                if (challengeCompletions(this.layer, this.id) == 18) return new Decimal(27);
                if (challengeCompletions(this.layer, this.id) == 19) return new Decimal(28);
                if (challengeCompletions(this.layer, this.id) == 20) return new Decimal(29);
                if (challengeCompletions(this.layer, this.id) == 21) return new Decimal(30);
                if (challengeCompletions(this.layer, this.id) == 22) return new Decimal(32);
                if (challengeCompletions(this.layer, this.id) == 23) return new Decimal(34);
                if (challengeCompletions(this.layer, this.id) == 24) return new Decimal(36);
                if (challengeCompletions(this.layer, this.id) == 25) return new Decimal(38);
                if (challengeCompletions(this.layer, this.id) == 26) return new Decimal(40);
                if (challengeCompletions(this.layer, this.id) == 27) return new Decimal(42);
                if (challengeCompletions(this.layer, this.id) == 28) return new Decimal(44);
                if (challengeCompletions(this.layer, this.id) == 29) return new Decimal(46);
                if (challengeCompletions(this.layer, this.id) == 30) return new Decimal(48);
                if (challengeCompletions(this.layer, this.id) == 31) return new Decimal(50);
                if (challengeCompletions(this.layer, this.id) == 32) return new Decimal(52);
                if (challengeCompletions(this.layer, this.id) == 33) return new Decimal(54);
                if (challengeCompletions(this.layer, this.id) == 34) return new Decimal(56);
                if (challengeCompletions(this.layer, this.id) == 35) return new Decimal(58);
                if (challengeCompletions(this.layer, this.id) == 36) return new Decimal(60);
                if (challengeCompletions(this.layer, this.id) == 37) return new Decimal(65);
                if (challengeCompletions(this.layer, this.id) == 38) return new Decimal(70);
                if (challengeCompletions(this.layer, this.id) == 39) return new Decimal(75);
                if (challengeCompletions(this.layer, this.id) == 40) return new Decimal(80);
                if (challengeCompletions(this.layer, this.id) == 41) return new Decimal(85);
                if (challengeCompletions(this.layer, this.id) == 42) return new Decimal(90);
                if (challengeCompletions(this.layer, this.id) == 43) return new Decimal(95);
                if (challengeCompletions(this.layer, this.id) == 44) return new Decimal(100);
                if (challengeCompletions(this.layer, this.id) == 45) return new Decimal(105);
                if (challengeCompletions(this.layer, this.id) == 46) return new Decimal(110);
                if (challengeCompletions(this.layer, this.id) == 47) return new Decimal(115);
                if (challengeCompletions(this.layer, this.id) == 48) return new Decimal(120);
                if (challengeCompletions(this.layer, this.id) == 49) return new Decimal(125);
                if (challengeCompletions(this.layer, this.id) == 50) return new Decimal(130);
                if (challengeCompletions(this.layer, this.id) == 51) return new Decimal(135);
                if (challengeCompletions(this.layer, this.id) == 52) return new Decimal(140);
                if (challengeCompletions(this.layer, this.id) == 53) return new Decimal(150);
                if (challengeCompletions(this.layer, this.id) == 54) return new Decimal(160);
                if (challengeCompletions(this.layer, this.id) == 55) return new Decimal(170);
                if (challengeCompletions(this.layer, this.id) == 56) return new Decimal(180);
                if (challengeCompletions(this.layer, this.id) == 57) return new Decimal(190);
                if (challengeCompletions(this.layer, this.id) == 58) return new Decimal(200);
                if (challengeCompletions(this.layer, this.id) == 59) return new Decimal(210);
                if (challengeCompletions(this.layer, this.id) == 60) return new Decimal(215);
                if (challengeCompletions(this.layer, this.id) == 61) return new Decimal(220);
                if (challengeCompletions(this.layer, this.id) == 62) return new Decimal(225);
                if (challengeCompletions(this.layer, this.id) == 63) return new Decimal(230);
                if (challengeCompletions(this.layer, this.id) == 64) return new Decimal(235);
                if (challengeCompletions(this.layer, this.id) == 65) return new Decimal(240);
                if (challengeCompletions(this.layer, this.id) == 66) return new Decimal(245);
                if (challengeCompletions(this.layer, this.id) == 67) return new Decimal(250);
                if (challengeCompletions(this.layer, this.id) == 68) return new Decimal(255);
                if (challengeCompletions(this.layer, this.id) == 69) return new Decimal(260);
                if (challengeCompletions(this.layer, this.id) == 70) return new Decimal(265);
                if (challengeCompletions(this.layer, this.id) == 71) return new Decimal(270);
                if (challengeCompletions(this.layer, this.id) == 72) return new Decimal(275);
                if (challengeCompletions(this.layer, this.id) == 73) return new Decimal(280);
                if (challengeCompletions(this.layer, this.id) == 74) return new Decimal(285);
                if (challengeCompletions(this.layer, this.id) == 75) return new Decimal(290);
                if (challengeCompletions(this.layer, this.id) == 76) return new Decimal(295);
                if (challengeCompletions(this.layer, this.id) == 77) return new Decimal(300);
                if (challengeCompletions(this.layer, this.id) == 78) return new Decimal(350);
                if (challengeCompletions(this.layer, this.id) == 79) return new Decimal(400);
                if (challengeCompletions(this.layer, this.id) == 80) return new Decimal(450);
                if (challengeCompletions(this.layer, this.id) == 81) return new Decimal(500);
                if (challengeCompletions(this.layer, this.id) == 82) return new Decimal(550);
                if (challengeCompletions(this.layer, this.id) == 83) return new Decimal(600);
                if (challengeCompletions(this.layer, this.id) == 84) return new Decimal(650);
                if (challengeCompletions(this.layer, this.id) == 85) return new Decimal(700);
                if (challengeCompletions(this.layer, this.id) == 86) return new Decimal(750);
                if (challengeCompletions(this.layer, this.id) == 87) return new Decimal(800);
                if (challengeCompletions(this.layer, this.id) == 88) return new Decimal(850);
                if (challengeCompletions(this.layer, this.id) == 89) return new Decimal(900);
                if (challengeCompletions(this.layer, this.id) == 90) return new Decimal(950);
                if (challengeCompletions(this.layer, this.id) == 91) return new Decimal(1000);
                if (challengeCompletions(this.layer, this.id) == 92) return new Decimal(1050);
                if (challengeCompletions(this.layer, this.id) == 93) return new Decimal(1100);
                if (challengeCompletions(this.layer, this.id) == 94) return new Decimal(1200);
                if (challengeCompletions(this.layer, this.id) == 95) return new Decimal(1300);
                if (challengeCompletions(this.layer, this.id) == 96) return new Decimal(1500);
                if (challengeCompletions(this.layer, this.id) == 97) return new Decimal(2000);
                if (challengeCompletions(this.layer, this.id) == 98) return new Decimal(3000);
                if (challengeCompletions(this.layer, this.id) == 99) return new Decimal(1000000);
                if (challengeCompletions(this.layer, this.id) == 100) return new Decimal(1000000);
            },
            currencyDisplayName: "level", // Use if using a nonstandard currency
            currencyInternalName: "points", // Use if using a nonstandard currency
            currencyLayer: "", // Leave empty if not in a layer
            rewards() {
                let R = 1;
                if (challengeCompletions(this.layer, this.id) <= 98) {
                    R =  new Decimal(1 + challengeCompletions(this.layer, this.id)*0.05);
                }
                else if (challengeCompletions(this.layer, this.id) <= 99) {
                    R =  new Decimal(1 + challengeCompletions(this.layer, this.id)*0.075);
                }
                else {
                    R =  new Decimal(1 + challengeCompletions(this.layer, this.id)*0.1);
                }
                if (hasUpgrade("r", 24)) R = R.pow(1.1);
                if (hasMilestone("s", 20)) R = R.pow(1 + (challengeCompletions(this.layer, 19)/10))
                if (hasUpgrade("t", 21)) R = R.pow(10);
                if (hasUpgrade("t", 22)) R = R.times(upgradeEffect("t", 22));
                return R;
            },
            rewardEffect() {
                let rew = new Decimal(this.rewards());
                return rew;
            },
            rewardDisplay() { return  "loot, quest & ruby exponents divided by " + format(this.rewardEffect()) },
            rewardDescription: "Last Gain!!!",
            onComplete() {} // Called when you complete the challenge
        },
        19: {
            name: "Triple LOG",
            completionLimit: 100,
            challengeDescription() {
                return "Exp, Gold and Level gain are set to log1m(log1m(log1m(gain +1) + 1) + 1). " + 
                "Their base exponents are also set to log1m(log1m(exp + 1) + 1)" + "<br>"+challengeCompletions(this.layer, this.id)
                 + "/" + this.completionLimit + " completions";
            },
            unlocked() { return (hasMilestone("s", 15) || inChallenge("q", 19)) },
            goal(){
                if (challengeCompletions(this.layer, this.id) == 0) return new Decimal(12);
                if (challengeCompletions(this.layer, this.id) == 1) return new Decimal(13);
                if (challengeCompletions(this.layer, this.id) == 2) return new Decimal(14);
                if (challengeCompletions(this.layer, this.id) == 3) return new Decimal(15);
                if (challengeCompletions(this.layer, this.id) == 4) return new Decimal(16);
                if (challengeCompletions(this.layer, this.id) == 5) return new Decimal(17);
                if (challengeCompletions(this.layer, this.id) == 6) return new Decimal(18);
                if (challengeCompletions(this.layer, this.id) == 7) return new Decimal(19);
                if (challengeCompletions(this.layer, this.id) == 8) return new Decimal(20);
                if (challengeCompletions(this.layer, this.id) == 9) return new Decimal(21);
                if (challengeCompletions(this.layer, this.id) == 10) return new Decimal(24);
                if (challengeCompletions(this.layer, this.id) == 11) return new Decimal(25);
                if (challengeCompletions(this.layer, this.id) == 12) return new Decimal(26);
                if (challengeCompletions(this.layer, this.id) == 13) return new Decimal(27);
                if (challengeCompletions(this.layer, this.id) == 14) return new Decimal(28);
                if (challengeCompletions(this.layer, this.id) == 15) return new Decimal(29);
                if (challengeCompletions(this.layer, this.id) == 16) return new Decimal(30);
                if (challengeCompletions(this.layer, this.id) == 17) return new Decimal(31);
                if (challengeCompletions(this.layer, this.id) == 18) return new Decimal(32);
                if (challengeCompletions(this.layer, this.id) == 19) return new Decimal(34);
                if (challengeCompletions(this.layer, this.id) == 20) return new Decimal(36);
                if (challengeCompletions(this.layer, this.id) == 21) return new Decimal(38);
                if (challengeCompletions(this.layer, this.id) == 22) return new Decimal(40);
                if (challengeCompletions(this.layer, this.id) == 23) return new Decimal(42);
                if (challengeCompletions(this.layer, this.id) == 24) return new Decimal(44);
                if (challengeCompletions(this.layer, this.id) == 25) return new Decimal(46);
                if (challengeCompletions(this.layer, this.id) == 26) return new Decimal(48);
                if (challengeCompletions(this.layer, this.id) == 27) return new Decimal(50);
                if (challengeCompletions(this.layer, this.id) == 28) return new Decimal(55);
                if (challengeCompletions(this.layer, this.id) == 29) return new Decimal(60);
                if (challengeCompletions(this.layer, this.id) == 30) return new Decimal(65);
                if (challengeCompletions(this.layer, this.id) == 31) return new Decimal(70);
                if (challengeCompletions(this.layer, this.id) == 32) return new Decimal(75);
                if (challengeCompletions(this.layer, this.id) == 33) return new Decimal(80);
                if (challengeCompletions(this.layer, this.id) == 34) return new Decimal(85);
                if (challengeCompletions(this.layer, this.id) == 35) return new Decimal(90);
                if (challengeCompletions(this.layer, this.id) == 36) return new Decimal(95);
                if (challengeCompletions(this.layer, this.id) == 37) return new Decimal(100);
                if (challengeCompletions(this.layer, this.id) == 38) return new Decimal(105);
                if (challengeCompletions(this.layer, this.id) == 39) return new Decimal(110);
                if (challengeCompletions(this.layer, this.id) == 40) return new Decimal(115);
                if (challengeCompletions(this.layer, this.id) == 41) return new Decimal(120);
                if (challengeCompletions(this.layer, this.id) == 42) return new Decimal(125);
                if (challengeCompletions(this.layer, this.id) == 43) return new Decimal(130);
                if (challengeCompletions(this.layer, this.id) == 44) return new Decimal(135);
                if (challengeCompletions(this.layer, this.id) == 45) return new Decimal(140);
                if (challengeCompletions(this.layer, this.id) == 46) return new Decimal(145);
                if (challengeCompletions(this.layer, this.id) == 47) return new Decimal(150);
                if (challengeCompletions(this.layer, this.id) == 48) return new Decimal(155);
                if (challengeCompletions(this.layer, this.id) == 49) return new Decimal(160);
                if (challengeCompletions(this.layer, this.id) == 50) return new Decimal(165);
                if (challengeCompletions(this.layer, this.id) == 51) return new Decimal(170);
                if (challengeCompletions(this.layer, this.id) == 52) return new Decimal(175);
                if (challengeCompletions(this.layer, this.id) == 53) return new Decimal(180);
                if (challengeCompletions(this.layer, this.id) == 54) return new Decimal(185);
                if (challengeCompletions(this.layer, this.id) == 55) return new Decimal(190);
                if (challengeCompletions(this.layer, this.id) == 56) return new Decimal(195);
                if (challengeCompletions(this.layer, this.id) == 57) return new Decimal(200);
                if (challengeCompletions(this.layer, this.id) == 58) return new Decimal(205);
                if (challengeCompletions(this.layer, this.id) == 59) return new Decimal(210);
                if (challengeCompletions(this.layer, this.id) == 60) return new Decimal(215);
                if (challengeCompletions(this.layer, this.id) == 61) return new Decimal(220);
                if (challengeCompletions(this.layer, this.id) == 62) return new Decimal(225);
                if (challengeCompletions(this.layer, this.id) == 63) return new Decimal(230);
                if (challengeCompletions(this.layer, this.id) == 64) return new Decimal(235);
                if (challengeCompletions(this.layer, this.id) == 65) return new Decimal(240);
                if (challengeCompletions(this.layer, this.id) == 66) return new Decimal(245);
                if (challengeCompletions(this.layer, this.id) == 67) return new Decimal(250);
                if (challengeCompletions(this.layer, this.id) == 68) return new Decimal(255);
                if (challengeCompletions(this.layer, this.id) == 69) return new Decimal(260);
                if (challengeCompletions(this.layer, this.id) == 70) return new Decimal(265);
                if (challengeCompletions(this.layer, this.id) == 71) return new Decimal(270);
                if (challengeCompletions(this.layer, this.id) == 72) return new Decimal(275);
                if (challengeCompletions(this.layer, this.id) == 73) return new Decimal(280);
                if (challengeCompletions(this.layer, this.id) == 74) return new Decimal(285);
                if (challengeCompletions(this.layer, this.id) == 75) return new Decimal(290);
                if (challengeCompletions(this.layer, this.id) == 76) return new Decimal(295);
                if (challengeCompletions(this.layer, this.id) == 77) return new Decimal(300);
                if (challengeCompletions(this.layer, this.id) == 78) return new Decimal(350);
                if (challengeCompletions(this.layer, this.id) == 79) return new Decimal(400);
                if (challengeCompletions(this.layer, this.id) == 80) return new Decimal(450);
                if (challengeCompletions(this.layer, this.id) == 81) return new Decimal(500);
                if (challengeCompletions(this.layer, this.id) == 82) return new Decimal(550);
                if (challengeCompletions(this.layer, this.id) == 83) return new Decimal(600);
                if (challengeCompletions(this.layer, this.id) == 84) return new Decimal(650);
                if (challengeCompletions(this.layer, this.id) == 85) return new Decimal(700);
                if (challengeCompletions(this.layer, this.id) == 86) return new Decimal(750);
                if (challengeCompletions(this.layer, this.id) == 87) return new Decimal(800);
                if (challengeCompletions(this.layer, this.id) == 88) return new Decimal(850);
                if (challengeCompletions(this.layer, this.id) == 89) return new Decimal(900);
                if (challengeCompletions(this.layer, this.id) == 90) return new Decimal(950);
                if (challengeCompletions(this.layer, this.id) == 91) return new Decimal(1000);
                if (challengeCompletions(this.layer, this.id) == 92) return new Decimal(1050);
                if (challengeCompletions(this.layer, this.id) == 93) return new Decimal(1100);
                if (challengeCompletions(this.layer, this.id) == 94) return new Decimal(1200);
                if (challengeCompletions(this.layer, this.id) == 95) return new Decimal(1300);
                if (challengeCompletions(this.layer, this.id) == 96) return new Decimal(1500);
                if (challengeCompletions(this.layer, this.id) == 97) return new Decimal(2000);
                if (challengeCompletions(this.layer, this.id) == 98) return new Decimal(3000);
                if (challengeCompletions(this.layer, this.id) == 99) return new Decimal(100000000);
                if (challengeCompletions(this.layer, this.id) == 100) return new Decimal(100000000);
            },
            currencyDisplayName: "level", // Use if using a nonstandard currency
            currencyInternalName: "points", // Use if using a nonstandard currency
            currencyLayer: "", // Leave empty if not in a layer
            rewards() {
                let det = (new Decimal(challengeCompletions(this.layer, this.id)).pow(2).times(1000));
                if (hasUpgrade("t", 13)) det = det.pow(1 + (0.001* challengeCompletions(this.layer, this.id)));
                if (hasUpgrade("t", 21)) det = det.pow(1.025);
                return det;
            },
            rewardEffect() {
                let rew = new Decimal(this.rewards());
                return rew;
            },
            rewardDisplay() { return  "Max level is increased by " + format(this.rewardEffect()) },
            rewardDescription: "Now really Last Gain!!! (Or not)",
            onComplete() {} // Called when you complete the challenge
        },
    },

    milestones: {
        0: {requirementDescription: "Get 1 quest",
            done() {return player[this.layer].best.gte(1)}, // Used to determine when to give the milestone
            effectDescription: "Welcome to the world of quests! First two challenges unlocked!",
        },
        1: {requirementDescription: "Get 2 quests",
            toggles: [
                ["q", "autoBuyXP"]
            ],
            unlocked() {return hasMilestone("q", 0)},
            done() {return player[this.layer].best.gte(2)}, // Used to determine when to give the milestone
            effectDescription: "Loot effect power is powered to ^2, makes it really powerful. Also, now you can automate buying xp upgrades.",
        },
        2: {requirementDescription: "Get 3 quests",
            toggles: [
                ["q", "autoBuyGold"]
            ],
            unlocked() {return hasMilestone("q", 1)},
            done() {return player[this.layer].best.gte(3)}, // Used to determine when to give the milestone
            effectDescription: "You can automate buying gold upgrades. Unlocks two next challenges.",
        },
        3: {requirementDescription: "Get 4 quests",
            unlocked() {return hasMilestone("q", 2)},
            done() {return player[this.layer].best.gte(4)}, // Used to determine when to give the milestone
            effectDescription: "Loot prestiging resets nothing.",
        },
        4: {requirementDescription: "Get 5 quests",
            unlocked() {return hasMilestone("q", 3)},
            done() {return player[this.layer].best.gte(5)}, // Used to determine when to give the milestone
            effectDescription: "Unlocks 5 last XP upgrades.",
        },
        5: {requirementDescription: "Get 6 quests",
            unlocked() {return hasMilestone("q", 4)},
            done() {return player[this.layer].best.gte(6)}, // Used to determine when to give the milestone
            effectDescription: "Autobuy up to 20 passive upgrades/tick",
        },
        6: {requirementDescription: "Get 7 quests",
            unlocked() {return hasMilestone("q", 5)},
            done() {return player[this.layer].best.gte(7)}, // Used to determine when to give the milestone
            effectDescription: "Unlocks next challenge",
        },
        7: {requirementDescription: "Get 8 quests",
            unlocked() {return hasMilestone("q", 6)},
            done() {return player[this.layer].best.gte(8)}, // Used to determine when to give the milestone
            effectDescription: "Get 50% of loot every second, yeah!",
        },
        8: {requirementDescription: "Get 9 quests",
            unlocked() {return hasMilestone("q", 7)},
            done() {return player[this.layer].best.gte(9)}, // Used to determine when to give the milestone
            effectDescription: "Quest bonus exponent to loot multiplied by 4. XP softcap starts e1,000 later. (At e2,000)",
        },
        9: {requirementDescription: "Get 10 quests",
            unlocked() {return hasMilestone("q", 8)},
            done() {return player[this.layer].best.gte(10)}, // Used to determine when to give the milestone
            effectDescription: "Quest bonus exponent to loot multiplied by 2. XP softcap starts e1,000 later. (At e3,000)",
        },
        10: {requirementDescription: "Get 15 quests",
            unlocked() {return hasMilestone("q", 9)},
            done() {return player[this.layer].best.gte(15)}, // Used to determine when to give the milestone
            effectDescription: "New challenge!",
        },
        11: {requirementDescription: "Get 20 quests",
            unlocked() {return hasMilestone("q", 10)},
            done() {return player[this.layer].best.gte(20)}, // Used to determine when to give the milestone
            effectDescription: "Quest exponent is divided by 1.1",
        },
        12: {requirementDescription: "Get 50 quests",
            unlocked() {return hasMilestone("q", 11)},
            done() {return player[this.layer].best.gte(50)}, // Used to determine when to give the milestone
            effectDescription: "Quest exponent is divided by 1.1 again.",
        },
        13: {requirementDescription: "Get 125 quests",
            unlocked() {return hasMilestone("q", 12)},
            done() {return player[this.layer].best.gte(125)}, // Used to determine when to give the milestone
            effectDescription: "New challenge. Again.",
        },
        14: {requirementDescription: "Get 500 quests",
            unlocked() {return hasMilestone("q", 13)},
            done() {return player[this.layer].best.gte(500)}, // Used to determine when to give the milestone
            effectDescription: "Autobuy up to 1,000 passive upgrades/tick",
        },
        15: {requirementDescription: "Get 10,000 quests",
            unlocked() {return hasMilestone("q", 14)},
            done() {return player[this.layer].best.gte(10000)}, // Used to determine when to give the milestone
            effectDescription: "Autobuy up to 100,000 passive upgrades/tick and unlocks the final challenge here!",
        },
        16: {requirementDescription: "Finish the last challenge 100 times",
            unlocked() {return hasMilestone("q", 15)},
            done() {return (challengeCompletions("q", 18) == 100)}, // Used to determine when to give the milestone
            effectDescription: "New layer?",
        },
    },
   
    automate() {
    
    },

    update(diff) {
        let fast = diff;
        if (hasMilestone("s", 12)) {
            fast = fast * 2;
        }
        if (hasMilestone("s", 13)) {
            fast = fast * layers["s"].milestones[8].effect();
        }
        if (hasMilestone('s', 7)) {
            generatePoints("q", diff);
        }

        if (hasMilestone("s", 11)) {
            player.qProgress += fast;
            if (player.qProgress >= 1) {
                let val = Math.floor(player.qProgress);
                player.qProgress -= val;
                player["q"].challenges[18] += Math.min(val, 100 - challengeCompletions("q", 18));
            }
        }

        if (hasMilestone("s", 1)) {
            let comps = 1;
            if (hasMilestone("s", 8)) {
                comps = layers["s"].milestones[8].effect();
            }
            if (hasMilestone("s", 10)) {
                player["q"].challenges[11] = 12;
                player["q"].challenges[12] = 13;
                player["q"].challenges[13] = 12;
                player["q"].challenges[14] = 12;
                player["q"].challenges[15] = 12;
                player["q"].challenges[16] = 12;
                player["q"].challenges[17] = 12;
            }
            if (inChallenge("q", 11)) {
                if (player.xp.points.gte(layers["q"].challenges[11].goal())) { 
		            player["q"].challenges[11] += Math.min(comps, 12 - challengeCompletions("q", 11));
                }
                if (challengeCompletions("q", 11) >= 12) {
                    delete player["q"].activeChallenge;
                }
            }
            if (inChallenge("q", 12)) {
                if (player.xp.points.gte(layers["q"].challenges[12].goal())) {
                    player["q"].challenges[12] += Math.min(comps, 13 - challengeCompletions("q", 12));
                }
                if (challengeCompletions("q", 12) >= 13) {
                    delete player["q"].activeChallenge;
                }
            }
            if (inChallenge("q", 13)) {
                if (player.points.gte(layers["q"].challenges[13].goal())) {
                    player["q"].challenges[13] += Math.min(comps, 12 - challengeCompletions("q", 13));
                }
                if (challengeCompletions("q", 13) >= 12) {
                    delete player["q"].activeChallenge;
                }
            }
            if (inChallenge("q", 14)) {
                if (player.points.gte(layers["q"].challenges[14].goal())) {
                    player["q"].challenges[14] += Math.min(comps, 12 - challengeCompletions("q", 14));
                }
                if (challengeCompletions("q", 14) >= 12) {
                    delete player["q"].activeChallenge;
                }
            }
            if (inChallenge("q", 15)) {
                if (player.points.gte(layers["q"].challenges[15].goal())) {
                    player["q"].challenges[15] += Math.min(comps, 12 - challengeCompletions("q", 15));
                }
                if (challengeCompletions("q", 15) >= 12) {
                    delete player["q"].activeChallenge;
                }
            }
            if (inChallenge("q", 16)) {
                if (player.points.gte(layers["q"].challenges[16].goal())) {
                    player["q"].challenges[16] += Math.min(comps, 12 - challengeCompletions("q", 16));
                }
                if (challengeCompletions("q", 16) >= 12) {
                    delete player["q"].activeChallenge;
                }
            }
            if (inChallenge("q", 17)) {
                if (player.points.gte(layers["q"].challenges[17].goal())) {
                    player["q"].challenges[17] += Math.min(comps, 12 - challengeCompletions("q", 17));
                }
                if (challengeCompletions("q", 17) >= 12) {
                    delete player["q"].activeChallenge;
                }
            }
            if (inChallenge("q", 18)) {
                if (player.points.gte(layers["q"].challenges[18].goal())) {
                    player["q"].challenges[18] += Math.min(comps, 100 - challengeCompletions("q", 18));
                }
                if (challengeCompletions("q", 18) >= 100) {
                    delete player["q"].activeChallenge;
                }
            }
            let comps9 = 1;
            if (hasMilestone("s", 19)) comps9 = 3;
            if (inChallenge("q", 19)) {
                if (player.points.gte(layers["q"].challenges[19].goal()) && challengeCompletions("q", 19) < 99) {
                    player["q"].challenges[19] += Math.min(comps9, 99 - challengeCompletions("q", 19));
                }
                else if (player.points.gte(layers["q"].challenges[19].goal())) {
                    player["q"].challenges[19] += Math.min(comps9, 100 - challengeCompletions("q", 19));
                }
                if (challengeCompletions("q", 19) >= 100) {
                    delete player["q"].activeChallenge;
                }
            }
        }

        if (player.q.points.lte(1)) {
            if (inChallenge("q", 11)) {
                delete player["q"].activeChallenge;
            }
            if (inChallenge("q", 12)) {
                delete player["q"].activeChallenge;
            }
            if (inChallenge("q", 13)) {
                delete player["q"].activeChallenge;
            }
            if (inChallenge("q", 14)) {
                delete player["q"].activeChallenge;
            }
            if (inChallenge("q", 15)) {
                delete player["q"].activeChallenge;
            }
            if (inChallenge("q", 16)) {
                delete player["q"].activeChallenge;
            }
            if (inChallenge("q", 17)) {
                delete player["q"].activeChallenge;
            }
            if (inChallenge("q", 18)) {
                delete player["q"].activeChallenge;
            }
            if (inChallenge("q", 19)) {
                delete player["q"].activeChallenge;
            }
        }
    },


    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
    ],
    branches: [["xp", 3], ["g", 3]],

    tabFormat: ["main-display", 
    ["prestige-button", "", function (){ return hasMilestone("s", 26) ? {'display': 'none'} : {}}]
    , "challenges", "milestones"],

    layerShown(){return (hasUpgrade("r", 13) || player.q.best.gte(1))},
})
