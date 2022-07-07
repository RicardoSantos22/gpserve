import { Expose } from "class-transformer";

export class SelfUserResponse {

    @Expose({name: '_id'})
    id: string;

    @Expose()
    firstName: string;

    @Expose()
    lastName: string;

    @Expose()
    secondLastName: string;

    @Expose()
    email: string;

    @Expose()
    phone?: string;

    @Expose()
    firebaseId: string;

    @Expose()
    state: string;

    @Expose()
    zipCode: number;

    @Expose()
    rfc?: string;

    @Expose()
    newCarsWishlist: string[];

    @Expose()
    usedCarsWishlist: string[];

    @Expose()
    isVerified: boolean;

    @Expose()
    isDisabled: boolean;

    @Expose()
    fullName: string

}