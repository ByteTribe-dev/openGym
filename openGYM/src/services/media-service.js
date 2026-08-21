import { EXERCISE_MEDIA } from './exercise-media-manifest.js'

const keyOf = (kind, value) => {
  if (!value) return null
  const name = String(value).split('/').pop()
  return `${kind}/${name}`
}

export const mediaService = {
  image: exercise => EXERCISE_MEDIA[keyOf('img', exercise?.img)] || null,
  gif: exercise => EXERCISE_MEDIA[keyOf('gif', exercise?.gif)] || null,
}
