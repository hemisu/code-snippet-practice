const axios = require('axios').default
const querystring = require("querystring"); //序列化对象，用qs也行，都一样
const cheerio = require('cheerio');
const schedule = require('node-schedule');

const dayjs = require('dayjs');
const log4js = require("log4js");
// 记录logger
log4js.configure({
  appenders: {
    debugger: {
      type: "file",
      filename: "logger.log"
    }
  },
  categories: {
    default: {
      appenders: ["debugger"],
      level: "info"
    }
  }
});
const logger = log4js.getLogger();

// const main = () => {
//   // 抓取场地
//   axios.get('https://xihuwenti.juyancn.cn/wechat/product/details?id=506&time=1595865600', {
//     headers: {
//       'Host': 'xihuwenti.juyancn.cn',
//       'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
//       'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/7.0.14(0x17000e28) NetType/WIFI Language/zh_CN',
//       'Accept-Language': 'zh-cn',
//       'Referer': 'https://xihuwenti.juyancn.cn/wechat/venue/details?id=1&cid=12&time=0'
//     }
//   }).then(res => {
//     // const $ = cheerio.load(res.data)
//     // const daterange = $('.date-wrapper li').map(function (i, e) {
//     //   return e
//     // } )
//     // console.log('%c 🍅 daterange: ', 'font-size:20px;background-color: #4b4b4b;color:#fff;', daterange);

//     logger.info("获取页面数据：\n", res.data);
//   })
// }


/** 仿AGENT */
const USER_AGENT = 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/7.0.14(0x17000e28) NetType/WIFI Language/zh_CN'
const HOST = 'xihuwenti.juyancn.cn'
/** 综合场馆 */
const HALL_MAP = {
  /** 早上 */
  day: 506,
  /** 晚上 */
  night: 507
}
/** 场地编号 */
const PLAYGROUD_MAP = {
  /** 1号场地 */
  1: 86,
  /** 2号场地 */
  2: 87,
  /** 3号场地 */
  3: 88,
  /** 4号场地 */
  4: 89,
  /** 5号场地 */
  5: 90,
  /** 6号场地 */
  6: 91
}

class Ticket {
  constructor(cookie = '') {
    this.curDate = this._curDate()
    this.cookie = cookie
  }
  /**
   * 获取时间
   * @returns string[] 接下来的5天
   */
  getUnixDate() {
    return Array.from({ length: 5 }, (_, i) => this.curDate.add(i, 'day').unix())
  }

  /**
   * 获取可以定的场地 List
   * @param {Object} param
   * @param {Number} param.id 场馆（分早晚场） 506白天，507晚上
   * @param {Number} param.day 星期 0-星期天 6-星期六
   */
  getAvaliableHallList({ id = HALL_MAP.day, day } = {}) {
    logger.info('getAvaliableHall::param', '场馆:', id, '星期:', day)
    return axios.get('https://xihuwenti.juyancn.cn/wechat/product/details', {
      params: {
        id,
        time: day !== void 0 ? this._curDate().day(day).unix() : 0
      },
      headers: {
        'Host': HOST,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'User-Agent': USER_AGENT,
        'Accept-Language': 'zh-cn',
        'Referer': 'https://xihuwenti.juyancn.cn/wechat/venue/details?id=1&cid=12&time=0'
      }
    }).then(res => {
      if (res.status !== 200) {
        logger.error('getAvaliableHall::error', res)
        return []
      }
      const orderList = []
      // 读取 HTML 信息
      const $ = cheerio.load(res.data)
      const daterange = $('.a-default.can-select')
        .each(function (i, e) {
          orderList.push({
            hall_id: $(this).data('hall_id'),
            start: $(this).data('start'),
            end: $(this).data('end'),
            cost_price: $(this).data('cost_price'),
          })
        })

      logger.info('getAvaliableHall::parse', `${this.curDate.day(day).format('YYYY-MM-DD')} 的空场次票共${orderList.length}场: ${JSON.stringify(orderList)}`)

      return orderList
    }).catch(() => { })
  }
  /**
   * 发起订单
   */
  requestTicket() {
    const userData = {
      username: '何坤舆',
      mobile: 13588298954,
      id_card: '330283199411160033',
    }
    const hallData = {
      show_id: 506,
      param: Buffer.from('{"date":"2020-07-30","period":["88,11:00,12:00"],"money":40,"total_fee":40}').toString('base64')
    }
    const Referer = new URL(querystring.stringify(hallData),'https://xihuwenti.juyancn.cn/wechat/order/index').href
    axios.post('https://xihuwenti.juyancn.cn/wechat/order/add',
      querystring.stringify({ ...userData, ...hallData }),
      {
        headers: {
          'Host': HOST,
          'Origin': 'https://xihuwenti.juyancn.cn',
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'Accept': 'application/json, text/javascript, */*; q=0.01',
          'User-Agent': USER_AGENT,
          'Accept-Language': 'zh-cn',
          Referer,
          Cookie: this.cookie
        },
      }).then(res => {
        if (res.data.code === 0) {
          // success
          logger.info('requestTicket::success res', res.data)
        } else {
          // failed
          logger.error('requestTicket::faild res', res.data)
        }
      })
  }

  /**
   * 获取待支付订单列表
   */
  getOrderList() {
    axios.get('https://xihuwenti.juyancn.cn/wechat/user/buyrecord', {
      params: {
        status: 2
      },
      headers: {
        'Host': HOST,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'User-Agent': USER_AGENT,
        'Accept-Language': 'zh-cn',
        'Referer': 'https://xihuwenti.juyancn.cn/wechat/venue/details?id=1&cid=12&time=0',
        cookie: this.cookie
      }
    }).then(res => {
      if(res.status === 200) {
        const $ = cheerio.load(res.data)
        const orderIds = []
        $('.order-info-wrapper').each((i, e) => {
          const re = /orderdetail\((\d+)\)/g.exec(e.attribs.onclick)
          re && re[1] && orderIds.push(re[1])
        })
        logger.info('getOrderList::待支付的订单', JSON.stringify(orderIds))
        console.log('%c 🥘 待支付的订单orderIds: ', 'font-size:20px;background-color: #E41A6A;color:#fff;', orderIds);
        return orderIds
      }
    })
  }

  /**
   * 取消订单
   * @param {Object} param
   * @param {Number} param.orderId 订单号
   */
  cancelOrder({ orderId } = {}) {
    axios.get('https://xihuwenti.juyancn.cn/wechat/user/buyrecorddetail', {
      params: {
        id: orderId
      },
      headers: {
        'Host': HOST,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'User-Agent': USER_AGENT,
        'Accept-Language': 'zh-cn',
        'Referer': 'https://xihuwenti.juyancn.cn/wechat/venue/details?id=1&cid=12&time=0',
        cookie: this.cookie
      }
    }).then(res => {
      if(res.status === 200) {
        const $ = cheerio.load(res.data)
        const orderId = $('.mthalf div p:first-child span:nth-child(2)').text()
        console.log('%c 🥕 订单 orderId: ', 'font-size:20px;background-color: #42b983;color:#fff;', orderId);
        if(orderId.length) {
          axios.post('https://xihuwenti.juyancn.cn/wechat/user/ordercancel?' + querystring.stringify({
            sn: orderId,
            otype: 0
          }), {
            headers: {
              'Host': HOST,
              'User-Agent': USER_AGENT,
              'Referer': 'https://xihuwenti.juyancn.cn/wechat/venue/details?id=1&cid=12&time=0',
              "accept": "application/json, text/javascript, */*; q=0.01",
              "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
              "X-Requested-With": "XMLHttpRequest",
              cookie: this.cookie
            }
          }).then(res => {
            console.log('%c 🍷 res: ', 'font-size:20px;background-color: #93C0A4;color:#fff;', res);
            console.log(res.data)
          })
        }
      }
    })
  }

  /**
   * 获取可以定的场地 base64 用于直接申请order
   * @param {Object} param
   * @param {Number} param.id 场馆（分早晚场）
   * @param {Number} param.day 星期 0-星期天 6-星期六
   */
  async getAvaliableHallBase64(param = {}) {
    const list = await this.getAvaliableHallList(param)

    if (list.length === 0) {
      return null
    }
    // 只能选定一个场地的时间
    // {"date":"2020-07-30","period":["90,10:00,11:00"],"money":40,"total_fee":40}
    return {
      date: this.curDate.day(param.day).format('YYYY-MM-DD'),
      period: list.map(({ hall_id, start, end }) => `${hall_id},${start},${end}`),
      money: list.reduce((pre, cur) => (pre + Number(cur.cost_price)), 0),
      total_fee: list.reduce((pre, cur) => (pre + Number(cur.cost_price)), 0)
    }
  }

  /**
   * 获取当前时间的 YYYY-MM-DD 00:00:00 dayjs对象
   * @returns {dayjs}
   */
  _curDate() {
    return dayjs().set('hour', 0)
      .set('minute', 0)
      .set('second', 0)
      .set('millisecond', 0)
  }

}
// 定时任务
class SetInter {
  constructor({ timer, fn }) {
    this.timer = timer // 每几秒执行
    this.fn = fn //执行的回调
    this.rule = new schedule.RecurrenceRule(); //实例化一个对象
    this.rule.second = this.setRule() // 调用原型方法，schedule的语法而已
    this.init()
  }
  setRule() {
    let rule = [];
    let i = 1;
    while (i < 60) {
      rule.push(i)
      i += this.timer
    }
    return rule //假设传入的timer为5，则表示定时任务每5秒执行一次
    // [1, 6, 11, 16, 21, 26, 31, 36, 41, 46, 51, 56] 
  }
  init() {
    schedule.scheduleJob(this.rule, () => {
      this.fn() // 定时调用传入的回调方法
    });
  }
  cancel() {
    
  }
}

// new SetInter({
//   timer: 5, //每秒执行一次，建议5秒，不然怕被ip拉黑，我这里只是为了方便下面截图
//   fn: function () {
//     console.log()
//   }
// })

/** 授权 Cookie，需要手动更换 */
const authCookie = 'CNZZDATA1274723626=613630465-1595841157-https%253A%252F%252Fxihuwenti.juyancn.cn%252F%7C1595930680; WECHAT_OPENID=oAKYc08e1j34MLlUcw8hversGNLY; PHPSESSID=btl3j6lsr35c9gc1m7dc8jt924; UM_distinctid=1738f8b9b4f11e-0cca3e8dc55c17-54697f2d-5a900-1738f8b9b50217'
const ticket = new Ticket(authCookie)
// ticket.getAvaliableHallBase64({ day: 4 }).then((res) => console.log(res))
// ticket.requestTicket()
// ticket.getOrderList()
// 取消订单
ticket.cancelOrder({ orderId: 42303 })
// 只定一场
// {"date":"2020-07-30","period":["90,10:00,11:00"],"money":40,"total_fee":40}
// 连定两场
// {"date":"2020-07-28","period":["87,9:00,10:00","87,10:00,11:00"],"money":80,"total_fee":80}

