#!/bin/bash

# Create a temporary directory
mkdir -p temp_package

# Copy manifest and icons
cp manifest.json temp_package/
cp icons/outline.png temp_package/
cp icons/color.png temp_package/

# Create the zip file
cd temp_package
zip -r ../variance-report.zip ./*

# Clean up
cd ..
rm -rf temp_package

echo "Teams app package created: variance-report.zip" 