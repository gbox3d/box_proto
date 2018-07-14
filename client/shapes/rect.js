exports.RectShapObj = function (x,y,w,h,fillstyle) {

  let _x,_y,_w,_h;

  let _fillstyle = fillstyle;

  _x = x;
  _y = y;
  _w = w;
  _h = h;

  this.draw = function (context) {

    context.fillStyle = _fillstyle;
    context.fillRect(_x,_y,_w,_h);

  }

}

