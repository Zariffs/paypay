#!/bin/bash
# Updates version.json with current git info
# Run this before committing to update the version

COMMIT=$(git rev-parse --short HEAD)
BUILD=$(git rev-list --count HEAD)
DATE=$(date +%Y-%m-%d)

cat > version.json << EOF
{
  "commit": "$COMMIT",
  "build": $BUILD,
  "date": "$DATE"
}
EOF

echo "Updated version.json: v$BUILD ($COMMIT) - $DATE"
