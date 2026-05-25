FROM node:18-alpine

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

COPY package*.json ./
RUN npm install --ignore-scripts --omit=dev

COPY . .

USER appuser

EXPOSE 3001

CMD ["node", "src/server.js"]
