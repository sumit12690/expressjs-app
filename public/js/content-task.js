$(document).ready(function () {
    $('.task_start').datetimepicker({ minDate: moment(), });
    $('.task_end').datetimepicker({ minDate: moment(), });
    $("#selectAllUsers").click(function () {
        $('input:checkbox').not(this).not($("#isAllUsers")).prop('checked', this.checked);
    });
    $('body').keyup(function (e) {  //Binding to body (it accepts key events)
        if (isImageOpen && e.which == 27) {
            isImageOpen = false;
            $("#imageDiv").hide();
        }
        if (isImageOpen && e.which == 39) {
            goToImage("next");

        }
        if (isImageOpen && e.which == 37) {
            goToImage("prev");
        }
    });
});
var imageIndex = 0;
var totalImages = 0;
var isImageOpen = false;
if (getUrlParameter('task') == 'true') {
    $.confirm({
        title: 'Success!',
        content: getUrlParameter('msg'),
        type: 'green',
        typeAnimated: true,
        buttons: {
            OK: {
                btnClass: 'btn-success',
                action: function () {
                    history.pushState(null, "", location.href.split("?")[0]);
                }
            }
        }
    });
}
if (getUrlParameter('task') == 'false') {
    $.confirm({
        title: 'Error!',
        content: getUrlParameter('msg'),
        type: 'red',
        typeAnimated: true,
        buttons: {
            OK: {
                btnClass: 'btn-danger',
                action: function () {
                    history.pushState(null, "", location.href.split("?")[0]);
                }
            }
        }
    });
}

function openImage(imagedata, index, total_images) {
    isImageOpen = true;
    var imageData = JSON.parse(imagedata);
    imageIndex = index;
    totalImages = total_images;
    $("#imageDiv").show();
    $("#imageSrc").attr('src', imageData.images.path);
    $("#imageId").val(imageData.images._id);
    $("#takenAt").text(imageData.images.address || 'Address Not Avaiable');
    //var geocoder = new google.maps.Geocoder;
    getImageStatus(imageData.images._id);
    getTimeandUser(imageData.images.time, imageData.images.takenBy);
    // geocodeLatLng(geocoder, imageData.lat, imageData.lng);
}
function getNames(name) {
    if (name.length > 1) {
        $.ajax({
            type: 'POST',
            url: '/task/search-user',
            data: 'name=' + name,
            success: function (data) {
                $(".suggestName").show();
                $(".mainmenu").html("");
                if (!data.length) {
                    $(".mainmenu").append("<li><a href='javascript:void(0)'>No User Found</a></li>");
                    return;
                }
                for (var i = 0; i < data.length; i++) {
                    var email = "";
                    if (data[i].local) {
                        email = data[i].local.email;
                    }
                    if (data[i].google) {
                        email = data[i].google.email;
                    }
                    if (data[i].facebook) {
                        email = data[i].facebook.email;
                    }
                    $(".mainmenu").append("<li><a href='javascript:void(0)' onclick=\"assignUser('" + data[i]._id + "','" + data[i].disp_name + "')\">" + data[i].disp_name + " ( " + email + " ) " + "</a></li>");
                }
            }
        });
    } else {
        $(".mainmenu").html("");
        $(".suggestName").hide();
    }
}
function assignUser(user_id, name) {
    $(".mainmenu").html("");
    $(".suggestName").hide();
    var global_task_id = $("#global_task_id").val();
    $.ajax({
        type: 'POST',
        url: '/task/assign-user',
        data: 'global_task_id=' + global_task_id + '&user_id=' + user_id,
        success: function (data) {
            alert(data.msg);
            if (data.success) {
                window.location.reload();
            }
            $("#userName").val("");

        }
    });
}
function getLocalities(val) {
    var city_id = val;
    if (val == "0") return;
    $.ajax({
        type: 'POST',
        url: '/api/get-locality',
        data: 'city_id=' + city_id,
        success: function (data) {
            if (data.success) {
                console.log(data);
                $(".chosen-select").chosen("destroy");
                $("#user_locality").html("");
                for (var j = 0; j < data.all_groups.length; j++) {
                    // console.log(data.all_groups[j])
                    $("#user_locality").append("<option value='" + data.all_groups[j].name + " cluster__" + "'>" + data.all_groups[j].name + "(Admin Group)" + "</option>");
                }
                for (var i = 0; i < data.data.length; i++) {
                    $("#user_locality").append("<option value='" + data.data[i].name + "'>" + data.data[i].name + "</option>");
                }
                $(".chosen-select").chosen();
            } else {
                alert(data.msg);
                $(".chosen-select").chosen("destroy");
            }
        }
    });
}
function changeStatus(val, id, global_task_id) {
    if (val == "0") return;
    $.ajax({
        type: 'POST',
        url: '/task/changeStatus',
        data: 'global_task_id=' + global_task_id + '&imageid=' + id + "&val=" + val,
        success: function (data) {
            $(this).blur();
            window.location.reload();
        }
    });
}
function changeTaskStatus(task_id, user_id, status, global_task_id) {
    if (status == '0') return;
    $.ajax({
        type: 'POST',
        url: '/task/change-task-status',
        data: 'task_id=' + task_id + '&user_id=' + user_id + "&status=" + status,
        success: function (data) {
            if (data.success) {
                window.location.href = "/task/per-user-task?id=" + global_task_id + "&task=true&msg=" + data.msg
            } else {
                window.location.href = "/task/per-user-task?id=" + global_task_id + "&task=false&msg=" + data.msg
            }
        }
    });
}

/* function geocodeLatLng(geocoder, lati, lngi) {
    $("#takenAt").text("Loading Address...");
    setTimeout(function () {
        var latlng = { lat: parseFloat(lati), lng: parseFloat(lngi) };
        geocoder.geocode({ 'location': latlng }, function (results, status) {
            if (status === 'OK') {
                if (results[0]) {
                    $("#takenAt").text(results[0].formatted_address);
                } else {
                    window.alert('No results found');
                }
            } else {
                alert('Geocoder failed due to: ' + status);
                $("#takenAt").text("Cannot find address");

            }
        });
    }, 1000)
} */
function getTimeandUser(time, userid) {
    $.ajax({
        type: 'POST',
        url: '/task/getTimeUser',
        data: { time: time, userid: userid },
        success: function (data) {
            $("#takenOn").text(data.time);
            $("#takenBy").text(data.mobile);
        }
    });
}
function getImageStatus(image_id) {
    $.ajax({
        type: 'POST',
        url: '/task/getImageStatus',
        data: 'image_id=' + image_id,
        success: function (isApproved) {
            if (isApproved == "true") {
                $("#appYes").prop('checked', true);
                $("#appNo").removeProp('checked');
            } else if (isApproved == "false") {
                $("#appNo").prop('checked', true);
                $("#appYes").removeProp('checked');
            }
        }
    });
}
function checkTaskType(type) {
    (type == "image upload") ? $("#imageToUploadDiv").show() : $("#imageToUploadDiv").hide();
}
function usersToPicked(val) {
    (val == "0") ? $("#allUsersDiv").hide() : $("#allUsersDiv").show();
}
$("#isAllUsers").change(function () {
    if ($(this).is(":checked")) {
        addUsers();
    }
    $("#selectAllUsers").prop('checked', false);
});
function getJobType(userType) {
    var user_type = userType;
    $.ajax({
        type: 'POST',
        url: '/data/get-jobs',
        data: { "user_type": user_type },
        success: function (data) {
            $("#jobType1").html("");
            $("#jobType2").html("");
            if (data.success) {
                $("#jobType1").append("<option value='0'>Select Job Type</option>");
                $("#jobType2").append("<option value='0'>Select Job Type</option>");
                for (var i = 0; i < data.data.length; i++) {
                    $("#jobType1").append("<option value='" + data.data[i] + "'>" + data.data[i] + "</option>");
                    $("#jobType2").append("<option value='" + data.data[i] + "'>" + data.data[i] + "</option>");
                }
            } else {
                $("#jobType1").append("<option value='0'>No Job type found for " + user_type + "</option>");
                $("#jobType2").append("<option value='0'>No Job type found for " + user_type + "</option>");
            }
        }
    });
}
function getJobMedia() {
    var user_type = $("#user_type").val();
    var job_type = $("#jobType2").val();
    if (user_type == "0" || job_type == "0") return;
    console.log(user_type)
    console.log(job_type)
    $.ajax({
        type: 'POST',
        url: '/data/get-job-types',
        data: { "user_type": user_type, "job_type": job_type },
        success: function (data) {
            $("#jobMedia").html("");
            $("#jobCompany").html("");
            if (data.success) {
                $("#jobMedia").append("<option value='0'>Select Job Media</option>");
                $("#jobCompany").append("<option value='0'>Select Job Company</option>");
                for (var i = 0; i < data.media.length; i++) {
                    $("#jobMedia").append("<option value='" + data.media[i].media_name + "'>" + data.media[i].media_name + "</option>");
                }
                for (var j = 0; j < data.company.length; j++) {
                    $("#jobCompany").append("<option value='" + data.company[j].company_name + "'>" + data.company[j].company_name + "</option>");
                }
            } else {
                $("#jobMedia").append("<option value='0'>No Job Media found for " + job_type + "</option>");
                $("#jobCompany").append("<option value='0'>No Job Company found for " + job_type + "</option>");

            }
        }
    });
}
function filterResults() {
    var query = {
        user_type: $("#user_type").val(),
        user_city: $("#user_city").val(),
        user_locality: $("#user_locality").val(),
        job_type: $("#jobType2").val(),
        job_media: $("#jobMedia").val(),
        job_company: $("#jobCompany").val(),
    };
    $.ajax({
        type: 'POST',
        url: '/task/get-user-by-city',
        data: query,
        success: function (data) {
            if (data.success) {
                //show modal
                $(".allUsers").html("");
                for (var i = 0; i < data.result.length; i++) {
                    $(".allUsers").append("<li class='list-group-item'><input id='user" + i + "' name='users' type='checkbox' value='" + data.result[i]._id + "'><label style='padding-right:200px;cursor:pointer' for='user" + i + "'> &nbsp; " + data.result[i].name + "(" + data.result[i].mobile + ")" + "</label></li>");
                }
            } else {
                alert(data.msg);
            }
        }
    });
}
function resetFilter() {
    $("#jobType2").val("0");
    $("#jobMedia").val("0");
    $("#jobCompany").val("0");
    filterResults();
}
function addUsers() {
    var user_type = $("#user_type").val();
    var user_city = $("#user_city").val();
    var user_locality = $("#user_locality").val();
    if (user_city == "0" || user_type == "0") {
        alert('Please chooe User type and user city');
        $("#isAllUsers").prop('checked', false);
        return false;
    } else {
        $.ajax({
            type: 'POST',
            url: '/task/get-user-by-city',
            data: { "user_type": user_type, "user_city": user_city, "user_locality": user_locality },
            success: function (data) {
                if (data.success) {
                    //show modal
                    $(".allUsers").html("");
                    $('#myModal').modal('show')
                    for (var i = 0; i < data.result.length; i++) {
                        $(".allUsers").append("<li class='list-group-item'><input id='user" + i + "' name='users' type='checkbox' value='" + data.result[i]._id + "'><label style='padding-right:200px;cursor:pointer' for='user" + i + "'> &nbsp; " + data.result[i].name + "(" + data.result[i].mobile + ")" + "</label></li>");
                    }
                } else {
                    $(".allUsers").html("");
                    $("#isAllUsers").prop('checked', false);
                    alert(data.msg)
                }
            }
        });
    }
}
function getAppUserNames(name, index, global_task_id, existing_user_id) {
    if (name.length > 1) {
        $.ajax({
            type: 'POST',
            url: '/task/search-app-user',
            data: 'name=' + name,
            success: function (data) {
                $(".suggestName." + index).show();
                $(".mainmenu." + index).html("");
                if (!data.length) {
                    $(".mainmenu." + index).append("<li><a href='javascript:void(0)'>No User Found</a></li>");
                    return;
                }
                for (var i = 0; i < data.length; i++) {
                    $(".mainmenu." + index).append("<li><a href='javascript:void(0)' onclick=\"assignAppUser('" + data[i]._id + "','" + global_task_id + "'," + index + ",'" + existing_user_id + "')\">" + data[i].name + " ( " + data[i].mobile + " ) " + "</a></li>");
                }
            }
        });
    } else {
        $(".mainmenu." + index).html("");
        $(".suggestName." + index).hide();
    }
}
function closeDropdown(index) {
    $(".mainmenu." + index).html("");
    $(".suggestName." + index).hide();
}
function assignAppUser(app_user_id, global_task_id, index, existing_user_id) {
    $(".mainmenu." + index).html("");
    $(".suggestName." + index).hide();
    $.ajax({
        type: 'POST',
        url: '/task/assign-task-appuser',
        data: 'global_task_id=' + global_task_id + '&app_user_id=' + app_user_id + "&existing_user_id=" + existing_user_id,
        success: function (data) {
            alert(data.msg);
            if (data.success) {
                window.location.href = "/task/per-user-task?id=" + global_task_id;
            }
        }
    });
}
function removeAssignedTask(adecity_user_id, global_task_id) { // 
    $.ajax({
        type: 'POST',
        url: '/task/remove-task-adecity-user',
        data: 'global_task_id=' + global_task_id + '&adecity_user_id=' + adecity_user_id,
        success: function (data) {
            alert(data.msg);
            if (data.success) window.location.reload();
        }
    });
}
function goToImage(type) {
    if (type == "prev") {
        $(".ad-prev-icon").addClass("disabledArrows")
        setTimeout(function () {
            $(".ad-prev-icon").removeClass("disabledArrows")
        }, 2000);
        if (parseInt(imageIndex) > 0) {
            $("#ImageElement" + parseInt(imageIndex - 1)).click();
        }
    } else {
        $(".ad-next-icon").addClass("disabledArrows");
        setTimeout(function () {
            $(".ad-next-icon").removeClass("disabledArrows");
        }, 2000);
        if (parseInt(totalImages) > (parseInt(imageIndex) + 1)) {
            $("#ImageElement" + (parseInt(imageIndex) + 1)).click();
        }
    }
}