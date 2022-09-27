# hw-assign-weekly-reviewer
This project is a github action to assign weekly reviewers to a user pull request.

## Required
## `reviewers`

**Required** reviewers as array of github usernames 

## `github-token`

## Outputs

Assigns one of the same reviewer weekly to your pull requests.

## Example usage

uses: actions/hw-assign-weekly-reviewer@v1.1
with:
  reviewers: ['juliavader', 'bcarrel', 'codedams', 'mgouaillierhw', 'mdeoliveira-hw', 'gregamann']
  github-token: ${{ secrets.GITHUB_TOKEN }}