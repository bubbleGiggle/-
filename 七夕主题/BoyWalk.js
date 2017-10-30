// JavaScript Document
function BoyWalk(){
  var container=$("#content");
  var visualWidth=container.width();
  var visualHeight=container.height();
  
  var swipe=Swipe(container);
  
  var getValue=function(classname){
	  var $elem=$(classname);
	  return{
		  height:$elem.height(),
		  top:$elem.position().top
		  };
	  };
	  
  var pathY=function(){
	  var data=getValue('.a_background_middle');
	  return data.top+data.height/2;}();
  var $boy=$("#boy");
  var boyHeight=$boy.height();
  $boy.css({
	  top:pathY-boyHeight+25});
  //小男孩走路的动作
  function slowWalk(){
	  $boy.addClass('slowWalk');}
	  
  function pauseWalk(){
	  $boy.addClass('pauseWalk');}
   
  function restoreWalk(){
	  $boy.removeClass('pauseWalk');}
  
  function calculateDist(direction,proportion){
	  return (direction=="x"?visualWidth:visualHeight)*proportion;}
  //小男孩移动
  function startRun(options,runtime){
	  var dfdPlay=$.Deferred();
	  restoreWalk();
	  $boy.transition(options,runtime,'linear',function(){dfdPlay.resolve();});
	  return dfdPlay;
	  }
//小男孩走路的动作+小男孩移动=小男孩向前走路
  function walkRun(time,distX,disY){
	  time=time||3000;
	  slowWalk();
	  var d1=startRun({
		  'left':distX+'px',
		  'top':disY?disY:undefined},time);
	  return d1;}

function walkToShop(){
	var defer=$.Deferred();
	var door=$('.door');
	var offsetDoor=door.offset();
	var doorOffsetLeft=offsetDoor.left;
	var offsetBoy=$boy.offset();
	var boyOffsetLeft=offsetBoy.left;
	
	instanceX=(doorOffsetLeft+door.width()/2)
	-(boyOffsetLeft+$boy.width()/2);
	
	var walkPlay=startRun({transform:'translateX('+instanceX+'px),scale(0.3,0.3)'},2000);
	walkPlay.done(function(){
		$boy.css({opacity:0});
		defer.resolve();
		});
	return defer;
}

function walkOutShop(runtime){
	var defer=$.Deferred();
	restoreWalk();
	var walkPlay=startRun({transform:'translateX('+instanceX+'px),scale(1,1)',opacity:1},runtime);
	walkPlay.done(function(){
		$boy.css({opacity:0});
		defer.resolve();
		});
	return defer;	
	}	

function takeFlower(){
	var defer=$.Deferred();
	setTimeout(function(){
		$boy.addClass('slowFlowerWalk');
		defer.resolve();
		},1000);
	return defer;
	}
	  
  return{
	  //开始走路
	  walkTo:function(time,proportionX,proportionY){
		  var distX=calculateDist('x',proportionX);
		  var distY=calculateDist('y',proportionY);
		  return walkRun(time,distX,distY);},
	  toShop:function(){return walkToShop.apply(null,arguments);},
	  outShop:function(){return walkOutShop.apply(null,arguments);},
	  stopWalk:function(){
		  pauseWalk();},
	  setColor:function(value){
		  $boy.css('background-color',value);},
	  takeFlower:function(){
		  return takeFlower();},
	  getWidth:function(){
		  return $boy.width();},
	  resetOriginal:function(){
		  this.stopWalk();
		  $boy.removeClass('slowWalk slowFlowerWalk').addClass('boyOriginal');},
	  rotate:function(callback){
		  restoreWalk();
		  $boy.addClass('boy-turnback');
		  if(callback){
			  $boy.on( 'webkitAnimationEnd ',function(){callback();$(this).off();});}}
	  }  
    
	}