/*
* name:  linkIt
* author: P.Popeye
* License: MIT License
*
*/


(function($){
	$.fn.linkIt = function(options){
		var settings = $.extend({
			href:    null,
			text:    null,
			target:  '_blank'
		},options);
		//Validation
		if (settings.href == null) {
			console.log('You need to provide a href');
			return this;
		}

		return this.each(function(){
			var object = $(this);
			if (settings.text == null){
				settings.text = object.text();
			}
		object.wrap('<a target="'+settings.target+'" href="'+settings.href+'"></a>').text(settings.text);
		});
	}
}(jQuery));
