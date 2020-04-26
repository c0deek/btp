console.log('load: sketch.js')

var path = new Path();
path.strokeColor = 'black';
var start = new Point(100, 100);
path.moveTo(start);
path.lineTo(start + [ 100, -50 ]);

var path = new Path.Circle(new Point(80, 50), 30);
path.style = {
    fillColor: new Color(0.25, .25, .85),
    strokeColor: 'black',
    strokeWidth: 5
};

var path1 = new Path.Circle({
    center: [100, 200],
    radius: 30
});

var path2 = new Path.Rectangle({
    from: [170, 170],
    to: [230, 230]
});

var group = new Group(path1, path2);

// All styles set on a group are automatically
// set on the children of the group:
group.style = {
    strokeColor: 'black',
    dashArray: [4, 10],
    strokeWidth: 4,
    strokeCap: 'round'
};




// BACKGROUND COLOR
var bg = new Shape.Rectangle({
    point: [0, 0],
    size: [view.size.width, view.size.height],
    // strokeColor: 'white',
    selected: false
});
bg.sendToBack();
bg.fillColor = '#c7c7c7';
// CURRENTLY DOESNT AUTO RESIZE


// Create a circle shaped path with its center at the center
// of the view and a radius of 30:
var path = new Path.Circle({
	center: view.center,
	radius: 30,
	strokeColor: 'black'
});

function onResize(event) {
    path.position = view.center;
}