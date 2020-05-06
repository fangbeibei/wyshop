function test(name, age) {
    this.name = name;
    this.age = age;
}
const mytest = new test('zs', 18)
test.prototype.action = () => {
    console.log('我是test原型上的方法')
}
const arr = ['a', 'b', 'c']
// 传入够着函数，返回空数组
console.log(Object.keys(test))  // []
// 传入实例对象，返回实例对象的所有属性名
console.log(Object.keys(mytest))  // ['name','age']
// 传入数组，返回索引
console.log(Object.keys(arr)) // ['0','1','2']
// for in 遍历实例对象,原型中的属性也会被遍历
for (item in mytest) {
    console.log(item)   // name age action
}
//定义一个不可枚举的属性
Object.defineProperty(mytest,'sex',{
    value:'male',
    enumerable: false
   })
//通过对象.属性的形式可以直接访问到    
console.log(mytest.sex)
// 通过for...in、Object.keys(mytest)、JSON.stringify 无法作用到
for(item in mytest){
    console.log(item)  // name age action
}
console.log(Object.keys(mytest)) //['name','age']
console.log(JSON.stringify(mytest)) // {"name":"zs","age":18}