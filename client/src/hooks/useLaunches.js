import { useCallback, useEffect, useState } from "react";

import {
  httpGetLaunches,
  httpGetPaginatedHistory,
  httpSubmitLaunch,
  httpAbortLaunch,
} from "./requests";

function useLaunches(onSuccessSound, onAbortSound, onFailureSound) {
  const [launches, saveLaunches] = useState([]);
  const [isPendingLaunch, setPendingLaunch] = useState(false);

  const getLaunches = useCallback(async () => {
    const fetchedLaunches = await httpGetLaunches();
    saveLaunches(fetchedLaunches);
  }, []);

  useEffect(() => {
    getLaunches();
  }, [getLaunches]);

  const submitLaunch = useCallback(
    async (e) => {
      e.preventDefault();
      setPendingLaunch(true);
      const data = new FormData(e.target);
      const launchDate = new Date(data.get("launch-day"));
      const mission = data.get("mission-name");
      const rocket = data.get("rocket-name");
      const target = data.get("planets-selector");
      const response = await httpSubmitLaunch({
        launchDate,
        mission,
        rocket,
        target,
      });

      const success = response.ok;
      if (success) {
        getLaunches();
        setTimeout(() => {
          setPendingLaunch(false);
          onSuccessSound();
        }, 800);
      } else {
        onFailureSound();
      }
    },
    [getLaunches, onSuccessSound, onFailureSound]
  );

  const abortLaunch = useCallback(
    async (id) => {
      const response = await httpAbortLaunch(id);

      const success = response.ok;
      if (success) {
        getLaunches();
        onAbortSound();
      } else {
        onFailureSound();
      }
    },
    [getLaunches, onAbortSound, onFailureSound]
  );

  return {
    launches,
    isPendingLaunch,
    submitLaunch,
    abortLaunch,
  };
}

function usePaginatedHistory(onFailureSound, page = 1, limit = 10) {
  const [historyData, setHistoryData] = useState({
    launches: [],
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  const getHistoryLaunches = useCallback(
    async (currentPage = page) => {
      setIsLoading(true);
      try {
        const result = await httpGetPaginatedHistory(currentPage, limit);

        if (result.launches) {
          setHistoryData({
            launches: result.launches,
            total: result.total,
            page: result.page,
            limit: result.limit,
            totalPages: Math.ceil(result.total / result.limit),
          });
        }
      } catch (error) {
        console.error("Failed to fetch history launches:", error);
        onFailureSound && onFailureSound();
      } finally {
        setIsLoading(false);
      }
    },
    [page, limit, onFailureSound]
  );

  useEffect(() => {
    getHistoryLaunches();
  }, [getHistoryLaunches]);

  const goToPage = useCallback(
    (newPage) => {
      if (newPage >= 1 && newPage <= historyData.totalPages) {
        getHistoryLaunches(newPage);
      }
    },
    [getHistoryLaunches, historyData.totalPages]
  );

  return {
    ...historyData,
    isLoading,
    goToPage,
    refresh: getHistoryLaunches,
  };
}

export default useLaunches;
export { usePaginatedHistory };
