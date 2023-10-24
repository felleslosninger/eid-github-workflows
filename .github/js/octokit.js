const fetch = require('cross-fetch');
const { Octokit } = require('octokit');

const nextPattern = /(?<=<)([\S]*)(?=>; rel="Next")/i;

module.exports.getRepositories = async function(url) {
  const octokit = new Octokit({
    auth: `${process.env.PLATFORM_TOKEN}`,
    request: {
      fetch: fetch,
    },
  })

  let pagesRemaining = true;
  let data = [];

  while (pagesRemaining) {
    const response = await octokit.request(`GET ${url}`, {
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
      per_page: 100,
    });

    const parsedData = parseData(response.data)
    data = [...data, ...parsedData];

    const linkHeader = response.headers.link;
    pagesRemaining = linkHeader && linkHeader.includes(`rel=\"next\"`);

    if (pagesRemaining) {
      url = linkHeader.match(nextPattern)[0];
    }
  }

  return data;
}

function parseData(data) {
  if (Array.isArray(data)) {
    return data
  }

  if (!data) {
    return []
  }

  delete data.incomplete_results;
  delete data.repository_selection;
  delete data.total_count;
  const namespaceKey = Object.keys(data)[0];
  data = data[namespaceKey];
  return data;
}