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
    title: '𝗡𝗘𝗧𝗪𝗢𝗥𝗞 𝗖𝗢𝗡𝗡𝗘𝗖𝗧𝗜𝗩𝗜𝗧𝗬 𝗧𝗘𝗦𝗧',
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
