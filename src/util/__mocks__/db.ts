import { Pool, PoolConfig, PoolClient, QueryResult } from 'pg';

/** Postgres connection config */
const config: PoolConfig = {
	database: 'server',
	user: 'postgres',
	password: 'postgres',
	port: 5432,
	max: 1, // Reuse the connection to make sure we always hit the same temporal schema
	idleTimeoutMillis: 0, // Disable auto-disconnection of idle clients to make sure we always hit the same temporal schema
};

/** Postgres connection pool */
const pool = new Pool(config);

/**
 * Execute a query on the database
 * @param text Query string
 * @param params Parameters
 * @returns Query result
 */
export async function query(
	text: string,
	params?: any[],
): Promise<QueryResult<any>> {
	return pool.query(text, params);
}

/**
 * Get a connection to the database
 * @returns Connection to database
 */
export async function getClient(): Promise<PoolClient> {
	return pool.connect();
}

/**
 * Clean up connection; call this when all tests are finished
 * @returns Promise to close the connection pool
 */
export async function end(): Promise<void> {
	return pool.end();
}
