// 라벨 + 텍스트영역 + 저장 상태 표시를 묶은 재사용 입력 박스
export default function FieldBox({ label, value, onChange, status, placeholder, minRows = 3, readOnly }) {
  return (
    <div className="field-box">
      {label && <div className="field-label">{label}</div>}
      <textarea
        className="field-input"
        rows={minRows}
        value={value}
        placeholder={placeholder}
        readOnly={readOnly}
        onChange={(e) => onChange(e.target.value)}
      />
      {!readOnly && <StatusTag status={status} />}
    </div>
  );
}

export function StatusTag({ status }) {
  if (!status || status === "idle") return <div className="field-status">&nbsp;</div>;
  if (status === "typing") return <div className="field-status typing">입력 중…</div>;
  if (status === "saving") return <div className="field-status saving">저장 중…</div>;
  return <div className="field-status saved">✓ 저장됨</div>;
}
