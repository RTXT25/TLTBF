// Calculate points/sec!


function getPointGen() {
	if(!canGenPoints())
        return new Decimal(0)
    
    player.devSpeed = 1;
    let baseGain = new Decimal(1);
    if (hasUpgrade("xp", 11)) {
        baseGain = baseGain.plus(new Decimal(1));
    }
    if (isNaN(tmp["xp"].resetGain)) tmp["xp"].resetGain = new Decimal(0);
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
    baseGain = baseGain.pow((hasUpgrade("l", 41)) ? upgradeEffect("l", 41) : new Decimal(1));

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
    if (isNaN(baseGain)) baseGain = new Decimal(0);

    let powPower = new Decimal(2);
    if (hasUpgrade("xp", 41)) powPower = new Decimal(1.9);
    if (hasUpgrade("xp", 42)) powPower = new Decimal(1.8);
    if (hasUpgrade("xp", 43)) powPower = new Decimal(1.75);
    if (hasUpgrade("xp", 44)) powPower = new Decimal(1.7);
    if (hasUpgrade("xp", 45)) powPower = new Decimal(1.66666);

    if (hasMilestone("r", 2)) powPower = powPower.sub(new Decimal(1)).times(new Decimal(0.9)).plus(new Decimal(1));
    if (hasUpgrade("r", 13)) powPower = powPower.sub(new Decimal(1)).times(new Decimal(0.99)).plus(new Decimal(1));
    powPower = powPower.sub(new Decimal(1)).times((new Decimal(1)).sub(layers.q.challenges[12].rewardEffect())).plus(new Decimal(1));


    if (Decimal.gte(player.points, new Decimal(3000))) {
        powPower = powPower.plus(player.points.sub(new Decimal(3000)).div(new Decimal(1000)));
    }
    let gain1 = Decimal.div(baseGain , Decimal.pow(powPower, player.points));
    let exponentLevelGainLimitOnce = baseGain.plus(1).log(powPower);
    let newPowPower = powPower.add(exponentLevelGainLimitOnce.div(new Decimal(1000)));
    let newExponentLevelGainLimitOnce = baseGain.plus(1).log(newPowPower);
    gain = Decimal.min(gain1, newExponentLevelGainLimitOnce);
 
    if (isNaN(gain)) gain = new Decimal(0);

    if (Decimal.lte(gain, new Decimal(1e-5).div(player.devSpeed))) {
        if (gain.gte(new Decimal(0))) {
            let decDiff = gain.plus(new Decimal(1e-10)).div(new Decimal(1e-5));
            let logBack = Decimal.min(decDiff.log(newPowPower), new Decimal(0));
            if (player.points.lte(logBack.times(-1))) {
                player.points = player.points.div(1.2);
            }
            else {
                gain = logBack;
            }
        }
    }


	return gain
}
