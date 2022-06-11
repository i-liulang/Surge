var url = $request.url;
var cook = $request.headers;
const reque = {
    url: url,
    headers: cook,
};
$httpClient.get(reque, function(error, response, data) {
                 var code = encodeURI(data.match(/(magnet:\?xt=urn:btih.+?)\"/)[1]+"");
                 var cc = "shortcuts://run-shortcut?name=abc&input=text&text="+code;
   $done({ response: { status: 302, headers: { Location: cc } } });
});
