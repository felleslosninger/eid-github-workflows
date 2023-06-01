module.exports = async (base, head, repoName, github) => {

    const ignoreList = [];
    const [owner, repo] = repoName.split('/');
      
    const { data: responseData } = await github.rest.repos.compareCommits({
        owner,
        repo,
        base,
        head
      });
    
      let commits = responseData.commits
    
      async function getCommitMessage(ref) {
        return await github.rest.repos.getCommit({
          owner,
          repo,
          ref
        })  
          .then(response => {
            return response.data.commit.message.split('\n')[0];
          });
      }
    
      function containsWordsToIgnore(releaseLogEntry) {
        for (let i = 0; i < ignoreList.length; i++) {
          if (releaseLogEntry.includes(ignoreList[i])) {
            return true;
          }
        }
        return false;
      }
    
      function getReleaseLogEntries(commits) {
        let releaseLogEntries = []
    
        commits.map(commit => {
          const releaseLogEntry = getFirstCommitLine(commit.commit.message)
          if (isValidReleaseLogEntry(releaseLogEntry)) {
            releaseLogEntries.push(releaseLogEntry);
          }
        });
    
        return releaseLogEntries
    
      }
    
      async function getReleaseLogEntry(ref) {
    
        const commitMessage =  await getCommitMessage(ref)
    
        const releaseLogEntry = getFirstCommitLine(commitMessage)
    
        return releaseLogEntry
    
      }
    
      function isValidReleaseLogEntry(releaseLogEntry) {
        if (ignoreList.length !== 0) {
          if(containsWordsToIgnore(releaseLogEntry)) {
            return false
          }
        }
        return true
      }
    
      function getFirstCommitLine(message) {
        return message.split('\n')[0]
      }
    
    
      async function createReleaseLog(commits) {
        let releaseLog = []
    
        if (commits !== 0) {
          let releaseLogEntries = []
          releaseLogEntries = getReleaseLogEntries(commits)
          releaseLog.push(...releaseLogEntries)
        } else {
    
          const headReleaseLogEntry = getReleaseLogEntry(head)
    
          if(isValidReleaseLogEntry(headReleaseLogEntry)) {
            releaseLog.push(headReleaseLogEntry)
          }
        }
    
        return releaseLog.reverse()
    
      }
    
      const releaseLog = await createReleaseLog(commits)
    
      return releaseLog
    
    }