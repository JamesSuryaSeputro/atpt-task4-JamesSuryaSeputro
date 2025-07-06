import { faker } from '@faker-js/faker';

export type UserData = ReturnType<typeof generateUserData>;
export type PaymentData = ReturnType<typeof generatePaymentData>;

export const generateUserData = () => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email({ firstName, lastName, provider: 'test.local' });

    return {
        name: `${firstName} ${lastName}`,
        email,
        password: faker.internet.password({ length: 12, prefix: 'P@ss1' }),
        title: 'Mr' as 'Mr' | 'Mrs',
        dob: {
            day: faker.number.int({ min: 1, max: 28 }).toString(),
            month: faker.date.month(),
            year: faker.number.int({ min: 1980, max: 2005 }).toString(),
        },
        firstName,
        lastName,
        address: faker.location.streetAddress(),
        country: 'United States',
        state: faker.location.state(),
        city: faker.location.city(),
        zipcode: faker.location.zipCode(),
        mobileNumber: faker.phone.number(),
    };
};

export const generatePaymentData = (): { cardName: string; cardNumber: string; cvc: string; expiryMonth: string; expiryYear: string; } => {
    return {
        cardName: faker.person.fullName(),
        cardNumber: faker.finance.creditCardNumber(),
        cvc: faker.finance.creditCardCVV(),
        expiryMonth: '12',
        expiryYear: '2030'
    };
};

