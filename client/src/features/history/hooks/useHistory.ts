import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { historyService } from "../services/history.service";
import type { HistoryMeetingUI } from "../types/history";

export function useHistoryMeetings() {
  const [searchQuery, setSearchQuery] = useState("");

  const query = useQuery<HistoryMeetingUI[], Error>({
    queryKey: ["meetings", "history"],
    queryFn: () => historyService.getHistory(),
  });

  const filteredMeetings = useMemo(() => {
    const list = query.data || [];
    if (!searchQuery.trim()) return list;

    const term = searchQuery.toLowerCase().trim();
    return list.filter((meeting) => {
      const matchTitle = meeting.title.toLowerCase().includes(term);
      const matchCode = meeting.code.toLowerCase().includes(term);
      const matchDesc = meeting.description?.toLowerCase().includes(term);
      return matchTitle || matchCode || Boolean(matchDesc);
    });
  }, [query.data, searchQuery]);

  return {
    ...query,
    meetings: filteredMeetings,
    rawMeetings: query.data || [],
    searchQuery,
    setSearchQuery,
    totalCount: query.data?.length || 0,
    filteredCount: filteredMeetings.length,
  };
}
