const cheerio = require('cheerio');

function parseOnline(html) {
  let $ = cheerio.load(html);

  let on = $('#onlinelist')[0];

  let online = [];
  let divs = on.children.filter(o => o.type === 'tag');
  divs.forEach(div => {
    let id = div.children[0].attribs.href.substring(32);
    let name = div.children[0].children[0].data;
    online.push({
      id: id,
      name: name
    });
  });

  return online;
}

module.exports = parseOnline;
