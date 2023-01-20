import { View, Text, ScrollView, Alert } from 'react-native';

import { Header } from '../components/Header';
import { HabitDay, DAY_SYZE } from '../components/HabitDay';
import { generateDatesFromYearBeginning } from '../utils/generate-dates-from-year-beginning';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { api } from '../lib/axios';
import { Loading } from '../components/Loading';
import dayjs from 'dayjs';

const weakDays = [
  'D',
  'S',
  'T',
  'Q',
  'Q',
  'S',
  'S'
]

type Summary = {
  id: string
  date: string
  completed: number
  amount: number
}[]

const datesFromYearStart = generateDatesFromYearBeginning()
const minimumSummaryDatesSize = 18 * 5
const amountOfDaysToFill = minimumSummaryDatesSize - datesFromYearStart.length

export function Home() {
  const { navigate } = useNavigation()
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState<Summary>([])

  async function fetchData() {
    try {
      setLoading(true)

      const res = await api.get<Summary>('/summary')

      setSummary(res.data)
      console.log(res.data)
    } catch (error) {
      Alert.alert('Ops', 'Nao foi possivel carregar os dados')
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) return <Loading />
  
  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <Header />

      <View
        className='flex-row mt-6 mb-2'
      >
      {
        weakDays.map((weakDay, i) => (
          <Text
            key={`${weakDay}-${i}`}
            className='text-zinc-400 text-xl font-bold text-center mx-1'
            style={{width: DAY_SYZE}}
          >
            {weakDay}
          </Text>
        ))
      }
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View
          className='flex-row flex-wrap'
        >
          {
            datesFromYearStart.map(date => {
              const dayInSummary = summary.find(day => dayjs(date).isSame(day.date, 'day'))

              return (
                <HabitDay
                  key={date.toISOString()}
                  onPress={() => navigate('habit', { date: date.toISOString() })}
                  date={date}
                  amount={dayInSummary?.amount}
                  completed={dayInSummary?.completed}
                />
              )
            })
          }

          {
            amountOfDaysToFill > 0 && Array
            .from({ length: amountOfDaysToFill })
            .map((_, i) => (
              <View
                key={i}
                className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40"
                style={{width: DAY_SYZE, height: DAY_SYZE}}
              />
            ))
          }
        </View>
      </ScrollView>
    </View>
  )
}
