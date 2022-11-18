import { prop, pre, modelOptions } from '@typegoose/typegoose';
import { hash } from 'bcryptjs';
import { ApiProperty } from '@nestjs/swagger';

@pre<Admin>('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await hash(this.password, 10);
  }
  next();
})
@modelOptions({
  schemaOptions: {
    timestamps: true,
    toObject: {
      virtuals: true,
      versionKey: false,
      transform: (_doc, ret) => {
        delete ret._id;
        ret.lastOnline = ret.lastOnline.reverse();
        delete ret.password;
        delete ret.token;
        Object.setPrototypeOf(ret, Admin);
        return ret;
      },
    },
  },
})
export class Admin {
  @ApiProperty({
    description: 'The admin unique database identifier',
    example: '5d67489e38dcbd327c03b43a',
    readOnly: true,
  })
  id: string;

  @ApiProperty({
    description: 'The admin first name',
    example: 'John',
    readOnly: true,
  })
  @prop({ required: true, trim: true })
  firstName: string;

  @ApiProperty({
    description: 'The admin last name',
    example: 'Doe',
    readOnly: true,
  })
  @prop({ required: true, trim: true })
  lastName: string;

  @ApiProperty({
    description: 'The admin full name',
    example: 'John Doe',
    readOnly: true,
  })
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  @ApiProperty({
    description: `The admin's email`,
    example: 'john.doe@grupopremier.org',
    readOnly: true,
  })
  @prop({ required: true, trim: true, unique: true })
  email: string;

  @prop()
  password: string;

  constructor(data?: Partial<Admin>) {
    Object.assign(this, data);
  }
}
