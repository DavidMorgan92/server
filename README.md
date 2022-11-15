# Server

A template for a REST server with authorisation facilitated by JWT access and refresh tokens.

## Configuration

### JWT signing keys

Include a PEM file each for the private and public RSA256 keys for JWT signing and verification. Refer to them in the .env file as described below. Create them with these commands:

```console
openssl genrsa -out private.pem 4096
openssl rsa -in private.pem -pubout -out public.pem
```

### Environment variables

| Variable                                 | Description                                                                                          |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| PORT                                     | Port number that the server listens on                                                               |
| CLIENT_ORIGIN                            | Origin of client requests for Access-Control-Allow-Origin header                                     |
| JWT_PUBLIC_KEY_FILENAME                  | Filename of the RSA public key PEM file for JWT verification                                         |
| GLOBAL_RATE_LIMIT_POINTS                 | Maximum number of requests allowed by the global rate limiter for an IP address in the duration time |
| GLOBAL_RATE_LIMIT_DURATION_SECONDS       | Number of seconds a request will be remembered for by the global rate limiter                        |
| GLOBAL_RATE_LIMIT_BLOCK_DURATION_SECONDS | Number of seconds an IP address will be blocked for exceeding the global rate limit                  |
