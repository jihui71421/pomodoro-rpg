// 이 파일은 앱의 데이터를 휴대폰(기기) 안에 저장하고 불러오는 역할을 담당한다.
// AsyncStorage는 "앱을 껐다 켜도 남아있는" 간단한 key-value 저장소다.
// (브라우저의 localStorage와 비슷하다고 생각하면 된다.)
import AsyncStorage from '@react-native-async-storage/async-storage';

import { EXP_PER_FOCUS_SESSION } from './leveling';

// AsyncStorage 안에서 우리 앱의 데이터를 구분하기 위한 고유한 key 이름.
// 다른 앱/라이브러리의 데이터와 겹치지 않도록 앱 이름을 접두어로 붙여둔다.
const STORAGE_KEY = '@pomodoro-rpg/app-data';

// 저장 구조에 버전을 붙여두면, 나중에 구조가 바뀌었을 때
// "옛날 버전 데이터를 새 구조로 변환"하는 마이그레이션 코드를 안전하게 추가할 수 있다.
const STORAGE_VERSION = 1;

// 집중(포모도로) 1회의 길이(분). hooks/use-pomodoro-timer.ts의 FOCUS_SECONDS(25*60)와 같은 값이다.
// 순환 참조(storage <-> hooks)를 피하기 위해 값만 별도로 정의해뒀다.
// (테스트 모드에서 타이머가 실제보다 빨리 줄어들더라도, 기록상의 "1회 집중"은 항상 25분으로 취급한다.)
const FOCUS_MINUTES_PER_SESSION = 25;

// AsyncStorage에 실제로 저장될 데이터의 모양(타입).
//
// 지금 당장 쓰는 건 today 필드뿐이지만, 앞으로 경험치(XP)/레벨/캐릭터 정보를
// 추가할 걸 대비해서 최상위에 필드를 더 넣기 쉬운 구조로 만들어 두었다.
// 예) xp: number, level: number, character: { ... } 등을 이 타입에 추가하면 된다.
export type AppStorageData = {
  version: number;
  // 캐릭터의 현재 레벨. 날짜가 바뀌어도 초기화되지 않고 계속 쌓인다. (오늘 집중 횟수와 다름!)
  level: number;
  // 현재 레벨 안에서 쌓은 경험치. 레벨업에 필요한 경험치를 넘기면
  // storage/leveling.ts의 applyExpGain()이 레벨을 올리고 초과분만 남긴다.
  exp: number;
  today: {
    // 'YYYY-MM-DD' 형태의 날짜 문자열.
    // 저장된 날짜와 오늘 날짜가 다르면 "새로운 하루"이므로 완료 횟수/기록을 초기화한다.
    date: string;
    // 오늘 완료한 집중(포모도로) 횟수.
    completedFocusCount: number;
    // 오늘 집중을 완료한 시각들의 목록. ISO 8601 문자열(예: '2026-08-06T09:05:00.000Z')로 저장한다.
    // 완료할 때마다 배열 맨 뒤에 하나씩 추가된다. (앞쪽이 더 오래된 시각)
    completedTimes: string[];
  };
  // 날짜별 학습 기록. key는 'YYYY-MM-DD' 문자열이며, 캘린더 화면에서 이 값을 사용해
  // "공부한 날짜 표시"와 "날짜 선택 시 상세 기록"을 보여준다.
  // today와 내용이 일부 겹치지만(오늘 날짜의 기록은 양쪽 다 들어있음), today는 "오늘 화면"
  // 전용으로 그대로 두고 history는 "날짜별 기록 조회" 전용으로 분리해서 기존 로직을 건드리지 않았다.
  history: StudyHistory;
  // 확장 예정 필드 (지금은 사용하지 않음, 참고용 주석):
  // character: { id: string; name: string };
};

// 하루치 학습 기록. 캘린더에서 날짜를 선택했을 때 보여주는 정보의 단위다.
export type DailyRecord = {
  // 'YYYY-MM-DD' 형태의 날짜 문자열. history 객체의 key와 같은 값이다.
  date: string;
  // 그 날 완료한 집중(포모도로) 횟수.
  completedFocusCount: number;
  // 그 날 집중을 완료한 시각들의 목록 (ISO 8601 문자열, 오래된 시각이 앞쪽).
  completedTimes: string[];
  // 그 날 집중한 총 시간(분). completedFocusCount * FOCUS_MINUTES_PER_SESSION과 같다.
  totalFocusMinutes: number;
  // 그 날 얻은 경험치 합계.
  earnedExp: number;
};

// 날짜별 학습 기록 전체를 담는 사전(dictionary) 타입. key는 'YYYY-MM-DD'.
export type StudyHistory = Record<string, DailyRecord>;

// 오늘 날짜를 'YYYY-MM-DD' 문자열로 반환하는 함수.
// 기기의 로컬 시간 기준으로 계산한다.
export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// ISO 8601 시각 문자열(completedTimes에 저장되는 형태)을 화면에 보여주기 좋은
// 'HH:mm' 형태로 바꿔주는 함수. 기기의 로컬 시간 기준으로 표시한다.
export function formatTimeOfDay(isoString: string): string {
  const date = new Date(isoString);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

// 데이터가 하나도 저장되어 있지 않을 때(앱을 처음 실행했을 때) 사용할 기본값.
function createDefaultData(): AppStorageData {
  return {
    version: STORAGE_VERSION,
    level: 1,
    exp: 0,
    today: {
      date: getTodayDateString(),
      completedFocusCount: 0,
      completedTimes: [],
    },
    history: {},
  };
}

// 날짜(date)의 기록이 아직 history에 없을 때 사용할 빈 하루치 기록.
function createEmptyDailyRecord(date: string): DailyRecord {
  return { date, completedFocusCount: 0, completedTimes: [], totalFocusMinutes: 0, earnedExp: 0 };
}

// 특정 날짜에 집중을 1회 완료했을 때, 날짜별 기록(history)에 반영한 "새" history를 반환한다.
// 인자로 받은 history는 바꾸지 않고(불변성 유지) 항상 새로운 객체를 만들어 반환한다.
// hooks/use-pomodoro-timer.ts에서 집중 완료 처리 시 호출한다.
export function recordFocusCompletion(history: StudyHistory, date: string, completedAtIso: string): StudyHistory {
  const previous = history[date] ?? createEmptyDailyRecord(date);
  const updated: DailyRecord = {
    date,
    completedFocusCount: previous.completedFocusCount + 1,
    completedTimes: [...previous.completedTimes, completedAtIso],
    totalFocusMinutes: previous.totalFocusMinutes + FOCUS_MINUTES_PER_SESSION,
    earnedExp: previous.earnedExp + EXP_PER_FOCUS_SESSION,
  };
  return { ...history, [date]: updated };
}

// 저장된 앱 데이터를 AsyncStorage에서 불러오는 함수.
//
// - 저장된 데이터가 없으면(최초 실행) 기본값을 반환한다.
// - 저장된 날짜가 오늘이 아니면(날짜가 바뀜) "오늘" 관련 값(집중 완료 횟수, 완료 시간 기록)만
//   초기화해서 반환한다. level/exp는 날짜와 상관없이 계속 쌓이는 캐릭터 성장 기록이므로 그대로 둔다.
//   (이 함수는 초기화된 값을 반환만 할 뿐, AsyncStorage에 다시 저장하지는 않는다.
//    저장은 호출한 쪽에서 값이 바뀔 때 자동으로 이루어진다.)
// - history가 없는 옛날 버전 데이터라면 빈 객체로 시작하되, today에 이미 오늘 치 기록이
//   남아있다면 그 값을 history로 옮겨서(마이그레이션) 캘린더에서도 오늘 기록이 보이도록 한다.
//   (today 이전 날짜의 기록은 애초에 저장되어 있지 않았으므로 복원할 수 없다.)
export async function loadAppData(): Promise<AppStorageData> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return createDefaultData();
    }

    // Partial을 쓰는 이유: 예전 버전에서 저장된 데이터에는 level/exp/completedTimes/history 같은
    // 필드가 아예 없을 수도 있기 때문이다. 아래에서 없는 필드는 기본값으로 채워준다.
    const parsed: Partial<AppStorageData> = JSON.parse(raw);
    const today = getTodayDateString();

    const level = parsed.level ?? 1;
    const exp = parsed.exp ?? 0;
    let history: StudyHistory = parsed.history ?? {};

    const previousTodayDate = parsed.today?.date;
    const previousTodayCount = parsed.today?.completedFocusCount ?? 0;
    if (previousTodayDate && previousTodayCount > 0 && !history[previousTodayDate]) {
      history = {
        ...history,
        [previousTodayDate]: {
          date: previousTodayDate,
          completedFocusCount: previousTodayCount,
          completedTimes: parsed.today?.completedTimes ?? [],
          totalFocusMinutes: previousTodayCount * FOCUS_MINUTES_PER_SESSION,
          earnedExp: previousTodayCount * EXP_PER_FOCUS_SESSION,
        },
      };
    }

    if (previousTodayDate !== today) {
      // 날짜가 바뀌었으므로 오늘의 집중 완료 횟수와 완료 시간 기록을 0(빈 배열)부터 다시 센다.
      // (history는 날짜가 바뀌어도 초기화하지 않는다. 과거 기록을 계속 보존하기 위해서다.)
      return {
        version: STORAGE_VERSION,
        level,
        exp,
        today: { date: today, completedFocusCount: 0, completedTimes: [] },
        history,
      };
    }

    return {
      version: STORAGE_VERSION,
      level,
      exp,
      today: {
        date: parsed.today!.date,
        completedFocusCount: parsed.today!.completedFocusCount ?? 0,
        completedTimes: parsed.today!.completedTimes ?? [],
      },
      history,
    };
  } catch (error) {
    // AsyncStorage 읽기 실패(예: 저장된 데이터가 손상됨) 시 기본값으로 안전하게 시작한다.
    console.warn('[app-storage] 데이터를 불러오지 못했습니다. 기본값을 사용합니다.', error);
    return createDefaultData();
  }
}

// 앱 데이터를 AsyncStorage에 저장하는 함수.
export async function saveAppData(data: AppStorageData): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn('[app-storage] 데이터를 저장하지 못했습니다.', error);
  }
}
