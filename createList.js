//* returns array of object pairs {a:"val",b:"val"} so that each 
//* person has a non repeating person to gift too and not them selves. 

module.exports = function (options) {
  return function (req, next) {
    req.list = listRando(req.body.peoples)
    next()
  }
  function listRando(list) { 
    var names = list;
    let a = names.slice(0);
    let b = names.slice(0);
    let result = [];
    while (a.length > 1) {
      let i = extractRandomElement(a);
      let j = extractRandomElement(b);

      while (i === j) {
        b.push(j);
        j = extractRandomElement(b);
      }
      result.push({ a: i, b: j });
    }
    if (a[0] === b[0]) {
      result.push({ a: a[0], b: result[0].b });
      result[0].b = a[0];
    } else {
      result.push({ a: a[0], b: b[0] });
    }

    return result;
  }

  function extractRandomElement(array) {
    return array.splice(Math.floor(Math.random() * array.length), 1)[0];
  }
}
// ! This is a sample of the req obj received 
// peoples: [
//   {
//     id: 1,
//     name: '',
//     email: '',
//     admin: false
//   },
//   {
//     id: 2,
//     name: '',
//     email: '',
//     admin: false
//   },
//   {
//     id: 3,
//     name: '',
//     email: '',
//     admin: false
//   }
// ]
