FROM node:22-bookworm

WORKDIR /workspace

COPY package-lock.json ./
COPY docker/playwright/get-playwright-version.sh ./

RUN npx --yes "playwright@$(sh get-playwright-version.sh)" install --with-deps chromium
