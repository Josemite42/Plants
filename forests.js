forests={
	landBaseCost:100
}
var forestUnlocks = player.upgrades.forests.unlocked;

/*
function getForestGrowth() {
	var rate = getDiversityBonus()/100;
	return rate;
}

function updateForests() {
	player.forestRadius += getForestGrowth()/updateRate;
	player.forestSize = Math.PI*Math.pow(player.forestRadius,2);
}
*/

function getForestGrowth() {
	var rate = 0.01;
	
	
	if (isDefined(forestUnlocks.treeProduction)) {
		rate += player.plants[4]*0.015;
	}
	if (isDefined(forestUnlocks.selfGrowing)) {
		if (isDefined(forestUnlocks.improvedSelfGrowing)) {
			rate *= Math.pow(player.forestSize,0.75);
		} else {
			rate *= Math.pow(player.forestSize,0.5);
		}
	}
	if (isDefined(forestUnlocks.diversityBonus)){
		rate *= getDiversityBonus();
	}
	if (player.forestSize >= player.clearedLand) {
		rate = rate * Math.pow(player.clearedLand/player.forestSize,10)/2;
		//rate = 0;
		player.forestSize=player.clearedLand;
	}
	return rate;
}

function getStoneRate() {
	var rate = 0.0;
	rate += player.treants*0.01;

	return rate;
}

function updateForests() {
	player.forestSize += getForestGrowth()*updateRate/1000*10; // This will need to be adjusted if updateRate is adjustable since it's compouned more often
	player.stone += getStoneRate()*updateRate/1000*10;	

}


function getLandCost() {
	var cost=player.clearedLand;
	cost=cost*Math.pow(1.1,Math.log10(player.clearedLand)-2);
	return cost;
}

/*
function buyLand() {
	if (player.forestSize >= getLandCost()){
		player.forestSize -= getLandCost();
		player.clearedLand*=10;
		document.getElementById("landCleared").innerHTML = "Cleared Acres: " + formatValue(player.clearedLand,1,0);
		document.getElementById("clearLandBtn").innerHTML = "Clear Land: " + formatValue(getLandCost(),2,0);
		if (!isDefined(forestUnlocks.improvedSelfGrowing) && player.clearedLand>=1000000){
			addUpgrade("forests", 10000000, "Forests are better at growing by themselves.", "forestUnlocks.improvedSelfGrowing=true");
		}
	}
}
*/

function forestPrestige(){
	var presTreants = Math.log10(player.forestSize);
	if (presTreants < player.treants || presTreants < 1) {
		alert("You need a larger forest");
		return;
	}
	if (player.treants<=0.01){
		document.getElementById('stoneDiv').style.display = 'block';
	}
	player.treants=presTreants;
	player.forestSize=0;
}
