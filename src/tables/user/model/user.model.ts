import { ApiProperty } from '@nestjs/swagger';
import { modelOptions, prop } from '@typegoose/typegoose';

@modelOptions({
  schemaOptions: { timestamps: true }
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

  @ApiProperty({
    description: 'Name of the user',
    readOnly: true,
  })

  @prop()
  name: string;

  @ApiProperty({
    description: 'Email of the user',
    readOnly: true,
  })

  @prop()
  email: string;

  @ApiProperty({
    description: "The user's phone; can be optional",
    readOnly: true,
  })

  @prop()
  phone?: string;

  @ApiProperty({
    description: "The model's indetifier in Firebase",
    readOnly: true,
  })

  @prop()
  firebaseId: string;

  @ApiProperty({
    description: 'The user state',
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
    description: 'The RFC of the user; can be optional',
    readOnly: true,
  })

  @prop()
  rfc?: string;

  @ApiProperty({
    description: "The user's whishlist of new cars",
    readOnly: true,
  })

  @prop()
  newCarsWishlist: string[];

  @ApiProperty({
    description: "The user's whishlist of used cars",
    readOnly: true,
  })

  @prop()
  usedCarsWishlist: string[];

  @ApiProperty({
    description: 'Is the user verified?',
    readOnly: true,
  })

  @prop()
  isVerified: boolean;

  @ApiProperty({
    description: 'Is the user disabled?',
    readOnly: true,
  })

  @prop()
  isDisabled: boolean;
}
