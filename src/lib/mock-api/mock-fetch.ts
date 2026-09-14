/**
 * Mock Fetch API Layer for SQLens Database Query Tutor.
 * Intercepts requests targeting `/api/*` endpoints and returns standards-compliant
 * `Response` objects with simulated latency and realistic HTTP status codes.
 */

const LATENCY_MAP: Record<string, number> = {
  "/api/auth/login": 600,
  "/api/auth/register": 700,
  "/api/dashboard": 550,
  "/api/query/execute": 500,
  "/api/query/history": 200,
}

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

const initialHistoryData = [
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

const dashboardMockPayload = {
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
    description:
      "Pelajari bagaimana tabel mahasiswa dan perkuliahan dihubungkan secara relasional langkah demi langkah.",
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

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms))

function createJsonResponse(data: unknown, status: number = 200, statusText: string = "OK"): Response {
  return new Response(JSON.stringify(data), {
    status,
    statusText,
    headers: {
      "Content-Type": "application/json",
      "X-Mock-Engine": "SQLens-Fetch-Simulation",
    },
  })
}

/**
 * Dispatches simulated REST requests and returns real web standard Response instances.
 */
async function handleMockRequest(url: string, method: string, body?: string | null): Promise<Response> {
  const parsedUrl = new URL(url, "http://localhost")
  const pathname = parsedUrl.pathname
  const latency = LATENCY_MAP[pathname] ?? 300
  await delay(latency)

  // 1. POST /api/auth/login
  if (pathname === "/api/auth/login" && method === "POST") {
    const payload = body ? JSON.parse(body) : {}
    const { email, password } = payload

    if (typeof email === "string" && (email.includes("fail") || password === "wrongpassword")) {
      return createJsonResponse(
        { message: "Kombinasi email atau password salah. Silakan coba lagi." },
        401,
        "Unauthorized"
      )
    }

    return createJsonResponse({
      user: {
        id: `usr_${Math.random().toString(36).substring(2, 9)}`,
        name: typeof email === "string" ? email.split("@")[0] : "SQL Student",
        email: email ?? "student@campus.ac.id",
        role: "student",
      },
      token: `sqlens_jwt_${Math.random().toString(36).substring(2)}`,
      message: "Otentikasi berhasil. Selamat datang kembali di SQLens!",
    })
  }

  // 2. POST /api/auth/register
  if (pathname === "/api/auth/register" && method === "POST") {
    const payload = body ? JSON.parse(body) : {}
    const { fullName, email } = payload

    if (typeof email === "string" && email.includes("exists")) {
      return createJsonResponse(
        { message: "Email ini sudah terdaftar dalam sistem akademik SQLens." },
        409,
        "Conflict"
      )
    }

    return createJsonResponse({
      user: {
        id: `usr_${Math.random().toString(36).substring(2, 9)}`,
        name: fullName || "Mahasiswa Baru",
        email: email || "student@campus.ac.id",
        role: "student",
      },
      token: `sqlens_jwt_${Math.random().toString(36).substring(2)}`,
      message: "Pendaftaran berhasil! Akun Anda siap digunakan untuk latihan SQL.",
    })
  }

  // 3. GET /api/dashboard
  if (pathname === "/api/dashboard" && method === "GET") {
    const shouldFail = parsedUrl.searchParams.get("fail") === "true"

    if (shouldFail) {
      return createJsonResponse(
        {
          message:
            "Gagal terhubung dengan server akademik SQLens. Periksa koneksi internet Anda atau coba kembali.",
        },
        500,
        "Internal Server Error"
      )
    }

    return createJsonResponse(dashboardMockPayload)
  }

  // 4. POST /api/query/execute
  if (pathname === "/api/query/execute" && method === "POST") {
    const payload = body ? JSON.parse(body) : {}
    const sql: string = typeof payload.sql === "string" ? payload.sql : ""
    const normalizedSql = sql.trim()
    const upperSql = normalizedSql.toUpperCase()

    // Safety guard
    const detectedDangerous = DANGEROUS_KEYWORDS.find((k) => upperSql.includes(k))
    if (detectedDangerous) {
      return createJsonResponse({
        executionId: `exec_${Math.random().toString(36).substring(2, 9)}`,
        queryId: `qry_${Math.random().toString(36).substring(2, 9)}`,
        sql: normalizedSql,
        status: "error",
        executionTimeMs: 8,
        error: `Operasi Modifikasi (${detectedDangerous}) Ditolak.`,
        hint: "SQL Playground dirancang khusus untuk latihan query pengambilan data (SELECT). Perintah manipulasi/definisi data dinonaktifkan dalam lingkungan simulasi praktikum ini.",
      })
    }

    // Syntax Typo check
    if (upperSql.startsWith("SELEC ") || !upperSql.startsWith("SELECT")) {
      return createJsonResponse({
        executionId: `exec_${Math.random().toString(36).substring(2, 9)}`,
        queryId: `qry_${Math.random().toString(36).substring(2, 9)}`,
        sql: normalizedSql,
        status: "error",
        executionTimeMs: 12,
        error: `Syntax error near "${normalizedSql.split(" ")[0]}"`,
        hint: "Periksa kembali kata kunci SQL Anda. Apakah Anda bermaksud menulis: SELECT ... FROM ... ?",
      })
    }

    // Scenario: JOIN
    if (upperSql.includes("JOIN")) {
      return createJsonResponse({
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
      })
    }

    // Scenario: WHERE
    if (upperSql.includes("WHERE")) {
      return createJsonResponse({
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
      })
    }

    // Scenario: Default SELECT *
    return createJsonResponse({
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
    })
  }

  // 5. GET /api/query/history
  if (pathname === "/api/query/history" && method === "GET") {
    return createJsonResponse(initialHistoryData)
  }

  // Fallback 404 for unknown mock endpoints
  return createJsonResponse({ message: `Endpoint ${method} ${pathname} tidak ditemukan pada mock API.` }, 404, "Not Found")
}

/**
 * Initializes the client-side Fetch interceptor for /api/* routes.
 */
export function setupMockFetch(): void {
  if (typeof window === "undefined") return

  const originalFetch = window.fetch.bind(window)

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    let urlString = ""
    let method = "GET"
    let body: string | null = null

    if (typeof input === "string") {
      urlString = input
    } else if (input instanceof URL) {
      urlString = input.toString()
    } else if (input instanceof Request) {
      urlString = input.url
      method = input.method
      try {
        body = await input.clone().text()
      } catch {
        body = null
      }
    }

    if (init?.method) {
      method = init.method.toUpperCase()
    }
    if (init?.body) {
      body = typeof init.body === "string" ? init.body : JSON.stringify(init.body)
    }

    // Only intercept routes starting with /api/
    const isMockRoute = urlString.startsWith("/api/") || urlString.includes("://localhost/api/")

    if (isMockRoute) {
      return handleMockRequest(urlString, method, body)
    }

    return originalFetch(input, init)
  }
}
