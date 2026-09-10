import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Database, Table, Key, Code2 } from "lucide-react"

interface AvailableTablesProps {
  onSelectTemplate: (sql: string) => void
}

export function AvailableTables({ onSelectTemplate }: AvailableTablesProps) {
  return (
    <Card variant="default">
      <CardHeader className="border-b-2 border-[#111111] pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <Database className="w-4 h-4 text-[#111111]" />
            AVAILABLE TABLES &bull; MOCK SCHEMA
          </CardTitle>
          <Badge variant="yellow" size="sm" className="font-mono">
            2 TABLES
          </Badge>
        </div>
        <p className="text-xs text-zinc-600">
          Struktur skema basis data akademik yang dapat Anda jadikan target query
        </p>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        {/* Tables Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
          {/* Table: students */}
          <div className="border-2 border-[#111111] bg-[#F7F7F2] p-3 shadow-neo-sm">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#111111]">
              <span className="font-black text-[#111111] flex items-center gap-1">
                <Table className="w-3.5 h-3.5 text-[#111111]" /> students
              </span>
              <span className="text-[10px] text-zinc-500 font-bold">5 baris</span>
            </div>
            <ul className="space-y-1 text-[11px]">
              <li className="flex items-center justify-between">
                <span className="flex items-center gap-1 font-bold">
                  <Key className="w-2.5 h-2.5 text-[#FFD600]" /> id
                </span>
                <span className="text-zinc-500">INTEGER (PK)</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="font-bold">name</span>
                <span className="text-zinc-500">VARCHAR(50)</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="font-bold">score</span>
                <span className="text-zinc-500">INTEGER</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="font-bold">course_id</span>
                <span className="text-zinc-500">INTEGER (FK)</span>
              </li>
            </ul>
          </div>

          {/* Table: courses */}
          <div className="border-2 border-[#111111] bg-[#F7F7F2] p-3 shadow-neo-sm">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#111111]">
              <span className="font-black text-[#111111] flex items-center gap-1">
                <Table className="w-3.5 h-3.5 text-[#111111]" /> courses
              </span>
              <span className="text-[10px] text-zinc-500 font-bold">4 baris</span>
            </div>
            <ul className="space-y-1 text-[11px]">
              <li className="flex items-center justify-between">
                <span className="flex items-center gap-1 font-bold">
                  <Key className="w-2.5 h-2.5 text-[#FFD600]" /> id
                </span>
                <span className="text-zinc-500">INTEGER (PK)</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="font-bold">course_name</span>
                <span className="text-zinc-500">VARCHAR(60)</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="font-bold">credits</span>
                <span className="text-zinc-500">INTEGER</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Quick Query Templates */}
        <div className="pt-2 border-t border-zinc-300">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-600 block mb-2 flex items-center gap-1">
            <Code2 className="w-3.5 h-3.5" /> Template Query Cepat:
          </span>
          <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
            <button
              type="button"
              onClick={() => onSelectTemplate("SELECT * FROM students;")}
              className="px-2.5 py-1 bg-white hover:bg-[#FFD600] border border-[#111111] font-bold shadow-neo-sm hover:shadow-none transition-all cursor-pointer"
            >
              1. Basic SELECT *
            </button>
            <button
              type="button"
              onClick={() => onSelectTemplate("SELECT name, score FROM students WHERE score >= 80;")}
              className="px-2.5 py-1 bg-white hover:bg-[#FFD600] border border-[#111111] font-bold shadow-neo-sm hover:shadow-none transition-all cursor-pointer"
            >
              2. Filter WHERE
            </button>
            <button
              type="button"
              onClick={() => onSelectTemplate("SELECT students.name, courses.course_name FROM students JOIN courses ON students.course_id = courses.id;")}
              className="px-2.5 py-1 bg-white hover:bg-[#FFD600] border border-[#111111] font-bold shadow-neo-sm hover:shadow-none transition-all cursor-pointer"
            >
              3. Relasi JOIN
            </button>
            <button
              type="button"
              onClick={() => onSelectTemplate("SELEC name FROM students;")}
              className="px-2.5 py-1 bg-white hover:bg-red-200 border border-[#111111] font-bold shadow-neo-sm hover:shadow-none transition-all cursor-pointer text-red-800"
            >
              4. Uji Typo Syntax
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
