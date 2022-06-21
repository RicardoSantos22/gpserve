export default () => ({
    sadAPI: {
        username: process.env.SAD_API_USERNAME,
        password: process.env.SAD_API_PASSWORD,
        baseUrl: process.env.SAD_BASE_URL
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        exp: process.env.JWT_EXPIRATION_TIME,
        expAdmin: process.env.JWT_ADMIN_EXPIRATION_TIME,
    }
})