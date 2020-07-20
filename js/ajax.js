const ajax={
    obj:{
        //默认
        url:null,  //地址
        type:'get',  //类型，默认get
        dataType: 'text',  //返回类型,默认text
        data:{},   //传值，默认空
        async: true, //同步异步设置，默认异步
        timeout: 10000, //超时时间
        contentType:'application/x-www-form-urlencoded',  //设置头
        withCredentials:false,   //同源策略，默认false，true必须指定域名
        beforeSend(XMLHttpRequest) {}
    },
    xhr:null,
    get(obj={}){
        //get方法 
          return new Promise((resolve,reject) =>{
            const xhr=new XMLHttpRequest(),
                    o=Object.assign(this.obj,obj),
                    {data, async, dataType, withCredentials, timeout, contentType} = o;
            let u = '', n = 0;
            for(let key in data){
                if(n === 0){
                    u += `?${key}=${data[key]}`;
                }else{
                    u += `&${key}=${data[key]}`;
                }
                n++;
                
            }
            console.log(u)
            let url = `${o.url}${u}`;
            
            
            
            xhr.onreadystatechange = function(){
                //接受请求
                if (xhr.readyState === 4) {
                    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
                        resolve(xhr.response);
                    } else {
                        reject(new Error(xhr.statusText));
                    }
                }
            } 
            xhr.open('get',url,async);  
            if(!!o.beforeSend){
                //设置头
                o.beforeSend(xhr)
            }
            xhr.responseType = dataType;  //设置类型
            xhr.timeout = timeout;  //设置超时时间
            xhr.withCredentials = withCredentials;   //设置同源策略,true需指定域名
            xhr.setRequestHeader('Content-Type', contentType);  //设置接收头
            
            xhr.send();  //发送请求
            xhr.ontimeout = function(e){
                //超时处理
                reject(e);
            };
            this.xhr = xhr;  //存储xhr

          });

    },
    post(obj={}){
      //post方法
      return new Promise((resolve,reject) =>{
        const xhr=new XMLHttpRequest(),
                o=Object.assign(this.obj,obj),
                {data, async, dataType, withCredentials, timeout, contentType, url} = o;
        let u='', num = 0;
        
        
        xhr.onreadystatechange = function(){

            if (xhr.readyState === 4) {
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
                    resolve(xhr.response);
                    
                } else {
                    reject(new Error(xhr.statusText));
                    
                }
            }
        } 
        console.log(data,665)
        xhr.open('post',url,async);  //open
        if(dataType === 'json'){
            xhr.setRequestHeader('Content-Type', 'application/json');//设置接收头
            u = JSON.stringify(data)
        }else{
            for(let key in data){
                if(!key) break;
                u+=`${num === 0 ? '' : '&'}${key} = ${data[key]}`;
    
                num++;
            }
            xhr.setRequestHeader('Content-Type', contentType);//设置接收头
        }
        if(!!o.beforeSend){
            //设置头
            o.beforeSend(xhr)
        }

        xhr.responseType=dataType;  //设置类型
        
        xhr.timeout=timeout;//设置超时时间
        xhr.withCredentials=withCredentials;//设置同源策略,true需指定域名
        
       
        
        xhr.send(u);  //发送请求
        xhr.ontimeout=function(e){
            //超时处理
            reject(e);
        };
        
       this.xhr=xhr;  //存储
      })
    },
    upload(obj){
        //简单的图片上传
        return new Promise((resolve,reject) => {
            let xhr,o;

            xhr = new XMLHttpRequest();
            o=Object.assign(this.obj,obj)
            xhr.withCredentials = false;
            xhr.open('POST', o.url);
           
            xhr.onreadystatechange=function(){
                if (xhr.readyState == 4) {
                    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                        resolve(xhr.response);
                        
                    } else {
                        reject(new Error(xhr.statusText));
                        
                    }
                }
            } 
            xhr.timeout=timeout;//设置超时时间
            
            xhr.send(o.formData);  //发送请求
            xhr.ontimeout=function(e){
                //超时处理
                reject(e);
            };
            
           this.xhr=xhr;  //存储
        })
        
    },
    abort(cb){
       //中断
       this.xhr.abort();
       if(!!cb){
         cb();
       };
       return this;
    }
};
