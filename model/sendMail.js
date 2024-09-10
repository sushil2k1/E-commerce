const Mailjet = require('node-mailjet')
const mailjet=new Mailjet(
    {
      apiKey:"b71f0f694fcc8e86efd5ebe1867a1d83",
      apiSecret:"07c550b63a51e8787e023af7bc89e49c"
    })
module.exports = function(email,token,data,callback)
  {
    
    console.log(email)
    const request = mailjet.post('send', { version: 'v3.1' }).request({
        Messages: [
          {
            From: {
              Email: 'sushilsoni281@gmail.com',
              Name: 'E-Shop',
            },
            To: [
              {
                Email: email,
                Name: 'We dont need',
              },
            ],
            Subject: 'Mail from E-mart',
            TextPart: 'if you enjoy purchase expensive product',
            HTMLPart:data,
          },
        ],
      })
      request
        .then(result => {
          console.log(result.body);
          callback(null,result.body);
        })
        .catch(err => {
          console.log(err);
          callback(err,null);
        })
  }