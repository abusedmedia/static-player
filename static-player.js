window.StaticPlayer = (function (window, undefined) {

	var instance = null;
	var _debug = false;

	$.holdReady(true)

	function initializeNewModule() {
		
		function parse(_selection, _data){

			if(_debug) console.log('---------parse')

			if(_selection.length==0) $.holdReady(false)
			
			var count = 0

			_selection.each(function () {
				var self = this

				var path = $(self).attr('process')
				$(self).removeAttr('process')

				if(path){
					function ldr(__self, path, _data){
						if(_debug) console.log('include', path)
						$.get(path, function(result){
							var model = $(__self).attr('model')
							var data = (model) ? _data[model] : _data
							if(_debug) console.log('included', path, data)
							var compiled = _.template(result)
							var processed = compiled(data)

							var newfrag = finalize(__self, processed, true)
							
							count++
							if(count >= _selection.length) $.holdReady(false)

							setTimeout(function(){
								var match = newfrag.match(/process/g)
								if(match && match.length>0){
									parse( $("[process]"), data );
								}
							})
						})
					}
					ldr(self, path, _data)
				}else{
					if(_debug) console.log('process')
					var cnt = $(self).html().replace(/&lt;/g, '<').replace(/&gt;/g, '>')
					var model = $(self).attr('model')
					var data = (model) ? _data[model] : _data
					var compiled = _.template(cnt)
					var processed = compiled(data)
					finalize(self, processed, true)
				}

				function finalize(self, processed, remove){
					var prev = $(self).prev()
					if(prev.length>0){
						var newfrag = prev.after(processed)
					}else{
						var newfrag = $(self).parent().prepend(processed)
					}
					if(remove) $(self).remove()

					return processed			
				}

				
			})

		}


		


		var begin = function(tag, global){
			if(_debug) console.log('begin')
			var _tag = (tag) ? tag : 'process'
			var _glob = (global) ? global : window
			parse( $("["+_tag+"]"), _glob );
		}

		var debug = function(){
			_debug = ! _debug
		}

		if($('[process-init]').length>0){
			begin()
		}

		return {
	      begin : begin,
	      debug: debug
	    };
	    
	}

	if($('[process-init]').length>0){
		if(_debug) console.log('auto')
		instance = new initializeNewModule();
	}

 
    function getInstance() {
	    if( ! instance ) {
	      instance = new initializeNewModule();
	    }
	    return instance;
	}
	  
	return {
	    getInstance : getInstance
	};




})(window);

