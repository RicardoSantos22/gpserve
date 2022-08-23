import { ApiProperty } from '@nestjs/swagger';
import { modelOptions, prop, Severity } from '@typegoose/typegoose';

@modelOptions({
  schemaOptions: { 
    timestamps: true,
    id: true,
    toJSON: {
      virtuals: true
    },
    toObject: {
      virtuals: true
    }
  },
  options: {
    allowMixed: Severity.ALLOW
  }
})

export class User {
  constructor(data?: any) {
    Object.assign(this, data);
  }

  @ApiProperty({
    description: "The model's identifier",
    readOnly: true,
  })

  @prop()
  id: string;

  _id: string;

  @ApiProperty({
    description: 'Name of the user',
    readOnly: true,
  })

  @prop()
  firstName: string;

  @ApiProperty({
    description: 'Last Name of the user',
    readOnly: true,
  })

  @prop()
  lastName: string;

  @ApiProperty({
    description: 'Second Name of the user',
    readOnly: true,
  })

  @prop()
  secondLastName: string;

  @ApiProperty({
    description: 'Email of the user',
    readOnly: true,
  })

  @prop({unique: true})
  email: string;

  @ApiProperty({
    description: "The user's phone; can be optional",
    readOnly: true,
  })

  @prop()
  phone: string;

  @ApiProperty({
    description: "The model's indetifier in Firebase",
    readOnly: true,
  })

  @prop({unique: true})
  firebaseId: string;

  @ApiProperty({
    description: "The user's state",
    readOnly: true,
  })

  @prop()
  state: string;

  @ApiProperty({
    description: "The user's ZIP code",
    readOnly: true,
  })

  @prop()
  zipCode: number;

  @ApiProperty({
    description: "The user's RFC; can be optional",
    readOnly: true,
  })

  @prop()
  rfc?: string;

  @ApiProperty({
    description: "The user's wishlist of new cars",
    readOnly: true,
  })

  @prop({default: []})
  newCarsWishlist: string[];

  @ApiProperty({
    description: "The user's wishlist of used cars",
    readOnly: true,
  })

  @prop({default: []})
  usedCarsWishlist: string[];

  @ApiProperty({
    description: 'Is the user verified?',
    readOnly: true,
  })

  @prop({default: true})
  isVerified: boolean;

  @ApiProperty({
    description: 'Is the user disabled?',
    readOnly: true,
  })

  @prop({default: false})
  isDisabled: boolean;

  @prop({default: []})
  documents: [
    {
      name: string,
      url: string
    }
  ]

  getFullName() {
    return this.firstName + ' ' + this.lastName + ' ' + this.secondLastName
  }
}
