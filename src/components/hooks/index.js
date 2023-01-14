import { useOvermind } from '../../overmind';

class EventClass {
  functionMap = {};

  addEventListener(event, func) {
    this.functionMap[event] = func;
    document.addEventListener(event.split('.')[0], this.functionMap[event]);
  }

  removeEventListener(event) {
    document.removeEventListener(event.split('.')[0], this.functionMap[event]);
    delete this.functionMap[event];
  }
}

export const useEvent = () => {
  const event = new EventClass();
  return event;
};

export const useCumulativeOffset = () => {
  const cumulativeOffset = (element) => {
    let top = 0;
    let left = 0;
    let el = element;

    do {
      top += el.offsetTop || 0;
      left += el.offsetLeft || 0;
      el = el.offsetParent;
    } while (el);

    return {
      top,
      left,
    };
  };
  return cumulativeOffset;
};

export const useConvertTimeToHour = () => {
  const convertTimeToHour = (time) => {
    //let day = Math.floor(time / 24);
    let hour = Math.floor(time);
    let minute = (time - hour) * 60;
    //if (minute === 0) minute = '00';
    //if (hour > 23) hour -= 24;
    //if (hour > 23) hour -= 24;
    // if (day) return `${day}j ${hour}h${minute}`;
    return `${hour}h${minute}`;
  };

  return convertTimeToHour;
};

export const useConvertTimeToHourEn = () => {
  const convertTimeToHour = (time) => {
    let hour = Math.floor(time);
    let type = 'AM';
    let minute = (time - hour) * 60;
    if (hour > 12) {
      hour -= 12;
      type = 'PM';
    }
    return `${hour > 9 ? hour : `0${hour}`}:${
      minute > 9 ? minute : `0${minute}`
    } ${type}`;
  };

  return convertTimeToHour;
};

export const useConvertTimeToJira = () => {
  const convertTimeToHour = (time) => {
    let hour = Math.floor(time);
    let minute = (time - hour) * 60;
    if (hour > 23) hour -= 24;
    return `${hour ? `${hour}h` : ''}${minute ? ` ${minute}m` : ''}`.trim();
  };

  return convertTimeToHour;
};

export const useToolsStep = (indexDay) => {
  const { state } = useOvermind();
  const [start, end] = state.Timeline.userPreferences.weekOfWork.find(
    (e) => e.day === indexDay
  )?.hours;
  const length = (end - start) / state.Timeline.userPreferences.step;
  const array = Array(length).keys();
  const steps = [...array].map((e, i) => ({
    integer: Number.isInteger((i + 1) * state.Timeline.userPreferences.step),
    timeStart: i * state.Timeline.userPreferences.step + start,
    timeEnd:
      i * state.Timeline.userPreferences.step +
      start +
      state.Timeline.userPreferences.step,
    percentStart: i * (100 / length),
    percentEnd: (i + 1) * (100 / length),
  }));

  const getPercentByTime = (time) =>
    steps.reduce(
      (a, e) => (a === 100 && e.timeStart >= time ? e.percentStart : a),
      100
    );

  const getPercentByTimeEnd = (time) =>
    steps.reduce(
      (a, e) => (a === 100 && e.timeEnd >= time ? e.percentStart : a),
      100
    );

  const getLimitByPercent = (percentStart, percentEnd) =>
    steps.reduce((a, e) => {
      if (
        a.length === 0 &&
        (e.percentEnd > percentStart || percentEnd < e.percentEnd)
      ) {
        a[0] = e.timeStart;
      }
      if (
        a.length >= 1 &&
        (percentEnd >= e.percentStart || e.percentStart <= percentStart)
      ) {
        a[1] = e.timeEnd;
      }
      return a;
    }, []);

  return { steps, getPercentByTime, getPercentByTimeEnd, getLimitByPercent };
};
