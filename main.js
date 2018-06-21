function initMap(x,y,title) {

        if (x==undefined && y==undefined)
        	x=50.45, y=30.523, title='';
        var map = new google.maps.Map(document.getElementById('map'), {
        	center: new google.maps.LatLng(x, y),
        	zoom:9
        });
        var marker = new google.maps.Marker({
	        position: {lat: x, lng: y},
	        map: map,
	        title: title
    });
    
}
$(document).ready(function(){
	 $(".submit").click(function(){
	 	var city = $("#search").val();
	 	if(city){
	 	$.ajax({
	 		url:'http://api.openweathermap.org/data/2.5/forecast?q=' + city +
	 		"&appid=e6980ce720b2ebbb8d9d1d9a24796c41",
	 		type:"GET",
	 	}).done(function(data){
	 		var arr = data.list.slice(0);
	 		 console.log(arr);
                for (var i = 0; i < arr.length; i++)
                    for (var j = i + 1; j < arr.length;)
                        if (arr[i].dt_txt.split(" ")[0] == arr[j].dt_txt.split(" ")[0])
                         arr.splice(j, 1);
                        else j++;
                        console.log(arr[0].dt.txt);
                        $(".container").prepend("<h2>"+ data.city.name+"</h2>");
		 		var container ='';
		 		for(i in data.list){
		 			var day = new Date(data.list[i].dt*1000).getDate();
                    var month = new Date(data.list[i].dt*1000).getMonth();
                    var time= day + ":"+ month;
			 		container += "<div class='qwe'>"+"<h3>"+data.list[i].dt_txt+"</h3>"+
			 		
			 		"<div class='hide'>"+time+"</div>"+

			 		
			 		'<p><img src="https://openweathermap.org/img/w/'+data.list[i].weather[0].icon+'.png"</p>'+
			 		"<p>Давление:"+Math.ceil(data.list[i].main.pressure*0.00750063755419211*100) + "мм.рт.ст</p>"+
			 		"<p>Влажноть:"+data.list[i].main.humidity+"%</p>"+
			 		'<p>Температура:'+Math.ceil(data.list[i].main.temp-273)+'&#176;C</p>'+"</div>";
			 		
			 		$(".container").append(container);
		 		}
		 		 initMap(data.city.coord.lat, data.city.coord.lon, data.city.name);
		 	}).fail(function(err){
		 		if(err.status==404){
		 			alert("Вы ввели не правельный город");
		 		}
		 		else if(err.status==400){
		 			alert("bad request");
		 		}		 	
		 	});
	 	}else{
	 		alert("Не все поля заполнены");
	 	}
	});	
});
