interface SusDifficulty {
    TEXT?: string
    COLOR?: string
    BACKGROUND?: string
    LEVEL?: number
    MARK?: string 
}

interface SusLevel {
    LEVEL?: number
    TEXT?: string
}

interface SusMeta {
    SONGID?: string
    TITLE?: string
    ARTIST?: string
    DESIGNER?: string
    DIFFICULTY?: SusDifficulty
    PLAYLEVEL?: SusLevel
    WAVE?: string
    WAVEOFFSET?: number
    JACKET?: string
    BACKGROUND?: string
    MOVIE?: string
    MOVIEOFFSET?: string
    BASEBPM?: number
}

interface SusNotes {
    measure: number
    lane_type: number
    lane: number
    tick: number
    note_type: number
    width: number
}

interface SusScore {
    measure: number
    BPMs: number[]
    BEATs: number[]
    shortNotes: SusNotes[]
    holdNotes: SusNotes[][]
    slideNotes: SusNotes[][]
    AirActionNotes: SusNotes[][]
    AirNotes: SusNotes[]
}

interface SusValidity {
    VALIDITY: boolean
    MISSING_META: string[]
}

declare function getMeta(sus: string): SusMeta
declare function getScore(sus: string, tickPerBeat?: number): SusScore
declare function validate(sus: string): SusValidity
