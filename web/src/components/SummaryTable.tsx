import { useEffect, useState } from "react"
import { generateDatesFromYearBeginning } from "../utils/generate-dates-from-year-beginning"
import { HabitDay } from "./HabitDay"
import { api } from "../lib/axios"
import dayjs from "dayjs"

const weakDays = [
  'D',
  'S',
  'T',
  'Q',
  'Q',
  'S',
  'S'
]

const summaryDates = generateDatesFromYearBeginning()
const minimumSummaryDatesSize = 18 * 7 // 18 weaks
const amountOfDaysToFill = minimumSummaryDatesSize - summaryDates.length

type Summary = {
  id: string
  date: string
  completed: number
  amount: number
}[]

export function SummaryTable() {
  const [summary, setSummary] = useState<Summary>([])

  useEffect(() => {
    api.get<Summary>('summary').then(res => setSummary(res.data))
  }, [])
  
  return (
    <div className="w-full flex">
      <div className="grid grid-rows-7 grid-flow-row gap-3">
      {
        weakDays.map((weakDay, i) => (
          <div key={`${weakDay}-${i}`} className="text-zinc-400 text-xl h-10 w-10 font-bold flex items-center justify-center">
            {weakDay}
          </div>
        ))
      }
      </div>
      <div className="grid grid-rows-7 grid-flow-col gap-3">
        {summary.length && summaryDates.map(date => {
          const dayInSummary = summary.find(day => dayjs(date).isSame(day.date, 'day'))
          return (
            <HabitDay
              key={date.toString()}
              amount={dayInSummary?.amount}
              defaultCompleted={dayInSummary?.completed}
              date={date}
            />
          )
        })}
        {amountOfDaysToFill > 0 && Array.from({ length: amountOfDaysToFill }).map((_, i) => (
          <div key={i} className="w-10 h-10 bg-zinc-800 rounded-lg opacity-40 cursor-not-allowed" />
        ))}
      </div>
    </div>
  )
}