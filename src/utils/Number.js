
/**
 * Get a random integer in the specified interval
 *
 * @return {Int} int Returns a randomly generated integer
 */
export function numberRand (n, m) {
    var c = m - n + 1;

    return Math.floor(Math.random() * c + n);
}
