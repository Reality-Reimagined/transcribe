# The Minutes - AI-Powered Meeting Transcription

The Minutes is a powerful meeting transcription application that uses AI to convert audio recordings into searchable, shareable documents. Built with modern web technologies and designed for ease of use, it helps teams capture and organize their meeting content effectively.

## Features

- **AI-Powered Transcription**: Convert audio to text with high accuracy
- **Multiple View Modes**:
  - Text: Clean, readable transcripts
  - Segments: Time-stamped sections
  - Words: Word-by-word timing
- **Smart Summaries**: AI-generated meeting summaries with key points and action items
- **Export Options**: Download transcripts in multiple formats (TXT, MD, PDF)
- **Team Collaboration**: Share transcriptions within your organization
- **API Access**: Integrate transcription capabilities into your workflow

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Supabase
- **AI/ML**: Groq API for transcription and summarization
- **Authentication**: Supabase Auth
- **Database**: PostgreSQL (via Supabase)
- **UI Components**: Custom components with Framer Motion animations

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_GROQ_API_KEY=your_groq_api_key
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Setup

The application requires the following environment variables:

- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `VITE_GROQ_API_KEY`: Your Groq API key for AI features

## Database Schema

The application uses the following main tables:

- `profiles`: User profiles
- `organizations`: Organization management
- `transcriptions`: Stored transcriptions
- `api_keys`: API key management

## API Integration

The Minutes provides API access for integration with other tools:

1. Generate an API key in the Connections page
2. Use the key to authenticate API requests
3. Access transcription features programmatically

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support, please open an issue in the GitHub repository or contact our support team.