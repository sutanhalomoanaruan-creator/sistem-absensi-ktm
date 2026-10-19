export type AttendanceStatus = 'Hadir' | 'Terlambat' | 'Alpha'

export interface Student {
  id: string
  name: string
  nim: string
  program: string
  initials: string
  color: string
}

export interface ClassSchedule {
  id: string
  course: string
  code: string
  lecturer: string
  room: string
  day: number
  start: string
  end: string
  enrolled: number
}

export interface AttendanceRecord {
  id: string
  studentId: string
  scheduleId: string
  date: string
  time: string
  status: AttendanceStatus
}

export interface IntelligenceAlert {
  id: string
  title: string
  detail: string
  time: string
  kind: 'warning' | 'info'
}

export interface TapInput {
  studentId: string
  room: string
  timestamp: string
}

export interface TapResult {
  ok: boolean
  status?: Exclude<AttendanceStatus, 'Alpha'>
  message: string
  student?: Student
  schedule?: ClassSchedule
}

export const students: Student[] = [
  { id: 'ktm-1', name: 'Nadia Putri Anjani', nim: '2023101001', program: 'Sistem Informasi', initials: 'NA', color: 'violet' },
  { id: 'ktm-2', name: 'Rizky Aditya Pratama', nim: '2023101002', program: 'Sistem Informasi', initials: 'RP', color: 'blue' },
  { id: 'ktm-3', name: 'Alya Safitri', nim: '2023101003', program: 'Sistem Informasi', initials: 'AS', color: 'orange' },
  { id: 'ktm-4', name: 'Fajar Ramadhan', nim: '2023101004', program: 'Sistem Informasi', initials: 'FR', color: 'green' },
  { id: 'ktm-5', name: 'Dimas Mahendra', nim: '2023101005', program: 'Sistem Informasi', initials: 'DM', color: 'pink' },
  { id: 'ktm-6', name: 'Salsabila Rahma', nim: '2023101006', program: 'Sistem Informasi', initials: 'SR', color: 'teal' },
]

export const schedules: ClassSchedule[] = [
  { id: 'si-301', course: 'Analisis & Perancangan Sistem', code: 'SI204', lecturer: 'Dr. Maya Lestari, M.Kom', room: 'A-302', day: 1, start: '08:00', end: '09:40', enrolled: 32 },
  { id: 'si-205', course: 'Basis Data Lanjut', code: 'SI302', lecturer: 'Andi Pratama, M.T.', room: 'B-201', day: 1, start: '10:00', end: '11:40', enrolled: 28 },
  { id: 'si-102', course: 'Interaksi Manusia & Komputer', code: 'SI208', lecturer: 'Dr. Maya Lestari, M.Kom', room: 'A-302', day: 2, start: '09:00', end: '10:40', enrolled: 30 },
  { id: 'si-410', course: 'Kecerdasan Buatan', code: 'SI401', lecturer: 'Budi Santoso, Ph.D.', room: 'C-105', day: 3, start: '13:00', end: '14:40', enrolled: 26 },
]

const today = new Date()
const localDateString = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
const dateOffset = (days: number) => {
  const date = new Date(today)
  date.setDate(date.getDate() + days)
  return localDateString(date)
}
const mondayOffset = (1 - today.getDay() + 7) % 7
export const demoClassDate = dateOffset(mondayOffset)

export const initialRecords: AttendanceRecord[] = [
  { id: 'rec-1', studentId: 'ktm-1', scheduleId: 'si-301', date: demoClassDate, time: '07:54', status: 'Hadir' },
  { id: 'rec-2', studentId: 'ktm-2', scheduleId: 'si-301', date: demoClassDate, time: '08:04', status: 'Hadir' },
  { id: 'rec-3', studentId: 'ktm-3', scheduleId: 'si-301', date: demoClassDate, time: '08:19', status: 'Terlambat' },
  { id: 'rec-4', studentId: 'ktm-4', scheduleId: 'si-301', date: demoClassDate, time: '07:58', status: 'Hadir' },
  { id: 'rec-5', studentId: 'ktm-5', scheduleId: 'si-301', date: demoClassDate, time: '08:02', status: 'Hadir' },
  { id: 'rec-6', studentId: 'ktm-6', scheduleId: 'si-301', date: demoClassDate, time: '08:27', status: 'Terlambat' },
  { id: 'rec-7', studentId: 'ktm-1', scheduleId: 'si-205', date: demoClassDate, time: '09:56', status: 'Hadir' },
  { id: 'rec-8', studentId: 'ktm-3', scheduleId: 'si-205', date: demoClassDate, time: '10:18', status: 'Terlambat' },
]

export const initialAlerts: IntelligenceAlert[] = [
  { id: 'alert-1', title: 'Pola keterlambatan terdeteksi', detail: '3 mahasiswa terlambat lebih dari 2 kali minggu ini.', time: '10 menit lalu', kind: 'warning' },
  { id: 'alert-2', title: 'Percobaan tap di luar jadwal', detail: 'KTM 2023101028 terdeteksi di Gedung B, pukul 07.42.', time: '32 menit lalu', kind: 'warning' },
  { id: 'alert-3', title: 'Kelayakan UAS perlu perhatian', detail: '2 mahasiswa berada di bawah ambang kehadiran 75%.', time: '1 jam lalu', kind: 'info' },
]

export const formatDate = (date: Date) => new Intl.DateTimeFormat('id-ID', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
}).format(date)

export const formatShortDate = (value: string) => new Intl.DateTimeFormat('id-ID', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
}).format(new Date(`${value}T00:00:00`))

export function validateTap(input: TapInput, records: AttendanceRecord[]): TapResult {
  const student = students.find((item) => item.nim === input.studentId.trim())
  if (!student) {
    return { ok: false, message: 'Nomor KTM tidak terdaftar. Periksa kembali NIM yang dimasukkan.' }
  }

  const tappedAt = new Date(input.timestamp)
  if (!input.timestamp || Number.isNaN(tappedAt.getTime())) {
    return { ok: false, message: 'Waktu tap tidak valid. Pilih tanggal dan waktu yang benar.' }
  }

  const day = tappedAt.getDay()
  const date = input.timestamp.slice(0, 10)
  const time = `${String(tappedAt.getHours()).padStart(2, '0')}:${String(tappedAt.getMinutes()).padStart(2, '0')}`
  const candidates = schedules.filter((schedule) => schedule.room === input.room && schedule.day === day)
  const schedule = candidates.find((item) => time >= item.start && time <= item.end)
  if (!schedule) {
    const roomHasClass = candidates.length > 0
    return {
      ok: false,
      student,
      message: roomHasClass
        ? `Belum ada jadwal aktif di ruang ${input.room} pada pukul ${time}.`
        : `Tidak ditemukan jadwal kuliah untuk ruang ${input.room} pada hari tersebut.`,
    }
  }

  if (records.some((record) => record.studentId === student.id && record.scheduleId === schedule.id && record.date === date)) {
    return { ok: false, student, schedule, message: 'Kehadiran untuk kelas ini sudah tercatat. Satu KTM hanya dapat digunakan sekali per sesi.' }
  }

  const [startHour, startMinute] = schedule.start.split(':').map(Number)
  const minutesLate = tappedAt.getHours() * 60 + tappedAt.getMinutes() - (startHour * 60 + startMinute)
  return {
    ok: true,
    student,
    schedule,
    status: minutesLate > 15 ? 'Terlambat' : 'Hadir',
    message: minutesLate > 15
      ? `Kehadiran tercatat terlambat ${minutesLate} menit.`
      : 'Kehadiran berhasil tercatat. Selamat mengikuti perkuliahan!',
  }
}
