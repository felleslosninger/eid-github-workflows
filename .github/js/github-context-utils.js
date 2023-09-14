module.exports.getHeadCommitMessage = function(github) {
    const obj = JSON.parse(JSON.stringify(github));
    let message = obj.event.commits[0].message;
    if (obj.event.hasOwnProperty('head_commit')) {
        const splitted = obj.event.head_commit.message.split("\n");
        message = splitted[0];
    }
    return message;
}

module.exports.getRepository = function(github) {
    const json = JSON.parse(JSON.stringify(github));
    return json.repository;
}

module.exports.getSHA = function(github) {
    const json = JSON.parse(JSON.stringify(github));
    return json.sha;
}
