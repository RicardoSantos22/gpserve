import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';

import { CrudRepository } from '../../../common/crud/crud.repository';
import { CarType } from '../../../common/models/enums/car-type.enum';

import { User } from '../model/user.model';

@Injectable()
export class UserRepository extends CrudRepository<User> {
  
  constructor(@InjectModel(User) readonly model: ReturnModelType<typeof User>) {
    super(model, 'User');
  }
  
  async addToWishlist(id: string, carId: string, carType: CarType) {
    return carType === CarType.new ? this.model.findByIdAndUpdate(id, { $push: { newCarsWishlist: carId } }, { new: true }) : this.model.findByIdAndUpdate(id, { $push: { usedCarsWishlist: carId } }, { new: true })
  }

  async removeFromWishlist(id: string, carId: string, carType: CarType) {
    return carType === CarType.new ? this.model.findByIdAndUpdate(id, { $pull: { newCarsWishlist: carId } }, { new: true }) : this.model.findByIdAndUpdate(id, { $pull: { usedCarsWishlist: carId } }, { new: true })
  }


};
