var plantlabel=['plant0','plant1','plant2','plant3','plant4'];
var plantbutton=['plant0btn','plant1btn','plant2btn','plant3btn','plant4btn'];
var plantBaseCosts=[10,100,1000,100000,10000000];
var plantBaseProduction=[1,5,20,50,150];
var forestButtonUnlocked = false;
var plantUnlocks = player.upgrades.plants.unlocked;

var plants = {
}

document.addEventListener('DOMContentLoaded', function() {
	var i;

	for (i=0; i<plantbutton.length; i++) {
		document.getElementById(plantbutton[i]).innerHTML = "Cost: " + formatValue(getPlantCost(i),2,0);
	}
},false);



function buyPlant(plantID){
	var cost = getPlantCost(plantID);
	if (player.cells >= cost){
		player.plants[plantID]++;
		player.cells -= cost;
	}
	document.getElementById(plantlabel[plantID]).innerHTML = player.plants[plantID];
	document.getElementById('divBonus').innerHTML = formatValue(getDiversityBonus(),2,2)+"x";
	document.getElementById(plantbutton[plantID]).innerHTML = "Cost: " + formatValue(getPlantCost(plantID),2,0);
	
	if (!isDefined(plants.forestButtonUnlocked) && player.plants[4] >= 0) {
		addUpgrade("plants", 5e7, "Learn how to turn your plants into forests that grow on their own.", "unlockForests()");
		plants.forestButtonUnlocked=true;
	}
	
	if (!isDefined (plants.divButtonUnlocked) && player.plants[2] > 0) {
		plants.divButtonUnlocked=true;
		addUpgrade("plants", 10000, "The greater your plant diversity, the better they grow!", "plantUnlocks.diversityBonus=true");
	}
	
	if (!isDefined (plants.synergyButtonUnlocked) && player.plants[3] > 0) {
		plants.synergyButtonUnlocked=true;
		addUpgrade("plants", 500000, "Each plant increases the production of that type of plant by 3%", "plantUnlocks.synergyBonus=true");
	}
	
	if (!isDefined (plants.forestsProduceUnlocked) && player.forestsUnlocked && player.plants[4] > 13) {
		plants.forestsProduceUnlocked=true;
		addUpgrade("plants", 5e8, "Gain the ability to capture some of the cells produced by your forests.", "plantUnlocks.forestsProduce=true");
	}

}

function getPlantCost(plantID){
	var cost = plantBaseCosts[plantID];
	var count = player.plants[plantID];
	if (count <20){
		cost*=Math.pow(1.16, player.plants[plantID]);
	} else {
		cost*=20*Math.pow(1.5+plantID/4,count-20);  //This assumes a 1.16 multi for 0-20
	}
	return cost;
}

function getDiversityBonus(){
	var multi=1;
	var i;
	for (i=0; i<=4; i++) {
		multi=multi*(player.plants[i]+1);
	}
	return Math.pow(multi,0.12);
}

function getCBaseProduction(){
	var i;
	var prod=0;
	for (i=0; i <= 4; i++) {
		if (isDefined(plantUnlocks.synergyBonus)){
			prod += player.plants[i]*Math.pow(1.1,player.plants[i])*plantBaseProduction[i];
		} else {
			prod += player.plants[i]*plantBaseProduction[i];
		}
	}
	if (isDefined(plantUnlocks.diversityBonus)){
		prod*=getDiversityBonus();
	}
	return prod;
}

function getCProduction(prod){

	if (isDefined(plantUnlocks.forestsProduce)) {
		prod*=Math.max(Math.pow(player.forestSize,0.5),1);
	}
	return prod;
}



function plantUpdate(){
	var baseProd = getCBaseProduction();
	var prod = getCProduction(baseProd);
	document.getElementById('baseCRate').innerHTML = "Production/acre: " + formatValue(baseProd,2,2);
	player.cells += prod*updateRate/1000*1;
}