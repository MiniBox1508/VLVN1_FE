import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Layout from "../Layouts/Layout";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Medal,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

const API_BASE_URL = "https://vlvn1-be.onrender.com";

interface LeaderboardEntry {
  position: string;
  name: string;
  matches: number[];
  total: number;
  totalPoint: number;
}

const Leaderboard: React.FC = () => {
  const [day, setDay] = useState<1 | 2>(1);
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  // Logic Sắp xếp: mặc định Tổng điểm giảm dần
  const [sort, setSort] = useState<{ key: string; order: "asc" | "desc" }>({
    key: "totalPoint",
    order: "desc",
  });

  const [filters, setFilters] = useState({ name: "" });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const basePath = day === 1 ? "/api/leaderboard" : "/api/leaderboard2";
      const endpoint = filters.name ? `${basePath}/search` : basePath;

      const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
        params: {
          page,
          limit: 10,
          name: filters.name,
          sortBy: sort.key, // Truyền field cần sort
          order: sort.order, // Truyền thứ tự
        },
      });

      if (response.data.success) {
        setData(response.data.data);
        setPagination(response.data.meta);
      }
    } catch (error) {
      console.error("Lỗi API:", error);
    } finally {
      setLoading(false);
    }
  }, [day, page, filters, sort]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSort = (key: string) => {
    setSort((prev) => ({
      key,
      order: prev.key === key && prev.order === "desc" ? "asc" : "desc",
    }));
    setPage(1); // Reset về trang 1 khi đổi kiểu sort
  };

  const renderSortIcon = (key: string) => {
    if (sort.key !== key)
      return <ArrowUpDown size={14} className="ml-1 opacity-30" />;
    return sort.order === "desc" ? (
      <ArrowDown size={14} className="ml-1 text-cyan-400" />
    ) : (
      <ArrowUp size={14} className="ml-1 text-cyan-400" />
    );
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-700">
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">
              Bảng xếp hạng <span className="text-cyan-400">TFT</span>
            </h1>
            <p className="text-slate-500 text-xs font-bold mt-1 uppercase tracking-widest">
              DAY {day} - TOURNAMENT HUB
            </p>
          </div>
          <div className="flex bg-slate-900/60 p-1 rounded-xl border border-white/10 backdrop-blur-md">
            {[1, 2].map((d) => (
              <button
                key={d}
                onClick={() => {
                  setDay(d as 1 | 2);
                  setPage(1);
                }}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                  day === d
                    ? "bg-cyan-500 text-slate-950 shadow-lg"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Ngày {d}
              </button>
            ))}
          </div>
        </div>

        {/* --- SEARCH --- */}
        <div className="bg-slate-900/40 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
          <div className="relative max-w-sm">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              size={16}
            />
            <input
              value={filters.name}
              onChange={(e) => {
                setFilters({ name: e.target.value });
                setPage(1);
              }}
              placeholder="Tìm tên kỳ thủ..."
              className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:border-cyan-500 outline-none text-white transition-all"
            />
          </div>
        </div>

        {/* --- TABLE --- */}
        <div className="rounded-2xl border border-white/10 bg-slate-950/40 backdrop-blur-md overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/80 text-slate-400 text-[10px] uppercase font-black tracking-widest">
                <th className="px-6 py-4">Hạng</th>
                <th className="px-6 py-4">Kỳ thủ</th>
                {[1, 2, 3, 4, 5, 6].map((m) => (
                  <th key={m} className="px-3 py-4 text-center">
                    M{m}
                  </th>
                ))}

                {/* Cột Điểm Trận - Click để Sort */}
                <th
                  className="px-6 py-4 text-center bg-white/5 cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort("total")}
                >
                  <div className="flex items-center justify-center">
                    Điểm {renderSortIcon("total")}
                  </div>
                </th>

                {/* Cột Tổng Điểm - Click để Sort */}
                <th
                  className="px-6 py-4 text-right bg-cyan-500/10 text-cyan-400 cursor-pointer hover:brightness-125 transition-all"
                  onClick={() => handleSort("totalPoint")}
                >
                  <div className="flex items-center justify-end">
                    Tổng {renderSortIcon("totalPoint")}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={10} className="py-24 text-center">
                    <div className="inline-block w-8 h-8 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
                    <p className="mt-4 text-slate-500 font-bold text-xs uppercase animate-pulse">
                      ĐANG TẢI...
                    </p>
                  </td>
                </tr>
              ) : (
                data.map((entry, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-white/[0.03] transition-colors group"
                  >
                    <td className="px-6 py-4">
                      {entry.position === "1" ? (
                        <Medal
                          className="text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]"
                          size={22}
                        />
                      ) : entry.position === "2" ? (
                        <Medal className="text-slate-300" size={22} />
                      ) : entry.position === "3" ? (
                        <Medal className="text-amber-600" size={22} />
                      ) : (
                        <span className="text-slate-500 font-mono font-black ml-1 text-base">
                          {entry.position}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-100 group-hover:text-cyan-400 transition-colors uppercase tracking-tight">
                        {entry.name}
                      </div>
                    </td>
                    {entry.matches.map((m, i) => (
                      <td
                        key={i}
                        className={`px-2 py-4 text-center font-mono font-bold ${
                          m === 1 ? "text-yellow-400" : "text-slate-400"
                        }`}
                      >
                        {m || "-"}
                      </td>
                    ))}
                    <td className="px-6 py-4 text-center bg-white/5 font-black text-white font-mono">
                      {entry.total}
                    </td>
                    <td className="px-6 py-4 text-right bg-cyan-500/5 font-mono text-cyan-400 font-black text-xl italic tracking-tighter">
                      {entry.totalPoint}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* --- PAGINATION --- */}
        {pagination?.totalPages > 1 && (
          <div className="flex justify-between items-center py-4 px-2">
            <span className="text-[10px] text-slate-600 uppercase font-black tracking-widest">
              Page {page} of {pagination.totalPages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="p-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-slate-400 hover:text-white disabled:opacity-20 transition-all hover:bg-slate-800"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                disabled={page === pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="p-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-slate-400 hover:text-white disabled:opacity-20 transition-all hover:bg-slate-800"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Leaderboard;
