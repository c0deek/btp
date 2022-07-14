var colormap = {};

var CONSTANTS = {
  canwidth: document.getElementById("canvas2").clientWidth,
  canheight: document.getElementById("canvas2").clientHeight,
  centerY001: 350,
  centerY010: 350,
  centerY100: 350,
  radius: 250,
};

CONSTANTS["centerX010"] = CONSTANTS.canwidth / 2;
CONSTANTS["centerX001"] = CONSTANTS.centerX010 - 550;
CONSTANTS["centerX100"] = CONSTANTS.centerX010 + 550;

var tooltip = document.getElementById("point-tooltip");

var mainCircle = new Path.Circle({
  center: new Point(CONSTANTS.centerX001, CONSTANTS.centerY001),
  radius: CONSTANTS.radius,
  strokeColor: "green",
  dashArray: [5, 0],
});

var center = new Path.Circle({
  center: new Point(CONSTANTS.centerX001, CONSTANTS.centerY001),
  radius: 3,
  fillColor: "black",
});

function drawPoint001(vec3dpoint, strokeColor, fillColor) {
  var p = vec3dpoint.getProjection();
  // var og = vec3dpoint.geOGVector();
  var vec = vec3dpoint.getVector();
  var point = new Path.Circle({
    center: new Point(
      CONSTANTS.centerX001 + p[0] * CONSTANTS.radius,
      CONSTANTS.centerY001 - p[1] * CONSTANTS.radius
    ),
    radius: 2,
    strokeWidth: 0,
    strokeColor: strokeColor || "black",
    fillColor: fillColor || "black",
  });

  point.onClick = function (event) {
    point.fillColor = "white";
    point.visible = false;
  };
  point.onMouseEnter = function (event) {
    point.scale(1.5);
    tooltip.innerHTML =
      "Miller indices of selected point: " + vec[0] + vec[1] + vec[2];
  };
  point.onMouseLeave = function (event) {
    point.scale(1 / 1.5);
    tooltip.innerHTML = "Hover point or trace for miller indices";
  };

  // var awesometext = new PointText({
  //   position: [
  //     CONSTANTS.centerX001 + p[0] * CONSTANTS.radius - 10,
  //     CONSTANTS.centerY001 - p[1] * CONSTANTS.radius - 10,
  //   ],
  //   content: "[" + og()[0] + og()[1] + og()[2] + "]",
  //   fillColor: fillColor || "black",
  //   fontFamily: "Courier New",
  //   fontWeight: "bold",
  //   fontSize: 12,
  //   opacity: 1,
  // });
}

function drawTrace001(vec3dpoint, strokeColor, fillColor) {
  var vec = vec3dpoint.getVector();
  var trace_arr = vec3dpoint.getTrace();
  switch (trace_arr.length) {
    case 8:
      var trace = new Path.Circle({
        center: [CONSTANTS.centerX001, CONSTANTS.centerY001],
        radius: CONSTANTS.radius,
        strokeColor: strokeColor || "red",
        strokeWidth: 2,
        dashArray: [10, 3],
      });
      break;
    case 6:
      var trace = new Path.Arc({
        from: [
          CONSTANTS.centerX001 + CONSTANTS.radius * trace_arr[0],
          CONSTANTS.centerY001 - CONSTANTS.radius * trace_arr[1],
        ],
        through: [
          CONSTANTS.centerX001 + CONSTANTS.radius * trace_arr[4],
          CONSTANTS.centerY001 - CONSTANTS.radius * trace_arr[5],
        ],
        to: [
          CONSTANTS.centerX001 + CONSTANTS.radius * trace_arr[2],
          CONSTANTS.centerY001 - CONSTANTS.radius * trace_arr[3],
        ],
        strokeWidth: 2,
        strokeColor: strokeColor || "red",
        dashArray: [10, 3],
      });
      break;
    case 4:
      var trace = new Path.Line({
        from: [
          CONSTANTS.centerX001 + CONSTANTS.radius * trace_arr[0],
          CONSTANTS.centerY001 - CONSTANTS.radius * trace_arr[1],
        ],
        to: [
          CONSTANTS.centerX001 + CONSTANTS.radius * trace_arr[2],
          CONSTANTS.centerY001 - CONSTANTS.radius * trace_arr[3],
        ],
        strokeColor: strokeColor || "red",
        strokeWidth: 2,
        dashArray: [10, 3],
      });
      break;
    default:
      alert("Error occured in trace_error", trace_arr.length);
  }
  trace.onClick = function (event) {
    trace.visible = false;
  };
  trace.onMouseEnter = function (event) {
    trace.style.strokeWidth = 3;
    tooltip.innerHTML =
      "Miller indices of selected trace: [" + vec[0] + vec[1] + vec[2] + "]";
  };
  trace.onMouseLeave = function (event) {
    trace.scale.dashArray = [10, 3];
    trace.style.strokeWidth = 2;
    tooltip.innerHTML = "Hover point or trace for miller indices";
  };
}

// EVENT LISTENERS
// ---------------

document
  .getElementById("vector-submit-001")
  .addEventListener("click", function () {
    var inputx = document.getElementById("vector-x-001").value;
    var inputy = document.getElementById("vector-y-001").value;
    var inputz = document.getElementById("vector-z-001").value;

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
      var plotpoint = new Vec3D(inputx, inputy, inputz, 1);
      vec_string = JSON.stringify(plotpoint.getVector());
      if (vec_string in colormap) {
        drawPoint001(plotpoint, colormap[vec_string], colormap[vec_string]);
      } else {
        colormap[vec_string] = getRandomColor();
        drawPoint001(plotpoint, colormap[vec_string], colormap[vec_string]);
      }
    }
  });

document
  .getElementById("trace-submit-001")
  .addEventListener("click", function () {
    var inputx = document.getElementById("vector-x-001").value;
    var inputy = document.getElementById("vector-y-001").value;
    var inputz = document.getElementById("vector-z-001").value;

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
      var tracepoint = new Vec3D(inputx, inputy, inputz, 1);
      vec_string = JSON.stringify(tracepoint.getVector());
      if (vec_string in colormap) {
        drawTrace001(tracepoint, colormap[vec_string], colormap[vec_string]);
      } else {
        colormap[vec_string] = getRandomColor();
        drawTrace001(tracepoint, colormap[vec_string], colormap[vec_string]);
      }
    }
  });

var wulff001 = document.getElementById("wulff-net-001");
document
  .getElementById("wulff-net-001-button")
  .addEventListener("click", function () {
    if (wulff001.style.display === "none") {
      wulff001.style.display = "block";
    } else {
      wulff001.style.display = "none";
    }
  });
var angle001 = 0;
document
  .getElementById("wulff-001-left")
  .addEventListener("click", function (e) {
    if (e.detail === 1 || e.detail === 2) angle001 -= 1;
    wulff001.style.transform = "rotate(" + angle001 + "deg)";
  });

document
  .getElementById("wulff-001-right")
  .addEventListener("click", function (e) {
    if (e.detail === 1 || e.detail === 2) angle001 += 1;
    wulff001.style.transform = "rotate(" + angle001 + "deg)";
  });

document
  .getElementById("wulff-001-left-e")
  .addEventListener("click", function (e) {
    if (e.detail === 1 || e.detail === 2) angle001 -= 10;
    wulff001.style.transform = "rotate(" + angle001 + "deg)";
  });

document
  .getElementById("wulff-001-right-e")
  .addEventListener("click", function (e) {
    if (e.detail === 1 || e.detail === 2) angle001 += 10;
    wulff001.style.transform = "rotate(" + angle001 + "deg)";
  });

function plot_Family001(pc, ix, iy, iz) {
  for (var i = 0; i < pc.length; i++) {
    a = pc[i][0];
    b = pc[i][1];
    c = pc[i][2];
    var famplot = new Vec3D(a, b, c, 1);
    var colplot = new Vec3D(ix, iy, iz, 1);
    vec_string = JSON.stringify(colplot.getVector());
    if (vec_string in colormap) {
      drawPoint001(famplot, "black", colormap[vec_string]);
    } else {
      colormap[vec_string] = getRandomColor();
      drawPoint001(famplot, "black", colormap[vec_string]);
    }
  }
}

document
  .getElementById("families-submit-001")
  .addEventListener("click", function () {
    var inputx = document.getElementById("vector-x-001").value;
    var inputy = document.getElementById("vector-y-001").value;
    var inputz = document.getElementById("vector-z-001").value;

    console.log(
      "a",
      Math.abs(Number(inputx)),
      Math.abs(Number(inputy)),
      Math.abs(Number(inputz))
    );
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
      if (inputx < 0) {
        inputz = inputz * -1;
        inputx = inputx * -1;
        inputy = inputy * -1;
      }

      pc1 = Combinations(inputx, inputy, inputz);
      pc2 = Combinations(-inputx, inputy, inputz);
      pc3 = Combinations(inputx, -inputy, inputz);
      pc4 = Combinations(inputx, inputy, -inputz);
      pc5 = Combinations(-inputx, -inputy, inputz);
      pc6 = Combinations(inputx, -inputy, -inputz);
      pc7 = Combinations(-inputx, inputy, -inputz);
      pc8 = Combinations(-inputx, -inputy, -inputz);

      plot_Family001(pc1, inputx, inputy, inputz);
      plot_Family001(pc2, inputx, inputy, inputz);
      plot_Family001(pc3, inputx, inputy, inputz);
      plot_Family001(pc4, inputx, inputy, inputz);
      plot_Family001(pc5, inputx, inputy, inputz);
      plot_Family001(pc6, inputx, inputy, inputz);
      plot_Family001(pc7, inputx, inputy, inputz);
      plot_Family001(pc8, inputx, inputy, inputz);
      //document.getElementById("show-trace").addEventListener("click", function () {
      //drawTrace(inputx,inputy, inputz);
      //}
    }
  });
// -------------------------------------------------------------
// ----------------------------------------------------------
// 010
// -------------------------------------------------------------
// ------------------------------------------------------------

// var CONSTANTS = {
//   canwidht: document.getElementById("canvas-010").clientWidth,
//   canheight: document.getElementById("canvas-010").clientHeight,
//   centerX: 250,
//   centerY: 250,
//   radius: 200,
// };
var mainCircle = new Path.Circle({
  center: new Point(CONSTANTS.centerX010, CONSTANTS.centerY010),
  radius: CONSTANTS.radius,
  strokeColor: "green",
  dashArray: [1, 0],
});

var center = new Path.Circle({
  center: new Point(CONSTANTS.centerX010, CONSTANTS.centerY010),
  radius: 3,
  fillColor: "black",
});

function drawPoint010(vec3dpoint, strokeColor, fillColor) {
  var p = vec3dpoint.getProjection();
  var og = vec3dpoint.getOGVector;
  var vec = vec3dpoint.getVector();
  var point = new Path.Circle({
    center: new Point(
      CONSTANTS.centerX010 + p[0] * CONSTANTS.radius,
      CONSTANTS.centerY010 - p[1] * CONSTANTS.radius
    ),
    radius: 2,
    strokeColor: strokeColor || "black",
    fillColor: fillColor || "black",
  });

  point.onClick = function (event) {
    point.fillColor = "white";
    point.visible = false;
  };
  point.onMouseEnter = function (event) {
    point.scale(1.5);
    tooltip.innerHTML =
      "Miller indices of selected point: " + vec[0] + vec[1] + vec[2];
  };
  point.onMouseLeave = function (event) {
    point.scale(1 / 1.5);
    tooltip.innerHTML = "Hover point or trace for miller indices";
  };

  // var awesometext = new PointText({
  //   position: [
  //     CONSTANTS.centerX010 + p[0] * CONSTANTS.radius - 10,
  //     CONSTANTS.centerY010 - p[1] * CONSTANTS.radius - 10,
  //   ],
  //   content: "[" + og()[0] + og()[1] + og()[2] + "]",
  //   fillColor: fillColor || "black",
  //   fontFamily: "Courier New",
  //   fontWeight: "bold",
  //   fontSize: 12,
  //   opacity: 1,
  // });
}

function drawTrace010(vec3dpoint, strokeColor, fillColor) {
  console.log("START", vec3dpoint);
  var trace_arr = vec3dpoint.getTrace();
  var vec = vec3dpoint.getVector();
  switch (trace_arr.length) {
    case 8:
      var trace = new Path.Circle({
        center: [CONSTANTS.centerX010, CONSTANTS.centerY010],
        radius: CONSTANTS.radius,
        strokeColor: strokeColor || "red",
        strokeWidth: 2,
        dashArray: [10, 3],
      });
      break;
    case 6:
      var trace = new Path.Arc({
        from: [
          CONSTANTS.centerX010 + CONSTANTS.radius * trace_arr[0],
          CONSTANTS.centerY010 - CONSTANTS.radius * trace_arr[1],
        ],
        through: [
          CONSTANTS.centerX010 + CONSTANTS.radius * trace_arr[4],
          CONSTANTS.centerY010 - CONSTANTS.radius * trace_arr[5],
        ],
        to: [
          CONSTANTS.centerX010 + CONSTANTS.radius * trace_arr[2],
          CONSTANTS.centerY010 - CONSTANTS.radius * trace_arr[3],
        ],
        strokeWidth: 1,
        strokeColor: strokeColor || "red",
        strokeWidth: 2,
        dashArray: [10, 3],
      });
      break;
    case 4:
      var trace = new Path.Line({
        from: [
          CONSTANTS.centerX010 + CONSTANTS.radius * trace_arr[0],
          CONSTANTS.centerY010 - CONSTANTS.radius * trace_arr[1],
        ],
        to: [
          CONSTANTS.centerX010 + CONSTANTS.radius * trace_arr[2],
          CONSTANTS.centerY010 - CONSTANTS.radius * trace_arr[3],
        ],
        strokeColor: strokeColor || "red",
        strokeWidth: 2,
        dashArray: [10, 3],
      });
      break;
    default:
      alert("Error occured in trace_error", trace_arr.length);
  }
  trace.onClick = function (event) {
    trace.visible = false;
  };
  trace.onMouseEnter = function (event) {
    trace.style.strokeWidth = 3;
    tooltip.innerHTML =
      "Miller indices of selected point: [" + vec[0] + vec[1] + vec[2] + "]";
  };
  trace.onMouseLeave = function (event) {
    trace.scale.dashArray = [10, 3];
    trace.style.strokeWidth = 2;
    tooltip.innerHTML = "Hover point or trace for miller indices";
  };
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
      vec_string = JSON.stringify(plotpoint.getVector());
      if (vec_string in colormap) {
        drawPoint010(plotpoint, colormap[vec_string]);
      } else {
        colormap[vec_string] = getRandomColor();
        drawPoint010(plotpoint, colormap[vec_string]);
      }
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
      vec_string = JSON.stringify(tracepoint.getVector());
      if (vec_string in colormap) {
        drawTrace010(tracepoint, colormap[vec_string], colormap[vec_string]);
      } else {
        colormap[vec_string] = getRandomColor();
        drawTrace010(tracepoint, colormap[vec_string], colormap[vec_string]);
      }
    }
  });

var wulff010 = document.getElementById("wulff-net-010");
document
  .getElementById("wulff-net-010-button")
  .addEventListener("click", function () {
    if (wulff010.style.display === "none") {
      wulff010.style.display = "block";
    } else {
      wulff010.style.display = "none";
    }
  });
var angle010 = 0;
document
  .getElementById("wulff-010-left")
  .addEventListener("click", function (e) {
    if (e.detail === 1 || e.detail === 2) angle010 -= 1;
    wulff010.style.transform = "rotate(" + angle010 + "deg)";
  });

document
  .getElementById("wulff-010-right")
  .addEventListener("click", function (e) {
    if (e.detail === 1 || e.detail === 2) angle010 += 1;
    wulff010.style.transform = "rotate(" + angle010 + "deg)";
  });

document
  .getElementById("wulff-010-left-e")
  .addEventListener("click", function (e) {
    if (e.detail === 1 || e.detail === 2) angle010 -= 10;
    wulff010.style.transform = "rotate(" + angle010 + "deg)";
  });

document
  .getElementById("wulff-010-right-e")
  .addEventListener("click", function (e) {
    if (e.detail === 1 || e.detail === 2) angle010 += 10;
    wulff010.style.transform = "rotate(" + angle010 + "deg)";
  });

function plot_Family010(pc, ix, iy, iz) {
  for (var i = 0; i < pc.length; i++) {
    a = pc[i][0];
    b = pc[i][1];
    c = pc[i][2];
    var famplot = new Vec3D(a, b, c, 10);
    var colplot = new Vec3D(ix, iy, iz, 10);
    vec_string = JSON.stringify(colplot.getVector());
    if (vec_string in colormap) {
      drawPoint010(famplot, "black", colormap[vec_string]);
    } else {
      colormap[vec_string] = getRandomColor();
      drawPoint010(famplot, "black", colormap[vec_string]);
    }
  }
}

document
  .getElementById("families-submit-010")
  .addEventListener("click", function () {
    var inputx = document.getElementById("vector-x-010").value;
    var inputy = document.getElementById("vector-y-010").value;
    var inputz = document.getElementById("vector-z-010").value;

    console.log(
      "a",
      Math.abs(Number(inputx)),
      Math.abs(Number(inputy)),
      Math.abs(Number(inputz))
    );
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
      if (inputx < 0) {
        inputz = inputz * -1;
        inputx = inputx * -1;
        inputy = inputy * -1;
      }

      pc1 = Combinations(inputx, inputy, inputz);
      pc2 = Combinations(-inputx, inputy, inputz);
      pc3 = Combinations(inputx, -inputy, inputz);
      pc4 = Combinations(inputx, inputy, -inputz);
      pc5 = Combinations(-inputx, -inputy, inputz);
      pc6 = Combinations(inputx, -inputy, -inputz);
      pc7 = Combinations(-inputx, inputy, -inputz);
      pc8 = Combinations(-inputx, -inputy, -inputz);

      plot_Family010(pc1, inputx, inputy, inputz);
      plot_Family010(pc2, inputx, inputy, inputz);
      plot_Family010(pc3, inputx, inputy, inputz);
      plot_Family010(pc4, inputx, inputy, inputz);
      plot_Family010(pc5, inputx, inputy, inputz);
      plot_Family010(pc6, inputx, inputy, inputz);
      plot_Family010(pc7, inputx, inputy, inputz);
      plot_Family010(pc8, inputx, inputy, inputz);
      //document.getElementById("show-trace").addEventListener("click", function () {
      //drawTrace(inputx,inputy, inputz);
      //}
    }
  });
// ------------------------------------------------------------
// --------------------------------------------------------------
// 100
// --------------------------------------------------------------
// -------------------------------------------------------------

var mainCircle = new Path.Circle({
  center: new Point(CONSTANTS.centerX100, CONSTANTS.centerY100),
  radius: CONSTANTS.radius,
  strokeColor: "green",
  dashArray: [1, 0],
});

var center = new Path.Circle({
  center: new Point(CONSTANTS.centerX100, CONSTANTS.centerY100),
  radius: 3,
  fillColor: "black",
});

function drawPoint100(vec3dpoint, strokeColor, fillColor) {
  var p = vec3dpoint.getProjection();
  var og = vec3dpoint.getOGVector;
  var vec = vec3dpoint.getVector();
  var point = new Path.Circle({
    center: new Point(
      CONSTANTS.centerX100 + p[0] * CONSTANTS.radius,
      CONSTANTS.centerY100 - p[1] * CONSTANTS.radius
    ),
    radius: 2,
    strokeColor: strokeColor || "black",
    fillColor: fillColor || "black",
  });

  point.onClick = function (event) {
    point.fillColor = "white";
    point.visible = false;
  };
  point.onMouseEnter = function (event) {
    point.scale(1.5);
    tooltip.innerHTML =
      "Miller indices of selected point: " + vec[0] + vec[1] + vec[2];
  };
  point.onMouseLeave = function (event) {
    point.scale(1 / 1.5);
    tooltip.innerHTML = "Hover point or trace for miller indices";
  };

  // var awesometext = new PointText({
  //   position: [
  //     CONSTANTS.centerX100 + p[0] * CONSTANTS.radius - 10,
  //     CONSTANTS.centerY100 - p[1] * CONSTANTS.radius - 10,
  //   ],
  //   content: "[" + og()[0] + og()[1] + og()[2] + "]",
  //   fillColor: fillColor || "black",
  //   fontFamily: "Courier New",
  //   fontWeight: "bold",
  //   fontSize: 12,
  //   opacity: 1,
  // });
}

function drawTrace100(vec3dpoint, strokeColor, fillColor) {
  var trace_arr = vec3dpoint.getTrace();
  var vec = vec3dpoint.getVector();
  switch (trace_arr.length) {
    case 8:
      var trace = new Path.Circle({
        center: [CONSTANTS.centerX100, CONSTANTS.centerY100],
        radius: CONSTANTS.radius,
        strokeColor: strokeColor || "red",
        strokeWidth: 2,
        dashArray: [10, 3],
      });
      break;
    case 6:
      var trace = new Path.Arc({
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
        strokeColor: strokeColor || "red",
        strokeWidth: 2,
        dashArray: [10, 3],
      });
      break;
    case 4:
      var trace = new Path.Line({
        from: [
          CONSTANTS.centerX100 + CONSTANTS.radius * trace_arr[0],
          CONSTANTS.centerY100 - CONSTANTS.radius * trace_arr[1],
        ],
        to: [
          CONSTANTS.centerX100 + CONSTANTS.radius * trace_arr[2],
          CONSTANTS.centerY100 - CONSTANTS.radius * trace_arr[3],
        ],
        strokeColor: strokeColor || "red",
        dashArray: [10, 3],
      });
      break;
    default:
      alert("Error occured in trace_error", trace_arr.length);
  }
  trace.onClick = function (event) {
    trace.visible = false;
  };
  trace.onMouseEnter = function (event) {
    trace.style.strokeWidth = 3;
    tooltip.innerHTML =
      "Miller indices of selected trace: [" + vec[0] + vec[1] + vec[2] + "]";
  };
  trace.onMouseLeave = function (event) {
    trace.scale.dashArray = [10, 3];
    trace.style.strokeWidth = 2;
    tooltip.innerHTML = "Hover point or trace for miller indices";
  };
}

// EVENT LISTENERS
// ---------------

document
  .getElementById("vector-submit-100")
  .addEventListener("click", function () {
    var inputx = document.getElementById("vector-x-100").value;
    var inputy = document.getElementById("vector-y-100").value;
    var inputz = document.getElementById("vector-z-100").value;

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
      var plotpoint = new Vec3D(inputx, inputy, inputz, 100);
      vec_string = JSON.stringify(plotpoint.getVector());
      if (vec_string in colormap) {
        drawPoint100(plotpoint, colormap[vec_string]);
      } else {
        colormap[vec_string] = getRandomColor();
        drawPoint100(plotpoint, colormap[vec_string]);
      }
    }
  });

document
  .getElementById("trace-submit-100")
  .addEventListener("click", function () {
    var inputx = document.getElementById("vector-x-100").value;
    var inputy = document.getElementById("vector-y-100").value;
    var inputz = document.getElementById("vector-z-100").value;

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
      var tracepoint = new Vec3D(inputx, inputy, inputz, 100);
      vec_string = JSON.stringify(tracepoint.getVector());
      if (vec_string in colormap) {
        drawTrace100(tracepoint, colormap[vec_string], colormap[vec_string]);
      } else {
        colormap[vec_string] = getRandomColor();
        drawTrace100(tracepoint, colormap[vec_string], colormap[vec_string]);
      }
    }
  });

var wulff100 = document.getElementById("wulff-net-100");
document
  .getElementById("wulff-net-100-button")
  .addEventListener("click", function () {
    if (wulff100.style.display === "none") {
      wulff100.style.display = "block";
    } else {
      wulff100.style.display = "none";
    }
  });
var angle100 = 0;
document
  .getElementById("wulff-100-left")
  .addEventListener("click", function (e) {
    if (e.detail === 1 || e.detail === 2) angle100 -= 1;
    wulff100.style.transform = "rotate(" + angle100 + "deg)";
  });

document
  .getElementById("wulff-100-right")
  .addEventListener("click", function (e) {
    if (e.detail === 1 || e.detail === 2) angle100 += 1;
    wulff100.style.transform = "rotate(" + angle100 + "deg)";
  });

document
  .getElementById("wulff-100-left-e")
  .addEventListener("click", function (e) {
    if (e.detail === 1 || e.detail === 2) angle100 -= 10;
    wulff100.style.transform = "rotate(" + angle100 + "deg)";
  });

document
  .getElementById("wulff-100-right-e")
  .addEventListener("click", function (e) {
    if (e.detail === 1 || e.detail === 2) angle100 += 10;
    wulff100.style.transform = "rotate(" + angle100 + "deg)";
  });

function plot_Family100(pc, ix, iy, iz) {
  for (var i = 0; i < pc.length; i++) {
    a = pc[i][0];
    b = pc[i][1];
    c = pc[i][2];
    var famplot = new Vec3D(a, b, c, 100);
    var colplot = new Vec3D(ix, iy, iz, 100);
    vec_string = JSON.stringify(colplot.getVector());
    if (vec_string in colormap) {
      drawPoint100(famplot, "black", colormap[vec_string]);
    } else {
      colormap[vec_string] = getRandomColor();
      drawPoint100(famplot, "black", colormap[vec_string]);
    }
  }
}

document
  .getElementById("families-submit-100")
  .addEventListener("click", function () {
    var inputx = document.getElementById("vector-x-100").value;
    var inputy = document.getElementById("vector-y-100").value;
    var inputz = document.getElementById("vector-z-100").value;

    console.log(
      "a",
      Math.abs(Number(inputx)),
      Math.abs(Number(inputy)),
      Math.abs(Number(inputz))
    );
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
      if (inputx < 0) {
        inputz = inputz * -1;
        inputx = inputx * -1;
        inputy = inputy * -1;
      }

      pc1 = Combinations(inputx, inputy, inputz);
      pc2 = Combinations(-inputx, inputy, inputz);
      pc3 = Combinations(inputx, -inputy, inputz);
      pc4 = Combinations(inputx, inputy, -inputz);
      pc5 = Combinations(-inputx, -inputy, inputz);
      pc6 = Combinations(inputx, -inputy, -inputz);
      pc7 = Combinations(-inputx, inputy, -inputz);
      pc8 = Combinations(-inputx, -inputy, -inputz);

      plot_Family100(pc1, inputx, inputy, inputz);
      plot_Family100(pc2, inputx, inputy, inputz);
      plot_Family100(pc3, inputx, inputy, inputz);
      plot_Family100(pc4, inputx, inputy, inputz);
      plot_Family100(pc5, inputx, inputy, inputz);
      plot_Family100(pc6, inputx, inputy, inputz);
      plot_Family100(pc7, inputx, inputy, inputz);
      plot_Family100(pc8, inputx, inputy, inputz);
      //document.getElementById("show-trace").addEventListener("click", function () {
      //drawTrace(inputx,inputy, inputz);
      //}
    }
  });

// -------------------------------------------------
// -----------------non class functions-------------------
// -------------------------------------------------
