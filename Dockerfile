# Usa a imagem oficial do Node 20.19.5
FROM node:20.19.5

# Define o diretório de trabalho dentro do container
WORKDIR /backend

# Copia os arquivos de dependências
COPY package.json package-lock.json* ./

# Instala as dependências
RUN npm install

# Copia todo o restante do projeto
COPY . .

# Expõe a porta usada pela sua aplicação (mude se necessário)
EXPOSE 3000

# Comando para rodar a aplicação
CMD ["node", "server.js"]
