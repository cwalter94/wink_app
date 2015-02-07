/**
 * IMPORTANT * IMPORTANT * IMPORTANT * IMPORTANT * IMPORTANT * IMPORTANT *
 *
 * You should never commit this file to a public repository on GitHub!
 * All public code on GitHub can be searched, that means anyone can see your
 * uploaded secrets.js file.
 *
 * I did it for your convenience using "throw away" credentials so that
 * all features could work out of the box.
 *
 * Untrack secrets.js before pushing your code to public GitHub repository:
 *
 * git rm --cached config/secrets.js
 *
 * If you have already commited this file to GitHub with your keys, then
 * refer to https://help.github.com/articles/remove-sensitive-data
 */

module.exports = {
    wink_client_id: '2ec4f93efd4390a33f6b8dcb12875377' || process.env.WINK_CLIENT_ID,
    wink_secret: 'd7d606469be78ac2a3fce4e5419ab4f1' || process.env.WINK_SECRET
};