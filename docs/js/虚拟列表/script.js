function getDataList() {
  let data = []
  for (let i = 0; i < 1000; i++) {
    data.push({ id: "item" + i, value: Math.random() * i })
  }
  return data;
}

function $(selector) {
  return document.querySelector(selector)
}

function loadData(start, end) {
  // 截取数据
  let sliceData = getDataList().slice(start, end)
  // 现代浏览器下，createDocumentFragment 和 createElement 的区别其实没有那么大
  let fragment = document.createDocumentFragment();
  for (let i = 0; i < sliceData.length; i++) {
    let li = document.createElement('li');
    li.innerText = JSON.stringify(sliceData[i])
    fragment.appendChild(li);
  }
  $('.container').insertBefore(fragment, $('.sentinels'));
}

let count = Math.ceil(document.body.clientHeight / 22);
console.log('%c 🍏 count: ', 'font-size:20px;background-color: #FFDD4D;color:#fff;', count);
let startIndex = 0;
let endIndex = 0;

let io = new IntersectionObserver(function (entries) {
  console.log('%c 🍼️ entries: ', 'font-size:20px;background-color: #F5CE50;color:#fff;', entries);
  loadData(startIndex, count)
  // 标志位元素进入视口
  if (entries[0].isIntersecting) {
    // 更新列表数据起始和结束位置
    startIndex = startIndex += count;
    endIndex = startIndex + count;
    if (endIndex >= getDataList().length) {
      // 数据加载完取消观察
      io.unobserve(entries[0].target)
    }
    // requestAnimationFrame 由系统决定回调函数的执行时机
    requestAnimationFrame(() => {
      loadData(startIndex, endIndex)
      let num = Number(getDataList().length - startIndex)
      let info = ['还有', num, '条数据']
      $('.top').innerText = info.join(' ')
      if (num - count <= 0) {
        $('.top').classList.add('out')
      }
    })
  }
});

// 开始观察“标志位”元素
io.observe($('.sentinels'));
