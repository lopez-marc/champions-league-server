const config = {
  port: process.env.PORT,
  secrets: {
    jwt: process.env.JWT_SECRET,
    jwtExp: process.env.JWT_EXPIRATION
  },
  dbUrl: process.env.MONGODB_URL
}

export default config
