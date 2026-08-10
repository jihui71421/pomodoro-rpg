// 이 파일은 앱의 데이터를 휴대폰(기기) 안에 저장하고 불러오는 역할을 담당한다.
// AsyncStorage는 "앱을 껐다 켜도 남아있는" 간단한 key-value 저장소다.
// (브라우저의 localStorage와 비슷하다고 생각하면 된다.)
import AsyncStorage from '@react-native-async-storage/async-storage';

// AsyncStorage 안에서 우리 앱의 데이터를 구분하기 위한 고유한 key 이름.
// 다른 앱/라이브러리의 데이터와 겹치지 않도록 앱 이름을 접두어로 붙여둔다.
const STORAGE_KEY = '@pomodoro-rpg/app-data';

// 저장 구조에 버전을 붙여두면, 나중에 구조가 바뀌었을 때
// "옛날 버전 데이터를 새 구조로 변환"하는 마이그레이션 코드를 안전하게 추가할 수 있다.
const STORAGE_VERSION = 1;

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
  // 확장 예정 필드 (지금은 사용하지 않음, 참고용 주석):
  // character: { id: string; name: string };
};

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
  };
}

// 저장된 앱 데이터를 AsyncStorage에서 불러오는 함수.
//
// - 저장된 데이터가 없으면(최초 실행) 기본값을 반환한다.
// - 저장된 날짜가 오늘이 아니면(날짜가 바뀜) "오늘" 관련 값(집중 완료 횟수, 완료 시간 기록)만
//   초기화해서 반환한다. level/exp는 날짜와 상관없이 계속 쌓이는 캐릭터 성장 기록이므로 그대로 둔다.
//   (이 함수는 초기화된 값을 반환만 할 뿐, AsyncStorage에 다시 저장하지는 않는다.
//    저장은 호출한 쪽에서 값이 바뀔 때 자동으로 이루어진다.)
export async function loadAppData(): Promise<AppStorageData> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return createDefaultData();
    }

    // Partial을 쓰는 이유: 예전 버전에서 저장된 데이터에는 level/exp/completedTimes 같은
    // 필드가 아예 없을 수도 있기 때문이다. 아래에서 없는 필드는 기본값으로 채워준다.
    const parsed: Partial<AppStorageData> = JSON.parse(raw);
    const today = getTodayDateString();

    const level = parsed.level ?? 1;
    const exp = parsed.exp ?? 0;

    if (parsed.today?.date !== today) {
      // 날짜가 바뀌었으므로 오늘의 집중 완료 횟수와 완료 시간 기록을 0(빈 배열)부터 다시 센다.
      return {
        version: STORAGE_VERSION,
        level,
        exp,
        today: { date: today, completedFocusCount: 0, completedTimes: [] },
      };
    }

    return {
      version: STORAGE_VERSION,
      level,
      exp,
      today: {
        date: parsed.today.date,
        completedFocusCount: parsed.today.completedFocusCount ?? 0,
        completedTimes: parsed.today.completedTimes ?? [],
      },
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
