# URL Shortener on Kubernetes

A full-stack URL shortening service with analytics, campaign management, and role-based access control. Deployed on Kubernetes using Kustomize for multi-environment configuration management.

> Frontend originally developed by [Nghi and Dat](https://github.com/integration-project-hk241/url-shortener-fe)  
> Backend originally developed by [Phan Quoc Khai](https://github.com/phankhai5004/url-shortener-be)

## Architecture

- **Frontend**: React + Vite served by Nginx
- **Backend**: Spring Boot (Java 21)
- **Database**: MySQL
- **Deployment**: Kubernetes
- **Networking**: NetworkPolicies, Traefik Ingress

## Kubernetes Deployment

> **Work in Progress**: K8s configuration is still being tested.

### Prerequisites

- Kubernetes cluster (tested on k3s)
- kubectl configured
- Local container registry or image repository access

### Deployment Steps

1. **Configure secrets** for your environment:
```bash
cd k8s/overlays/dev/secrets
cp backend.secret.example.yml backend.secret.yml
cp database.secret.example.yml database.secret.yml
cp frontend.secret.example.yml frontend.secret.yml
```
> Edit *.secret.yml with actual credentials

Required secrets:
- **backend**: `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`, `JWT_SECRET`
- **database**: `MYSQL_ROOT_PASSWORD`, `MYSQL_DATABASE`, `MYSQL_USER`, `MYSQL_PASSWORD`
- **frontend**: (Optional) Add any frontend-specific secrets

2. **Build and push images**:
```bash
./push-images.sh
```

3. **Deploy to cluster**:
```bash
# Development
kubectl apply -k k8s/overlays/dev

# Staging
kubectl apply -k k8s/overlays/staging

# Production
kubectl apply -k k8s/overlays/prod
```

4. **Verify deployment**:
```bash
kubectl get all -n url-shortener
kubectl get pvc -n url-shortener  # Check persistent volumes
kubectl logs -n url-shortener -l role=backend  # Check backend logs
```

### Kubernetes Resources

The deployment creates:
- **Namespace**: `url-shortener`
- **StatefulSet**: MySQL with 1Gi persistent volume
- **Deployments**: Frontend (Nginx) and Backend (Spring Boot)
- **Services**: ClusterIP services for inter-pod communication
- **NetworkPolicies**: Restrict traffic between tiers (web → logic → data)
- **Ingress**: Traefik ingress for external access
- **ConfigMaps**: Non-sensitive configuration
- **Secrets**: Credentials and sensitive data

### Network Architecture

```
Internet → Ingress (Traefik)
              ↓
     Frontend (Nginx:3000)
              ↓
     Backend (Spring:8080)
              ↓
     Database (MySQL:3306)
```

### Health Checks

All pods configured with startup, liveness, and readiness probes:
- **Backend**: `/actuator/health` on port 8080 (60s startup buffer)
- **Frontend**: `/health` on port 3000 (30s startup buffer)
- **Database**: `mysqladmin ping` (300s startup buffer for initial setup)

## Project Structure

```
url-shortener
├── compose.yml
├── backend
│   ├── Dockerfile
│   ├── pom.xml
│   └── src
├── frontend
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── nginx.conf.local
│   ├── public
│   └── src
└── k8s
    ├── base
    │   ├── backend
    │   │   └── *.yml
    │   ├── database
    │   │   └── *.yml
    │   ├── frontend
    │   │   └── *.yml
    │   └── kustomization.yml
    └── overlays
        ├── dev
        │   ├── kustomization.yaml
        │   ├── configmaps
        │   └── secrets
        ├── prod
        │   ├── kustomization.yaml
        │   ├── configmaps
        │   └── secrets
        └── staging
            ├── kustomization.yaml
            ├── configmaps
            └── secrets
```

## Local Development (Docker Compose)

For quick local testing without Kubernetes:

```bash
cp .env.example .env
docker compose up -d
```
> Edit .env with local configuration

Access at `http://localhost:${FRONTEND_PORT}`
