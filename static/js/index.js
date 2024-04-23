document.querySelector("html").classList.add('js');


let fileInput  = document.getElementById("my-file")
let uploaded_block  = document.getElementById("uploaded-block")
let upload_block  = document.getElementById("upload-block")
let remove_file  = document.getElementById("remove-file")
let file_name  = document.getElementById("file-name")
let porcion1_c  = document.getElementById("porcion1-c")
let donut_chart  = document.getElementById("donut-chart")
let cover_spin  = document.getElementById("cover-spin")
let switch_button  = document.getElementsByClassName("switch-button")
let ctx2 = document.getElementById('myDoubleBarChart').getContext('2d');
let myLineChart_list = document.getElementsByClassName('lineChart');
let chart_row_list = document.getElementsByClassName('chart-row-wrapper')

const myPieChart_list = document.getElementsByClassName('myPieChart');
let checkbox_list  = document.getElementsByClassName("check-input")

let thread_id = 0

data={
  "Fashion": {
      "date": [
        1601856000000000000, 1602288000000000000, 1603843200000000000, 1603929600000000000, 
        1604275200000000000, 1604793600000000000, 1604966400000000000, 1605052800000000000, 
        1605139200000000000, 1605225600000000000, 1605312000000000000, 1606003200000000000, 
        1606435200000000000, 1606608000000000000, 1606953600000000000, 1607558400000000000, 
        1609459200000000000, 1609891200000000000, 1610236800000000000, 1610409600000000000, 
        1610928000000000000, 1611100800000000000, 1611446400000000000, 1611619200000000000, 
        1611878400000000000, 1612051200000000000, 1612656000000000000, 1612828800000000000],
      "neg": [
        342, 876, 551, 132, 34, 308, 127, 450, 781, 883, 880, 663, 515, 582, 
        654, 59, 559, 491, 791, 879, 405, 838, 106, 351, 686, 536, 900, 244],
      "pos": [
        805, 172, 492, 714, 636, 761, 334, 894, 252, 283, 921, 103, 241, 480, 
        947, 613, 455, 77, 935, 589, 350, 962, 120, 66, 568, 298, 14, 446]
  },
  "Film": {
    "date": [
      1601856000000000000, 1602288000000000000, 1603843200000000000, 1603929600000000000, 
      1604275200000000000, 1604793600000000000, 1604966400000000000, 1605052800000000000, 
      1605139200000000000, 1605225600000000000, 1605312000000000000, 1606003200000000000, 
      1606435200000000000, 1606608000000000000, 1606953600000000000, 1607558400000000000, 
      1609459200000000000, 1609891200000000000, 1610236800000000000, 1610409600000000000, 
      1610928000000000000, 1611100800000000000, 1611446400000000000, 1611619200000000000, 
      1611878400000000000, 1612051200000000000, 1612656000000000000, 1612828800000000000],
    "neg": [
      471, 871, 668, 635, 409, 323, 501, 6, 802, 874, 467, 658, 921, 228, 
      835, 445, 260, 992, 896, 676, 545, 813, 795, 554, 525, 198, 587, 138],
    "pos": [
      386, 721, 4, 829, 969, 268, 51, 395, 484, 737, 274, 815, 632, 244, 
      883, 351, 759, 663, 82, 767, 18, 726, 523, 445, 442, 463, 484, 510]
},
  "Food": {
      "date": [
        1601856000000000000, 1602288000000000000, 1603843200000000000, 1603929600000000000, 
        1604275200000000000, 1604793600000000000, 1604966400000000000, 1605052800000000000, 
        1605139200000000000, 1605225600000000000, 1605312000000000000, 1606003200000000000, 
        1606435200000000000, 1606608000000000000, 1606953600000000000, 1607558400000000000, 
        1609459200000000000, 1609891200000000000, 1610236800000000000, 1610409600000000000, 
        1610928000000000000, 1611100800000000000, 1611446400000000000, 1611619200000000000, 
        1611878400000000000, 1612051200000000000, 1612656000000000000, 1612828800000000000],
      "neg": [
        611, 737, 262, 131, 142, 801, 481, 120, 991, 267, 104, 225, 378, 630, 
        210, 930, 253, 158, 719, 708, 272, 697, 992, 183, 999, 381, 161, 587],
      "pos": [
        747, 654, 873, 157, 353, 596, 161, 915, 148, 729, 258, 244, 92, 763, 
        494, 432, 378, 924, 432, 492, 333, 140, 932, 996, 627, 160, 787, 122]
  }
}
myPieChart_obj = {}
Array.from(myPieChart_list).forEach(function myFunction(item, i) {
  let type = item.getAttribute("name")
  let pieChart_food = new Chart(item.getContext('2d'), {
    type: 'pie',
    data: {
      labels: ['positive', 'negative'],
      datasets: [{
        data: [],
        backgroundColor: ['green', 'red']
      }]
    }
  });
  myPieChart_obj[type] = pieChart_food
  pieChart_food.update()
})


function imshowChart(type){
  let chart_row = Array.from(chart_row_list).find((element) => element.getAttribute('name') == type);

    
  if (chart_row.classList.contains('hidden')) {
    chart_row.classList.remove('hidden');
    setTimeout(function () {
      chart_row.classList.remove('visuallyhidden');
    },10);
  } else {
  
    chart_row.classList.add('visuallyhidden');    
    chart_row.addEventListener('transitionend', function(e) {
      chart_row.classList.add('hidden');
    }, {
      capture: false,
      once: true,
      passive: false
    });
  }
}
Array.from(checkbox_list).forEach(function myFunction(item, i) {
  item.addEventListener('change', function (event) {
    let type = item.getAttribute('name');
    imshowChart(type)

  })
})

obj = {
  'Food':'lineChart1',
  'Fashion':'lineChart2',
  'Film':'lineChart3',
}
let MyLineChart_obj = {}
function init_lineChart(){
  for (const [key, value] of Object.entries(obj)) {
    MyLineChart_obj[key] = create_lineChart(data[key],value)
  }
}
init_lineChart()


let checkbox_enabled = function(new_type) {
  Array.from(checkbox_list).forEach(function(element,i){
    type = element.getAttribute('name')
    let chart_row = Array.from(chart_row_list).find((element) => element.getAttribute('name') == type);

    if (new_type.includes(type)) {
      element.disabled = false
      element.checked=true

      element.parentElement.parentElement.style.opacity = 1
      imshowChart(type)

    } else {
      chart_row.classList.add('hidden');
      chart_row.classList.add('visuallyhidden');
      element.disabled = true
      element.checked=false
      element.parentElement.parentElement.style.opacity = 0.5
    }
  })
}
let doubleBarChart = new Chart(ctx2, {
	type: 'bar',
	data: {
		labels: ["Fashion","Film","Food"],
		datasets: [
			{
				label: 'Positive',
				data: [],
				backgroundColor: 'rgba(75, 192, 192, 0.2)',
				borderColor: 'rgba(75, 192, 192, 1)',
				borderWidth: 1
			},
			{
				label: 'Negative',
				data: [],
				backgroundColor: 'rgba(255, 99, 132, 0.2)',
				borderColor: 'rgba(255, 99, 132, 1)',
				borderWidth: 1
			}
		]
	},


	options: {
		scales: {
			y: {
				beginAtZero: true
			}
		}
	}
});

cover_spin.addEventListener('click', function(){
  checkbox_enabled([])
  document.getElementById("cover-spin").style.display = 'block'
})




function add(accumulator, a) {
  return accumulator + a;
}
var options = {
  weekday: "short",
  year: "numeric",
  month: "2-digit",
  day: "numeric",
};
let check_data = function(data) {  
	new_data_ = {}
	for (const [key, value] of Object.entries(data)) {
    datetime = value["date"].map(function(d) { return new Date(+d/1000000).toLocaleString('vi-VN',options) } )
    value["date"] = datetime
		pos= Array.from(value['pos']).reduce(add, 0)
		neg= Array.from(value['neg']).reduce(add, 0)
		if (pos >0 || neg >0){
			new_data_[key] = {
        "pos":pos,
        "neg":neg,
        'date':value['date'],
        "pos_list":value['pos'],
        "neg_list":value['neg'],}
		}
	  }
	
	return new_data_
}


let active_lineChart = function(new_data,new_type){
  Array.from(myLineChart_list).forEach(function myFunction(item, i) {
		let type = item.getAttribute("name")
		if (new_type.includes(type)){
      MyLineChart_obj[type].series._values[0].data._values = new_data;
      MyLineChart_obj[type].series._values[1].data._values = new_data;
		} 
	  })
  
}


let active_PieChart = function(new_data,new_type) {  
	Array.from(myPieChart_list).forEach(function myFunction(item, i) {
		let type = item.getAttribute("name")
		if (new_type.includes(type)){
      let PieChart=myPieChart_obj[type]
      PieChart.data.datasets[0].data = [new_data[type]["pos"], new_data[type]["neg"]];
      PieChart.update();
		} 
    
	  })

		
}


let active_doubleBarChart = function(new_data,new_type) {  
	doubleBarChart.data.labels = new_type
	doubleBarChart.data.datasets[0].data = Object.values(new_data).map(value =>  value["pos"])
	doubleBarChart.data.datasets[1].data = Object.values(new_data).map(value =>  value["neg"])
	doubleBarChart.update()

}




let hidden_load = function() {
  document.getElementById("load-animation").style.display="none"
}

function interruptProgress(){
  thread_id+=1
  $.ajax({
    url: `http://127.0.0.1:8000/interrupt?thread_id=${thread_id}`,
    type: 'POST',

  }).done(function() {
      console.log('Success')
    })
    .fail(function() {
      console.log('Failure')
    })
    fileInput.value = ''
}

checkbox_enabled([])
let new_data = check_data(data)
let new_type = Object.keys(new_data)
active_PieChart(new_data,['Fashion','Food','Film'])
active_doubleBarChart(new_data,['Fashion','Food','Film'])
active_lineChart(new_data,['Fashion','Food','Film'])
checkbox_enabled(['Fashion','Food','Film'])

fileInput.addEventListener("change", function( event ) {  
  file_name.innerText = this.value
	let reader = new FileReader();

	reader.readAsDataURL(fileInput.files[0]);
	reader.onload = function () {
    thread_id+=1
	  let fileEncoded = {"file":reader.result,'thread_id':thread_id};
    checkbox_enabled([])
    document.getElementById("cover-spin").style.display = 'block'
	  $.ajax({
			url: "http://127.0.0.1:8000/predict",
			type: 'POST',
			data: JSON.stringify(fileEncoded),
			contentType: 'application/json',
      
		}).done(function(result) {
      if (result['status_code'] == 200){
        let new_data = check_data(result['predict'])
        let new_type = Object.keys(new_data)
        document.getElementById("cover-spin").style.display = 'none'
        console.log(new_data)
        console.log(new_type)
        active_PieChart(new_data, new_type)
        active_doubleBarChart(new_data, new_type)
        active_lineChart(new_data, new_type)
        checkbox_enabled(new_type)
      }
		  })
		  .fail(function() {
			alert( "error" );
		  })
    fileInput.value = ''

	};
  
	reader.onerror = function (error) {
	  console.log('Error: ', error);
	};

});  

remove_file.addEventListener("click", function( event ) {  
  document.getElementById("cover-spin").style.display = 'none'
  interruptProgress()
});  


(function($) { "use strict";

	$(function() {
		var header = $(".start-style");
		$(window).scroll(function() {    
			var scroll = $(window).scrollTop();
		
			if (scroll >= 10) {
				header.removeClass('start-style').addClass("scroll-on");
			} else {
				header.removeClass("scroll-on").addClass('start-style');
			}
		});
	});		
		
	
	$(document).ready(function() {
		$('body.hero-anime').removeClass('hero-anime');
	});

		
	$('body').on('mouseenter mouseleave','.nav-item',function(e){
			if ($(window).width() > 750) {
				var _d=$(e.target).closest('.nav-item');_d.addClass('show');
				setTimeout(function(){
				_d[_d.is(':hover')?'addClass':'removeClass']('show');
				},1);
			}
	});	
	

	
  })(jQuery); 




  function load_data(data){
    let new_data = []
    data['date'].map(function(d,i) {
      new_data.push({
        date:+d/1000000,
        value1: data['pos'][i], 
        value2: data['neg'][i]
      })
    })
    return new_data
  }


  function create_lineChart(data,id){
    let new_data = load_data(data)
    let color_line = {
      'series 1':"#00FF66",
      "series 2":"#FF0000"
    }
    var root = am5.Root.new(id);
  
    
    root.setThemes([
      am5themes_Animated.new(root)
    ]);
  
  
    root.dateFormatter.setAll({
      dateFields: ["valueX"]
    });
  
    var chart = root.container.children.push(am5xy.XYChart.new(root, {
      panX: false,
      panY: false,
      wheelX: "panX",
      wheelY: "zoomX"
    }));
  
    var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
      behavior: "zoomX"
    }));
    cursor.lineY.set("visible", false);
  
  
    var xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
      maxDeviation: 0.5,
      baseInterval: {
        timeUnit: "day",
        count: 1
      },
      renderer: am5xy.AxisRendererX.new(root, {
        pan:"zoom"
      }),
      tooltip: am5.Tooltip.new(root, {})
    }));
  
    var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
      maxDeviation:1,
      renderer: am5xy.AxisRendererY.new(root, {
        pan:"zoom"
      })
    }));
  
   
    function createSeries(name, field) {
      var series = chart.series.push(am5xy.LineSeries.new(root, {
        name: "Series",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: field,
        valueXField: "date",
        tooltip: am5.Tooltip.new(root, {
          labelText: "{valueX}: {valueY}"
        }),
        
      }));
      series.fills.template.setAll({
        visible: true,
        fillOpacity: 0.1,
      });
      
      series.bullets.push(function() {
        return am5.Bullet.new(root, {
          locationY: 0,
          sprite: am5.Circle.new(root, {
            radius: 2,
            stroke: root.interfaceColors.get("background"),
            strokeWidth: 1,
            fill: series.get("fill")
          })
        });
      });
      series.set("fill", am5.color(color_line[name]))
      series.data.setAll(new_data);
      series.appear(1000);
  
    }
  
    chart.set("scrollbarX", am5.Scrollbar.new(root, {
      orientation: "horizontal"
    }));
  
  
    createSeries("series 1",'value1')
    createSeries("series 2",'value2')
  
    chart.appear(1000, 100);
    return chart
  }
  
