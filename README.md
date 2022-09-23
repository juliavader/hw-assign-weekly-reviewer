# hw-assign-weekly-reviewer
This project is a github action to assign weekly reviewers


## Reviewers

## `reviewers`

**Required** userNames of user that are linked to project in an array. Default `"juliavader, bcarrel"`.

## Outputs

Assigns a user to the pr.

## Example usage

uses: actions/hw-assign-weekly-reviewer@v1.1
with:
  reviewers: 'juliavader, bcarrel,codedams'