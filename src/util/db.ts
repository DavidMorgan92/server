import { Pool, PoolConfig, PoolClient, QueryResult } from 'pg';

/** Postgres connection config */
const config: PoolConfig = {
	connectionString: process.env.DATABASE_URL,
	ssl: { rejectUnauthorized: false },
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
