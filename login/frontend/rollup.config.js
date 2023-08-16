import { spawn } from 'child_process';
import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import css from 'rollup-plugin-css-only';
import typescript from '@rollup/plugin-typescript';

const production = !process.env.ROLLUP_WATCH;

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

const aliases = alias({
	resolve: ['.svelte'],
	entries: [
		// { find: '@synap/office', 'replacement': path.resolve(__dirname, '')},
		// { find: '@synap/resources', 'replacement': path.resolve(__dirname, 'service/resources')},
		// { find: '@synap/components', 'replacement': path.resolve(__dirname, 'service/Components')},
		// { find: '@synap/utils', 'replacement': path.resolve(__dirname, 'service/Utils')},
		{ find: '@login/resources', 'replacement': path.resolve(__dirname, 'login/resources') }
	]
});

const entries = [
	'login'
];

export default entries.map(entryName => {
	return {
		// input: `./service/Pages/${entryName}/src/main.js`,
		input: 'src/main.ts',
		output: [
			{
				// sourcemap: !production,
				sourcemap: true,
				format: 'iife',
				name: 'app',
				// file: `./dist/service/${entryName}/bundle.js`
				file: `../src/main/resources/static/dist/build/frontend/${entryName}/bundle.js`
			},
			{
				sourcemap: !production,
				format: 'iife',
				name: 'app',
				// file: `./service/Pages/${entryName}/public/bundle.js`
				file: `../src/main/resources/static/dist/build/frontend/${entryName}/public/bundle.js`
			}
		],
		plugins: [
			aliases,
			svelte({
				// preprocess: sveltePreprocess({ sourceMap: !production }),
				compilerOptions: {
					// enable run-time checks when not in production // 회사 프로젝트에 없음
					dev: !production
				}
			}),
			// we'll extract any component CSS out into
			// a separate file - better for performance
			css({ output: 'bundle.css' }),

			// If you have external dependencies installed from
			// npm, you'll most likely need these plugins. In
			// some cases you'll need additional configuration -
			// consult the documentation for details:
			// https://github.com/rollup/plugins/tree/master/packages/commonjs
			resolve({
				browser: true,
				dedupe: ['svelte'],
				// exportConditions: ['svelte'] // 회사 프로젝트에 없음
			}),
			commonjs(),
			typescript({
				sourceMap: !production,
				inlineSources: !production
			}),

			// In dev mode, call `npm run start` once
			// the bundle has been generated
			!production && serve(), // 회사 프로젝트에 없음

			// Watch the `public` directory and refresh the
			// browser on changes when not in production
			!production && livereload('public'), // 회사 프로젝트에 없음

			// If we're building for production (npm run build
			// instead of npm run dev), minify
			production && terser()
		],
		watch: {
			clearScreen: false
		}
	}
});
