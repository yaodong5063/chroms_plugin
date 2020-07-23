
var _id = document.querySelector('#getData');
var tel = document.querySelector('#tel');
var code = document.querySelector('#code');
var but = document.querySelector('#but');
var getData = document.querySelector('#getData');
var codeBut = document.querySelector('#codeBut');
var codeButText = document.querySelector('#codeButText');
var againLogin = document.querySelector('#againLogin');
var logines = document.querySelector('#login');
var sale_but = document.querySelector('#sale_but');

var login, t, url = 'https://plugin.salearms.com/api/'


chrome.storage.sync.get(['login'],function(items){
	if(items && items.login){
		logines.style.display='none'
		sale_but.style.display='block';
	}
});
_id.addEventListener('click',function(){
    sendMessageToContentScript({type:1});
});

againLogin.addEventListener('click',function(){
    logines.style.display='block'
	sale_but.style.display='none';
	sendMessageToContentScript({
		type:3,
		login:''
	});
})

codeBut.addEventListener('click',function(){
	var val = tel.value;
	if(/^1(3|4|5|6|7|8|9)[0-9]{9}$/.test(val)){

		ajax.get({
			url:url+'browser/plug/sendVerificationCode',
			dataType:'json',
			data:{
				telephone:val,
				type:1003
			},
			timeout: 10000
		}).then(function(data){
			if(data.code === 0){
				codeBut.style.display='none';
				codeButText.style.display='inline-block';
				timeText(60)
			}
			
		}).catch(err=>{
			console.log(err);
		});
		
		
	}else{
		
		chrome.notifications.create(null, {
			type: 'basic',
			iconUrl: 'img/exhibition.png',
			title: '登录错误提示',
			message: '电话号码有误',
		});
	}
});
but.addEventListener('click',function(){
	var val = tel.value;
	var cd = code.value;
	
	if(!/^1(3|4|5|6|7|8|9)[0-9]{9}$/.test(val)){
		return chrome.notifications.create(null, {
			type: 'basic',
			iconUrl: 'img/exhibition.png',
			title: '登录错误提示',
			message: '电话号码有误',
		});
		
	}
	if(!/[0-9]{4}$/.test(cd)){
		return chrome.notifications.create(null, {
			type: 'basic',
			iconUrl: 'img/exhibition.png',
			title: '登录错误提示',
			message: '验证码输入有误',
		});
	}

	ajax.post({
        url:url+'browser/plug/login',
        dataType:'json',
        data:{
			grantType:'mobile',
            username:val,
            verifyCode:cd
        },
        timeout: 10000
    }).then(function(data){
		if(data.code === 0){
			sendMessageToContentScript({
				type:3,
				login:data.data
			});
			logines.style.display='none'
			sale_but.style.display='block';
		}else{
			chrome.notifications.create(null, {
				type: 'basic',
				iconUrl: 'img/exhibition.png',
				title: '登录错误提示',
				message: data.message,
			});
		}
        
    }).catch(err=>{
        console.log(err);
    });
    
});

function timeText(text){
	if(text === 0) {
		clearTimeout(t);
		codeButText.style.display='none';
		codeBut.style.display='inline-block';
		return;
	}
	text--;
	codeButText.innerText = text;
	t= setTimeout(function(){
		timeText(text)
	},1000);

}


function getCurrentTabId(callback){
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs)
	{
		if(callback) callback(tabs.length ? tabs[0].id: null);
	});
}

function sendMessageToContentScript(message, callback){
	
	
	getCurrentTabId((tabId) =>
	{
		chrome.tabs.sendMessage(tabId, message, function(response)
		{
			if(callback) callback(response);
		});
	});
}