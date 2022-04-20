var CONSTANTS = {
  canwidht: document.getElementById("canvas-010").clientWidth,
  canheight: document.getElementById("canvas-010").clientHeight,
  centerX: 250,
  centerY: 250,
  radius: 200,
};

// var c = document.getElementById("canvas2");
// var ctx = c.getContext("2d");
// console.log(ctx);

var mainCircle = new Path.Circle({
  center: new Point(CONSTANTS.centerX, CONSTANTS.centerY),
  radius: CONSTANTS.radius,
  strokeColor: "green",
  dashArray: [10, 5],
});

function drawPoint100(vec3dpoint, strokeColor, fillColor) {
  var p = vec3dpoint.getProjection();
  var og = vec3dpoint.getOGVector;
  var point = new Path.Circle({
    center: new Point(
      CONSTANTS.centerX100 + p[0] * CONSTANTS.radius,
      CONSTANTS.centerY100 - p[1] * CONSTANTS.radius
    ),
    radius: 2,
    strokeColor: strokeColor || "black",
    fillColor: fillColor || "black",
  });
  var awesometext = new PointText({
    position: [
      CONSTANTS.centerX100 + p[0] * CONSTANTS.radius - 10,
      CONSTANTS.centerY100 - p[1] * CONSTANTS.radius - 10,
    ],
    content: "[" + og()[0] + og()[1] + og()[2] + "]",
    fillColor: fillColor || "black",
    fontFamily: "Courier New",
    fontWeight: "bold",
    fontSize: 12,
    opacity: 1,
  });
}

function drawTrace100(vec3dpoint, strokeColor, fillColor) {
  console.log(vec3dpoint);
  var trace_arr = vec3dpoint.getTrace();
  console.log(vec3dpoint, trace_arr);
  switch (trace_arr.length) {
    case 8:
      var traceCircle = new Path.Circle({
        center: [CONSTANTS.centerX100, CONSTANTS.centerY100],
        radius: CONSTANTS.radius,
        strokeColor: "red",
        dashArray: [10, 5],
      });
      break;
    case 6:
      var traceArc = new Path.Arc({
        from: [
          CONSTANTS.centerX100 + CONSTANTS.radius * trace_arr[0],
          CONSTANTS.centerY100 - CONSTANTS.radius * trace_arr[1],
        ],
        through: [
          CONSTANTS.centerX100 + CONSTANTS.radius * trace_arr[4],
          CONSTANTS.centerY100 - CONSTANTS.radius * trace_arr[5],
        ],
        to: [
          CONSTANTS.centerX100 + CONSTANTS.radius * trace_arr[2],
          CONSTANTS.centerY100 - CONSTANTS.radius * trace_arr[3],
        ],
        strokeWidth: 1,
        strokeColor: "red",
        dashArray: [10, 5],
      });
      break;
    case 4:
      var traceLine = new Path.Line({
        from: [
          CONSTANTS.centerX + CONSTANTS.radius * trace_arr[0],
          CONSTANTS.centerY - CONSTANTS.radius * trace_arr[1],
        ],
        to: [
          CONSTANTS.centerX + CONSTANTS.radius * trace_arr[2],
          CONSTANTS.centerY - CONSTANTS.radius * trace_arr[3],
        ],
        strokeColor: "red",
        dashArray: [10, 5],
      });
      break;
    default:
      alert("Error occured in trace_error", trace_arr.length);
  }
}

// EVENT LISTENERS
// ---------------

document
  .getElementById("vector-submit-010")
  .addEventListener("click", function () {
    var inputx = document.getElementById("vector-x-010").value;
    var inputy = document.getElementById("vector-y-010").value;
    var inputz = document.getElementById("vector-z-010").value;

    if (
      isNaN(Number(inputx)) ||
      isNaN(Number(inputy)) ||
      isNaN(Number(inputz))
    ) {
      alert("Please enter a valid number");
    } else if (
      Math.abs(Number(inputx)).toString().length > 1 ||
      Math.abs(Number(inputy)).toString().length > 1 ||
      Math.abs(Number(inputz)).toString().length > 1
    ) {
      alert("Please enter a valid number");
    } else {
      var plotpoint = new Vec3D(inputx, inputy, inputz, 10);
      drawPoint100(plotpoint);
    }
  });

document
  .getElementById("trace-submit-010")
  .addEventListener("click", function () {
    var inputx = document.getElementById("vector-x-010").value;
    var inputy = document.getElementById("vector-y-010").value;
    var inputz = document.getElementById("vector-z-010").value;

    if (
      isNaN(Number(inputx)) ||
      isNaN(Number(inputy)) ||
      isNaN(Number(inputz))
    ) {
      alert("Please enter a valid number");
    } else if (
      Math.abs(Number(inputx)).toString().length > 1 ||
      Math.abs(Number(inputy)).toString().length > 1 ||
      Math.abs(Number(inputz)).toString().length > 1
    ) {
      alert("Please enter a valid number");
    } else {
      var tracepoint = new Vec3D(inputx, inputy, inputz, 10);
      drawTrace100(tracepoint);
    }
  });
