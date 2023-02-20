let $ = {
𝗕𝗟:'https://www.bilibili.com',
𝗕𝗗:'https://www.baidu.com',
𝗬𝗧:'https://www.youtube.com/',
𝗚𝗚:'https://www.google.com/generate_204',
𝗚𝗛:'https://www.github.com'
}

!(async () => {
await Promise.all([http('𝗕𝗟'),http('𝗚𝗛'),http('𝗬𝗧')]).then((x)=>{
	$done({
    title: '𝗡𝗲𝘁𝘄𝗼𝗿𝗸 𝗖𝗼𝗻𝗻𝗲𝗰𝘁𝗶𝘃𝗶𝘁𝘆 𝗧𝗲𝘀𝘁',
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
						':' +
						(Date.now() - time)+' ms');
        });
    });
}
