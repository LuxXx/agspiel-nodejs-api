exports.preset = function () {
  let a = [];
  for (let i = 1; i < 10; i++) {
    a.push(i * 100000);
  }
  for(let i = 1; i <= 20; i++) {
    a.push(i * 1000000);
  }
  return a;
};
