import 'calypso/state/posts/init';

/**
 * Returns the PostsQueryManager from the state tree for a given site ID (or
 * for queries related to all sites at once).
 *
 * @param   {Object}  state  Global state tree
 * @param   {?number} siteId Site ID, or `null` for all-sites queries
 * @returns {Object}         Posts query manager
 */
export function getQueryManager( state, siteId ) {
	if ( ! siteId ) {
		return state.posts.allSitesQueries;
	}
	return state.posts.queries[ siteId ] || null;
}
