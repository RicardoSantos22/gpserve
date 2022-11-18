export class SADUsedCar {
    ID: string;
    agencyID: number;
    brand: string;
    model: string;
    version: string;
    kmCount: string;
    previousOwner: string;
    hologram: string;
    plateNumber: string;
    plateState: string;
    technicalFile: string;
    year: string;
    color: string;
    isReserved: string;
    price: string;
    fuelType: string;
    serialNumber: string;
    chassisType: string;
    cylinderNumber: string;
    transmision: string;
    isAvailable: string;
    agencyCity: string;
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