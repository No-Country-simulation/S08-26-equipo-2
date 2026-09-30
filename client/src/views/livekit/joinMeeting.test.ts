import { describe, expect, it, vi, beforeEach } from "vitest";
import { AxiosError } from "axios";
import api from "@/services/api/api";
import { joinMeeting } from "./joinMeeting";
vi.mock("@/services/api/api", () => ({ default: { post: vi.fn() } }));
beforeEach(() => vi.clearAllMocks());
describe("joinMeeting", () => {
  it("requests credentials for the linked meeting", async () => {
    vi.mocked(api.post).mockResolvedValue({ data: { token: "test-token", url: "wss://example.test" } });
    expect(await joinMeeting("meeting-id")).toEqual({ token: "test-token", serverUrl: "wss://example.test" });
    expect(api.post).toHaveBeenCalledWith("/livekit/token", { meetingId: "meeting-id" });
  });
  it("rejects a response without token", async () => {
    vi.mocked(api.post).mockResolvedValue({ data: { url: "wss://example.test" } });
    await expect(joinMeeting("id")).rejects.toThrow("No se recibió el acceso");
  });
  it("rejects HTTP addresses", async () => {
    vi.mocked(api.post).mockResolvedValue({ data: { token: "test-token", url: "https://example.test" } });
    await expect(joinMeeting("id")).rejects.toThrow("dirección de la sala");
  });
  it("explains denied admission", async () => {
    const error = new AxiosError("Forbidden");
    Object.assign(error, { response: { status: 403 } });
    vi.mocked(api.post).mockRejectedValue(error);
    await expect(joinMeeting("id")).rejects.toThrow("Solicita acceso al anfitrión");
  });
});
