import { ApiProperty } from '@nestjs/swagger';
import {pre, modelOptions, prop, Severity } from '@typegoose/typegoose';
import { hash } from 'bcryptjs';


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
        delete ret.password;
        Object.setPrototypeOf(ret, Admin);
        return ret;
      },
    },
  },
  options: {
    allowMixed: Severity.ALLOW
  }
})

export class Admin {
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
    description: 'Name of the admin',
    readOnly: true,
  })

  @prop()
  firstName: string;

  @ApiProperty({
    description: 'Name of the admin',
    readOnly: true,
  })

  @prop()
  lastName: string;

  @ApiProperty({
    description: 'Email of the admin',
    readOnly: true,
  })

  @prop()
  email: string;

  @ApiProperty({
    description: "The model's indetifier in Firebase",
    readOnly: true,
  })

  @prop()
  firebaseId: string;

  @ApiProperty({
    description: 'The agency ID attached to this model',
    readOnly: true,
  })

  @prop()
  agencyId: string;

  @ApiProperty({
    description: 'Is the admin a super admin?',
    readOnly: true,
  })

  @prop()
  isSuperAdmin: boolean;

  @ApiProperty({
    description: 'Is the admin disabled?',
    readOnly: true,
  })

  @prop()
  isDisabled: boolean;

  @ApiProperty({
    description: 'A list of permission for the current admin',
    readOnly: true,
  })

  @prop()
  permissions: string[];

  @prop()
  password: string;
}
