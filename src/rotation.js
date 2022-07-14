var drawn = false;

var tooltip = document.getElementById("point-tooltip");

var CONSTANTS = {
  centerx: document.getElementById("canvas").clientWidth / 2,
  centery: document.getElementById("canvas").clientHeight / 2,
  radius: 300,
};

var Vector3D = (function (x, y, z) {
  function Vector3D(x, y, z) {
    this.ogvector = [x, y, z];
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
    v = [vec_array[0] / mag, vec_array[1] / mag, vec_array[2] / mag];
    vsign = [v[0] < 0 ? -1 : 1, v[1] < 0 ? -1 : 1, v[2] < 0 ? -1 : 1];
    return [v[1] / (1 + v[2]), -v[0] / (1 + v[2])];
  };

  Vector3D.prototype.calculateTrace = function () {
    vec_array = [this.x, this.y, this.z];
    // if any emenet of vec_array is infinity change to 0
    for (var i = 0; i < vec_array.length; i++) {
      if (isNaN(vec_array[i]) || vec_array[i] === Infinity) {
        vec_array[i] = 0;
      }
    }

    h = this.x;
    k = this.y;
    l = this.z;

    if (h == 0.0 && k == 0.0 && l == 0.0) {
      return [0, 0, 0, 0, 0, 0];
    } else if (h == 0.0 && k == 0.0) {
      console.log("Hello");
      return [-1, 0, 0, 1, 1, 0, 0, -1];
    } else if (k == 0 && l == 0) {
      return [-1, 0, 1, 0, 0, 0];
    } else if (h == 0 && l == 0) {
      return [0, -1, 0, 1, 0, 0];
    } else if (h == 0) {
      var X3 = 0;
      var Y3 = -(l / k);
      var Z3 = 1;
      var mag = Math.sqrt(X3 * X3 + Y3 * Y3 + Z3 * Z3);
      X3 = X3 / mag;
      Y3 = Y3 / mag;
      Z3 = Z3 / mag;
      x3 = Y3 / (1 + Z3);
      return [0, 1, 0, -1, x3, 0];
    } else if (k == 0) {
      var Y3 = 0;
      var Z3 = 1;
      var X3 = -(l / h);
      var mag = Math.sqrt(X3 * X3 + Y3 * Y3 + Z3 * Z3);
      X3 = X3 / mag;
      Y3 = Y3 / mag;
      Z3 = Z3 / mag;
      y3 = -X3 / (1 + Z3);
      return [-1, 0, 1, 0, 0, y3];
    } else if (l == 0) {
      var X1 = -k;
      var Y1 = h;
      var mag1 = Math.sqrt(X1 * X1 + Y1 * Y1);
      X1 = X1 / mag1;
      Y1 = Y1 / mag1;
      var x1 = Y1;
      var y1 = -X1;

      var X2 = k;
      var Y2 = -h;
      X2 = X2 / mag1;
      Y2 = Y2 / mag1;
      var x2 = Y2;
      var y2 = -X2;
      return [x1, y1, x2, y2];
    } else {
      var X1 = 1;
      var Y1 = -(h / k);
      var x1 = Y1 / Math.sqrt(X1 * X1 + Y1 * Y1);
      var y1 = -X1 / Math.sqrt(X1 * X1 + Y1 * Y1);

      var x2 = -x1;
      var y2 = -y1;

      var X3 = -(l / h);
      var Y3 = 0;
      var Z3 = 1;
      var mag = Math.sqrt(X3 * X3 + Y3 * Y3 + Z3 * Z3);
      X3 = X3 / mag;
      Y3 = Y3 / mag;
      Z3 = Z3 / mag;
      var x3 = Y3 / (1 + Z3);
      var y3 = -X3 / (1 + Z3);
      return [x1, y1, x2, y2, x3, y3];
    }
  };

  Vector3D.prototype.vector = function () {
    console.log("this.vector", this.ogvector);
    return this.ogvector;
  };

  return Vector3D;
})();

var input_arr = [
  [2, 2, 1],
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1],
];
var points_arr = [];

input_arr.forEach(function (element) {
  var v = new Vector3D(element[0], element[1], element[2]);
  points_arr.push(v.calculate2Dprojection());
});

var mainCircle = new Path.Circle({
  center: [CONSTANTS.centerx, CONSTANTS.centery],
  radius: CONSTANTS.radius,
  strokeWidth: 2,
  strokeColor: "green",
  dashArray: [1, 0],
});

var center = new Path.Circle(
  new Point(CONSTANTS.centerx, CONSTANTS.centery),
  2
);
center.strokeColor = "black";

function Draw() {
  points_arr.forEach(function (point, i) {
    var dot = new Path.Circle({
      center: new Point(
        CONSTANTS.centerx + point[0] * CONSTANTS.radius,
        CONSTANTS.centery - point[1] * CONSTANTS.radius
      ),
      radius: 2,
      strokeWidth: 2,
      strokeColor: "black",
      fillColor: "black",
    });

    // console.log("point", point);
    var awesometext = new PointText({
      position: [
        CONSTANTS.centerx + point[0] * CONSTANTS.radius - 10,
        CONSTANTS.centery - point[1] * CONSTANTS.radius - 10,
      ],
      content: "[" + input_arr[i][0] + input_arr[i][1] + input_arr[i][2] + "]", // "[" + point[0].toFixed(2) + "," + point[1].toFixed(2) + "]",
      fillColor: "black",
      fontFamily: "Courier New",
      fontWeight: "bold",
      fontSize: 10,
      opacity: 1,
    });
  });
}

function drawPoint(x, y, z, h, k, l, color, orientation) {
  var vec = new Vector3D(x, y, z);
  var p = vec.calculate2Dprojection();
  var point = new Path.Circle({
    center: new Point(
      CONSTANTS.centerx + p[0] * CONSTANTS.radius,
      CONSTANTS.centery - p[1] * CONSTANTS.radius
    ),
    radius: 2,
    strokeColor: color,
    strokeWidth: 2,
    fillColor: color,
  });

  point.onClick = function (event) {
    point.fillColor = "white";
    point.visible = false;
  };
  point.onMouseEnter = function (event) {
    point.scale(1.5);
    tooltip.innerHTML = "Miller indices of selected point: " + h + k + l;
  };
  point.onMouseLeave = function (event) {
    point.scale(1 / 1.5);
    tooltip.innerHTML = "Hover point or trace for miller indices";
  };
  if (orientation) {
    var awesometext = new PointText({
      position: [
        CONSTANTS.centerx + p[0] * CONSTANTS.radius - 10,
        CONSTANTS.centery - p[1] * CONSTANTS.radius - 10,
      ],
      content: h + k + l, // "[" + point[0].toFixed(2) + "," + point[1].toFixed(2) + "]",
      fillColor: "black",
      fontFamily: "Courier New",
      fontWeight: "bold",
      fontSize: 12,
      opacity: 1,
    });
  }
}

function drawTrace(x, y, z, inputx, inputy, inputz) {
  var vec = new Vector3D(x, y, z);
  var p = vec.calculateTrace();

  if (p.length > 6) {
    var trace = new Path.Circle({
      center: [CONSTANTS.centerx, CONSTANTS.centery],
      radius: CONSTANTS.radius,
      strokeWidth: 2,
      strokeColor: "red",
      dashArray: [10, 3],
    });
  } else if (p.length < 6) {
    var x1 = p[0];
    var y1 = p[1];
    var x2 = p[2];
    var y2 = p[3];
    var trace = new Path.Line({
      from: [
        CONSTANTS.centerx + CONSTANTS.radius * x1,
        CONSTANTS.centery - CONSTANTS.radius * y1,
      ],
      to: [
        CONSTANTS.centerx + CONSTANTS.radius * x2,
        CONSTANTS.centery - CONSTANTS.radius * y2,
      ],
      strokeWidth: 2,
      strokeColor: "red",
      dashArray: [10, 3],
    });
  } else {
    var x1 = p[0];
    var y1 = p[1];
    var x2 = p[2];
    var y2 = p[3];
    var x3 = p[4];
    var y3 = p[5];

    var trace = new Path.Arc({
      from: [
        CONSTANTS.centerx + x1 * CONSTANTS.radius,
        CONSTANTS.centery - CONSTANTS.radius * y1,
      ],
      through: [
        CONSTANTS.centerx + CONSTANTS.radius * x3,
        CONSTANTS.centery - CONSTANTS.radius * y3,
      ],
      to: [
        CONSTANTS.centerx + CONSTANTS.radius * x2,
        CONSTANTS.centery - CONSTANTS.radius * y2,
      ],
      strokeWidth: 2,
      strokeColor: "red",
      dashArray: [10, 3],
    });
  }

  trace.onClick = function (event) {
    trace.visible = false;
  };
  trace.onMouseEnter = function (event) {
    trace.style.strokeWidth = 3;
    tooltip.innerHTML =
      "Miller indices of selected trace: [" + inputx + inputy + inputz + "]";
  };
  trace.onMouseLeave = function (event) {
    trace.scale.dashArray = [10, 5];
    trace.style.strokeWidth = 2;
    tooltip.innerHTML = "Hover point or trace for miller indices";
  };
}

function CrossProduct(v1, v2) {
  var a1 = v1[0];
  var b1 = v1[1];
  var c1 = v1[2];

  var a2 = v2[0];
  var b2 = v2[1];
  var c2 = v2[2];

  answer = new Array(3);

  answer[0] = b1 * c2 - c1 * b2;
  answer[1] = -a1 * c2 + c1 * a2;
  answer[2] = a1 * b2 - b1 * a2;

  return answer;
}

function QuaternionMultiply(q1, q2) {
  var a1 = q1[0];
  var b1 = q1[1];
  var c1 = q1[2];
  var d1 = q1[3];

  var a2 = q2[0];
  var b2 = q2[1];
  var c2 = q2[2];
  var d2 = q2[3];

  output = new Array(4);

  output[0] = a1 * a2 - b1 * b2 - c1 * c2 - d1 * d2;
  output[1] = a1 * b2 + b1 * a2 + c1 * d2 - d1 * c2;
  output[2] = a1 * c2 - b1 * d2 + c1 * a2 + d1 * b2;
  output[3] = a1 * d2 + b1 * c2 - c1 * b2 + d1 * a2;

  return output;
}

function CheckZ(x, y, z, h, k, l) {
  if (z < 0) {
    return [-x, -y, -z, -h, -k, -l];
  } else {
    return [x, y, z, h, k, l];
  }
}

document.getElementById("vector-submit").addEventListener("click", function () {
  var inputx = document.getElementById("vector-x").value;
  var inputy = document.getElementById("vector-y").value;
  var inputz = document.getElementById("vector-z").value;

  var ox = document.getElementById("orientation-x").value;
  var oy = document.getElementById("orientation-y").value;
  var oz = document.getElementById("orientation-z").value;

  console.log(
    "a",
    Math.abs(Number(inputx)),
    Math.abs(Number(inputy)),
    Math.abs(Number(inputz))
  );
  if (isNaN(Number(inputx)) || isNaN(Number(inputy)) || isNaN(Number(inputz))) {
    alert("Please enter a valid number");
  } else if (
    Math.abs(inputx) > 10 ||
    Math.abs(inputy) > 10 ||
    Math.abs(inputz) > 10
  ) {
    alert("Please enter a valid number");
  } else {
    var z_axis = [0, 0, 1];
    var new_pole = [ox, oy, oz];
    var rot_axis = CrossProduct(z_axis, new_pole);
    var mag_rot_axis = Math.sqrt(
      rot_axis[0] * rot_axis[0] +
        rot_axis[1] * rot_axis[1] +
        rot_axis[2] * rot_axis[2]
    );
    var mag_input = Math.sqrt(
      inputx * inputx + inputy * inputy + inputz * inputz
    );
    rot_axis[0] = rot_axis[0] / mag_rot_axis;
    rot_axis[1] = rot_axis[1] / mag_rot_axis;
    rot_axis[2] = rot_axis[2] / mag_rot_axis;
    var theta = -Math.acos(oz / Math.sqrt(ox * ox + oy * oy + oz * oz)) / 2;
    var q1 = [
      Math.cos(theta),
      Math.sin(theta) * rot_axis[0],
      Math.sin(theta) * rot_axis[1],
      Math.sin(theta) * rot_axis[2],
    ];
    var q1_t = [
      Math.cos(theta),
      -Math.sin(theta) * rot_axis[0],
      -Math.sin(theta) * rot_axis[1],
      -Math.sin(theta) * rot_axis[2],
    ];
    var q_input = [
      0,
      inputx / mag_input,
      inputy / mag_input,
      inputz / mag_input,
    ];

    var final = QuaternionMultiply(QuaternionMultiply(q1, q_input), q1_t);
    if (final[3].toFixed(2) < 0) {
      final[1] = final[1] * -1;
      final[2] = final[2] * -1;
      final[3] = final[3] * -1;
    }
    drawPoint(
      final[1].toFixed(2),
      final[2].toFixed(2),
      final[3].toFixed(2),
      inputx,
      inputy,
      inputz,
      "black"
    );
  }
});

document.getElementById("show-trace").addEventListener("click", function () {
  var inputx = document.getElementById("vector-x").value;
  var inputy = document.getElementById("vector-y").value;
  var inputz = document.getElementById("vector-z").value;

  var ox = document.getElementById("orientation-x").value;
  var oy = document.getElementById("orientation-y").value;
  var oz = document.getElementById("orientation-z").value;

  console.log(
    "a",
    Math.abs(Number(inputx)),
    Math.abs(Number(inputy)),
    Math.abs(Number(inputz))
  );
  if (isNaN(Number(inputx)) || isNaN(Number(inputy)) || isNaN(Number(inputz))) {
    alert("Please enter a valid number");
  } else if (
    Math.abs(inputx) > 10 ||
    Math.abs(inputy) > 10 ||
    Math.abs(inputz) > 10
  ) {
    alert("Please enter a valid number");
  } else {
    var z_axis = [0, 0, 1];
    var new_pole = [ox, oy, oz];
    var rot_axis = CrossProduct(z_axis, new_pole);
    var mag_rot_axis = Math.sqrt(
      rot_axis[0] * rot_axis[0] +
        rot_axis[1] * rot_axis[1] +
        rot_axis[2] * rot_axis[2]
    );
    var mag_input = Math.sqrt(
      inputx * inputx + inputy * inputy + inputz * inputz
    );
    rot_axis[0] = rot_axis[0] / mag_rot_axis;
    rot_axis[1] = rot_axis[1] / mag_rot_axis;
    rot_axis[2] = rot_axis[2] / mag_rot_axis;
    var theta = -Math.acos(oz / Math.sqrt(ox * ox + oy * oy + oz * oz)) / 2;
    var q1 = [
      Math.cos(theta),
      Math.sin(theta) * rot_axis[0],
      Math.sin(theta) * rot_axis[1],
      Math.sin(theta) * rot_axis[2],
    ];
    var q1_t = [
      Math.cos(theta),
      -Math.sin(theta) * rot_axis[0],
      -Math.sin(theta) * rot_axis[1],
      -Math.sin(theta) * rot_axis[2],
    ];
    var q_input = [
      0,
      inputx / mag_input,
      inputy / mag_input,
      inputz / mag_input,
    ];

    var intermediate = QuaternionMultiply(q1, q_input);
    var final = QuaternionMultiply(intermediate, q1_t);
    if (final[3].toFixed(2) < 0) {
      final[1] = final[1] * -1;
      final[2] = final[2] * -1;
      final[3] = final[3] * -1;
    }
    console.log(final[1].toFixed(3), final[2].toFixed(3), final[3].toFixed(3));
    console.log(
      intermediate[0],
      intermediate[1],
      intermediate[2],
      intermediate[3]
    );
    drawTrace(
      final[1].toFixed(2),
      final[2].toFixed(2),
      final[3].toFixed(2),
      inputx,
      inputy,
      inputz
    );
  }
});

document
  .getElementById("change-orientation")
  .addEventListener("click", function () {
    var ox = document.getElementById("orientation-x").value;
    var oy = document.getElementById("orientation-y").value;
    var oz = document.getElementById("orientation-z").value;

    drawPoint(0, 0, 1, ox, oy, oz, "black", true);
  });

var wulff100 = document.getElementById("wulff-net");
document
  .getElementById("wulff-net-button")
  .addEventListener("click", function () {
    if (wulff100.style.display === "none") {
      wulff100.style.display = "block";
    } else {
      wulff100.style.display = "none";
    }
  });
var angle100 = 0;
document.getElementById("wulff-left").addEventListener("click", function (e) {
  if (e.detail === 1 || e.detail === 2) angle100 -= 1;
  wulff100.style.transform = "rotate(" + angle100 + "deg)";
});

document.getElementById("wulff-right").addEventListener("click", function (e) {
  if (e.detail === 1 || e.detail === 2) angle100 += 1;
  wulff100.style.transform = "rotate(" + angle100 + "deg)";
});

document.getElementById("wulff-left-e").addEventListener("click", function (e) {
  if (e.detail === 1 || e.detail === 2) angle100 -= 10;
  wulff100.style.transform = "rotate(" + angle100 + "deg)";
});

document
  .getElementById("wulff-right-e")
  .addEventListener("click", function (e) {
    if (e.detail === 1 || e.detail === 2) angle100 += 10;
    wulff100.style.transform = "rotate(" + angle100 + "deg)";
  });

// -----------------------------------------------

function CheckZ(x, y, z, h, k, l) {
  if (z < 0) {
    return [-x, -y, -z, -h, -k, -l];
  } else {
    return [x, y, z, h, k, l];
  }
}

function Combinations(a, b, c) {
  return [
    [a, b, c],
    [a, c, b],
    [b, c, a],
    [b, a, c],
    [c, a, b],
    [c, b, a],
  ];
}

function plot_Family(q1, q1_t, possible_combinations) {
  for (var i = 0; i < possible_combinations.length; i++) {
    a = possible_combinations[i][0];
    b = possible_combinations[i][1];
    c = possible_combinations[i][2];
    mod = Math.sqrt(a * a + b * b + c * c);
    input = [0, a / mod, b / mod, c / mod];
    var i1 = QuaternionMultiply(QuaternionMultiply(q1, input), q1_t);
    var g1 = CheckZ(
      i1[1].toFixed(2),
      i1[2].toFixed(2),
      i1[3].toFixed(3),
      a,
      b,
      c
    );
    drawPoint(g1[0], g1[1], g1[2], g1[3], g1[4], g1[5], "black");
    drawTrace(g1[0], g1[1], g1[2], g1[3], g1[4], g1[5]);
  }
}

document
  .getElementById("families-submit")
  .addEventListener("click", function () {
    var inputx = document.getElementById("vector-x").value;
    var inputy = document.getElementById("vector-y").value;
    var inputz = document.getElementById("vector-z").value;

    var ox = document.getElementById("orientation-x").value;
    var oy = document.getElementById("orientation-y").value;
    var oz = document.getElementById("orientation-z").value;

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
      Math.abs(inputx) > 10 ||
      Math.abs(inputy) > 10 ||
      Math.abs(inputz) > 10
    ) {
      alert("Please enter a valid number");
    } else {
      var z_axis = [0, 0, 1];
      var new_pole = [ox, oy, oz];
      var rot_axis = CrossProduct(z_axis, new_pole);
      var mag_rot_axis = Math.sqrt(
        rot_axis[0] * rot_axis[0] +
          rot_axis[1] * rot_axis[1] +
          rot_axis[2] * rot_axis[2]
      );
      var mag_input = Math.sqrt(
        inputx * inputx + inputy * inputy + inputz * inputz
      );
      rot_axis[0] = rot_axis[0] / mag_rot_axis;
      rot_axis[1] = rot_axis[1] / mag_rot_axis;
      rot_axis[2] = rot_axis[2] / mag_rot_axis;
      var theta = -Math.acos(oz / Math.sqrt(ox * ox + oy * oy + oz * oz)) / 2;
      var q1 = [
        Math.cos(theta),
        Math.sin(theta) * rot_axis[0],
        Math.sin(theta) * rot_axis[1],
        Math.sin(theta) * rot_axis[2],
      ];
      var q1_t = [
        Math.cos(theta),
        -Math.sin(theta) * rot_axis[0],
        -Math.sin(theta) * rot_axis[1],
        -Math.sin(theta) * rot_axis[2],
      ];
      var q_input = [
        0,
        inputx / mag_input,
        inputy / mag_input,
        inputz / mag_input,
      ];

      var final = QuaternionMultiply(QuaternionMultiply(q1, q_input), q1_t);
      if (final[3].toFixed(2) < 0) {
        final[1] = final[1] * -1;
        final[2] = final[2] * -1;
        final[3] = final[3] * -1;
      }
      // Family_100(q1,q1_t,"red");
      // Family_110(q1,q1_t,"green");
      // Family_111(q1,q1_t,"blue");

      possible_combinations_1 = Combinations(inputx, inputy, inputz);
      possible_combinations_2 = Combinations(-inputx, inputy, inputz);
      possible_combinations_3 = Combinations(inputx, -inputy, inputz);
      possible_combinations_4 = Combinations(inputx, inputy, -inputz);
      possible_combinations_5 = Combinations(-inputx, -inputy, inputz);
      possible_combinations_6 = Combinations(inputx, -inputy, -inputz);
      possible_combinations_7 = Combinations(-inputx, inputy, -inputz);
      possible_combinations_8 = Combinations(-inputx, -inputy, -inputz);

      plot_Family(q1, q1_t, possible_combinations_1);
      plot_Family(q1, q1_t, possible_combinations_2);
      plot_Family(q1, q1_t, possible_combinations_3);
      plot_Family(q1, q1_t, possible_combinations_4);
      plot_Family(q1, q1_t, possible_combinations_5);
      plot_Family(q1, q1_t, possible_combinations_6);
      plot_Family(q1, q1_t, possible_combinations_7);
      plot_Family(q1, q1_t, possible_combinations_8);

      drawPoint(
        final[1].toFixed(2),
        final[2].toFixed(2),
        final[3].toFixed(2),
        inputx,
        inputy,
        inputz,
        "black"
      );
    }
  });

var canvas = document.getElementById("canvas");
// var ctx = canvas.getContext("2d");

// ctx.fillStyle = "gold";
// ctx.strokeStyle = "blue";
// ctx.lineWidth = 5;
// ctx.rect(50, 50, 100, 100);
// ctx.fill();
// ctx.stroke();

// $("#printVoucher").click(function () {
//   print_voucher();
// });
