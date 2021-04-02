const axios = require('axios')
var fs = require('fs');
var querystring = require('querystring');


var image = fs.readFileSync("/Users/hekunyu/Downloads/WechatIMG147.jpeg").toString("base64");

async function main() {

  const res = await axios.get('https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=GgSY7MKt5DHkYrSL7AuBRAQQ&client_secret=CPBADCmZLZ09o2rkHACGCi9Ef21n2KXM')
  const access_token = res.data.access_token
  const res1 = await axios.post(`https://aip.baidubce.com/rest/2.0/ocr/v1/vehicle_certificate?access_token=${access_token}`,querystring.stringify({
    image: encodeURI(image)})
  )
  console.log(JSON.stringify(res1.data))
}5

main()