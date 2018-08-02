(function ($) {
	$.fn.multiInput = function (options) {
		var settings = $.extend({
			// These are the defaults.
			plusBtnClass: "primary",
			minusBtnClass: "default",
			backgroundColor: "white",
			maxInput: 5
		}, options);
		var elemType = $(this).find('input').attr('type') || "";
		if (elemType == 'text') {
			var elemClass = $(this).find('input').attr('class') || "";
			var elemId = $(this).find('input').attr('id') || "";
			var elemName = $(this).find('input').attr('name') || "";
			var count = 1;
			var currentElem = this;
			$(this).find('.input-group').eq(0).append('<span class="input-group-btn"><button type="button" class="btn ' + settings.plusBtnClass + ' add"><span class="glyphicon glyphicon-plus-sign"></span></button></span>').find('.add_field_button');
			$(currentElem).on("click", ".add", function (e) {
				if (count < settings.maxInput) {
					count++;
					$(currentElem).append('<div class="input-group" style="padding-top:15px;"><input class="' + elemClass + '" id="' + elemId + '" type="' + elemType + '" name="' + elemName + '"/><span class="input-group-btn"><button type="button" class=" btn ' + settings.minusBtnClass + ' remove" ><span class="glyphicon glyphicon-minus-sign"></span></button></span></div>');
				}
			});
			$(currentElem).on("click", ".remove", function (e) {
				//user click on remove text
				$(this).parent().parent('.input-group').remove();
				count--;
			});
			return this;
		}
	};
}(jQuery));


// (function ($) {
// 	$.fn.multiInput = function (options) {
// 		var settings = $.extend({
// 			// These are the defaults.
// 			plusBtnClass: "primary",
// 			minusBtnClass: "default",
// 			backgroundColor: "white",
// 			maxInput: 5
// 		}, options);
// 		var elemType = $(this).find('input').attr('type') || "";
// 		if (elemType == 'text') {
// 			var elemClass = $(this).find('input').attr('class') || "";
// 			var elemId = $(this).find('input').attr('id') || "";
// 			var elemName = $(this).find('input').attr('name') || "";
// 			var count = 1;
// 			var currentElem = this;
// 			$(this).find('.input-group').eq(0).append('<span class="input-group-btn"><button type="button" class="btn ' + settings.plusBtnClass + ' add"><span class="glyphicon glyphicon-plus-sign"></span></button></span>').find('.add_field_button');
// 			$(currentElem).on("click", ".add", function (e) {
// 				if (count < settings.maxInput) {
// 					count++;
// 					$(currentElem).append(
// 						'<div class="input-group" style="padding-top:15px;">
// 					<input class="' + elemClass + '" id="' + elemId + '" type="' + elemType + '" name="' + elemName + '"/>
// 					<span class="input-group-btn">
// 					<button type="button" class=" btn ' + settings.minusBtnClass + ' remove" >
// 					<span class="glyphicon glyphicon-minus-sign"></span>
// 					</button>
// 					</span>
// 					</div>
// 					<div class="col-md-offset-3 col-md-9">
//                                             <div class="checkbox">
//                                                 <label>
//                                                     <input name="isOwner" value="true" type="checkbox">Mark as owner
//                                                 </label><label style="margin-left:10px">
//                                                     <input name="isWhatsappSMS" value="true" type="checkbox">User for whatsapp
// 													');
// 				}
// 			});
// 			$(currentElem).on("click", ".remove", function (e) {
// 				//user click on remove text
// 				$(this).parent().parent('.input-group').remove();
// 				count--;
// 			});
// 			return this;
// 		}
// 	};

// }(jQuery));