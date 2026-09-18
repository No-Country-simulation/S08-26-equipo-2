export default function EmailDivition() {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
      <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
        o con email
      </span>
      <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
    </div>
  );
}
