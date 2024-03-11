const crt = require("aws-crt");
const { sigV4ASign } = require("./sigv4a_sign");

/**
 * Lambda handler
 * @param {*} event
 * @returns SigV4 signed request
 *
 * @see https://github.com/aws-samples/amazon-cloudfront-with-s3-multi-region-access-points
 * @author KIMBEOBWOO
 */
exports.handler = async (event) => {
  const { request } = event.Records[0].cf;

  let config = {
    service: "s3", // Empty for GET, could be mapped from request, if there is such case. E.g. request['body']['data']
    region: "*", // For S3 Multi-Region Access Point it's '*' (e.g. all regions). Also, that's why SigV4A is required.
    algorithm: crt.auth.AwsSigningAlgorithm.SigV4Asymmetric,
    signature_type: crt.auth.AwsSignatureType.HttpRequestViaHeaders,
    signed_body_header: crt.auth.AwsSignedBodyHeaderType.XAmzContentSha256,
    provider: crt.auth.AwsCredentialsProvider.newDefault(),
  };
  let method = "GET";
  let endpoint = `https://${request["origin"]["custom"]["domainName"]}${request["uri"]}`;

  // CloudFront adds "X-Amz-Cf-Id" header after Origin request Lambda but before the request to the origin.
  // Therefore it has to be part of the signing request.
  let xAmzCfId = event["Records"][0]["cf"]["config"]["requestId"];

  // Add SigV4A auth headers in the by CloutFront expected data structure.
  let signedHeaders = sigV4ASign(method, endpoint, xAmzCfId, config)
    ._flatten()
    .filter(([key]) => key.toLowerCase() !== "x-amz-cf-id")
    .reduce((acc, [key, value]) => {
      acc[key] = [{ key, value }];
      return acc;
    }, {});

  // Add the signed headers to the request
  request.headers = {
    ...request.headers,
    ...signedHeaders,
  };

  return request;
};
