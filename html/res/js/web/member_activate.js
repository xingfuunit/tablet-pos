/*!
 * member_activate
 * */
var SysUrl = 'http://tabletpos.pzfresh.com/';
 

//取得验证码
var captchas_invTime =  null;

function captchas_get(){
	var iTimer = 3; //超时时间
	var $btn  = $('#btn-captchas');

	$btn.val(iTimer+'秒').button('disable').button( 'refresh' );
	
	//----------------------------------------------
	captchas_invTime = setInterval(function () {
		iTimer--;
		$btn.val(iTimer+'秒').button( 'refresh' );
		if (iTimer == 0) {
			captchas_close();
		};
	}, 1000);

	//----------------------------------------------
	var url = SysUrl +  'member_activate.php?act=getcode';
	$.ajax({
		type: 'get',
		url : url,
		cache:false,
		dataType:'json',
		success: function (rs) {
			if(rs.act == '1'){
				
			}else{
				alert(rs.msg);
			};
			captchas_close();
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			alert('网络不通'+url);
			captchas_close();
		}
	});
};

//关闭 captchas 发送状态
function captchas_close(){
	
	if(captchas_invTime){
		clearInterval(captchas_invTime);
		captchas_invTime = null;
	};

	$('#btn-captchas').val('获取验证码').button('enable').button( 'refresh' );	
};


 //ajax保存
function save(){
	//----------------------------------------------
	if($('#usercode').val().length==0){
		jqmAlert('请输入会员卡号!');
		return;
	};
	
	var mobile = $('#mobile').val();
	if(mobile.length==0){
		//alert('请输入手机号!');
		jqmAlert('请输入手机号!');
		return;
	};
	
	if(isMobile(mobile)==false){
		//alert('请输入正确的手机号码!');
		jqmAlert('请输入正确的手机号码!');
		return;
	};
	
	if($('#captchas').val().length==0){
		//alert('请输入验证码!');
		jqmAlert('请输入验证码!');
		return;
	};
	
	if($('#username').val().length==0){
		//alert('请输入客户姓名!');
		jqmAlert('请输入客户姓名!');
		return;
	};
	
	//----------------------------------------------
	showLoader();
	
	//----------------------------------------------
	var url = SysUrl +  'member_activate.php?act=save';
	$.ajax({
		type: 'post',
		url : url,
		data:$('#formAdd').serialize(),
		cache:false,
		dataType:'json',
		success: function (rs) {
			if(rs.act == '1'){
				self.location = 'member_activate_yes.html';
			}else{
				//alert(rs.msg);
			};
			save_close();
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			alert('网络不通'+url);
			save_close();
		}
	});
};

function save_close(){
	hideLoader();
};




