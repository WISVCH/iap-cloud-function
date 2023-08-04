const google = require('googleapis').google;

exports.getTransitiveGroups = async (email) => {
    const auth = new google.auth.GoogleAuth({
        scopes: ['https://www.googleapis.com/auth/cloud-identity.groups.readonly'],
        keyFilename: 'google-service-account.json'
    });

    const cloudidentity = google.cloudidentity({
        version: 'v1',
        auth: auth,
    });

    const parent = 'groups/-';

    const customerId = 'C03nrg5fp';

    const query = `member_key_id == '${email}' && 'cloudidentity.googleapis.com/groups.discussion_forum' in labels && parent == 'customers/${customerId}'`;

    const response = await cloudidentity.groups.memberships.searchTransitiveGroups({parent, query})

    if (response.status !== 200) {
        console.error(response);
        throw new Error('Error while searching for transitive groups');
    }

    const groups = response.data.memberships.map(group => ({
        name: group.displayName,
        email: group.groupKey.id,
        slug: get_slug_from_email(group.groupKey.id),
    }));

    console.log(groups);

    return groups;
}

const get_slug_from_email = (email) => {
    /* Replace "@ch.tudelft.nl" from the group names
     * 1. Replace "-commissie@ch.tudelft.nl" with ""
     * 2. Replace "-group@ch.tudelft.nl" with ""
     * 3. Replace "@ch.tudelft.nl" with ""
     */
    return email
        .replace("-commissie@ch.tudelft.nl", "")
        .replace("-group@ch.tudelft.nl", "")
        .replace("@ch.tudelft.nl", "")
}