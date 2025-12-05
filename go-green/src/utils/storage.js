export const STORAGE_KEYS = {
LEARNED_WORDS: 'calm_danish_learned_words',
LEARNED_COUNT: 'calm_danish_learned_count',
}


export function getLearnedWords() {
try {
const raw = localStorage.getItem(STORAGE_KEYS.LEARNED_WORDS)
return raw ? JSON.parse(raw) : []
} catch (e) {
console.error('Error reading learned words', e)
return []
}
}


export function saveLearnedWords(arr) {
try {
localStorage.setItem(STORAGE_KEYS.LEARNED_WORDS, JSON.stringify(arr))
} catch (e) {
console.error('Error saving learned words', e)
}
}


export function addLearnedWord(id) {
const arr = getLearnedWords()
if (!arr.includes(id)) {
arr.push(id)
saveLearnedWords(arr)
}
}


export function getLearnedCount() {
return getLearnedWords().length
}