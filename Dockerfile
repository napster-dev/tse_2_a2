FROM node:18

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && \
    apt-get install -y python3 python3-pip python3-venv wget curl gnupg unzip && \
    wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb && \
    apt install -y ./google-chrome-stable_current_amd64.deb && \
    rm google-chrome-stable_current_amd64.deb

# Install Node.js dependencies
COPY app/package.json .
RUN npm install

# Install Python Selenium
RUN python3 -m venv /opt/venv \
    && /opt/venv/bin/pip install --upgrade pip \
    && /opt/venv/bin/pip install selenium pytest

ENV PATH="/opt/venv/bin:$PATH"

# Copy all application and test code
COPY app/ .
COPY tests/ /tests/

# Expose port for the app
EXPOSE 3000

# Default: Start app only
CMD ["npm", "start"]
