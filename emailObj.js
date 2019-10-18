module.exports = function (options) {
  return function (req, next) {
    req.emailQue = createEmailQue(req.list, req.body.giftLimit, req.body.showData);
    next()
  }
  function createEmailQue(list, giftLimit, showData) {
    let messageArr = createMessage(list, giftLimit); //returns a array of messages
    if(showData) {//if the show data emails
      messageArr.push(createMasterListEmail(list, giftLimit)); //returns array master list emails
    }
    return messageArr
  }
  function createMessage(list, giftLimit) {
    return list.map((curPair) => {
      return {
        from: 'sender@server.com', // my email server address
        to: `${curPair.a.email}`,  // The santa's email
        subject: 'SSanta Gift Exchange drawing',
        text: `You drew ${curPair.b.name} for the Gift Exchange. The gift limit is set at ${giftLimit}.`,
        html: `<p>You drew ${curPair.b.name} for the Gift Exchange.</p>
        <p>The gift limit is set at ${giftLimit}.</p>`
      };
    })
  }
  function createMasterListEmail(list, giftLimit) {
    // create master list email object
    let admin = getAdminEmail(list); //returns an array of admin emails
    let masterList =  createMasterList(list); // return a master list as a string
    let masterListHTML = createMasterListHTML(list);// return a master list as a sting of html p tags
    
    return {
      from: 'sender@server.com', // my email server address
      to: `${admin.email}`,  // The admins email
      subject: `Your SSanta Gift Exchange drawing master list.`,
      text: ` The gift limit is set at ${giftLimit}.
        The list is as follows: ${masterList}`,
      html: `
        <h2>The gift limit is ${giftLimit}</h2>
        <h2>The list is as follows:</h2>
        ${masterListHTML}`
    };
  }
  function createMasterList(list) {
     return list.reduce((acc, curPair) => {
       return acc += `${curPair.a.name}(${curPair.a.email}) has ${curPair.b.name}. `
    },"")    
  }
  function createMasterListHTML(list) {
    return list.reduce((acc, curPair) => {
      return acc += `<p>${curPair.a.name}(${curPair.a.email}) has ${curPair.b.name}.</p>`
    }, "")
  }
  function findAdmin(pair) {
    if (pair.a.admin == true) {
      return pair.a;
    }
  }
  function getAdminEmail(list) {
    var admin = list.filter(findAdmin);
    return admin[0].a
  }
}
