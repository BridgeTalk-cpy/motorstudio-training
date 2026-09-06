export function newParticipantId() {
  if (crypto?.randomUUID) return crypto.randomUUID();
  return "p-" + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export const LOCAL_KEY = "motorstudio_training_participant";

export function emptyParking() {
  return { why: "", what: "", how: "" };
}

// Q4의 질문은 고정, 답변만 참가자가 채움
export const PARKING_ROWS = [
  { key: "why", label: "WHY", question: "무료주차 혜택을 받았는데도 요금이 발생한 이유는 무엇인가요?" },
  { key: "what", label: "WHAT", question: "고객에게 적용된 무료시간과 추가 요금은 얼마인가요?" },
  { key: "how", label: "HOW", question: "할인 적용 여부와 추가로 사용할 수 있는 혜택을 어떻게 확인할까요?" },
];
