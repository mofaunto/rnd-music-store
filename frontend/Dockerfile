FROM node:20-alpine
WORKDIR /app
RUN mkdir -p /app/node_modules
COPY package.json package-lock.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "dev", "--", "--host"]