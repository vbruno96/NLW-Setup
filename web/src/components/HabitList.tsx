import * as Checkbox from '@radix-ui/react-checkbox'
import { Check } from 'phosphor-react'
import { useEffect, useState } from 'react'
import { api } from '../lib/axios'
import dayjs from 'dayjs'

type HabitInfo = {
  possibleHabits: {
    id: string
    title: string
    created_at: string
  }[]
  completedHabits: string[]
}

interface HabitListProps {
  date: Date,
  onCompletedChange: (completed: number) => void
}

export function HabitList({date, onCompletedChange}: HabitListProps) {
  const [habitInfo, setHabitInfo] = useState<HabitInfo>()

  async function handleToggleHabit(habitId: string) {
    await api.patch(`habits/${habitId}/toggle`)

    const isHabitAlreadyCompleted = habitInfo!.completedHabits.includes(habitId)

    let completedHabits: string[] = []

    if (isHabitAlreadyCompleted) {
      completedHabits = habitInfo!.completedHabits.filter(id => id !== habitId)
    } else {
      completedHabits = [...habitInfo!.completedHabits, habitId]
    }

    setHabitInfo({
      possibleHabits: habitInfo!.possibleHabits,
      completedHabits
    })

    onCompletedChange(completedHabits.length)
  }

  
  useEffect(() => {
    api.get<HabitInfo>('day', {
      params: {
        date: date.toISOString()
      }
    }).then(res => {
      setHabitInfo(res.data)
    })
  }, [])

  const isDateInPast = dayjs(date)
    .endOf('day')
    .isBefore(new Date())
  
  
  return (
    <div className="mt-6 flex flex-col gap-3">
      {
        habitInfo?.possibleHabits.map(habit => {
          return (
            <Checkbox.Root
              key={habit.id}
              className="flex items-center gap-3 group"
              disabled={isDateInPast}
              checked={habitInfo.completedHabits.includes(habit.id)}
              onCheckedChange={() => handleToggleHabit(habit.id)}
            >
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500"
            >
              <Checkbox.Indicator>
                <Check size={20} className='text-white' />
              </Checkbox.Indicator>
            </div>
  
            <span className="font-semibold text-xl text-white leading-tight group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400">
              {habit.title}
            </span>
            </Checkbox.Root>
          )
        })
      }
    </div>
  )
}
