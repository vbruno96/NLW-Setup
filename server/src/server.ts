import fastify from "fastify"
import { PrismaClient } from '@prisma/client'

const app = fastify()
const prisma = new PrismaClient()

app.get('/', () => 'Hello World')

app.listen({
  port: 3333,
})
  .then(() => console.log(`Server running`))