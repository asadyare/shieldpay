# EBS CSI driver + IRSA: required for PersistentVolumeClaims (SQLite file) on EKS.
module "ebs_csi_irsa" {
  source  = "terraform-aws-modules/iam/aws//modules/iam-role-for-service-accounts-eks"
  version = "~> 5.39"

  role_name = "${local.name}-ebs-csi"

  attach_ebs_csi_policy = true

  oidc_providers = {
    eks = {
      provider_arn               = module.eks.oidc_provider_arn
      namespace_service_accounts = ["kube-system:ebs-csi-controller-sa"]
    }
  }

  tags = var.tags
}

data "aws_eks_addon_version" "ebs_csi" {
  addon_name         = "aws-ebs-csi-driver"
  kubernetes_version = module.eks.cluster_version
  most_recent        = true
}

resource "aws_eks_addon" "ebs_csi" {
  cluster_name                 = module.eks.cluster_name
  addon_name                   = "aws-ebs-csi-driver"
  addon_version                = data.aws_eks_addon_version.ebs_csi.version
  service_account_role_arn     = module.ebs_csi_irsa.iam_role_arn
  resolve_conflicts_on_create  = "OVERWRITE"
  resolve_conflicts_on_update  = "OVERWRITE"
  preserve                     = true

  depends_on = [
    module.eks,
    module.ebs_csi_irsa,
  ]
}
