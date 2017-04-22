var width=$( window ).width();
var height=$( window ).height();
var picker_class;
if(width>1080){
	var width_picker= width*0.5-25;
	var height_picker= height*0.6;
	picker_class="jscolor {width:"+width_picker+", height:"+height_picker+", position:'right'}";
	$("#color").addClass(picker_class);
	console.log("Picker size set: "+width_picker+", "+height_picker)
} else if (width<=1080){
	var width_picker= width*0.95-100;
	var height_picker= height*0.6;
	picker_class="jscolor {width:"+width_picker+", height:"+height_picker+", position:'bottom'}";
	$("#color").addClass(picker_class);
	console.log("Picker size set: "+width_picker+", "+height_picker)
};

serverData=[];
color=$("#color").val();
led=$("#ledId").val();

function toggleOperation(){
	if ($("#operation").val()==0){
		$("#operation").removeClass("inactive");
		$("#operation").addClass("active");
		$("#operation").val(1);
	}else{
		$("#operation").removeClass("active");
		$("#operation").addClass("inactive");
		$("#operation").val(0);
	}	
}

function setOperation(){
	if ($("#operation").val()==1){
		$("#operation").removeClass("inactive");
		$("#operation").addClass("active");
	}else{
		$("#operation").removeClass("active");
		$("#operation").addClass("inactive");
	}
}

function getLampData(){
	console.log("Data load initiated")
	$.ajax({ 
		url: 'http://localhost:8080/lamps/' + $("#ledId").val(), 
		type: 'GET',
	
		success: function(data) { 
			console.log("Get lamp data SUCCESS")
			//console.log(data);
	
			lampDetails = jQuery.parseJSON(data);
	
			console.log('Color updated to: ' + lampDetails.color);
			console.log('Saved server color: ' + serverData[0]);
			
			if(serverData[0]!=(lampDetails.color).toUpperCase()){
				$("#color").val( (lampDetails.color).toUpperCase() );
				$("#color").css("background-color",$("#color").val());
				serverData=[lampDetails.color,serverData[1]];
			
				console.log('Lamp name updated to: ' + lampDetails.name);
				$("#name").val(lampDetails.name);
			}	
			if(serverData[1] != lampDetails.operation){	
				$("#operation").val(lampDetails.operation);
				setOperation();
				console.log('Operation set to :' + $("#operation").val())
				serverData=[serverData[0],lampDetails.operation];
			}									
		}, 
		error: function() { 
			console.log("Get lamp data ERROR")
					
		}  
	})
}

function getLampCount(){
	console.log("Get lamp count initiated")
	$.ajax({
		url: 'http://localhost:8080/getLampsCount',
		type: 'GET',
		success: function(data) {
			console.log("Get lamp count SUCCESS");
				val=$("#ledId").val();
				$("#ledId").empty();
				for (var i=1; i<=data; i++) {
					$("#ledId").append('<option id=' + i + ' value=' + i + '>LED ' + i + '</option>');
				}
				$("#ledId").val(val);
			},
		
			error: function() {
				console.log("Get lamp count ERROR");
			}
		});
	}
	
	$(document).ready(function(){
		getLampCount()
		getLampData()
		$("input").click(function(){
			$('body>div').show(1500);
		});
		$("#confirm").click(function(){
			console.log("POST iniciated with data: "+led+" - "+color);
			 $.ajax({ 
				url: 'http://localhost:8080/save', 
				type: 'POST', 
				contentType: 'application/json', 
				data: JSON.stringify({ 
					"ledId": $("#ledId").val(), 
					"color": $("#color").val(),
					"operation": $("#operation").val()
				}), 
				success: function(data) { 
					console.log("Post SUCCESS")
					serverData=[$("#color").val(),$("#operation").val()]
				}, 
				error: function() { 
					console.log("Post ERROR")
				}  
			});
		});
		$("#operation").click(function(){
			toggleOperation();
		})
		$("#ledId").change(function(){getLampData()})
		setInterval(function(){
			getLampCount()
			getLampData()
		},2000)
	});