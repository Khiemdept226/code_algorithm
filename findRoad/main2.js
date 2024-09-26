
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const SCALE = 100;
const OFFSET_X = 50; // Offset for the graph from the left
const OFFSET_Y = canvas.height - 50; // Offset from the bottom

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

const points = [
    new Point(0, 0), // A - 0
    new Point(2, 1), // B - 1
    new Point(4, 0), // C - 2
    new Point(3, 3), // D - 3
    new Point(1, 2), // E - 4
];


class Line {
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }
}

const lines = [
    new Line(points[0], points[4]),
    new Line(points[4], points[1]),
    new Line(points[1], points[3]),
    new Line(points[3], points[2]),
    new Line(points[2], points[0]),
    new Line(points[1], points[0]),
]

 // Draw X and Y axes
//  drawAxes();

 // Draw the lines and points on the graph
 lines.forEach(line => {
     drawLine(line.start.x, line.start.y, line.end.x, line.end.y);
     drawPoint(line.start.x, line.start.y);
     drawPoint(line.end.x, line.end.y);
 });

 // Draw the X and Y axes with tick marks
 function drawAxes() {
     // X-axis
     ctx.beginPath();
     ctx.moveTo(OFFSET_X, OFFSET_Y);
     ctx.lineTo(canvas.width - 50, OFFSET_Y); // X-axis length
     ctx.stroke();

     // Y-axis
     ctx.beginPath();
     ctx.moveTo(OFFSET_X, OFFSET_Y);
     ctx.lineTo(OFFSET_X, 50); // Y-axis length
     ctx.stroke();

     // Draw X-axis ticks and labels
     for (let i = 0; i <= 5; i++) {
         let x = OFFSET_X + i * SCALE;
         ctx.moveTo(x, OFFSET_Y - 5);
         ctx.lineTo(x, OFFSET_Y + 5);
         ctx.stroke();
         ctx.fillText(i, x - 5, OFFSET_Y + 20);
     }

     // Draw Y-axis ticks and labels
     for (let i = 0; i <= 5; i++) {
         let y = OFFSET_Y - i * SCALE;
         ctx.moveTo(OFFSET_X - 5, y);
         ctx.lineTo(OFFSET_X + 5, y);
         ctx.stroke();
         ctx.fillText(i, OFFSET_X - 20, y + 5);
     }
 }

 // Draw points adjusted for canvas and axes
 function drawPoint(x, y, color = 'black') {
     ctx.beginPath();
     ctx.arc(OFFSET_X + x * SCALE, OFFSET_Y - y * SCALE, 3, 0, 2 * Math.PI);
     ctx.fillStyle = color;
     ctx.fill();
     ctx.closePath();
 }

 // Draw lines adjusted for canvas and axes
 function drawLine(x1, y1, x2, y2, color = 'blue') {
     ctx.beginPath();
     ctx.moveTo(OFFSET_X + x1 * SCALE, OFFSET_Y - y1 * SCALE);
     ctx.lineTo(OFFSET_X + x2 * SCALE, OFFSET_Y - y2 * SCALE);
     ctx.strokeStyle = color;
     ctx.stroke();
 }

function extractUniquePoints(lines) {
    const uniquePoints = new Set();

    for (const line of lines) {
        uniquePoints.add(line.start);
        uniquePoints.add(line.end);
    }
    return Array.from(uniquePoints);
}


function orientationCal(p, q, r) {
    return (q.x - p.x) * (r.y - q.y) - (q.y - p.y) * (r.x - q.x);
}

function findRoad(points) {
    let listPoint = [];
    let xMinus = 0;
    for (let i = 1; i < points.length; i++) {
        if (points[i].x < points[xMinus].x) {
            xMinus = i;
        }
    }

    let p = xMinus;
    let q;
    do {
        console.log(`điểm bắt đầu (${points[p].x}, ${points[p].y})`)
        listPoint.push(points[p]);
        q = (p + 1) % points.length;
        console.log(`điểm so sánh (${points[q].x}, ${points[q].y})`)
        for (let i = 0; i < points.length; i++) {
            if (orientationCal(points[p], points[q], points[i]) > 0) {
                q = i;
            }
        }
        p = q;
    } while (p != xMinus);

    return listPoint;
}

const uniquePoints = extractUniquePoints(lines);
console.log("Các điểm duy nhất từ các đường thẳng:");
uniquePoints.forEach(p => console.log(`(${p.x}, ${p.y})`));
const road = findRoad(uniquePoints);


function isLineInRoad(line, road) {
    return (line.start === road[0] && line.end === road[1]) ||
           (line.start === road[1] && line.end === road[0]);
}

function checkRoadIncludeLines() {
    for (let i = 0; i < road.length; i++) {
        const p1 = road[i];
        const p2 = road[(i + 1) % road.length]; 
        // Kiểm tra xem có đoạn thẳng nào trong lines chứa 2 điểm liên tiếp
        const isPartOfLine = lines.some(line => 
            (line.start === p1 && line.end === p2) || 
            (line.start === p2 && line.end === p1)
        );
    
        if (!isPartOfLine) {
            return false;
        } 
    }
    return true
}

// In kết quả
if (checkRoadIncludeLines(road)) {
    console.log("Đường bao quanh gồm các điểm:");
    road.forEach(p => console.log(`(${p.x}, ${p.y})`));
} else {
    console.log("Không có đường bao quanh");
}

