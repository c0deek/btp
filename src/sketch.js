var drawn = false;

var Vector3D = (function (x, y, z) {
  function Vector3D(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  Vector3D.prototype.calculate2Dprojection = function () {
    // vec_array = [1 / this.x || 0, 1 / this.y || 0, 1 / this.z || 0];
    vec_array = [this.x, this.y, this.z];
    // if any emenet of vec_array is infinity change to 0
    for (var i = 0; i < vec_array.length; i++) {
      if (isNaN(vec_array[i]) || vec_array[i] === Infinity) {
        vec_array[i] = 0;
      }
    }
    var mag = Math.sqrt(
      vec_array[0] * vec_array[0] +
        vec_array[1] * vec_array[1] +
        vec_array[2] * vec_array[2]
    );
    v = [
      Math.abs(vec_array[0] / mag),
      Math.abs(vec_array[1] / mag),
      Math.abs(vec_array[2] / mag),
    ];
    vsign = [v[0] < 0 ? -1 : 1, v[1] < 0 ? -1 : 1, v[2] < 0 ? -1 : 1];
    if (v[2] == 1) {
      return [0, 0];
    } else if (v[0] == 1 || v[1] == 1) {
      return [vec_array[0], vec_array[1]];
    } else {
      var xsign = vec_array[0] < 0 ? -1 : 1;
      var ysign = vec_array[1] < 0 ? -1 : 1;
      console.log({
        vector: [this.x, this.y, this.z],
        rec: vec_array,
        normalized: v,
        xsign: xsign,
        ysign: ysign,
        "-": [v[0] / (1 - v[2]), v[1] / (1 - v[2])],
        "+": [v[0] / (1 + v[2]), v[1] / (1 + v[2])],
      });
      if (v[0] < 1 - v[2] && v[1] < 1 - v[2]) {
        console.log("- selected");
        return [(v[0] * xsign) / (1 - v[2]), (v[1] * ysign) / (1 - v[2])];
      } else {
        console.log("+ selected");
        return [(v[0] * xsign) / (1 + v[2]), (v[1] * ysign) / (1 + v[2])];
      }
      // var returnX = 0;
      // var returnY = 0;
      // if (v[0] < 1 - v[2]) {
      //   returnX = v[0] / (1 - v[2]);
      // } else {
      //   returnX = v[0] / (1 + v[2]);
      // }
      // if (v[1] < 1 - v[2]) {
      //   returnY = v[1] / (1 - v[2]);
      // } else {
      //   returnY = v[1] / (1 + v[2]);
      // }
      // console.log([this.x, this.y, this.z], ":", returnX, returnY);
      // return [returnX, returnY];
    }
  };

  return Vector3D;
})();

var input_arr = [
  [2, 2, 1],
  // [-1, -1, 1],
  // [1, 1, 0],
  // [-1, 1, 0],
  // [1, -1, 0],
  // [-1, -1, 0],
  // [1, 0, 1],
  // [0, 1, 1],
  // [1, 0, 0],
  // [0, 1, 0],
  // [0, 0, 1],
  // [0, 0, 0],
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1],
  // [-1, 0, 0],
  // [0, -1, 0],
  // [2, 2, 2],
  // [2, 3, 1],
  // [1, 2, 2],
  // [2, 2, 3],
  // [3, 2, 1],
  // [2, 2, 1],
  // [1, 3, 2],
  // [2, 1, 2],
  // [2, 2, 1],
  // [1, 2, 3],
  // [2, 2, 2],
  // [2, 3, 1],
  // [1, 2, 2],
  // [2, 2, 3],
  // [3, 2, 1],
  // [2, 2, 1],
  // [1, 3, 2],
  // [2, 1, 2],
  // [2, 2, 1],
  // [1, 2, 3],
  // [2, 2, 2],
  // [2, 3, 1],
  // [1, 2, 2],
  // [2, 2, 3],
  // [3, 2, 1],
  // [2, 2, 1],
  // [1, 3, 2],
  // [2, 1, 2],
  // [2, 2, 1],
  // [1, 2, 3],
  // [2, 2, 2],
  // [2, 3, 1],
  // [1, 2, 2],
  // [2, 2, 3],
  // [3, 2, 1],
  // [2, 2, 1],
  // [1, 3, 2],
  // [2, 1, 2],
  // [2, 2, 1],
  // [1, 2, 3],
  // [2, 2, 2],
  // [2, 3, 1],
  // [1, 2, 2],
  // [2, 2, 3],
  // [3, 2, 1],
  // [2, 2, 1],
  // [1, 3, 2],
  // [1, -2, 3],
  // [-2, 1, 3],
  // [3, -2, 1],
];
var points_arr = [];

input_arr.forEach(function (element) {
  var v = new Vector3D(element[0], element[1], element[2]);
  points_arr.push(v.calculate2Dprojection());
});

var mainCircle = new Path.Circle({
  center: [400, 400],
  radius: 200,
  strokeColor: "green",
  dashArray: [10, 5],
});

var center = new Path.Circle(new Point(400, 400), 2);
center.strokeColor = "black";

var axisX = new Path.Line({
  from: [200, 400],
  to: [600, 400],
  strokeColor: "green",
  dashArray: [10, 5],
});
var axisY = new Path.Line({
  from: [400, 200],
  to: [400, 600],
  strokeColor: "green",
  dashArray: [10, 5],
});
var diag1 = new Path.Line({
  from: [400 - 100 * Math.sqrt(2), 400 - 100 * Math.sqrt(2)],
  to: [400 + 100 * Math.sqrt(2), 400 + 100 * Math.sqrt(2)],
  strokeColor: "green",
  dashArray: [10, 5],
});
var diag2 = new Path.Line({
  from: [400 - 100 * Math.sqrt(2), 400 + 100 * Math.sqrt(2)],
  to: [400 + 100 * Math.sqrt(2), 400 - 100 * Math.sqrt(2)],
  strokeColor: "green",
  dashArray: [10, 5],
});
var arc1 = new Path.Arc({
  from: [400, 400 - 200],
  through: [400 + 200 * 0.4142135623730951, 400],
  to: [400, 400 + 200],
  strokeWidth: 1,
  strokeColor: "green",
  dashArray: [10, 5],
});
var arc2 = new Path.Arc({
  from: [400, 400 - 200],
  through: [400 - 200 * 0.4142135623730951, 400],
  to: [400, 400 + 200],
  strokeWidth: 1,
  strokeColor: "green",
  dashArray: [10, 5],
});
var arc3 = new Path.Arc({
  from: [400 - 200, 400],
  through: [400, 400 - 200 * 0.4142135623730951],
  to: [400 + 200, 400],
  strokeWidth: 1,
  strokeColor: "green",
  dashArray: [10, 5],
});
var arc4 = new Path.Arc({
  from: [400 - 200, 400],
  through: [400, 400 + 200 * 0.4142135623730951],
  to: [400 + 200, 400],
  strokeWidth: 1,
  strokeColor: "green",
  dashArray: [10, 5],
});
axisX.strokeColor = "green";
axisY.strokeColor = "green";
diag1.strokeColor = "green";
diag2.strokeColor = "green";

var xaxispoint = new Path.Circle({
  center: [400, 400],
  radius: 2,
  strokeColor: "red",
  fillColor: "red",
});
var xaxistext = new PointText({
  position: [400 - 10, 400 - 10],
  content: "[001]",
  fillColor: "red",
  fontFamily: "Courier New",
  fontSize: 12,
  fontWeight: "bold",
});

var yaxispoint = new Path.Circle({
  center: [600, 400],
  radius: 2,
  strokeColor: "red",
  fillColor: "red",
});

var yaxistext = new PointText({
  position: [600 - 10, 400 - 10],
  content: "[100]",
  fillColor: "red",
  fontFamily: "Courier New",
  fontSize: 12,
  fontWeight: "bold",
});

var zaxispoint = new Path.Circle({
  center: [400, 200],
  radius: 2,
  strokeColor: "red",
  fillColor: "red",
});

var yaxistext = new PointText({
  position: [400 - 10, 200 - 10],
  content: "[010]",
  fillColor: "red",
  fontFamily: "Courier New",
  fontSize: 12,
  fontWeight: "bold",
});

function Draw() {
  points_arr.forEach(function (point, i) {
    var dot = new Path.Circle({
      center: new Point(400 + point[0] * 200, 400 - point[1] * 200),
      radius: 2,
      strokeColor: "black",
      fillColor: "black",
    });

    // console.log("point", point);
    var awesometext = new PointText({
      position: [400 + point[0] * 200 - 10, 400 - point[1] * 200 - 10],
      content: "[" + input_arr[i][0] + input_arr[i][1] + input_arr[i][2] + "]", // "[" + point[0].toFixed(2) + "," + point[1].toFixed(2) + "]",
      fillColor: "black",
      fontFamily: "Courier New",
      fontWeight: "bold",
      fontSize: 10,
      opacity: 1,
    });
  });
}

function drawPoint(x, y, z) {
  var vec = new Vector3D(x, y, z);
  var p = vec.calculate2Dprojection();
  var point = new Path.Circle({
    center: new Point(400 + p[0] * 200, 400 - p[1] * 200),
    radius: 2,
    strokeColor: "black",
    fillColor: "black",
  });
  var awesometext = new PointText({
    position: [400 + p[0] * 200 - 10, 400 - p[1] * 200 - 10],
    content: "[" + x + y + z + "]", // "[" + point[0].toFixed(2) + "," + point[1].toFixed(2) + "]",
    fillColor: "black",
    fontFamily: "Courier New",
    fontWeight: "bold",
    fontSize: 12,
    opacity: 1,
  });
}

document.getElementById("vector-submit").addEventListener("click", function () {
  var inputx = document.getElementById("vector-x").value;
  var inputy = document.getElementById("vector-y").value;
  var inputz = document.getElementById("vector-z").value;
  // console.log(
  //   "input",
  //   Math.abs(Number(inputx)).toString().length,
  //   Number(inputx).toString()
  // );
  console.log(
    "a",
    Math.abs(Number(inputx)),
    Math.abs(Number(inputy)),
    Math.abs(Number(inputz))
  );
  if (isNaN(Number(inputx)) || isNaN(Number(inputy)) || isNaN(Number(inputz))) {
    alert("Please enter a valid number");
  } else if (
    Math.abs(Number(inputx)).toString().length > 1 ||
    Math.abs(Number(inputy)).toString().length > 1 ||
    Math.abs(Number(inputz)).toString().length > 1
  ) {
    alert("Please enter a valid number");
  } else if (
    Math.abs(Number(inputx)) == 2 &&
    Math.abs(Number(inputy)) == 2 &&
    Math.abs(Number(inputz)) == 1
  ) {
    var abx = (0.5 * Number(inputx)) / Math.abs(Number(inputx));
    var aby = (0.5 * Number(inputy)) / Math.abs(Number(inputy));
    var a = new Path.Circle({
      center: [400 + abx * 200, 400 - aby * 200],
      radius: 2,
      strokeColor: "black",
      fillColor: "black",
    });
    var awesometext = new PointText({
      position: [400 + abx * 200 - 10, 400 - aby * 200 - 10],
      content: "[" + inputx + inputy + inputz + "]", // "[" + point[0].toFixed(2) + "," + point[1].toFixed(2) + "]",
      fillColor: "black",
      fontFamily: "Courier New",
      fontWeight: "bold",
      fontSize: 12,
      opacity: 1,
    });
  } else {
    drawPoint(inputx, inputy, inputz);
  }
});
