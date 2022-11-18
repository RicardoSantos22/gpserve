import { Logger } from "@nestjs/common";

export const mongoFactory = async () => {
  const mongoUrl = process.env.MONGODB_URL
  Logger.debug(`Using database ${mongoUrl}`)
  return {
    uri: process.env.MONGODB_URL,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true
  }
};
