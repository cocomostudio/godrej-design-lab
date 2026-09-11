
const path = require( "node:path" )
const os = require( "node:os" )

/**
 |
 | PM2, for the website (`few`) host — the production environment.
 |
 |     cd <checkout> && pm2 start infra/production/website-host/pm2/ecosystem.config.cjs --env production
 |     pm2 save
 |
 | Fork mode, one instance, autorestart on, watch off, logs and pid under
 | ~/.pm2: all PM2 defaults, deliberately not restated here.
 |
 */

const repository_root = path.resolve( __dirname, "..", "..", "..", ".." )
const NODE_VERSION = "22.17.0"

module.exports = {
	apps: [
		{
			// --- Identity ---
			name: "website__godrej-design-lab",
			cwd: repository_root,

			// --- Launcher ---
			//
			// Absolute nvm paths: `pm2 resurrect` (after reboot, via
			// `pm2 startup`) does not run through a login shell, so a bare
			// `pnpm` resolved via PATH would not be found there.
			script: `${ os.homedir() }/.nvm/versions/node/v${ NODE_VERSION }/bin/pnpm`,
			args: "-F few run start",
			interpreter: `${ os.homedir() }/.nvm/versions/node/v${ NODE_VERSION }/bin/node`,

			// --- Environments ---
			env: {
				NODE_ENV: "development",
			},
			env_production: {
				NODE_ENV: "production",
			},
		},
	],
}
