/*!
 * tools
 * */
function jGet(e) { return document.getElementById(e); };
function Random(n) { return (Math.floor(Math.random() * n)); };
function AjaxRnd() { return new Date().getTime() + '' + Random(10000); };


/*******************************
* from Validate 
*******************************/
function isInt(val) { if (val == '') { return false; }; var reg = /^-?\d+$/; return reg.test(val); };
function isUInt(val) { if (val == '') { return false; }; var reg = /^\d+$/; return reg.test(val); };
function isFloat(val) { if (val == '') { return false; }; var reg = /^\d*\.?\d+$/; return reg.test(val); };

function isEmail(val) { 
	var reg = /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)/;
	return reg.test(val); 
};

function isMobile(val) { 
	var reg = /^(13[0-9]|15[012356789]|18[012356789]|14[57])\d{8}$/;
	return reg.test(val); 
};


//只能输入整数
function LimitInputInt(the, delValue) {
    delValue = delValue || '';
    var reg = /^\d+$/;
    if (!reg.test(the.value)) {
        the.value = delValue;
    };
};

//只能输入金额
function LimitInputFloat(the) {
    var reg = /^\d+\.?\d{0,2}$/;
    if (!reg.test(the.value)) {
        the.value = '';
    };
};

/*******************************
* Math 
*******************************/
function parseFloat0(v) {
    v = v || 0;
    v = parseFloat(v);
    if (isNaN(v)) { v = 0; };
    if (v < 0) { v = 0; };
    return v;
};

function parseInt1(v) {
    v = v || 1;
    v = parseInt(v);
    if (isNaN(v)) { v = 1; };
    if (v < 1) { v = 1; };
    return v;
};

function parseInt0(v) {
    v = v || 0;
    v = parseInt(v);
    if (isNaN(v)) { v = 0; };
    if (v < 0) { v = 0; };
    return v;
};

function MyRound(v, d) {
    var k = Math.pow(10, d);
    var c = Math.round(v * k) / k;
    return parseFloat(c.toFixed(d));
};

//保留2位，并返回字符型。
function MyRound2(v) {
    var k = Math.pow(10, 2);
    var c = Math.round(v * k) / k;
    return c.toFixed(2);
};

//保留小数点后2位,一般用于金额
function FmtPrice(v) {
    var s = new String(v);

    if (s.indexOf('.') == -1) {
        return s + '.00';
    } else {
        return MyRound2(v);
    };
};

//保留小数点后6位,一般用于数量
function FmtFloat(v) {
    return MyRound(v, 6);
};

/*******************************
* jqm Extended
*******************************/
$(document).bind("mobileinit", function () {
    $.mobile.ajaxEnabled = false;
});

//显示加载器  
function showLoader() { 


	$.mobile.loading('show',{
		text: '加载中...', 
		textVisible: true
	});
	$.mobile.loading( 'checkLoaderPosition');
};
  
//隐藏加载器
function hideLoader(){  
    $.mobile.loading('hide');  
};


function jqmAlert(msg, timer){
	if(typeof timer === 'undefined'){
		timer = 10;	
	};
	
	var $home = $('#jqm-home');
	if(!$home.size()){
		alert('页面没有 #jqm-home');
		return;
	};

	var $alert  = $('#jqm-alert');
	var oInt = null;
	
	if(!$alert.size()){

		var sb  = [
			'<div data-role="popup" id="jqm-alert" data-overlay-theme="b" data-theme="b">',
				//'<a href="#" data-rel="back" data-role="button" data-theme="b" data-icon="delete" data-iconpos="notext" class="btnClose ui-btn-right">Close</a>',
				'<a href="#" data-rel="back" data-role="button" data-theme="b" data-icon="delete" data-iconpos="notext" class="ui-btn-right ui-link ui-btn ui-btn-b ui-icon-delete ui-btn-icon-notext ui-shadow ui-corner-all" role="button">Close</a>',
				'<div role="main" class="ui-content">',
					'<div class="msg ui-btn ui-icon-alert ui-btn-icon-left ui-btn-inline tc"></div>',
					'<div class="timeout"></div>',
				'</div>',
			'</div>'
		].join('');

		$home.append(sb);


		$alert  = $('#jqm-alert');
		var $time = $alert.find('.timeout');
		var ik = 0,oInt = null;
		$alert.popup({
			afteropen: function( event, ui ) {
				if(timer>0){
					ik = 0;
					if(!oInt){
						clearInterval(oInt);
						oInt = null;
					};

					$time.html('close time: ' +(timer)).show();
					oInt = setInterval(function(){
						ik++;
						if(ik>=timer){
							$alert.popup('close');	
							if(!oInt){
								clearInterval(oInt);
								oInt = null;	
								ik = 0;
							};
						}else{
							$time.html('close time: ' +(timer-ik));	
						};						
					},1000);	
				}else{
					$time.hide();
				};
			},
			afterclose: function( event, ui ) {
				if(!oInt){
					clearInterval(oInt);
					oInt = null;
					ik = 0;
				};
			}
		});
	};

	$alert.find('.msg').html(msg);
	$alert.popup('open');
};

function jqmAlert2(msg, timer){
	if(typeof timer === 'undefined'){
		timer = 10;	
	};

	var $home = $('#jqm-home');
	if(!$home.size()){
		alert('页面没有 #jqm-home');
		return;
	};

	var $alert  = $('#jqm-alert');
	var oInt = null;
	
	if(!$alert.size()){

		var sb  = [
			'<div data-role="popup" id="jqm-alert" data-overlay-theme="b" data-theme="b">',
				//'<a href="#" data-rel="back" data-role="button" data-theme="b" data-icon="delete" data-iconpos="notext" class="btnClose ui-btn-right">Close</a>',
				'<a href="#" data-rel="back" data-role="button" data-theme="b" data-icon="delete" data-iconpos="notext" class="ui-btn-right ui-link ui-btn ui-btn-b ui-icon-delete ui-btn-icon-notext ui-shadow ui-corner-all" role="button">Close</a>',
				'<div role="main" class="ui-content">',
					'<div class="msg ui-btn ui-icon-alert ui-btn-icon-left ui-btn-inline tc"></div>',
					'<div class="timeout"></div>',
				'</div>',
			'</div>'
		].join('');

		$home.append(sb);


		$alert  = $('#jqm-alert');
		var $time = $alert.find('.timeout');
		var ik = 0,oInt = null;
		$alert.popup({
			afteropen: function( event, ui ) {
				if(timer>0){
					ik = 0;
					if(!oInt){
						clearInterval(oInt);
						oInt = null;
					};

					$time.html('close time: ' +(timer)).show();
					oInt = setInterval(function(){
						ik++;
						if(ik>=timer){
							$alert.popup('close');	
							if(!oInt){
								clearInterval(oInt);
								oInt = null;	
								ik = 0;
							};
						}else{
							$time.html('close time: ' +(timer-ik));	
						};						
					},1000);	
				}else{
					$time.hide();
				};
			},
			afterclose: function( event, ui ) {
				if(!oInt){
					clearInterval(oInt);
					oInt = null;
					ik = 0;
				};
			}
		});
	};

	$alert.find('.msg').html(msg);
	$alert.popup('open');
};
