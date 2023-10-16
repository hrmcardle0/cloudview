#!/bin/bash
# set proxy vars
export http_proxy=http://proxycore.rivagecapital.com:9443
export https_proxy=http://proxycore.rivagecapital.com:9443
export no_proxy=10.0.0.0/8,.execute-api.eu-west-1.amazonaws.com,169.254.169.254

# build npm package
echo "Building..."
npm run build

# zip
zip -r9 ../website.zip dist/

# upload to storage bucket for saving
aws s3 cp ../website.zip s3://cm-cybersec-misc --no-verify-ssl

cd dist

for file in $(ls);
do
    if [[ -d $file ]]; then
        echo "$file is a directory"
        aws s3 cp $file s3://coremont-security-finding-tool/$file --recursive --no-verify-ssl
    elif [[ -f $file ]]; then
        echo "$file is a file"
        aws s3 cp $file s3://coremont-security-finding-tool/ --no-verify-ssl
    else
        echo "$file is not valid"
    fi
done
#aws s3 cp ./css s3://coremont-security-finding-tool/css --recursive --no-verify-ssl
#aws s3 cp ./js s3://coremont-security-finding-tool/js --recursive --no-verify-ssl
#aws s3 cp index.html s3://coremont-security-finding-tool/ --no-verify-ssl