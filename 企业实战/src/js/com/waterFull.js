define(['jquery'], function($) {
	var load = (function() {
		function _load($ct) {
			this.ct = $ct;
			this.init();
		};

		_load.prototype = {
			constructor: _load,
			init: function() {
				var _this = this;
				this.isGetDate = true;
				this.curPage = 1;
				this.perPageCount = 3;
				this.colLength = parseInt(this.ct.find('ul').width() / this.ct.find('li').outerWidth(true));
				this.nodeWidth = this.ct.find('ul li').outerWidth(true);
				this.nodeHeightArr = [];
				for(var i=0; i<this.colLength; i++){
					this.nodeHeightArr[i] = 0
				}

				this.renderDate();

				this.ct.find('#more').on('click', function() {
					if(_this.isGetDate) {
						_this.renderDate();
					}
				});
			},
			renderDate: function() {
				var _this = this;
				this.getData(function(newList) {
					_this.isGetDate = true;
					$.each(newList, function(index,news) {
						var node = _this.getNode(news);
						$(node).find('img').load(function() {
							_this.ct.find('ul').append(node);
							_this.waterFall(node);
						});
					})
				});
				this.isGetDate = false;
			},

			getData: function(jsoncallback) {
				var _this = this;
				$.ajax({
					url: '//platform.sina.com.cn/slide/album_tech?jsoncallback=func&app_key=1271687855&num=3&page=4',
					dataType: 'jsonp',
					jsonp: 'jsoncallback',
					data: {
						app_key: '1271687855',
						page: _this.curPage,
						num: _this.perPageCount
					}
				}).done(function(ret) {
					if(ret && ret.status.code === '0'){
						jsoncallback(ret.data);
						console.log(ret.data);
						_this.curPage++;
					}
				}).fail(function() {
					console.log('error');
				})
			},

			getNode: function(news) {
				this.html = '';
				this.html += '<li>';
				this.html += 	'<a href="' + news.url + '">';
				this.html += 		'<img src="' + news.img_url + '">';
				this.html += 		'<h2>' + news.short_name + '</h2>';
				this.html += 		'<p>' + news.short_intro + '</p>';
				this.html += 	'</a>';
				this.html += '</li>';
				return $(this.html);
			},

			waterFall: function(node) {
				var _this = this;
				this.minValue = Math.min.apply(null,_this.nodeHeightArr);
				this.minIndex = this.nodeHeightArr.indexOf(_this.minValue);
				node.css({
					top: _this.nodeHeightArr[_this.minIndex],
					left: _this.nodeWidth * _this.minIndex,
					opacity: 1
				});
				this.nodeHeightArr[this.minIndex] += node.outerHeight(true);
				this.ct.find('ul').height(Math.max.apply(null,_this.nodeHeightArr));
			}
		};

		return {
			start: function($ct) {
				new _load($ct);
			}
		}
	})();

	return load;
});