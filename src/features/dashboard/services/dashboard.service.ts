import { DashboardDataSchema } from "../schemas/dashboard.schema"
import { type DashboardData } from "../types/dashboard.types"
import { type StudentId } from "../../../types/brand"

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms)
  })

/**
 * Simulated external raw payload (untrusted API response).
 */
const rawMockApiResponse: unknown = {
  student: {
    id: "std_2026_0942",
    name: "Rafa Alfa",
    email: "rafa.alfa@campus.ac.id",
    university: "Universitas Sebelas Maret",
    semester: 3,
  },
  stats: {
    queriesRun: 28,
    completedTopics: 6,
    totalTopics: 10,
    streakDays: 4,
  },
  learningTopics: [
    {
      id: "top_select",
      name: "SELECT BASICS",
      description: "Pengambilan kolom, ekspresi kolom, dan alias atribut",
      progress: 100,
      completed: true,
      category: "DML",
    },
    {
      id: "top_where",
      name: "WHERE CLAUSE & FILTER",
      description: "Penyaringan data menggunakan operator logis AND/OR/BETWEEN",
      progress: 85,
      completed: false,
      category: "DML",
    },
    {
      id: "top_join",
      name: "JOIN RELATIONS",
      description: "Penggabungan multi-tabel dengan INNER, LEFT, dan RIGHT JOIN",
      progress: 60,
      completed: false,
      category: "DML",
    },
    {
      id: "top_groupby",
      name: "GROUP BY & AGGREGATE",
      description: "Agregasi data kolektif dengan COUNT, SUM, AVG, dan klausa HAVING",
      progress: 40,
      completed: false,
      category: "DML",
    },
    {
      id: "top_orderby",
      name: "ORDER BY & LIMIT",
      description: "Pengurutan hasil data secara ASC/DESC serta paging limit",
      progress: 90,
      completed: false,
      category: "DML",
    },
    {
      id: "top_subquery",
      name: "SUBQUERY & NESTED",
      description: "Query bersarang skalar dan korelasi subquery",
      progress: 20,
      completed: false,
      category: "Advanced",
    },
  ],
  nextTopic: {
    id: "top_join_basics",
    name: "JOIN BASICS & INNER JOIN",
    description: "Pelajari bagaimana tabel mahasiswa dan perkuliahan dihubungkan secara relasional langkah demi langkah.",
    difficulty: "Intermediate",
    estimatedMinutes: 25,
  },
  recentActivities: [
    {
      id: "qry_9182",
      sql: "SELECT mhs.nama, mhs.nim, krs.matkul FROM mahasiswa mhs INNER JOIN krs ON mhs.id = krs.mhs_id;",
      status: "success",
      executedAt: "2 menit yang lalu",
      executionTimeMs: 18,
      affectedRows: 14,
    },
    {
      id: "qry_9181",
      sql: "SELECT nama, email FROM mahasiswa WHERE angkatan = 2024 ORDER BY nama ASC;",
      status: "success",
      executedAt: "25 menit yang lalu",
      executionTimeMs: 12,
      affectedRows: 42,
    },
    {
      id: "qry_9180",
      sql: "SELEC id, skor FROM nilai WHERE skor >= 80;",
      status: "error",
      executedAt: "1 jam yang lalu",
      executionTimeMs: 5,
      affectedRows: 0,
    },
    {
      id: "qry_9179",
      sql: "SELECT jurusan, COUNT(*) AS total_mhs FROM mahasiswa GROUP BY jurusan HAVING COUNT(*) > 10;",
      status: "success",
      executedAt: "Kemarin, 16:40",
      executionTimeMs: 24,
      affectedRows: 5,
    },
    {
      id: "qry_9178",
      sql: "SELECT * FROM perkuliahan WHERE semester = 3 ORDER BY jadwal ASC;",
      status: "success",
      executedAt: "2 hari yang lalu",
      executionTimeMs: 15,
      affectedRows: 8,
    },
  ],
}

/**
 * Asynchronous simulated API for fetching dashboard data.
 * Adheres strictly to the requirement of treating API response as `unknown`
 * and validating it with Zod runtime parse before returning strongly typed data.
 */
export async function getDashboardData(
  _studentId?: StudentId,
  shouldFail: boolean = false
): Promise<DashboardData> {
  // Simulate network round-trip latency
  await delay(850)

  if (shouldFail) {
    throw new Error(
      "Gagal terhubung dengan server akademik SQLens. Periksa koneksi internet Anda atau coba kembali."
    )
  }

  // Runtime validation of unknown external data using Zod
  const validatedDashboard = DashboardDataSchema.parse(rawMockApiResponse)
  return validatedDashboard
}
