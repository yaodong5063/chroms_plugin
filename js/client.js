var url = ['www.qixin.com','s.hc360.com'];

setTimeout(function(){
    dataLogin();
},5000)

// 接收来自后台的消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    const {type, login, data} = request;
    if(type === 3){
        //登陆
        chrome.storage.sync.set({login},function(items){
            console.log(items,332);
        });
    }else if(type === 7){
        tip(data.message)

    } else if(type === 1){
        dataLogin();
    }
    
	
});

function dataLogin(){
    var lurl =location.host;
    chrome.storage.sync.get(['login'],function(items){
        if(url.includes(lurl)){
            if(items && items.login){
                chrome.runtime.sendMessage({
                    type: 6,
                    body:document.body.innerHTML,
                    accessToken:items.login.accessToken,
                    source:url.indexOf(lurl)+1
                }, res => {
                    console.log(res, 332);
                })
            }else{
                tip('请登陆后在获取数据');
            }
        }else{
            // tip('目前只支持启信宝和慧聪网哦～');
        }
        
    })
}

function nodeToString ( node ) {  
    var tmpNode = document.createElement( "div" );  
    tmpNode.appendChild( node.cloneNode( true ) );  
    var str = tmpNode.innerHTML;  
    tmpNode = node = null; // prevent memory leaks in IE  
    return str;  
}

var tipCount = 0;
// 简单的消息通知
function tip(info) {
	info = info || '';
	var ele = document.createElement('div');
	ele.className = 'chrome-plugin-simple-tip slideInLeft';
	ele.style.top = tipCount * 70 + 70 + 'px';
	ele.innerHTML = `<div>${info}</div>`;
	document.body.appendChild(ele);
	tipCount++;
	setTimeout(() => {
		ele.style.top = '-100px';
		setTimeout(() => {
			ele.remove();
			tipCount--;
		}, 400);
	}, 3000);
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
