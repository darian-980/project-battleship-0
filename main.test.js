import { ship } from "./main.js";


test("ship hit returns 1", () => {
    const newShip = ship();
    expect(newShip.hit()).toBe(1);
});

test("ship status returns false", () => {
    const newShip = ship();
    expect(newShip.isSunk()).toBe(false);
});

test("ship position return [[1,2],[3,4]]", () => {
    const newShip = ship();
    expect(newShip.setShipPos([1,2],[3,4])).toEqual([[1,2],[3,4]]);
});



// test("'Hello, World!' with an offset of 3 with the cipher will be 'Khoor, Zruog!'", () => {
//     expect(caesarCipher('Hello, World!', 3)).toBe('Khoor, Zruog!');
// });