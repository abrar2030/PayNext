# PayNext Infrastructure

Enterprise-grade infrastructure code for PayNext payment platform, hardened for security and compliance.

## 🚀 Quick Start

### Prerequisites

Install required tools:

```bash
# Terraform
wget https://releases.hashicorp.com/terraform/1.6.6/terraform_1.6.6_linux_amd64.zip
unzip terraform_1.6.6_linux_amd64.zip
sudo mv terraform /usr/local/bin/

# AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Ansible
pip install ansible ansible-lint

# YAML Linter
pip install yamllint

# Kubernetes tools
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl
sudo mv kubectl /usr/local/bin/

# Helm
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

# Optional: tfsec for Terraform security scanning
curl -s https://raw.githubusercontent.com/aquasecurity/tfsec/master/scripts/install_linux.sh | bash
```

**Tool Versions Used:**

- Terraform: >= 1.5.0, < 2.0.0
- AWS CLI: >= 2.x
- Ansible: >= 2.14
- kubectl: >= 1.27
- Helm: >= 3.10
- Python: >= 3.8

---

## 📁 Directory Structure

```
infrastructure/
├── README.md                    # This file
├── .gitignore                   # Git ignore rules (prevents secret commits)
├── .yamllint                    # YAML linting configuration
├── .tfsec.yml                   # Terraform security scan config
│
├── terraform/                   # Terraform IaC
│   ├── main.tf                  # Main infrastructure orchestration
│   ├── providers.tf             # Provider configurations
│   ├── variables.tf             # Variable definitions
│   ├── outputs.tf               # Output values
│   ├── terraform.tfvars.example # Example variables (copy to terraform.tfvars)
│   ├── modules/                 # Reusable modules
│   │   ├── security/            # KMS, Secrets Manager, WAF
│   │   ├── vpc/                 # Network infrastructure
│   │   ├── monitoring/          # CloudWatch, GuardDuty, Config
│   │   ├── database/            # RDS Aurora cluster
│   │   ├── kubernetes/          # EKS cluster
│   │   └── storage/             # S3, EFS
│   ├── services/                # Service-specific configs (placeholder)
│   └── kubernetes/              # EKS-specific Terraform
│
├── kubernetes/                  # Kubernetes/Helm charts
│   ├── Chart.yaml               # Helm chart definition
│   ├── values.yaml              # Default values
│   ├── templates/               # Kubernetes manifests
│   │   ├── _helpers.tpl         # Template helpers
│   │   ├── secrets.example.yaml # Secret template (DO NOT COMMIT secrets.yaml!)
│   │   ├── network/             # Network policies
│   │   ├── rbac/                # RBAC roles and bindings
│   │   ├── monitoring/          # Prometheus setup
│   │   └── backup/              # Backup CronJobs
│   └── .helmignore              # Files to ignore in Helm packaging
│
├── ansible/                     # Configuration management
│   ├── ansible.cfg              # Ansible configuration
│   ├── .ansible-lint            # Ansible linting rules
│   ├── playbooks/               # Playbooks for deployment
│   ├── roles/                   # Ansible roles
│   └── inventory/               # Environment inventories
│       ├── dev/                 # Development environment
│       ├── staging/             # Staging environment
│       └── prod/                # Production environment
│
├── ci-cd/                       # CI/CD workflows
│   ├── backend-workflow.yml     # Backend CI/CD
│   ├── frontend-workflow.yml    # Frontend CI/CD
│   └── complete-workflow.yml    # Complete deployment workflow
│
├── scripts/                     # Helper scripts
│   ├── deploy.sh                # Deployment script
│   └── validate.sh              # Validation script
│
└── validation_logs/             # Validation outputs
    ├── terraform_fmt.txt
    ├── terraform_validate.txt
    ├── ansible_lint.txt
    └── yamllint.txt
```

---

## 🔧 Setup Instructions

### 1. Configure AWS Credentials

```bash
aws configure
# Enter your AWS Access Key ID, Secret Key, Region (e.g., us-west-2), and output format (json)
```

### 2. Terraform Setup

#### Step 1: Initialize Terraform

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your values
nano terraform.tfvars
```

**Required Variables:**

- `environment`: `dev`, `staging`, or `prod`
- `aws_region`: AWS region (e.g., `us-west-2`)
- `security_contact_email`: Your security team email
- `compliance_contact_email`: Your compliance team email

#### Step 2: Format and Validate

```bash
# Format Terraform files
terraform fmt -recursive

# Initialize Terraform (downloads providers)
terraform init -backend=false

# Validate configuration
terraform validate
```

**Expected Output:**

```
Success! The configuration is valid.
```

**Note:** There are known issues with some module cross-references that need fixing before `terraform plan` will work. See "Known Issues" section below.

#### Step 3: Plan (Dry Run)

```bash
# Create an execution plan
terraform plan -out=plan.out

# Review the plan carefully before applying
```

#### Step 4: Apply (Deploy)

```bash
# Apply the infrastructure changes
terraform apply plan.out
```

### 3. Kubernetes Setup

#### Step 1: Lint Helm Chart

```bash
cd ../kubernetes
helm lint .
```

#### Step 2: Dry Run

```bash
# Test rendering without applying
helm template paynext . -f values.yaml --debug

# Or with kubectl
kubectl apply --dry-run=client -f templates/
```

#### Step 3: Create Secrets

```bash
# Copy the example
cp templates/secrets.example.yaml templates/secrets.yaml

# Generate base64-encoded secrets
echo -n 'my-super-secret-jwt-key' | base64

# Edit secrets.yaml and replace <BASE64_ENCODED_...> placeholders
nano templates/secrets.yaml
```

**⚠️ IMPORTANT:** Never commit `secrets.yaml` to version control! It's already in `.gitignore`.

#### Step 4: Deploy to Cluster

```bash
# Configure kubectl for your EKS cluster
aws eks update-kubeconfig --region us-west-2 --name paynext-cluster-dev

# Install via Helm
helm install paynext . -f values.yaml --namespace paynext --create-namespace

# Or apply manifests directly
kubectl apply -f templates/ -n paynext
```

### 4. Ansible Setup

#### Step 1: Configure Inventory

```bash
cd ../ansible

# For development
cp inventory/dev/group_vars/all.yml inventory/dev/group_vars/all.yml.example

# Set environment variables for secrets
export DB_PASSWORD="your-secure-db-password"
export JWT_SECRET="your-jwt-secret-key"
```

#### Step 2: Lint Playbooks

```bash
# Run Ansible lint
ansible-lint .

# Run YAML lint
yamllint -c ../.yamllint .
```

**Expected Output:**

```
Passed: 0 failure(s), 0 warning(s) in X files processed
```

#### Step 3: Run Playbooks (Dry Run)

```bash
# Check mode (dry run)
ansible-playbook -i inventory/dev/dev_inventory.yaml playbooks/site.yml --check

# Run for real
ansible-playbook -i inventory/dev/dev_inventory.yaml playbooks/site.yml
```

---

## 🛡️ Security Best Practices

### Secrets Management

1. **Never commit secrets** to version control
2. Use **environment variables** or **AWS Secrets Manager** for sensitive values
3. Use **Ansible Vault** for encrypted secrets:
   ```bash
   ansible-vault create secrets.yml
   ansible-vault encrypt_string 'my-secret' --name 'my_var'
   ```
4. Rotate secrets regularly (quarterly minimum)

### Access Control

- Use **IAM roles** with least privilege
- Enable **MFA** for AWS root and admin accounts
- Use **VPC private subnets** for application and database tiers
- Implement **security groups** with restrictive rules

### Encryption

- **At Rest**: All data encrypted with AWS KMS
- **In Transit**: TLS 1.2+ enforced for all communications
- Database connections use SSL/TLS

### Monitoring

- **CloudWatch** logs and metrics enabled
- **GuardDuty** threat detection active
- **Config** rules for compliance monitoring
- **CloudTrail** for API audit logging

---

## ✅ Validation Commands

Run these to ensure infrastructure code quality:

### Terraform

```bash
cd terraform

# Format check
terraform fmt -recursive -check

# Initialize
terraform init -backend=false

# Validate syntax
terraform validate

# Security scan (optional)
tfsec .
```

### Ansible

```bash
cd ansible

# Lint playbooks
ansible-lint .

# YAML syntax
yamllint -c ../.yamllint .
```

### Kubernetes

```bash
cd kubernetes

# Lint Helm chart
helm lint .

# YAML syntax
yamllint -c ../.yamllint templates/

# Validate manifests
kubectl apply --dry-run=client -f templates/
```

### CI/CD Workflows

```bash
cd ci-cd

# YAML syntax
yamllint *.yml
```

---

## 🐛 Known Issues & Workarounds

### Terraform Issues

1. **Service modules commented out**
   - **Issue**: Service modules (`api-gateway`, `eureka-server`, etc.) are placeholder code without proper variable definitions
   - **Status**: Commented out in `main.tf`
   - **Workaround**: Implement proper `variables.tf` in each service module before uncommenting
   - **Location**: Lines 164-246 in `terraform/main.tf`

2. **Storage module output mismatches**
   - **Issue**: `main.tf` and `outputs.tf` reference `module.storage.s3_bucket_id` but the storage module outputs different attribute names
   - **Status**: Partial fix applied
   - **Workaround**: Check `modules/storage/outputs.tf` and align references in `main.tf` line 97 and `outputs.tf` lines 135-150

3. **Database module RDS Proxy syntax**
   - **Issue**: `aws_db_proxy` resource uses deprecated/incorrect block syntax (target block, max_connections_percent)
   - **Location**: `modules/database/main.tf` lines 342-349
   - **Workaround**: Update to current AWS provider syntax for RDS Proxy

4. **Kubernetes module user_data template error**
   - **Issue**: `user_data.sh` template has Terraform interpolation syntax error at line 306
   - **Location**: `modules/kubernetes/user_data.sh` line 306
   - **Workaround**: Escape bash variables in template with `$${var}` instead of `${var}`

5. **Config recorder recording_mode block**
   - **Issue**: `aws_config_configuration_recorder` uses unsupported `recording_mode` block
   - **Location**: `modules/monitoring/main.tf` line 336
   - **Workaround**: Update to current AWS Config recorder syntax

### Ansible Issues

- ✅ **All fixed!** Ansible lint passes with 0 failures
- Minor: One YAML line-length warning (non-blocking)

### Kubernetes Issues

- ✅ **Secrets handled properly** with `.example` template
- Minor: YAML formatting warnings in `secrets.example.yaml` (trailing spaces, braces)

### CI/CD Issues

- ✅ **Secrets properly masked** with `${{ secrets.X }}` syntax
- Note: Workflows should include infrastructure validation steps (terraform validate, ansible-lint, etc.)

---

## 📊 Compliance & Standards

This infrastructure is designed to meet:

- **PCI DSS**: Payment Card Industry Data Security Standard
- **GDPR**: General Data Protection Regulation
- **SOX**: Sarbanes-Oxley Act
- **ISO 27001**: Information Security Management

**Compliance Features:**

- 7-year data retention for financial records
- Encryption at rest and in transit
- Comprehensive audit logging
- Regular automated backups
- Multi-region disaster recovery

---

## 🆘 Troubleshooting

### Terraform `terraform init` fails

```bash
# Clean and re-initialize
rm -rf .terraform .terraform.lock.hcl
terraform init -backend=false
```

### AWS credentials not found

```bash
# Check AWS configuration
aws sts get-caller-identity

# Reconfigure if needed
aws configure
```

### Kubernetes cluster not accessible

```bash
# Update kubeconfig
aws eks update-kubeconfig --region us-west-2 --name paynext-cluster-dev

# Verify access
kubectl get nodes
```

### Ansible inventory not found

```bash
# Check inventory file exists
ls -la inventory/dev/

# Verify YAML syntax
yamllint inventory/dev/dev_inventory.yaml
```

---

## 📄 License

This infrastructure code is proprietary and confidential. Unauthorized use, distribution, or modification is strictly prohibited.

---
