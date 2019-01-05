import * as meta from './meta'
import * as score from './score'

export function getMeta(sus: string): meta.ISusMeta {
  return meta.getMeta(sus)
}

export function getScore(sus: string): score.ISusScore {
  return score.analyze(sus)
}

export function validate(sus: string): meta.ISusValidity {
  return meta.validate(sus)
}
