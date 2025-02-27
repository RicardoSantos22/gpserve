import {Injectable} from '@nestjs/common';
import {ReturnModelType} from '@typegoose/typegoose';
import {InjectModel} from 'nestjs-typegoose';

import {CrudRepository} from '../../../common/crud/crud.repository';
import {NewCarGroupFilter} from '../dto/new-car-group-filter';

import {NewCar} from '../model/newcar.model';

let x

@Injectable()
export class NewCarRepository extends CrudRepository<typeof x> {
    constructor(@InjectModel(NewCar) readonly model: ReturnModelType<typeof NewCar>) {
        super(model, 'NewCar');
    }

    async findByGroup(group: NewCarGroupFilter): Promise<NewCar[]> {
        return this.model.find(group)
    }

    async findByBrands(brands: string[]): Promise<NewCar[]> {
        return this.model.find({brand: {$in: brands}}).select('model').exec()
    }

    async findBymodelGroup(brands: string[]): Promise<NewCar[]> {
        return this.model.find({brand: {$in: brands},status: 'online'}).select('modelGroup').exec()
    }

    async getNewCars() {
        return this.model.find().select('brand model').exec();
    }

    async findallnewcars(query: any){

        return this.model.find({
            $and: [
                { status: 'online' },
                { brand: { $regex: query.brand} },
                { modelGroup: { $regex: query.modelGroup, $options: 'i'} }
            ]
        }).exec()
    }

};
