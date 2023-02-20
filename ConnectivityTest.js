let $ = {
BL:'https://www.bilibili.com',
BD:'https://www.baidu.com',
YT:'https://www.youtube.com/',
GG:'https://www.google.com/generate_204',
GB:'https://www.github.com'
}

!(async () => {
await Promise.all([http('BD'),http('BL'),http('GB'),http('GG'),http('YT')]).then((x)=>{
	$done({
    title: 'Network Connectivity Test',
    content: x.join('\xa0|\xa0'),
    icon: 'timer',
    'icon-color': '#FF5A9AF9',
  })
})
})();

function http(req) {
    return new Promise((r) => {
			let time = Date.now();
        $httpClient.post($[req], (err, resp, data) => {
            r(req +
						'\xa0: ' +
						(Date.now() - time)+' ms');
        });
    });
}
