$(document).ready(function () {

	$("#compose").click(function(){ 
		$("#blank-email").fadeIn();
	});


	$("#trash").click(function(){
		$("#blank-email").hide();
	});

	var Myfuncion2= function(){$(this).prop("selected", true)};
	$(".checked").click(Myfuncion2);

	$("#emails li").click(function(){
		$("#emails li").hide();
 	 	$(this).show();
	 });


	$(".back").click(function(){
				$("#emails li").show();
	});

	$("#inbox").click(function(){
		$("#emails li").show();
	});

	var Myfuncion= function(event){
		$(this).css("background-color", "#DB4A38");
		event.stopPropagation();
	};

	$(".checked").click(Myfuncion);
	

	// var estrella= function(event){
	// 	$(this).css("color", "#F4D26D");
	// 	event.stopPropagation();
	// };
	
	

	// var Estrella= function(){$(this).prop("selected", true)};
	// $(".starred").click(Estrella);
	// });

	// $(".starred").click(Estrella);


$(".starred").click(function(){
	$(this).css("color", "#F4D26D");
	event.stopPropagation();
})
// var myData=$("#new_email").serialize();

// 	$("#send").click(function(){
// 			$.ajax({
// 			url: "https://vast-earth-2490.herokuapp.com/email",
// 			type: "post",
// 			data: "#new_email"
// 			success: mySuccessFunction,
// 			error: myErrorFunction,
// 			complete: myCompleteFunction
// 			})
// 	});





	// var funcionestrella= function(){$(this).css("background-color", "#F4D26D")};
	// $(".starred").click(funcionestrella);
	// });


	// var Myfuncion3= function(){$(this).css("background-color", "#d3d3d3")};
	// $("#emails li").mousenter(Myfuncion3);
	// });

	// var Myfuncion4= function(){$}
	// $("#select-all").click(Myfuncion3);

	



});
