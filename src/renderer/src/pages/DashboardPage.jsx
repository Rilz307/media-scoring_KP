import { Search, Plus, FileText } from "lucide-react"

import dummyMedia from "../constants/dummyMedia"

export default function DashboardPage() {
  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold">
            Dashboard
          </h1>

          <p className="text-slate-500">
            Sistem Skoring Media Kominfo Kota Kendari
          </p>

        </div>

        <div className="flex gap-3">

          <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">

            <Plus size={18} />

            Tambah Media

          </button>

          <button className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700">

            <FileText size={18} />

            Rekapitulasi

          </button>

        </div>

      </div>

      {/* Search */}

      <div className="rounded-xl bg-white p-5 shadow">

        <div className="grid grid-cols-3 gap-4">

          <div className="relative">

            <Search
              className="absolute left-3 top-3 text-slate-400"
              size={18}
            />

            <input
              placeholder="Cari media..."
              className="w-full rounded-lg border pl-10 pr-3 py-2"
            />

          </div>

          <select className="rounded-lg border p-2">

            <option>Semua Jenis</option>

            <option>SIBER</option>

            <option>CETAK</option>

            <option>ELEKTRONIK</option>

          </select>

          <select className="rounded-lg border p-2">

            <option>Semua Grade</option>

            <option>A</option>

            <option>B</option>

            <option>C</option>

          </select>

        </div>

      </div>

      {/* Table */}

      <div className="overflow-hidden rounded-xl bg-white shadow">

        <table className="w-full">

          <thead className="bg-slate-100">

            <tr>

              <th className="p-4 text-left">Nama Media</th>

              <th className="p-4 text-left">Jenis</th>

              <th className="p-4 text-left">Skor</th>

              <th className="p-4 text-left">Grade</th>

              <th className="p-4 text-center">Aksi</th>

            </tr>

          </thead>

          <tbody>

            {dummyMedia.map((media) => (

              <tr
                key={media.id}
                className="border-t"
              >

                <td className="p-4">
                  {media.nama}
                </td>

                <td className="p-4">
                  {media.jenis}
                </td>

                <td className="p-4">
                  {media.skor}
                </td>

                <td className="p-4">

                  <span className="rounded-full bg-green-100 px-3 py-1 text-green-700">

                    {media.grade}

                  </span>

                </td>

                <td className="p-4 text-center space-x-2">

                  <button className="rounded bg-sky-500 px-3 py-1 text-white">

                    Detail

                  </button>

                  <button className="rounded bg-yellow-500 px-3 py-1 text-white">

                    Edit

                  </button>

                  <button className="rounded bg-red-500 px-3 py-1 text-white">

                    Hapus

                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  )
}