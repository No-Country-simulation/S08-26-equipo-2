import { useState, useMemo, useCallback, useDeferredValue } from "react";
import { useMeetings } from "./useMeetings";
import type {
  Meeting,
  MeetingFilterValue,
  MeetingsTableProps,
} from "../types/meeting";

export interface UseTableMeetingsOptions {
  onNav?: MeetingsTableProps["onNav"];
  onCreateMeeting?: MeetingsTableProps["onCreateMeeting"];
  onJoinMeeting?: MeetingsTableProps["onJoinMeeting"];
  onEditMeeting?: MeetingsTableProps["onEditMeeting"];
  onCancelMeeting?: MeetingsTableProps["onCancelMeeting"];
  onViewDetailsMeeting?: MeetingsTableProps["onViewDetailsMeeting"];
}

/**
 * Hook para encapsular la lógica de filtrado, búsqueda, estado y navegación de la tabla de reuniones
 */
export function useTableMeetings(options: UseTableMeetingsOptions = {}) {
  const {
    onNav,
    onCreateMeeting,
    onJoinMeeting,
    onEditMeeting,
    onCancelMeeting,
    onViewDetailsMeeting,
  } = options;
  const { data: meetings = [], isLoading, isFetching, refetch } = useMeetings();

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<MeetingFilterValue>("all");

  const deferredQuery = useDeferredValue(query);

  const handleCreate = useCallback(() => {
    if (onCreateMeeting) {
      onCreateMeeting();
    } else if (onNav) {
      onNav("create-meeting");
    }
  }, [onCreateMeeting, onNav]);

  const handleJoin = useCallback(
    (meeting: Meeting) => {
      if (onJoinMeeting) {
        onJoinMeeting(meeting);
      } else if (onNav) {
        onNav("video-room");
      }
    },
    [onJoinMeeting, onNav],
  );

  const handleEdit = useCallback(
    (meeting: Meeting) => {
      if (onEditMeeting) {
        onEditMeeting(meeting);
      }
    },
    [onEditMeeting],
  );

  const handleCancel = useCallback(
    (meeting: Meeting) => {
      if (onCancelMeeting) {
        onCancelMeeting(meeting);
      }
    },
    [onCancelMeeting],
  );

  const handleViewDetails = useCallback(
    (meeting: Meeting) => {
      if (onViewDetailsMeeting) {
        onViewDetailsMeeting(meeting);
      }
    },
    [onViewDetailsMeeting],
  );
  
  const filteredMeetings = useMemo(() => {
    const cleanQuery = deferredQuery.toLowerCase().trim();
    return meetings.filter((m) => {
      const matchQuery =
        cleanQuery === "" ||
        (m.title && m.title.toLowerCase().includes(cleanQuery)) ||
        (m.name && m.name.toLowerCase().includes(cleanQuery)) ||
        (m.code && m.code.toLowerCase().includes(cleanQuery));
      const matchFilter = filter === "all" || m.status === filter;
      return matchQuery && matchFilter;
    });
  }, [meetings, deferredQuery, filter]);

  return {
    meetings,
    filteredMeetings,
    isLoading,
    isFetching,
    refetch,
    query,
    setQuery,
    filter,
    setFilter,
    handleCreate,
    handleJoin,
    handleEdit,
    handleCancel,
    handleViewDetails,
  };
}
