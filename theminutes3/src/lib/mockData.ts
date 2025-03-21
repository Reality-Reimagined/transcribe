import { v4 as uuidv4 } from 'uuid';

export const mockTranscriptions = [
  {
    id: uuidv4(),
    title: "Weekly Team Sync",
    original_filename: "team-sync-2025-03-21.mp3",
    content: `
John (Project Manager): Good morning everyone! Let's go through our weekly updates.
[00:00:10] Sarah (Developer): I've completed the authentication module and started working on the API integration.
[00:01:15] Mike (Designer): The new dashboard mockups are ready for review.
[00:02:30] John: Great progress! Let's schedule a design review for tomorrow.
[00:03:45] Sarah: I'll need some clarification on the API requirements.
[00:04:20] John: Sure, let's discuss that after this meeting.
    `,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    duration: 300,
    language: "english",
    summary: `
# Meeting Summary

## Key Points
- Authentication module completed
- Dashboard mockups ready for review
- API integration in progress

## Action Items
1. Schedule design review meeting (Tomorrow)
2. Discuss API requirements (Post-meeting)

## Participants
- John (Project Manager)
- Sarah (Developer)
- Mike (Designer)
    `
  },
  {
    id: uuidv4(),
    title: "Client Presentation",
    original_filename: "client-meeting-2025-03-20.mp3",
    content: `
[00:00:00] Emma (Sales): Welcome everyone to our quarterly review.
[00:01:30] Client: We're excited to see the progress.
[00:02:45] Emma: Let me walk you through our achievements this quarter.
[00:15:20] Client: This looks promising. What's the timeline for the next phase?
[00:16:00] Emma: We're aiming to deliver by end of next month.
    `,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    duration: 1200,
    language: "english"
  }
];

// Comment out this code when not needed
export const injectMockData = async (supabase: any) => {
  try {
    const { data: org } = await supabase
      .from('organizations')
      .select('id')
      .single();

    if (!org) return;

    for (const transcription of mockTranscriptions) {
      await supabase
        .from('transcriptions')
        .upsert({
          ...transcription,
          org_id: org.id,
          created_by: (await supabase.auth.getUser()).data.user?.id
        });
    }
  } catch (error) {
    console.error('Error injecting mock data:', error);
  }
};

