let a = $request.url.match(/[^\/]+\-[^\%]+/);
if ($request.url.indexOf("video") != -1){
const head = {"User-Agent":"Mozilla\/5.0 (iPhone; CPU iPhone OS 15_5 like Mac OS X) AppleWebKit\/605.1.15 (KHTML, like Gecko) Version\/15.5 Mobile\/15E148 Safari\/604.1"};
const rl = "https://www.dmm.co.jp/search/=/searchstr="+a+"/analyze=V1ECC1YDUwU_/limit=30/sort=ranking/";
$httpClient.get({url:rl,headers:head}, function(error, response, data) {
	var kk ="https://xiongmaobo.xyz/search?keyword=" + a;
	$notification.post(a,"","",{url:kk});
	var b = data.match(/https?:\/\/cc3001\.dmm\.co\.jp.+?mp4/).toString().replace(/_sm/,'_dmb');
	    console.log(b)
            if ( b !== "null"){
$done({ response: { status: 302, headers: { Location: b } } });
};
$done();
});
      }else{
       let e = "https://supjav.com/zh/?s="+a;
       $done({ response: { status: 302, headers: { Location: e } } });
