export const mongoFactory = async () => ({
  uri: process.env.MONGODB_URL,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: true,
  useUnifiedTopology: true,
});
