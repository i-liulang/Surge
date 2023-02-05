//阿里云挂载魔改surge版 ，原作者Chosen Ome
//将阿里云挂载.js脚本放入icloud云 surge文件内
//打开Fileball 添加Synology协议
//地址填 aliyun.example.com
//用户名填 abc
//密码填 refresh_token（需要用阿里云盘扫描alist的二维码获得）地址如下
// https://alist-doc.nn.ci/docs/driver/aliyundrive

// 夸克登录网页版抓包，路径https://drive.quark.cn/1/clouddrive/file
// pikpak 直接填账号密码

//aliyun.example.com
//quark.example.com
//pikpak.example.com

// 连接 & Enjoy
// [General]
// force-http-engine-hosts = %APPEND% aliyun.example.com:0 // 要开mpv的话必须添加

// [Script]
// 阿里云挂载 = type=http-request,pattern=^http:\/\/aliyun\.example\.com,requires-body=1,script-path=fileball.js,max-size=0,debug=0
// 3合一挂载 = type=http-request,pattern=^http:\/\/(aliyun|quark|pikpak)\.example\.com,requires-body=1,script-path=_fileball.js,max-size=0

let url = $request.url;
let body = $request.body;

switch (url.match(/aliyun|pikpak|quark/)[0]) {
    case "aliyun":
        aliyun();
        break;

    case "pikpak":
        pikpak();
        break;

    case "quark":
        quark();
        break;

    default:
        $done({});
}

function aliyun() {let
jsonTk=$persistentStore.read("ali_token")?.split(",")||[];let access_token="Bearer "+jsonTk[0];let refresh_token=jsonTk[1];let default_drive_id=jsonTk[2];let req={url:"https://api.aliyundrive.com/adrive/v3/file/list",headers:{Authorization:access_token,"Content-Type":"application/json",},};!(async()=>{switch(url.match(/(auth|entry)\.cgi$/)?.[0]){case"auth.cgi":let password=refresh_token||body.match(/passwd=([^&]*)/)[1];req.url="https://auth.aliyundrive.com/v2/account/token";req.body=`{"refresh_token":"${password}","grant_type":"refresh_token"}`;let json=await http(req);let jstk=`${json.access_token},${json.refresh_token},${json.default_drive_id}`;$persistentStore.write(jstk,"ali_token");$done({response:{status:200,body:`{"success":true,"data":{"sid":"${json.access_token}"}}`,},});break;case"entry.cgi":if(body.match("Delete&")){let id=body.match(/path=([^&]+)/)[1];req.url="https://api.aliyundrive.com/v3/batch";req.body=`{"resource":"file","requests":[{"method":"POST","headers":{"Content-Type":"application\/json"},"id":"${id}","body":{"file_id":"${id}","drive_id":"${default_drive_id}"},"url":"\/recyclebin\/trash"}]}`;$done(req)}else if(body.match("method=get")){$done({response:{method:"GET",status:301,headers:{Location:`http://aliyun.example.com:5000/webapi/entry.cgi?api=SYNO.FileStation.Download&version=2&method=download&mode=open&path=${body.match(/path=([^&?]+)/)[1]}`,},},})}else{let parent_file_id="root";let path=body.match(/folder_path=([^&]+)/)?.[1];let a=path?((req.url=req.url.replace(/(parent_id=)/,`$1${path}`,)),(parent_file_id=path),"files"):"shares";req.body=`{"drive_id":"${default_drive_id}","parent_file_id":"${parent_file_id}"}`;let items=(await http(req)).items;let shares=JSON.stringify(items.map((item)=>{return{isdir:item.type==="folder",path:item.file_id,name:item.name,additional:{size:item.size,},}}),);$done({response:{status:200,body:`{"success":true,"data":{"total":0,"offset":0,"${a}":${shares}}}`,},})}break;default:let fileid=url.match("fbdownload")?hex2str(url.match(/dlink=%22(.*)%22/)[1]):url.match(/path=(.*$)/)[1];req.url="https://api.aliyundrive.com/v2/file/get_download_url";req.body=`{"file_id":"${fileid}","expire_sec":14400,"drive_id":"${default_drive_id}"}`;$request.url=(await http(req)).url.replace(/https/,"http");$request.headers.Referer="https://www.aliyundrive.com/";delete $request.headers.Host;$done($request)}})();function http(req){return new Promise((res)=>{$httpClient.post(req,(err,resp,data)=>{res(JSON.parse(data))})})}
}

function pikpak() { !(async()=>{let Token=$persistentStore.read("pikpak-ck")||(await signin());let req = {url: `https://api-drive.mypikpak.com/drive/v1/files?filters=%7B%22phase%22%3A%7B%22eq%22%3A%22PHASE_TYPE_COMPLETE%22%7D%2C%22trashed%22%3A%7B%22eq%22%3Afalse%7D%7D&parent_id=&thumbnail_size=SIZE_LARGE`,
headers: { authorization: Token },};
        switch(url.match(/(auth|entry)\.cgi$/)?.[0]){case"auth.cgi":$done({response:{status:200,body:'{"success":true,"data":{"sid":""}}',},});break;case"entry.cgi":if(body.match("Delete&")){req.url="https://api-drive.mypikpak.com/drive/v1/files:batchTrash";req.body=`{"ids":["${body.match(/path=([^&]+)/)[1]}"]}`;$done(req)}else if(body.match("method=get")){$done({response:{method:"GET",status:301,headers:{Location:`http://pikpak.example.com:5000/webapi/entry.cgi?api=SYNO.FileStation.Download&version=2&method=download&mode=open&path=${body.match(/path=([^&?]+)/)[1]}`,},},})}else{let path=body.match(/folder_path=([^&]+)/)?.[1];let a=path?((req.url=req.url.replace(/(parent_id=)/,`$1${path}`,)),"files"):"shares";for(var items;!items;){items=await http(req,"get",1);items?(items=items.files):(req.headers.authorization=await signin())}let shares=JSON.stringify(items.map((item)=>{return{isdir:!item.file_extension,path:item.id,name:item.name,additional:{size:parseInt(item.size)},}}),);$done({response:{status:200,body:`{"success":true,"data":{"total":0,"offset":0,"${a}":${shares}}}`,},})}break;default:let fids=url.match("fbdownload")?hex2str(url.match(/dlink=%22(.*)%22/)[1]):url.match(/path=(.*$)/)[1];req.url= `https://api-drive.mypikpak.com/drive/v1/files/${fids}?&thumbnail_size=SIZE_LARGE`;link=(await http(req)).links["application/octet-stream"].url.replace(/https/,"http");$done({response:{status:302,headers:{Location:link},},})}})();function http(req,method="get",set){return new Promise((res)=>{$httpClient[method](req,(err,resp,data)=>{(set&&err)||resp?.status===401?res():res(JSON.parse(data))})});}async function signin(){let account=$persistentStore.read("pikpak-account")||((body=decodeURIComponent(body)),0);let username=account?account.split("-")[0]:body.match(/account=([^&]+)/)[1];let password=account?account.split("-")[1]:body.match(/passwd=([^&]+)/)[1];$persistentStore.write(`${username}-${password}`,`pikpak-account`);let token="Bearer "+(await http({url:"https://user.mypikpak.com/v1/auth/signin",body:`{"client_id":"YNxT9w7GMdWvEOKa","username":"${username}","password":"${password}"}`,},"post",))?.["access_token"];$persistentStore.write(token,`pikpak-ck`);return token}
}

function quark() { let ck=$persistentStore.read("quark-ck")||((ck)=>{$persistentStore.write(ck,"quark-ck");return ck})(decodeURIComponent(body.match(/passwd=([^&]+)/)[1]));let req={url:"https://drive.quark.cn/1/clouddrive/file/sort?_fetch_total=1&_page=1&_size=100&fr=pc&pdir_fid=0&pr=ucpro",headers:{cookie:ck,"content-type":"application/json"},};!(async()=>{switch(url.match(/(auth|entry)\.cgi$/)?.[0]){case"auth.cgi":$done({response:{status:200,body:'{"success":true,"data":{"sid":""}}',},});break;case"entry.cgi":if(body.match("Delete&")){req.url="https://drive.quark.cn/1/clouddrive/file/delete?fr=pc&pr=ucpro";req.body=`{"action_type":1,"exclude_fids":[],"filelist":["${body.match(/path=([^&]+)/)[1]}"]}`;$done(req)}else if(body.match("method=get")){$done({response:{method:"GET",status:301,headers:{Location:`http://quark.example.com:5000/webapi/entry.cgi?api=SYNO.FileStation.Download&version=2&method=download&mode=open&path=${body.match(/path=([^&?]+)/)[1]}`,},},})}else{let path=body.match(/folder_path=([^&]+)/)?.[1];let a=path?((req.url=req.url.replace(/pdir_fid=0/,`pdir_fid=${path}`,)),"files"):"shares";let items=(await http(req,"get",1)).data.list;let shares=JSON.stringify(items.map((item)=>{return{isdir:!item.file,path:item.fid,name:item.file_name,additional:{size:item.size},}}),);$done({response:{status:200,body:`{"success":true,"data":{"total":0,"offset":0,"${a}":${shares}}}`,},})}break;default:let fids=url.match("fbdownload")?hex2str(url.match(/dlink=%22(.*)%22/)[1]):url.match(/path=(.*$)/)[1];req.url="http://drive.quark.cn/1/clouddrive/file/download?fr=pc&pr=ucpro";req.body=`{"fids":["${fids}"]}`;let link=(await http(req,"post")).data[0].download_url.replace(/https/,"http");$request.url=link;$request.headers.cookie=ck;delete $request.headers.Host;$done($request)}})();function http(req,method="get",set){return new Promise((res)=>{$httpClient[method](req,(err,resp,data)=>{set&&(set=resp.headers?.["Set-Cookie"]?.split(";")[0])&&$persistentStore.write(ck.replace(/[^;]+/,set),"quark-ck",);res(JSON.parse(data))})})}
}

function hex2str(hex){var trimedStr=hex.trim();var rawStr=trimedStr.substr(0,2).toLowerCase()==="0x"?trimedStr.substr(2):trimedStr;var len=rawStr.length;if(len%2!==0){return""}var curCharCode;var resultStr=[];for(var i=0;i<len;i=i+2){curCharCode=parseInt(rawStr.substr(i,2),16);resultStr.push(String.fromCharCode(curCharCode))}return resultStr.join("")}
