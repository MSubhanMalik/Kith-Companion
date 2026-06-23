import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const WORDS = [
  'Thinking', 'Looking at your schedule', 'Checking goals', 'On it',
  'Figuring it out', 'Reading your plan', 'Crunching numbers', 'Almost there',
  'Working on it', 'Pulling up your data', 'Analyzing', 'Let me check',
  'Processing', 'Running through it', 'One moment', 'Sorting things out',
  'Looking into it', 'Connecting the dots', 'Reviewing tasks', 'Checking progress',
  'Scanning your week', 'Mapping it out', 'Putting it together', 'Hang tight',
  'Getting context', 'Loading your goals', 'Calculating', 'Reasoning',
  'Fetching data', 'Weighing options', 'Cross-referencing', 'Making sense of it',
  'Tracing dependencies', 'Evaluating priorities', 'Drafting a response',
  'Assembling the picture', 'Parsing your request', 'Digging in',
  'Running the math', 'Thinking it through', 'Consulting the schedule',
  'Looking ahead', 'Checking availability', 'Matching tasks to slots',
  'Reviewing your progress', 'Considering trade-offs', 'Almost done',
  'Wrapping up', 'Final check', 'Just a sec', 'Bear with me',
  'Inspecting', 'Recalculating', 'Piecing it together', 'Reading between the lines',
  'Gathering intel', 'Sifting through data', 'Evaluating options', 'Lining things up',
  'Brewing an answer', 'Untangling', 'Surveying the landscape', 'Double-checking',
  'Tallying up', 'Making connections', 'Synthesizing', 'Zooming in',
  'Stepping back to think', 'Reflecting', 'Calibrating', 'Polishing',
  'Composing', 'Refining', 'Circling back', 'Verifying',
  'Sketching it out', 'Mulling it over', 'Chewing on it', 'Winding up',
  'Pulling threads', 'Getting the lay of the land', 'Dotting the i\'s',
  'Taking stock', 'Hashing it out', 'Noodling', 'Spinning up',
  'Warming up', 'Tuning in', 'Zeroing in', 'Locking in',
  'Scoping it out', 'Prepping', 'Cooking up a plan', 'Setting the stage',
  'Charting the course', 'Drawing conclusions', 'Wrapping my head around it',
]

interface LoadingWordsProps {
  interval?: number
}

export function LoadingWords({ interval = 2500 }: LoadingWordsProps) {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * WORDS.length))

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex(prev => (prev + 1) % WORDS.length)
    }, interval)
    return () => clearInterval(timer)
  }, [interval])

  return (
    <motion.div
      className="flex items-center gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex gap-1">
        {[0, 1, 2].map(i => (
          <motion.div key={i} className="w-1 h-1 rounded-full bg-olive/40"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }} />
        ))}
      </div>
      <motion.span
        key={index}
        className="text-xs text-text-muted"
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {WORDS[index]}
      </motion.span>
    </motion.div>
  )
}
