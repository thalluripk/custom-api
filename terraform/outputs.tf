# Outputs from Terraform deployment

output "container_registry_login_server" {
  value       = azurerm_container_registry.acr.login_server
  description = "Container Registry login server URL"
}

output "app_service_url" {
  value       = "https://${azurerm_linux_web_app.app.default_hostname}"
  description = "Application URL"
}

output "resource_group_name" {
  value       = azurerm_resource_group.rg.name
  description = "Resource Group name"
}

output "app_service_name" {
  value       = azurerm_linux_web_app.app.name
  description = "App Service name"
}

output "container_registry_name" {
  value       = azurerm_container_registry.acr.name
  description = "Container Registry name"
}

output "application_insights_id" {
  value       = azurerm_application_insights.appinsights.id
  description = "Application Insights ID"
}
