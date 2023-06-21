export interface KarbotModel {
    statusCode:   number;
    user:         User;
    business:     Business;
    organization: null;
    session:      Session;
}

export interface Business {
    id:       number;
    name:     string;
    contract: string;
}

export interface Session {
    access_token: string;
    expiresIn:    string;
}

export interface User {
    id:                      number;
    roleId:                  number;
    businessId:              number;
    organizationId:          null;
    name:                    string;
    email:                   string;
    supervisedCategoriesIds: any[];
}

export interface CreateLeadModel {
    message:     string;
    statusCode:  number;
    description: string;
    outPut:      string;
}

export interface karbotCreateLead{

    lineName:     string;
    referenceId:  string;
    categoryLead: string;
    canalLead:    string;
    origin:       string;
    campaign:     string;
    phoneNumber:  string;
    token: string;
    user_email: string;
    user_nombre : string;
    user_apellido: string;
    product: string;
    vin: string;


}

