class Vec3D {
  constructor(x, y, z, orientation) {
    this.orientation = orientation; // 1 -> 001, 10 -> 010, 100 -> 100
    console.log(this.orientation);
    this.x = x;
    this.y = y;
    this.z = z;
    this.ogvector = [x, y, z];
    switch (orientation) {
      case 1:
        this.vector = z < 0 ? [-x, -y, -z] : [x, y, z];
        break;
      case 10:
        this.vector = y < 0 ? [-x, -y, -z] : [x, y, z];
        break;
      case 100:
        this.vector = x < 0 ? [-x, -y, -z] : [x, y, z];
        break;
    }

    // if any elemenet of vector is infinity change to 0
    this.vector.forEach((ele, i) => {
      if (isNaN(ele) || ele === Infinity) this.vector[i] = 0;
    });

    // calculating magnitude
    this.mag = 0;
    this.vector.forEach((ele) => {
      this.mag += Math.pow(ele, 2);
    });
    this.mag = Math.sqrt(this.mag);

    // calculating unit vector
    this.unitVector = [0, 0, 0];
    this.vector.forEach((ele, i) => {
      this.unitVector[i] = ele / this.mag;
    });

    // calculate 2D projection coordinates
    switch (orientation) {
      case 1:
        this.projCoordinates = [
          this.unitVector[1] / (1 + this.unitVector[2]),
          -this.unitVector[0] / (1 + this.unitVector[2]),
        ];
        break;
      case 10:
        this.projCoordinates = [
          -this.unitVector[0] / (1 + this.unitVector[1]),
          this.unitVector[2] / (1 + this.unitVector[1]),
        ];
        break;
      case 100:
        this.projCoordinates = [
          this.unitVector[1] / (1 + this.unitVector[0]),
          this.unitVector[2] / (1 + this.unitVector[0]),
        ];
        break;
    }

    // others
    this.traceRadius = null;
    this.traceCenter = null;
    this.traceArray = null;
  }

  setTrace() {
    switch (this.orientation) {
      case 1:
        switch (true) {
          case this.x == 0 && this.y == 0 && this.z == 0:
            this.traceArray = [0, 0, 0, 0, 0, 0];
            break;
          case this.x == 0 && this.y == 0:
            this.traceArray = [-1, 0, 0, 1, 1, 0, 0, -1];
            break;
          case this.y == 0 && this.z == 0:
            this.traceArray = [-1, 0, 1, 0, 0, 0];
            break;
          case this.x == 0 && this.z == 0:
            this.traceArray = [0, -1, 0, 1, 0, 0];
            break;
          case this.x == 0:
            var X3 = 0;
            var Y3 = -(this.z / this.y);
            var Z3 = 1;
            var mag = Math.sqrt(X3 * X3 + Y3 * Y3 + Z3 * Z3);
            X3 = X3 / mag;
            Y3 = Y3 / mag;
            Z3 = Z3 / mag;
            x3 = Y3 / (1 + Z3);
            this.traceArray = [0, 1, 0, -1, x3, 0];
            break;
          case this.y == 0:
            var Y3 = 0;
            var Z3 = 1;
            var X3 = -(this.z / this.x);
            var mag = Math.sqrt(X3 * X3 + Y3 * Y3 + Z3 * Z3);
            X3 = X3 / mag;
            Y3 = Y3 / mag;
            Z3 = Z3 / mag;
            y3 = -X3 / (1 + Z3);
            this.traceArray = [-1, 0, 1, 0, 0, y3];
            break;
          case this.z == 0:
            var X1 = -this.y;
            var Y1 = this.x;
            var mag1 = Math.sqrt(X1 * X1 + Y1 * Y1);
            X1 = X1 / mag1;
            Y1 = Y1 / mag1;
            var x1 = Y1;
            var y1 = -X1;

            var X2 = this.y;
            var Y2 = -this.x;
            X2 = X2 / mag1;
            Y2 = Y2 / mag1;
            var x2 = Y2;
            var y2 = -X2;
            this.traceArray = [x1, y1, x2, y2];
            break;
          default:
            var X1 = 1;
            var Y1 = -(this.x / this.y);
            var x1 = Y1 / Math.sqrt(X1 * X1 + Y1 * Y1);
            var y1 = -X1 / Math.sqrt(X1 * X1 + Y1 * Y1);

            var x2 = -x1;
            var y2 = -y1;

            var X3 = -(this.z / this.x);
            var Y3 = 0;
            var Z3 = 1;
            var mag = Math.sqrt(X3 * X3 + Y3 * Y3 + Z3 * Z3);
            X3 = X3 / mag;
            Y3 = Y3 / mag;
            Z3 = Z3 / mag;
            var x3 = Y3 / (1 + Z3);
            var y3 = -X3 / (1 + Z3);
            this.traceArray = [x1, y1, x2, y2, x3, y3];
        }
        break;
      case 10:
        switch (true) {
          case this.x == 0 && this.y == 0 && this.z == 0:
            this.traceArray = [0, 0, 0, 0, 0, 0];
            break;
          case this.x == 0 && this.y == 0:
            this.traceArray = [-1, 0, 1, 0, 0, 0];
            break;
          case this.y == 0 && this.z == 0:
            this.traceArray = [0, -1, 0, 1, 0, 0];
            break;
          case this.x == 0 && this.z == 0:
            this.traceArray = [0, 1, 1, 0, 0, -1, -1, 0];
            break;
          case this.x == 0:
            var X1 = 0;
            var Y1 = 1;
            var Z1 = -(this.y / this.z);
            var mag = Math.sqrt(X1 * X1 + Y1 * Y1 + Z1 * Z1);
            X1 = X1 / mag;
            Y1 = Y1 / mag;
            Z1 = Z1 / mag;
            var x1 = -X1 / (1 + Y1);
            var y1 = Z1 / (1 + Y1);
            var x2 = -X2;
            var y2 = Z2;
            this.traceArray = [-1, 0, 1, 0, x1, y1];
            break;

          case this.y == 0:
            var X1 = -this.z;
            var Y1 = 0;
            var Z1 = this.x;
            var mag = Math.sqrt(X1 * X1 + Y1 * Y1 + Z1 * Z1);
            X1 = X1 / mag;
            Y1 = Y1 / mag;
            Z1 = Z1 / mag;
            var X2 = this.z;
            var Y2 = 0;
            var Z2 = -this.x;
            X2 = X2 / mag;
            Y2 = Y2 / mag;
            Z2 = Z2 / mag;
            var x1 = -X1;
            var y1 = Z1;
            var x2 = -X2;
            var y2 = Z2;
            this.traceArray = [x1, y1, x2, y2];
            break;

          case this.z == 0:
            var X3 = -(this.y / this.x);
            var Y3 = 1;
            var Z3 = 0;
            var mag1 = Math.sqrt(X3 * X3 + Y3 * Y3 + Z3 * Z3);
            X3 = X3 / mag1;
            Y3 = Y3 / mag1;
            Z3 = Z3 / mag1;
            var x3 = -X3 / (1 + Y3);
            var y3 = Z3 / (1 + Y3);
            this.traceArray = [0, 1, 0, -1, x3, y3];
            break;

          default:
            var X1 = 1;
            var Y1 = 0;
            var Z1 = -(this.x / this.z);
            var mag = Math.sqrt(X1 * X1 + Y1 * Y1 + Z1 * Z1);
            X1 = X1 / mag;
            Y1 = Y1 / mag;
            Z1 = Z1 / mag;
            var x1 = -X1 / (1 + Y1);
            var y1 = Z1 / (1 + Y1);
            var X2 = -1;
            var Y2 = 0;
            var Z2 = this.x / this.z;
            X2 = X2 / mag;
            Y2 = Y2 / mag;
            Z2 = Z2 / mag;
            var x2 = -X2 / (1 + Y2);
            var y2 = Z2 / (1 + Y2);
            var X3 = 0;
            var Y3 = 1;
            var Z3 = -(this.y / this.z);
            var mag = Math.sqrt(X3 * X3 + Y3 * Y3 + Z3 * Z3);
            X3 = X3 / mag;
            Y3 = Y3 / mag;
            Z3 = Z3 / mag;
            var x3 = -X3 / (1 + Y3);
            var y3 = Z3 / (1 + Y3);
            this.traceArray = [x1, y1, x2, y2, x3, y3];
        }
        break;
      case 100:
        switch (true) {
          case this.x == 0 && this.y == 0 && this.z == 0:
            this.traceArray = [0, 0, 0, 0, 0, 0];
            break;
          case this.x == 0 && this.y == 0:
            this.traceArray = [-1, 0, 1, 0, 0, 0];
            break;
          case this.y == 0 && this.z == 0:
            this.traceArray = [0, 1, 1, 0, 0, -1, -1, 0];
            break;
          case this.x == 0 && this.z == 0:
            this.traceArray = [0, -1, 0, 1, 0, 0];
            break;
          case this.x == 0:
            var X1 = 0;
            var Y1 = -this.z;
            var Z1 = this.y;
            var mag1 = Math.sqrt(X1 * X1 + Y1 * Y1 + Z1 * Z1);
            X1 = X1 / mag1;
            Y1 = Y1 / mag1;
            Z1 = Z1 / mag1;
            var x1 = Y1 / (1 + X1);
            var y1 = Z1 / (1 + X1);

            var X2 = 0;
            var Y2 = this.z;
            var Z2 = -this.y;
            X2 = X2 / mag1;
            Y2 = Y2 / mag1;
            Z2 = Z2 / mag1;
            var x2 = Y2 / (1 + X2);
            var y2 = Z2 / (1 + X2);
            this.traceArray = [x1, y1, x2, y2];
            break;
          case this.y == 0:
            var X3 = 1;
            var Y3 = 0;
            var Z3 = -(this.x / this.z);
            var mag = Math.sqrt(X3 * X3 + Y3 * Y3 + Z3 * Z3);
            X3 = X3 / mag;
            Y3 = Y3 / mag;
            Z3 = Z3 / mag;
            var x3 = 0;
            var y3 = Z3 / (1 + X3);
            this.traceArray = [-1, 0, 1, 0, 0, y3];
            break;
          case this.z == 0:
            var X3 = 1;
            var Y3 = -(this.x / this.y);
            var Z3 = 0;
            var mag1 = Math.sqrt(X3 * X3 + Y3 * Y3 + Z3 * Z3);
            X3 = X3 / mag1;
            Y3 = Y3 / mag1;
            Z3 = Z3 / mag1;
            var x3 = Y3 / (1 + X3);
            var y3 = 0;
            this.traceArray = [0, 1, 0, -1, x3, y3];
            break;
          default:
            var X1 = 0;
            var Y1 = -(this.z / this.y);
            var Z1 = 1;
            var mag = Math.sqrt(X1 * X1 + Y1 * Y1 + Z1 * Z1);
            X1 = X1 / mag;
            Y1 = Y1 / mag;
            Z1 = Z1 / mag;
            var x1 = Y1 / (1 + X1);
            var y1 = Z1 / (1 + X1);
            var X2 = 0;
            var Y2 = this.z / this.y;
            var Z2 = -1;
            X2 = X2 / mag;
            Y2 = Y2 / mag;
            Z2 = Z2 / mag;
            var x2 = Y2 / (1 + X2);
            var y2 = Z2 / (1 + X2);
            var X3 = 1;
            var Y3 = 0;
            var Z3 = -(this.x / this.z);
            var mag = Math.sqrt(X3 * X3 + Y3 * Y3 + Z3 * Z3);
            X3 = X3 / mag;
            Y3 = Y3 / mag;
            Z3 = Z3 / mag;
            var x3 = Y3 / (1 + X3);
            var y3 = Z3 / (1 + X3);
            this.traceArray = [x1, y1, x2, y2, x3, y3];
        }
        break;
      default:
        alert("error in orientation");
    }
  }

  getProjection() {
    return this.projCoordinates;
  }

  getTrace() {
    this.setTrace();
    return this.traceArray;
  }

  getOGVector() {
    return 0; //this.ogvector;
  }

  getVector() {
    return this.vector;
  }
}

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// --------------------------------------------------------
// -------------------------  TEST  ------------------------
// --------------------------------------------------------

function CheckX(x, y, z, h, k, l) {
  if (x < 0) {
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

function plot_Family(possible_combinations) {
  for (var i = 0; i < possible_combinations.length; i++) {
    a = possible_combinations[i][0];
    b = possible_combinations[i][1];
    c = possible_combinations[i][2];
    input = CheckX(a, b, c, a, b, c);
    drawPoint(
      input[0],
      input[1],
      input[2],
      input[3],
      input[4],
      input[5],
      "black"
    );
  }
}

// --------------------------------------------------------
// -------------------------  nonclass functions  ------------------------
// --------------------------------------------------------
