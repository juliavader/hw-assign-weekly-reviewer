const github = require('@actions/github');
const core = require('@actions/core');
const {getPotentialReviewers,  errorHandler, checkInexistantReviewer} = require('./index.services')


async function run() {
  // get octokit 
    const token = core.getInput('githubToken');
    const octokit = github.getOctokit(token)
    
    //get repo info
    const { pull_request } = github.context.payload;
   
    //get assigne and reviewer
    const assigne = pull_request.user.login
    const reviewers = core.getInput('reviewers');
    const { data: consumer, error: consumerError } = await octokit.rest.repos.listCollaborators({
      owner: 'happywait',
      repo: 'hw-front-consumer',
    });

    errorHandler(pull_request, assigne, reviewers, consumerError, core)
    
    const potentialReviewers = getPotentialReviewers(reviewers.filter(reviewer => reviewer.includes(assigne))[0], assigne)

    checkInexistantReviewer(potentialReviewers, consumer)

    try {
      await octokit.request('POST /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers', {
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        pull_number: github.context.payload.pull_request.number,
        reviewers: potentialReviewers
      })
    } catch (error) {
      core.setFailed(error.message);
    }

}

try {
  run();
} catch (error) {
  core.setFailed(error.message);
}