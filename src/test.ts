function idd<T> (arg: T[]): T[] {
    console.log(arg.length);
    return arg;
}

idd([1, 2, 3]);


function identity<T>(arg: T): T {
    return arg;
}

// 范型函数赋值
let myIdentify: <T>(arg: T) => T = identity;

// 函数泛型接口
interface idFn<T> {
    (arg: T): void;
}

let fn: idFn<number> = (arg: number): void => {
    console.log(arg);
}

fn(666);

// 泛型类
class GenericNumber<T> {
    zeroValue: T;
    add: (x: T, y: T) => T;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function(x, y)  {
    return x + y;
}

myGenericNumber.add(2, 1);

// 泛型约束
interface Lengthwise {
    length: number;
}

function loggingIdentity<T extends Lengthwise> (arg: T): T {
    console.log(arg.length);
    return arg;
}

loggingIdentity("aaa");

// 泛型约束使用类型参数
/*
function getProperty(obj: T, key: K) {
    return obj[key];
}

let x = {a: 1, b: 2};

getProperty(x, "a");
*/

class BeeKeeper {
    hasMask: boolean;
}

class ZooKeeper {
    nametag: string;
}

class Animal {
    numLegs: number;
}

class Bee extends Animal {
    keeper: BeeKeeper;
}

class Lion extends Animal {
    keeper: ZooKeeper;
}

function createInstance<A extends Animal>(c: new() => A): A {
    return new c();
}

// console.log(createInstance(Lion).keeper.nametag);

// 类型额外检查(字面量会经过额外类型检查)
interface SquareConfig {
    color?: string;
    width?: number;
    [propName: string]: any;
}

function createSquare(config: SquareConfig) {
    console.log(config);
}

let mySquare = createSquare({width: 100, colour: "red"});

// 可索引类型
interface StringArray {
    [index: number]: string;
}

let myArr: StringArray;
myArr = ["Bob", "Fred"];
console.log(myArr[1]);


//类类型
interface ClockInterface {
    currentTime: Date;
    setTime(d: Date): void;
}

class Clock implements ClockInterface {
    currentTime: Date;
    setTime(d: Date) {
        this.currentTime = d;
    }


    constructor(h: number, m: number) {

    }
}

interface ClockInterfaceTick {
    tick(): void;
}

interface ClockConstructor {
    new (hour: number, minute: number): any;
}
/*
// 当类实现一个implements一个interface时， 只会检查实例部分
class Clock2 implements ClockConstructor {
    currentTime: Date;
    // 静态部分
    constructor(h: number, minute: number) {
        // 实例部分
    }
}
*/

function createClock(ctor: ClockConstructor, hour: number, minute: number): ClockInterfaceTick
{
    return new ctor(hour, minute);
}

class DigitialClock implements ClockInterfaceTick {
    constructor(h: number, m: number) {

    }

    tick() {
        console.log("beep beep");
    }
}

let clock: DigitialClock = createClock(DigitialClock, 10, 10);
clock.tick();



class Test {
    name: string;
    constructor() {
        this.name = "Jack";
    }

    tt() {
        console.log("tt");
    }

    // es6 定义静态方法
    static ttt() {
        console.log("ttt");
    }
}

console.log(Test.constructor);
console.log(new Test().tt);
console.log(Test.ttt);

// 接口继承类(会继承private, public, protected) 只能为该类和子类实现
class Control {
    private state: any;
}

interface SelectableControl extends Control {
    select(): void;
}

class Button extends Control implements SelectableControl {
    select() {

    }
}

/*
class Image implements SelectableControl {
    // private state: any;
    select() {

    }
}
*/

// protected 可以继承  private 不能继承
class Person {
    protected name: string;
    private secondName: string;
    constructor(name: string) {
        this.name = name;
        this.secondName = name;
    }
}

class Employee extends Person {
    private department: string;
    constructor(name: string, department: string) {
        super(name);
        this.department = department;
    }

    public getElevatorPitch() {
        // console.log(thi)
        return `Hello, my name is ${this.name} and I work in ${this.department}`;
    }
}

let howard = new Employee("Haward", "Sales");
console.log(howard.getElevatorPitch());
// console.log(howard.name);

// 抽象类
abstract class Department {
    constructor(public name: string) {

    }

    printName(): void {
        console.log("Department name: " + this.name);
    }

    abstract printMeeting(): void;
}

class AccountingDepartment extends Department
{
    constructor() {
        // 在派生构造函数中必须实现
        super("Accounting and Auditing");
    }

    printMeeting(): void {
        console.log("The Accounting Department meets each Monday at 10am.");
    }

    generateReport(): void {
        console.log("Generating accounting report");
    }
}

let department: AccountingDepartment;
// department = new Department();
department = new AccountingDepartment();
department.printName();
department.printMeeting();
department.generateReport();


// 类高级技巧
class Greeter {
    static standardGreeting = "Hello, World";
    greeting: string;
    greet() {
        if (this.greeting) {
            return "Hello, " + this.greeting;
        } else {
            return Greeter.standardGreeting;
        }
    }
}


let greeter1: Greeter;
greeter1 = new Greeter();
console.log(greeter1.greet());

let greeterMaker: typeof Greeter = Greeter;
greeterMaker.standardGreeting = "Hey, there";

let greeter2: Greeter = new greeterMaker();
console.log(greeter2.greet());

interface Demo {
    name: string;
}

class Demo {
    // name: number;
    constructor(name: string) {
        this.name = name;
    }
}


console.log(new Demo("KAKA").name);

//交叉类型（多个类型合成一个类型）

export function extend<T, U>(first: T, second: U): T & U {
    let result = <T & U>{};
    for (let id in first) {
        (result as any)[id] = (first as any)[id];
    }

    for(let id in second) {
        if (!result.hasOwnProperty(id)) {
            (<any>result)[id] = (<any> second)[id];
        }
    }

    return result;
}

class Person2 {
    constructor(public name: string) {}
}

interface Loggable {
    log(): void;
}

class ConsoleLogger implements Loggable {
    log() {
        console.log.call(this, "haha");
    }
}

export var jim = extend(new Person2("Jim"), new ConsoleLogger());

jim.log();

export const aa: string = "Hello";

function padLeft(value: string, padding: string | number) {
    if (typeof padding === "number") {
        return Array(padding + 1).join(" ") + value;
    } else {
        return padding + value;
    }
}

function fixed(name?: string): string {
    function postfix(epithet: string) {
        return name!.charAt(0) + '.  the ' + epithet; // ok
    }

    name = name || "hahahaha";

    return postfix("haha");
}

console.log(fixed());

// 类型索引


class A {
    static isName: string = "Kaka";
    constructor() {

    }
}

class B extends A{

}

class C extends B {

}

console.log(A.isName);
console.log(B.isName);
console.log(C.isName);


console.log(Object.getPrototypeOf(C) instanceof A);



