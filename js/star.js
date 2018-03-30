function Star(x, y, r, R, StrokeStyle, fillStyle) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.R = R;
    this.strokeStyle = StrokeStyle || '#666';
    this.fillStyle = fillStyle || this.strokeStyle;
}
Star.prototype = {
    createPath: function (context) {
        context.beginPath();
        for (let i = 0; i < 5; i++) {
            context.lineTo(Math.cos((18 + 72 * i) / 180 * Math.PI) * this.R + this.x,
                -Math.sin((18 + 72 * i) / 180 * Math.PI) * this.R + this.y);
            context.lineTo(Math.cos((54 + 72 * i) /
                    180 * Math.PI) * this.r + this.x,
                -Math.sin((54 + 72 * i) / 180 * Math.PI) * this.r + this.y);
        }
        context.closePath();

    },
    render: function (context) {
        context.save();
        this.createPath(context);
        context.fillStyle = this.fillStyle;
        context.fill();
        context.restore();
    }
};