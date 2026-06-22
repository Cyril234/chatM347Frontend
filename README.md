# Chattrix – Frontend (M347)

Frontend für die Chattrix-Microservices-Chatanwendung. React + TypeScript + Vite + MUI.
Funktionen: Registrierung/Login/Logout, Chatliste, 1:1- und Gruppenchats, Echtzeit-Nachrichten
über WebSocket, Chat erstellen/löschen, Konto-Einstellungen, Hell-/Dunkel-Design.

## Schnellstart (lokale Entwicklung)

Voraussetzung: das Backend läuft lokal mit erreichbarem **Gateway auf `:8080`** und
**Websocket-Service auf `:3004`**.

```bash
npm install
npm run dev      # http://localhost:5173
```

Der Vite-Dev-Server (`vite.config.ts`) proxyt automatisch:

| Pfad         | Ziel                          | Zweck                        |
|--------------|-------------------------------|------------------------------|
| `/auth/*`    | `http://localhost:8080`       | Authentifizierung (Gateway)  |
| `/users/*`   | `http://localhost:8080`       | User-Endpunkte (Gateway)     |
| `/ws/chat`   | `ws://localhost:3004`         | WebSocket (Websocket-Service) |

Dadurch laufen alle Requests im Browser **same-origin** (`localhost:5173`): die httpOnly-Auth-Cookies
werden als first-party mitgesendet und es gibt **keine CORS-Probleme**. Laufen Gateway/Websocket auf
anderen Ports, die Targets in `vite.config.ts` anpassen.

## Skripte

```bash
npm run dev       # Dev-Server mit HMR
npm run build     # Typecheck (tsc -b) + Produktions-Build nach dist/
npm run lint      # ESLint
npm run preview   # gebautes dist/ lokal ausliefern
```

## Konfiguration (Umgebungsvariablen)

Die Basis-URLs sind konfigurierbar. Die Namen entsprechen den Build-Args des Dockerfiles/der CI:

| Variable            | Bedeutung                              | Dev-Default              |
|---------------------|----------------------------------------|--------------------------|
| `VITE_GATEWAY_URL`  | Basis-URL für REST (`/auth`, `/users`) | leer → same-origin/Proxy |
| `VITE_WS_URL`       | Basis-URL für das WebSocket            | leer → aus `window.location` (`/ws/chat`) |

- **Dev**: in `.env` leer lassen → der Dev-Proxy übernimmt das Routing.
- **Produktion**: werden beim Docker-Build via `--build-arg` gesetzt (gespeist aus den CI-Secrets
  `PUBLIC_URL` / `PUBLIC_WS_URL`). `VITE_WS_URL` darf mit oder ohne `/chat` enden – das `/chat`
  wird bei Bedarf automatisch ergänzt.

## Backend-Vertrag (Kurzreferenz)

**REST (Gateway)** – Antworten: `{ success, message, data }`; Auth via httpOnly-Cookies
(`accessToken` 60 min, `refreshToken` 14 d), daher immer `credentials: "include"`.

- `POST /auth/register` `{ email, password, username }`
- `POST /auth/login` `{ email, password }` · `POST /auth/refresh` · `POST /auth/logout`
- `GET /users/one` (eigener User, dient als Session-Check) · `GET /users/all`
- `PATCH /users/edit/username` · `PATCH /users/edit/credential` · `DELETE /users/delete`

Validierung (Frontend gespiegelt): E-Mail gültig ≤255; Passwort 8–64 + je ≥1 Gross/Klein/Ziffer;
Username 3–30, nur `[a-zA-Z0-9_]`.

**WebSocket** – rohes WS (kein STOMP) am Handler `/ws/chat`, Auth über das `accessToken`-Cookie
beim Handshake. Client→Server-Nachrichten mit Feld `type`
(`CREATE_CHAT`, `GET_CHATS`, `GET_CHAT_MESSAGES`, `CREATE_MESSAGE`, `DELETE_CHAT`, `EDIT_CHAT`, `GET_CHAT`).
Die Server→Client-Events tragen **kein** `type`-Feld und werden anhand ihrer Feld-Form unterschieden
(siehe `src/types/ws.ts`).

## Projektstruktur (`src/`)

```
config.ts                URL-Konfiguration (REST-Basis + WS-URL)
api/        http.ts (fetch-Wrapper inkl. 401→refresh), auth.ts, users.ts
types/      api.ts (DTOs), ws.ts (WS-Nachrichten + Parser)
context/    AuthProvider, ChatProvider (Reducer + WebSocket), ColorModeProvider
routes/     ProtectedRoute
pages/      SignIn, SignUp, ChatPage
components/  chat/ (ChatList, ChatView, MessageList, MessageBubble, ChatInput, NewChatDialog)
             settings/ (AccountDialog), common/ (AuthLayout, UserAvatar)
```

## Docker

Die beiden Dockerfiles (`Dockerfile`, `production/Dockerfile`) bleiben unverändert. Der Produktions-Build
nutzt `VITE_GATEWAY_URL` und `VITE_WS_URL` als Build-Args.

## ⚠️ Hinweis zum Deployment (Backend-Infrastruktur)

Im Backend-Repo routet der Caddy-Reverse-Proxy `/api/*` **und** `/ws/*` an `gateway-service:8080`
(`docker-compose-files/Caddyfile`). Damit das in Produktion funktioniert, muss die Infrastruktur
zwei Punkte erfüllen, die das Frontend nicht beeinflussen kann:

1. **REST-Pfad**: Der Gateway stellt `/auth/**` und `/users/**` bereit (nicht `/api/...`). Entweder
   muss der Proxy das `/api`-Präfix entfernen (z. B. Caddy `handle_path /api/*` + `uri strip_prefix`),
   oder `VITE_GATEWAY_URL` zeigt direkt auf den Gateway-Origin ohne `/api`.
2. **WebSocket**: `/ws/chat` muss an den **Websocket-Service `:3004`** geroutet werden (der Gateway
   selbst kann WebSocket nicht proxen). Im Caddyfile entsprechend `reverse_proxy websocket-service:3004`
   für `/ws/*` setzen.

Diese Anpassungen betreffen ausschliesslich die Backend-/Infra-Konfiguration. Das Frontend ist über
`VITE_GATEWAY_URL` / `VITE_WS_URL` so flexibel, dass es mit jeder korrekten Routing-Variante funktioniert.
