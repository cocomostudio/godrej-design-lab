
const path = require( "node:path" )
const os = require( "node:os" )

/**
 |
 | PM2, for the CMS host.
 |
 |     cd <checkout> && pm2 start infra/production/cms-host/pm2/ecosystem.config.cjs --env production
 |     pm2 save
 |
 | Only the CMS is declared here. The website runs under PM2 on its own host
 | (see infra/production/website-host). A host's ecosystem file is a
 | description of that host.
 |
 | ## Reading `.env`
 |
 | This file is plain CommonJS that Node evaluates when `pm2 start` runs, so it
 | can read the host's `.env` itself. Two things follow from *when* that
 | happens:
 |
 |   - The `.env` has to exist on this machine at start time, which is why it is
 |     resolved against `__dirname` rather than the cwd.
 |
 |   - The values are resolved once and then frozen into PM2's dump by
 |     `pm2 save`. `pm2 resurrect` after a reboot replays the saved values; it
 |     does not re-read `.env`. Editing `.env` therefore means running
 |     `pm2 start ... --env production` again and `pm2 save` again.
 |     `pm2 restart --update-env` does NOT do this — it re-reads the calling
 |     shell's environment, not this file.
 |
 */

const env_path = path.join( __dirname, "..", ".env" )

try {
	process.loadEnvFile( env_path )
}
catch {
	throw new Error(
		`ecosystem.config.cjs: no .env at ${env_path} — copy the .env.example beside it and fill it in.`,
	)
}

const repository_root = path.resolve( __dirname, "..", "..", "..", ".." )
const NODE_VERSION = "22.17.0"

/**
 |
 | PM2 stringifies whatever it is given, so a missing key arrives at the
 | application as the literal string "undefined" and is parsed as a path or a
 | port. Failing here, by name, at deploy time is the cheaper failure.
 |
 */
function required ( key ) {
	const value = process.env[ key ]

	if ( value === undefined || value.trim() === "" ) {
		throw new Error(
			`ecosystem.config.cjs: ${key} is missing from ${env_path}`,
		)
	}

	return value.trim()
}

module.exports = {
	apps: [
		{
			// --- Identity ---
			name: "cms__godrej-design-lab",
			cwd: repository_root,

			// --- Launcher ---
			script: `${ os.homedir() }/.nvm/versions/node/v${ NODE_VERSION }/bin/pnpm`,
			args: "-F cms run start",
			interpreter: `${ os.homedir() }/.nvm/versions/node/v${ NODE_VERSION }/bin/node`,

			// --- Process model ---
			exec_mode: "fork",
			instances: 1,
			autorestart: true,
			watch: false,

			// --- Reliability ---
			max_memory_restart: "1G",
			min_uptime: "10s",
			max_restarts: 10,
			restart_delay: 4000,
			exp_backoff_restart_delay: 100,

			// --- Shutdown ---
			//
			// No `wait_ready` here: this Strapi app does not call
			// `process.send( "ready" )`, so PM2 would only ever time out
			// waiting for it. PM2 considers the process online as soon as it
			// is spawned.
			kill_timeout: 5000,

			// --- Logging ---
			error_file: required( "CMS_ERROR_LOG" ),
			out_file: required( "CMS_OUT_LOG" ),
			merge_logs: true,
			log_date_format: "YYYY-MM-DD HH:mm:ss Z",
			time: true,

			// --- Source maps ---
			source_map_support: true,

			// --- Environments ---
			//
			// Deliberately no PORT here. Strapi reads apps/cms/.env, and a value
			// set in this block would win over it. The port lives in
			// apps/cms/.env; when nginx arrives, its CMS_PORT in this host's
			// .env exists so the proxy knows where to reach the app, and the
			// two have to be kept equal by hand.
			env: {
				NODE_ENV: "development",
			},
			env_production: {
				NODE_ENV: "production",
			},
		},
	],
}
