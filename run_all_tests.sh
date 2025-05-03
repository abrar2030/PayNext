#!/usr/bin/env bash
set -euo pipefail

# -----------------------------
# Usage:
#   ./run-tests.sh [-d /path/to/project]
# -----------------------------

# Default to script’s directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_BASE_DIR="$SCRIPT_DIR"

# Parse flags
while getopts ":d:" opt; do
  case ${opt} in
    d) PROJECT_BASE_DIR="$OPTARG" ;;
    *) echo "Usage: $0 [-d project_base_dir]"; exit 1 ;;
  esac
done

# Component paths (relative)
declare -A COMPONENT_DIRS=(
  [payment-service]="backend/payment-service"
  [user-service]="backend/user-service"
  [web-frontend]="web-frontend"
  [mobile-frontend]="mobile-frontend"
)

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

# Track failures and durations
any_failed=false
declare -A durations

mkdir -p "$PROJECT_BASE_DIR/logs"

print_header() {
  echo
  echo "======================================================================="
  echo " $1"
  echo "======================================================================="
}

run_tests() {
  local name="$1"
  local relpath="$2"
  local fullpath="$PROJECT_BASE_DIR/$relpath"
  local start end elapsed cmd logfile

  print_header "Component: $name"
  if [[ ! -d "$fullpath" ]]; then
    echo -e "${RED}SKIP:${NC} Directory not found: $relpath"
    return
  fi

  # pick test command
  if [[ -f "$fullpath/pom.xml" ]]; then
    cmd="mvn test"
  elif [[ -f "$fullpath/build.gradle" ]]; then
    if [[ -x "$fullpath/gradlew" ]]; then
      cmd="./gradlew test"
    else
      cmd="gradle test"
    fi
  elif [[ -f "$fullpath/package.json" ]]; then
    if [[ -f "$fullpath/pnpm-lock.yaml" ]]; then
      cmd="pnpm install && pnpm test"
    elif [[ -f "$fullpath/yarn.lock" ]]; then
      cmd="yarn install && yarn test"
    else
      cmd="npm install && npm test"
    fi
  else
    echo -e "${RED}SKIP:${NC} No recognized build file in $relpath"
    return
  fi

  echo "Executing in $relpath: $cmd"
  logfile="$PROJECT_BASE_DIR/logs/${name}.log"
  start=$(date +%s)
  if (cd "$fullpath" && bash -lc "$cmd" &> "$logfile"); then
    end=$(date +%s)
    elapsed=$((end - start))
    durations["$name"]="$elapsed"
    echo -e "${GREEN}PASS:${NC} $name in ${elapsed}s"
  else
    end=$(date +%s)
    elapsed=$((end - start))
    durations["$name"]="$elapsed"
    any_failed=true
    echo -e "${RED}FAIL:${NC} $name in ${elapsed}s"
    echo "  → See logs/$name.log for details"
  fi
}

# Run them all
for comp in "${!COMPONENT_DIRS[@]}"; do
  run_tests "$comp" "${COMPONENT_DIRS[$comp]}"
done

# Summary
print_header "Test Summary"
for comp in "${!durations[@]}"; do
  status=$([ "$any_failed" = true ] && grep -q "^FAIL" "$PROJECT_BASE_DIR/logs/${comp}.log" && echo "❌" || echo "✅")
  printf "%s %-16s : %2ds\n" "$status" "$comp" "${durations[$comp]}"
done

if $any_failed; then
  echo -e "\n${RED}One or more test suites failed.${NC}"
  exit 1
else
  echo -e "\n${GREEN}All test suites passed successfully!${NC}"
  exit 0
fi
