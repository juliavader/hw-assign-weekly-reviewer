const { Octokit } = require("@octokit/rest")
const github = require('@actions/github');
const core = require('@actions/core');
const {getPotentialReviewers, generateMapping, errorHandler, checkInexistantReviewer} = require('./index.services')


async function run() {
  // get octokit 
  // const token = core.getInput('github-token');
  const token = core.getInput('github-token');
  // const octokit = github.getOctokit(token)
  const octokit = new Octokit({
    auth: token
});
  
  //get repo info
  const { pull_request } = github.context.payload;

  //get assigne and reviewer
  // const assignee = pull_request.assignee.login
  const assignee = 'juliavader' 
  
  // const reviewersString = core.getInput('reviewers', { required: true });
  const reviewersString = 'juliavader, bcarrel, codedams, mgouaillierhw, mdeoliveira-hw, gregamann'
  
  // Get issue assignees
  const reviewers = generateMapping(reviewersString
    .split(',')
    .map((assigneeName) => assigneeName.trim()));

  const { data: consumer, error: consumerError } = await octokit.rest.repos.listCollaborators({
    owner: 'happywait',
    repo: 'hw-front-consumer',
  });

  // errorHandler(pull_request, assignee, reviewers, consumerError, core)

  const potentialReviewers = getPotentialReviewers(reviewers.filter(reviewer => reviewer.includes(assignee))[0], assignee)

  checkInexistantReviewer(potentialReviewers, consumer)

  // const request =  octokit.rest.pulls.requestReviewers({
  //   owner: github.context.payload.repository.owner.login,
  //   repo: pull_request.base.repo.name,
  //   pull_number: pull_request.number,
  //   reviewers: potentialReviewers,
  //   team_reviewers: []
  // })
  // const request =  octokit.rest.pulls.requestReviewers({
  //   owner: 'happywait',
  //   repo: 'hw-front-consumer',
  //   pull_number: '1072',
  //   reviewers: potentialReviewers,
  // })
  const request = octokit.rest.pulls.requestReviewers({
    owner: 'happywait',
    repo: 'hw-front-consumer',
    pull_number: '1117',
    reviewers: ['codedams'],
  })


  // const request = await octokit.request('POST /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers', {
  //   owner: 'happywait',
  //   repo: 'hw-front-consumer',
  //   pull_number: '1117',
  //   reviewers: ['codedams']
  // })
  const { data: requestedReviewers, error: requestReviewersError } = await request

  // console.log("REQUEST REVIEWER AFTER AWAIT", requestedReviewers);
  console.log("REQUEST REVIEWER RESPONSE", requestedReviewers);

  if(!!requestReviewersError) {
    core.setFailed(requestReviewersError.message);  
  }
}

try {
  run();
} catch (error) {
  core.setFailed(error.message);
}
