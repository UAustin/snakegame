var log = function() {
    console.log.apply(console, arguments)
}

var e = function(selector) {
    return document.querySelector(selector)
}

var es = function(selector) {
    return document.querySelectorAll(selector)
}

function Snake(direction, head, color){
		// 初始化长度
		this.size = 4
		// 蛇头方向
		this.direction = direction
		// 颜色
		this.color = color
		// 蛇头
		this.head = head
		// 足迹
		this.spoor = []
		// 生命
		this.life = true
}
// 蛇吃食，长度增加
Snake.prototype.eat = function(){
		this.size ++
};

// 方向控制, 防止蛇倒走
Snake.prototype.move = function(d){
	var keyEvent = d||event
	switch(keyEvent.keyCode){
		case 38:
		if(this.direction == 2){
				break
		}
		this.direction = 0
				break;
		case 39:
		if(this.direction == 3){
				break
		}
		this.direction = 1
				break
		case 40:
		if(this.direction == 0){
				break
		}
		this.direction = 2
				break
		case 37:
		if(this.direction == 1){
				break
		}
		this.direction = 3
				break
	}
	// log("蛇头在：" + this.head)
}

// object fooder
function Fooder(energy, color){
		this.pos = 0;
		this.energy = energy
		this.color = color
}

// 投食物
Fooder.prototype.create = function(snakeBody){
		var state = false
		do {
			// 随机生产食物坐标
			this.pos = Math.round(Math.random() * 400)
			state = false
				// 通过ID获取蛇身格子的编号，如果生产的食物坐标与蛇身重复，则重新循环生成食物
				for(var i = 0; i < snakeBody.length; i++){
					if(this.pos in snakeBody){
						// log("false")
						state = true
						break
					}
				}
		} while (state)
		  log(this.pos)
}

// object map
function Map(width, height, color){
		// 存储格子们的数组，节点对象类数组
		this.iPos = []
		this.width = width
		this.height = height
		// 地图颜色
		this.color = color
		// 用来存储贪吃蛇身体坐标的数组
		this.snakeBody = []
		this.snakeHead = null
}
// 绘制地图
Map.prototype.scene = function(gridSize){
		var oWrap = document.createElement("div")
		item = null
		oWrap.id = "id-map"
		document.body.appendChild(oWrap)
		for(var j = 0; j < this.width; j++){
			for(var i = 0; i < this.height; i++){
				item = document.createElement("i")
				item.style.width = gridSize
				item.style.height = gridSize
				// item.style.border = "1px solid #ccc"
				item.style.display = "inline-block"
				item.style.float = "left"
				item.style.background = this.color
				item.pos = {x:i, y:j}
				oWrap.appendChild(item)
				// 每个格子
				this.iPos.push(item)
			}
		}
		oWrap.style.width = this.width * item.offsetWidth + "px"
}

// 绘制食物
Map.prototype.canvasFood = function(pos){
		// 通过pos（索引值）设置当前格子的颜色
		this.iPos[pos].style.background = "#9ACD32"
}

// 绘制贪吃蛇
Map.prototype.canvasSnake = function(size, direction, spoor){
		// 获取蛇身序列数组
		for(var i = 0;i < size; i++){
				// 从蛇走过的所有足迹里截取最新的部分
				this.snakeBody = spoor.slice(spoor.length - size, spoor.length)
		}
		// 显示蛇行走路径
		for(var i = 0;i < this.snakeBody.length; i++){
				// 显示蛇身
				if(this.iPos[this.snakeBody[i]]){
						this.iPos[this.snakeBody[i]].style.background = "#9ACD32"
				}
				// 序列第一个——蛇头,备用
					this.snakeHead = this.iPos[spoor.slice(spoor.length - 1)]
			}
		  // 把总足迹里，蛇身以外的部分隐藏
			var titeml = spoor.slice(spoor.length - size- 1,spoor.length - size)
			if(titeml > 0 && spoor.length > 3){
				// 清扫蛇尾
				this.iPos[titeml].style.background = "#fff"
				// log("test:" + titeml)
			}
}

// 控制器
function Control(gridSize){
		this.map = new Map(20, 20, "#fff")
		var headIndex
		var secondIndex
		this.map.scene(gridSize)

}

// 游戏开始
Control.prototype.begin = function(gameSpeed){
		var _this = this
		var map = this.map
		var snake = new Snake(1, 0, "#9ACD32")
		var food = new Fooder(1, "#9ACD32")
		food.create(this.map.snakeBody)
		map.canvasFood(food.pos)
		document.onkeydown = function(){
			snake.move()
			log("前进方向:" + snake.direction)
		}
		// alert(map.iPos[19].pos.x)
		var into = window.setInterval(function(){
			switch(snake.direction){
				case 0:
				snake.head -= 20
            break
				case 1:
				snake.head ++
            break
				case 2:
				snake.head += 20
            break
				case 3:
				snake.head --
            break
			}
			// 通过蛇头的位置记录蛇的足迹
			snake.spoor.push(snake.head)
			map.canvasSnake(snake.size, snake.direction, snake.spoor)
			// 如果蛇与食物重叠，判定为吃到
			if(food.pos == map.snakeBody.slice(map.snakeBody.length - 1)){
				snake.eat()
				food.create(map.snakeBody)
				map.canvasFood(food.pos)
			}
			// 游戏失败判断
			// 蛇头——蛇身数组最后一位
			headIndex = map.snakeBody.slice(map.snakeBody.length-1)[0]
			// 蛇头后一格
			secondIndex = map.snakeBody.slice(map.snakeBody.length-2, map.snakeBody.length-1)[0]
			if(map.snakeBody.length>4){
				// 蛇头以外的身体
				var arr = map.snakeBody.slice(0,map.snakeBody.length-1)
				document.title = headIndex + "-" + arr
				// 吃自己
				for(var i = 0;i < arr.length; i++){
					log(headIndex)
					if(headIndex == arr[i]){
						window.clearInterval(into)
						snake.life = false
						_this.over()
					}
				}
			}
			// 上下越界 左右越界
			document.title = snake.head
			// 蛇头与第二节的距离，如果大于1，可以判定左右越界
			if(map.iPos[headIndex]){
				var dis = map.snakeBody.length > 2 ? Math.abs(map.iPos[headIndex].pos.x - map.iPos[secondIndex].pos.x) : 0
			}
			if(snake.head < 0 || snake.head > 399 || dis > 1){
				window.clearInterval(into)
				snake.life = false
				_this.over()
			}
		}, gameSpeed)
};

// 游戏失败
Control.prototype.over = function(){
		alert("Sorry, GAME OVER!")
}

window.onload = function(){
		var size = e("#id-size")
		var speed = e("#id-speed")
		var start = e("#id-start")
		var restart = e("#id-restart")


		var game = new Control(size.value + "px")
		  start.onclick = function(){
			game.begin(parseInt(speed.value))
			size.disabled = true
			speed.disabled = true
			start.disabled = true
		}
		size.onchange = function(){
			var item = es("i"),
				map = e("#id-map")
			for(var i = 0;i < item.length; i++){
				item[i].style.width = this.value + "px"
				item[i].style.height = this.value + "px"
			}
			map.style.width = item[0].offsetWidth * 20 + "px"
		}
		restart.onclick = function(){
			window.location.reload()
		}
}
