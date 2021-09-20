// Calculate points/sec!


function getPointGen() {
	if(!canGenPoints())
        return new Decimal(0)
    
    player.devSpeed = 1;

    let maxLevel = new Decimal(1000000).plus(0.3);
    if (hasMilestone("s", 9)) {
        maxLevel = maxLevel.plus(layers["s"].milestones[9].effect());
    }
    maxLevel = maxLevel.plus(layers.q.challenges[19].rewardEffect());
    maxLevel = maxLevel.plus(layers["t"].effect());

    if (hasMilestone("d", 4)) {
        maxLevel = maxLevel.times(2);
    }


    let baseGain = new Decimal(1);
    if (hasUpgrade("xp", 11)) {
        baseGain = baseGain.plus(new Decimal(1));
    }
    if ((format(tmp["xp"].resetGain) == "NaN")) tmp["xp"].resetGain = new Decimal(0);
    baseGain = baseGain.times((hasMilestone("d", 1)) ? new Decimal(1000000) : new Decimal(1));
    baseGain = baseGain.times((hasMilestone("d", 2)) ? new Decimal(1e100) : new Decimal(1));
    baseGain = baseGain.times((hasUpgrade("xp", 12)) ? upgradeEffect("xp", 12) : new Decimal(1));
    baseGain = baseGain.times((hasUpgrade("xp", 14)) ? upgradeEffect("xp", 14) : new Decimal(1));
    baseGain = baseGain.times((hasUpgrade("xp", 21)) ? upgradeEffect("xp", 21) : new Decimal(1));
    baseGain = baseGain.times((hasUpgrade("xp", 23)) ? upgradeEffect("xp", 23) : new Decimal(1));
    baseGain = baseGain.times((hasUpgrade("g", 11)) ? upgradeEffect("g", 11) : new Decimal(1));
    baseGain = baseGain.times((hasUpgrade("xp", 31)) ? upgradeEffect("xp", 31) : new Decimal(1));
    baseGain = baseGain.times((hasUpgrade("xp", 33)) ? upgradeEffect("xp", 33) : new Decimal(1));
    baseGain = baseGain.times((hasUpgrade("xp", 34)) ? upgradeEffect("xp", 34) : new Decimal(1));
    baseGain = baseGain.times((hasUpgrade("g", 21)) ? upgradeEffect("g", 21) : new Decimal(1));
    baseGain = baseGain.times((hasUpgrade("g", 23)) ? upgradeEffect("g", 23) : new Decimal(1));

    baseGain = baseGain.pow((hasUpgrade("l", 11)) ? upgradeEffect("l", 11) : new Decimal(1));
    baseGain = baseGain.pow((hasUpgrade("l", 12)) ? upgradeEffect("l", 12) : new Decimal(1));
    baseGain = baseGain.pow((hasUpgrade("l", 13)) ? upgradeEffect("l", 13) : new Decimal(1));
    baseGain = baseGain.times((hasUpgrade("l", 14)) ? upgradeEffect("l", 14) : new Decimal(1));
    baseGain = baseGain.pow((hasUpgrade("l", 15)) ? upgradeEffect("l", 15) : new Decimal(1));

    baseGain = baseGain.pow((hasUpgrade("l", 21)) ? upgradeEffect("l", 21) : new Decimal(1));
    baseGain = baseGain.pow((hasUpgrade("l", 25)) ? upgradeEffect("l", 25) : new Decimal(1));
    baseGain = baseGain.times((hasUpgrade("l", 41)) ? upgradeEffect("l", 41) : new Decimal(1));

    let lootEff = player.l.best.add(1).pow(0.75);
    let qEff = player.q.total.pow(0.6725).plus(1);
    lootEff = lootEff.pow(qEff);
    baseGain = baseGain.times(lootEff);

    let rubyEff = player.r.points.add(1).log2().add(1).pow(5);
    if (hasUpgrade("r", 13)) {
        rubyEff = rubyEff.times(Decimal.max(Decimal.times(player.r.best, player.r.best), new Decimal(1)));
    }
    if (hasMilestone("r", 3)) {
        rubyEff = rubyEff.pow(2);
    }
    rubyEff = rubyEff.pow(layers.q.challenges[13].rewardEffect());

    baseGain = baseGain.times(rubyEff);

    
    baseGain = baseGain.times((hasUpgrade("xp", 45)) ? new Decimal(1000) : new Decimal(1));

    if (hasMilestone("s", 0)) {
        baseGain = baseGain.times(layers["s"].milestones[0].effect());
    }

    if (inChallenge("q", 11)) {
        baseGain = baseGain.pow(challengeVar("q", 11));
    }
    else {
        baseGain = baseGain.pow(layers.q.challenges[11].rewardEffect());
    }

    if (inChallenge("q", 12)) {
        baseGain = baseGain.tetrate(challengeVar("q", 12));
    }

    if (inChallenge("q", 15)) {
        baseGain = baseGain.plus(1).log(challengeVar("q", 15));
    }
    if ((format(tmp["xp"].resetGain) == "NaN")) baseGain = new Decimal(0);

    if (inChallenge("q", 16)) {
        let chavarVal = new Decimal(challengeVar("q", 16));
        baseGain = baseGain.pow(new Decimal(1).div(player.points.times(chavarVal).plus(1)));
        if ((format(tmp["xp"].resetGain) == "NaN")) baseGain = new Decimal(1);
    }
    

    if (inChallenge("q", 18)) {
        baseGain = baseGain.plus(1).log(1000).plus(1).log(1000);
        if ((format(tmp["xp"].resetGain) == "NaN")) baseGain = new Decimal(1);
    }
    
    if (inChallenge("q", 19)) {
        baseGain = baseGain.plus(1).log(1000000).plus(1).log(1000000).plus(1).log(1000000);
        if ((format(tmp["xp"].resetGain) == "NaN")) baseGain = new Decimal(1);
    }


    if (hasUpgrade("r", 15)) {
        baseGain = baseGain.times(2);
    }

    if (hasUpgrade("t", 23)) {
        baseGain = baseGain.times(upgradeEffect("t", 23));
    }

    baseGain = baseGain.times(layers["d"].effect());

    let powPower = new Decimal(2);
    if (hasUpgrade("xp", 41)) powPower = new Decimal(1.9);
    if (hasUpgrade("xp", 42)) powPower = new Decimal(1.8);
    if (hasUpgrade("xp", 43)) powPower = new Decimal(1.75);
    if (hasUpgrade("xp", 44)) powPower = new Decimal(1.7);
    if (hasUpgrade("xp", 45)) powPower = new Decimal(1.66666);

    if (hasMilestone("r", 2)) powPower = powPower.sub(new Decimal(1)).times(new Decimal(0.9)).plus(new Decimal(1));
    if (hasUpgrade("r", 13)) powPower = powPower.sub(new Decimal(1)).times(new Decimal(0.99)).plus(new Decimal(1));

    if (hasUpgrade("r", 23)) powPower = powPower.pow(0.4);

    powPower = powPower.sub(new Decimal(1)).times((new Decimal(1)).sub(layers.q.challenges[12].rewardEffect())).plus(new Decimal(1));

    powPower = powPower.pow((buyableEffect("r", 12)));


    let gain1 = Decimal.div(baseGain , Decimal.pow(powPower, player.points));
    let exponentLevelGainLimitOnce = baseGain.plus(1).log(powPower);
    let newPowPower = powPower.add(player.points.div(new Decimal(100))).sub(30);



    newPowPower = newPowPower.sub(new Decimal(1)).times((new Decimal(1)).sub(layers.q.challenges[12].rewardEffect())).plus(new Decimal(1));

    newPowPower = newPowPower.pow((buyableEffect("r", 12)));

    let newExponentLevelGainLimitOnce = baseGain.plus(1).log(newPowPower);

    if (player.points.gte(3000)) {
        gain = Decimal.min(gain1, newExponentLevelGainLimitOnce);
    }
    else {
        gain = Decimal.min(gain1, exponentLevelGainLimitOnce);
    }
 
    if ((format(tmp["xp"].resetGain) == "NaN")) gain = new Decimal(0);

    if (Decimal.lte(gain, new Decimal(1e-3).div(player.devSpeed))) {
        if (gain.gte(new Decimal(0))) {
            let decDiff = gain.plus(new Decimal("1e-999999999")).div(new Decimal(1e-3));
            let logBack = Decimal.min(decDiff.log(powPower), new Decimal(0));
            if (player.points.lte(logBack.times(-1))) {
                player.points = player.points.div(1.2);
            }
            else {
                gain = logBack;
            }
        }
    }

    if (player.points.plus(gain).gte(maxLevel)) {
        gain = maxLevel.sub(player.points);
    }

    if (gain.times(-1).gte(player.points)) {
        gain = player.points.div(2).times(-1);
    }

	return gain
}
