import { Car } from '../../src/parking/entities/car.entity';

describe('Car Entity', () => {
    it('should create a Car instance with the correct properties', () => {
        const car = new Car('KA-01-1234', 'red');

        expect(car.regNo).toBe('KA-01-1234');
        expect(car.color).toBe('red');
    });

    it('should return correct JSON representation', () => {
        const car = new Car('KA-01-5678', 'blue');

        expect(car.toJSON()).toEqual({
            regNo: 'KA-01-5678',
            color: 'blue'
        });
    });
});
