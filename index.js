const github = require('@actions/github');
const core = require('@actions/core');
const {getPotentialReviewers, generateMapping, errorHandler, checkInexistantReviewer} = require('./index.services')


async function run() {
  // get octokit 
  const token = core.getInput('github-token');
  const octokit = github.getOctokit(token)
  
  //get repo info
  const { pull_request } = github.context.payload;

  //get assigne and reviewer
  const assignee = pull_request.assignee.login
  const reviewersString = core.getInput('reviewers', { required: true });
  
  // Get issue assignees
  const reviewers = generateMapping(reviewersString
    .split(',')
    .map((assigneeName) => assigneeName.trim()));

  const { data: consumer, error: consumerError } = await octokit.rest.repos.listCollaborators({
    owner: 'happywait',
    repo: 'hw-front-consumer',
  });

  errorHandler(pull_request, assignee, reviewers, consumerError, core)

  const potentialReviewers = getPotentialReviewers(reviewers.filter(reviewer => reviewer.includes(assignee))[0], assignee)

  checkInexistantReviewer(potentialReviewers, consumer)

  const { data: requestedReviewers, error: requestReviewersError } = await octokit.rest.pulls.requestReviewers({
    owner: pull_request.repository.name,
    repo: pull_request.user.name,
    pull_number: pull_request.number,
    reviewers: potentialReviewers
  })
  console.log("asked reviewers: ", potentialReviewers)
  console.log("REST response: ", requestedReviewers);

  if(!!requestReviewersError) {
    core.setFailed(requestReviewersError.message);  
  }
}

try {
  run();
} catch (error) {
  core.setFailed(error.message);
}
