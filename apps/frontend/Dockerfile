FROM node:20-alpine

WORKDIR /app

# install only deps
COPY package*.json ./
RUN npm install --omit=dev

# copy built app + source
COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]