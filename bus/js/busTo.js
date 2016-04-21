
Remix.create({
	remixEvent: {
		'input, from': 'getFrom',
		'input, to': 'getTo',
		'change, city': 'getCity',
		'tap, search': 'search',
		'tap, .to_from, @': 'toFrom',
		'tap, .to_to, @': 'toTo'
	},
	initialize: function() {
		var city = $("#city").val()
		this.getAjaxLabel(city)
		var url = decodeURI(window.location.href);
		if(~url.indexOf("from=")){
			var line = url.split('from=')[1]
			var froms = line.split('&to=')
			this.refs.from.val(froms[0])
			this.refs.to.val(froms[1])
			this.search()
		}
	},
	getCity:function(){
		this.city = $("#city").val()
		this.getAjaxLabel(this.city)
	},
	getFrom: function(e,$el){
		var value = $el.val()
		$("#suggestId").val(value)
	},
	getTo: function(e,$el){
		var value = $el.val()
		$("#suggestId2").val(value)
	},
	getAjaxLabel: function(city){
		var self = this
		function G(id) {
			return document.getElementById(id);
		}
		var map = new BMap.Map("map");
		this.map = map
		map.centerAndZoom(city,12);
		var ac = new BMap.Autocomplete({
			"input" : "suggestId",
			"location" : map
		});
		var bc = new BMap.Autocomplete({
			"input" : "suggestId2",
			"location" : map
		});
		var myValue;
		ac.addEventListener("onconfirm", function(e) {    //鼠标点击下拉列表后的事件
		var _value = e.item.value;
			//myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
			myValue =  _value.business;
			self.refs.from.val(myValue)
			self.getPoint(myValue,'fromP')
			self.search()
		});
		bc.addEventListener("onconfirm", function(e) {
		var _value = e.item.value;
			myValue =   _value.business;
			self.refs.to.val(myValue)
			self.getPoint(myValue,'toP')
			self.search()
		});
	},
	getPoint: function(key, to){
		var self = this;
		var map = this.map;
		var localSearch = new BMap.LocalSearch(map);
	    map.clearOverlays();//清空原来的标注
	    var keyword = key;
	    localSearch.setSearchCompleteCallback(function (searchResult) {
	        var poi = searchResult.getPoi(0);
	        self.refs[to].val(poi.point.lng + "," + poi.point.lat)       
		});
	    localSearch.search(keyword);
		
	},
	search: function(){
		var self = this
		var city = $("#city").val()
		var xys = this.refs.fromP.val()+";"+this.refs.toP.val()
		$.ajax({
			url: 'http://api.map.baidu.com/direction/v1?mode=transit&origin='+this.refs.from.val()+'&destination='+this.refs.to.val()+'&region='+city+'&output=json&ak=BcYppRbhARmEL0ntgQlcteN9',
			dataType: 'jsonp',
			success: function(data){
				if(data.status == 0){
					if( data.result.hasOwnProperty('routes') ){
						var count = data.result.routes.length;
						var html = ""
						self.data = [];
						for(var i=0;i<count;i++){
							self.data.push(data.result.routes[i])
							html += '<li class="clearfix" data-index='+i+'>'+
										'<p style="width:100%" >'
							if(data.result.routes[i].scheme[0].hasOwnProperty('steps')){
								var list = data.result.routes[i].scheme[0].steps
								for(var j=0;j<list.length;j++){
									html += list[j][0].stepInstruction + "<br/>"	
								}
							}
							
							html +=			'</p>'+
									'</li>'
						}
					}else{
						if(data.result.hasOwnProperty('origin')){
							var origin = data.result.origin
							var html = '<li class="clearfix" >'+
										'<p style="width:100%" >请选择起点位置</p></li>'
							for(var i=0;i<origin.length;i++){
								html += '<li class="to_from clearfix" data-index='+i+'>'+
										'<p style="width:100%" >'+ origin[i].name +'</p>'+
										'<span class="addr">'+ origin[i].address +'</span></li>'
							}
						}else{
							var destination = data.result.destination
							var html = '<li class="clearfix" data-index='+i+'>'+
										'<p style="width:100%" >请选择终点位置</p></li>'
							for(var i=0;i<destination.length;i++){
								html += '<li class="to_to clearfix" data-index='+i+'>'+
										'<p style="width:100%" >'+ destination[i].name +'</p>'
										'<span class="addr">'+ destination[i].address +'</span></li>'
							}
						}
					}
					
				}else{
					var html = "<li style='text-align:center' >无法查询路线</li>"
				}
				self.refs.detail.html(html)
			}
		})
		
	},
	toFrom: function(e,$el){
		var name = $el.find('p').text()
		this.refs.from.val(name)
		this.search()
	},
	toTo: function(e,$el){
		var name = $el.find('p').text()
		this.refs.to.val(name)
		this.search()
	}
	
}).bindNode("#main")