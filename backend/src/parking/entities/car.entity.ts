// Represents a car with a registration number and color.

export class Car {
    // Creates a new Car instance.
    constructor(
        public regNo: string,
        public color: string
    ) {}

    // Converts the Car instance to a JSON object.
    toJSON() {
        return {
            regNo: this.regNo,
            color: this.color
        };
    }
}
