import { useRoute } from "@react-navigation/native";
import dayjs from "dayjs";
import { Alert, ScrollView, Text, View } from "react-native";
import { BackButton } from "../components/BackButton";
import { Checkbox } from "../components/Checkbox";
import { ProgressBar } from "../components/ProgressBar";
import { useEffect, useState } from "react";
import { Loading } from "../components/Loading";
import { api } from "../lib/axios";
import { generateProgressPercentage } from "../utils/generate-progress-percentage";
import { HabitsEmpty } from "../components/HabitsEmpty";
import clsx from "clsx";

interface Params {
  date: string
}

interface HabitInfo {
  possibleHabits: {
    id: string
    title: string
    created_at: string
  }[]
  completedHabits: string[]
}

export function Habit() {
  const route = useRoute()
  const { date } = route.params as Params
  const [loading, setLoadting] = useState(false)
  const [habitInfo, setHabitInfo] = useState<HabitInfo>()

  const parsedDate = dayjs(date)
  const dayOfWeek = parsedDate.format('dddd')
  const dayAndMonth = parsedDate.format('DD/MM')
  const isDateInPast = parsedDate.endOf('day').isBefore(new Date())

  const habitsProgress = habitInfo?.completedHabits.length ? generateProgressPercentage(habitInfo.possibleHabits.length, habitInfo.completedHabits.length) : 0

  async function fetchHabits() {
    try {
      setLoadting(true)

      await api.get<HabitInfo>('day', { params: { date  } }).then(res => setHabitInfo(res.data))
    } catch (error) {
      console.log(error)
      Alert.alert('Ops', 'Nao foi possivel carregar as informacoes dos habitos')
    } finally {
      setLoadting(false)
    }
  }

  async function handleToggleHabit(habitId: string) {
    try {
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
    } catch (error) {
      console.log(error)
      Alert.alert('Ops', 'Nao foi possivel atualizar informacoes dos habitos')
    }
  }

  useEffect(() => {
    fetchHabits()
  }, [])

  if (loading) return <Loading />
  
  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <BackButton />

        <Text
          className="mt-6 text-zinc-400 font-semibold text-base lowercase"
        >
          {dayOfWeek}
        </Text>
        <Text
          className="text-white font-extrabold text-3xl"
        >
          {dayAndMonth}
        </Text>

        <ProgressBar progress={habitsProgress}/>

        <View className={clsx('mt-6', {
          'opacity-50': isDateInPast
        })}>
          {
            habitInfo?.possibleHabits && habitInfo?.possibleHabits.length > 0 ?
              habitInfo?.possibleHabits.map(habit =>
                <Checkbox
                  key={habit.id}
                  title={habit.title}
                  checked={habitInfo.completedHabits.includes(habit.id)}
                  disabled={isDateInPast}
                  onPress={() => handleToggleHabit(habit.id)}
                />
              )

              : <HabitsEmpty />
          }
        </View>

        {
          isDateInPast && <Text className="text-white mt-10 text-center">Voce nao pode editar habitos de uma data passada</Text>
        }
      </ScrollView>
    </View>
  )
}
