//player={
//		cells:new Decimal(10),
//		plants:[new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0)]
//		}

player={
	cells: 10, 
	cells: 4e7,
	forestSize:1,
	stone:0,
	treants:0,
	
	plants:[0, 0, 0, 0, 0],
	forestsUnlocked:false,

	clearedLand: 100,

	upgrades: {
		plants: {
			txt:['PupText0','PupText1','PupText2','PupText3','PupText4','PupText5','PupText6','PupText7','PupText8','PupText9'],
			btns:['PupBtn0','PupBtn1','PupBtn2','PupBtn3','PupBtn4','PupBtn5','PupBtn6','PupBtn7','PupBtn8','PupBtn9'],
			upQueue:[],
            
            //upgrades
            //Format: {level:0, resType:string, cost:int, name:string, desc:string}

		},
		forests: {
			txt:['FupText0','FupText1','FupText2','FupText3','FupText4','FupText5','FupText6','FupText7','FupText8','FupText9'],
			btns:['FupBtn0','FupBtn1','FupBtn2','FupBtn3','FupBtn4','FupBtn5','FupBtn6','FupBtn7','FupBtn8','FupBtn9'],
			upQueue:[],
			unlocked: {}
		},
	}
}

var updateRate=50;

var notation = "Mixed scientific";



//By Ivark/Hevipelle
//function formatValue(notation, value, places, placesUnder1000) {
function showTab(tabName) {
    //iterate over all elements in div_tab class. Hide everything that's not tabName and show tabName
    var tabs = document.getElementsByClassName('tab');
    var tab;
    for (var i = 0; i < tabs.length; i++) {
        tab = tabs.item(i);
        if (tab.id === tabName) {
            tab.style.display = 'block';
        } else {
            tab.style.display = 'none';
        }
    }

}

var FormatList = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qt', 'Sx', 'Sp', 'Oc', 'No', 'Dc', 'UDc', 'DDc', 'TDc', 'QaDc', 'QtDc', 'SxDc', 'SpDc', 'ODc', 'NDc', 'Vg', 'UVg', 'DVg', 'TVg', 'QaVg', 'QtVg', 'SxVg', 'SpVg', 'OVg', 'NVg', 'Tg', 'UTg', 'DTg', 'TTg', 'QaTg', 'QtTg', 'SxTg', 'SpTg', 'OTg', 'NTg', 'Qd', 'UQd', 'DQd', 'TQd', 'QaQd', 'QtQd', 'SxQd', 'SpQd', 'OQd', 'NQd', 'Qi', 'UQi', 'DQi', 'TQi', 'QaQi', 'QtQi', 'SxQi', 'SpQi', 'OQi', 'NQi', 'Se', 'USe', 'DSe', 'TSe', 'QaSe', 'QtSe', 'SxSe', 'SpSe', 'OSe', 'NSe', 'St', 'USt', 'DSt', 'TSt', 'QaSt', 'QtSt', 'SxSt', 'SpSt', 'OSt', 'NSt', 'Og', 'UOg', 'DOg', 'TOg', 'QaOg', 'QtOg', 'SxOg', 'SpOg', 'OOg', 'NOg', 'Nn', 'UNn', 'DNn', 'TNn', 'QaNn', 'QtNn', 'SxNn', 'SpNn', 'ONn', 'NNn', 'Ce',];

function letter(power,str) {
    const len = str.length;
    function lN(n) {
        let result = 1;
        for (var j = 0; j < n; ++j) result = len*result+1;
        return result;
    }
    if (power <= 5) return str[0];
    power = Math.floor(power / 3);
    let i=0;
    while (power >= lN(++i));
    if (i==1) return str[power-1];
    power -= lN(i-1);
    let ret = '';
    while (i>0) ret += str[Math.floor(power/Math.pow(len,--i))%len]
    return ret;
}

function getAbbreviation(e) {
    const prefixes = [
    ['', 'U', 'D', 'T', 'Qa', 'Qt', 'Sx', 'Sp', 'O', 'N'],
    ['', 'Dc', 'Vg', 'Tg', 'Qd', 'Qi', 'Se', 'St', 'Og', 'Nn'],
    ['', 'Ce', 'Dn', 'Tc', 'Qe', 'Qu', 'Sc', 'Si', 'Oe', 'Ne']]
    const prefixes2 = ['', 'MI-', 'MC-', 'NA-', 'PC-', 'FM-']
    e = Math.floor(e/3)-1;
    let index2 = 0;
    let prefix = [prefixes[0][e%10]];
    while (e >= 10) {
        e = Math.floor(e/10);
        prefix.push(prefixes[(++index2)%3][e%10])
    }
    index2 = Math.floor(index2/3)
    while (prefix.length%3 != 0) prefix.push("");
    let ret = "";
    while (index2 >= 0) ret += prefix[index2*3] + prefix[index2*3+1] + prefix[index2*3+2] + prefixes2[index2--];
    if (ret.endsWith("-")) ret = ret.slice(0,ret.length-1)
    return ret.replace("UM","M").replace("UNA","NA").replace("UPC","PC").replace("UFM","FM")
}

function formatValue(value, places, placesUnder1000) {

    if ((value <= Number.MAX_VALUE || (player.break && (player.currentChallenge == "" || !new Decimal(Number.MAX_VALUE).equals(player.challengeTarget)) )) && (value >= 1000)) {
        if (value instanceof Decimal) {
           var power = value.e
           var matissa = value.mantissa
        } else {
            var matissa = value / Math.pow(10, Math.floor(Math.log10(value)));
            var power = Math.floor(Math.log10(value));
        }
        if ((notation === "Mixed scientific" && power >= 33) || notation === "Scientific") {
            matissa = matissa.toFixed(places)
            if (matissa >= 10) {
                matissa /= 10;
                power++;
            }
            if (power > 100000  && !player.options.commas) return (matissa + "e" + formatValue(notation, power, 3, 3))
            if (power > 100000  && player.options.commas) return (matissa + "e" + power.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            return (matissa + "e" + power);
        }
        if (notation === "Infinity") {
            const inflog = Math.log10(Number.MAX_VALUE)
            const pow = Decimal.log10(value)
            if (pow / inflog < 1000) var infPlaces = 4
            else var infPlaces = 3
            if (player.options.commas) return (pow / inflog).toFixed(Math.max(infPlaces, places)).toString().split(".")[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")+"."+(pow / inflog).toFixed(Math.max(infPlaces, places)).toString().split(".")[1]+"∞"
            else return (pow / inflog).toFixed(Math.max(infPlaces, places))+"∞"
        }
        if (notation.includes("engineering") || notation.includes("Engineering")) pow = power - (power % 3)
        else pow = power
        if (power > 100000  && !player.options.commas) pow = formatValue(notation, pow, 3, 3)
        if (power > 100000  && player.options.commas) pow = pow.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        if (notation === "Logarithm") {
            if (power > 100000  && !player.options.commas) return "ee"+Math.log10(Decimal.log10(value)).toFixed(3)
            if (power > 100000  && player.options.commas) return "e"+Decimal.log10(value).toFixed(places).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            else return "e"+Decimal.log10(value).toFixed(places)
        }

        if (notation === "Brackets") {
          var table = [")", "[", "{", "]", "(", "}"];
          var log6 = Math.LN10 / Math.log(6) * Decimal.log10(value);
          var wholePartOfLog = Math.floor(log6);
          var decimalPartOfLog = log6 - wholePartOfLog;
          //Easier to convert a number between 0-35 to base 6 than messing with fractions and shit
          var decimalPartTimes36 = Math.floor(decimalPartOfLog * 36);
          var string = "";
          while (wholePartOfLog >= 6) {
            var remainder = wholePartOfLog % 6;
            wholePartOfLog -= remainder;
            wholePartOfLog /= 6;
            string = table[remainder] + string;
          }
          string = "e" + table[wholePartOfLog] + string + ".";
          string += table[Math.floor(decimalPartTimes36 / 6)];
          string += table[decimalPartTimes36 % 6];
          return string;
        }

        matissa = (matissa * Decimal.pow(10, power % 3)).toFixed(places)
        if (matissa >= 1000) {
            matissa /= 1000;
            power++;
        }

        if (notation === "Standard" || notation === "Mixed scientific") {
            if (power <= 303) return matissa + " " + FormatList[(power - (power % 3)) / 3];
            else return matissa + " " + getAbbreviation(power);
        } else if (notation === "Mixed engineering") {
            if (power <= 33) return matissa + " " + FormatList[(power - (power % 3)) / 3];
            else return (matissa + "ᴇ" + pow);
        } else if (notation === "Engineering") {
            return (matissa + "ᴇ" + pow);
        } else if (notation === "Letters") {
            return matissa + letter(power,'abcdefghijklmnopqrstuvwxyz');
        } else if (notation === "Emojis") {
            return matissa + letter(power,['😠', '🎂', '🎄', '💀', '🍆', '👪', '🌈', '💯', '🍦', '🎃', '💋', '😂', '🌙', '⛔', '🐙', '💩', '❓', '☢', '🙈', '👍', '☂', '✌', '⚠', '❌', '😋', '⚡'])
        }

        else {
            if (power > 100000  && player.options.commas) power = power.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            return "1337 H4CK3R"
        }
    } else if (value < 1000) {
        return (value).toFixed(placesUnder1000);
    } else {
        return "Infinite";
    }
}

function switchToTab(tabName){
	showTab(tabName);
}

function addUpgrade(upType,cst,description,fnctn) {
	var obj = {cost: cst, desc:description, func: fnctn};
	var i;
	var queue = player.upgrades[upType].upQueue;

	for (i=0; i < queue.length; i++) {
		if (JSON.stringify(queue[i]) === JSON.stringify(obj)){
			return;
		}
	}
		
	queue.push(obj);
	
	queue.sort(function(a,b){return a.cost-b.cost});
	updateResearchButtons(upType);
}
	
function isDefined (obj) {
		return typeof(obj) != "undefined";
}

function researchUpgrade(upType, id){	
	var upObj = player.upgrades[upType].upQueue[id];
	if (upType=="plants") {
		if (player.cells < upObj.cost) {
			return;
		}
		player.cells -= upObj.cost;
	}else if (upType=="forests") {
		if (player.forestSize < upObj.cost) {
			return;
		}
		player.forestSize -= upObj.cost;
	}
	player.upgrades[upType].upQueue.splice(id,1);
	updateResearchButtons(upType);
	eval(upObj.func);
}

function updateResearchButtons(upType){
	var i;
	var obj;
	var htmlObj;
	for (i=0; i < Math.min(player.upgrades[upType].upQueue.length,10); i++){
		obj=player.upgrades[upType].upQueue[i];
		document.getElementById(player.upgrades[upType].txt[i]).innerHTML = obj.desc;
		document.getElementById(player.upgrades[upType].txt[i]).style.display = 'block';
		htmlObj=document.getElementById(player.upgrades[upType].btns[i]);
		htmlObj.innerHTML="Cost: " + formatValue(obj.cost,2,2);
		htmlObj.setAttribute( "onClick", "researchUpgrade('" + upType + "'," + i + ")");
		htmlObj.style.display = 'block';
	}
	for (; i<10; i++){
		document.getElementById(player.upgrades[upType].txt[i]).style.display = 'none';
		document.getElementById(player.upgrades[upType].btns[i]).style.display = 'none';
	}
}

function unlockForests(){
	player.forestsUnlocked=true;
	document.getElementById('tabs').style.display = 'block';
	document.getElementById('baseCRate').style.display = 'block';
	document.getElementById('adjustCRate').style.display = 'block';
	document.getElementById("landCleared").innerHTML = "Cleared Acres: " + formatValue(player.clearedLand,1,0);
	//document.getElementById("clearLandBtn").innerHTML = "Clear Land: " + formatValue(getLandCost(),1,0);
	addUpgrade("plants", 1e8, "Your forests grow faster the more trees you have.", "player.upgrades.forests.unlocked.treeProduction=true");
	addUpgrade("forests", 5, "Your forests grow faster the more diverse they are", "player.upgrades.forests.unlocked.diversityBonus=true; addUpgrade('forests', 100, 'Forests grow faster the bigger they are.', 'player.upgrades.forests.unlocked.selfGrowing=true')");
}

//The main loop, keep it clean!
function updater(){
	plantUpdate();
	document.getElementById('cellcount').innerHTML = formatValue(player.cells,2,0);
	window.clearInterval();
	if (player.forestsUnlocked){
		updateForests();
		document.getElementById('forestSize').innerHTML = "Forest Size: " + formatValue(player.forestSize,3,2) + " acres";
		document.getElementById('adjustCRate').innerHTML = "Total Production: " + formatValue(getCProduction(),2,2);
		document.getElementById('forestRate').innerHTML = "Forest Growth Rate: " + formatValue (getForestGrowth(),3,3);
		
	}
}

window.setInterval(function(){updater();}, updateRate);