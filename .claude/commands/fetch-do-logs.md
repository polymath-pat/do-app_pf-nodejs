---
allowed-tools: Bash(doctl:*)
description: Fetch and analyze App Platform deployment logs
argument-hint: [app-name]
---

# Fetch DigitalOcean App Platform Logs

Fetch the latest deployment and build logs for the specified App Platform application: $1

## Instructions

1. Use `doctl apps list` to find the app ID for the specified app name
2. Use `doctl apps logs` to retrieve the latest logs
3. Analyze the logs for common issues:
   - Build failures and error messages
   - Deployment errors
   - SSL/TLS certificate validation issues (especially for PostgreSQL connections)
   - Environment variable configuration problems
   - Resource allocation or timeout errors
   - Node.js version mismatches

## Output Format

Provide a structured analysis:

### Log Summary
- Total lines retrieved
- Time range covered
- Component(s) analyzed

### Critical Errors
- List any errors found with line numbers
- Root cause analysis

### Warnings
- Configuration issues
- Deprecation notices
- Performance concerns

### Recommendations
- Specific fixes for identified issues
- Best practices to prevent future errors
- Links to relevant documentation if applicable

If no logs are available or doctl is not installed, provide clear instructions on next steps.
