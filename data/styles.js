var color1 = ["#ecf4cb","#ffe082","#ffbd13","#ff8053","#ff493d"];
var color2 = ["#e3f2de","#bae4b3","#74c476","#31a354","#006d2c"];
var color3 = ["#e4e8f4","#bdd7e7","#6baed6","#3182bd","#08519c"];

window.col_header1 = [
	"Total Population",
    "Total Families",
    "Affected Population",
    "Deaths",
    "Injured",
    "Missing",
    "Total Homes",
    "Homes Destroyed",
    "Homes Partially Destroyed"];

/*window.col_header2 = [
    "NFRI-Full-set",
    "Tarpaulin",
    "Blankets",
    "ORS",
    "Hygiene-kits",
    "Aqua-Tab",
    "Soap"];

window.col_header3 = [    
    "FA",
    "CADRE/Rescue Team",
    "NDRT",
    "PSS",
    "RFL/DBM",
    "WASH",
    "DDRT",
    "Other",
    "International Delegates/Volunteers",
    "All"];*/
	
function listMax(header,data){
	var temp = [];
	header.forEach(function(entry) {
		var data_temp = data.filter(function(o){ if(o[entry]){
				return o[entry];}})
				.map(function(o){return o[entry];});
		var geostats_temp = new geostats(data_temp);
		temp.push({field: entry, 
				max: geostats_temp.max(),
				qua: geostats_temp.getClassQuantile(5),
				sum: geostats_temp.sum()});		
		});
	return temp;
};

function getMax(list,field){
	for(i in list){
		if(list[i]["field"]==field){
			return [list[i]["max"],list[i]["qua"]];
		};}
};

function getData(list,pcode,field){
	for(i in list){
		var temp;
		if(list[i]["Pcode"]==pcode){
			if(list[i][field]){temp = list[i][field]}else{ temp = "-"}
			return temp;
		console.log(temp);
		};}
};

var col_max = listMax(col_header1,popdata);

var getStyle = function(feature){
		var data = getData(popdata,feature.properties.PCODE,field);
		var max = getMax(col_max,field);
	    if(data>max[1][4]){
	    	
	        return {color: color[4],fillColor: color[4],fillOpacity:0.5,opacity:0.7,weight:2};
	    } else if(data>max[1][3]){
	        return {color: color[3],fillColor: color[3],fillOpacity:0.5,opacity:0.7,weight:2};
	    } else if(data>max[1][2]){
	        return {color: color[2],fillColor: color[2],fillOpacity:0.5,opacity:0.7,weight:2};
	    } else if(data>max[1][1]){
	        return {color: color[1],fillColor: color[1],fillOpacity:0.5,opacity:0.7,weight:2};
	    } else if(data>0){ 
	    	return {color: color[0],fillColor: color[0],fillOpacity:0.5,opacity:0.7,weight:2};
		} else {
	    	return {"color": "none","opacity":1};
		}
};
