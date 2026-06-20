type PetType = 'cat' | 'robot' | 'avatar' | 'boss'

function play(src: string) {
  const audio = new Audio(src)
  audio.volume = 0.5
  audio.play().catch(() => {})
}

function pickRandom(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)]
}

const sounds: Record<PetType, { meow: string[]; purr: string; nom: string; disgust: string }> = {
  cat: {
    meow: ['/sounds/meow1.mp3', '/sounds/meow2.mp3', '/sounds/meow3.mp3'],
    purr: '/sounds/purr.mp3',
    nom: '/sounds/nom.mp3',
    disgust: '/sounds/angry.mp3',
  },
  robot: {
    meow: ['/sounds/robot-beep1.mp3', '/sounds/robot-beep2.mp3', '/sounds/robot-beep3.mp3'],
    purr: '/sounds/robot-happy.mp3',
    nom: '/sounds/robot-nom.mp3',
    disgust: '/sounds/robot-error.mp3',
  },
  avatar: {
    meow: ['/sounds/human-hmm1.mp3', '/sounds/human-hmm2.mp3', '/sounds/human-hmm3.mp3'],
    purr: '/sounds/human-happy.mp3',
    nom: '/sounds/human-nom.mp3',
    disgust: '/sounds/human-error.mp3',
  },
  boss: {
    meow: ['/sounds/human-hmm1.mp3', '/sounds/human-hmm2.mp3', '/sounds/human-hmm3.mp3'],
    purr: '/sounds/human-happy.mp3',
    nom: '/sounds/human-nom.mp3',
    disgust: '/sounds/human-error.mp3',
  },
}

export function playMeow(pet: PetType = 'cat') {
  play(pickRandom(sounds[pet].meow))
}

export function playPurr(pet: PetType = 'cat') {
  play(sounds[pet].purr)
}

export function playNom(pet: PetType = 'cat') {
  play(sounds[pet].nom)
}

export function playDisgust(pet: PetType = 'cat') {
  play(sounds[pet].disgust)
}
