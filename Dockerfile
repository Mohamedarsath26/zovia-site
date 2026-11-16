# ---- stage 1: build the React app ----
FROM node:24-alpine AS build
WORKDIR /app

# Copy manifests first so this layer is cached unless dependencies change.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---- stage 2: serve the built files ----
# Node is not needed at runtime. Only the static files ship.
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
