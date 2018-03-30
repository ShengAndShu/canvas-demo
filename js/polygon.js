function Polygon(centerX, centerY, radius, sides, StrokeStyle, fillStyle, startAngle) {
    this.x = centerX;
    this.y = centerY;
    this.radius = radius;
    this.sides = sides;
    this.startAngle = startAngle || 0;
    this.strokeStyle = StrokeStyle || '#666';
    this.fillStyle = fillStyle || this.strokeStyle;
}
Polygon.prototype = {
    getPoints: function() {
        let points = [];
        let angle = this.startAngle;
        for(let i = 0; i < this.sides; i++) {
            points.push({x: this.x + this.radius * Math.sin(angle), y: this.y - this.radius * Math.cos(angle)});
            angle += 2 * Math.PI / this.sides;
        }
        return points;
    },
    createPath: function (context) {
        const points = this.getPoints();
        context.beginPath();
        context.moveTo(points[0].x, points[0].y);
        for(let i = 0; i < this.sides; i++) {
            context.lineTo(points[i].x, points[i].y);
        }
        context.closePath();
    },
    stroke: function (context) {
        context.save();
        this.createPath(context);
        context.strokeStyle = this.strokeStyle;
        context.stroke();
        context.restore();
    },
    fill: function (context) {
        context.save();
        this.createPath(context);
        context.fillStyle = this.fillStyle;
        context.fill();
        context.restore();
    }
};