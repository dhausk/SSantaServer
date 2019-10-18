module.exports = function (options) {
  return function (req, res, next) {
  // return req.valid = to true or false \
    req.valid = validForm(req.body);   
    next()
  }
  function validForm(state) {
    // check each part of the form to make sure it is correct. 
    const size = state.groupSize >= 3;
    const show = typeof state.showData == 'boolean';
    const groupAdmin = propGroupAdmin(state.peoples);
    return size && show && groupAdmin;
  }
  
  function propGroupAdmin(peoples) {
    let admin = 0;
    for (let i = 0; i < peoples.length; i++) {
      if (peoples[i].admin == true) {
        admin += 1;
      };
    }
    return (admin >= 1 && admin <=10) ? true : false;
  } 
}
// var ob = {
//   groupSize: 3,
//   showData: false,
//   peoples: [
//       {
//         id: 1,
//         name: '',
//         email: '',
//         admin: false
//       },
//       {
//         id: 2,
//         name: '',
//         email: '',
//         admin: false
//       },
//       {
//         id: 3,
//         name: '',
//         email: '',
//         admin: false
//       }
//     ]
// }