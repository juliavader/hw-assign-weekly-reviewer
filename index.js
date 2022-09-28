const github = require('@actions/github');
const core = require('@actions/core');
const {getPotentialReviewers, generateMapping, errorHandler, checkInexistantReviewer} = require('./index.services')


async function run() {
  // get octokit 
  const token = core.getInput('github-token');
  const octokit = github.getOctokit(token)
  
  //get repo info
  const { pull_request, event } = github.context.payload;
  console.log("Pull request:" , pull_request)

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
  console.log("asked reviewers: ", potentialReviewers)

  checkInexistantReviewer(potentialReviewers, consumer)

  const { data: requestedReviewers, error: requestReviewersError } = await octokit.rest.pulls.requestReviewers({
    owner: github.context.payload.repository_owner,
    repo: github.context.payload.event.pull_request.base.repo.repository.name,
    pull_number: github.context.payload.event.number,
    reviewers: potentialReviewers
  })
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
