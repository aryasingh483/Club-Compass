# ☁️ ClubCompass GCP Deployment Guide (Free Tier)

This guide provides a step-by-step plan to deploy ClubCompass to Google Cloud Platform (GCP) while staying strictly within the **Free Tier** and **$300 credit limits**.

**Confidence Score:** 95/100 (Based on standard GCP architecture for students).

---

## 🏗️ Architecture Overview

To maximize free credits and performance, we use a hybrid "Serverless + VM" approach:

1.  **Frontend (Next.js):** **Cloud Run** (Serverless). Scales to zero.
2.  **Backend (FastAPI):** **Cloud Run** (Serverless). Scales to zero.
3.  **Database & Cache:** **Google Compute Engine (GCE) `e2-micro` VM**.
    *   *Why?* Cloud SQL costs ~$10/mo minimum. The `e2-micro` VM is **Always Free** (in `us-central1`, `us-west1`, or `us-east1`) and can host both Postgres and Redis via Docker Compose.

---

## 💰 Cost Analysis (Estimated)

| Service | Tier | Estimated Cost |
| :--- | :--- | :--- |
| **Compute Engine** (`e2-micro`) | Always Free (1 instance/mo) | $0.00 |
| **Cloud Run** | Free Tier (2M req/mo) | $0.00 |
| **Artifact Registry** | 0.5 GB Storage Free | ~$0.10/mo (if > 0.5GB) |
| **Network Egress** | 1 GB Free | $0.00 |
| **Total** | | **< $1.00 / month** |

---

## 🚀 Deployment Plan

### Phase 0: Prerequisites & Safety

1.  **Install GCP CLI:** Ensure `gcloud` is installed and authenticated (`gcloud auth login`).
2.  **Set Project:**
    ```bash
    gcloud config set project <YOUR_PROJECT_ID>
    ```
3.  **Enable APIs:**
    ```bash
    gcloud services enable run.googleapis.com \
                           compute.googleapis.com \
                           artifactregistry.googleapis.com
    ```
4.  **🛑 IMPORTANT: Set Budget Alerts**
    *   Go to **Billing** > **Budgets & alerts**.
    *   Create a budget for **$1.00**.
    *   Set alerts at 50% and 100%. This ensures you are notified immediately if *anything* starts costing money.

---

### Phase 1: Container Preparation

We have already created production-optimized Dockerfiles for you:
*   Frontend: `frontend/Dockerfile.prod`
*   Backend: `backend/Dockerfile.prod`

1.  **Create Artifact Registry Repository:**
    ```bash
    gcloud artifacts repositories create clubcompass-repo \
        --repository-format=docker \
        --location=us-central1 \
        --description="Docker repository for ClubCompass"
    ```

2.  **Build & Push Images:**

    **Backend:**
    ```bash
    gcloud builds submit --tag us-central1-docker.pkg.dev/<YOUR_PROJECT_ID>/clubcompass-repo/backend:latest -f backend/Dockerfile.prod backend/
    ```

    **Frontend:**
    ```bash
    gcloud builds submit --tag us-central1-docker.pkg.dev/<YOUR_PROJECT_ID>/clubcompass-repo/frontend:latest -f frontend/Dockerfile.prod frontend/
    ```

---

### Phase 2: Database & Redis (The "Always Free" VM)

We will provision a small VM to host Postgres and Redis.

1.  **Create the VM:**
    *   **Region:** `us-central1` (Critical for Free Tier).
    *   **Machine Type:** `e2-micro`.
    *   **Disk:** Standard Persistent Disk, 30GB.
    *   **Tags:** `db-server`.

    ```bash
    gcloud compute instances create clubcompass-db \
        --zone=us-central1-a \
        --machine-type=e2-micro \
        --image-family=cos-stable \
        --image-project=cos-cloud \
        --tags=db-server,http-server,https-server
    ```
    *Note: We use Container-Optimized OS (COS) for better performance with Docker.*

2.  **Configure Firewall:**
    Allow traffic to Postgres (5432) and Redis (6379). **WARNING:** In a real enterprise, we would whitelist IPs. Since Cloud Run IPs change, we will allow all IPs but rely on **STRONG PASSWORDS**.

    ```bash
    gcloud compute firewall-rules create allow-postgres-redis \
        --direction=INGRESS \
        --priority=1000 \
        --network=default \
        --action=ALLOW \
        --rules=tcp:5432,tcp:6379 \
        --source-ranges=0.0.0.0/0 \
        --target-tags=db-server
    ```

3.  **Deploy DB & Redis to VM:**
    We need to SSH into the VM and run the docker container. Since we are using COS, we can just run the containers directly or use `cloud-init`. For simplicity, we will SSH.

    *Generate a strong password:*
    ```bash
    # Run this locally to generate a password
    openssl rand -hex 16
    # Example output: a1b2c3d4... (Save this!)
    ```

    *SSH into VM:*
    ```bash
    gcloud compute ssh clubcompass-db --zone=us-central1-a
    ```

    *Inside VM (Run these commands):*
    ```bash
    # Create a volume directory
    mkdir -p /home/chronos/user/postgres_data
    mkdir -p /home/chronos/user/redis_data

    # Run Postgres
    docker run -d \
      --name postgres \
      --restart always \
      -e POSTGRES_USER=postgres \
      -e POSTGRES_PASSWORD=<YOUR_GENERATED_PASSWORD> \
      -e POSTGRES_DB=clubcompass \
      -p 5432:5432 \
      -v /home/chronos/user/postgres_data:/var/lib/postgresql/data \
      postgres:15-alpine

    # Run Redis
    docker run -d \
      --name redis \
      --restart always \
      -p 6379:6379 \
      -v /home/chronos/user/redis_data:/data \
      redis:7-alpine redis-server --requirepass <YOUR_GENERATED_PASSWORD>
    ```
    *Exit SSH.*

4.  **Get VM Public IP:**
    ```bash
    gcloud compute instances describe clubcompass-db --zone=us-central1-a --format='get(networkInterfaces[0].accessConfigs[0].natIP)'
    ```
    *Save this IP. Let's call it `DB_IP`.*

---

### Phase 3: Application Deployment (Cloud Run)

Now we deploy the apps, connecting them to the VM.

1.  **Deploy Backend:**

    ```bash
    gcloud run deploy clubcompass-backend \
        --image=us-central1-docker.pkg.dev/<YOUR_PROJECT_ID>/clubcompass-repo/backend:latest \
        --region=us-central1 \
        --allow-unauthenticated \
        --set-env-vars="DATABASE_URL=postgresql://postgres:<YOUR_GENERATED_PASSWORD>@<DB_IP>:5432/clubcompass" \
        --set-env-vars="REDIS_URL=redis://:<YOUR_GENERATED_PASSWORD>@<DB_IP>:6379" \
        --set-env-vars="SECRET_KEY=production-secret-key-change-me" \
        --set-env-vars="ENVIRONMENT=production" \
        --set-env-vars="ALLOWED_ORIGINS=*" \
        --memory=512Mi
    ```
    *Note: `ALLOWED_ORIGINS=*` is temporary. We will update it after frontend deployment.*
    *Save the Backend URL.*

2.  **Deploy Frontend:**

    ```bash
    gcloud run deploy clubcompass-frontend \
        --image=us-central1-docker.pkg.dev/<YOUR_PROJECT_ID>/clubcompass-repo/frontend:latest \
        --region=us-central1 \
        --allow-unauthenticated \
        --set-env-vars="NEXT_PUBLIC_API_URL=<BACKEND_URL>/api/v1" \
        --set-env-vars="NEXT_PUBLIC_SITE_URL=https://<FRONTEND_URL>" \
        --memory=512Mi
    ```

3.  **Update Backend CORS:**
    Now that you have the Frontend URL, update the Backend to only allow that origin.

    ```bash
    gcloud run services update clubcompass-backend \
        --region=us-central1 \
        --set-env-vars="ALLOWED_ORIGINS=https://<YOUR_FRONTEND_URL>"
    ```

---

## 🧹 Maintenance & Cleanup

1.  **Database Backups:**
    Since we are using a VM, **you are responsible for backups**.
    *   Manual: SSH in and run `pg_dump`.
    *   Automated: Create a cron job on the VM to dump to a GCS bucket.
2.  **Stop Services:**
    To pause billing/credits usage:
    ```bash
    gcloud compute instances stop clubcompass-db --zone=us-central1-a
    # Cloud Run scales to zero automatically, so no cost when not used.
    ```
3.  **Clean Registry:**
    Delete old Docker images occasionally to save storage costs.
    ```bash
    gcloud artifacts docker images list us-central1-docker.pkg.dev/<YOUR_PROJECT_ID>/clubcompass-repo/backend
    # Delete old tags
    ```

---

## 🛠️ Infrastructure as Code (Optional - Terraform)

If you prefer Terraform, create a `main.tf`:

```hcl
provider "google" {
  project = "<YOUR_PROJECT_ID>"
  region  = "us-central1"
}

resource "google_compute_instance" "db" {
  name         = "clubcompass-db"
  machine_type = "e2-micro"
  zone         = "us-central1-a"
  tags         = ["db-server"]

  boot_disk {
    initialize_params {
      image = "cos-cloud/cos-stable"
    }
  }

  network_interface {
    network = "default"
    access_config {} // Public IP
  }
}

resource "google_compute_firewall" "db_access" {
  name    = "allow-db-access"
  network = "default"
  allow {
    protocol = "tcp"
    ports    = ["5432", "6379"]
  }
  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["db-server"]
}
```