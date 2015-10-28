function init(){
	
	window.popup_open = false;
	
    var base_osm1 = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png',{
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
    	minZoom: 8});

	function getLayers(list,color_list){
		var temp_list = [];
		window.color = color_list;
		for(i in list){
			window.field = list[i];
			var temp = L.geoJson(mandawi,{
				style: getStyle,
				onEachFeature: getOnEachFeature
			});
			temp_list.push(temp);
		}
		return temp_list;
    };
	
	var all_layers1 = getLayers(col_header1,color1);

    var map1 = L.map('map1', {
        center: [7.92867, 122.82166],
        zoom: 9,
        layers: [base_osm1,all_layers1[0]]
    });
	
	function getControl(list_names,list_layers){
		var temp =[];
		for(i in list_names){
		temp[list_names[i]] = list_layers[i];		
		};
		return temp;
	};
	
	var all_controls1 = getControl(col_header1,all_layers1);

    L.control.layers(all_controls1).addTo(map1);
	    
    var legends1 = L.control({position: 'bottomleft'});

	legends1.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'legends1');
        this.update1();
        return this._div;
    };
	
	legends1.update1 = function (field){
		if(!(field)){field = init_field}
		var max = getMax(col_max,field);
		var labels = [(max[1][4]+1).toLocaleString() + " - " + (max[0]).toLocaleString(),
					(max[1][3]+1).toLocaleString() + " - " + (max[1][4]).toLocaleString(),
					(max[1][2]+1).toLocaleString() + " - " + (max[1][3]).toLocaleString(),
					(max[1][1]+1).toLocaleString() +" - " + (max[1][2]).toLocaleString(),
					"1 - " + (max[1][1]).toLocaleString()];
		var html = "<p><b>"+ field +"</b></p>";
		var color = color1
		for(i=0;i<5;i++){
			html = html +'<p><i style="background-color:' + color[4-i]+'"></i> '+labels[i]+'</p>';}
		this._div.innerHTML = html;
	};

    map1.on('baselayerchange', function (eventLayer) {
          legends1.update1(eventLayer.name);
    });
        
	var init_field = "Affected Population";
    legends1.addTo(map1);
    
    return [map1];
}


function getOnEachFeature(feature, layer) {
	layer.bindPopup("<b>" + feature.properties.NAM_INFO
				+ "</b><br/>"+ field +": " + getData(popdata,feature.properties.PCODE,field).toLocaleString());
    layer.on({
        mouseover: onMouseOver,		
		mouseout: onMouseOut,
		popupopen: onPopupOpen,
		popupclose: onPopupClose,
		click: zoomToFeature
    });
}

function zoomToFeature(e) {
	var temp;
	if(e.target.feature.properties.PCODE == window.zoomed){
		temp = bounds;
		window.zoomed = NaN;
		}else{
		temp = e.target.getBounds();
		window.zoomed = e.target.feature.properties.PCODE;}
}		

function onMouseOver(e) {
	if(!popup_open){
		document.getElementById("dmg_dis").innerHTML = "<b>" + e.target.feature.properties.NAM_INFO + "<b/>";
		for(k=1;k<10;k++){
			var temp_data1 = getData(popdata,e.target.feature.properties.PCODE,col_header1[(k-1)]);
			var temp_data2 = temp_data1 ? temp_data1 : 0;
			var temp_id1 = "dmg_dis_"+k.toString();
			var temp_id2 = "dmg_full_"+k.toString();
			var temp_value1 = Math.round(temp_data2/ parseInt(document.getElementById(temp_id2).innerHTML.replace(/[\.,]/g, ""))*100);
			var temp_value2 = !(temp_value1) ? "00" : ("00"+ temp_value1).slice(-2); 
			document.getElementById(temp_id1).innerHTML = "" + temp_data2.toLocaleString() + "<small> | </small>" + temp_value2 + "<small>%</small>"+
			"<div style='width:75%; line-height:25%' class='styled1' align='right'><progress style='height: 5px' value='"+parseInt(temp_value2)+"' max='"+100+"'></progress></div></div>";
		 }
	}
}

function onPopupOpen(e) {
	var temp_field = e.popup._content.match(/(<br\/>).+(:)/g)[0];
	temp_field = temp_field.slice(5,temp_field.length - 1);
	console.log(temp_field);
	console.log(col_header1);
	console.log(col_header1.indexOf(temp_field) > -1);
	/*if(col_header1.indexOf(temp_field) > -1){
		map2.closePopup();
		map3.closePopup();
	}else if(col_header2.indexOf(temp_field) > -1){
		map1.closePopup();
		map3.closePopup();
	}else{
		map1.closePopup();
		map2.closePopup();
	}*/
	onMouseOver(e);
	window.popup_open = true;
}

function onMouseOut() {
	if(!popup_open){	
		document.getElementById("dmg_dis").innerHTML = "<b>Region<b/>";
		for(k=1;k<10;k++){
			var temp_id1 = "dmg_dis_"+k.toString();
			var temp_value = 0;
			document.getElementById(temp_id1).innerHTML = "- <small>|</small> 00<small>%</small>" + 
			"<div style='width:75%; line-height:25%' class='styled1' align='right'><progress value='"+temp_value+"' max='"+100+"'></progress></div></div>";
		 }
	}
}

function onPopupClose(e) {
	window.popup_open = false;
}
    
var maps = init();
var map1 = maps[0];
var bounds = map1.getBounds();
console.log(bounds);
var zoomed = NaN;

for(k=1;k<10;k++){
	document.getElementById("dmg_full_"+k).innerHTML = parseInt( col_max[k-1].sum ).toLocaleString() + 
							"<div style='line-height:40%' class='styled1' align='right'><progress value='"+100+"' max='"+100+"'></progress></div></div>";
	document.getElementById("dmg_dis_"+k).innerHTML = "- <small>|</small> 00<small>%</small>" + 
							"<div style='width:75%; line-height:25%' class='styled1' align='right'><progress value='"+0+"' max='"+100+"'></progress></div></div>";
}
