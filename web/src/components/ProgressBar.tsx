import * as Progress from '@radix-ui/react-progress';

interface ProgressProps {
  progress: number
}

export function ProgressBar({ progress }: ProgressProps) { 
  
  return (
    <Progress.Root
      value={progress}
      className="h-3 rounded-xl bg-zinc-700 w-full mt-4"
    >
      <Progress.Indicator 
        className="h-3 rounded-xl bg-violet-600 transition-all" 
        style={{width: `${progress}%`}}
      />
    </Progress.Root>
  )
}
