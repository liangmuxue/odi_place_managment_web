/**
 * 画布中绘制多边形
 * 参数: cav-画布对象  list-多边形数组 i-选中多边形下标
 **/
export var marksList = []
var cav
var canSave
var ctx
var ctxSave
var pointX, pointY;
var pointArr = []; //存放坐标的数组
var oIndex = -1; //判断鼠标是否移动到起始点处，-1为否，1为是
var hasCanvas

/* 操作执行方法分发 */
export function draw(cav1, cav2, list) {
  cav = cav1
  canSave = cav2
  // 画布初始化
  ctx = cav.getContext('2d');
  ctxSave = canSave.getContext('2d');
  ctx.strokeStyle = '#0f0';
  ctx.lineWidth = 2;

  ctxSave.strokeStyle = '#0f0';
  ctxSave.lineWidth = 2;

  if (list && list.length > 0) {
    hasCanvas = true
    let pointList = []
    list.forEach(el => {
      pointList.push({
        x: parseInt(el.x / 2),
        y: parseInt(el.y / 2)
      })
    });
    canvasSave(pointList)
    marksList = list
  } else {
    marksList = []
  }

  /*点击画点*/
  cav.onmousedown = function (e) {
    if (hasCanvas) {
      ctxSave.clearRect(0, 0, cav.width, cav.height);
      hasCanvas = false
      marksList = []
    }
    if (e.offsetX || e.layerX) {
      pointX = e.offsetX == undefined ? e.layerX : e.offsetX;
      pointY = e.offsetY == undefined ? e.layerY : e.offsetY;
      var piX, piY;
      if (oIndex > 0 && pointArr.length > 0) {
        piX = pointArr[0].x;
        piY = pointArr[0].y;
        let newPoint = {
          x: piX,
          y: piY
        }
        if (!lineOverlap(newPoint)) {
          //画点
          makearc(ctx, piX, piY, GetRandomNum(2, 2), 0, 180, 'rgba(102,168,255,1)');
          pointArr.push({
            x: piX,
            y: piY
          });
          canvasSave(pointArr); //保存点线同步到另一个canvas
          saveCanvas(); //生成画布
        }
      } else {
        piX = pointX;
        piY = pointY;
        let newPoint = {
          x: piX,
          y: piY
        }
        if (!lineOverlap(newPoint)) {
          makearc(ctx, piX, piY, GetRandomNum(2, 2), 0, 180, 'rgba(102,168,255,1)');
          pointArr.push({
            x: piX,
            y: piY
          });
          canvasSave(pointArr); //保存点线同步到另一个canvas
        }

      }
    }
  }


  /*
   *鼠标移动
   */
  cav.onmousemove = function (e) {
    if (e.offsetX || e.layerX) {
      pointX = e.offsetX == undefined ? e.layerX : e.offsetX;
      pointY = e.offsetY == undefined ? e.layerY : e.offsetY;
      var piX, piY;
      /*清空画布*/
      ctx.clearRect(0, 0, cav.width, cav.height);
      /*鼠标下跟随的圆点*/
      makearc(ctx, pointX, pointY, GetRandomNum(4, 4), 0, 180, 'rgba(102,168,255,1)');

      if (pointArr.length > 0) {
        if ((pointX > pointArr[0].x - 15 && pointX < pointArr[0].x + 15) && (pointY > pointArr[0].y - 15 && pointY < pointArr[0].y + 15)) {
          if (pointArr.length > 1) {
            piX = pointArr[0].x;
            piY = pointArr[0].y;
            ctx.clearRect(0, 0, cav.width, cav.height);
            makearc(ctx, piX, piY, GetRandomNum(4, 4), 0, 180, 'rgba(102,168,255,1)');
            oIndex = 1;
          }
        } else {
          piX = pointX;
          piY = pointY;
          oIndex = -1;
        }


        /*开始绘制*/
        ctx.beginPath();
        ctx.moveTo(pointArr[0].x, pointArr[0].y);
        if (pointArr.length > 1) {
          for (var i = 1; i < pointArr.length; i++) {
            ctx.lineTo(pointArr[i].x, pointArr[i].y);
          }
        }
        ctx.lineTo(piX, piY);
        ctx.fillStyle = 'rgba(161,195,255,.3)'; //填充颜色
        ctx.fill(); //填充
        ctx.stroke(); //绘制
      }
    }
  }
}
// 判断绘制线段是否重叠的
function lineOverlap(newPoint) {
  let i = pointArr.length
  let lastLineA = pointArr[i - 1]
  let lastLineB = newPoint
  let lines = getAllLine()
  let isOverlap = false
  lines.forEach(el => {
    if (!hasSamePoint(el.a, el.b, lastLineA, lastLineB)) {
      if (segmentsIntr(el.a, el.b, lastLineA, lastLineB)) {
        isOverlap = true
      }
    }
  });
  return isOverlap;

}

// 获取所有线段
function getAllLine() {
  let lines = []
  pointArr.forEach((el, i) => {
    if (i > 0) {
      lines.push({
        a: pointArr[i - 1],
        b: el
      })
    }
  });
  return lines
}
// 判断线段是否有重复点位
function hasSamePoint(a, b, c, d) {
  if (a.x == c.x && a.y == c.y) {
    return true
  } else if (a.x == d.x && a.y == d.y) {
    return true
  } else if (b.x == c.x && b.y == c.y) {
    return true
  } else if (b.x == d.x && b.y == d.y) {
    return true
  } else {
    return false
  }
}

//判断两条线段是否相交
function segmentsIntr(a, b, c, d) {
  /** 1 解线性方程组, 求线段交点. **/
  // 如果分母为0 则平行或共线, 不相交  
  var denominator = (b.y - a.y) * (d.x - c.x) - (a.x - b.x) * (c.y - d.y);
  if (denominator == 0) {
    return false;
  }

  // 线段所在直线的交点坐标 (x , y)      
  var x = ((b.x - a.x) * (d.x - c.x) * (c.y - a.y) +
    (b.y - a.y) * (d.x - c.x) * a.x -
    (d.y - c.y) * (b.x - a.x) * c.x) / denominator;
  var y = -((b.y - a.y) * (d.y - c.y) * (c.x - a.x) +
    (b.x - a.x) * (d.y - c.y) * a.y -
    (d.x - c.x) * (b.y - a.y) * c.y) / denominator;

  /** 2 判断交点是否在两条线段上 **/
  if (
    // 交点在线段1上  
    (x - a.x) * (x - b.x) <= 0 && (y - a.y) * (y - b.y) <= 0
    // 且交点也在线段2上  
    &&
    (x - c.x) * (x - d.x) <= 0 && (y - c.y) * (y - d.y) <= 0
  ) {
    // 返回交点p  
    return true
  }
  //否则不相交  
  return false


}

// 存储已生成的点线
function canvasSave(pointArr) {
  ctxSave.clearRect(0, 0, ctxSave.width, ctxSave.height);
  ctxSave.beginPath();
  if (pointArr.length > 1) {
    ctxSave.moveTo(pointArr[0].x, pointArr[0].y);
    for (var i = 1; i < pointArr.length; i++) {
      ctxSave.lineTo(pointArr[i].x, pointArr[i].y);
      ctxSave.fillStyle = 'rgba(161,195,255,.3)'; //填充颜色
      //ctxSave.fill();
      ctxSave.stroke(); //绘制
    }
    ctxSave.closePath();
  }
}

/*生成画布 结束绘画*/
function saveCanvas() {
  ctx.clearRect(0, 0, cav.width, cav.height);
  ctxSave.closePath(); //结束路径状态，结束当前路径，如果是一个未封闭的图形，会自动将首尾相连封闭起来
  ctxSave.fill(); //填充
  ctxSave.stroke(); //绘制
  console.log(666, pointArr)
  marksList = []
  pointArr.forEach(el => {
    marksList.push({
      x: el.x * 2,
      y: el.y * 2
    })
  });
  pointArr = [];
  hasCanvas = true
}


/*验证canvas画布是否为空函数*/
function isCanvasBlank(canvas) {
  var blank = document.createElement('canvas'); //创建一个空canvas对象
  blank.width = canvas.width;
  blank.height = canvas.height;
  return canvas.toDataURL() == blank.toDataURL(); //为空 返回true
}

/*canvas生成圆点*/
function GetRandomNum(Min, Max) {
  var Range = Max - Min;
  var Rand = Math.random();
  return (Min + Math.round(Rand * Range));
}

function makearc(ctx, x, y, r, s, e, color) {
  ctx.clearRect(0, 0, 199, 202); //清空画布
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.arc(x, y, r, s, e);
  ctx.fill();
}

export function clearCtx() {
  ctx.clearRect(0, 0, cav.width, cav.height);
  ctxSave.closePath(); //结束路径状态，结束当前路径，如果是一个未封闭的图形，会自动将首尾相连封闭起来
  ctxSave.fill(); //填充
  ctxSave.stroke(); //绘制
  marksList = []
  pointArr.forEach(el => {
    marksList.push({
      x: el.x * 2,
      y: el.y * 2
    })
  });
  pointArr = [];
  hasCanvas = true
}
