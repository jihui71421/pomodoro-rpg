// 포모도로 RPG의 레벨/경험치(EXP) 계산 로직을 모아둔 파일.
// AsyncStorage 같은 저장 방식과는 상관없이, "경험치가 얼마나 필요한지" 같은
// 순수한 계산만 담당한다. (그래서 이 파일은 async 함수가 하나도 없다.)

// 집중(포모도로) 1회를 완료했을 때 얻는 경험치.
export const EXP_PER_FOCUS_SESSION = 10;

// 한 레벨을 올리는 데 필요한 경험치.
// 지금은 모든 레벨이 똑같이 100을 요구하는 가장 단순한 방식으로 만들어뒀다.
// 나중에 레벨이 오를수록 더 많은 경험치가 필요하게 하고 싶다면,
// 이 값을 고정 숫자 대신 `level * 100` 같은 계산식으로 바꾸면 된다.
export const EXP_TO_NEXT_LEVEL = 100;

// 레벨과 경험치를 함께 다루기 위한 타입.
export type LevelProgress = {
  level: number;
  exp: number;
};

// 현재 레벨/경험치(current)에 새로 얻은 경험치(gainedExp)를 더하고,
// 필요하다면 레벨업까지 처리해서 반환하는 함수.
//
// 예) 레벨 1, 경험치 95인 상태에서 10을 더 얻으면
//     -> 경험치가 105가 되어 100(EXP_TO_NEXT_LEVEL)을 넘으므로 레벨이 2로 오르고,
//        남은 경험치 5만 다음 레벨의 경험치로 남는다.
export function applyExpGain(current: LevelProgress, gainedExp: number): LevelProgress {
  let level = current.level;
  let exp = current.exp + gainedExp;

  // while문을 쓰는 이유: 한 번에 여러 레벨이 오를 수도 있기 때문이다.
  // (예: 나중에 보너스 경험치 등으로 한 번에 100을 훌쩍 넘게 얻는 경우)
  while (exp >= EXP_TO_NEXT_LEVEL) {
    exp -= EXP_TO_NEXT_LEVEL;
    level += 1;
  }

  return { level, exp };
}
