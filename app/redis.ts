
import * as redis from 'redis';



const cacheHostName = process.env.REDISCACHE_HOSTNAME || '';
const cachePassword = process.env.REDISCACHE_PASSWORD || '';
console.log('hostname', cacheHostName)
const redisClient = redis.createClient({
    // rediss for TLS
    url: `rediss://${cacheHostName}`,
    password: cachePassword
});
redisClient.connect();

export default redisClient;


const WINDOW_SIZE_IN_SECONDS = 60;
const MAX_WINDOW_REQUEST_COUNT = 10;
const WINDOW_LOG_INTERVAL_IN_SECONDS = 5;

export async function rateLimiter(ip: string) {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const windowStartTimestamp = currentTimestamp - WINDOW_SIZE_IN_SECONDS;

    // Get the number of requests made by the IP address in the current window
    const requestsInWindow = await redisClient.zRangeByScore(
        ip,
        windowStartTimestamp,
        currentTimestamp
    );

    // If the number of requests is greater than the maximum allowed, return an error
    if (requestsInWindow.length >= MAX_WINDOW_REQUEST_COUNT) {
        console.log(`IP ${ip} has exceeded rate limit`);
        return true;
    }

    // Add the current request to the Redis cache
    await redisClient.zAdd(ip, { value: currentTimestamp.toString(), score: currentTimestamp });

    // Remove any requests that are outside of the current window
    await redisClient.zRemRangeByScore(ip, 0, windowStartTimestamp);

    // Log the number of requests made in the current window
    if (currentTimestamp % WINDOW_LOG_INTERVAL_IN_SECONDS === 0) {
        const count = await redisClient.zCard(ip);
        console.log(`IP ${ip} has made ${count} requests in the last ${WINDOW_SIZE_IN_SECONDS} seconds`);
    }
    return false;
}