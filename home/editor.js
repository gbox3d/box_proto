
function lm_editor(_) {

 

  let editorObj = {
    selectObj : null
  }

  let _Objlist =  _.Objlist;
  let canvas = _.canvas;

  function _mouseDown(evt) {

    let rect = canvas.getBoundingClientRect()

    let x = evt.clientX - rect.left;
    let y = evt.clientY - rect.top;


    x -= canvas.width / 2;
    y -= canvas.height / 2

    for(var i=_Objlist.length-1; i >= 0 ;i--) {

      let _obj = _Objlist[i];

      console.log(_obj)

      if(_obj.box_rgn) {
        if( _obj.box_rgn.ptInBox(x,y) ) {
          console.log('hit')
          editorObj.selectObj = _obj;
          OnMouseMove = _mouseDrag;
          break;
        }
      }

    }
  }

  let _prevX=0;
  let _prevY=0;
  function _mouseDrag(evt) {
    console.log( evt);
    var movementX = (_prevX ? evt.screenX - _prevX : 0)
    var movementY = (_prevY ? evt.screenY - _prevY : 0)
    _prevX = evt.screenX;
    _prevY = evt.screenY;

    console.log(movementX + "," + _prevX);

    editorObj.selectObj.x += movementX
    editorObj.selectObj.y += movementY

  }
  function _mouseMove(evt) {

    //console.log(evt.movementX);

  }

  function _mouseUp(evt) {

    OnMouseMove = _mouseMove

  }

  let OnMouseDown = _mouseDown
  canvas.addEventListener('mousedown',function (evt) {
    OnMouseDown(evt)

  } );

  let OnMouseMove = _mouseMove
  canvas.addEventListener('mousemove',function (evt) {

    OnMouseMove(evt);

  })

  let OnMouseUp = _mouseUp;
  canvas.addEventListener('mouseup',function(evt) {
    OnMouseUp(evt);
  });


  return editorObj;
}