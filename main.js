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
var days = ["Вс","Пн","Вт","Ср","Чт","Пт","Сб"];
$(document).ready(function(){
    $(".submit").click(function(){
        $('.day').remove();
        $('.item').remove();
        var city = $("#search").val();
        if(city){
        $.ajax({
            url:'http://api.openweathermap.org/data/2.5/forecast?q=' + city +
            "&appid=e6980ce720b2ebbb8d9d1d9a24796c41",
            type:"GET",
        }).done(function(data){
            var old = parseTime(data.list[0].dt,"delta_time");
            //  console.log(old)
            for(i in data.list){
                if(parseTime(data.list[i].dt,"delta_time") != old){
                //  console.log(parseTime(data.list[i].dt));
                    var day = $('.template').clone();
                    day.removeClass('template');
                    day.addClass('day');
                    day.html(days[parseTime(data.list[i].dt,"day")]);
                    day.attr('data-id',parseTime(data.list[i].dt,"delta_time"));
                    $('.days').append(day);
                    old = parseTime(data.list[i].dt,"delta_time");
                }
            }

            $('.day').click(function(){
                $('.item').remove();
                var id = $(this).attr('data-id');
                for(i in data.list){
                    if(id == parseTime(data.list[i].dt,"delta_time")){
                        var item = $('.item_template').clone();
                        item.removeClass('item_template');
                        item.addClass('item');
                        item.find('.time').html(data.list[i].dt_txt);
                        item.find('img').attr('src','https://openweathermap.org/img/w/'+data.list[i].weather[0].icon+'.png');
                        item.find('.pressure').html(Math.ceil(data.list[i].main.pressure*0.00750063755419211*100));
                        item.find('.humidity').html(data.list[i].main.humidity);
                        item.find('.temp').html(Math.floor(data.list[i].main.temp-273));
                        $('.container').append(item);
                    }
                }
            })
        initMap(data.city.coord.lat, data.city.coord.lon, data.city.name);
        }).fail(function(err){
            if(err.status==404){
                alert("Вы ввели не правельный город");
            }
            else if(err.status==400){
                alert("bad request");
            }    
        });
    }
    else{
        alert("Не все поля заполнены");
    }
    }); 
});


function parseTime(dt,status){
    switch(status){
        case "delta_time":
            var day = new Date(dt*1000).getDate();
            var month = new Date(dt*1000).getMonth();
            console.log(day + "-" + month)
            return day + "-" + month; 
        break;

        case "day":
            console.log(new Date(dt*1000).getDay())
            return day = new Date(dt*1000).getDay();
        break;
    }
}