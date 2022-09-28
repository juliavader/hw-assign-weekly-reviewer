const Chance = require('chance');

function getMonday( date ) {
  var day = date.getDay() || 7;
  if( day !== 1 )
    date.setHours(-24 * (day - 1));
  return date;
}

function daysIntoYear(date){
  return (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(date.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000;
}

const generateMapping = (individuals) => {
  const seed = daysIntoYear(getMonday(new Date()))
  const chance = new Chance(seed)

  individuals = chance.shuffle(individuals);
  const groups = [];
  for (let i = 0; i < individuals.length - 1; i += 2) {
    const newGroup = [individuals[i], individuals[i + 1]];
    if (!!individuals[i + 2] && !individuals[i + 3]) {
      newGroup.push(individuals[i + 2]);
    }
    groups.push(newGroup);
  }
  return groups;
};

const getPotentialReviewers = (reviewerGroup, assigne) => {
  return  reviewerGroup.filter(reviewer => {
    return reviewer !== assigne
  })
}

const checkInexistantReviewer =  (reviewers, consumer) => {

  const inexistantReviewersList = consumer.filter(el => reviewers.includes(reviewer => reviewer === el) )
    
  if (inexistantReviewersList.length > 0) {
    throw new Error(`Couldn't find user ${inexistantUser.map(el => el)} in existing reviewers`);
  }
}

const errorHandler = (pull_request, assignee, reviewers, consumerError, core) => {
  if (!pull_request) {
    throw new Error(`Couldn't find PR info in current context`);
  }
  if (!assignee) {
    throw new Error(`Couldn't find any user.`);
  }
  if (!reviewers) {
    throw new Error(`no reviewers are defined.`);
  }
  if (!!consumerError) {
    core.setFailed(consumerError);
  }
}

module.exports= { 
  daysIntoYear,
  getMonday,
  generateMapping, 
  getPotentialReviewers, 
  checkInexistantReviewer, 
  errorHandler
}