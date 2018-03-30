
function Img(src, left, top ,sx, sy, swidth, sheight) {
    this.image = new Image();
    this.image.src = src;
    this.left = left || 0;
    this.top = top || 0;
    this.sx = sx;
    this.sy = sy;
    this.swidth = swidth;
    this.sheight = sheight;
    //旋转弧度
    this.radian = 0;
    //翻转，左右翻转即scale(-1, 1)
    this.turn = {x:1, y:1};
}

//渲染图片
Img.prototype.render = function(ctx) {
    this.image.onload = () => {
        this.width = this.image.width;
        this.height = this.image.height;
        ctx.drawImage(this.image, this.left, this.top, this.width, this.height);
    };
    if(this.radian || this.turn.x === -1 || this.turn.y === -1) {
        ctx.save();
        ctx.translate(this.left + this.width / 2, this.top + this.height / 2);
        if(this.radian) {
            //旋转
            ctx.rotate(this.radian);
            // const cos = Math.cos(this.radian);
            // const sin = Math.sin(this.radian);
            // ctx.transform(cos, sin, -sin, cos, 0, 0);

        }
        if(this.turn.x === -1 || this.turn.y === -1) {
            //翻转
            ctx.scale(this.turn.x, this.turn.y);
        }

        ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
        ctx.restore();
    } else {
        ctx.drawImage(this.image, this.left, this.top, this.width, this.height);
    }
};

// //判断该点是否在图像内
Img.prototype.hasPos = function(pos) {
    if(this.radian) {
        pos = this.transAxis(pos);
        return Math.abs(pos.x) <= this.width / 2 && Math.abs(pos.y) <= this.height / 2;
    } else {
        return pos.x >= this.left && pos.x <= this.left + this.width && pos.y >= this.top && pos.y <= this.top + this.height;
    }
};

// 根据img旋转的角度转换坐标{x: num, y: num}
// 将坐标系转换为该img rotate时的坐标系(当前坐标系圆点移至img中心，再旋转img.randian)
Img.prototype.transAxis =  function(obj) {
    if(obj.x && obj.y) {
        //先将坐标系原点移至未旋转的img原点
        const x1 = obj.x - (this.left + this.width / 2);
        const y1 = obj.y - (this.top + this.height / 2);
        //再将坐标系按照this.radian进行旋转
        const x2 = x1 * Math.cos(this.radian) + y1 * Math.sin(this.radian);
        const y2 = y1 * Math.cos(this.radian) - x1 * Math.sin(this.radian);
        return {x: x2, y: y2};
    }
};

