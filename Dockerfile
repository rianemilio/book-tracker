FROM node:20-alpine

WORKDIR /app

# Copia os arquivos 
COPY package*.json ./

# Instala todas as dependências especificadas no package.json
RUN npm install

# Copia o restante do código fonte do projeto
COPY . .

# Expõe a porta padrão utilizada pelo Vite
EXPOSE 5173

# Comando para iniciar o servidor de desenvolvimento
CMD ["npm", "run", "dev"]
