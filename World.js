//世界属性
var world={
	horz:0,//地平线
	g:new Vector2(0,0.01)//重力加速度
}
var _global={
	offsetCanvas:null
};
var util={
	depthClone:function(from,to){//属性绑定
		for(let pro in from){
			if(typeof from[pro]=='object'){
				to[pro]=(from[pro].constructor=='array')?[]:{};
					this.depthClone(from[pro],to[pro]);
			}else{
				to[pro]=from[pro];
			}
		}
	},
	inherits:function(Child, Parent) {//原型继承
    var F = function () {};
    F.prototype = Parent.prototype;
    Child.prototype = new F();
    Child.prototype.constructor = Child;
},
	offsetCanvas:function(ctx){//离屏canvas
	    _global.offscreenCanvas = document.createElement('canvas'),
	    _global.offscreenContext = _global.offscreenCanvas.getContext('2d');

	    _global.offscreenCanvas.width = ctx.canvas.width;
	    _global.offscreenCanvas.height = ctx.canvas.height;
	},
	timer:function(){//计时器
		var time=0;
		return function(){
			return time++;
		}
	}
}


var	Tweens={
		Linear:function(t,b,c,d){ //无缓动
			return c*t/d+b;	
		},
		easeIn: function(t,b,c,d){
			return c*(t/=d)*t + b;
		},
		easeOut: function(t,b,c,d){
			return -c *(t/=d)*(t-2) + b;
		},
		easeInOut: function(t,b,c,d){
			if ((t/=d/2) < 1) return c/2*t*t + b;
			return -c/2 * ((--t)*(t-2) - 1) + b;
		}
}





var FouceType={
	tanli:function(k,target,x){
		retrun (target.x)*k;
	},
	hengli:function(f){
		return f;
	},
}

//公式
function Vector2(x=0,y=0){
	if(!(this instanceof Vector2)){
		return new Vector2(x,y);
	}
	this.x=x;
	this.y=y;
}
Vector2.prototype.copy = function(argument){
	return new Vector2(this.x, this.y);
};
Vector2.prototype.length = function(argument){
	return Math.sqrt(this.x * this.x + this.y * this.y);
};
Vector2.prototype.normalize = function(argument){
	var inv = 1 / this.length(); 
     return new Vector2(this.x * inv, this.y * inv);
};
Vector2.prototype.negate = function(v){
	return new Vector2(-this.x, -this.y);
};
Vector2.prototype.add = function(v){
	this.x += v.x, this.y += v.y;
};
Vector2.prototype.subtract = function(v){
	return new Vector2(v.x - this.x, v.y - this.y);
};
Vector2.prototype.multiply = function(f){
	 this.x * f ;
	 this.y * f;
	 return this;
};
Vector2.prototype.divide = function(f){
	var invf = 1 / f; 
    return new Vector2(this.x * invf, this.y * invf);
};
Vector2.prototype.dot = function(v){
	return this.x * v.x + this.y * v.y;
};
Vector2.prototype.move = function(v){
        this.x=v.x;
        this.y=v.y;
        return this;
};
Vector2.prototype.rotate = function(angle=0){
    	var _angle=angle/180*Math.PI;
    	this.x1=this.x*Math.cos(_angle)-this.y*Math.sin(_angle);
    	this.y1=this.x*Math.sin(_angle)+this.y*Math.cos(_angle);
};


function motion(x,y) {
	Vector2.call(this,x,y);
}



const _pro=[motion,Fouce];

_pro.forEach( function(element, index) {
	util.inherits(element,Vector2);
});
//实现继承
//私有原型
motion.prototype.uniformspeed=function(obj){
		if(obj.x&&obj.y){
			obj.x+=this.x;
			obj.y+=this.y;
		}
	}
motion.prototype.changespeed=function(obj,a){
			this.x+=a.x;
			this.y+=a.y;
		this.uniformspeed(obj);
	},
motion.prototype.addFouceAppend=function(f,m,obj){
		if(f.constructor ==Vector2){
			this.a=m?f.multiply(1/m):console.log('obj do not have m');
			this.changespeed(obj,this.a);
		}else{
			console.log('请输入正常数据');
		}
}


//.addFouceAppend(new Vector2(2,2),{m:2})

function Fouce(x,y){
	Vector2.call(this,x,y);

}




function Sprite(option){
	util.depthClone(option,this);
	this.pos=new Vector2(option.pro.x,option.pro.y);
	this.v =new motion(option.pro.vx,option.pro.vy);
	this.m =option.pro.m?option.pro.m:1;
	this.Fouce=new Vector2(0,0.01);
	this.rotation=0;
	this.Fun=[option.draw,option.logic];
	this.logic=option.logic?option.logic:new Function();
	this.easing=0.1;
	this.timer=0;//自身计时器
	this.state='PENDDING';//运动状态PEDDING MOVEING
	this.moveList=[];//运动序列
	this.move_site=null;
	//this.init();
}
//ease in | out 
Sprite.prototype.moveTo = function(site,time,type){
	var dir=this.pos.subtract(site);
	var ease,pos=0,_self=this;
	_self.move_site==null?_self.move_site=_self.pos:'';
	//_self.pos.x==Math.floor(site.x)?_self.state='PENDDING':console.log(1);
	if(Math.abs(Math.floor(_self.pos.x-site.x))<=1){
		_self.state='PENDDING'
		_self.v.x=0;
		_self.v.y=0;
	}else{
		_self.state='MOVING'
	}
	//console.log(_self.state)
	if(Tweens[type]&&_self.state=='MOVING'){
		_self.v.x=Tweens[type](_self.timer,_self.move_site.x,site.x,time)*0.01;
		_self.v.y=Tweens[type](_self.timer,_self.move_site.y,site.y,time)*0.01;
		_self.v.uniformspeed(_self.pos);
			//时间判定是否结束
		if(_self.timer==time){
			_self.timer=0;
			_self.move_site=null;
		}else{
			_self.timer+=1;
		}

	}else{
		//console.error(`not a type of Easying${_self.state}`);
	}
	// this.v.add(dir.multiply(ease));
	//this.pos.x==site.x&&this.pos.y==site.y?this.v.x=this.v.y=0:'';
};
Sprite.prototype.move = function(a=1){
	this.v.changespeed(this.pos,a);
};
Sprite.prototype.init = function(ctx){//问题严重
	var ctx=ctx;
	if(!ctx){
		_global.context?ctx=_global.context:console.error('can not get context of canvas');
	}
	if(!_global.offscreenContext){
		util.offsetCanvas(ctx);
	}
	var self=this;
	_global.offscreenContext.save();
	_global.offscreenContext.translate(this.pos.x,this.pos.y);
	_global.offscreenContext.rotate(this.rotation);
	self.v.addFouceAppend(self.Fouce,self.m,self.pos);
	self.Fun[0].call(this,_global.offscreenContext);
	_global.offscreenContext.restore();
	_global.context.drawImage(_global.offscreenCanvas, 0, 0, 
    _global.offscreenCanvas.width, _global.offscreenCanvas.height);
    _global.offscreenContext.clearRect(0,0, _global.offscreenCanvas.width, _global.offscreenCanvas.height);
};
Sprite.prototype.raotate = function(angle){
	this.rotation=angle;
};
//normal Fouce | pause Fouce
Sprite.prototype.addFouce = function(site,type){
	var _self=this;
	var f=new Vector2(site.x,site.y);
	switch (type) {
		case 'shunjian':
			var a=f.multiply(1/_self.m);
			this.v.add(a);
			break;
		default:
			_self.Fouce.add(f);
			break;
	}

};
Sprite.prototype.IK = function(site,type){
	
};
Sprite.prototype.FK = function(site,type){
	
};



function linkList(obj_list=[]){
	this.obj_list=obj_list;
}