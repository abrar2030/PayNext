# Git Rebase Automation Script

Managing Git branches and keeping them up-to-date with the main branch is crucial for maintaining a clean and efficient workflow. Rebasing is a powerful tool that allows you to integrate changes from one branch into another, creating a linear project history. This guide provides a comprehensive **Bash script** to automate the rebasing process, ensuring consistency and reducing manual intervention.

---
## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Creating the Git Rebase Script](#creating-the-git-rebase-script)
    - [Script Breakdown](#script-breakdown)
3. [Making the Script Executable](#making-the-script-executable)
4. [Using the Script](#using-the-script)
    - [Basic Usage](#basic-usage)
    - [Advanced Options](#advanced-options)
5. [Automating the Script with Cron (Optional)](#automating-the-script-with-cron-optional)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)

---
## Prerequisites

Before setting up the rebase automation script, ensure the following prerequisites are met:

1. **Git Installed:** Verify that Git is installed on your system.

    ```bash
    git --version
    ```

2. **Git Repository Initialized:** Navigate to your project directory and ensure it's a Git repository.

    ```bash
    cd /path/to/your/project
    git status
    ```

    If it's not a repository, initialize it:

    ```bash
    git init
    ```

3. **Remote Repository Set:** Ensure your local repository is linked to a remote GitHub repository.

    ```bash
    git remote -v
    ```

    If not, add the remote:

    ```bash
    git remote add origin https://github.com/your-username/your-repo.git
    ```

4. **Authentication Configured:** Ensure you have the necessary permissions to push to the remote repository. This can be via SSH keys or HTTPS with credential caching.

---
## Creating the Git Rebase Script

Create a Bash script named `git-auto-rebase.sh` (you can choose any name) with the following content:

```bash
#!/bin/bash

# =====================================================
# Git Auto Rebase Script
# =====================================================
# This script automates the process of rebasing the current
# branch onto a target branch (e.g., main or develop).
#
# Usage:
#   ./git-auto-rebase.sh [target-branch]
#
# If no target branch is provided, 'main' is used by default.
# =====================================================

# Function to display usage information
usage() {
    echo "Usage: $0 [target-branch]"
    echo ""
    echo "If no target branch is provided, 'main' is used by default."
    exit 1
}

# Function to check if Git is installed
check_git() {
    if ! command -v git &> /dev/null
    then
        echo "Error: Git is not installed. Please install Git before running this script."
        exit 1
    fi
}

# Function to check if inside a Git repository
check_git_repo() {
    if ! git rev-parse --is-inside-work-tree &> /dev/null
    then
        echo "Error: This script must be run inside a Git repository."
        exit 1
    fi
}

# Function to fetch latest changes from remote
fetch_latest() {
    echo "Fetching latest changes from remote..."
    git fetch --all
}

# Function to switch to target branch and pull latest
switch_to_target_branch() {
    TARGET_BRANCH=$1
    echo "Switching to target branch: $TARGET_BRANCH"
    git checkout "$TARGET_BRANCH"

    if [ $? -ne 0 ]; then
        echo "Error: Failed to checkout branch '$TARGET_BRANCH'. Ensure the branch exists."
        exit 1
    fi

    echo "Pulling latest changes for '$TARGET_BRANCH'..."
    git pull origin "$TARGET_BRANCH"

    if [ $? -ne 0 ]; then
        echo "Error: Failed to pull latest changes for '$TARGET_BRANCH'."
        exit 1
    fi
}

# Function to switch back to the original branch
switch_back_to_original_branch() {
    ORIGINAL_BRANCH=$1
    echo "Switching back to original branch: $ORIGINAL_BRANCH"
    git checkout "$ORIGINAL_BRANCH"

    if [ $? -ne 0 ]; then
        echo "Error: Failed to checkout branch '$ORIGINAL_BRANCH'."
        exit 1
    fi
}

# Function to perform rebase
perform_rebase() {
    TARGET_BRANCH=$1
    echo "Rebasing current branch onto '$TARGET_BRANCH'..."
    git rebase "$TARGET_BRANCH"

    if [ $? -ne 0 ]; then
        echo "Rebase encountered conflicts. Please resolve them manually."
        exit 1
    fi
}

# Function to push the rebased branch
push_rebased_branch() {
    CURRENT_BRANCH=$(git branch --show-current)
    echo "Pushing rebased branch '$CURRENT_BRANCH' to remote..."
    git push --force-with-lease origin "$CURRENT_BRANCH"

    if [ $? -ne 0 ]; then
        echo "Error: Failed to push rebased branch '$CURRENT_BRANCH' to remote."
        exit 1
    fi
}

# Main function to handle the rebase process
main() {
    # Check for help flag
    if [[ "$1" == "-h" || "$1" == "--help" ]]; then
        usage
    fi

    # Set target branch
    TARGET_BRANCH=${1:-main}

    # Perform prerequisite checks
    check_git
    check_git_repo

    # Get the current branch name
    ORIGINAL_BRANCH=$(git branch --show-current)
    echo "Current branch: $ORIGINAL_BRANCH"
    echo "Target branch for rebase: $TARGET_BRANCH"

    # Ensure working directory is clean
    if ! git diff-index --quiet HEAD --; then
        echo "Error: You have uncommitted changes. Please commit or stash them before rebasing."
        exit 1
    fi

    # Fetch latest changes
    fetch_latest

    # Switch to target branch and pull latest
    switch_to_target_branch "$TARGET_BRANCH"

    # Switch back to original branch
    switch_back_to_original_branch "$ORIGINAL_BRANCH"

    # Perform rebase
    perform_rebase "$TARGET_BRANCH"

    # Push the rebased branch
    push_rebased_branch
}

# Invoke main with all script arguments
main "$@"
