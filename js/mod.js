let modInfo = {
	name: "The Leveling Tree",
	id: "bergloMod",
	author: "denisolenison",
	pointsName: "levels",
	discordName: "denisolenison",
	discordLink: "",
	changelogLink: "https://github.com/denisolenison/The-Modding-Tree/blob/master/changelog.md",
    offlineLimit: 0,  // In hours
    initialStartPoints: new Decimal (0) // Used for hard resets and new players
}

// Set your version in num and name
let VERSION = {
	num: "0.1.3.1",
	name: "Only 2 firts tiers and a bit of third",
}

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
	devSpeed : 1,
	qProgress : 0,
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return false;
}



// Less important things beyond this point!

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(25) // Default is 1 hour which is just arbitrarily large
}