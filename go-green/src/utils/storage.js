import { supabase } from "./supabase"
import { getDeviceId } from "./device"

const deviceId = getDeviceId()

export async function getLearnedWords() {
  const { data, error } = await supabase
    .from("progress")
    .select("word_id")
    .eq("device_id", deviceId)

  if (error) {
    console.error(error)
    return []
  }

  return data.map(r => r.word_id)
}

export async function addLearnedWord(wordId) {
  const { error } = await supabase.from("progress").insert({
    device_id: deviceId,
    word_id: wordId
  })

  if (error && !error.message.includes("duplicate")) {
    console.error(error)
  }
}
