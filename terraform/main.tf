terraform {
  required_version = ">= 1.0"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }

  # Uncomment and configure for remote state management
  # backend "azurerm" {
  #   resource_group_name  = "terraform-rg"
  #   storage_account_name = "tfstatestorage"
  #   container_name       = "tfstate"
  #   key                  = "web-api.tfstate"
  # }
}

provider "azurerm" {
  features {}
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "dev"
}

variable "location" {
  description = "Azure region"
  type        = string
  default     = "Australia East"
}

variable "app_name" {
  description = "Application name"
  type        = string
  default     = "loro-web-api"
}

# Resource Group
resource "azurerm_resource_group" "rg" {
  name     = "${var.app_name}-rg-${var.environment}"
  location = var.location
}

# Container Registry
resource "azurerm_container_registry" "acr" {
  name                = "${replace(var.app_name, "-", "")}${var.environment}acr"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  sku                 = "Standard"
  admin_enabled       = true
}

# App Service Plan
resource "azurerm_service_plan" "asp" {
  name                = "${var.app_name}-asp-${var.environment}"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  os_type             = "Linux"
  sku_name            = "B2"
}

# App Service
resource "azurerm_linux_web_app" "app" {
  name                = "${var.app_name}-${var.environment}"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  service_plan_id     = azurerm_service_plan.asp.id

  site_config {
    always_on         = true
    container_registry_use_managed_identity = true

    application_stack {
      docker_image_name   = "mcr.microsoft.com/appsvc/node:18-lts"
      docker_registry_url = "https://${azurerm_container_registry.acr.login_server}"
    }
  }

  app_settings = {
    "DOCKER_REGISTRY_SERVER_URL"      = "https://${azurerm_container_registry.acr.login_server}"
    "DOCKER_REGISTRY_SERVER_USERNAME" = azurerm_container_registry.acr.admin_username
    "DOCKER_REGISTRY_SERVER_PASSWORD" = azurerm_container_registry.acr.admin_password
    "WEBSITES_ENABLE_APP_SERVICE_STORAGE" = false
    "PORT"                             = "3000"
    "JWT_SECRET"                       = var.jwt_secret
    "ENVIRONMENT"                      = var.environment
  }

  identity {
    type = "SystemAssigned"
  }

  depends_on = [azurerm_service_plan.asp]
}

# Application Insights
resource "azurerm_application_insights" "appinsights" {
  name                = "${var.app_name}-ai-${var.environment}"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  application_type    = "web"
}

# Connect App Insights to App Service
resource "azurerm_app_service_application_insights_binding" "binding" {
  app_service_id              = azurerm_linux_web_app.app.id
  application_insights_id     = azurerm_application_insights.appinsights.id
  instrumentation_key         = azurerm_application_insights.appinsights.instrumentation_key
}

# Outputs
output "container_registry_login_server" {
  value       = azurerm_container_registry.acr.login_server
  description = "Container Registry login server"
}

output "container_registry_id" {
  value       = azurerm_container_registry.acr.id
  description = "Container Registry ID"
}

output "app_service_url" {
  value       = azurerm_linux_web_app.app.default_hostname
  description = "App Service URL"
}

output "application_insights_instrumentation_key" {
  value       = azurerm_application_insights.appinsights.instrumentation_key
  sensitive   = true
  description = "Application Insights instrumentation key"
}

variable "jwt_secret" {
  description = "JWT secret key"
  type        = string
  sensitive   = true
}
