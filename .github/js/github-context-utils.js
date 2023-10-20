module.exports.getCommitMessage = function(github) {
    const obj = JSON.parse(JSON.stringify(github));
    const commitMessage = (function() {
        let message = '';
        if (obj.event.hasOwnProperty('action')) {
            message = getCommitMessageTriggeredByAction(github);
        } else if (obj.event.hasOwnProperty('head_commit')) {
            message = getHeadCommitMessage(github);
        } else if (obj.event.hasOwnProperty('commits')) {
            message = getOrdinaryCommitMessage(github);
        } else {
            // Do nothing
        }

        return message;
        }());
    return commitMessage;
  }

  module.exports.getRepository = function(github) {
    const json = JSON.parse(JSON.stringify(github));
    return json.repository;
  }

  module.exports.getSHA = function(github) {
    const json = JSON.parse(JSON.stringify(github));
    return json.sha;
  }

  function getCommitMessageTriggeredByAction(githubContext) {
    const obj = JSON.parse(JSON.stringify(githubContext));
    let commitMessage = '';
    const action = obj.event.action;
    commitMessage = "Erronous workflow was triggered by Action: " + action;
    if (obj.event.hasOwnProperty('client_payload')) {
        const clientPayload = obj.event.client_payload;
        if (clientPayload.hasOwnProperty('application-name')) {
            commitMessage = commitMessage + " for Application(s): " + clientPayload["application-name"];
        }
        if (clientPayload.hasOwnProperty('pr-labels')) {
            commitMessage = commitMessage + " with Labels: " + clientPayload["pr-labels"];
        }
        if (clientPayload.hasOwnProperty('pr-number')) {
            commitMessage = commitMessage + " and PR: #" + clientPayload["pr-number"];
        }
    }
    return commitMessage;
  }

  function getHeadCommitMessage(githubContext) {
    const obj = JSON.parse(JSON.stringify(githubContext));
    let headCommitMessage = '';
    const message = obj.event.head_commit.message;
    if (message.includes("\n")) {
        const splittedMessage = message.split("\n");
        headCommitMessage = splittedMessage[0];
    } else {
        headCommitMessage = message;
    }
    return headCommitMessage
  }

  function getOrdinaryCommitMessage(githubContext) {
    const obj = JSON.parse(JSON.stringify(githubContext));
    return obj.event.commits[0].message;
  }
