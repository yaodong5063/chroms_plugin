function importMyBlog(body,accessToken, source) {
	ajax.post({
		url:'https://plugin.salearms.com/api/browser/plug/dataAnalysis',
		dataType:'json',
		data:{
			dom:body,
			source:source
		},
		beforeSend: function(xhr) {
			xhr.setRequestHeader("Authorization", 'Bearer '+accessToken);
		},
		timeout: 10000
	}).then(function(data){
		sendMessageToContentScript({type:7, data});
	}).catch(err=>{
		console.log(err);
	});
		
    
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
	const {type, body, accessToken, source} =request;
	importMyBlog(body, accessToken, source);
});

// 接收来自后台的消息

chrome.contextMenus.create({
    "title": "点击获取数据",
    "contexts":["all"],//page表示在整个页面右键都会有自定义的菜单
    "onclick": function(){
		sendMessageToContentScript({type:1})
	}
}); 



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