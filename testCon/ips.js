
var ip=transitIp('::1');
console.log(ip);
function transitIp(ipaddr)//将IPV6地址补全
{
 var ipaddress = ipaddr.split("/");
 var ipaddrs = ipaddress[0].split(":");
 if(ipaddrs.length<8)
 {
 var count = 0;
 for(var i=0;i<ipaddrs.length;i++)
 {
 if(ipaddrs[i]=="")
 {
 if(count==1)
 {
  ipaddrs[i] = addZero(4);
  continue;
 }
 ipaddrs[i] = addZero((9-ipaddrs.length)*4);
 count++;
 }
 else
 {
 ipaddrs[i] += ":";
 }
 }
 }
 else if(ipaddrs.length==8)
 {
 for(var i=0;i<8;i++)
 {
 ipaddrs[i] += ":";
 }
 }
 ////上述补齐完成，将内容放置于ipaddrs中，但不标准
 return initaddr(ipaddrs);//获得了ip地址的完整字符串
}
function addZero(num)
{
 var zerostr = "";
 for(var i=1;i<num+1;i++)
 {
 zerostr+="0";
 if(i%4==0)
 {
 zerostr+=":";
 }
 }
 return zerostr;
}
function initaddr(ipaddrs)
{
 var iparray ="";
 for(var i=0;i<ipaddrs.length;i++)
 {
 iparray+=ipaddrs[i];
 }
 if(iparray.charAt(iparray.length-1)==':')
 {
 iparray = iparray.substr(0,iparray.length-1);
 }
 //var iparrays = iparray.split(":");
 //return iparrays;
 return iparray;
}