var drawn =false;

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
      (vec_array[0] / mag),
      (vec_array[1] / mag),
      (vec_array[2] / mag),
    ];
    vsign = [v[0] < 0 ? -1 : 1, v[1] < 0 ? -1 : 1, v[2] < 0 ? -1 : 1];
    return [v[1]/(1+v[2]),-v[0]/(1+v[2])]
  };

  Vector3D.prototype.calculateTrace=function(){
    vec_array=[this.x,this.y,this.z];
    // if any emenet of vec_array is infinity change to 0
    for (var i = 0; i < vec_array.length; i++) {
      if (isNaN(vec_array[i]) || vec_array[i] === Infinity) {
        vec_array[i] = 0;
      }
    }

    h=this.x;
    k=this.y;
    l=this.z;
    
    if(h==0&&k==0&&l==0)
    {
      return [0,0,0,0,0,0];
    }
    
    else if(h==0 && k==0)
    {
      return [-1,0,0,1,1,0,0,-1];   
    }
    
    else if(k==0 && l==0)
    {
      return [-1,0,1,0,0,0];
    }

    else if(h==0&&l==0)
    {
      return [0,-1,0,1,0,0];
    }

    else if(h==0)
    {
      var X3=0;
      var Y3=-(l/k);
      var Z3=1;
      var mag=Math.sqrt(X3*X3+Y3*Y3+Z3*Z3);
      X3=X3/mag;
      Y3=Y3/mag;
      Z3=Z3/mag;
      x3=Y3/(1+Z3);
      return [0,1,0,-1,x3,0];   
    }

    else if(k==0)
    {
      var Y3=0;
      var Z3=1;
      var X3=-(l/h);
      var mag=Math.sqrt(X3*X3+Y3*Y3+Z3*Z3);
      X3=X3/mag;
      Y3=Y3/mag;
      Z3=Z3/mag;
      y3=-X3/(1+Z3);
      return [-1,0,1,0,0,y3];
    }

    else if(l==0)
    {
      var X1=-k;
      var Y1=h;
      var mag1=Math.sqrt(X1*X1+Y1*Y1);
      X1=X1/mag1;
      Y1=Y1/mag1;
      var x1=Y1;
      var y1=-X1;

      var X2=k;
      var Y2=-h;
      X2=X2/mag1;
      Y2=Y2/mag1;
      var x2=Y2;
      var y2=-X2;
      return [x1,y1,x2,y2];
    }
    
    else
    {
      var X1=1;
      var Y1=-(h/k);
      var x1=Y1/Math.sqrt(X1*X1+Y1*Y1);
      var y1=-X1/Math.sqrt(X1*X1+Y1*Y1);
            
      var x2=-x1;
      var y2=-y1;
            
      var X3=-(l/h);
      var Y3=0;
      var Z3=1;
      var mag=Math.sqrt(X3*X3+Y3*Y3+Z3*Z3);
      X3=X3/mag;
      Y3=Y3/mag;
      Z3=Z3/mag;
      var x3=Y3/(1+Z3);
      var y3=-X3/(1+Z3);
      return [x1,y1,x2,y2,x3,y3];
    }
  }

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
  fillColor: "blue",
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
  content: "[010]",
  fillColor: "blue",
  fontFamily: "Courier New",
  fontSize: 12,
  fontWeight: "bold",
});

var zaxispoint = new Path.Circle({
  center: [400, 600],
  radius: 2,
  strokeColor: "red",
  fillColor: "red",
});

var yaxistext = new PointText({
  position: [400 - 10, 600 - 10],
  content: "[100]",
  fillColor: "blue",
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

function drawTrace(x, y, z){
  var vec = new Vector3D(x, y, z);
  var p=vec.calculateTrace();
  
  if(p.length>6)
  {
    var TraceCircle = new Path.Circle({
      center: [400, 400],
      radius: 200,
      strokeColor: "red",
      dashArray: [10, 5],
    });

  }

  else if(p.length<6)
  {
    var x1=p[0];
    var y1=p[1];   
    var x2=p[2];
    var y2=p[3];
    var axisX = new Path.Line({
      from: [400+200*x1, 400-200*y1],
      to: [400+200*x2, 400-200*y2],
      strokeColor: "red",
      dashArray: [10, 5],
    });

  }

  else
  {
    var x1=p[0];
    var y1=p[1];   
    var x2=p[2];
    var y2=p[3];
    var x3=p[4];
    var y3=p[5];

    var arc4 = new Path.Arc({
      from: [400 +x1*200, 400-200*y1],
      through: [400+ 200*x3, 400 -200*y3],
      to: [400 +200*x2, 400-200*y2],
      strokeWidth: 1,
      strokeColor: "red",
      dashArray: [10, 5],
    });
  }
    
  
}

document.getElementById("vector-submit").addEventListener("click", function () {
  var inputx = document.getElementById("vector-x").value;
  var inputy = document.getElementById("vector-y").value;
  var inputz = document.getElementById("vector-z").value;

  console.log(
    "a",
    Math.abs(Number(inputx)),
    Math.abs(Number(inputy)),
    Math.abs(Number(inputz))
  );
  if (isNaN(Number(inputx)) || isNaN(Number(inputy)) || isNaN(Number(inputz))) {
    alert("Please enter a valid number");
  } 
  else if (
    Math.abs(Number(inputx)).toString().length > 1 ||
    Math.abs(Number(inputy)).toString().length > 1 ||
    Math.abs(Number(inputz)).toString().length > 1
  ) {
    alert("Please enter a valid number");
  } 
  else {
    if(inputz<0)
    {
      inputz=inputz*-1;
      inputx=inputx*-1;
      inputy=inputy*-1;
    }
    drawPoint(inputx, inputy, inputz);
    //document.getElementById("show-trace").addEventListener("click", function () {
      //drawTrace(inputx,inputy, inputz);
    //}
  }
});

document.getElementById("show-trace").addEventListener("click", function () {
  var inputx = document.getElementById("vector-x").value;
  var inputy = document.getElementById("vector-y").value;
  var inputz = document.getElementById("vector-z").value;

  console.log(
    "a",
    Math.abs(Number(inputx)),
    Math.abs(Number(inputy)),
    Math.abs(Number(inputz))
  );
  if (isNaN(Number(inputx)) || isNaN(Number(inputy)) || isNaN(Number(inputz))) {
    alert("Please enter a valid number");
  } 

  else if (
    Math.abs(Number(inputx)).toString().length > 1 ||
    Math.abs(Number(inputy)).toString().length > 1 ||
    Math.abs(Number(inputz)).toString().length > 1
  ) {
    alert("Please enter a valid number");
  } 
  else {
    if(inputz<0)
    {
      inputz=inputz*-1;
      inputx=inputx*-1;
      inputy=inputy*-1;
    }
    drawTrace(inputx,inputy, inputz);
  }
});
