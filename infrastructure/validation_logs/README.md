# Validation Logs

This directory contains validation and linting outputs from infrastructure code checks.

## Files

- `terraform_fmt.txt` - Output from `terraform fmt -recursive -check`
- `terraform_validate.txt` - Output from `terraform validate`
- `terraform_plan.txt` - Output from `terraform plan`
- `helm_lint.txt` - Output from `helm lint`
- `ansible_lint.txt` - Output from `ansible-lint`
- `yamllint.txt` - Output from `yamllint`

These logs are generated during CI/CD or manual validation runs.
