import { PrismaClient } from '@prisma/client'
import { subDays } from 'date-fns'
import { v4 as uuidv4 } from 'uuid'  // install uuid: npm i uuid

const prisma = new PrismaClient()

async function main() {
  await prisma.sale.deleteMany() // Clear old data

  const today = new Date()
  const days = 30 // Past 30 days

  for (let i = 0; i < days; i++) {
    const date = subDays(today, i)

    // Random number of sales (2 to 10) for the day
    const salesCount = Math.floor(Math.random() * 9) + 2

    const sales = Array.from({ length: salesCount }).map(() => ({
      id: uuidv4(), // unique id for each sale
      amount: Math.floor(Math.random() * 90) + 10, // amount between 10 and 99
      createdAt: new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        Math.floor(Math.random() * 24), // random hour
        Math.floor(Math.random() * 60), // random minute
        Math.floor(Math.random() * 60)  // random second
      ),
    }))

    await prisma.sale.createMany({ data: sales })
  }

  console.log(`✅ Seeded ${days} days with 2–10 sales per day.`)
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect())
