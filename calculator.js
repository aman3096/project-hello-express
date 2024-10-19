class Calculator {
    
    constructor(initialVal) {
        this.val = initialVal;
    }

    sum(num) {
        this.val += num
        return this;
    }

    subtract(num) {
        this.val -= num
        return this
    }

    divide(num) {
        this.val /=num;
        return this;
    }

    multiply(num) {
        this.val *= num;
        return this;
    }

    result() {
        return this.val;
    }
}
const calculator = new Calculator(10);
const finalResult = calculator.sum(10).subtract(2).multiply(10).divide(5).result();
console.log(finalResult);