import moment from 'moment';

export interface ScheduleApiResponse {
  status: string;
  result: {
    id: string;
    name: string;
    description: string | null;
    category_id: string;
    thumbnail: string | null;
    avatar: string | null;
    owner_type: string;
    user_id: string | null;
    status: number;
    is_verified: number;
    is_deleted: number;
    fee: number;
    say_hello: string | null;
    schedules: Array<Record<string, any>>;
    updated_at: number;
    created_at: number;
    owner_id: string;
    userInfo?: any;
    ownerInfo?: any;
    manager?: any;
    categories?: any[];
    [key: string]: any;
  };
}

export interface ParsedSchedule {
  dateRange: {
    dayFrom: string; // 'YYYY-MM-DD'
    dayTo: string;   // 'YYYY-MM-DD'
    displayString: string; // '27/8/2026 - 30/9/2026'
  };
  scheduleExcept: string; // e.g. '2,5'
  selectedDays: string[]; // ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
  timeSlots: Array<{ id: string; from: string; to: string }>;
  daysOff: Array<{ id: string; startDate: string; endDate: string }>;
  rawSchedules: Array<Record<string, any>>;
}

const DAY_MAP_API_TO_UI: Record<string, string> = {
  schedule_day_2: 'T2',
  schedule_day_3: 'T3',
  schedule_day_4: 'T4',
  schedule_day_5: 'T5',
  schedule_day_6: 'T6',
  schedule_day_7: 'T7',
  schedule_day_8: 'CN',
};

const DAY_MAP_UI_TO_API: Record<string, string> = {
  T2: 'schedule_day_2',
  T3: 'schedule_day_3',
  T4: 'schedule_day_4',
  T5: 'schedule_day_5',
  T6: 'schedule_day_6',
  T7: 'schedule_day_7',
  CN: 'schedule_day_8',
};

/**
 * Parses API schedules array into UI structured state
 */
export function parseScheduleResponse(
  schedules: Array<Record<string, any>> = [],
): ParsedSchedule {
  const selectedDays: string[] = [];
  const timeSlotsMap: Record<number, { from?: string; to?: string }> = {};
  let dayFrom = '2026-08-27';
  let dayTo = '2026-09-30';
  let scheduleExcept = '2,5';

  if (Array.isArray(schedules) && schedules.length > 0) {
    schedules.forEach(item => {
      // 1. Check schedule date range (day_from, day_to)
      if (item.day_from && item.day_to) {
        const fromMoment = moment(item.day_from);
        const toMoment = moment(item.day_to);
        if (fromMoment.isValid() && toMoment.isValid()) {
          dayFrom = fromMoment.format('YYYY-MM-DD');
          dayTo = toMoment.format('YYYY-MM-DD');
        }
        return;
      }

      // 2. Check schedule_except (Days off / non-working days e.g. "2,5")
      if (item.schedule_except !== undefined) {
        scheduleExcept = String(item.schedule_except);
        return;
      }

      // 3. Check schedule_day_X (T2 -> CN)
      Object.keys(DAY_MAP_API_TO_UI).forEach(apiKey => {
        if (item[apiKey] === 1) {
          const uiDay = DAY_MAP_API_TO_UI[apiKey];
          if (!selectedDays.includes(uiDay)) {
            selectedDays.push(uiDay);
          }
        }
      });

      // 4. Check time_fromX / time_toX
      Object.keys(item).forEach(key => {
        const fromMatch = key.match(/^time_from(\d+)$/);
        if (fromMatch) {
          const slotIndex = parseInt(fromMatch[1], 10);
          timeSlotsMap[slotIndex] = {
            ...timeSlotsMap[slotIndex],
            from: item[key],
          };
        }

        const toMatch = key.match(/^time_to(\d+)$/);
        if (toMatch) {
          const slotIndex = parseInt(toMatch[1], 10);
          timeSlotsMap[slotIndex] = {
            ...timeSlotsMap[slotIndex],
            to: item[key],
          };
        }
      });
    });
  }

  // Convert timeSlotsMap to array
  const timeSlots = Object.keys(timeSlotsMap)
    .sort((a, b) => Number(a) - Number(b))
    .map(key => {
      const num = Number(key);
      const slot = timeSlotsMap[num];
      return {
        id: `slot_${num}`,
        from: slot.from || '08:00',
        to: slot.to || '21:00',
      };
    });

  // Default fallback if time slots were empty
  if (timeSlots.length === 0) {
    timeSlots.push(
      { id: '1', from: '08:00', to: '21:00' },
      { id: '2', from: '10:00', to: '21:00' },
      { id: '3', from: '13:00', to: '21:00' },
    );
  }

  // If selectedDays empty, select all days as default
  if (selectedDays.length === 0) {
    selectedDays.push('T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN');
  }

  const sM = moment(dayFrom);
  const eM = moment(dayTo);
  const displayString = `${sM.format('D/M/YYYY')} - ${eM.format('D/M/YYYY')}`;

  return {
    dateRange: {
      dayFrom,
      dayTo,
      displayString,
    },
    scheduleExcept,
    selectedDays,
    timeSlots,
    daysOff: [
      { id: '1', startDate: dayFrom, endDate: dayTo },
    ],
    rawSchedules: schedules,
  };
}

/**
 * Formats UI state into exact API schedules array format
 */
export function formatSchedulePayload(
  selectedDays: string[],
  timeSlots: Array<{ from: string; to: string }>,
  daysOff: Array<{ startDate: string; endDate: string }>,
  options?: {
    startDate?: string;
    endDate?: string;
    scheduleExcept?: string;
  },
): Array<Record<string, any>> {
  const result: Array<Record<string, any>> = [];

  // 1. Date range (day_to, day_from) in ISO format
  const startIso = options?.startDate
    ? moment(options.startDate).startOf('day').toISOString()
    : '2026-08-26T17:00:00.000Z';
  const endIso = options?.endDate
    ? moment(options.endDate).endOf('day').toISOString()
    : '2026-09-29T17:00:00.000Z';

  result.push({
    day_to: endIso,
    day_from: startIso,
  });

  // 2. Schedule except (non-working days)
  result.push({
    schedule_except: options?.scheduleExcept ?? '2,5',
  });

  // 3. Schedule days (schedule_day_2 -> schedule_day_8)
  const allDays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  allDays.forEach(day => {
    const apiKey = DAY_MAP_UI_TO_API[day];
    result.push({
      [apiKey]: selectedDays.includes(day) ? 1 : 0,
    });
  });

  // 4. Time slots (time_from1, time_to1, ...)
  timeSlots.forEach((slot, index) => {
    const slotNum = index + 1;
    result.push({ [`time_from${slotNum}`]: slot.from });
  });

  timeSlots.forEach((slot, index) => {
    const slotNum = index + 1;
    result.push({ [`time_to${slotNum}`]: slot.to });
  });

  return result;
}
