const result = [
  {
    id: '2',
    num: 34,
    children: [
      {
        id: '2-1',
        num: 120,
      },
      {
        id: '2-2',
        num: 110,
      },
      {
        id: '2-3',
        num: 990
      }
    ]
  },
  {
    id: '1',
    num: 33
  }
]

const recSort = arr => {
  arr.sort(({ num: a }, { num: b }) => (a - b))
  arr.forEach(element => {
    if (element.children) {
      recSort(element.children)
    }
  });
}

recSort(result)
console.log(JSON.stringify(result, null, 2))