/**
 * Play Japanese audio for the given text using the Web Speech API.
 * @param text The text to speak.
 */
export const playAudio = (text: string) => {
  if (!('speechSynthesis' in window)) {
    console.warn('Text-to-speech not supported in this browser.');
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ja-JP';
  
  // Optional: Adjust rate and pitch if needed
  utterance.rate = 0.9;
  utterance.pitch = 1.0;

  window.speechSynthesis.speak(utterance);
};
