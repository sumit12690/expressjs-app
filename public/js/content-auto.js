function showEditAutoBox() {
    $("#editAutoDetails").fadeToggle();
}
function editAutoCity(city_name, min_count, max_count, id) {
    $("#cityName").val(city_name);
    $("#min_count").val(min_count);
    $("#max_count").val(max_count);
    $("#cityId").val(id);
    $("#addUpdateAutoCity").attr('action', '/content/edit-city-data');
    $("#editLocalTable").fadeIn();
}
$('.addCity').click(function () {
    $("#cityName").val("");
    $("#min_count").val("");
    $("#max_count").val("");
    $("#cityId").val("");
    $("#addUpdateAutoCity").attr('action', '/content/add-auto-city');
    $("#editLocalTable").fadeIn();
});
function deleteAutoCity(cname, cityId) {
    $.confirm({
		title: 'Alert!',
		content: "Are you sure want to delete " + cname+" ?",
		type: 'yellow',
		theme: 'material',
		typeAnimated: true,
		buttons: {
			"Delete Now": {
				btnClass: 'btn-danger',
				action: function () {
                    $("#delCityId").val(cityId);
                    $("#delCityName").val(cname);
                    if ($("#delCityId").val() != '' && $("#delCityName").val() != '')
                        $("#deleteAutoCity").submit();
				}
			},
			cancel: {
				btnClass: 'btn-success'
			}
		}
	});
}
function toggleAutoTable() {
    $("#editLocalTable").fadeToggle();
}
$('.addUpdateAuto').click(function () {
    var cityname = $("#cityName").val();
    var min_count = parseInt($("#min_count").val());
    var max_count = parseInt($("#max_count").val());
    if (cityname == "") {
        $.alert({
            title: 'Oops!',
            type: 'red',
            content: 'Please Enter City name',
        });
        return;
    }
    if (isNaN(min_count) || isNaN(max_count)) {
        $.alert({
            title: 'Oops!',
            type: 'red',
            content: 'Min and Max count must be number',
        });
        return;
    }
    if (min_count <= 0) {
        $.alert({
            title: 'Oops!',
            type: 'red',
            content: 'Please Enter Min Count greater than 0',
        });
        return;
    }
    if (max_count <= 0) {
        $.alert({
            title: 'Oops!',
            type: 'red',
            content: 'Please Enter Max Count greater than 0',
        });
        return;
    }
    if (max_count < min_count) {
        $.alert({
            title: 'Oops!',
            type: 'red',
            content: 'Please Enter Max Count greater than Min Count',
        });
        return;
    }
    $("#addUpdateAutoCity").submit();
});