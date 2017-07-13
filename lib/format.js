// Funktion von der Webseite ag-spiel.de
function number_format(number, decimals, dec_point, thousands_sep)
{
    var exponent = "";
    var numberstr = number.toString();
    var eindex = numberstr.indexOf("e");
    if (eindex > -1)
    {
        exponent = numberstr.substring(eindex);
        number = parseFloat(numberstr.substring(0, eindex));
    }

    if (decimals != null)
    {
        var temp = Math.pow(10, decimals);
        number = Math.round(number * temp) / temp;
    }
    var sign = number < 0 ? "-" : "";
    var integer = (number > 0 ?
            Math.floor(number) : Math.abs(Math.ceil(number))).toString();

    var fractional = number.toString().substring(integer.length + sign.length);
    dec_point = dec_point != null ? dec_point : ".";
    fractional = decimals != null && decimals > 0 || fractional.length > 1 ?
            (dec_point + fractional.substring(1)) : "";
    if (decimals != null && decimals > 0)
    {
        for (i = fractional.length - 1, z = decimals; i < z; ++i)
            fractional += "0";
    }

    thousands_sep = (thousands_sep != dec_point || fractional.length == 0) ?
            thousands_sep : null;
    if (thousands_sep != null && thousands_sep != "")
    {
        for (i = integer.length - 3; i > 0; i -= 3)
            integer = integer.substring(0, i) + thousands_sep + integer.substring(i);
    }

    return sign + integer + fractional + exponent;
}

module.exports = {
  from: m => +m.replace(/\./g, '').replace(',', '.').replace('€', '').replace('%', ''),
  to: number_format,
  date: date => new Date(date.substring(3,5) + ' ' + date.substring(0,2) + ' ' + date.substring(6,10))
};
