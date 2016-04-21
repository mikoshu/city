Remix.create({
	remixEvent: {
		'tap, search':'search',
		'tap, .getDetail, @': 'getDetail'
	},
	initialize: function() {
		this.city = $("#city").val()
		var url = decodeURI(window.location.href);
		var line = url.split('line=')[1]
		if(line){    //当url上有跟参数时，页面直接执行查找
			this.refs.line.val(line)
			this.search()
		}
	},
	search: function(){
		var line = this.refs.line.val()
		var self = this;
		this.city = $("#city").val()
		$.ajax({
			url: "http://op.juhe.cn/189/bus/station?key=e347084ecfd220ea8725ce0c809c9b56&city="+self.city+"&station="+ line, 
			dataType: 'jsonp',
			success: function(data){
				console.log(data)
				if(data.error_code == 0){
					var count = data.result.length;
					var html = ""
					self.data = [];
					for(var i=0;i<count;i++){
						self.data.push(data.result[i])
						html += '<li class="getDetail clearfix" data-index="'+data.result[i].key_name+'">'+
									'<p style="width:100%" >'+data.result[i].name+'</p>'+
								'</li>'
					}
				}else{
					var html = "<li style='text-align:center' >没有查到该站点信息</li>"
				}
				self.refs.detail.html(html)
			}
		})
	},
	getDetail: function(el,$e){
		var index = $e.data("index")
	　　var result="";
	　　for (var i = 0; i < index.length; i++){
	　　　if (index.charCodeAt(i)==12288){
	　　　　result+= String.fromCharCode(index.charCodeAt(i)-12256);
	　　　　continue;
	　　　}
	　　　if (index.charCodeAt(i)>65280 && index.charCodeAt(i)<65375) result+= String.fromCharCode(index.charCodeAt(i)-65248);
	　　　else result+= String.fromCharCode(index.charCodeAt(i));
	　　}
		result = parseInt(result)
		window.location.href = 'bus_line.html?line='+result+'&station='+this.refs.line.val()
	}
	
}).bindNode("#main")