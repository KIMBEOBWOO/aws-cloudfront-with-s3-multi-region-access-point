# aws-cloudfront-with-s3-multi-region-access-point

CloudFront to MRAP Add SigV4 Header to Origin Request

### Use

1. install dependencies

```bash
# ./lambda
npm install --arch=x64 --platform=linux
```

2. `zip` all package

```bash
# ./lambda
zip -r mrap-to-cdn-proxy-us-east-1.zip .
```

3. Upload `zip` file to S3

```bash
aws s3 cp ./mrap-to-cdn-proxy-us-east-1.zip s3://${S3_BUCKET_DEPLOYABLES}/lambdapackage/mrap-to-cdn-proxy-us-ease-1.zip
```

4. Update AWS `Lambda`
5. Deply `Lambda@Edge`
