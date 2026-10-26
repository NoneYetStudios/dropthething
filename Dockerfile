FROM node:22-alpine

WORKDIR /app

COPY package.json ./
COPY schema.sql ./
COPY scripts ./scripts
COPY backend ./backend
COPY frontend ./frontend

RUN node scripts/build.js

ENV NODE_ENV=production
ENV PORT=3000
ENV DB_PATH=/data/dropthething.db

EXPOSE 3000

CMD ["node", "backend/server.js"]
