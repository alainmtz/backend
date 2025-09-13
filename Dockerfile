FROM node:20-slim

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y \
    bash \
    netcat-openbsd \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install

COPY . .

RUN chmod +x ./entrypoint.sh
ENTRYPOINT ["./entrypoint.sh"]

EXPOSE 4000
CMD ["node", "src/index.js"]
