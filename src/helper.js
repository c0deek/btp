var Vector = function (x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;
};

Vector.prototype.normalize = function () {
  var length = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z); //calculating length
  this.x = this.x / length; //assigning new value to x (dividing x by length of the vector)
  this.y = this.y / length; //assigning new value to y
  this.z = this.z / length; //assigning new value to z
};

let v = Vector(2, 1, 1);
v.normalize();
console.log(v);
