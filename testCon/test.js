// var a=0;
// console.log(a||15);
// a=16;
// console.log(a||15);
// a=17;
// console.log(a||15);


var parent=[];
parent.push({id:1,	name:'1',	parent_id:1});
parent.push({id:11,	name:'1_1',	parent_id:1});
parent.push({id:12,	name:'1_2'	,parent_id:1});
parent.push({id:111	,name:'1_1_1'	,parent_id:11});
parent.push({id:1111,	name:'1_1_1_1'	,parent_id:111});
parent.push({id:121,name:'1_2_1'	,parent_id:12});
parent.push({id:1112,	name:'1_1_1_2'	,parent_id:111});
parent.push({id:11121	,name:'1_1_1_2_1',	parent_id:1112});
parent.push({id:122	,name:'1_2_2',	parent_id:12});
parent.push({id:1221,name:'1_2_2_1',parent_id:	122});

// console.log(parent);
// getTree(12);
// testSecneType();
test1();
function test1(){
  var a=1;
  if(1)
    console.log('......1');
    if(0)
      console.log('......0');
      if(2)
        console.log('......2');
}
function testSecneType(){
  // var scene='sal-2343423423';
  var scene='1008';
  var t,v;
  if(scene.substr(0,4)=='sal-'){
    t='sal';
    v =scene.substr(4,scene.length-4);
  }
  console.log(t);
  console.log(v);
}
function getTree(id) {
  parent.forEach(function (item) {
   if( item.parent_id==id&&item.parent_id!=item.id){
      console.log(item);
      getTree(item.id);
    }
  });
}
// test();
// arrSwtich();

function arrSwtich(){
  var arr=[];
  for(var i=1;i<11;i++)
    arr.push(i);
  // 交换数组元素
  var swapItems = function(arr, index1, index2) {
    arr[index1] = arr.splice(index2, 1, arr[index1])[0];
    return arr;
  };
  var d= arr.splice(1,1);
  arr.splice(0,0,d[0]);
  var d1= arr.splice(5,1);
  arr.splice(0,0,d1[0]);

  // console.log(d);
  console.log(arr);
}
function test(){
  const date = new Date();
   console.log(date);

   console.log(date.getMonth());
   console.log(date.getDate());
   console.log(date.getHours());

   console.log(date.getMonth());
   console.log(date.getDay());
   console.log(date.getHours());
// date.getMonth(), 2, '0') + _.padStart(date.getDay(), 2, '0') + _.padStart(date.getHours() 

}