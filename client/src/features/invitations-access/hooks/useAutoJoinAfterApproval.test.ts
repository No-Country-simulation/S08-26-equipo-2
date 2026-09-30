import { renderHook } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { useAutoJoinAfterApproval } from "./useAutoJoinAfterApproval";

it("waits for admission then joins once even across rerenders", () => {
  const onJoin = vi.fn();
  const { rerender } = renderHook(({ enabled }) => useAutoJoinAfterApproval({ meetingId: "a", enabled, isJoining: false, onJoin }), { initialProps: { enabled: false } });
  expect(onJoin).not.toHaveBeenCalled();
  rerender({ enabled: true });
  rerender({ enabled: true });
  expect(onJoin).toHaveBeenCalledTimes(1);
});

it("does not issue another request while joining", () => {
  const onJoin = vi.fn();
  renderHook(() => useAutoJoinAfterApproval({ meetingId: "a", enabled: true, isJoining: true, onJoin }));
  expect(onJoin).not.toHaveBeenCalled();
});
