const crt = require("aws-crt");
const { HttpRequest } = require("aws-crt/dist/native/http");

/**
 * @see https://github.com/aws-samples/sigv4a-signing-examples
 */
function sigV4ASign(
  method,
  endpoint,
  xAmzCfId,
  config = crt.auth.AwsSigningConfig
) {
  const host = new URL(endpoint).host;
  const request = new HttpRequest(method, endpoint);
  request.headers.add("host", host);
  // "X-Amz-Cf-Id" header can't be directly set in request object.
  // Therefore it has to be part of the signing request, however has to be removed from the
  // request object as CloudFront will set it before making request to the origin.
  request.headers.add("x-amz-cf-id", xAmzCfId);

  crt.auth.aws_sign_request(request, config);
  return request.headers;
}

module.exports = {
  sigV4ASign,
};
