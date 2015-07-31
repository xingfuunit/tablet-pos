/*!
 * collect_money
 * */
var SysUrl = 'http://tabletpos.pzfresh.com/';
var SysConf = {
	payamount : 0
};

//menber modal
var SysMember = {
	id : 0,
	name:'',
	lv:'',
	account:0,
	score:0
};

$(function(){
	//默认预存款支付不可用，因为未登陆
	setTimeout(function(){
			$( '#btnPay4' ).button( 'disable' );
	},200);
	
	//keyup
	$('#orderamount').keyup(function (e) {
		LimitInputFloat($(this).get(0));
		payamount_show();
	});

	//keyup
	$('#discountamount').keyup(function (e) {
		LimitInputFloat($(this).get(0));
		payamount_show();
	});
	
	
	//-------------------------------------------
	//username
	$('#username').keydown(function (e) {
		if(e.keyCode == 13) {
			user_login();
			return false;
		};
	});
	
	$('#username').blur(function () {
		var login  = ''+$('#username').val();
		if(login.length>0){
			user_login();	
		};
		return false;
	});
	

	//-------------------------------------------
	//popupPay2
	$('#popupPay2_realamount').keyup(function (e) {
		LimitInputFloat($(this).get(0));
		popupPay2_realamount_show();
	});
	
	//按回车确认支付
	$('#popupPay2_realamount').keydown(function (e) {
		if(e.keyCode == 13) {
			pay_save2();
			return false;
		};
	});
	
	//-------------------------------------------
	//popupPay4_paypassword
	$('#popupPay4_paypassword').keyup(function (e) {
		if($(this).val().length>=6){
			pay_save4();
		};
	});
	
});

//根据商品金额和优惠金额，计算应付金额
function payamount_show(){
	var orderamount = parseFloat0($('#orderamount').val());
	var discountamount = parseFloat0($('#discountamount').val());
	SysConf.payamount = MyRound2(orderamount - discountamount);
	$('#payamount').html(SysConf.payamount);
};

//ajax用户登陆 
function user_login(){
	$( '#btnPay4' ).button( 'disable' );
	
	var login  = ''+$('#username').val();
	if(login.length == 0){
		//alert('请输入用户手机、邮箱或用户名！');
		jqmAlert('请输入用户手机、邮箱或用户名！');
		return;
	};
	
	//----------------------------------------------
	showLoader();

	//----------------------------------------------
	
	setTimeout(function(){
		SysMember.id  		= 1;
		SysMember.name  	= "test";
		SysMember.lv  		= '金牌会员';
		SysMember.account  	= 2300.58;
		SysMember.score  	= 150;
		user_show();
		hideLoader();
	},2000);
	
	return;
	//----------------------------------------------
	var url = SysUrl +  'member.php?act=login';
	$.ajax({
		type: 'post',
		url : url,
		data:'name='+login,
		cache:false,
		dataType:'json',
		success: function (rs) {
			if(rs.act == '1'){
				//登陆成功
				SysMember.id  		= rs.data.id;
				SysMember.name  	= rs.data.name;
				SysMember.lv  		= rs.data.lv;
				SysMember.account  	= rs.data.account;
				SysMember.score  	= rs.data.score;
				
				user_show();
				
			}else{
				//alert(rs.msg);
			};
			hideLoader();
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			alert('网络不通'+textStatus);
			hideLoader();
		}
	});
	//----------------------------------------------
	//登陆成功
	
};

//显示会员信息
function user_show(){
	var $info1 = $('#userinfo'),
		$info2 = $('#userinfo2');
		
	$info1.find('.member-name').html(SysMember.name);
	$info1.find('.member-lv').html(SysMember.lv);
	$info1.find('.member-account').html('￥'+SysMember.account);
	$info1.find('.member-score').html(SysMember.score);
	
	$info2.find('.member-name').html(SysMember.name);
	$info2.find('.member-lv').html(SysMember.lv);
	$info2.find('.member-account').html('￥'+SysMember.account);
	$info2.find('.member-score').html(SysMember.score);
	
	$('#userinfo').show();
	$( '#btnPay4' ).button( 'enable' );
};

 /*
  * 支付显示
  * payId:
  * 	1 = 微信支付
  * 	2 = 现金支付
  * 	3 = 刷卡支付
  * 	4 = 预存款支付
  * */
function pay_open(payId){

	var orderamount = parseFloat0($('#orderamount').val());

	if (orderamount <= 0) {
		jqmAlert('请输入商品金额!');
		return;
	};

	var discountamount = parseFloat0($('#discountamount').val());
	if (discountamount <= 0) {
		jqmAlert('请输入优惠金额!');
		return;
	};
	
	//计算
	SysConf.payamount = MyRound2(orderamount - discountamount);
	
	
	if(payId==1){//1=微信支付
		$('#popupPay1_payamount').html(SysConf.payamount);
		
	}else if(payId==2){ //2=现金支付
		$('#popupPay2_payamount').html(SysConf.payamount);
		$('#popupPay2_realamount').html(0);
		$('#popupPay2_give').html(0);
		
	}else if(payId==3){ //3=刷卡支付
		$('#popupPay3_payamount').html(SysConf.payamount);
		
	}else if(payId==4){ //4=预存款支付
		if(SysMember.id<0 || SysMember.name.length==0){
			jqmAlert('请先登陆!');
			return;
		};
	
		$('#popupPay4_payamount').html(SysConf.payamount);
		$('#popupPay4_paypassword').html('');
	};
	
	
	//----------------------------------------------
	var $popup = $('#popupPay'+payId);
	$popup.popup({dismissible: false});
	$popup.popup('open');
};


//支付找零计算
function popupPay2_realamount_show(){
	var realamount = parseFloat0($('#popupPay2_realamount').val());
	var give = MyRound2(realamount - parseFloat(SysConf.payamount));
	$('#popupPay2_give').html(give);
};

//确定登陆
function wx_login(){
	$('#popupLoginCode').popup('close');
};

//支付取消
function pay_close(payId){
	$('#popupPay'+payId).popup('close');
};

//确认支付--微信支付
function pay_save1(){

	showLoader();
	//----------------------------------------------
	setTimeout(function(){self.location = 'collect_money_yes.html';},2000);
	return;
	var url = SysUrl +  'collect_money.php?act=save';
	$.ajax({
		type: 'post',
		url : url,
		data:$('#formAdd').serialize(),
		cache:false,
		dataType:'json',
		success: function (rs) {
			if(rs.act == '1'){
				self.location = 'collect_money_yes.html';
			}else{
				//alert(rs.msg);
			};
			hideLoader();
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			alert('网络不通'+textStatus);
			hideLoader();
		}
	});
};

//确认支付--现金支付
function pay_save2(){
	var realamount = parseFloat0($('#popupPay2_realamount').val());
	if (realamount <= 0) {
		alert('请输入实收金额!');
		return;
	};

	//----------------------------------------------
	showLoader();
	//----------------------------------------------
	setTimeout(function(){self.location = 'collect_money_yes.html';},2000);
	return;
	var url = SysUrl +  'collect_money.php?act=save';
	$.ajax({
		type: 'post',
		url : url,
		data:$('#formAdd').serialize(),
		cache:false,
		dataType:'json',
		success: function (rs) {
			if(rs.act == '1'){
				self.location = 'collect_money_yes.html';
			}else{
				//alert(rs.msg);
			};
			hideLoader();
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			alert('网络不通'+textStatus);
			hideLoader();
		}
	});

	
};

//确认支付--刷卡支付
function pay_save3(){

	showLoader();
	//----------------------------------------------
	setTimeout(function(){self.location = 'collect_money_yes.html';},2000);
	return;
	var url = SysUrl +  'collect_money.php?act=save';
	$.ajax({
		type: 'post',
		url : url,
		data:$('#formAdd').serialize(),
		cache:false,
		dataType:'json',
		success: function (rs) {
			if(rs.act == '1'){
				self.location = 'collect_money_yes.html';
			}else{
				//alert(rs.msg);
			};
			hideLoader();
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			alert('网络不通'+textStatus);
			hideLoader();
		}
	});
};

//确认支付--预存款支付
function pay_save4(){
	var paypassword = $('#popupPay4_paypassword').val();
	if (paypassword.length <6) {
		alert('请输入支付密码!');
		return;
	};
	
	//----------------------------------------------
	showLoader();
	//----------------------------------------------
	setTimeout(function(){self.location = 'collect_money_yes.html';},2000);
	return;
	var url = SysUrl +  'collect_money.php?act=save';
	$.ajax({
		type: 'post',
		url : url,
		data:$('#formAdd').serialize(),
		cache:false,
		dataType:'json',
		success: function (rs) {
			if(rs.act == '1'){
				self.location = 'collect_money_yes.html';
			}else{
				//alert(rs.msg);
			};
			hideLoader();
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			alert('网络不通'+textStatus);
			hideLoader();
		}
	});
};



 /*
  * 取得支付方式
  * payId:
  * 	1 = 微信支付
  * 	2 = 现金支付
  * 	3 = 刷卡支付
  * 	4 = 预存款支付
  * */
function get_PayName(payId){
	if(payId == 1){
		return '微信支付';
		
	}else if(payId==2){
		return '现金支付';
		
	}else if(payId==3){
		return '刷卡支付';
		
	}else if(payId==4){
		return '预存款支付';
	};
	
	return '未知方式';
};
