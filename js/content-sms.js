var number_add = 1; //to add number fields by click on plus button /content/add-dbs
var mobile_reg = /^[7-9][0-9]{9}$/;
var currentPage = parseInt($("#pageNo").val());
var totalPage = parseInt($("#totalPages").val());
$('#numbers_tags').tagEditor({
    delimiter: ', ', /* space and comma */
	placeholder: 'Enter numbers ...',
	maxLength:10
});
$(document).ready(function () {
	if (currentPage == 1) {
		$(".prevPage").attr('disabled', true);
	}
	if (currentPage == totalPage) {
		$(".nextPage").attr('disabled', true);
	}
});
$(".jumpToPage").keyup(function (e) {
	var pageVal=$(this).val();
	if (e.which == 13) {
		if(pageVal>totalPage){
			$.alert({
				title: 'Oops!',
				content: 'Please Enter Page no less than '+totalPage,
			});
			return;
		}
		$("#pageNo").val(pageVal);
		$("#dbChangeForm").submit();

	}
});
function showEditDBBox() {
	$(".util-but").fadeOut(function () {
		$(".util-text").fadeIn();
	});
}
$(".save-dbName").click(function () {
	var dbname = $("#changeDBName").val();
	var dbid = $("#changeDBId").val();
	var city = $("#changeCity").val();
	
	if (dbname == "") {
		$.alert({
			title: 'Oops!',
			type: 'red',
			content: 'Please enter database name!',
		});
		return;
	}
	if (dbid == "") { //ID is not saving in input hidden field
		$.alert({
			title: 'Oops!',
			content: 'Some Error occured, Please contact developer!',
		});
		return;
	}
	var dataString = "id=" + dbid + "&dbname=" + dbname + "&city=" + city;

	$.ajax({
		url: '/content/edit-name',
		type: "POST",
		data: dataString,
		success: function (data) {
			if (data.success) {
				window.location.href = "/content/all-dbs?updated=true&msg=database name changed successfully&dbId=" + dbid + "&dbname=" + dbname
			} else {
				$.alert({
					title: 'Oops!',
					content: data.msg,
				});
				return;
			}
		}
	});
	$(".util-text").fadeOut(function () {
		$(".util-but").fadeIn();
	});
});
function editDBNumber(oldnum, id) {
	$("#oldnumber").val(oldnum);
	$("#newnumber").val(oldnum);
	$("#editDBId").val(id);
	$('.edit-number').fadeToggle();
}
function saveSingleNumber() {
	if ($("#newnumber").val() == "") {
		$.alert({
			title: 'Oops!',
			content: 'Enter New Number!',
		});
		return;
	}
	if ($("#newnumber").val().length != 10) {
		$.alert({
			title: 'Oops!',
			content: 'Enter Valid 10 digit number!',
		});
		return;
	}
	if ($("#oldnumber").val() == "") {
		$.alert({
			title: 'Oops!',
			content: 'Something error occured,please try again!', //this error because these fields are hidden
		});
		return;
	}
	if ($("#editDBId").val() == "") {
		$.alert({
			title: 'Oops!',
			content: 'Something error occured,please try again!', //this error because these fields are hidden
		});
		return;
	}
	document.getElementById('editSingleForm').submit();
}
function hideEditDBNumber() {
	$('.edit-number').fadeOut();
}
$("#dbChange").change(function () {
	var dbname = $("#dbChange option:selected").text();
	var dbid = $(this).val();
	$("#dbNameChanged").val(dbname);
	$("#dbIdChanged").val(dbid);
	$("#dbChangeForm").submit();
});
$('.app-number').click(function () {
	number_add++;
	//	$('.add-number-tr').after("<tr class='appLoc" + loc_add + "'><td><input type='text' name='lname_add[]'></td><td><input type='number' name='min_count_add[]'></td><td><input type='number' name='max_count_add[]'></td><td><input type='number' name='a2_add[]'></td><td><input type='number' name='a3_add[]'></td><td><input type='number' name='a4_add[]'></td><td> <input type='number' name='a4s_add[]'></td><td><input type='number' name='a5_add[]'></td><td><input type='number' name='a5s_add[]'></td><td><button type='button' onclick='remLocalityApp(" + loc_add + ")' class='btn btn-danger btn-sm app-remlocality'><i class='fa fa-minus'></i></button></td></tr>");
	$('.add-number-tr').after("<tr class='appNum" + number_add + "'><td width='30%'><input type='number' maxlength='10' name='db_numbers' id='numbers'></td><td width='30%'><input type='number' maxlength='10' name='db_numbers' id='numbers'></td><td width='30%'><input type='number' maxlength='10' name='db_numbers' id='numbers'></td><td width='10%'><button type='button' onclick='remNumberApp(" + number_add + ")' class='btn btn-danger btn-sm'><i class='fa fa-minus'></i></button></td>");

});
function remNumberApp(i) {
	if (number_add >= 0) {
		$('.appNum' + i).remove();
		number_add--;
	}
}
$(".save-db").click(function () {
	var dbname = $("#dbname").val();
	var city = $("#city").val();
	var DBid = $("#DBid").val();
	var saveType = $("#saveType").val();
	if (dbname == "") {
		$.alert({
			title: 'Oops!',
			content: 'Please Enter Database name!', //this error because these fields are hidden
		});
		return;
	}
	var db_numbers=$('#numbers_tags').tagEditor('getTags')[0].tags;
	//var db_numbers = $("input[name=db_numbers").map(function () { return $(this).val(); }).get();
	for (var i = 0; i < db_numbers.length; i++) {
		if (db_numbers[i].length != 10) {
			$.alert({
				title: 'Oops!',
				content: 'Please Enter 10 digit Number!', //this error because these fields are hidden
			});
			return;
		}
		if (!mobile_reg.test(db_numbers[i])) {
			$.alert({
				title: 'Oops!',
				content: 'Please Enter valid 10 digit Number!', //this error because these fields are hidden
			});
			return;
		}
	}
	var dataString = {
		dbName: dbname,
		numbers: db_numbers,
		DBid: DBid,
		city : city,
		saveType: saveType
	}
	$.ajax({
		type: "POST",
		url: "/content/save-db",
		data: JSON.stringify(dataString),
		contentType: "application/json; charset=utf-8",
		success: function (data) {
			if (data.success) {
				window.location.href = "/content/all-dbs?added=true&msg=new database saved successfully"
			} else {
				$.alert({
					title: 'Oops!',
					content: data.msg,
				});
				return;
			}
		}
	});


});
function deleteDB() {
	$.confirm({
		title: 'Delete!',
		content: 'Are you sure want to delete Db ' + document.getElementById('deleteDBName').value,
		theme: 'material',
		buttons: {
			Yes: {
				btnClass: 'btn-danger',
				action: function () {
					document.getElementById('deleteDBForm').submit();
				}
			},
			No: {
				btnClass: 'btn-success',
				keys: ['enter', 'esc'],
			},
		}
	});
}
function deleteDBNumber(number) {
	if (number) {
		$("#deleteDBNumber").val(number);
		$.confirm({
			title: 'Delete!',
			content: 'Are you sure want to delete Db number ' + number,
			theme: 'material',
			buttons: {
				Yes: {
					btnClass: 'btn-danger',
					action: function () {
						document.getElementById('deleteDBNumberForm').submit();
					}
				},
				No: {
					btnClass: 'btn-success',
					keys: ['enter', 'esc'],
				},
			}
		});
	} else {
		$.alert({
			title: 'Oops!',
			content: 'Something error occured, try again!',
		});
		return;
	}
}
function goToPage(type) {
	if (currentPage > 0) {
		if (type == 'prev') {
			$("#pageNo").val(currentPage - 1);
			setTimeout(function () {
				$("#dbChangeForm").submit();
			}, 500);
		}
	}
	if (type == 'next') {
		$("#pageNo").val(currentPage + 1);
		setTimeout(function () {
			$("#dbChangeForm").submit();
		}, 500);
	}
}