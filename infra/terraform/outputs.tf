output "vpc_id" {
  value = module.vpc.vpc_id
}

output "eks_cluster_name" {
  value = module.eks.cluster_name
}

output "eks_cluster_arn" {
  value = module.eks.cluster_arn
}

output "eks_cluster_endpoint" {
  value = module.eks.cluster_endpoint
}

output "ecr_repository_url" {
  value = aws_ecr_repository.app.repository_url
}

output "github_actions_role_arn" {
  description = "Set as GitHub variable AWS_DEPLOY_ROLE_ARN (or repository secret)."
  value       = aws_iam_role.github_actions.arn
}

output "configure_kubectl" {
  value = "aws eks update-kubeconfig --region ${var.aws_region} --name ${module.eks.cluster_name}"
}

output "aws_account_id" {
  value = data.aws_caller_identity.current.account_id
}
