import { StatusTag } from "./FieldBox";

// Q1: "가이드를 맡기겠다" / "못맡기겠다" 두 칸에 각각 이유를 작성하는 컴포넌트
export default function ChoicePair({ yesField, noField, readOnly }) {
  return (
    <div className="choice-pair">
      <div className="choice-box choice-box-yes">
        <div className="choice-label">
          <span className="choice-badge choice-badge-yes">맡기겠다</span>
          이유는?
        </div>
        <textarea
          className="field-input"
          rows={3}
          placeholder="맡기겠다고 판단한 이유를 적어주세요"
          value={yesField.value}
          readOnly={readOnly}
          onChange={(e) => yesField.onChange(e.target.value)}
        />
        {!readOnly && <StatusTag status={yesField.status} />}
      </div>
      <div className="choice-box choice-box-no">
        <div className="choice-label">
          <span className="choice-badge choice-badge-no">못맡기겠다</span>
          이유는?
        </div>
        <textarea
          className="field-input"
          rows={3}
          placeholder="못맡기겠다고 판단한 이유를 적어주세요"
          value={noField.value}
          readOnly={readOnly}
          onChange={(e) => noField.onChange(e.target.value)}
        />
        {!readOnly && <StatusTag status={noField.status} />}
      </div>
    </div>
  );
}
