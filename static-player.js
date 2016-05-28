(function () {
	'use strict';


	function parse(){

		console.log('parse')

		var fragments = $("[process]")

		if(fragments.length>0) $.holdReady(true)
		
		var count = 0

		fragments.each(function () {
			var self = this
			var path = $(self).attr('process')
			var compiled 
			var processed

			if(path){
				$.get(path, function(result){
					compiled = _.template(result)
					processed = compiled(window.data)

					finalize(self, processed, true)

					count++
					if(count >= fragments.length) $.holdReady(false)

					if($(processed).find("[process]")){
						parse();
					}
				})
			}else{
				var cnt = $(self).html().replace(/&lt;/g, '<').replace(/&gt;/g, '>')
				compiled = _.template(cnt)
				processed = compiled(window.data)
				finalize(self, processed, true)
			}

			function finalize(self, processed, remove){
				var prev = $(self).prev()
				if(prev.length>0){
					var newfrag = prev.after(processed)
				}else{
					var newfrag = $(self).parent().prepend(processed)
				}
				$(self).removeAttr('process')
				if(remove) $(self).remove()
			}

			
		})

	}


	$(document).ready(function(){
		parse();
	})
	

})();