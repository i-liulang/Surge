/*
打开活动页面自动注入console，需要手动执行脚本

************************
Surge 脚本配置:
************************
[Script]
jdHelper1 = type=http-response,pattern=^https:\/\/((?!(api|mapi|lbsapi|im\-x|hermes|uranus|saturn|ccf|ccflbs|ccfjma|perf|msg|lite\-msg|firevent|fireactive|lbsgw|lbsgd|ex|policy|mars|blackhole|homepage\-gw|sh|un|bh|orbit|wlmonitor|neptune|jxa|sinan\-agent|ws1\-dd|httpfereport|jingfenapp|jdpull|wlogin|we|live\-ws1|payfinish)\.).*\.?jd\.com\/?((?!\.(js|json|jpg|gif|png|webp|dpg|flv|mp3|mp4)).)*)*$,requires-body=1,max-size=-1,script-path=jdHelper.js

[mitm]
hostname = %APPEND% in.m.jd.com, me-api.jd.com, wqs.jd.com, lite-in.m.jd.com
*/

const lk = new ToolKit(`京东助手`, `JdHelper`)
let html = lk.getResponseBody()
try {
  lk.log('开始处理')
  all()
} catch (e) {
  lk.logErr(e)
  lk.done({body: html})
}

async function all() {
  if (html == undefined || !html.includes('</html>')) {
    lk.done({body: html})
  } else {
    lk.log('开始解析')
    let url = lk.getRequestUrl()
    lk.log(`url:${url}`)
    let sku
    let appType = "jd"
    let arr = []

    if (url.includes('lite-in.m.jd.com')) {
      appType = "jsb"
    }

    if (url.includes('graphext/draw')) {
      arr = url.match(/sku=(\d+)/)
    }
    if (url.includes('/product/')) {
      arr = url.match(/\/.*\/(\d+)\.html/)
    }
    if (url.includes('/jxapp_detail/')) {
      arr = url.match(/sku=(\d+)&/)
      appType = "jx"
    }

    sku = arr.length != 0 ? arr[1] : ''
    if (!sku) {
      lk.done({body: html})
      return
    }

    lk.log(`解析完成:${sku}`)
    const sidebarHorizontal = 'lkJdHelperSidebarHorizontal'
    const jdCkBoxJsKey = 'lkJdHelperCk'
    const jdHelperDomain = 'lkJdHelperApiDomain'
    const jdHelperCallKey = 'lkJdHelperCallKey'
    const jdHelperIsNotifyKey = 'lkJdHelperIsNotifyKey'
    const jdHelperIsShowSmzdm = 'jdHelperIsShowSmzdm'
    const jdHelperIsShowJf = 'jdHelperIsShowJf'
    const jdHelperIsShowMmm = 'jdHelperIsShowMmm'
    let rightOrLeft = !lk.getVal(sidebarHorizontal) ? `left` : lk.getVal(sidebarHorizontal)
    let ck = !lk.getVal(jdCkBoxJsKey) ? `` : lk.getVal(jdCkBoxJsKey)
    let apiDomain = !lk.getVal(jdHelperDomain) ? `left` : lk.getVal(jdHelperDomain)
    let apiCallKey = !lk.getVal(jdHelperCallKey) ? `` : lk.getVal(jdHelperCallKey)
    let isNotify = !lk.getVal(jdHelperIsNotifyKey) ? false : JSON.parse(lk.getVal(jdHelperIsNotifyKey))

    let isShowSmzdm = !lk.getVal(jdHelperIsShowSmzdm) ? true : JSON.parse(lk.getVal(jdHelperIsShowSmzdm))
    let isShowJf = !lk.getVal(jdHelperIsShowJf) ? true : JSON.parse(lk.getVal(jdHelperIsShowJf))
    let isShowMmm = !lk.getVal(jdHelperIsShowMmm) ? true : JSON.parse(lk.getVal(jdHelperIsShowMmm))

    let leftCss = !lk.getVal('lkJdHelperLeftCss') ? '' : lk.getVal('lkJdHelperLeftCss')
    if (leftCss == '') {
      leftCss = `
        left: -5px;
        border-radius: 0 50px 50px 0;
        padding: 0 5px 0 5px;
        box-shadow: -2px 1px 8px #888888;`
    }
    let rightCss = !lk.getVal('lkJdHelperRightCss') ? '' : lk.getVal('lkJdHelperRightCss')
    if (rightCss == '') {
      rightCss = `
        right: -5px;
        border-radius: 50px 0 0 50px;
        padding: 0 5px 0 5px;
        box-shadow: -2px 1px 8px #888888;`
    }
    let smzdmCss = !lk.getVal('lkJdHelperSmzdmCss') ? '' : lk.getVal('lkJdHelperSmzdmCss')
    if (smzdmCss == '') {
      smzdmCss = `
        bottom: 213px;
        box-sizing: content-box;
        width: 30px;
        height: 30px;
        border: 0px solid rgba(255,255,255,0.8);
        background: #fff;
        background: url(https://pic.imgdb.cn/item/618fbff22ab3f51d916b872f.png) #fff no-repeat 11px/27px;`
    }
    let jfCss = !lk.getVal('lkJdHelperJfCss') ? '' : lk.getVal('lkJdHelperJfCss')
    if (jfCss == '') {
      jfCss = `
        bottom: 250px;
        box-sizing: content-box;
        width: 30px;
        height: 30px;
        border: 0px solid rgba(255,255,255,0.8);
        background: #fff;
        background: url(https://pic.imgdb.cn/item/618fbf532ab3f51d916b50be.png) #fff no-repeat 11px/27px;`
    }
    let mmmCss = !lk.getVal('lkJdHelperMmmCss') ? '' : lk.getVal('lkJdHelperMmmCss')
    if (mmmCss == '') {
      mmmCss = `
        bottom: 287px;
        box-sizing: content-box;
        width: 30px;
        height: 30px;
        border: 0px solid rgba(255,255,255,0.8);
        background: #fff;
        background: url(https://pic.imgdb.cn/item/618fd7352ab3f51d9173702d.png) #fff no-repeat 11px/27px;`
    }
    lk.log('读取boxjs配置完成')
    // <div id="alook" class="sidebar ${rightOrLeft}" onclick="window.location.href='alook://${url}'">
    //           <img src="https://alookbrowser.com/assets/uploads/profile/1-profileavatar.png" />
    //         </div>
    //         <div id="yyb" class="sidebar ${rightOrLeft}" onclick="window.location.href='yybpro://url?${url}'">
    //           <img src="https://tvax3.sinaimg.cn/crop.0.0.828.828.180/006nobRDly8gel4md0kfzj30n00n03z2.jpg" />
    //         </div>
    let tools = !sku
        ? ``
        : `<button id="smzdm" class="sidebar ${rightOrLeft} ${isShowSmzdm ? '' : 'hide'}"></button>
            <button id="jf" class="sidebar ${rightOrLeft} ${isShowJf ? '' : 'hide'}"></button>
            <button id="mmm" class="sidebar ${rightOrLeft} ${isShowMmm ? '' : 'hide'}"></button>`
    lk.log('初始化工具栏完成')

      // 请求接口获取京粉转链之后的url
      lk.log('准备开始请求jf转链')
      let jfConvertorResultUrl = `https://item.jd.com/${sku}.html`
      let options = {
        url: `${apiDomain}/unidbg/jfConvertor?ck=${ck}&materialInfo=${jfConvertorResultUrl}`,
        headers: {
          "callKey": apiCallKey
        },
        body: JSON.stringify({
          "ck": ck,
          "materialInfo": jfConvertorResultUrl
        })
      }
      //lk.log(JSON.stringify(options))
      lk.log('构建转链请求完成')
      await lk.post(options, (error, response, data) => {
        try {
          //lk.log(data)
          lk.log('请求京粉转链完成，准备处理数据')
          const result = JSON.parse(data)
          if (result.code == 0) {
            if (result.data.data.promotionUrl) {
              jfConvertorResultUrl = result.data.data.promotionUrl
            }
            //收集需要通知的信息
            if (isNotify) {
              let notifyStr = ""
              if (result.data.data.wlCommissionShare) {
                notifyStr = `${notifyStr}佣金比例：${result.data.data.wlCommissionShare}% `
              }
              if (result.data.data.wlCommission) {
                notifyStr = `${notifyStr} ➟ 预计返利：¥ ${result.data.data.wlCommission} `
              }
              if (result.data.data.couponShortUrl) {
                jfConvertorResultUrl = result.data.data.couponShortUrl
                notifyStr = `${notifyStr}\n`
                if (result.data.data.couponAfterPrice) {
                  notifyStr = `${notifyStr}券后价格：¥ ${result.data.data.couponAfterPrice} `
                }
                if (result.data.data.couponPrice) {
                  notifyStr = `${notifyStr}\n用券优惠：¥ ${result.data.data.couponPrice} `
                }
                if (result.data.data.couponAfterCommission) {
                  notifyStr = `${notifyStr}\n券后返利：¥ ${result.data.data.couponAfterCommission} `
                }
              }
              let param = ""
              switch (appType) {
                case 'jx':
                  param = `{"des":"m","url":"${jfConvertorResultUrl}","category":"jump"}`
                  param = encodeURI(param)
                  lk.msg(``, notifyStr, `openapp.jdpingou://virtual?params=${param}`)
                  break
                case 'jsb':
                  param = `{"category":"jump","des":"m","url":"${jfConvertorResultUrl}"}`
                  param = encodeURI(param)
                  lk.msg(``, notifyStr, `openjdlite://virtual?params=${param}`)
                  break
                default:
                  param = `{"category":"jump","des":"m","sourceValue":"babel-act","sourceType":"babel","url":"${jfConvertorResultUrl}"}`
                  param = encodeURI(param)
                  lk.msg(``, notifyStr, `openApp.jdMobile://virtual?params=${param}`)
                  break
              }
            }
            lk.execStatus = true
          }
          lk.log('处理京粉转链数据完成')
        } catch (e) {
          lk.logErr(e)
         // lk.log(`请求京粉api异常：${data}`)
          lk.msg(``, `该商品暂无佣金推广信息`)
          lk.execFail()
        }
        lk.log('开始注入html')
        html =
            html.replace(/(<\/html>)/g, '') +
            `
                      <style>
                          html, body {
                              -webkit-user-select: auto !important;
                              user-select: auto !important;
                          }
                          .right {
                          ${rightCss}
                          }
                          .left {
                          ${leftCss}
                          }
                          .sidebar{
                              position: fixed;
                              z-index: 99999;
                          }
                          #sidebar img {
                              box-sizing: content-box;
                              width: 30px;
                              height: 30px;
                              padding: 0 20px 0 5px;
                              border:1px solid rgba(255,255,255,0.8);
                              background: #FFF;
                              border-radius: 50px 0 0 50px;
                          }
                          
                          .hide {
                              display: none !important;
                          }
                          
                          #alook {
                              bottom: 250px;
                          }
                          
                          #yyb {
                              bottom: 217px;
                          }
                          #smzdm {
                          ${smzdmCss}
                          }
                          #jf {
                          ${jfCss}
                          }
                          #mmm {
                          ${mmmCss}
                          }
                      </style>
                      ${tools}
                      <script>
                          const jfConvertorResultUrl = "${jfConvertorResultUrl}"
                          const jfConvertorAppType = "${appType}"
                          const btn = document.querySelector('#smzdm')
                          btn.addEventListener('click',() => {
                              const input = document.createElement('input')
                              input.setAttribute('readonly', 'readonly')
                              input.setAttribute('value', '${jfConvertorResultUrl}')
                              // input.setAttribute('value', document.getElementsByTagName('head')[0].innerHTML)
                              document.body.appendChild(input)
                              input.setSelectionRange(0, input.value.length)
                              if (document.execCommand('copy')) {
                                  document.execCommand('copy')
                                  console.log('复制成功')
                              }
                              document.body.removeChild(input)
                              window.location.href='smzdm://'
                          })
                          const jfbtn = document.querySelector('#jf')
                          jfbtn.addEventListener('click',() => {
                              const input = document.createElement('input')
                              input.setAttribute('readonly', 'readonly')
                              input.setAttribute('value', '${jfConvertorResultUrl}')
                              // input.setAttribute('value', document.getElementsByTagName('head')[0].innerHTML)
                              document.body.appendChild(input)
                              input.setSelectionRange(0, input.value.length)
                              if (document.execCommand('copy')) {
                                  document.execCommand('copy')
                                  console.log('复制成功${jfConvertorResultUrl}')
                              }
                              document.body.removeChild(input)
                              //window.location.href='com.jingdong.jxj://'
                              switch (jfConvertorAppType) {
                                case 'jx':
                                    var a = document.createElement('a');
                                    a.setAttribute('href', "${jfConvertorResultUrl}");
                                    a.setAttribute('target', '_self');
                                    document.body.appendChild(a);
                                    a.click();
                                    document.body.removeChild(input)
                                    // window.location.href='openapp.jdpingou://virtual?params={"des":"m","url":"${jfConvertorResultUrl}","category":"jump"}'
                                    break
                                case 'jsb':
                                    window.location.href='openjdlite://virtual?params={"category":"jump","des":"m","url":"${jfConvertorResultUrl}"}'
                                    break
                                default:
                                    window.location.href='openApp.jdMobile://virtual?params={"category":"jump","des":"m","sourceValue":"babel-act","sourceType":"babel","url":"${jfConvertorResultUrl}"}'
                                    break
                              }
                          })
                          const mmmbtn = document.querySelector('#mmm')
                          mmmbtn.addEventListener('click',() => {
                              const input = document.createElement('input')
                              input.setAttribute('readonly', 'readonly')
                              input.setAttribute('value', '${jfConvertorResultUrl}')
                              // input.setAttribute('value', document.getElementsByTagName('head')[0].innerHTML)
                              document.body.appendChild(input)
                              input.setSelectionRange(0, input.value.length)
                              if (document.execCommand('copy')) {
                                  document.execCommand('copy')
                                  console.log('复制成功${jfConvertorResultUrl}')
                              }
                              document.body.removeChild(input)
                              window.location.href='manmanbuy://'
                          })
                          
                          const script = document.createElement('script')
                          script.src = "https://cdn.bootcss.com/vConsole/3.2.0/vconsole.min.js"
                          // script.doneState = { loaded: true, complete: true};
                          script.onload = function() {
                              init()
                              console.log("初始化成功")
                          }
                          
                          const jqueryScript = document.createElement('script')
                          jqueryScript.type = 'text/javascript'
                          jqueryScript.src = "https://libs.baidu.com/jquery/2.0.0/jquery.min.js"
                          // script.doneState = { loaded: true, complete: true};
                          jqueryScript.onload = function() {
                              console.log("加载jquery完成"+jfConvertorResultUrl)
                          }
                          
                          document.getElementsByTagName('head')[0].appendChild(script);
                          document.getElementsByTagName('head')[0].appendChild(jqueryScript);
                          
                          function init () {
                              window.vConsole = new VConsole()
                              setTimeout(() => {
                                  console.log(window.location.href)      
                              })
                          }
                      </script>
                  </html>
                  `
        lk.log('注入html完成')
        lk.done({body: html})
      })
    }
  }
//ToolKit-start
function ToolKit(t,s,i){return new class{constructor(t,s,i){this.tgEscapeCharMapping={"&":"＆","#":"＃"};this.userAgent=`Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0.2 Safari/605.1.15`;this.prefix=`lk`;this.name=t;this.id=s;this.data=null;this.dataFile=this.getRealPath(`${this.prefix}${this.id}.dat`);this.boxJsJsonFile=this.getRealPath(`${this.prefix}${this.id}.boxjs.json`);this.options=i;this.isExecComm=false;this.isEnableLog=this.getVal(`${this.prefix}IsEnableLog${this.id}`);this.isEnableLog=this.isEmpty(this.isEnableLog)?true:JSON.parse(this.isEnableLog);this.isNotifyOnlyFail=this.getVal(`${this.prefix}NotifyOnlyFail${this.id}`);this.isNotifyOnlyFail=this.isEmpty(this.isNotifyOnlyFail)?false:JSON.parse(this.isNotifyOnlyFail);this.isEnableTgNotify=this.getVal(`${this.prefix}IsEnableTgNotify${this.id}`);this.isEnableTgNotify=this.isEmpty(this.isEnableTgNotify)?false:JSON.parse(this.isEnableTgNotify);this.tgNotifyUrl=this.getVal(`${this.prefix}TgNotifyUrl${this.id}`);this.isEnableTgNotify=this.isEnableTgNotify?!this.isEmpty(this.tgNotifyUrl):this.isEnableTgNotify;this.costTotalStringKey=`${this.prefix}CostTotalString${this.id}`;this.costTotalString=this.getVal(this.costTotalStringKey);this.costTotalString=this.isEmpty(this.costTotalString)?`0,0`:this.costTotalString.replace('"',"");this.costTotalMs=this.costTotalString.split(",")[0];this.execCount=this.costTotalString.split(",")[1];this.costTotalMs=this.isEmpty(this.costTotalMs)?0:parseInt(this.costTotalMs);this.execCount=this.isEmpty(this.execCount)?0:parseInt(this.execCount);this.logSeparator="\n";this.startTime=(new Date).getTime();this.node=(()=>{if(this.isNode()){const t=require("request");return{request:t}}else{return null}})();this.execStatus=true;this.notifyInfo=[];this.log(`${this.name}, 开始执行!`);this.execComm()}getRealPath(t){if(this.isNode()){let s=process.argv.slice(1,2)[0].split("/");s[s.length-1]=t;return s.join("/")}return t}async execComm(){if(this.isNode()){this.comm=process.argv.slice(1);let t=false;if(this.comm[1]=="p"){this.isExecComm=true;this.log(`开始执行指令【${this.comm[1]}】=> 发送到手机测试脚本！`);if(this.isEmpty(this.options)||this.isEmpty(this.options.httpApi)){this.log(`未设置options，使用默认值`);if(this.isEmpty(this.options)){this.options={}}this.options.httpApi=`ffff@10.0.0.9:6166`}else{if(!/.*?@.*?:[0-9]+/.test(this.options.httpApi)){t=true;this.log(`httpApi格式错误！格式：ffff@3.3.3.18:6166`);this.done()}}if(!t){this.callApi(this.comm[2])}}}}callApi(t){let s=this.comm[0];this.log(`获取【${s}】内容传给手机`);let i="";this.fs=this.fs?this.fs:require("fs");this.path=this.path?this.path:require("path");const e=this.path.resolve(s);const o=this.path.resolve(process.cwd(),s);const h=this.fs.existsSync(e);const r=!h&&this.fs.existsSync(o);if(h||r){const t=h?e:o;try{i=this.fs.readFileSync(t)}catch(t){i=""}}else{i=""}let n={url:`http://${this.options.httpApi.split("@")[1]}/v1/scripting/evaluate`,headers:{"X-Key":`${this.options.httpApi.split("@")[0]}`},body:{script_text:`${i}`,mock_type:"cron",timeout:!this.isEmpty(t)&&t>5?t:5},json:true};this.post(n,(t,i,e)=>{this.log(`已将脚本【${s}】发给手机！`);this.done()})}getCallerFileNameAndLine(){let t;try{throw Error("")}catch(s){t=s}const s=t.stack;const i=s.split("\n");let e=1;if(e!==0){const t=i[e];this.path=this.path?this.path:require("path");return`[${t.substring(t.lastIndexOf(this.path.sep)+1,t.lastIndexOf(":"))}]`}else{return"[-]"}}getFunName(t){var s=t.toString();s=s.substr("function ".length);s=s.substr(0,s.indexOf("("));return s}boxJsJsonBuilder(t,s){if(this.isNode()){if(!this.isJsonObject(t)||!this.isJsonObject(s)){this.log("构建BoxJsJson传入参数格式错误，请传入json对象");return}this.log("using node");let i=["settings","keys"];const e="https://raw.githubusercontent.com/Orz-3";let o={};let h="#lk{script_url}";if(s&&s.hasOwnProperty("script_url")){h=this.isEmpty(s["script_url"])?"#lk{script_url}":s["script_url"]}o.id=`${this.prefix}${this.id}`;o.name=this.name;o.desc_html=`使用说明</br>详情【<a href='${h}?raw=true'><font class='red--text'>点我查看</font></a>】`;o.icons=[`${e}/mini/master/Alpha/${this.id.toLocaleLowerCase()}.png`,`${e}/mini/master/Color/${this.id.toLocaleLowerCase()}.png`];o.keys=[];o.settings=[{id:`${this.prefix}IsEnableLog${this.id}`,name:"开启/关闭日志",val:true,type:"boolean",desc:"默认开启"},{id:`${this.prefix}NotifyOnlyFail${this.id}`,name:"只当执行失败才通知",val:false,type:"boolean",desc:"默认关闭"},{id:`${this.prefix}IsEnableTgNotify${this.id}`,name:"开启/关闭Telegram通知",val:false,type:"boolean",desc:"默认关闭"},{id:`${this.prefix}TgNotifyUrl${this.id}`,name:"Telegram通知地址",val:"",type:"text",desc:"Tg的通知地址，如：https://api.telegram.org/bot-token/sendMessage?chat_id=-100140&parse_mode=Markdown&text="}];o.author="#lk{author}";o.repo="#lk{repo}";o.script=`${h}?raw=true`;if(!this.isEmpty(t)){for(let s in i){let e=i[s];if(!this.isEmpty(t[e])){if(e==="settings"){for(let s=0;s<t[e].length;s++){let i=t[e][s];for(let t=0;t<o.settings.length;t++){let s=o.settings[t];if(i.id===s.id){o.settings.splice(t,1)}}}}o[e]=o[e].concat(t[e])}delete t[e]}}Object.assign(o,t);if(this.isNode()){this.fs=this.fs?this.fs:require("fs");this.path=this.path?this.path:require("path");const t=this.path.resolve(this.boxJsJsonFile);const i=this.path.resolve(process.cwd(),this.boxJsJsonFile);const e=this.fs.existsSync(t);const h=!e&&this.fs.existsSync(i);const r=JSON.stringify(o,null,"\t");if(e){this.fs.writeFileSync(t,r)}else if(h){this.fs.writeFileSync(i,r)}else{this.fs.writeFileSync(t,r)}let n="/Users/lowking/Desktop/Scripts/lowking.boxjs.json";if(s.hasOwnProperty("target_boxjs_json_path")){n=s["target_boxjs_json_path"]}let a=JSON.parse(this.fs.readFileSync(n));if(a.hasOwnProperty("apps")&&Array.isArray(a["apps"])&&a["apps"].length>0){let t=a.apps;let i=t.indexOf(t.filter(t=>{return t.id==o.id})[0]);if(i>=0){a.apps[i]=o}else{a.apps.push(o)}let e=JSON.stringify(a,null,2);if(!this.isEmpty(s)){for(const t in s){let i="";if(s.hasOwnProperty(t)){i=s[t]}else if(t==="author"){i="@lowking"}else if(t==="repo"){i="https://github.com/lowking/Scripts"}e=e.replace(`#lk{${t}}`,i)}}const h=/(?:#lk\{)(.+?)(?=\})/;let r=h.exec(e);if(r!==null){this.log(`生成BoxJs还有未配置的参数，请参考https://github.com/lowking/Scripts/blob/master/util/example/ToolKitDemo.js#L17-L18传入参数：\n`)}let l=new Set;while((r=h.exec(e))!==null){l.add(r[1]);e=e.replace(`#lk{${r[1]}}`,``)}l.forEach(t=>{console.log(`${t} `)});this.fs.writeFileSync(n,e)}}}}isJsonObject(t){return typeof t=="object"&&Object.prototype.toString.call(t).toLowerCase()=="[object object]"&&!t.length}appendNotifyInfo(t,s){if(s==1){this.notifyInfo=t}else{this.notifyInfo.push(t)}}prependNotifyInfo(t){this.notifyInfo.splice(0,0,t)}execFail(){this.execStatus=false}isRequest(){return typeof $request!="undefined"}isSurge(){return typeof $httpClient!="undefined"}isQuanX(){return typeof $task!="undefined"}isLoon(){return typeof $loon!="undefined"}isJSBox(){return typeof $app!="undefined"&&typeof $http!="undefined"}isStash(){return"undefined"!==typeof $environment&&$environment["stash-version"]}isNode(){return typeof require=="function"&&!this.isJSBox()}sleep(t){return new Promise(s=>setTimeout(s,t))}log(t){if(this.isEnableLog)console.log(`${this.logSeparator}${t}`)}logErr(t){this.execStatus=true;if(this.isEnableLog){console.log(`${this.logSeparator}${this.name}执行异常:`);console.log(t);console.log(`\n${t.message}`)}}msg(t,s,i,e){if(!this.isRequest()&&this.isNotifyOnlyFail&&this.execStatus){}else{if(this.isEmpty(s)){if(Array.isArray(this.notifyInfo)){s=this.notifyInfo.join("\n")}else{s=this.notifyInfo}}if(!this.isEmpty(s)){if(this.isEnableTgNotify){this.log(`${this.name}Tg通知开始`);for(let t in this.tgEscapeCharMapping){if(!this.tgEscapeCharMapping.hasOwnProperty(t)){continue}s=s.replace(t,this.tgEscapeCharMapping[t])}this.get({url:encodeURI(`${this.tgNotifyUrl}${this.name}\n${s}`)},(t,s,i)=>{this.log(`Tg通知完毕`)})}else{let o={};const h=!this.isEmpty(i);const r=!this.isEmpty(e);if(this.isQuanX()){if(h)o["open-url"]=i;if(r)o["media-url"]=e;$notify(this.name,t,s,o)}if(this.isSurge()){if(h)o["url"]=i;$notification.post(this.name,t,s,o)}if(this.isNode())this.log(""+this.name+t+s);if(this.isJSBox())$push.schedule({title:this.name,body:t?t+"\n"+s:s})}}}}getVal(t){if(this.isSurge()||this.isLoon()){return $persistentStore.read(t)}else if(this.isQuanX()){return $prefs.valueForKey(t)}else if(this.isNode()){this.data=this.loadData();return this.data[t]}else{return this.data&&this.data[t]||null}}setVal(t,s){if(this.isSurge()||this.isLoon()){return $persistentStore.write(s,t)}else if(this.isQuanX()){return $prefs.setValueForKey(s,t)}else if(this.isNode()){this.data=this.loadData();this.data[t]=s;this.writeData();return true}else{return this.data&&this.data[t]||null}}loadData(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs");this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile);const s=this.path.resolve(process.cwd(),this.dataFile);const i=this.fs.existsSync(t);const e=!i&&this.fs.existsSync(s);if(i||e){const e=i?t:s;try{return JSON.parse(this.fs.readFileSync(e))}catch(t){return{}}}else return{}}else return{}}writeData(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs");this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile);const s=this.path.resolve(process.cwd(),this.dataFile);const i=this.fs.existsSync(t);const e=!i&&this.fs.existsSync(s);const o=JSON.stringify(this.data);if(i){this.fs.writeFileSync(t,o)}else if(e){this.fs.writeFileSync(s,o)}else{this.fs.writeFileSync(t,o)}}}adapterStatus(t){if(t){if(t.status){t["statusCode"]=t.status}else if(t.statusCode){t["status"]=t.statusCode}}return t}get(t,s=(()=>{})){if(this.isQuanX()){if(typeof t=="string")t={url:t};t["method"]="GET";$task.fetch(t).then(t=>{s(null,this.adapterStatus(t),t.body)},t=>s(t.error,null,null))}if(this.isSurge()||this.isLoon())$httpClient.get(t,(t,i,e)=>{s(t,this.adapterStatus(i),e)});if(this.isNode()){this.node.request(t,(t,i,e)=>{s(t,this.adapterStatus(i),e)})}if(this.isJSBox()){if(typeof t=="string")t={url:t};t["header"]=t["headers"];t["handler"]=function(t){let i=t.error;if(i)i=JSON.stringify(t.error);let e=t.data;if(typeof e=="object")e=JSON.stringify(t.data);s(i,this.adapterStatus(t.response),e)};$http.get(t)}}post(t,s=(()=>{})){if(this.isQuanX()){if(typeof t=="string")t={url:t};t["method"]="POST";$task.fetch(t).then(t=>{s(null,this.adapterStatus(t),t.body)},t=>s(t.error,null,null))}if(this.isSurge()||this.isLoon()){$httpClient.post(t,(t,i,e)=>{s(t,this.adapterStatus(i),e)})}if(this.isNode()){this.node.request.post(t,(t,i,e)=>{s(t,this.adapterStatus(i),e)})}if(this.isJSBox()){if(typeof t=="string")t={url:t};t["header"]=t["headers"];t["handler"]=function(t){let i=t.error;if(i)i=JSON.stringify(t.error);let e=t.data;if(typeof e=="object")e=JSON.stringify(t.data);s(i,this.adapterStatus(t.response),e)};$http.post(t)}}put(t,s=(()=>{})){if(this.isQuanX()){if(typeof t=="string")t={url:t};t["method"]="PUT";$task.fetch(t).then(t=>{s(null,this.adapterStatus(t),t.body)},t=>s(t.error,null,null))}if(this.isSurge()||this.isLoon()){t.method="PUT";$httpClient.put(t,(t,i,e)=>{s(t,this.adapterStatus(i),e)})}if(this.isNode()){t.method="PUT";this.node.request.put(t,(t,i,e)=>{s(t,this.adapterStatus(i),e)})}if(this.isJSBox()){if(typeof t=="string")t={url:t};t["header"]=t["headers"];t["handler"]=function(t){let i=t.error;if(i)i=JSON.stringify(t.error);let e=t.data;if(typeof e=="object")e=JSON.stringify(t.data);s(i,this.adapterStatus(t.response),e)};$http.post(t)}}costTime(){let t=`${this.name}执行完毕！`;if(this.isNode()&&this.isExecComm){t=`指令【${this.comm[1]}】执行完毕！`}const s=(new Date).getTime();const i=s-this.startTime;const e=i/1e3;this.execCount++;this.costTotalMs+=i;this.log(`${t}耗时【${e}】秒\n总共执行【${this.execCount}】次，平均耗时【${(this.costTotalMs/this.execCount/1e3).toFixed(4)}】秒`);this.setVal(this.costTotalStringKey,JSON.stringify(`${this.costTotalMs},${this.execCount}`))}done(t={}){this.costTime();if(this.isSurge()||this.isQuanX()||this.isLoon()){$done(t)}}getRequestUrl(){return $request.url}getResponseBody(){return $response.body}isGetCookie(t){return!!($request.method!="OPTIONS"&&this.getRequestUrl().match(t))}isEmpty(t){return typeof t=="undefined"||t==null||t==""||t=="null"||t=="undefined"||t.length===0}randomString(t){t=t||32;var s="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";var i=s.length;var e="";for(let o=0;o<t;o++){e+=s.charAt(Math.floor(Math.random()*i))}return e}autoComplete(t,s,i,e,o,h,r,n,a,l){t+=``;if(t.length<o){while(t.length<o){if(h==0){t+=e}else{t=e+t}}}if(r){let s=``;for(var f=0;f<n;f++){s+=l}t=t.substring(0,a)+s+t.substring(n+a)}t=s+t+i;return this.toDBC(t)}customReplace(t,s,i,e){try{if(this.isEmpty(i)){i="#{"}if(this.isEmpty(e)){e="}"}for(let o in s){t=t.replace(`${i}${o}${e}`,s[o])}}catch(t){this.logErr(t)}return t}toDBC(t){var s="";for(var i=0;i<t.length;i++){if(t.charCodeAt(i)==32){s=s+String.fromCharCode(12288)}else if(t.charCodeAt(i)<127){s=s+String.fromCharCode(t.charCodeAt(i)+65248)}}return s}hash(t){let s=0,i,e;for(i=0;i<t.length;i++){e=t.charCodeAt(i);s=(s<<5)-s+e;s|=0}return String(s)}formatDate(t,s){let i={"M+":t.getMonth()+1,"d+":t.getDate(),"H+":t.getHours(),"m+":t.getMinutes(),"s+":t.getSeconds(),"q+":Math.floor((t.getMonth()+3)/3),S:t.getMilliseconds()};if(/(y+)/.test(s))s=s.replace(RegExp.$1,(t.getFullYear()+"").substr(4-RegExp.$1.length));for(let t in i)if(new RegExp("("+t+")").test(s))s=s.replace(RegExp.$1,RegExp.$1.length==1?i[t]:("00"+i[t]).substr((""+i[t]).length));return s}}(t,s,i)}
