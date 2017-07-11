module.exports = {
  from: m => +m.replace(/\./g, '').replace(',', '.').replace('€', '').replace('%', '')
};
