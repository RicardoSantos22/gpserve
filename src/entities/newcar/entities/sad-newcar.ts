export class SADNewCar {
    ID: string;
    agencyID: number;
    brand: string;
    model: string;
    version: string;
    description: string;
    technicalFile: string;
    year: string;
    color: string;
    isReserved: string;
    price: string;
    fuelType: string;
    promotionDescription: string;
    promotionAmount: number;
    serialNumber: string;
    chassisType: string;
    cylinderNumber: string;
    transmision: string;
    isAvailable: string;
    agencyCity: string;
    demo: string;
    images: {
        imageUrl: string
    }[]
    specs: {
        spec: string,
        descriptionSpec: string,
        label?: string,
        category?: string
    }[]
}