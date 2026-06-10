
let bibao = '闭包是什么？利弊？如何解决弊端？'

bibao = `
闭包就是外层函数返回内层函数,并且内层函数用到了外层函数的参数或者变量,即使外层函数执行完毕,内层函数仍然可以访问外层的参数或者变量。
闭包的利弊
闭包的利：
1. 函数作为返回值
2. 函数作为参数传递
3. 创建私有变量

闭包的弊：
1. 内存泄漏
2. 性能问题
3. 执行效率问题
4. 代码复用问题

如何解决闭包的弊端：
1. 使用let代替var
2. 减少闭包的使用
3. 使用WeakMap代替对象

WeakMap是一种弱引用的Map，它所引用的对象可以被垃圾回收，不会导致内存泄漏。
`

let kaobei = '深拷贝与浅拷贝的区别？深拷贝的实现方法？JSON.parse(JSON.stringify)实现的缺点？'
kaobei = `
深拷贝与浅拷贝的区别：
    浅拷贝：只拷贝对象的第一层，第二层及以后的嵌套对象不会被拷贝，而是被引用。
    深拷贝：拷贝对象的每一层，无论多少层都会被拷贝，不会被引用。

    深拷贝的实现方法：
    1. JSON.parse(JSON.stringify)
    2. 递归
    3. 使用第三方库

    JSON.parse(JSON.stringify)实现的缺点：
    1. 无法拷贝函数
    2. 无法拷贝循环引用
    3. 无法拷贝特殊对象，如Date、RegExp、Set、Map等
`

function deepClone(obj, cache = new WeakMap()) {
    // 1. 基本类型直接返回
    if (obj === null || typeof obj !== 'object') return obj

    // 2. 处理循环引用
    if (cache.has(obj)) return cache.get(obj)

    // 3. 创建新对象/数组
    const clone = Array.isArray(obj) ? [] : {}
    cache.set(obj, clone)

    // 4. 递归拷贝每个属性
    for (const key of Reflect.ownKeys(obj)) { // Reflect.ownKeys 能拿到 Symbol 键
        clone[key] = deepClone(obj[key], cache)
    }

    return clone
}

let panduankongduixaing = `如何判断空对象？如何区分数据类型？`

panduankongduixaing = `
如何判断空对象？如何区分数据类型？
1. 判断空对象：
    1.1. obj === {}
    1.2. Object.keys(obj).length === 0
    1.3. JSON.stringify(obj) === '{}'
2. 区分数据类型：
    2.1. typeof: 可以判断基本数据类型，但无法判断对象类型
    2.2. instanceof: 可以判断对象是否是某个类的实例，但无法判断基本数据类型
    2.3. Object.prototype.toString.call: 可以判断对象类型，但无法判断基本数据类型
`
let gaibianthis = `如何改变this指向？区别？`



const fn = function (a, b, c) {
    const name = 'aaa'
    console.log(this.name, a, b, c)
}

fn.call(null, 'aaa', 'bbb', 'ccc')
fn.apply(null, ['aaa', 'bbb', 'ccc'])
const newFn = fn.bind(null)
newFn()

let liulanqicunchu = `浏览器存储，他们的区别？`

liulanqicunchu = `
cookie:容量4k,可设置过期时间，每次HTTP自动带，数据格式字符串，读写方式同步；
localStorage:容量5m,主动删除，数据格式字符串，读写方式同步；
sessionStorage:容量5m,页签关闭即清除，不可跨页签，数据格式字符串，读写方式同步；
indexDB:几百Mb,主动删除，数据类型支持任意，读写方式异步，worker可用，支持索引查询
`

sessionStorage.setItem('key', 'value')
ocalStorage.setItem('key', 'value')
const indexDB = indexedDB.open('myDatabase', 1)

const cookie = document.cookie

let shuzu = `常用的数组方法有哪些？`

shuzu = `pop头部删除，
push头部添加，
unshift:末尾添加，
shift:末尾删除，
sort：排序，
reverse：反转，
slice：截取，
splice：删除，
concat：连接，
join：连接成字符串，
split：分割成数组，
map：映射，
filter：过滤，
reduce：归约，
forEach：遍历，
some：判断是否至少有一个元素满足条件，
every：判断是否所有元素都满足条件，
find：查找第一个满足条件的元素，
findIndex：查找第一个满足条件的元素的索引，
forEach：遍历，
`
let shijianliu = `Dom事件流的顺序？什么是事件委托？`

shijianliu = `事件流就是事件在DOM树中传播的顺序，事件流分为三个阶段：时间捕获，目标阶段，时间冒泡。
时间委托就是将事件监听绑定到父组件上，通过判断事件监听来实现对子组件的监听
`

let yuanxinglian = `对原型链的认识？`

yuanxinglian = `
js通过原型链模拟面向对象，比如通过实例化一个构造函数给每一个实例添加属性和方法，通过给类的原型对象添加属性和方法，实现继承。

每个函数都有 prototype 属性，指向一个对象，作为 new 出来的实例的原型。每个对象都有 __proto__，指向创建它的构造函数的 prototype。当访问对象属性时，先在自身找，找不到就沿 __proto__ 链往上找，直到 Object.prototype.__proto__ 为 null 终止。这条链就是原型链。

prototype与__proto__的区别：
    prototype是函数对象的一个属性，是构造函数的属性，指向一个对象
    __proto__是对象的一个属性，是实例对象的属性，指向一个对象
`

const fangdou = (fn, delay) => {
    let timeoutId = null


    return function (...args) {
        if (timeoutId) {
            clearTimeout(timeoutId)

        }
        timeoutId = setTimeout(() => {
            fn.apply(this, args)
            timeoutId = null
        }, delay)
    }
}

const jieliu = (fn, delay) => {
    let lastTime = 0

    return function (...args) {
        const now = Date.now()
        if (now - lastTime >= delay) {
            lastTime = now
            fn.apply(this, args)
        }
        // 冷却中 → 直接忽略
    }
}


let weileiyuweiyuansu=`伪类和伪元素区别？`
weileiyuweiyuansu = `伪类和伪元素区别：
伪类：用于选择元素的某种状态，如:hover、:active、:focus等
伪元素：用于选择元素的某个部分，如::before、::after、::first-line、::first-letter等
`
