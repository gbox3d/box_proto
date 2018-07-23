### 실행법

일랙트론 실행기로 실행시키기
```
npm run mac
```

또는
웹서버 실행
```
npm run http
```

웹브라우져 주소창에
```
http://localhost:8080/home/index.html
```

### 기능명세

#### [theApp]

#####sceneMgr
work_texture<br>


#####ObjMng
```
Objlist
addRect(_x,_y,_w,_h,_color)
addImage(url,x,y,w,h)
addText(_text,_x,_y,_fontName,_color,_size)
```

#####loader
```
importData()<br>
exportObjData()<br>

```
#####example

이미지객체<br>
```
theApp.ObjectMgr.addImage('../res/gun1.jpg',0,-100,520/2,347/2)
```



