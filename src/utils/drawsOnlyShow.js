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
export function draw(cav1, cav2, list, colorList) {
  cav = cav1
  canSave = cav2
  // 画布初始化
  ctx = cav.getContext('2d');
  ctxSave = canSave.getContext('2d');
  ctx.lineWidth = 2;


  ctxSave.lineWidth = 2;
  console.log(333, list)
  console.log(444, colorList)

  if (list && list.length > 0) {
    hasCanvas = true
    list.forEach((arr, i) => {
      let pointList = []
      arr.forEach(el => {
        pointList.push({
          x: parseInt(el.x / 2),
          y: parseInt(el.y / 2)
        })
      });
      canvasSave(pointList, colorList[i])
    });
    marksList = list
  } else {
    marksList = []
  }


}



// 存储已生成的点线
function canvasSave(pointArr, selColor) {
  ctxSave.clearRect(0, 0, ctxSave.width, ctxSave.height);
  if (pointArr.length > 1) {
    ctxSave.beginPath();
    ctxSave.moveTo(pointArr[0].x, pointArr[0].y);
    for (var i = 1; i < pointArr.length; i++) {
      ctxSave.lineTo(pointArr[i].x, pointArr[i].y);
      ctxSave.fillStyle = 'rgba(161,195,255,.3)'; //填充颜色
      //ctxSave.fill();
      if (selColor) {
        ctxSave.strokeStyle = selColor;
      } else {
        ctxSave.strokeStyle = '#0f0';
      }

      ctxSave.lineWidth = 2;
      ctxSave.stroke(); //绘制
    }
    ctxSave.closePath();
  }
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
