let magic = (x, b, t) => x / (100000/b + t*0.041)
let zins = (x, b, t) => x * (100000/b + t*0.041)
module.exports = {
  magic: magic,
  zins: zins,
  transform: (x, t1, t2, b1, b2) => zins(magic(x, b1, t1), b2, t2)
};
