import { Groq } from 'groq-sdk';

const SUMMARY_PROMPT = `You are an expert meeting summarizer. Analyze the following transcript and create a comprehensive summary that includes:

1. Key Points
- Main topics discussed
- Important decisions made
- Action items and next steps

2. Participants
- Identify speakers and their roles (if mentioned)
- Note any key contributions

3. Timeline
- Highlight important timestamps
- Structure the discussion chronologically

4. Follow-ups
- List any scheduled follow-up meetings
- Note deadlines mentioned
- Capture assigned tasks and responsibilities

Format the summary in a clear, professional structure using markdown.
Keep the summary concise but comprehensive.

Transcript:
`;

const TIMESTAMPED_SUMMARY_PROMPT = `You are an expert meeting summarizer. Analyze the following timestamped transcript and create a comprehensive summary that includes:

1. Key Points (with timestamps)
- Main topics discussed and when they occurred
- Important decisions made and their timing
- Action items and next steps with specific time references

2. Participants
- Identify speakers and their roles
- Note key contributions with timestamps

3. Timeline
- Create a chronological breakdown of the discussion
- Reference specific timestamps for important moments
- Highlight key transitions in the conversation

4. Follow-ups
- List scheduled follow-up meetings with any mentioned dates/times
- Note deadlines with specific timestamps
- Capture assigned tasks with timing context

Use the timestamps to create a precise, chronological summary.
Format the summary in markdown with clear timestamp references.

Timestamped Transcript:
`;

export async function generateTranscriptSummary(content: string, mode: 'text' | 'timestamps' = 'text') {
  const groq = new Groq({
    apiKey: import.meta.env.VITE_GROQ_API_KEY,
    dangerouslyAllowBrowser: true
  });

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert meeting summarizer who creates clear, actionable summaries.'
        },
        {
          role: 'user',
          content: (mode === 'timestamps' ? TIMESTAMPED_SUMMARY_PROMPT : SUMMARY_PROMPT) + content
        }
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.3,
      max_tokens: 4000,
    });

    return completion.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Error generating summary:', error);
    throw new Error('Failed to generate summary');
  }
}