FROM node:20-alpine

WORKDIR /app

# Copia dependências e instala
COPY package*.json ./
RUN npm install

# Copia o código fonte
COPY . .

# Recebe a URL da API no build
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Build de produção do Next.js
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
