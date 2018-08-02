/**
 * Created by gaurav umrani on 11/10/17.
 */
var loc_add = 1; //to add loaclities fields by click on plus button page /content/add-flyer-city
var mobile_reg = /^[7-9][0-9]{9}$/;

function deletelocality(loc_id, lname, cname) {
	$.confirm({
		title: 'Delete!',
		content: 'Are you sure want to delete locality ' + lname,
		theme: 'material',
		buttons: {
			Yes: {
				btnClass: 'btn-danger',
				action: function () {
					$('#delLoc').val(loc_id);
					$('#lnameDel').val(lname);
					$('#cname').val(cname);
					$("#delLocForm").submit();
				}
			},
			No: {
				btnClass: 'btn-success',
				keys: ['enter', 'esc'],
			},
		}
	});
}
function showLocalityBox(cityid, cityname) {
	$('#locId').val("");
	$('#cityid').val(cityid);
	$('#cityname').val(cityname);
	$('#action_type').val("add");
	$('#lname').val("");
	$('#min_count').val("");
	$('#max_count').val("");
	$('#a2').val("");
	$('#a3').val("");
	$('#a4').val("");
	$('#a4s').val("");
	$('#a5').val("");
	$('#a5s').val("");
	$(".edit-city").hide();
	$("#editLocalTable").fadeToggle();
}
function editLocality(cityname, cityid, id, lname, mincount, maxcount, a2, a3, a4, a4s, a5, a5s) {
	$('#locId').val(id);
	$('#cityname').val(cityname);
	$('#action_type').val("update");
	$('#cityid').val(cityid);
	$('#lname').val(lname);
	$('#min_count').val(mincount);
	$('#max_count').val(maxcount);
	$('#a2').val(a2);
	$('#a3').val(a3);
	$('#a4').val(a4);
	$('#a4s').val(a4s);
	$('#a5').val(a5);
	$('#a5s').val(a5s);
	$(".edit-city").hide();
	$("#editLocalTable").fadeIn();
}
function deleteCity(id, cname) {
	$.confirm({
		title: 'Alert!',
		content: "Are you sure want to delete " + cname + "\nIt will delete all localities and other information",
		type: 'yellow',
		theme: 'material',
		typeAnimated: true,
		buttons: {
			"Delete Now": {
				btnClass: 'btn-danger',
				action: function () {
					$("#delCityId").val(id);
					$("#delCityName").val(cname);
					$("#delCityForm").submit();
				}
			},
			cancel: {
				btnClass: 'btn-success'
			}
		}
	});
}
function showEditBox() {
	$(".edit-city").fadeToggle();
	$("#editLocalTable").hide();
}
$('.addLocal').click(function () {
	var id = $('#cityid').val();
	var type = $('#action_type').val();
	var cityname = $('#cityname').val();
	var locId = $('#locId').val();
	var lname = $('#lname').val();
	var min_count = $('#min_count').val();
	var max_count = $('#max_count').val();
	var a2 = $('#a2').val();
	var a3 = $('#a3').val();
	var a4 = $('#a4').val();
	var a4s = $('#a4s').val();
	var a5 = $('#a5').val();
	var a5s = $('#a5s').val();
	var data_string = "?lname=" + lname + "&cname=" + cityname + "&min_count=" + min_count + "&max_count=" + max_count + "&a2=" + a2 + "&a3=" + a3 + "&a4=" + a4 + "&a4s=" + a4s + "&a5=" + a5 + "&a5s=" + a5s + "&type=" + type + "&id=" + id + "&locId=" + locId;
	$("#addUpdateForm").attr('action', '/content/addUpdate-flyerLocality' + data_string);
	$("#addUpdateForm").submit();
});
$('.app-locality').click(function () {
	if (loc_add < 5) {
		loc_add++;
		$('.add-locality-app').after("<tr class='appLoc" + loc_add + "'><td><input type='text' name='lname_add[]'></td><td><input type='number' name='min_count_add[]'></td><td><input type='number' name='max_count_add[]'></td><td><input type='number' name='a2_add[]'></td><td><input type='number' name='a3_add[]'></td><td><input type='number' name='a4_add[]'></td><td> <input type='number' name='a4s_add[]'></td><td><input type='number' name='a5_add[]'></td><td><input type='number' name='a5s_add[]'></td><td><button type='button' onclick='remLocalityApp(" + loc_add + ")' class='btn btn-danger btn-sm app-remlocality'><i class='fa fa-minus'></i></button></td></tr>");

	} else {
		$.alert({
			title: 'Oops!',
			type: 'red',
			content: 'You cannot add more than 5 localities at same time!',
		});
	}
});
function remLocalityApp(i) {
	if (loc_add >= 0) {
		$('.appLoc' + i).remove();
		loc_add--;
	}
}
$('.add-save-city').click(function () {
	let datatosend = {};
	if ($("#cname_add").val() == "") {
		$.alert({
			title: 'Oops!',
			type: 'red',
			content: 'Please enter city name!',
		});
		return;
	}
	datatosend.cname = $("#cname_add").val();
	if ($("#comm_price_add").val() == "") {
		$.alert({
			title: 'Oops!',
			type: 'red',
			content: 'Please enter adecity charges!',
		});
		return;
	}
	datatosend.comm_price = parseFloat($("#comm_price_add").val());
	if ($("#c_designprice_add").val() == "") {
		$.alert({
			title: 'Oops!',
			type: 'red',
			content: 'Please enter design price!',
		});
		return;
	}
	datatosend.c_designprice = parseFloat($("#c_designprice_add").val());
	if ($("#logistic_add").val() == "") {
		$.alert({
			title: 'Oops!',
			type: 'red',
			content: 'Please enter logistic price!',
		});
		return;
	}
	datatosend.logistic = parseFloat($("#logistic_add").val());
	var locality = [];
	var locality_name = $("input[name='lname_add[]']").map(function () { return $(this).val(); }).get();
	for (var i = 0; i < locality_name.length; i++) {
		var ob = {};
		ob.lname = locality_name[i];
		ob.min_count = parseFloat($("input[name='min_count_add[]']").map(function () { return $(this).val(); }).get()[i]);
		ob.max_count = parseFloat($("input[name='max_count_add[]']").map(function () { return $(this).val(); }).get()[i]);
		ob.a2_insertioncost = parseFloat($("input[name='a2_add[]']").map(function () { return $(this).val(); }).get()[i]);
		ob.a3_insertioncost = parseFloat($("input[name='a3_add[]']").map(function () { return $(this).val(); }).get()[i]);
		ob.a4_insertioncost = parseFloat($("input[name='a4_add[]']").map(function () { return $(this).val(); }).get()[i]);
		ob.a4s_insertioncost = parseFloat($("input[name='a4s_add[]']").map(function () { return $(this).val(); }).get()[i]);
		ob.a5_insertioncost = parseFloat($("input[name='a5_add[]']").map(function () { return $(this).val(); }).get()[i]);
		ob.a5s_insertioncost = parseFloat($("input[name='a5s_add[]']").map(function () { return $(this).val(); }).get()[i]);
		locality.push(ob);
	}
	for (var i = 0; i < locality.length; i++) {
		if (locality[i].lname == "") {
			$.alert({
				title: 'Oops!',
				type: 'red',
				content: 'Please enter locality name!',
			});
			return;
		}
		if (locality[i].min_count <= 0) {
			$.alert({
				title: 'Oops!',
				type: 'red',
				content: 'Please enter locality min count!',
			});
			return;
		}
		if (locality[i].max_count <= 0) {
			$.alert({
				title: 'Oops!',
				type: 'red',
				content: 'Please enter locality max count!',
			});
			return;
		}
		if (locality[i].a2_insertioncost <= 0) {
			$.alert({
				title: 'Oops!',
				type: 'red',
				content: 'Please enter locality A2 price!',
			});
			return;
		}
		if (locality[i].a3_insertioncost <= 0) {
			$.alert({
				title: 'Oops!',
				type: 'red',
				content: 'Please enter locality A3 price!',
			});
			return;
		}
		if (locality[i].a4_insertioncost <= 0) {
			$.alert({
				title: 'Oops!',
				type: 'red',
				content: 'Please enter locality A4 price!',
			});
			return;
		}
		if (locality[i].a4s_insertioncost <= 0) {
			$.alert({
				title: 'Oops!',
				type: 'red',
				content: 'Please enter locality A4s price!',
			});
			return;
		}
		if (locality[i].a5_insertioncost <= 0) {
			$.alert({
				title: 'Oops!',
				type: 'red',
				content: 'Please enter locality A5 price!',
			});
			return;
		}
		if (locality[i].a5s_insertioncost <= 0) {
			$.alert({
				title: 'Oops!',
				type: 'red',
				content: 'Please enter locality A5s price!',
			});
			return;
		}
	}
	datatosend.locality = locality;
	$.ajax({
		url: '/content/add-flyer-city',
		data: JSON.stringify({ citydata: datatosend }),
		type: "POST",
		contentType: "application/json; charset=utf-8",
		success: function (data) {
			if (data.success) {
				window.location.href = "/content/flyer-cities?added=true&city=" + datatosend.cname + "&msg=" + datatosend.cname + " saved successfully";
			} else {
				$.alert({
					title: 'Error!',
					content: data.msg,
				});
			}
		}
	});

});

// $(document).on('click','',function () {
// 	$('tr.add-locality-app :last').remove();
// });
