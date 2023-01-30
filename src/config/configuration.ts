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
    },
    setupCarsSecret: process.env.SETUP_CARS_SECRET,
    libroAzul: {
        user: process.env.LIBRO_AZUL_USER,
        pwd: process.env.LIBRO_AZUL_PASSWORD
    },
    Multipagos:{
        privatekey: process.env.MULTIPAGOS_PRIVATE_KEY
    },
    s3: {
        region: process.env.MEDIA_S3_REGION,
        accessKey: process.env.MEDIA_S3_ACCESS_KEY,
        secretKey: process.env.MEDIA_S3_SECRET_KEY,
        bucket: process.env.MEDIA_S3_BUCKET
    }
})