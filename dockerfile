# Base image
FROM node:20-bullseye-slim

# ===== System dependencies =====
RUN apt-get update && apt-get install -y --no-install-recommends \
    wget gnupg ca-certificates unzip fontconfig curl bzip2 xvfb git \
    firefox-esr \
 && rm -rf /var/lib/apt/lists/*

# ===== Google Chrome =====
RUN wget -qO- https://dl.google.com/linux/linux_signing_key.pub | gpg --dearmor -o /usr/share/keyrings/google-linux.gpg \
 && echo "deb [arch=amd64 signed-by=/usr/share/keyrings/google-linux.gpg] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list \
 && apt-get update && apt-get install -y --no-install-recommends google-chrome-stable \
 && rm -rf /var/lib/apt/lists/*

# ===== Java (required by Allure CLI) =====
RUN apt-get update && apt-get install -y --no-install-recommends openjdk-17-jre-headless \
 && rm -rf /var/lib/apt/lists/*
ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
ENV PATH="$JAVA_HOME/bin:${PATH}"

# ===== Dependency cache =====
COPY package*.json ./
RUN npm install

# ===== Project files =====
COPY . .

# ===== Environment =====
ENV CI=true \
    FORCE_COLOR=1 \
    BASE_URL=https://demoqa.com \
    CHROME_BIN=/usr/bin/google-chrome-stable \
    CHROME_PATH=/usr/bin/google-chrome-stable

# ===== Port for allure open =====
EXPOSE 5050

# ===== Start sequence =====
# 1) Run tests
# 2) Always generate Allure report
# 3) Serve the report on :5050
#    - Keeps container running for local viewing
#    - Exit code of container equals the test exit code
# CMD ["sh", "-lc", "npm run test; code=$?; npm run allure:generate  true; exit $code"]

# ===== Alternative for CI (no web server) =====
CMD ["sh", "-lc", "npm run test; code=$?; npm run allure:generate  true; exit $code"]