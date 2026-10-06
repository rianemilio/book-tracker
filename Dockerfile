FROM node:22-alpine

WORKDIR /app

# Copia os arquivos 
COPY package*.json ./

# Instala as dependências exatamente como no package-lock.json
RUN npm ci

# Copia o restante do código fonte do projeto
COPY . .

# Expõe a porta padrão utilizada pelo Vite
EXPOSE 5173

# Comando para iniciar o servidor de desenvolvimento
CMD ["npm", "run", "dev"]
