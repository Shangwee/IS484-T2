FROM python:3.10-slim

# Set the working directory
WORKDIR /usr/src/app

# Install required system dependencies
RUN apt-get update && apt-get install -y \
    g++ \
    gcc \
    libffi-dev \
    libssl-dev \
    build-essential \
    && rm -rf /var/lib/apt/lists/*  # Clean up to reduce image size

# Upgrade pip and install dependencies
COPY requirements.txt ./

RUN python -m pip install --upgrade pip && python -m pip install --no-cache-dir -r requirements.txt

RUN python -m spacy download "en_core_web_trf"

# RUN python -c "import nltk; nltk.download('punkt')"

# Run the custom setup script if necessary
RUN crawl4ai-setup

# Copy application files
COPY . .

# Set the command to run the application
CMD ["python", "./run.py"]
