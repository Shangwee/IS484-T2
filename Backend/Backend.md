
# Flask-Based News and Sentiment Analysis Tool

## Overview

This project is a Flask-based application that automates the ingestion, processing, and analysis of news.

## Features

- User Authentication: Secure registration, login, and session management using JWT.
- News Aggregation: Fetch and summarize news articles by entity.
- Sentiment Analysis: Provide sentiment scores for categorized news

## Tech Stack
Backend:
- Flask
- Flask-JWT-Extended (for authentication)
- SQLAlchemy (ORM for database management)
- Liquibase (for database migrations)

Database:
- PostgreSQL


## Project Structure

```
project/
├── app/
│   ├── models/               # Database models
│   ├── routes/               # API endpoints (blueprints)
│   ├── services/             # Business logic for data processing
│   ├── utils/                # Utility functions and helpers
│   ├── __init__.py           # Flask app initialization
│   └── config.py             # Configuration settings
├── migrations/               # Liquibase migration files
├── tests/                    # Unit and integration tests
├── .env                      # Environment variables
├── .gitignore                # exclude files from commit
├── Backend.md                # Project documentation
├── requirements.txt          # Python dependencies
└── run.py                    # Entry point for running the app
```

## Setup and Installation

1. Clone the Repository:
```
git clone https://github.com/Shangwee/IS484-T2
cd IS484-T2
```

2. install Dependencies:
```
pip install -r requirements.txt
```

3. Configure Environment Variables:
    - Create a `.env` file in the Backend directory:
    ```
    FLASK_ENV=development
    FLASK_APP=run.py
    SECRET_KEY=your_secret_key
    DATABASE_URI=postgresql+psycopg2://username:password@localhost:5432/your_database
    JWT_SECRET_KEY=your_jwt_secret_key
    LOG_LEVEL=DEBUG
    APP_DEBUG=True
    APP_PORT=5000
    ```

4. Run Database Migrations:
    - Ensure Liquibase is installed and configured
    - Navigate to the migrations directory:
    - run `Backend\migrations\db\create_db.sql` in postgres to create the Database
    - run migration: 
    ```
    liquibase update
    ```

5. Run application:
    - In the `Backend` directory:
    ```
    python .\run.py
    ```

## Contributions

1. Create a new branch
```
git checkout -b feature/your-feature-name
```

2. Commit changes
```
git commit -m "Add your message"
```

3. Push to the branch
```
git push origin feature/your-feature-name
```

4. Submit pull request

