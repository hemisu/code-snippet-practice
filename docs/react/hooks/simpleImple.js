let isMount = false // 当前组件已经被挂载
let workInProgressHook = null // 当前进行到哪一个hook
const fiber = {
  stateNode: App, // 保存组件的本身
  memorizedState: null
}
/**
 * 需要实现一个useState
 */
function useState(initialState) {
  let hook;

  if (!isMount) {
    hook = {
      queue: {
        pending: null
      },
      memorizedState: initialState,
      next: null
    }
    if (!fiber.memoizedState) {
      fiber.memoizedState = hook;
    } else {
      workInProgressHook.next = hook;
    }
    workInProgressHook = hook;
  } else {
    hook = workInProgressHook;
    workInProgressHook = workInProgressHook.next;
  }


  // TODO: 准备在此更新状态
  let baseState = hook.memorizedState
  if(hook.queue.pending) {
    let firstUpdate = hook.queue.pending.next // 按照指针执行
    do {
      const action = firstUpdate.action
      baseState = action(baseState)
      firstUpdate = firstUpdate.next
    } while(firstUpdate !== hook.queue.pending)

    hook.queue.pending = null
  }
  hook.memorizedState = baseState
  return [baseState, dispatchAction.bind(null, hook.queue)]
}

function dispatchAction(queue, action) {
  const update = {
    action,
    next: null
  }

  if (queue.pending === null) {
    // u0 -> u0 -> u0
    update.next = update
  } else {
    // u0 -> u0
    // u0 -> u1 -> u0
    update.next = queue.pending.next
    queue.pending.next = update
  }
  queue.pending = update

  schedule()
}


function schedule() {
  workInProgressHook = fiber.memoizedState; // 每次进入调度函数，将处理的指针指向第一个状态
  const app = fiber.stateNode();
  isMount = true;
  return app;
}

function dispatchAction(queue, action) {
  const update = {
    action,
    next: null
  }
  if (queue.pending === null) {
    update.next = update;
  } else {
    update.next = queue.pending.next;
    queue.pending.next = update;
  }
  queue.pending = update;

  schedule();
}

function App() {
  const [num, updateNum] = useState(0)

  console.log('isMount?', isMount)
  console.log('num', num)

  return {
    onClick() {
      updateNum(num => num + 1)
    }
  }
}

window.app = schedule();