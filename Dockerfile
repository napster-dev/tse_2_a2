FROM node:18

WORKDIR /app

# Install Node dependencies
COPY app/package.json .
RUN npm install

# Copy app and tests
COPY app/ .
COPY tests/ /tests/

# Install Python and Selenium for running tests
RUN apt-get update && apt-get install -y python3 python3-pip wget unzip curl gnupg \
 && wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb \
 && apt install -y ./google-chrome-stable_current_amd64.deb \
 && pip3 install selenium

# Start the app and run tests (optional - use ENTRYPOINT in Jenkins instead)
EXPOSE 3000
CMD ["npm", "start"]
