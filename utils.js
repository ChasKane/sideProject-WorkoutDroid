import _ from 'lodash';

export class Deadzone {
  constructor(startHour, startMinute, endHour, endMinute, id) {
    this.id = id || makeID();
    this.setStart(startHour, startMinute);
    this.setEnd(endHour, endMinute);
  }
  setStart = (h, m) => { this.start = h<24 ? h*60+m : 24*60 };
  setEnd = (h, m) => { this.end = h<24 ? h*60+m : 24*60 };
  contains = (h, m) => {
    const t = h<24 ? h*60+m : 24*60;
    return this.start <= t && t < this.end;
  }
  containsByMinute = (m) => {
    return this.start <= m && m < this.end;
  }
}

// General formula: totalActions/totalMinutes = actionsPerSet/minutesBetweenSets
// minutesBetweenSets and actionsPerSet are the variables, the others stay constant unless changed explicitly
export const reballance = (totalActions, minutesBetweenSets, actionsPerSet, deadzones, changedVariable) => {
  let { totalMinutes } = getTotalMinutes(deadzones);
  let scaler = (totalActions/totalMinutes) / (actionsPerSet/minutesBetweenSets);
  switch(changedVariable) {
    case "totalActions":
    case "deadzones":
      return {
        totalActions:        totalActions
        ,totalMinutes:       totalMinutes
        ,actionsPerSet:      Math.floor(actionsPerSet*Math.sqrt(scaler))
        ,minutesBetweenSets: Math.floor(minutesBetweenSets/Math.sqrt(scaler))
      };
    case "minutesBetweenSets":
      return {
        totalActions:        totalActions
        ,totalMinutes:       totalMinutes
        ,actionsPerSet:      Math.floor(actionsPerSet/scaler)
        ,minutesBetweenSets: minutesBetweenSets
      };
    case "actionsPerSet":
      return {
        totalActions:        totalActions
        ,totalMinutes:       totalMinutes
        ,actionsPerSet:      actionsPerSet
        ,minutesBetweenSets: Math.floor(minutesBetweenSets*scaler)
      };
    default:
      return {
        totalActions:        totalActions
        ,totalMinutes:       totalMinutes
        ,actionsPerSet:      actionsPerSet
        ,minutesBetweenSets: minutesBetweenSets
      };
  }
};

export const getTotalMinutes = deadzones => {
  let totalMinutes = 24 * 60;
  if(!deadzones) return {totalMinutes: totalMinutes, sortedDeadzones: []}
  const sortedDeadzones = Object.entries(deadzones).map(item => item[1]).sort((dz1, dz2) => dz1.start - dz2.start)
  sortedDeadzones.map(dz => { totalMinutes -= dz.end - dz.start });
  return {totalMinutes: totalMinutes, sortedDeadzones: sortedDeadzones}
}

export const calcNotifications = (total, minutesBetweenSets, actionsPerSet, deadzones) => {
  let { totalMinutes, sortedDeadzones } = getTotalMinutes(deadzones)
  let totalNotifications = Math.floor(totalMinutes / minutesBetweenSets);
  let notifications = new Array(totalNotifications);
  let minuteCountdown = 0, ni = 0, dzi = 0, ct = 0;
  while(ni < totalNotifications) {
    if(sortedDeadzones && dzi < sortedDeadzones.length && sortedDeadzones[dzi].containsByMinute(ct)) {
      ct = sortedDeadzones[dzi++].end;
      continue;
    }
    if(minuteCountdown == 0) {
      notifications[ni++] = new Notification(ct);
      minuteCountdown = minutesBetweenSets;
    }
    if(sortedDeadzones && dzi < sortedDeadzones.length && ct + minuteCountdown >= sortedDeadzones[dzi].start) {
      minuteCountdown -= sortedDeadzones[dzi].start - ct;
      ct = sortedDeadzones[dzi].start;
    } else {
      ct += minuteCountdown;
      minuteCountdown = 0;
    }
  }
};

// TODO: takes in notification to push (not just delay -- there should be an option to remind in a very short time or delay till later) and finds the first soft deadzone to toss it into
export const reCalcNotifications = (total, minutesBetweenSets, actionsPerSet, deadzones) => {
  let { totalMinutes, sortedDeadzones } = getTotalMinutes(deadzones)
  let totalNotifications = Math.floor(totalMinutes / minutesBetweenSets);
  let notifications = new Array(totalNotifications);
  let minuteCountdown = 0, ni = 0, dzi = 0, ct = 0;
  while(ni < totalNotifications) {
    if(sortedDeadzones && dzi < sortedDeadzones.length && sortedDeadzones[dzi].containsByMinute(ct)) {
      ct = sortedDeadzones[dzi++].end;
      continue;
    }
    if(minuteCountdown == 0) {
      notifications[ni++] = new Notification(ct);
      minuteCountdown = minutesBetweenSets;
    }
    if(sortedDeadzones && dzi < sortedDeadzones.length && ct + minuteCountdown >= sortedDeadzones[dzi].start) {
      minuteCountdown -= sortedDeadzones[dzi].start - ct;
      ct = sortedDeadzones[dzi].start;
    } else {
      ct += minuteCountdown;
      minuteCountdown = 0;
    }
  }
};

export const getNotificationActions = (delay=1) => ([
  {
    actionId: "newDeadzone"
    , buttonTitle: "New Deadzone"
    , textInput: {
      submitButtonTitle: "New Deadzone"
      , placeholder: "How many minutes? (enter a number)"
    }
  }
  , {
    actionId: "done"
    , buttonTitle: "👌"
  }
  , {
    actionId: "delay1"
    , buttonTitle: `⏱  ${delay} min`
  }
  , {
    actionId: "pushToLater"
    , buttonTitle: `later`
  }
]);

export const androidChannel = {
  name: "WerkDroid"
  , sound: true
  , vibrate: true
}

// https://gist.github.com/jed/982883
export const makeID = a => a ? (a^Math.random()*16>>a/4).toString(16) : ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, makeID);
