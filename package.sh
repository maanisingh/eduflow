#!/bin/bash

echo "📦 Packaging EduFlow for transfer..."
echo ""

# Create package directory
PACKAGE_NAME="eduflow-deployment-$(date +%Y%m%d-%H%M%S)"
PACKAGE_DIR="/tmp/$PACKAGE_NAME"

# Copy entire project
echo "Copying files..."
cp -r /tmp/eduflow "$PACKAGE_DIR"

# Clean up unnecessary files
echo "Cleaning up..."
cd "$PACKAGE_DIR"
find . -name "node_modules" -type d -exec rm -rf {} + 2>/dev/null
find . -name "dist" -type d -exec rm -rf {} + 2>/dev/null
find . -name ".git" -type d -exec rm -rf {} + 2>/dev/null
rm -f package.sh

# Create tar.gz archive
echo "Creating archive..."
cd /tmp
tar -czf "${PACKAGE_NAME}.tar.gz" "$PACKAGE_NAME"

# Clean up temp directory
rm -rf "$PACKAGE_DIR"

echo ""
echo "✅ Package created successfully!"
echo ""
echo "📁 Archive: /tmp/${PACKAGE_NAME}.tar.gz"
echo "📊 Size: $(du -h /tmp/${PACKAGE_NAME}.tar.gz | cut -f1)"
echo ""
echo "📤 To deploy on another machine:"
echo "   1. Copy ${PACKAGE_NAME}.tar.gz to the target machine"
echo "   2. Extract: tar -xzf ${PACKAGE_NAME}.tar.gz"
echo "   3. cd ${PACKAGE_NAME}"
echo "   4. Run: ./deploy.sh"
echo ""
