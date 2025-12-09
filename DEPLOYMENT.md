# Deployment Guide

## Prerequisites

- Azure Subscription
- Terraform CLI (>= 1.0)
- Docker (for local testing)
- GitHub account with Actions enabled
- Azure CLI

## Local Development

### Build and Run Locally

```bash
npm install
npm run build
npm start
```

Server will be available at `http://localhost:3000`

### Build Docker Image Locally

```bash
docker build -t web-api:latest .
docker run -p 3000:3000 \
  -e JWT_SECRET="your_secret" \
  -e PORT="3000" \
  web-api:latest
```

## Azure Deployment

### Step 1: Prepare Azure

```bash
# Login to Azure
az login

# Create a service principal for Terraform
az ad sp create-for-rbac --name "terraform-sp" --role "Contributor" \
  --scopes "/subscriptions/$(az account show --query id -o tsv)"
```

### Step 2: Setup GitHub Secrets

Add these secrets to your GitHub repository:

1. `AZURE_CREDENTIALS` - JSON from service principal
2. `AZURE_REGISTRY_NAME` - ACR registry name
3. `AZURE_REGISTRY_USERNAME` - ACR username
4. `AZURE_REGISTRY_PASSWORD` - ACR password
5. `AZURE_APP_SERVICE_NAME` - App Service name

### Step 3: Deploy Infrastructure with Terraform

```bash
cd terraform

# Initialize Terraform
terraform init

# Create/Update infrastructure
terraform plan -out=tfplan
terraform apply tfplan

# Get outputs
terraform output
```

### Step 4: Configure Remote State (Optional but Recommended)

```bash
# Create storage account for Terraform state
az storage account create \
  --resource-group terraform-rg \
  --name tfstatestorage \
  --sku Standard_LRS

az storage container create \
  --account-name tfstatestorage \
  --name tfstate
```

Then uncomment the backend configuration in `main.tf`.

### Step 5: Push Code to Main Branch

```bash
git add .
git commit -m "Add CI/CD and Terraform configuration"
git push origin main
```

The GitHub Actions workflow will automatically:
1. Build and test the application
2. Build Docker image
3. Push to Azure Container Registry
4. Deploy to Azure App Service

## Monitoring

### View Application Logs

```bash
# Using Azure CLI
az webapp log tail --name web-api-dev \
  --resource-group web-api-rg-dev

# Using Application Insights
az monitor app-insights query --app web-api-ai-dev \
  --analytics-query "traces | limit 10"
```

### Access Application Insights

```bash
# Open in browser
az monitor app-insights show --name web-api-ai-dev \
  --query "{AppId:appId,InstrumentationKey:instrumentationKey}" \
  -o table
```

## Cleanup

To destroy all Azure resources:

```bash
cd terraform
terraform destroy
```

## Troubleshooting

### Docker Build Issues

```bash
# Check Docker is running
docker ps

# Build with verbose output
docker build --verbose -t web-api:latest .
```

### Terraform Issues

```bash
# Validate configuration
terraform validate

# Format configuration
terraform fmt -recursive

# View plan without applying
terraform plan
```

### Azure Login Issues

```bash
# Clear cached credentials
az account clear

# Login again
az login
```

## CI/CD Workflow

The GitHub Actions workflow (`deploy.yml`) runs on:
- Push to main branch
- Pull requests to main branch

Pipeline stages:
1. **Build**: Install dependencies, run TypeScript compilation
2. **Docker**: Build and push Docker image to ACR
3. **Deploy**: Deploy to Azure App Service (main branch only)

## Environment Variables

Production environment variables are managed in Azure App Service settings:

- `PORT` - Server port (default: 3000)
- `JWT_SECRET` - JWT signing secret
- `ENVIRONMENT` - Environment name (dev/staging/prod)
