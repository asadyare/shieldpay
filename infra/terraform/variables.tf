variable "aws_region" {
  type        = string
  description = "AWS region for all resources."
  default     = "us-east-1"
}

variable "project" {
  type        = string
  description = "Short project name used in resource names."
  default     = "shieldpay"
}

variable "environment" {
  type        = string
  description = "Environment suffix (e.g. prod, staging)."
  default     = "prod"
}

variable "vpc_cidr" {
  type        = string
  default     = "10.20.0.0/16"
}

variable "single_nat_gateway" {
  type        = bool
  description = "Use one NAT gateway (cheaper; less AZ resilience)."
  default     = true
}

variable "cluster_version" {
  type        = string
  default     = "1.31"
}

variable "cluster_endpoint_public_access_cidrs" {
  type        = list(string)
  description = "CIDRs allowed to reach the public Kubernetes API endpoint."
  default     = ["0.0.0.0/0"]
}

variable "node_instance_types" {
  type    = list(string)
  default = ["t3.medium"]
}

variable "node_desired" {
  type    = number
  default = 2
}

variable "node_min" {
  type    = number
  default = 1
}

variable "node_max" {
  type    = number
  default = 5
}

variable "github_org" {
  type        = string
  description = "GitHub organisation or user (for OIDC trust subject)."
  default     = "asadyare"
}

variable "github_repo" {
  type        = string
  description = "Repository name under the org (for OIDC trust subject)."
  default     = "shieldpay"
}

variable "github_oidc_subjects" {
  type        = list(string)
  description = "Full OIDC subject patterns, e.g. repo:myorg/shieldpay:ref:refs/heads/main. If empty, repo:org/repo:* is used."
  default     = []
}

variable "create_github_oidc_provider" {
  type        = bool
  description = "Create the GitHub OIDC provider. Set false if it already exists in the account (ARN is resolved automatically unless github_oidc_provider_arn is set)."
  default     = true
}

variable "github_oidc_provider_arn" {
  type        = string
  description = "Optional override when create_github_oidc_provider is false. If empty, Terraform looks up the provider by URL https://token.actions.githubusercontent.com."
  default     = ""
}

variable "tags" {
  type        = map(string)
  description = "Tags applied to taggable resources."
  default     = {}
}
