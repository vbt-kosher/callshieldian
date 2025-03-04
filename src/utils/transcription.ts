
// This is a mock implementation of call transcription functionality
// In a real application, this would integrate with a speech-to-text service
// like Google Cloud Speech-to-Text, Azure Speech, or similar

interface TranscriptionResult {
  text: string;
  confidence: number;
}

export const transcribeAudio = async (audioData: string): Promise<TranscriptionResult> => {
  // Mock implementation - in a real app, this would call a speech-to-text API
  console.log('Transcribing audio data...', audioData.substring(0, 50) + '...');
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Generate a random mock transcription in Hebrew and English
  const mockTranscriptions = [
    "שלום, אני מתקשר בנוגע למנוי שלך לשירות החדשות שלנו. יש לנו הצעה מיוחדת עבורך היום.",
    "תודה שהתקשרת למערכת האוטומטית שלנו. הקש 1 למכירות, הקש 2 לתמיכה, או המתן על הקו.",
    "המשחק אתמול היה מדהים! ראית את השער בדקה האחרונה? הפרשנים הספורטיביים השתגעו.",
    "רציתי להודיע לך על שירות התוכן הפרימיום שלנו שיש לו חיוב חודשי שיתווסף לחשבון שלך.",
    "זוהי שיחה רגילה ללא תוכן ספציפי שיפעיל את הפילטרים שלנו.",
    "שלום, זוהי שיחת מעקב שגרתית כדי לאשר את הפגישה שלך לשבוע הבא.",
    "Hi there, I'm calling about your subscription to our news service. We have a special offer for you today.",
    "Thank you for calling our automated system. Press 1 for sales, press 2 for support, or stay on the line.",
    "The game last night was amazing! Did you see that last-minute goal? The sports commentators went wild.",
    "I wanted to let you know about our premium content service that has a monthly charge added to your bill.",
    "This is a normal call with no specific content that would trigger our filters.",
    "Hello, this is just a routine follow-up call to confirm your appointment for next week."
  ];
  
  const randomIndex = Math.floor(Math.random() * mockTranscriptions.length);
  
  return {
    text: mockTranscriptions[randomIndex],
    confidence: 0.85 + (Math.random() * 0.1) // Random confidence between 0.85 and 0.95
  };
};

export const getRandomTranscriptionExcerpt = (): string => {
  const excerpts = [
    "שלום, אני מתקשר בנוגע למנוי שלך לשירות החדשות שלנו...",
    "תודה שהתקשרת למערכת האוטומטית שלנו. הקש 1 למכירות...",
    "המשחק אתמול היה מדהים! ראית את השער בדקה האחרונה?...",
    "רציתי להודיע לך על שירות התוכן הפרימיום שלנו...",
    "זוהי שיחה רגילה ללא תוכן ספציפי שיפעיל את הפילטרים שלנו...",
    "שלום, זוהי שיחת מעקב שגרתית כדי לאשר את הפגישה שלך...",
    "Hi there, I'm calling about your subscription to our news service...",
    "Thank you for calling our automated system. Press 1 for sales...",
    "The game last night was amazing! Did you see that last-minute goal?...",
    "I wanted to let you know about our premium content service...",
    "This is a normal call with no specific content that would trigger our filters...",
    "Hello, this is just a routine follow-up call to confirm your appointment..."
  ];
  
  return excerpts[Math.floor(Math.random() * excerpts.length)];
};
