from = new Array();
to = new Array();
distance = new Array();
from_loc = new Array();
to_loc = new Array();

matrix = [];
floyd = [];
distance_temp ="";
table = "";
tempLoc = new Array();

$(document).ready(function() {
	for(i = 4; i <= 10; i++) {
		$('#put_vert').append('<option>'+i+'</option');
	}
	for(i = 4; i <= 10; i++) {
		$('#put_edge').append('<option>'+i+'</option');
	}

	data_location = ['Mumbai', 'Delhi', 'Kochi', 'Srinagar', 'Bangalore', 'Chennai', 'Kolkata', 'Bhopal', 'Goa', 'Hyderabad'];
	data_lat = ['19.075984', '28.704059', '9.931233', '34.083671', '12.971599', '13.082680', '22.572646', '23.259933', '15.299326', '17.385044'];
	data_long = ['72.877656', '77.102490', '76.267304', '74.797282', '77.594563', '80.270718', '88.363895', '77.412615', '74.123996', '78.486671'];

	a = data_location.length;
	value_loc = "";
	for(j = 0; j < a; j++) {
		value_loc = value_loc+ "<option>"+data_location[j]+"</option>";
	}


	$('#get_vert').click(function(){
		total_vertex = $('#put_vert').find(':selected').text();
		total_edge = $('#put_edge').find(':selected').text();
		$('#loca').show();
		for(i = total_vertex; i > 0; i--) {
			$('.location').prepend('<select id=location'+i+'>'+value_loc+'</select><br><br>');
		}	
	});

	loc = new Array();
	$('#get_location').click(function(){
		for(i = 1; i <= total_vertex; i++) {
			temp = "#location"+i;
			loc[i-1] = $(temp).find(':selected').text();
		}

		$('#edges').show();
		b = loc.length;
		value_edge_loc = "";
		for(j = 0; j < b; j++) {
			value_edge_loc = value_edge_loc+ "<option>"+loc[j]+"</option>";
		}

		for(i = total_edge; i > 0; i--) {
			$('.edges').prepend('<select style="margin:0px 10px;" id=to'+i+'>'+value_edge_loc+'</select><br><br>');
			$('.edges').prepend('<select style="margin:0px 10px;" id=from'+i+'>'+value_edge_loc+'</select>');			
		}

		$('.edges').prepend('<button style="color:white;border:0px solid black;background:transparent;">TO</button><br><br>');
		$('.edges').prepend('<button style="color:white;border:0px solid black;background:transparent;">FROM</button>');
	});


	$('#get_edge').click(function(){
		for(i = 1; i <= total_edge; i++) {
			to_temp = "#to"+i;
			from_temp = "#from"+i;
			from[i - 1] = $(from_temp).find(':selected').text();
			to[i - 1] = $(to_temp).find(':selected').text();
			var origins = from[i - 1];
			var destinations = to[i - 1];
			var src="https://crossorigin.me/https://maps.googleapis.com/maps/api/distancematrix/json";
				$.ajax({
				    type: 'GET',
				    url: src,
				    data: {
				    	'origins': origins,
				    	'destinations': destinations,
				    	'key': 'AIzaSyAMiqfHPAc3Mn_JIjC5JOa0D85mGFpbUSs'
				    },
				    dataType: 'json',
				    success: function (data) {
				    	distance_temp = (data.rows[0].elements[0].distance.value)/1000;
				    	console.log(distance_temp);
					},
					async: false
				});
			//ajax ends
				distance[i-1] = distance_temp;
				var pos_from = data_location.indexOf(origins);
				from_loc[i-1] = data_lat[pos_from]+","+data_long[pos_from];
				
				var pos_to = data_location.indexOf(destinations);
				to_loc[i-1] = data_lat[pos_to]+","+data_long[pos_to];			



		}
		
		for(i = 0; i < from.length; i++) {
			tempLoc[i] = from[i]+" "+to[i];
		}
		table = table+"<table style='width:60%;margin:0 auto;'>";
		table = table+"<tr><th></th>";
		for(i=0; i<loc.length; i++) {
			table = table+"<th>"+loc[i]+"</th>";
		}
		table = table+"</tr>";
		

		for(i = 0; i < loc.length; i++) {
			matrix[i] = [];
			table = table+"<tr><th style='text-transform:uppercase;'>"+loc[i]+"</th>"
			for(j = 0; j < loc.length; j++) {

				var check = $.inArray(loc[i]+" "+loc[j], tempLoc) > -1;

				if(i === j){
					matrix[i][j] = 0;
					table = table+"<td>0</td>";
				}
				else if(check) {
					var temp_num = tempLoc.indexOf(loc[i]+" "+loc[j]);
					matrix[i][j] = distance[temp_num];
					table = table+"<td>"+matrix[i][j]+" KM</td>";
				}
				else {
					matrix[i][j] = Infinity;
					table = table+"<td>Infinity</td>";
				}
			}
			table = table+"</tr>";
		}
		table = table+"</table><br><br><br>";
		$('.tablemat').prepend(table);
		console.log(matrix);
		$('#check_edge').show();
	});


	$('#floyd').click(function(){
		$('#dvMap').css("left", "-100%");
		$('#floyd').css("z-index", "-1");
		$('#floyd_div').show();
		$('.table_old').prepend(table);


		for(i = 0; i < loc.length; i++) {
			floyd[i] = [];
			for(j = 0; j < loc.length; j++) {
				floyd[i][j] = matrix[i][j];
			}
		}

		for(k = 0; k < loc.length; ++k) {
			for(i = 0; i < loc.length; ++i) {
				for(j = 0; j < loc.length; ++j) {
					if(floyd[i][k] + floyd[k][j] < floyd[i][j]) {
						floyd[i][j] = floyd[i][k] + floyd[k][j];
					}
				}
			}
		}

		table ="";

		table = table+"<table style='width:60%;margin:0 auto;'>";
		table = table+"<tr><th></th>";
		for(i=0; i<loc.length; i++) {
			table = table+"<th>"+loc[i]+"</th>";
		}
		table = table+"</tr>";

		for(i = 0; i < loc.length; i++) {
			table = table+"<tr><th style='text-transform:uppercase;'>"+loc[i]+"</th>"
			for(j = 0; j < loc.length; j++) {
				table = table+"<td>"+(floyd[i][j]).toFixed(3)+" KM</td>";
			}
			table = table+"</tr>";
		}
		table = table+"</table>";
		$('.table_new').prepend(table);


		
	});
});



var directionsDisplay = [];
var directionsService = [];
var map = null;
var bounds = new google.maps.LatLngBounds();
// var m = [
//     '33.2970431149,130.5494435901',
//     '33.3151238268	,130.5100849151'

// ];
// var msg = [
//     '33.3288994858,	130.4731429044',
//     '33.3239542905,130.3998714394'
// ];
// var ms = [
//     '33.8088548609,130.8573666723',
//     '33.8514059878	,130.8643919073'
// ];

function init() {

    var mapOptions = {
        // center: locations[0],
        zoom: 4,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById('dvMap'), mapOptions);
    // calcRoute(msg);
    // calcRoute(m);
    // calcRoute(ms);


    for(i = 0; i < to_loc.length; i++) {
    	var lol = new Array();
    	lol[0] = from_loc[i];
    	lol[1] = to_loc[i];
    	calcRoute(lol);
    }

}

function calcRoute(f) {
    var input_msg = f;
    var locations = new Array();
    for (var i = 0; i < input_msg.length; i++) {
        var tmp_lat_lng = input_msg[i].split(",");
        locations.push(new google.maps.LatLng(parseFloat(tmp_lat_lng[0]), parseFloat(tmp_lat_lng[1])));
        bounds.extend(locations[locations.length - 1]);
    }



    map.fitBounds(bounds);

    i = locations.length;
    var index = 0;

    while (i != 0) {

        if (i < 3) {
            var tmp_locations = new Array();
            for (var j = index; j < locations.length; j++) {
                tmp_locations.push(locations[j]);
            }
            drawRouteMap(tmp_locations);
            i = 0;
            index = locations.length;
        }

        if (i >= 3 && i <= 10) {
            //alert("before :fun < 10: i value " + i + " index value" + index);
            var tmp_locations = new Array();
            for (var j = index; j < locations.length; j++) {
                tmp_locations.push(locations[j]);
            }
            drawRouteMap(tmp_locations);
            i = 0;
            index = locations.length;
            console.log("after fun < 10: i value " + i + " index value" + index);
        }

        if (i >= 10) {
            // alert("before :fun > 10: i value " + i + " index value" + index);
            var tmp_locations = new Array();
            for (var j = index; j < index + 10; j++) {
                tmp_locations.push(locations[j]);
            }
            drawRouteMap(tmp_locations);
            i = i - 9;
            index = index + 9;
            console.log("after fun > 10: i value " + i + " index value" + index);
        }
    }


}
j = 0;

function drawRouteMap(locations) {
    j++;
    var start, end;
    var waypts = [];

    for (var k = 0; k < locations.length; k++) {
        if (k >= 1 && k <= locations.length - 2) {
            waypts.push({
                location: locations[k],
                stopover: true
            });
        }
        if (k == 0) start = locations[k];

        if (k == locations.length - 1) end = locations[k];

    }
    var request = {
        origin: start,
        destination: end,
        waypoints: waypts,
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode.DRIVING
    };
    console.log(request);

    directionsService.push(new google.maps.DirectionsService());
    var instance = directionsService.length - 1;
    directionsDisplay.push(new google.maps.DirectionsRenderer({
        preserveViewport: true
    }));
    // var instance = directionsDisplay.length - 1;
    //  directionsDisplay[instance].setMap(map);
    directionsService[instance].route(request, function (response, status) {
    	console.log(response);
        if (status == google.maps.DirectionsStatus.OK) {
            // alert(status);
            if (directionsDisplay && directionsDisplay[instance]) {
                directionsDisplay[instance].setMap(map);
                directionsDisplay[instance].setDirections(response);
                $('#dvMap').css("left","0px");
                $('#floyd').css("z-index", "999999");
            } else {
                document.getElementById('info').innerHTML += "instance=" + instance + " doesn't exist<br>";
            }
        } else {
            document.getElementsById('info').innerHTML += "instance=" + instance + " status=" + status + "<br>";
        }
    });
    // alert(instance);

}
var mapDiv = document.getElementById('check_map');
google.maps.event.addDomListener(mapDiv, 'click', init);
