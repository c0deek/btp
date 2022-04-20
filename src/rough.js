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
