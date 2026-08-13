import { useEffect, useRef, useState } from 'react';

import { getTodayDateString, loadAppData, recordFocusCompletion, saveAppData, StudyHistory } from '@/storage/app-storage';
import { applyExpGain, EXP_PER_FOCUS_SESSION, LevelProgress } from '@/storage/leveling';

// 집중 시간(초) : 25분
// export하는 이유: 홈 화면의 타이머 진행바(components/pomodoro/timer-display.tsx)가
// "얼마나 진행됐는지" 비율을 계산하려면 전체 시간이 필요하기 때문이다. 값 자체는 그대로다.
export const FOCUS_SECONDS = 25 * 60;
// 휴식 시간(초) : 5분 (위와 같은 이유로 export)
export const BREAK_SECONDS = 5 * 60;

// 실제 1초가 지날 때마다 타이머를 몇 초씩 줄일지 정하는 값. 1이면 정상 속도.
const TEST_SECONDS_PER_TICK = 1;

// 타이머가 지금 "집중" 중인지 "휴식" 중인지를 나타내는 타입
export type TimerMode = 'focus' | 'break';

// 화면에서 사용하기 편하도록 남은 시간을 mm:ss 형태의 문자열로 바꿔주는 함수
export function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  // padStart(2, '0') : 한 자리 숫자면 앞에 '0'을 붙여서 두 자리로 맞춰줌 (예: 5 -> "05")
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// 포모도로 타이머의 모든 상태와 동작(시작/일시정지/리셋)을 관리하는 커스텀 훅
export function usePomodoroTimer() {
  // 현재 모드: 집중(focus) 또는 휴식(break)
  const [mode, setMode] = useState<TimerMode>('focus');
  // 현재 모드에서 남은 시간(초). 처음에는 집중 시간(25분)으로 시작
  const [secondsLeft, setSecondsLeft] = useState(FOCUS_SECONDS);
  // 타이머가 재생 중인지 여부 (true면 매초 시간이 줄어듦)
  const [isRunning, setIsRunning] = useState(false);
  // 오늘 완료한 "집중" 횟수 (휴식 완료는 세지 않음)
  const [completedFocusCount, setCompletedFocusCount] = useState(0);
  // 오늘 집중을 완료한 시각들의 목록 (ISO 8601 문자열). 완료할 때마다 뒤에 하나씩 추가된다.
  const [completedTimes, setCompletedTimes] = useState<string[]>([]);
  // 날짜별 학습 기록. key는 'YYYY-MM-DD' 문자열이며, 캘린더 화면(app/(tabs)/calendar.tsx)이
  // AsyncStorage에서 이 값을 다시 불러와 "공부한 날짜 표시"와 "날짜별 상세 기록"에 사용한다.
  const [history, setHistory] = useState<StudyHistory>({});
  // 캐릭터의 레벨과 경험치. level/exp를 따로 관리하지 않고 하나로 묶어두면,
  // "경험치를 얻어서 레벨업까지 계산하는" 작업을 한 번에 안전하게 처리할 수 있다.
  const [levelProgress, setLevelProgress] = useState<LevelProgress>({ level: 1, exp: 0 });
  // 방금 레벨업으로 도달한 레벨. null이면 레벨업 모달을 보여주지 않는다.
  // (레벨이 오르지 않은 일반적인 집중 완료에서는 계속 null로 유지된다.)
  const [levelUpLevel, setLevelUpLevel] = useState<number | null>(null);

  // AsyncStorage에서 저장된 데이터를 아직 불러오는 중인지 여부.
  // 이 값이 true인 동안에는 completedFocusCount가 바뀌어도 저장하지 않는다.
  // (그렇지 않으면, 불러오기가 끝나기 전의 기본값 0이 먼저 저장되어서
  //  저장해뒀던 값을 덮어써버리는 문제가 생길 수 있다.)
  const isLoadedRef = useRef(false);

  // "집중 완료 처리" 효과(아래)는 secondsLeft/mode가 바뀔 때만 실행되어야 하므로
  // levelProgress를 그 효과의 의존성 배열에 넣지 않는다. 대신 항상 최신 값을
  // 참조할 수 있도록 ref에 levelProgress를 미러링해둔다.
  const levelProgressRef = useRef(levelProgress);
  useEffect(() => {
    levelProgressRef.current = levelProgress;
  }, [levelProgress]);

  // completedFocusCount/completedTimes(오늘의 기록)가 지금 "어느 날짜" 기준으로 쌓인 값인지
  // 기억해두는 ref. 앱을 껐다 켜는 경우의 날짜 초기화는 storage/app-storage.ts의
  // loadAppData()가 이미 처리해주지만, 앱을 계속 켜둔 채로(재시작 없이) 자정을 넘기면
  // loadAppData()가 다시 호출되지 않으므로 이 ref로 직접 날짜 변경을 감지해야 한다.
  const todayDateRef = useRef(getTodayDateString());

  // 현재 날짜가 todayDateRef에 기억해둔 날짜와 다르면(=자정을 넘겼으면), 오늘의 집중 기록
  // (completedFocusCount, completedTimes)만 0/빈 배열로 새로 시작한다.
  // level/exp/history는 여기서 건드리지 않는다 — 날짜가 바뀌어도 계속 쌓여야 하는 값이기 때문이다.
  // 이미 같은 날짜라면 아무것도 하지 않는다(가장 흔한 경우이므로 매번 비용이 거의 없다).
  const resetTodayIfDateChanged = () => {
    const currentDate = getTodayDateString();
    if (todayDateRef.current === currentDate) return;

    todayDateRef.current = currentDate;
    setCompletedFocusCount(0);
    setCompletedTimes([]);
  };

  // 앱이 처음 실행될 때(마운트될 때) 한 번, AsyncStorage에 저장된 데이터를 불러온다.
  useEffect(() => {
    let isCancelled = false;

    loadAppData().then((data) => {
      // 불러오는 도중에 화면이 사라졌다면(unmount) 상태를 업데이트하지 않는다.
      if (isCancelled) return;

      // loadAppData()가 반환하는 data.today.date는 이미 "오늘" 기준으로 정리된 값이므로
      // (날짜가 바뀌었다면 loadAppData 내부에서 completedFocusCount도 0으로 초기화해서 준다),
      // todayDateRef도 그 날짜로 맞춰서 이후의 자정 감지 기준으로 삼는다.
      todayDateRef.current = data.today.date;
      setCompletedFocusCount(data.today.completedFocusCount);
      setCompletedTimes(data.today.completedTimes);
      setLevelProgress({ level: data.level, exp: data.exp });
      setHistory(data.history);
      isLoadedRef.current = true;
    });

    return () => {
      isCancelled = true;
    };
  }, []);

  // completedFocusCount(오늘 집중 완료 횟수), completedTimes(완료 시간 목록),
  // levelProgress(레벨/경험치), history(날짜별 기록) 중 하나라도 바뀔 때마다 AsyncStorage에
  // 자동으로 저장한다. 학습 종료 버튼, 리셋 버튼은 이 값들을 바꾸지 않으므로 저장에 영향을 주지 않는다.
  useEffect(() => {
    // 아직 저장된 데이터를 불러오는 중이면(최초 렌더링) 저장을 건너뛴다.
    if (!isLoadedRef.current) return;

    // 저장 구조는 storage/app-storage.ts의 AppStorageData 타입을 따른다.
    // 나중에 character 등을 추가하려면 여기서 함께 저장하면 된다.
    saveAppData({
      version: 1,
      level: levelProgress.level,
      exp: levelProgress.exp,
      today: {
        date: getTodayDateString(),
        completedFocusCount,
        completedTimes,
      },
      history,
    });
  }, [completedFocusCount, completedTimes, levelProgress, history]);

  // 1초마다 남은 시간을 1씩 줄여주는 부분
  // isRunning이 true일 때만 setInterval을 동작시키고, false가 되면 정리(clearInterval)한다.
  useEffect(() => {
    if (!isRunning) return undefined;

    const intervalId = setInterval(() => {
      // 타이머가 돌아가는 동안(특히 자정 근처) 매초 날짜가 바뀌었는지도 함께 확인한다.
      // 이렇게 하면 집중/휴식 타이머가 자정을 넘겨 계속 돌아가는 도중에도
      // "오늘 집중 횟수"가 다음 완료 시점을 기다리지 않고 바로 초기화된다.
      resetTodayIfDateChanged();
      // Math.max(0, ...)로 음수까지 줄어들지 않도록 막아준다.
      setSecondsLeft((prevSeconds) => Math.max(0, prevSeconds - TEST_SECONDS_PER_TICK));
    }, 1000);

    // 컴포넌트가 사라지거나 isRunning이 바뀌기 전에 이전 interval을 반드시 정리해야
    // 타이머가 여러 개 겹쳐서 빨리 줄어드는 버그를 막을 수 있다.
    return () => clearInterval(intervalId);
  }, [isRunning]);

  // 남은 시간이 0이 되면 자동으로 모드를 전환하는 부분
  useEffect(() => {
    if (secondsLeft > 0) return;

    if (mode === 'focus') {
      // 완료 횟수를 늘리기 "전에" 먼저 날짜가 바뀌었는지 확인한다.
      // 예) 8/12에 3회 완료 후 앱을 끄지 않고 계속 켜둔 채 8/13이 되어 집중을 1회 더 완료하면,
      // 이 줄이 없으면 completedFocusCount가 3에서 4가 되어버린다(전날 횟수가 섞임).
      // 여기서 먼저 0으로 리셋해두면, 바로 아래의 +1이 적용되어 정확히 1이 된다.
      resetTodayIfDateChanged();

      // 집중 시간이 끝났으므로 완료 횟수를 1 늘리고, 완료한 시각을 기록하고,
      // 경험치(EXP)를 얻은 뒤(필요하면 레벨업까지 처리) 휴식 모드로 전환한다.
      // 단, 휴식 타이머는 자동으로 시작하지 않는다.
      // isRunning을 false로 만들어서, 사용자가 '휴식 시작' 버튼을 직접 눌러야
      // 휴식 타이머가 움직이도록 한다.
      const completedAt = new Date().toISOString();
      setCompletedFocusCount((count) => count + 1);
      setCompletedTimes((times) => [...times, completedAt]);
      // 오늘 집중 횟수/완료 시간과 별개로, 날짜별 기록(history)에도 같은 완료 내역을 추가한다.
      // 캘린더 화면은 이 history를 통해 "공부한 날짜 표시"와 "날짜별 상세 기록"을 보여준다.
      setHistory((prevHistory) => recordFocusCompletion(prevHistory, getTodayDateString(), completedAt));

      // 레벨업 여부를 판단하려면 "얻기 전" 레벨과 "얻은 후" 레벨을 비교해야 하므로,
      // applyExpGain()의 결과를 먼저 변수로 계산한 뒤 상태를 갱신한다.
      // (레벨업 계산 로직 자체는 applyExpGain()을 그대로 사용하고 수정하지 않는다.)
      const previousLevelProgress = levelProgressRef.current;
      const nextLevelProgress = applyExpGain(previousLevelProgress, EXP_PER_FOCUS_SESSION);
      setLevelProgress(nextLevelProgress);
      if (nextLevelProgress.level > previousLevelProgress.level) {
        setLevelUpLevel(nextLevelProgress.level);
      }

      setMode('break');
      setSecondsLeft(BREAK_SECONDS);
      setIsRunning(false);
    } else {
      // 휴식 시간이 끝났으므로 다시 집중 모드로 전환한다.
      // 집중 타이머도 자동으로 시작하지 않고, 사용자가 '시작' 버튼을 직접 눌러야
      // 다음 집중이 시작되도록 한다.
      setMode('focus');
      setSecondsLeft(FOCUS_SECONDS);
      setIsRunning(false);
    }
  }, [secondsLeft, mode]);

  // 시작 버튼: 타이머를 재생 상태로 바꾼다.
  const start = () => setIsRunning(true);

  // 일시정지 버튼: 타이머를 멈춘다 (남은 시간은 그대로 유지됨).
  const pause = () => setIsRunning(false);

  // 리셋 버튼: 타이머를 멈추고, 현재 모드(집중/휴식)의 시작 시간으로 되돌린다.
  // 완료 횟수는 초기화하지 않는다.
  const reset = () => {
    setIsRunning(false);
    setSecondsLeft(mode === 'focus' ? FOCUS_SECONDS : BREAK_SECONDS);
  };

  // 타이머를 멈추고 집중 모드(25분, 정지 상태)로 되돌리는 공통 로직.
  // '휴식 건너뛰기'와 '학습 종료'가 똑같이 이 동작을 사용한다.
  // 완료 횟수(completedFocusCount)는 건드리지 않아서 오늘의 기록이 유지된다.
  const resetToIdleFocus = () => {
    setIsRunning(false);
    setMode('focus');
    setSecondsLeft(FOCUS_SECONDS);
  };

  // 휴식 건너뛰기 버튼: 휴식을 하지 않고 바로 다음 집중 시간(25분)으로 돌아간다.
  const skipBreak = () => {
    resetToIdleFocus();
  };

  // 학습 종료 버튼: 집중/휴식 어느 모드에서 눌러도 타이머를 즉시 멈추고
  // 집중 모드(25분, 정지 상태)로 초기화한다. 오늘 완료한 집중 횟수는 그대로 유지된다.
  const endStudy = () => {
    resetToIdleFocus();
  };

  // 레벨업 모달의 '확인' 버튼: 모달만 닫는다. 레벨/경험치/기록 등 다른 상태는 건드리지 않는다.
  const dismissLevelUp = () => setLevelUpLevel(null);

  return {
    mode,
    secondsLeft,
    isRunning,
    completedFocusCount,
    completedTimes,
    history,
    level: levelProgress.level,
    exp: levelProgress.exp,
    levelUpLevel,
    start,
    pause,
    reset,
    skipBreak,
    endStudy,
    dismissLevelUp,
  };
}
