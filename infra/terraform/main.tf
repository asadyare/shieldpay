provider "aws" {
  region = var.aws_region

  default_tags {
    tags = merge(
      {
        Project     = var.project
        Environment = var.environment
        ManagedBy   = "terraform"
      },
      var.tags
    )
  }
}

data "aws_availability_zones" "available" {
  state = "available"
}

data "aws_caller_identity" "current" {}

locals {
  name = "${var.project}-${var.environment}"

  azs = slice(data.aws_availability_zones.available.names, 0, 3)

  private_subnets = [for i, az in local.azs : cidrsubnet(var.vpc_cidr, 4, i)]
  public_subnets  = [for i, az in local.azs : cidrsubnet(var.vpc_cidr, 4, i + 4)]

  github_oidc_arn = var.create_github_oidc_provider ? aws_iam_openid_connect_provider.github[0].arn : (
    length(var.github_oidc_provider_arn) > 0 ? var.github_oidc_provider_arn : data.aws_iam_openid_connect_provider.github_existing[0].arn
  )

  github_subjects = length(var.github_oidc_subjects) > 0 ? var.github_oidc_subjects : ["repo:${var.github_org}/${var.github_repo}:*"]
}
