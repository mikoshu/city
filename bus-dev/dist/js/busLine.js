//var Remix = require('remix')
 Remix.create({
	remixEvent: {
		'tap, search':'search',
		'tap, .getDetail, @': 'getDetail'
	},
	initialize: function() {
		this.city = $("#city").val()
		var url = window.location.href;
		var line = parseInt(url.split('line=')[1])
		if(line){
			this.refs.line.val(line)
			this.search()
		}
	},
	search: function(){
		var line = this.refs.line.val()
		var self = this;
		this.city = $("#city").val()
		$.ajax({
			url: "http://op.juhe.cn/189/bus/busline?key=e347084ecfd220ea8725ce0c809c9b56&city="+self.city+"&bus="+ line, 
			dataType: 'jsonp',
			success: function(data){
				if(data.error_code == 0){
					var count = data.result.length;
					var html = ""
					self.data = [];
					for(var i=0;i<count;i++){
						self.data.push(data.result[i])
						html += '<li class="getDetail clearfix" data-index='+i+'>'+
									'<p style="width:100%" >'+data.result[i].name+'</p>'+
								'</li>'
					}
				}else{
					var html = "<li style='text-align:center' >没有这条路线，请输入准确路线</li>"
				}
				self.refs.detail.html(html)
			}
		})
	},
	getDetail: function(el,$e){
		var url = window.location.href,
			station;
		if(~url.indexOf('&station=')){
			station = decodeURI(url.split('&station=')[1])
		}
		var index = $e.data("index")
		var html = ""
		var data = this.data[index].stationdes
		var len = data.length
		for(var i=0;i<len;i++){
			var name = data[i].name;
			console.log(station)
			if(station &&  ~name.indexOf(station)){
				name = '<font style="color:#f00">'+name+'</font>';
			}
			html += '<li class="clearfix">'+
						'<span>'+data[i].stationNum+'</span>'+
						'<p>'+name+'</p>'+
						'<span></span>'+
					'</li>'
		}
		this.refs.detail.html(html)
	}
	
}).bindNode("#main")