# Deployment Guide — Google Cloud Run + Docker

This guide deploys the portfolio to **Google Cloud Run** as a Docker container: nginx serves the Vite build, with the exact response headers the site needs.

> ⚠️ **Why headers matter:** the Chess easter-egg widget uses Stockfish compiled to WebAssembly with threads, which requires `SharedArrayBuffer`. Browsers only enable that when the page sends `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Embedder-Policy: require-corp` — exactly what this guide configures. Without them the chess game crashes with `SharedArrayBuffer is not defined`.

---

## 🚀 Quick Start — Run Locally First

```bash
# 1. Install dependencies
npm install

# 2. Create .env with your build-time secrets (never commit this file)
#    VITE_EMAILJS_SERVICE_ID=...
#    VITE_EMAILJS_TEMPLATE_ID=...
#    VITE_EMAILJS_PUBLIC_KEY=...

# 3. Dev server → http://localhost:5173
npm run dev

# 4. Production build (outputs to dist/)
npm run build

# 5. Preview the production build
npm run preview
```

> **Note:** `VITE_*` variables are baked in at **build time**, not runtime. Whatever machine builds `dist/` (your laptop, Cloud Build, etc.) must have these set first.

---

## 🧰 Prerequisites

1. **Google Cloud project** with billing enabled.
2. **gcloud CLI** installed → <https://cloud.google.com/cli>
3. Authenticate and set defaults:

```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
gcloud config set compute region us-east1   # East US 1 region
```

4. Enable the APIs you need:

```bash
gcloud services enable run.googleapis.com artifactregistry.googleapis.com cloudbuild.googleapis.com
```

5. **Docker Desktop** (or a local Docker engine) for the manual build flow.

---

## 🐳 Option A — Explicit Docker build → Artifact Registry → Cloud Run

Full control over the image; mirrors a real CI pipeline.

### Step 1 — Create the deployment files

**`Dockerfile`** (repo root):

```dockerfile
# ---- Build stage ----
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_EMAILJS_SERVICE_ID
ARG VITE_EMAILJS_TEMPLATE_ID
ARG VITE_EMAILJS_PUBLIC_KEY
ENV VITE_EMAILJS_SERVICE_ID=$VITE_EMAILJS_SERVICE_ID \
    VITE_EMAILJS_TEMPLATE_ID=$VITE_EMAILJS_TEMPLATE_ID \
    VITE_EMAILJS_PUBLIC_KEY=$VITE_EMAILJS_PUBLIC_KEY
RUN npm run build

# ---- Serve stage ----
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
```

**`nginx.conf`** (repo root):

```nginx
server {
    listen 8080;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # COOP/COEP — required by the Stockfish WASM chess widget
    add_header Cross-Origin-Opener-Policy same-origin always;
    add_header Cross-Origin-Embedder-Policy require-corp always;

    # Long-cache immutable build assets (hashed filenames)
    location /assets/ {
        add_header Cache-Control "public, max-age=31536000, immutable";
        add_header Cross-Origin-Opener-Policy same-origin always;
        add_header Cross-Origin-Embedder-Policy require-corp always;
    }

    # WASM must be served with the right MIME type
    location ~* \.wasm$ {
        types { application/wasm wasm; }
        add_header Cache-Control "public, max-age=31536000, immutable";
        add_header Cross-Origin-Opener-Policy same-origin always;
        add_header Cross-Origin-Embedder-Policy require-corp always;
    }

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;
    gzip_min_length 1024;
}
```

### Step 2 — Push the image to Artifact Registry

```bash
# One-time: create the repository
gcloud artifacts repositories create portfolio \
  --repository-format=docker --location=us-east1

# One-time: let local docker authenticate
gcloud auth configure-docker us-east1-docker.pkg.dev

# Build (VITE_* vars are baked in at build time)
export REGION=us-east1
export PROJECT_ID=$(gcloud config get-value project)
export IMAGE=$REGION-docker.pkg.dev/$PROJECT_ID/portfolio/site:latest

docker build \
  --build-arg VITE_EMAILJS_SERVICE_ID=your_service_id \
  --build-arg VITE_EMAILJS_TEMPLATE_ID=your_template_id \
  --build-arg VITE_EMAILJS_PUBLIC_KEY=your_public_key \
  -t $IMAGE .

docker push $IMAGE
```

### Step 3 — Deploy to Cloud Run

```bash
gcloud run deploy portfolio \
  --image $IMAGE \
  --region us-east1 \
  --allow-unauthenticated \
  --ingress all \
  --cpu 1 --memory 512Mi \
  --min-instances 0 --max-instances 2 \
  --port 8080
```

You get a URL like `https://portfolio-xxxxxxxx-uc-a.run.app`. 🎉

---

## ⚡ Option B — One-command deploy (Cloud Build, no local Docker)

`gcloud run deploy --source .` builds the same Dockerfile in Cloud Build and deploys — handy when you don't have Docker installed:

```bash
gcloud run deploy portfolio \
  --source . \
  --region us-east1 \
  --allow-unauthenticated \
  --cpu 1 --memory 512Mi \
  --min-instances 0 --max-instances 2 \
  --port 8080 \
  --build-env VITE_EMAILJS_SERVICE_ID=your_service_id \
  --build-env VITE_EMAILJS_TEMPLATE_ID=your_template_id \
  --build-env VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

First run asks to enable APIs and create the Artifact Registry repo — answer **yes**.

---

## 🌐 Custom Domain + HTTPS

```bash
gcloud beta run domain-mappings create \
  --service portfolio \
  --domain vaibhavsoni.dev \
  --region us-east1
```

Add the DNS records it prints (A/AAAA or CNAME) at your registrar. Google-managed TLS certificates are issued automatically. Also update the `canonical` / `og:url` URLs in `index.html` to the final domain.

---

## 🔁 Re-deploying After Changes

```bash
# Option B flow
git pull && gcloud run deploy portfolio --source . --region us-east1 \
  --build-env VITE_EMAILJS_SERVICE_ID=... --build-env VITE_EMAILJS_TEMPLATE_ID=... \
  --build-env VITE_EMAILJS_PUBLIC_KEY=...

# Option A flow
docker build --build-arg ... -t $IMAGE . && docker push $IMAGE && \
gcloud run deploy portfolio --image $IMAGE --region us-east1
```

> **Tip:** keep the `VITE_*` values in a non-committed `.env.deploy` and `source` it, so secrets never land in shell history or git.

---

## 🤖 CI/CD with Cloud Build (optional)

Create a trigger connected to your GitHub repo so every push to `main` deploys:

1. Console → **Cloud Build → Triggers → Create trigger**.
2. Connect the repo, event: **Push to branch** `main`.
3. Use this **`cloudbuild.yaml`** (repo root):

```yaml
steps:
  - name: 'gcr.io/cloud-builders/docker'
    args:
      - build
      - --build-arg=VITE_EMAILJS_SERVICE_ID=${_VITE_EMAILJS_SERVICE_ID}
      - --build-arg=VITE_EMAILJS_TEMPLATE_ID=${_VITE_EMAILJS_TEMPLATE_ID}
      - --build-arg=VITE_EMAILJS_PUBLIC_KEY=${_VITE_EMAILJS_PUBLIC_KEY}
      - -t
      - us-east1-docker.pkg.dev/$PROJECT_ID/portfolio/site:$COMMIT_SHA
      - .
  - name: 'gcr.io/cloud-builders/docker'
    args:
      - push
      - us-east1-docker.pkg.dev/$PROJECT_ID/portfolio/site:$COMMIT_SHA
  - name: 'gcr.io/cloud-builders/gcloud'
    args:
      - run
      - deploy
      - portfolio
      - --image=us-east1-docker.pkg.dev/$PROJECT_ID/portfolio/site:$COMMIT_SHA
      - --region=us-east1
      - --allow-unauthenticated
substitutions:
  _VITE_EMAILJS_SERVICE_ID: ''
  _VITE_EMAILJS_TEMPLATE_ID: ''
  _VITE_EMAILJS_PUBLIC_KEY: ''
images:
  - us-east1-docker.pkg.dev/$PROJECT_ID/portfolio/site:$COMMIT_SHA
```

4. Add the three substitution values under the trigger's **Substitution variables** (mark them available to builds). Store them as **Secret Manager** secrets if you prefer not to inline them.

---

## 🔧 Troubleshooting

| Symptom | Cause / Fix |
|---------|-------------|
| `SharedArrayBuffer is not defined` in console | COOP/COEP headers missing — confirm `nginx.conf` is loaded and headers sent: `curl -sI https://YOUR_URL \| grep -i cross-origin` |
| Chess engine never loads | `.wasm` served with wrong MIME — the `location ~* \.wasm$` block must be present |
| Contact form fails with EmailJS error | `VITE_EMAILJS_*` were absent **at build time** — rebuild with the build args / `--build-env` |
| Blank page after deploy | Old cached index — hard refresh; verify `try_files` SPA fallback exists |
| 404 on `/assets/...` | `dist/` not copied correctly — check the `COPY --from=build` layer |
| Slow first load after idle | Cloud Run cold start (`min-instances 0`). Set `--min-instances 1` (~small monthly cost) if it bothers you |

---

## 💰 Cost & Cleanup

**Cost:** with `--min-instances 0` an idle portfolio is effectively free; a personal site's traffic stays well inside the Cloud Run always-free tier. Artifact Registry storage (~0.10 GB/image) is pennies.

**Tear it all down** when you no longer need it:

```bash
gcloud run services delete portfolio --region us-east1
gcloud artifacts repositories delete portfolio --location us-east1
```

---

## 📚 Additional Resources

- [Cloud Run docs](https://cloud.google.com/run/docs)
- [Deploying from source code](https://cloud.google.com/run/docs/deploying-source-code)
- [Custom domain mappings](https://cloud.google.com/run/docs/mapping-custom-domains)
- [Vite production build notes](https://vitejs.dev/guide/build.html)