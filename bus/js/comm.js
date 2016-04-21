$(document).ready(function(){

	$(".btn").on('tap',function(){
		var self = $(this)
		self.addClass('on')
		setTimeout(function(){
			self.removeClass('on')
		},150)
	})

})