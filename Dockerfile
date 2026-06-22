# ── Stage 1: Build ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS build

WORKDIR /app

# Erst nur package.json/lock kopieren -> Docker Layer Cache für npm install
COPY package*.json ./
RUN npm ci

COPY . .

# Vite Build-Variablen müssen zur BUILD-Zeit vorhanden sein (nicht erst zur Laufzeit!)
# Werden vom GitHub Actions Workflow als --build-arg übergeben
ARG VITE_GATEWAY_URL
ARG VITE_WS_URL
ENV VITE_GATEWAY_URL=${VITE_GATEWAY_URL}
ENV VITE_WS_URL=${VITE_WS_URL}

RUN npm run build

# ── Stage 2: Runtime (Nginx) ───────────────────────────────────────────────────
FROM nginx:1.27-alpine

# Statische Build-Dateien aus Stage 1 übernehmen
COPY --from=build /app/dist /usr/share/nginx/html

# Eigene Nginx-Konfiguration (SPA-Routing, siehe nginx.conf)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
