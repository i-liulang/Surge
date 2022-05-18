var list = ["邯郸","无锡","泉州","上海"];
const url = "https://view.inews.qq.com/g2/getOnsInfo?name=disease_h5";
var ala="";
var num1="";
var num2="";
var num11="";
var num22="";
function num(location, result) {
  var loc = location;
  var resu = result;
  var loc_newcf = new RegExp(loc + "[\\s\\S]*?confirm[\\s\\S]{3}(\\d+)");
  var loc_wzz = new RegExp(loc + "[\\s\\S]*?wzz_add[\\s\\S]{3}(\\d+)");
  let loc_newcf_res = loc_newcf.exec(resu);
  let loc_wzz_res = loc_wzz.exec(resu);
  if (loc_newcf_res) {
  num1=loc_newcf_res[1].padStart(6,"\u0020");
  num2=loc_wzz_res[1].padStart(6,"\u0020");
    num11=num1.replace(/\s/g, "");
    num22=num2.replace(/\s/g, "");
    ala = ala +loc +":  确诊"+num11.padStart(num11.length,"\u0020")+"例, 无症状"+num22.padStart(num22.length,"\u0020")+ "例\n";
  } else {
    ala = ala + loc + ":  无数据\n";
  }
};
$httpClient.get(url, function(error, response, data){
  let res = data;
  for (var i = 0; i < list.length; i++) {
    num(list[i], res);
    if (i == list.length - 1) {
     $done({
       title: "𝗖𝗢𝗩𝗜𝗗-𝟭𝟵",
       icon:"heart.text.square",
       "icon-color":"#E94335",
       content: ala.replace(/\n$/, "").replace("确诊0例, 无症状0例", "无").replace("确诊0例, ", "").replace(", 无症状0例", "")
     });
    }
  }
});
