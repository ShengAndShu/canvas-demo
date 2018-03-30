window.onload = () => {
    const canvas = document.getElementById("canvas"),
        context = canvas.getContext("2d"),
        bodyWidth = document.body.clientWidth,
        bodyHeight = document.body.clientHeight,
        r = 10,
        R = 20,
        num = 20000,
        colors = ["#FFBB33", "#FF8800"];
    let stars = [],          // star集合
        activeShape,         // 被选中的图形
        cacheCanvas,         // 缓存的canvas对象
        cacheContext,        // 缓存的canvas上下文对象
        isMouseDown = false,
        mouse = {x: 0, y: 0},
        newMouse = {x: 0, y: 0},
        layer = {
            position: {x: 0, y: 0},
            scale: 1
        };

    //获取鼠标当前事件相对于canvas的位置
    function getMouse(e) {
        return {
            x: e.clientX - canvas.offsetLeft,
            y: e.clientY - canvas.offsetTop
        }
    }

    // 在离屏canvas上预渲染一个star图案
    function drawCacheStar() {
        const star = new Star(R, R, r, R, colors[0]);
        cacheCanvas = document.createElement("canvas");
        cacheContext = cacheCanvas.getContext("2d");
        cacheCanvas.width = 2 * R;
        cacheCanvas.height = 2 * R;
        star.render(cacheContext);
    }

    // 添加多个star
    function addStars(num) {
        for (let i = 0; i < num; i++) {
            const star = new Star(Math.random() * bodyWidth / 2, Math.random() * bodyHeight / 2, r, R, colors[0]);
            star.render(context);
            stars.push(star);
        }
    }

    // 重绘所有star
    function renderStars() {
        requestAnimationFrame(() => {
            // 清空画布(给canvas.width赋值会清空画布，同时也会将坐标的变换矩阵重置)
            canvas.width = bodyWidth - 50;

            // 整体拖拽和整体缩放
            // context.translate(layer.position.x, layer.position.y);
            // context.scale(layer.scale, layer.scale);
            context.setTransform(layer.scale, 0, 0, layer.scale, layer.position.x, layer.position.y);
            stars.forEach(star => {
                // star.render(context);
                context.drawImage(cacheCanvas, star.x - star.R, star.y - star.R);
            });
        });
    }

    canvas.addEventListener('mousedown', e => {
        isMouseDown = true;
        mouse = getMouse(e);
        stars.some(star => {
            star.createPath(context);
            if (context.isPointInPath(mouse.x, mouse.y)) {
                activeShape = star;
                return true;
            }
        })
    });
    canvas.addEventListener("mousewheel", e => {
        const delta = e.wheelDelta || -e.detail;
        layer.scale *= delta > 0 ? 1.1 : 1 / 1.1;
        renderStars();
    });

    canvas.addEventListener('mousemove', e => {
        if (activeShape) {
            // 单点拖拽
            newMouse = getMouse(e);
            activeShape.x += (newMouse.x - mouse.x) / layer.scale;
            activeShape.y += (newMouse.y - mouse.y) / layer.scale;
            mouse = newMouse;
            renderStars();
        } else if (isMouseDown === true) {
            // 整体拖拽
            newMouse = getMouse(e);
            layer.position.x += newMouse.x - mouse.x;
            layer.position.y += newMouse.y - mouse.y;
            mouse = newMouse;
            renderStars();
        }
    });
    canvas.addEventListener('mouseup', e => {
        activeShape = null;
        isMouseDown = false;
    });

    canvas.width = bodyWidth - 50;
    canvas.height = bodyHeight - 50;
    drawCacheStar();
    addStars(num);
};

