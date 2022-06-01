const Group = $prefs.valueForKey('BiliArea_Policy') || '𝗕𝗶𝗹𝗶𝗕𝗶𝗹𝗶';

const message = {
    action: "set_policy_state",
    content: {[Group]: "𝗗𝗜𝗥𝗘𝗖𝗧"}
};
$configuration.sendMessage(message).then(resolve => {
    if (resolve.error) {
        console.log(resolve.error);
    }
    if (resolve.ret) {
        let output=JSON.stringify(resolve.ret);
        //console.log(output);
    }
    $done();
}, reject => {
    // Normally will never happen.
    $done();
});
