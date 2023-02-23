#!/usr/bin/env node

/* eslint-disable import/no-nodejs-modules */
const fs = require( 'fs' );
const path = require( 'path' );

const PROJECT_DIR = path.resolve( __dirname, '..' );
const ROOT_DIR = path.resolve( PROJECT_DIR, '..', '..' );
const CHUNKS_MAP_PATH = path.resolve( PROJECT_DIR, 'dist', 'chunks-map.json' );
const CALYPSO_STRINGS_PATH = path.resolve( PROJECT_DIR, 'dist', 'calypso-strings.pot' );
const OUTPUT_PATH = path.resolve( PROJECT_DIR, 'dist', 'translations-manifest.json' );

const chunksMap = JSON.parse(
	fs.readFileSync( CHUNKS_MAP_PATH, {
		encoding: 'utf8',
	} )
);

const calypsoStrings = fs.readFileSync( CALYPSO_STRINGS_PATH, {
	encoding: 'utf8',
} );
const stringRefs = new Set( calypsoStrings.match( /(?<=#:\s).+(?=:\d+)/gm ) );

const translationsRefs = Object.fromEntries(
	Object.entries( chunksMap ).map( ( [ key, refs ] ) => {
		// Paths relative to the root directory and filtered to intersect with calypso-strings.pot refs.
		const normalizedRefs = refs
			.map( ( ref ) => path.relative( ROOT_DIR, ref ) )
			.filter( ( ref ) => stringRefs.has( ref ) );
		return [ key, normalizedRefs ];
	} )
);

// Write translatios manifest file.
fs.writeFileSync( OUTPUT_PATH, JSON.stringify( { references: translationsRefs } ) );

// Clean up.
fs.unlinkSync( CALYPSO_STRINGS_PATH );
fs.unlinkSync( CHUNKS_MAP_PATH );