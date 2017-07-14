$(document).ready(function(){
	var m_date = new Date();
	var m_head_year = m_date.getFullYear();
	var m_head_month = m_date.getMonth() + 1;
	var m_day = m_date.getDay();
	var m_chooseDay = m_date.getDate();
	var m_totalDayTxt = "";
	var m_totalDay = new Date(m_head_year,m_head_month,0).getDate();
	var m_startDay = new Date(m_head_year + '/' + m_head_month + '/' + 1).getDay();
	var m_today = new Date().getDate();
	var m_isChooseM = false;
	const MAX_MONTH = 12;
	const NEXT_MONTH = 1;
	const APPEAR_TOTAL_DAY = 42;

	//取得某月某日的第一天是星期幾
	//console.log("某月的第一天是星期幾 = " + new Date(m_head_year + '/' + m_head_month + '/' + 1).getDay());
	//取得某年某月共幾天
	//console.log("這個月共幾天 = " + new Date(m_head_year,m_head_month,0).getDate());
	//取得當天是幾號
	//console.log("今天是幾號 = " + new Date().getDate());
	refreshDay();
	$('.header > .curr > .cur').text(m_head_year + ' 年 ' + m_head_month + ' 月');
	
	$('.header > .curr > .next').click(function(){
		if(m_isChooseM){
			m_head_year += 1;
			$('.header > .curr > .cur').text(m_head_year + ' 年 ');
		}else{
			if(m_head_month < 12){
				m_head_month += 1;
			}else{
				m_head_month = 1;
				m_head_year += 1;
			}
			$('.header > .curr > .cur').text(m_head_year + ' 年 ' + m_head_month + ' 月');
			refreshDay();
			dayInfo();
		}
	});
	$('.header > .curr > .prev').click(function(){
		if(m_isChooseM){
			m_head_year -= 1;
			$('.header > .curr > .cur').text(m_head_year + ' 年 ');
		}else{
			if(m_head_month > 1){
				m_head_month -= 1;
			}else{
				m_head_month = 12;
				m_head_year -= 1
			}
			$('.header > .curr > .cur').text(m_head_year + ' 年 ' + m_head_month + ' 月');
			refreshDay();
			dayInfo();
		}
	});

	$('.cur').click(function(){
		m_totalDayTxt = "";
		m_isChooseM = true;
		$('.header > .curr > .cur').text(m_head_year + ' 年')
		for(i = 1 ; i <= MAX_MONTH ; ++i){
			m_totalDayTxt += "<div class = 'month'>" + i + " 月</div>"
		}
		$('.body').html(m_totalDayTxt);
	});

	$('body').on('click' , '.month' , function(e){
		//e.stopPropagation();
		m_head_month = $(this).index() + 1;
		m_isChooseM = false;
		$('.header > .curr > .cur').text(m_head_year + ' 年 ' + m_head_month + ' 月');
		refreshDay();
	});

	$('body').on('click' , '.day:not(.gray)' , function(e){
		e.stopPropagation();
		m_chooseDay = $(this).text();
		console.log('yyy = ' + m_head_year + ' mmm = ' + m_head_month + ' ddd = ' + m_chooseDay);
		$('.day').removeClass('curr');
		$(this).addClass('curr');
		$('.footer').slideUp();
		
	});

	$('body').on('click', '.day.mark', function(e){
		for(var i = 0 ; i < m_userData.days.length ; ++i){
			//console.log('db = ' + new Date(m_userData.days[i].day).toDateString());
			//console.log('client = ' + new Date(m_head_year, m_head_month - 1, $(this).text()).toDateString());
			if(new Date(m_userData.days[i].day).toDateString() == new Date(m_head_year, m_head_month - 1, $(this).text()).toDateString()){
				$('.footer > ul > li').html('今日時數總計：' + m_userData.days[i+1].value + ' 分鐘 <div class = "pull-right del">x</div>');
				//console.log('choose day value = ' + new Date(m_userData.days[i].day).toDateString());
				//console.log('choose day value = ' + m_userData.days[i+1].value);
				break;
			};
		};
		$('.footer').slideToggle();
	});
	
	function refreshDay(){
		m_totalDay = new Date(m_head_year,m_head_month,0).getDate();
		m_startDay = new Date(m_head_year + '/' + m_head_month + '/' + 1).getDay();
		m_totalDayTxt = "";
		m_nextMonthDay = 1;

		//取當月份可見上個月的開始天數
		m_prevMonthDay = new Date(m_head_year,m_head_month - NEXT_MONTH,0).getDate() - m_startDay + 1;
		m_currDay = m_startDay + m_today;
		
		for(i = 1 ; i <= APPEAR_TOTAL_DAY ; ++ i){
			if(i <= m_startDay){
				m_totalDayTxt += "<div class = 'day gray'>" + m_prevMonthDay + "</div>";
				m_prevMonthDay ++
			}else if(i <= m_totalDay + m_startDay){
				var day = i - m_startDay;
				m_totalDayTxt += '<div class = "day" date-value = "' + day + '">' + day + '</div>';
			}else{
				m_totalDayTxt += '<div class = "day gray">' + m_nextMonthDay + '</div>';
				m_nextMonthDay ++;
			}
		}
		$('.body').html(m_totalDayTxt);
		$('.day:nth-child(' + m_currDay + ')').addClass('curr');
		m_chooseDay = m_date.getDate();
	};

	function dayInfo(){
		var daysCount = (m_userData.days == null) ? 0 : m_userData.days.length;
		for(var i = 0 ; i < daysCount ; ++i){
			var getDate = new Date(m_userData.days[i].day);
			if(getDate.getFullYear() == m_head_year && getDate.getMonth() == m_head_month - 1){
				var index = $('.date > .border > .body > .day').index($('.date > .border > .body > .day[date-value = ' + getDate.getDate() + ']'));
				$('.date > .border > .body > .day:nth-child(' + index + ')').addClass('mark');
				var dayDiv = $('.date > .border > .body > .day:nth-child(' + index + ')');
				if(parseInt(dayDiv.text()) < 10){
					$('<style>.date > .border > .body > .day:nth-child(' + index + '):after{margin-left: -8px;}</style>').appendTo($('body'));
				}
			}else{
				continue;
			};
		};
	};

	function refreshTotalTime(){
		const BASEMIN = 400; //400m = 1萬
		var total = parseInt(m_userData.totalTime) / BASEMIN;
		console.log('m_userData.totalTime = ' + m_userData.totalTime);
		total = (total % 100 == 0) ? total.toFixed(0) : total.toFixed(1);
		$('.circle-box > .count').text(total + '萬');

		var percent = (total * 10000) / 1000000; //10000=單位  1000000=總數 1/萬 總數100萬
		var circleRotate = 360 * percent;
		
		/*console.log('total = ' + total);
		console.log('percent = ' + percent);
		console.log('circleRotate = ' + circleRotate);
		console.log('rotateValue = ' + rotateValue);*/
		if(circleRotate <= 180){
			var rotateValue = -135 + circleRotate;
			$('.right > .circle').css('transform', 'rotate(' + rotateValue + 'deg)');
		}else{
			var rotateValue = 45 + circleRotate;
			$('.right > .circle').css('transform', 'rotate(45deg)');
			$('.left > .circle').css('transform', 'rotate(' + rotateValue + 'deg)');
		};
	};

	var username, mail;
	var m_userData;
	var m_server = 'https://date-note.herokuapp.com/';
	//var m_server = 'http://127.0.0.1:3001/'
	initUser();

	function initUser(){
		username = prompt('請輸入名稱', '');
		if(username == null) return alert('請輸入名稱');
		mail = prompt('請輸入信箱', '');
		if(mail == null) return alert('請輸入信箱');
		$('body').append('<div class = "loading"><span>Loading...</span></div>');
		$.ajax({
			url: m_server + 'user',
			data: {'username': username, 'mail': mail},
			type: 'post',
			success: function (data) {
				$('.loading').remove();
				switch($.type(data)){
					case 'string':
						if(data.indexOf('Error') == -1){
						}else{
							alert('名稱重複或信箱錯誤');
							initUser();
						};
						break;
					case 'object':
						m_userData = data;
						dayInfo();
						alert('Welcome back ' + data.username + '.');
						$('.target > .des').remove();
						for(var i = 0 ; i < data.targets.length; ++i){
							$('.target').append(`
								<div class = 'des'>
									<div class = 'text'><span>` +
											data.targets[i].target
									+ `</span></div>
									<div class = 'pull-right btn'>
										<div class = 'del'>x</div>
									</div>
								</div>`);
						};
						refreshTotalTime();
						break;
				}
			}
		});
	}

	$('.btn-submit').click(function(){
		$('body').append('<div class = "loading"><span>Loading...</span></div>');
		$.ajax({
			url: m_server + 'quotes',
		 	data: $('form').serializeArray(),
			type: 'post',
			success: function (data) {
				$('.loading').remove();
				console.log("recive data: " + data); 
			}
		});
	});

	$('body').on('click', '.footer > ul > li > .del', function(){
		console.log('yyy = ' + m_head_year + ' mmm = ' + m_head_month + ' ddd = ' + m_chooseDay + ' Date = ' + new Date(m_head_year,m_head_month - 1 , m_chooseDay));
		$.ajax({
			url: m_server + 'deleteTime',
			data: ({'username': username, 'date': new Date(m_head_year, m_head_month - 1, m_chooseDay)}),
			type: 'post',
			success: function(data){
				m_userData = data;
				$('.footer').slideUp();
				$('[date-value = ' + m_chooseDay + ']').removeClass('mark');
				refreshTotalTime();
			}
		});
	});

	$('.pull-right.menu').click(function(){
		if(confirm('確定要刪除你的資料嗎')){
			$.ajax({
				url: m_server + 'deleteUser',
				data: ({'mail': mail}),
				type: 'post',
				success: function(data){
					location.reload();
				}
			});
		};
	});

	$('.time-send').click(function(){
		var timeInput = $('.add-time > .m-8 > input.input');
		if(timeInput.val() <= 0 || timeInput.val() == ''){
			console.log('Please input some number.');
			return false;
		}else{
			var chooseDay = new Date(m_head_year, m_head_month - 1, m_chooseDay).toDateString();
			var data = $('form.add-time').serializeArray();
			data.unshift({name: 'username', value: username},{name: 'date', value: chooseDay});
			$.ajax({
				url: m_server + 'addTime',
				data: data,
				type: 'post',
				success: function(data){
					timeInput.val('0');
					m_userData = data;
					var daysCount = data.days.length;
					for(var i = 0 ; i < daysCount ; ++i){
						var getDate = new Date(data.days[i].day);
						if(getDate.getFullYear() == m_head_year && getDate.getMonth() == m_head_month - 1){
							var index = $('.date > .border > .body > .day').index($('.date > .border > .body > .day[date-value = ' + getDate.getDate() + ']'));
							$('.date > .border > .body > .day:nth-child(' + index + ')').addClass('mark');
							var dayDiv = $('.date > .border > .body > .day:nth-child(' + index + ')');
							if(parseInt(dayDiv.text()) < 10){
								$('<style>.date > .border > .body > .day:nth-child(' + index + '):after{margin-left: -8px;}</style>').appendTo($('body'));
							}
						}else{
							continue;
						};
					};
					refreshTotalTime();
				}
			});
			return false;
		}
	});

	$('[name = addTarget]').click(function(){
		var targetData = $('.target > form').serializeArray();
		targetData.unshift({name: 'username', value: username});
		$.ajax({
			url: m_server + 'addTarget',
			data: targetData,
			type: 'post',
			success: function(data){
				console.log('add target receive data => ' + JSON.stringify(data[0].target));
				var targetCount = data.length;
				$('.target > .des').remove();
				for(var i = 0 ; i < targetCount ; ++ i){
					//console.log(data[i]._id);
					$('.target').append(`
						<div class = 'des'>
							<div class = 'text'><span>` +
									data[i].target
							+ `</span></div>
							<div class = 'pull-right btn'>
								<div class = 'del'>x</div>
								
							</div>
						</div>`);
				}
			}
		});
		return false;
	});

	$('body').on('click', '.des > .text > span', function(e){
		//console.log('click');
		var tmpText = $(this).text();
		var tmpObj = $(this);
		$(this).css('display', 'none');
		$(this).parent().append('<form><input name = "targetEdit" value =' + tmpText + '></input></form>')
		$('[name = "targetEdit"]').trigger('focus');
		$('[name = "targetEdit"]').blur(function(){
			//console.log($(this).parent().parent().parent().index());
			var targetIndex = $(this).parent().parent().parent().index() - 1;
			if($(this).val() != tmpText){
				$.ajax({
					url: m_server + 'editTarget',
					data: {'username': username, 'target': $(this).val(), 'index': targetIndex},
					type: 'post',
					success: function(data){
						tmpObj.text(data);
					}
				});
			};
			tmpObj.css('display', 'inline');
			$(this).parent().remove('form');
		});
	});

	$('body').on('click', '.des > .btn', function(e){
		var index = $(this).parent().index() - 1;
		var tmpObj = $(this);
		$.ajax({
			url: m_server + 'deleteTarget',
			data: {'username': username, 'index': index},
			type: 'post',
			success: function(data){
				tmpObj.parent().remove();
			}
		});
	});
});

