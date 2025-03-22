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
  },
  {
    id: uuidv4(),
    title: "Product Strategy Meeting",
    original_filename: "product-strategy-2025-03-18.mp3",
    content: `
[00:00:00] Alex (Product Manager): Welcome to our Q2 product strategy session.
[00:02:15] Rachel (UX): User research shows three main pain points.
[00:05:30] David (Engineering): We can address these with our new architecture.
[00:10:45] Alex: Let's prioritize the mobile experience.
[00:15:20] Rachel: I have some wireframes ready to share.
    `,
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    duration: 1800,
    language: "english"
  },
  {
    id: uuidv4(),
    title: "Marketing Campaign Review",
    original_filename: "marketing-review-2025-03-15.mp3",
    content: `
[00:00:00] Lisa (Marketing): Let's review our Q1 campaign performance.
[00:03:20] Tom (Analytics): Social media engagement is up 45%.
[00:07:15] Lisa: Great results! What about the email campaigns?
[00:09:30] Tom: Open rates increased to 28%, above industry average.
[00:12:45] Lisa: Perfect, let's double down on what's working.
    `,
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    duration: 900,
    language: "english"
  }
];