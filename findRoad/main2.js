
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
    new Point(1, 1.5), // F - 5 
];


class Line {
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }
}

const lines = [
    new Line(points[0], points[4]),
    new Line(points[0], points[5]),
    new Line(points[4], points[1]),
    // new Line(points[4], points[3]),
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
    return Array.from(uniquePoints).sort((a, b) => {
        if (a.x === b.x) {
            return a.y - b.y;
        }
        return a.x - b.x;
    });
}


function orientationCal(p, q, r) {
    return (q.x - p.x) * (r.y - q.y) - (q.y - p.y) * (r.x - q.x);
}

function findRoad(points) {
    points.sort((a, b) => {
        if (a.x === b.x) {
            return a.y - b.y;
        }
        return a.x - b.x;
    });
    let listPoint = [];
    let xMinus = 0;
    let p = xMinus;
    let q;
    do {
        listPoint.push(points[p]);
        console.log(`điểm bắt đầu (${points[p].x}, ${points[p].y})`)
        const lineFormPoint = findLineFromPoints(points[p], lines)
        let listPointHasLine = extractUniquePoints(lineFormPoint);
        // Loại bỏ các điểm đã có trong listPoint
        console.log(listPointHasLine)
        // Tìm điểm tiếp theo
        const nextPoint = findNextPointByOrientationCal(points[p], listPointHasLine);
        console.log(nextPoint)
        if (nextPoint) {
            const lineFormPoint = findLineFromPoints(points[2], lines)
            let listPointHasLine = extractUniquePoints(lineFormPoint);
            const nextPoint = findNextPointByOrientationCal(points[2], listPointHasLine);
            console.log(nextPoint)
            console.log("Không tìm thấy điểm tiếp theo, dừng vòng lặp.");
            break;  // Nếu không tìm thấy điểm tiếp theo, dừng vòng lặp
        }
        q = points.indexOf(nextPoint);
        console.log(`Điểm tiếp theo có chỉ số: ${q}`);
        p = q;
    } while (p != xMinus);
    return listPoint;
}


function findNextPointByOrientationCal(firstPoint, listPointHasLine) {
    firstIndex = listPointHasLine.indexOf(firstPoint)
    console.log(firstIndex, listPointHasLine)
    let p = firstIndex, q
    let nextPont;
    for (let i = 0; i < listPointHasLine.length; i++) {
        q = i;
        if (q + 1 < listPointHasLine.length) {
            console.log(listPointHasLine[p], listPointHasLine[q], listPointHasLine[q + 1]);
            if (orientationCal(listPointHasLine[p], listPointHasLine[q], listPointHasLine[q + 1]) > 0) {
                console.log(orientationCal(listPointHasLine[p], listPointHasLine[q], listPointHasLine[q + 1]), listPointHasLine[p], listPointHasLine[q], listPointHasLine[q + 1])
                nextPoint = listPointHasLine[q + 1];
            }
        }
    }
    return nextPoint
}

function findNextPoint(listPointHasLine) {
    // Sắp xếp các điểm theo tọa độ x, nếu x bằng nhau thì sắp xếp theo y ngược lại
    listPointHasLine.sort((a, b) => {
        if (a.x === b.x) {
            return b.y - a.y;  // Sắp xếp theo y giảm dần nếu x bằng nhau
        }
        return a.x - b.x;      // Sắp xếp theo x tăng dần
    });

    // Trả về điểm đầu tiên trong danh sách đã sắp xếp
    return listPointHasLine[0];
}

function findLineFromPoints(point, lines) {
    console.log(lines)
    return lines.filter(line =>
        (line.start.x === point.x && line.start.y === point.y) ||
        (line.end.x === point.x && line.end.y === point.y)
    );
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

function checkCompletedRoad() {
    return road.length > 2 && lines.some(line => line =>
        (line.start === road[0] && line.end === road[road.length]) ||
        (line.start === road[road.length] && line.end === road[0])
    );
}

// In kết quả
if (checkRoadIncludeLines()) {
    console.log("Đường bao quanh gồm các điểm:");
    road.forEach(p => console.log(`(${p.x}, ${p.y})`));
} else {
    console.log("Không có đường bao quanh");
}

