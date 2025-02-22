FROM python:3-slim
WORKDIR /usr/src/app
COPY requirements.txt ./
RUN python -m pip install --no-cache-dir -r requirements.txt
RUN crawl4ai-setup
COPY . .
CMD [ "python", "./run.py" ]