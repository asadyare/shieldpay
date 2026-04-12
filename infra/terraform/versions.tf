terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.90"
    }
    tls = {
      source  = "hashicorp/tls"
      version = "~> 4.0"
    }
  }

  # backend "s3" {
  #   bucket         = "your-tf-state-bucket"
  #   key            = "shieldpay/terraform.tfstate"
  #   region         = "us-east-1"
  #   dynamodb_table = "terraform-locks"
  #   encrypt        = true
  # }
}
