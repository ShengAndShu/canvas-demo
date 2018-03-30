
window.onload = () => {
    const canvas = document.getElementById("canvas"),
        context = canvas.getContext("2d"),
        canvasWrap = document.getElementById("canvasWrap"),
        resizeBox = document.getElementById("resizeBox"),
        borderBox = document.getElementById("borderBox"),
        rotateBox = document.getElementById("rotateBox"),
        turnXButton = document.getElementById("turnXButton"),
        turnYButton = document.getElementById("turnYButton"),
        rotateButton = document.getElementById("rotateButton"),
        rotateInput = document.getElementById("rotateInput");
    let imgs = [],
        tools = ['move', 'resize', 'rotate'],
        actImg = null,
        actTool = null,
        mouse = {x: 0, y: 0},
        newMouse = {x: 0, y: 0};

    imgs.push(new Img("./img/head/jinguanzhang.png"));
    imgs.push(new Img("./img/body/xiongmao-shouzhi.png"));

    function renderImgs() {
        // 清除画布内容
        canvas.width = 1000;
        // 渲染所有图片
        imgs.forEach(e => e.render(context));
    }
    renderImgs();

    //鼠标按下事件
    canvasWrap.addEventListener("mousedown", e => {
        if(actTool === null) {
            mouse = getMouse(e);
            selectImg();
        }
    });
    //鼠标抬起事件
    canvasWrap.addEventListener("mouseup", () => {
        actTool = null;
    });

    //鼠标移动事件
    canvasWrap.addEventListener("mousemove", e => {
        if(actTool !== null) {
            //判断当前在进行何种操作
            switch(actTool) {
                case tools[0]:
                    //move
                    newMouse = getMouse(e);
                    moveImg();
                    break;
                case tools[1]:
                    //resize
                    newMouse = actImg.radian ? actImg.transAxis(getMouse(e)) : getMouse(e);
                    resizeImg();
                    break;
                case tools[3]:
                    //rotate
                    newMouse = actImg.transAxis(getMouse(e));
                    rotateImg();
                    break;
            }
            mouse = newMouse;
            renderImgs();
            addBorder(actImg);
        }
    });
    //resizeBox绑定mousedown事件
    resizeBox.addEventListener("mousedown", e => {
        mouse = actImg.radian ? actImg.transAxis(getMouse(e)) : getMouse(e);
        actTool = tools[1];
    });
    //resizeBox绑定mouseup事件
    resizeBox.addEventListener("mouseup", () => {
        actTool = null;
    });
    //rotateBox绑定mousedown事件
    rotateBox.addEventListener("mousedown", e => {
        mouse = actImg.transAxis(getMouse(e));
        actTool = tools[3];
    });
    //rotateBox绑定mouseup事件
    rotateBox.addEventListener("mouseup", function(){
        actTool = null;
    });

    //turnXButton绑定click事件
    turnXButton.addEventListener("click", function(){
        turnImg(-1, 1);
        renderImgs();
        addBorder(actImg);
    });

    //turnYButton绑定click事件
    turnYButton.addEventListener("click", function(){
        turnImg(1, -1);
        renderImgs();
        addBorder(actImg);
    });

    //rotateButton绑定click事件
    rotateButton.addEventListener("click", function(){
        rotateImg(rotateInput.value);
        renderImgs();
        addBorder(actImg);
    });

    //获取鼠标当前事件相对于context的位置
    function getMouse(e) {
        return {
            x: e.clientX - canvas.offsetLeft,
            y: e.clientY - canvas.offsetTop
        }
    }
    //图像添加边框
    function addBorder(img) {
        borderBox.className = "select";
        borderBox.style.display = 'block';
        borderBox.style.left = canvas.offsetLeft + img.left + "px";
        borderBox.style.top = canvas.offsetTop + img.top + "px";
        borderBox.style.width = img.width + "px";
        borderBox.style.height = img.height + "px";
        borderBox.style.transform = 'rotate(' + img.radian * 180 / Math.PI + 'deg)';
    }

    //选中图片
    function selectImg() {
        actImg = null;
        imgs.forEach(img => {
            if(img.hasPos(mouse) && (!actImg || actImg && img.width < actImg.width)) {
                actTool = tools[0];
                actImg = img;
                addBorder(actImg);
            }
        });
        if(actImg === null) {
            borderBox.style.display = 'none';
        }
    }

    //工具库

    //1.移动图片
    function moveImg() {
        actImg.left += newMouse.x - mouse.x;
        actImg.top += newMouse.y - mouse.y;
    }
    //2.缩放图片
    function resizeImg() {
        actImg.width = actImg.width >= 15 ? actImg.width + (newMouse.x - mouse.x) : 15;
        actImg.height = actImg.height >= 15 ? actImg.height + (newMouse.y - mouse.y) : 15;
    }
    //3.旋转图片
    function rotateImg(deg) {
        actImg.radian = (deg !== undefined) ? (deg * Math.PI / 180) : (actImg.radian - Math.atan(newMouse.x / newMouse.y));
    }
    //4.翻转图片
    function turnImg(x, y) {
        actImg.turn.x *= x;
        actImg.turn.y *= y;
    }

};

