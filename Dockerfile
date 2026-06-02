# Stage 1: Build the TypeScript application
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json tsconfig.json ./
RUN npm ci
COPY src ./src
COPY public ./public
RUN npm run build

# Stage 2: Run the production application
FROM node:20-alpine AS runner
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
ENV PORT=8080
EXPOSE 8080
CMD ["npm", "start"]
