# Conan Researcher
![Screenshot 2025-04-01 at 12 52 23 AM](https://github.com/user-attachments/assets/2f11d77a-4d24-4c98-92d1-468272d60fe3)

![Screenshot 2025-04-01 at 12 51 58 AM](https://github.com/user-attachments/assets/35bc5c45-3d47-44d6-b92e-948af919d59d)

A sophisticated data extraction and analysis system with web scraping capabilities, built with FastAPI backend and a modern frontend.

## Architecture Overview

Conan Researcher is designed as a microservices architecture with containerized components:

```
┌────────────┐     ┌────────────┐     ┌────────────┐
│  Frontend  │────▶│  Backend   │────▶│  Database  │
│  (Next.js) │     │  (FastAPI) │     │ (Postgres) │
└────────────┘     └────────────┘     └────────────┘
                         │
                         ▼
                   ┌────────────┐     ┌────────────┐
                   │ Vector DB  │     │    Ray     │
                   │  (Chroma)  │     │ (Parallel) │
                   └────────────┘     └────────────┘
```

## Key Features

- **Web Scraping**: Extract structured data from various websites
- **Real Estate Analysis**: Specialized data extraction for real estate listings
- **Parallel Processing**: Ray integration for scalable workloads
- **Vector Database**: Chroma integration for similarity search
- **Admin Interface**: PGAdmin for database management

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Python 3.9+ (for local development)
- Node.js (for local frontend development)

### Quick Start with Docker

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/conan-researcher.git
   cd conan-researcher
   ```

2. Set up environment variables:
   ```bash
   cp backend/.env.dist backend/.env
   # Edit backend/.env if needed
   ```

3. Start the services:
   ```bash
   docker-compose up -d
   ```

4. Access the services:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000/docs
   - PGAdmin: http://localhost:5050 (login with admin@admin.com / admin)

### Local Development

#### Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the application:
   ```bash
   uvicorn app.main:app --reload
   ```

#### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Scraping API
- `POST /api/scrape/`: Start a new scraping job
  - Expects a `ScraperRun` object with URLs and parameters
  - Returns extracted data or error information

## Configuration

### Environment Variables

Key environment variables defined in `.env.dist`:

| Variable | Description |
|----------|-------------|
| POSTGRES_USER | Database username |
| POSTGRES_PASSWORD | Database password |
| POSTGRES_DB | Database name |
| CHROMA_HOST_ADDR | Vector database host |
| CHROMA_HOST_PORT | Vector database port |
| TWITTER_TOKEN | API token for Twitter scraper |

## Project Structure

```
conan-researcher/
├── backend/                # FastAPI backend
│   ├── app/
│   │   ├── api/            # API endpoints
│   │   ├── agents/         # Extraction agents
│   │   │   └── scrapegraph_agent/
│   │   │       └── prompts.py
│   │   ├── core/           # Core functionality
│   │   ├── crud/           # Database operations
│   │   ├── models/         # Data models
│   │   └── services/       # Business logic
│   ├── migrations/         # Database migrations
│   └── .env.dist           # Environment variables template
├── frontend/               # Next.js frontend
├── data/                   # Persistent data storage
└── docker-compose.yaml     # Docker services configuration
```

## Development

### Adding New Scrapers

1. Create a new scraper agent in `backend/app/agents/`
2. Implement extraction logic in a service class
3. Register the new agent in the ScrapeService class
4. Add any new environment variables to `.env.dist`

### Testing

Run backend tests:
```bash
cd backend
pytest
```

## Troubleshooting

### Common Issues

- **Database connection errors**: Verify PostgreSQL container is running and credentials are correct
- **Chroma connection issues**: Check if the Chroma vector database is accessible
- **Scraper failures**: Check logs for specific error messages

View logs for any service:
```bash
docker-compose logs -f [service_name]
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributors

- Lead Developer: Alejandro Sánchez Yalí
- [Contributors welcome!]
