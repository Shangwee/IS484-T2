FROM python:3-slim

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

# # Run the custom setup script if necessary
# RUN crawl4ai-setup

# Set NLTK data path and download punkt
ENV NLTK_DATA=/root/nltk_data
RUN python -c "import nltk; nltk.download('punkt_tab', download_dir='/root/nltk_data')"


# Add this to prevent tokenizer fork warning
ENV TOKENIZERS_PARALLELISM=false

# Optional: download and cache FinBERT to avoid online fetching at runtime
RUN python -c "from transformers import AutoTokenizer, AutoModelForSequenceClassification; \
               AutoTokenizer.from_pretrained('yiyanghkust/finbert-tone'); \
               AutoModelForSequenceClassification.from_pretrained('yiyanghkust/finbert-tone')"

# Copy application files
COPY . .

# Set the command to run the application
CMD ["python", "./run.py"]
