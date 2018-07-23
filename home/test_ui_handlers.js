function lm_test_ui_hander() {

  console.log('test ui load');
  let ui_root = document.querySelector("#test-ui");

  console.log(ui_root)

  ui_root.querySelector("button.add-text").addEventListener('click',function () {
    theApp.ObjectMgr.addText("hello",0,0,'Calibri','#000000',60);
  })

  ui_root.querySelector("button.add-rect").addEventListener('click',function () {

  })

  ui_root.querySelector("button.add-img").addEventListener('click',function () {
    theApp.ObjectMgr.addImage('../res/gun1.jpg',0,-100,520/2,347/2)
  })

}