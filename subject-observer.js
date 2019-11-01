class Subject {
  constructor() {
    this.observers = []
  }

  add(observer) {
    this.observers.push(observer)
  }

  notify(...args) {
    this.observers.forEach(function(observer) {
      try {
        observer.update(...args)
      } catch (error) {
        console.log(error)
      }
    })
  }
}

// abstract class
// implements interface
class Observer {
  update(...args) {
    throw new TypeError('必须实现继承此方法')
  }
}

// 实现特定接口
class MutationObserver extends Observer {
  update(...args) {
    console.log(...args)
  }
}

// 没有实现特定发布者接口的类
class IntersectionObserver extends Observer {
  update() {}
}

// Observer
let ob1 = new MutationObserver() // 正常执行
let ob2 = new IntersectionObserver() // 报错

// Subject
let sub = new Subject()

sub.add(ob1)
sub.add(ob2)

sub.notify('I fired `SMS` event')
