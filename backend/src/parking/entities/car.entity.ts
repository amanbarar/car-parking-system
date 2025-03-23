export class Car {
    constructor(
        public regNo: string,
        public color: string
    ) {}

    toJSON() {
        return {
            regNo: this.regNo,
            color: this.color
        };
    }
}
