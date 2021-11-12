class Vehicle {
    constructor(make, model, year) {
        this.make = make;
        this.model = model;
        this.year = year;
    }

    honk() {
        return "Beep.";
    }

    toString() {
        return `The vehicle is a ${make} ${model} from ${year}.`;
    }
}

class Car extends Vehicle {
    constructor(make, model, year) {
        super(make, model, year);
        this.numWheels = 4;
    }
}

class Motorcycle extends Vehicle {
    constructor(make, model, year) {
        super(make, model, year);
        this.numWheels = 2;
    }

    revEngine() {
        return "VROOM!!!";
    }
}

class Garage {
    constructor(capacity) {
        this.vehicles = []
        this.capacity = capacity;
    }

    add(vehicle) {
        if(!(vehicle instanceof Vehicle)) {
            return "Only vehicles are allowed in here!";
        } else if(this.capacity === this.vehicles.length) {
            return "Sorry, we're full.";
        } else {
            this.vehicles.push(vehicle);
            return `The ${vehicle.make} ${vehicle.model} was added.`
        }
    }
}