function setupProxy({ tls }) {
  const conf = [
    {
      context: [
        '/api',
        '/services',
        '/management',
        '/v3/api-docs',
        '/h2-console',
        '/auth',
        '/health',
        '/v2/api-docs',
        '/swagger-resources/configuration/ui',
        '/swagger-resources/configuration/security',
        '/swagger',
      ],
      target: `http${tls ? 's' : ''}://localhost:8080/app`,
      secure: false,
      changeOrigin: tls,
    },
  ];
  return conf;
}

module.exports = setupProxy;
