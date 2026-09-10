import { QueryExecutionResponseSchema, QueryHistoryItemSchema } from "../schemas/query.schema"
import {
  type ExecuteQueryInput,
  type QueryExecutionResponse,
  type QueryHistoryItem,
} from "../types/query.types"

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms)
  })

const DANGEROUS_KEYWORDS = [
  "INSERT",
  "UPDATE",
  "DELETE",
  "DROP",
  "ALTER",
  "TRUNCATE",
  "CREATE",
  "GRANT",
  "REVOKE",
]

/**
 * Initial mock query history data.
 */
const initialHistoryRaw: unknown[] = [
  {
    id: "qry_hist_01",
    sql: "SELECT * FROM students;",
    status: "success",
    executedAt: "5 menit yang lalu",
    rowCount: 5,
  },
  {
    id: "qry_hist_02",
    sql: "SELECT name, score FROM students WHERE score >= 80;",
    status: "success",
    executedAt: "18 menit yang lalu",
    rowCount: 3,
  },
  {
    id: "qry_hist_03",
    sql: "SELEC name FROM students;",
    status: "error",
    executedAt: "1 jam yang lalu",
    rowCount: 0,
  },
]

/**
 * Validates and retrieves the initial query history list.
 */
export async function getInitialQueryHistory(): Promise<QueryHistoryItem[]> {
  await delay(200)
  return initialHistoryRaw.map((raw) => QueryHistoryItemSchema.parse(raw))
}

/**
 * Simulated SQL execution service.
 * Performs simulated validation, latency delay, and Zod response runtime verification.
 */
export async function executeQuery(
  input: ExecuteQueryInput
): Promise<QueryExecutionResponse> {
  // Simulate network round-trip
  await delay(650)

  const normalizedSql = input.sql.trim()
  const upperSql = normalizedSql.toUpperCase()

  // 1. Safety Check: Educational rejection of mutation commands
  const detectedDangerous = DANGEROUS_KEYWORDS.find((keyword) =>
    upperSql.includes(keyword)
  )

  if (detectedDangerous) {
    const rawErrorResponse: unknown = {
      executionId: `exec_${Math.random().toString(36).substring(2, 9)}`,
      queryId: `qry_${Math.random().toString(36).substring(2, 9)}`,
      sql: normalizedSql,
      status: "error",
      executionTimeMs: 8,
      error: `Operasi Modifikasi (${detectedDangerous}) Ditolak.`,
      hint: "SQL Playground dirancang khusus untuk latihan query pengambilan data (SELECT). Perintah manipulasi/definisi data dinonaktifkan dalam lingkungan simulasi praktikum ini.",
    }
    return QueryExecutionResponseSchema.parse(rawErrorResponse)
  }

  // 2. Syntax Typo Check (e.g. SELEC)
  if (upperSql.startsWith("SELEC ") || !upperSql.startsWith("SELECT")) {
    const rawErrorResponse: unknown = {
      executionId: `exec_${Math.random().toString(36).substring(2, 9)}`,
      queryId: `qry_${Math.random().toString(36).substring(2, 9)}`,
      sql: normalizedSql,
      status: "error",
      executionTimeMs: 12,
      error: 'Syntax error near "' + normalizedSql.split(" ")[0] + '"',
      hint: 'Periksa kembali kata kunci SQL Anda. Apakah Anda bermaksud menulis: SELECT ... FROM ... ?',
    }
    return QueryExecutionResponseSchema.parse(rawErrorResponse)
  }

  // 3. Scenario: JOIN Query
  if (upperSql.includes("JOIN")) {
    const rawResponse: unknown = {
      executionId: `exec_${Math.random().toString(36).substring(2, 9)}`,
      queryId: `qry_${Math.random().toString(36).substring(2, 9)}`,
      sql: normalizedSql,
      status: "success",
      executionTimeMs: 22,
      result: {
        columns: [
          { name: "student_name", dataType: "varchar" },
          { name: "course_name", dataType: "varchar" },
          { name: "credits", dataType: "integer" },
        ],
        rows: [
          { student_name: "Andi Pratama", course_name: "Sistem Basis Data", credits: 3 },
          { student_name: "Budi Santoso", course_name: "Struktur Data & Algoritma", credits: 4 },
          { student_name: "Citra Lestari", course_name: "Sistem Basis Data", credits: 3 },
          { student_name: "Dian Permana", course_name: "Jaringan Komputer", credits: 3 },
        ],
        rowCount: 4,
      },
      steps: [
        {
          stepNumber: 1,
          type: "from",
          title: "FROM students",
          description: "Memuat seluruh rekaman dasar dari tabel mahasiswa (students).",
          details: "5 baris data dipersiapkan untuk proses pencocokan relasi.",
        },
        {
          stepNumber: 2,
          type: "join",
          title: "INNER JOIN courses ON students.course_id = courses.id",
          description: "Mencocokkan kunci asing course_id pada students dengan kunci utama id pada courses.",
          details: "4 baris berhasil dipasangkan; 1 mahasiswa tanpa mata kuliah dikecualikan.",
        },
        {
          stepNumber: 3,
          type: "select",
          title: "SELECT student_name, course_name, credits",
          description: "Memproyeksikan kolom hasil gabungan ke format visual tabel.",
          details: "Menghasilkan 4 baris data relasional.",
        },
      ],
      joinDetails: {
        leftTable: "students",
        rightTable: "courses",
        leftKey: "course_id",
        rightKey: "id",
        joinType: "INNER JOIN",
      },
    }
    return QueryExecutionResponseSchema.parse(rawResponse)
  }

  // 4. Scenario: WHERE Clause Query
  if (upperSql.includes("WHERE")) {
    const rawResponse: unknown = {
      executionId: `exec_${Math.random().toString(36).substring(2, 9)}`,
      queryId: `qry_${Math.random().toString(36).substring(2, 9)}`,
      sql: normalizedSql,
      status: "success",
      executionTimeMs: 14,
      result: {
        columns: [
          { name: "name", dataType: "varchar" },
          { name: "score", dataType: "integer" },
        ],
        rows: [
          { name: "Andi Pratama", score: 90 },
          { name: "Budi Santoso", score: 85 },
          { name: "Citra Lestari", score: 88 },
        ],
        rowCount: 3,
      },
      steps: [
        {
          stepNumber: 1,
          type: "from",
          title: "FROM students",
          description: "Memindai seluruh baris data dari tabel students.",
          details: "Membaca total 5 baris dari penyimpanan.",
        },
        {
          stepNumber: 2,
          type: "where",
          title: "WHERE score >= 80",
          description: "Mengevaluasi ekspresi filter boolean untuk setiap baris data.",
          details: "3 baris memenuhi kriteria (skor >= 80); 2 baris tereliminasi.",
        },
        {
          stepNumber: 3,
          type: "select",
          title: "SELECT name, score",
          description: "Menyaring dan memproyeksikan hanya kolom name dan score.",
          details: "Menyajikan 3 baris data pada tabel hasil.",
        },
      ],
    }
    return QueryExecutionResponseSchema.parse(rawResponse)
  }

  // 5. Scenario: General SELECT / SELECT *
  const rawResponse: unknown = {
    executionId: `exec_${Math.random().toString(36).substring(2, 9)}`,
    queryId: `qry_${Math.random().toString(36).substring(2, 9)}`,
    sql: normalizedSql,
    status: "success",
    executionTimeMs: 11,
    result: {
      columns: [
        { name: "id", dataType: "integer" },
        { name: "name", dataType: "varchar" },
        { name: "score", dataType: "integer" },
        { name: "course_id", dataType: "integer" },
      ],
      rows: [
        { id: 1, name: "Andi Pratama", score: 90, course_id: 101 },
        { id: 2, name: "Budi Santoso", score: 85, course_id: 102 },
        { id: 3, name: "Citra Lestari", score: 88, course_id: 101 },
        { id: 4, name: "Dian Permana", score: 74, course_id: 103 },
        { id: 5, name: "Eka Saputra", score: 68, course_id: 104 },
      ],
      rowCount: 5,
    },
    steps: [
      {
        stepNumber: 1,
        type: "from",
        title: "FROM students",
        description: "Membaca data awal dari tabel students.",
        details: "Full table scan: 5 baris ditemukan.",
      },
      {
        stepNumber: 2,
        type: "select",
        title: "SELECT *",
        description: "Memproyeksikan seluruh kolom yang tersedia tanpa penyaringan.",
        details: "4 kolom diekspos: id, name, score, course_id.",
      },
    ],
  }

  return QueryExecutionResponseSchema.parse(rawResponse)
}
