let magic = (z, b, t) => z / (100000/b + t*0.041)
let zins = (z, b, t) => z * (100000/b + t*0.041)
module.exports = {
  magic: magic,
  zins: zins,
  transform: (z, t1, t2, b1, b2) => zins(magic(z, b1, t1), b2, t2),
  endwert: (z, b, t) => Math.round(b * Math.pow((1+z/100), t))
};
