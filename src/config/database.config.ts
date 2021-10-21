import { ConfigService } from '@nestjs/config';

export const mongoFactory = async (ConfigService: ConfigService) => ({
  uri: ConfigService.get('MONGODB_URL'),
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: true,
  useUnifiedTopology: true,
});
