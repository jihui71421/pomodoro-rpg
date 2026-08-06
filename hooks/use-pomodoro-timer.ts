import { useEffect, useState } from 'react';

// 집중 시간(초) : 25분
const FOCUS_SECONDS = 25 * 60;
// 휴식 시간(초) : 5분
const BREAK_SECONDS = 5 * 60;

// [테스트용] 실제 1초가 지날 때마다 타이머를 몇 초씩 줄일지 정하는 값.
// 원래 포모도로 속도로 되돌리려면 이 값을 1로 바꾸면 된다.
const TEST_SECONDS_PER_TICK = 30;

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

  // 1초마다 남은 시간을 1씩 줄여주는 부분
  // isRunning이 true일 때만 setInterval을 동작시키고, false가 되면 정리(clearInterval)한다.
  useEffect(() => {
    if (!isRunning) return undefined;

    const intervalId = setInterval(() => {
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
      // 집중 시간이 끝났으므로 완료 횟수를 1 늘리고, 휴식 모드로 전환한다.
      // 단, 휴식 타이머는 자동으로 시작하지 않는다.
      // isRunning을 false로 만들어서, 사용자가 '휴식 시작' 버튼을 직접 눌러야
      // 휴식 타이머가 움직이도록 한다.
      setCompletedFocusCount((count) => count + 1);
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

  return {
    mode,
    secondsLeft,
    isRunning,
    completedFocusCount,
    start,
    pause,
    reset,
    skipBreak,
    endStudy,
  };
}
