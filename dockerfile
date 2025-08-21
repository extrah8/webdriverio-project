FROM node:20-bullseye-slim

# ====== System dependencies ======
RUN apt-get update && apt-get install -y \
    wget gnupg ca-certificates unzip fontconfig curl bzip2 xvfb git \
    firefox-esr \
    && rm -rf /var/lib/apt/lists/*

# ====== Install Google Chrome ======
RUN wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | gpg --dearmor -o /usr/share/keyrings/google-linux.gpg \
    && echo "deb [arch=amd64 signed-by=/usr/share/keyrings/google-linux.gpg] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list \
    && apt-get update && apt-get install -y google-chrome-stable \
    && rm -rf /var/lib/apt/lists/*

# ====== Install Allure CLI ======
RUN npm install -g allure-commandline --unsafe-perm=true

# ====== Workdir ======
WORKDIR /app

# copy package.json for dependency caching
COPY package*.json ./

RUN npm ci

# copy project files
COPY . .

ENV CI=true \
    FORCE_COLOR=1 \
    BASE_URL=https://demoqa.com

CMD ["npm", "run", "test:chromium"]