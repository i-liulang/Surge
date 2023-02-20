// 加入了百度和bilibili测速,感谢@小白脸重写脚本原脚本,原作者@yibeizipeini来自于https://raw.githubusercontent.com/yibeizipeini/JavaScript/Surge/ConnectivityTest.js
let $ = {
Bilibili:'https://www.bilibili.com',
Baidu:'https://www.baidu.com',
Youtube:'https://www.youtube.com/',
Google:'https://www.google.com/generate_204',
Github:'https://www.github.com'
}

!(async () => {
await Promise.all([http('Baidu'),http('Bilibili'),http('Github'),http('Google'),http('Youtube')]).then((x)=>{
	$done({
    title: 'Network Connectivity Test',
    content: x.join('|'),
    icon: 'timer',
    'icon-color': '#FF5A9AF9',
  })
})
})();
function http(req) {
    return new Promise((r) => {
			let time = Date.now();
        $httpClient.post(req, (err, resp, data) => {
            r(req.split(".")[1]+
						' \t: ' +
						(Date.now() - time)+' ms');
        });
    });
}
