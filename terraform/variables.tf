# Terraform variables definitions

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
}

variable "location" {
  description = "Azure region for resources"
  type        = string
}

variable "app_name" {
  description = "Application name for resource naming"
  type        = string
}

variable "jwt_secret" {
  description = "JWT secret key for token signing"
  type        = string
  sensitive   = true
}
