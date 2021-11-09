class Student {
	constructor(age, studienfach) {
		this.name = 'Florian';
		this.age = age;
		this.studienfach = studienfach;
	}

	sayHello() {
		console.log(`Hello, my name is ${this.name}`);
	}
}

export default Student;
