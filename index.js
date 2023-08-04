const gcipCloudFunctions = require('gcip-cloud-functions');
const getTransitiveGroups = require('./google-groups.js').getTransitiveGroups;

const authClient = new gcipCloudFunctions.Auth();

exports.beforeSignIn = authClient.functions().beforeSignInHandler(async (user, context) => {
    try {
        // Add custom claims to the user.
        const email = user.email;

        const groups = await getTransitiveGroups(email);

        return {
            customClaims: {
                groups: groups.map(group => group.slug).join(','),
            }
        }
    } catch (error) {
      console.log(error);
      throw new gcipCloudFunctions.https.HttpsError('internal');
    }
});