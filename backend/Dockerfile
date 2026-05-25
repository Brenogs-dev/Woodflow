FROM node:18-alpine

# Criar usuário não-root para segurança
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

COPY package*.json ./
RUN npm ci --ignore-scripts --omit=dev

COPY . .

# Remover arquivos sensíveis desnecessários
RUN rm -f .env

# Usar usuário não-root
USER appuser

EXPOSE 3001

CMD ["node", "src/server.js"]
