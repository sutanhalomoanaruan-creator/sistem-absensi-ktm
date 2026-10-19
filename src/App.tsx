import { useMemo, useState } from 'react'
import {
  Activity, AlertTriangle, ArrowDownRight, ArrowRight, ArrowUpRight, Bell,
  BookOpen, CalendarDays, Check, CheckCircle2, ChevronDown, ChevronLeft,
  ChevronRight, CircleHelp, Clock3, Download, FileText, Fingerprint,
  GraduationCap, LayoutDashboard, MoreHorizontal, Search, Settings2,
  ShieldCheck, SlidersHorizontal, Smartphone, Sparkles, Users, X,
} from 'lucide-react'
import {
  demoClassDate, formatDate, formatShortDate, initialAlerts, initialRecords,
  schedules, students, validateTap,
  type AttendanceRecord, type IntelligenceAlert,
} from './attendance'

type Page = 'overview' | 'lecturer' | 'student' | 'admin' | 'simulator'
type Role = 'Dosen' | 'Mahasiswa' | 'Admin Akademik'

const navGroups = [
  {
    label: 'MENU UTAMA',
    items: [
      { id: 'overview' as const, label: 'Ringkasan', icon: LayoutDashboard },
      { id: 'lecturer' as const, label: 'Dashboard dosen', icon: BookOpen },
      { id: 'student' as const, label: 'Portal mahasiswa', icon: GraduationCap },
      { id: 'admin' as const, label: 'Akademik & laporan', icon: Users },
    ],
  },
]

const navLabel: Record<Page, string> = {
  overview: 'Ringkasan',
  lecturer: 'Dashboard dosen',
  student: 'Portal mahasiswa',
  admin: 'Akademik & laporan',
  simulator: 'Simulasi tap KTM',
}

function roleFromValue(value: string): Role {
  if (value === 'Mahasiswa') return 'Mahasiswa'
  if (value === 'Admin Akademik') return 'Admin Akademik'
  return 'Dosen'
}

function Avatar({ initials, color = 'blue', small = false }: { initials: string; color?: string; small?: boolean }) {
  return <span className={`avatar avatar-${color} ${small ? 'avatar-small' : ''}`}>{initials}</span>
}

function Badge({ children, tone = 'blue' }: { children: React.ReactNode; tone?: 'blue' | 'green' | 'amber' | 'red' | 'gray' }) {
  return <span className={`badge badge-${tone}`}>{children}</span>
}

function App() {
  const [page, setPage] = useState<Page>('overview')
  const [role, setRole] = useState<Role>('Dosen')
  const [records, setRecords] = useState(initialRecords)
  const [alerts, setAlerts] = useState(initialAlerts)
  const [toast, setToast] = useState('')
  const [search, setSearch] = useState('')

  const notify = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 3200)
  }

  const changeRole = (nextRole: Role) => {
    setRole(nextRole)
    setPage(nextRole === 'Mahasiswa' ? 'student' : nextRole === 'Admin Akademik' ? 'admin' : 'overview')
  }

  const recordTap = (nim: string, room: string, timestamp: string) => {
    const result = validateTap({ studentId: nim, room, timestamp }, records)
    if (result.ok && result.student && result.schedule && result.status) {
      const tapDate = new Date(timestamp)
      const record: AttendanceRecord = {
        id: `rec-${Date.now()}`,
        studentId: result.student.id,
        scheduleId: result.schedule.id,
        date: timestamp.slice(0, 10),
        time: `${String(tapDate.getHours()).padStart(2, '0')}:${String(tapDate.getMinutes()).padStart(2, '0')}`,
        status: result.status,
      }
      setRecords((current) => [record, ...current])
      notify('Data kehadiran berhasil disinkronkan ke SIAKAD.')
    } else {
      const newAlert: IntelligenceAlert = {
        id: `alert-${Date.now()}`,
        title: result.message.includes('terdaftar') ? 'KTM tidak terdaftar' : 'Percobaan tap tidak valid',
        detail: `KTM ${nim || 'tidak diketahui'} · Ruang ${room} · ${timestamp.replace('T', ' ')}`,
        time: 'Baru saja',
        kind: 'warning',
      }
      setAlerts((current) => [newAlert, ...current])
    }
    return result
  }

  return (
    <div className="app-shell min-h-screen bg-slate-50 text-slate-900">
      <aside className="sidebar">
        <a className="brand" href="#" onClick={(event) => { event.preventDefault(); setPage('overview') }}>
          <span className="brand-mark"><Fingerprint size={23} strokeWidth={2.3} /></span>
          <span className="brand-copy"><strong>attendly</strong><small>SMART CAMPUS SYSTEM</small></span>
        </a>

        <div className="workspace-switch">
          <div className="workspace-icon">K</div>
          <span className="workspace-copy"><strong>Universitas Karya</strong><small>Kampus utama</small></span>
          <ChevronDown size={15} className="muted" />
        </div>

        <nav className="nav-area" aria-label="Navigasi utama">
          {navGroups.map((group) => (
            <div className="nav-group" key={group.label}>
              <div className="nav-caption">{group.label}</div>
              {group.items.map(({ id, label, icon: Icon }) => (
                <button key={id} className={`nav-link ${page === id ? 'active' : ''}`} onClick={() => setPage(id)}>
                  <Icon size={18} strokeWidth={1.8} /><span>{label}</span>
                  {id === 'lecturer' && <span className="nav-count">3</span>}
                </button>
              ))}
            </div>
          ))}
          <div className="nav-group">
            <div className="nav-caption">PERANGKAT</div>
            <button className={`nav-link ${page === 'simulator' ? 'active' : ''}`} onClick={() => setPage('simulator')}>
              <Smartphone size={18} strokeWidth={1.8} /><span>Simulasi tap KTM</span><span className="live-dot" />
            </button>
          </div>
        </nav>

        <div className="sidebar-bottom">
          <div className="help-card">
            <span className="help-icon"><CircleHelp size={17} /></span>
            <div><strong>Butuh bantuan?</strong><span>Pusat panduan Attendly</span></div>
            <ArrowRight size={15} />
          </div>
          <button className="profile-button" onClick={() => changeRole(role === 'Mahasiswa' ? 'Dosen' : role === 'Dosen' ? 'Admin Akademik' : 'Mahasiswa')}>
            <Avatar initials={role === 'Mahasiswa' ? 'NA' : role === 'Admin Akademik' ? 'AD' : 'ML'} color="violet" />
            <span className="profile-copy"><strong>{role === 'Mahasiswa' ? 'Nadia Anjani' : role === 'Admin Akademik' ? 'Admin Akademik' : 'Maya Lestari'}</strong><small>{role}</small></span>
            <MoreHorizontal size={19} className="muted" />
          </button>
        </div>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <div className="breadcrumb"><span>Workspace</span><ChevronRight size={14} /><strong>{navLabel[page]}</strong></div>
          <div className="top-actions">
            <label className="role-switch"><span>Mode demo</span><select aria-label="Pilih peran" value={role} onChange={(event) => changeRole(roleFromValue(event.target.value))}><option>Dosen</option><option>Mahasiswa</option><option>Admin Akademik</option></select></label>
            <label className="search-box"><Search size={16} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari apa saja..." /><kbd>⌘ K</kbd></label>
            <span className="top-divider" />
            <button className="icon-button notification-button" aria-label="Notifikasi" onClick={() => notify(`${alerts.length} notifikasi intelligence perlu ditinjau.`)}><Bell size={18} /><i /></button>
            <button className="top-date" onClick={() => notify(formatDate(new Date()))}><CalendarDays size={16} /> {new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date())}</button>
          </div>
        </header>

        <main className="content flex-1">
          {page === 'overview' && <Overview records={records} alerts={alerts} setPage={setPage} role={role} />}
          {page === 'lecturer' && <LecturerPage records={records} search={search} />}
          {page === 'student' && <StudentPage records={records} />}
          {page === 'admin' && <AdminPage />}
          {page === 'simulator' && <SimulatorPage onTap={recordTap} />}
        </main>
        <footer className="footer"><span>© {new Date().getFullYear()} Attendly · Sistem Absensi Cerdas</span><span><span className="system-dot" /> Seluruh sistem beroperasi normal <span className="footer-separator">·</span> v1.0.4</span></footer>
      </div>
      {toast && <div className="toast"><CheckCircle2 size={18} />{toast}<button aria-label="Tutup" onClick={() => setToast('')}><X size={16} /></button></div>}
    </div>
  )
}

function PageHeading({ eyebrow, title, description, actions }: { eyebrow: string; title: string; description: string; actions?: React.ReactNode }) {
  return <div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>{actions && <div className="heading-actions">{actions}</div>}</div>
}

function Overview({ records, alerts, setPage, role }: { records: AttendanceRecord[]; alerts: IntelligenceAlert[]; setPage: (page: Page) => void; role: Role }) {
  const recentRecords = records.slice(0, 5)
  return (
    <>
      <PageHeading eyebrow={formatDate(new Date()).toUpperCase()} title={`Selamat pagi, ${role === 'Dosen' ? 'Bu Maya' : role === 'Mahasiswa' ? 'Nadia' : 'Admin'} 👋`} description="Berikut ringkasan aktivitas akademik hari ini. Semoga harimu produktif!" actions={<button className="button button-primary" onClick={() => setPage('simulator')}><Fingerprint size={17} /> Simulasi tap KTM</button>} />

      <section className="hero-banner">
        <div className="hero-content">
          <div className="hero-kicker"><Sparkles size={14} /> INTELLIGENCE SNAPSHOT <span>LIVE</span></div>
          <h2>Aktivitas kampus berjalan<br />dengan <span>baik hari ini.</span></h2>
          <p>Sistem memantau kehadiran dari 24 kelas aktif di 8 gedung kampus.</p>
          <button className="hero-link" onClick={() => setPage('lecturer')}>Lihat insight lengkap <ArrowRight size={15} /></button>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" />
          <div className="art-glow" /><div className="art-chip"><Fingerprint size={49} /></div>
          <span className="art-node node-one"><Check size={13} /></span><span className="art-node node-two"><Activity size={13} /></span><span className="art-node node-three"><ShieldCheck size={13} /></span>
          <span className="art-label label-one">Verified</span><span className="art-label label-two">Realtime sync</span>
        </div>
        <div className="hero-corner">AI POWERED <span>✳</span></div>
      </section>

      <section className="stats-grid">
        <StatCard icon={<Users size={18} />} label="Total mahasiswa" value="1.284" meta="+24 mahasiswa baru" trend="up" accent="blue" />
        <StatCard icon={<CheckCircle2 size={18} />} label="Hadir hari ini" value={String(Math.max(0, 846 + records.length - initialRecords.length))} meta="78,4% dari total kelas" trend="up" accent="green" />
        <StatCard icon={<Clock3 size={18} />} label="Terlambat" value="36" meta="Turun 12% dari minggu lalu" trend="down" accent="amber" />
        <StatCard icon={<BookOpen size={18} />} label="Kelas berlangsung" value="24" meta="8 kelas sedang berjalan" trend="neutral" accent="violet" />
      </section>

      <section className="dashboard-grid">
        <div className="panel trend-panel">
          <div className="panel-heading"><div><h3>Tren kehadiran</h3><p>Rangkuman kehadiran dalam 7 hari terakhir</p></div><button className="select-button">Minggu ini <ChevronDown size={14} /></button></div>
          <div className="chart-legend"><span><i className="legend-blue" /> Kehadiran</span><span><i className="legend-light" /> Target 85%</span></div>
          <AttendanceChart />
          <div className="chart-foot"><span><span className="chart-trend"><ArrowUpRight size={14} /> 8,2%</span> dibanding minggu lalu</span><span>Rata-rata <strong>86,4%</strong></span></div>
        </div>

        <div className="panel intelligence-panel">
          <div className="panel-heading"><div><h3><span className="heading-spark"><Sparkles size={15} /></span> Intelligence alert</h3><p>Insight otomatis dari sistem</p></div><span className="alert-counter">{alerts.length} baru</span></div>
          <div className="alert-list">{alerts.slice(0, 3).map((alert) => (
            <div className="alert-item" key={alert.id}><span className={`alert-symbol ${alert.kind}`}><AlertTriangle size={16} /></span><div className="alert-copy"><strong>{alert.title}</strong><span>{alert.detail}</span><small>{alert.time}</small></div><ChevronRight size={15} className="alert-chevron" /></div>
          ))}</div>
          <button className="panel-link" onClick={() => setPage('lecturer')}>Lihat semua insight <ArrowRight size={15} /></button>
        </div>
      </section>

      <section className="lower-grid">
        <div className="panel recent-panel">
          <div className="panel-heading"><div><h3>Aktivitas kehadiran</h3><p>Pembaruan absensi terbaru secara real-time</p></div><button className="text-button" onClick={() => setPage('lecturer')}>Lihat semua <ArrowRight size={14} /></button></div>
          <AttendanceTable records={recentRecords} compact />
        </div>
        <div className="panel schedule-panel">
          <div className="panel-heading"><div><h3>Jadwal hari ini</h3><p>{formatDate(new Date())}</p></div><button className="icon-button small-icon" aria-label="Lihat jadwal" onClick={() => setPage('lecturer')}><ArrowRight size={16} /></button></div>
          <div className="schedule-list">{schedules.slice(0, 3).map((schedule, index) => (
            <div className="schedule-item" key={schedule.id}><div className="schedule-time"><strong>{schedule.start}</strong><span>{schedule.end}</span></div><div className={`schedule-line line-${index}`} /><div className="schedule-info"><strong>{schedule.course}</strong><span>{schedule.code} <i /> {schedule.room}</span></div><Badge tone={index === 0 ? 'green' : 'gray'}>{index === 0 ? 'Berlangsung' : 'Akan datang'}</Badge></div>
          ))}</div>
        </div>
      </section>
    </>
  )
}

function StatCard({ icon, label, value, meta, trend, accent }: { icon: React.ReactNode; label: string; value: string; meta: string; trend: 'up' | 'down' | 'neutral'; accent: string }) {
  return <div className="stat-card"><div className={`stat-icon ${accent}`}>{icon}</div><span className="stat-label">{label}</span><div className="stat-value">{value}</div><div className="stat-meta">{trend === 'up' ? <ArrowUpRight size={14} className="trend-up" /> : trend === 'down' ? <ArrowDownRight size={14} className="trend-down" /> : <span className="neutral-dot" />}{meta}</div><span className={`stat-decoration ${accent}`} /></div>
}

function AttendanceChart() {
  const values = [63, 75, 68, 88, 80, 94, 86]
  const labels = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']
  return <div className="chart-area"><div className="chart-y-labels"><span>100%</span><span>75%</span><span>50%</span><span>25%</span><span>0%</span></div><div className="chart-plot"><div className="chart-gridline line-100" /><div className="chart-gridline line-75" /><div className="chart-gridline line-50" /><div className="chart-gridline line-25" /><div className="target-line" /><div className="chart-bars">{values.map((value, index) => <div className="chart-column" key={labels[index]}><div className={`chart-bar ${index === 5 ? 'highlight' : ''}`} style={{ height: `${value}%` }}><span>{value}%</span></div><small>{labels[index]}</small></div>)}</div></div></div>
}

function AttendanceTable({ records, compact = false }: { records: AttendanceRecord[]; compact?: boolean }) {
  return <div className="table-wrap"><table className="attendance-table"><thead><tr><th>MAHASISWA</th><th>MATA KULIAH</th><th>WAKTU</th><th>STATUS</th></tr></thead><tbody>{records.length ? records.map((record) => {
    const student = students.find((item) => item.id === record.studentId)
    const schedule = schedules.find((item) => item.id === record.scheduleId)
    if (!student || !schedule) return null
    return <tr key={record.id}><td><div className="student-cell"><Avatar initials={student.initials} color={student.color} small /><span><strong>{student.name}</strong><small>{student.nim}</small></span></div></td><td><span className="course-cell"><strong>{schedule.course}</strong><small>{schedule.code} · {schedule.room}</small></span></td><td><span className="time-cell">{record.time}<small>{compact ? 'Hari ini' : formatShortDate(record.date)}</small></span></td><td><Badge tone={record.status === 'Hadir' ? 'green' : record.status === 'Terlambat' ? 'amber' : 'red'}>{record.status}</Badge></td></tr>
  }) : <tr><td colSpan={4} className="empty-table">Belum ada data kehadiran.</td></tr>}</tbody></table></div>
}

function LecturerPage({ records, search }: { records: AttendanceRecord[]; search: string }) {
  const [selectedClass, setSelectedClass] = useState('si-301')
  const [filter, setFilter] = useState('Semua status')
  const selectedSchedule = schedules.find((schedule) => schedule.id === selectedClass)!
  const visibleRecords = useMemo(() => records.filter((record) => {
    const student = students.find((item) => item.id === record.studentId)
    const matchesSearch = !search || `${student?.name} ${student?.nim}`.toLowerCase().includes(search.toLowerCase())
    return record.scheduleId === selectedClass && matchesSearch && (filter === 'Semua status' || record.status === filter)
  }), [records, selectedClass, filter, search])
  const present = records.filter((record) => record.scheduleId === selectedClass && record.status === 'Hadir').length
  const late = records.filter((record) => record.scheduleId === selectedClass && record.status === 'Terlambat').length
  return <>
    <PageHeading eyebrow="RUANG KERJA DOSEN" title="Dashboard dosen" description="Pantau kehadiran kelas dan temukan insight akademik secara real-time." actions={<button className="button button-outline"><Download size={16} /> Unduh laporan</button>} />
    <div className="class-banner"><div className="class-banner-icon"><BookOpen size={21} /></div><div><span>KELAS YANG DIPANTAU</span><strong>{selectedSchedule.course}</strong><small>{selectedSchedule.code} · {selectedSchedule.room} · {selectedSchedule.lecturer}</small></div><select value={selectedClass} onChange={(event) => setSelectedClass(event.target.value)} aria-label="Pilih kelas">{schedules.map((schedule) => <option value={schedule.id} key={schedule.id}>{schedule.course}</option>)}</select></div>
    <div className="stats-grid lecturer-stats"><StatCard icon={<Users size={18} />} label="Mahasiswa terdaftar" value={String(selectedSchedule.enrolled)} meta="Kelas reguler" trend="neutral" accent="blue" /><StatCard icon={<CheckCircle2 size={18} />} label="Hadir" value={String(present)} meta="Tercatat di kelas ini" trend="up" accent="green" /><StatCard icon={<Clock3 size={18} />} label="Terlambat" value={String(late)} meta="Perlu diperhatikan" trend="down" accent="amber" /><StatCard icon={<Activity size={18} />} label="Rata-rata hadir" value={`${Math.round(((present + late) / selectedSchedule.enrolled) * 100)}%`} meta="Dari jumlah mahasiswa" trend="up" accent="violet" /></div>
    <section className="panel lecturer-table-panel"><div className="panel-heading"><div><h3>Rekapitulasi kehadiran</h3><p>Catatan tap KTM mahasiswa untuk kelas ini</p></div><div className="table-controls"><button className="select-button"><CalendarDays size={14} /> Periode ini <ChevronDown size={14} /></button><select className="filter-select" value={filter} onChange={(event) => setFilter(event.target.value)}><option>Semua status</option><option>Hadir</option><option>Terlambat</option></select><button className="icon-button small-icon" aria-label="Filter"><SlidersHorizontal size={16} /></button></div></div><AttendanceTable records={visibleRecords} /></section>
    <div className="insight-strip"><span><Sparkles size={17} /></span><div><strong>Insight untuk kelas ini</strong><p>Mahasiswa yang terlambat 3 kali atau lebih berisiko mengalami penurunan kehadiran. Gunakan filter status untuk meninjau catatan lebih lanjut.</p></div><ArrowRight size={17} /></div>
  </>
}

function StudentPage({ records }: { records: AttendanceRecord[] }) {
  const selectedStudent = students[0]
  const myRecords = records.filter((record) => record.studentId === selectedStudent.id)
  const attendanceRate = 87
  const threshold = 75
  const aboveThreshold = attendanceRate >= threshold
  return <>
    <PageHeading eyebrow="PORTAL MAHASISWA" title="Halo, Nadia! 👋" description="Pantau kehadiran dan pastikan kamu siap menghadapi Ujian Akhir Semester." actions={<button className="button button-outline"><Download size={16} /> Unduh riwayat</button>} />
    <section className="student-profile-card"><Avatar initials={selectedStudent.initials} color="violet" /><div className="student-profile-copy"><span>PROFIL MAHASISWA</span><h2>{selectedStudent.name}</h2><p>{selectedStudent.nim} <i /> {selectedStudent.program}</p></div><Badge tone="green"><ShieldCheck size={13} /> Aktif</Badge><button className="icon-button small-icon" aria-label="Pengaturan profil"><Settings2 size={17} /></button></section>
    <div className="student-overview">
      <div className="panel attendance-score"><div className="panel-heading"><div><h3>Persentase kehadiran</h3><p>Semester ganjil 2025/2026</p></div><button className="icon-button small-icon" aria-label="Info kehadiran"><CircleHelp size={16} /></button></div><div className="score-content"><div className="score-ring" style={{ '--score': `${attendanceRate}%` } as React.CSSProperties}><div><strong>{attendanceRate}%</strong><span>kehadiran</span></div></div><div className="score-details"><strong>{aboveThreshold ? 'Aman untuk UAS' : 'Perlu ditingkatkan'}</strong><p>{aboveThreshold ? 'Kehadiranmu sudah memenuhi batas minimum untuk mengikuti UAS.' : 'Kehadiranmu belum mencapai batas minimum UAS.'}</p><div className="threshold-row"><span>Batas minimum UAS</span><strong>{threshold}%</strong></div><div className="threshold-track"><span style={{ width: `${threshold}%` }} /></div><div className="score-foot"><CheckCircle2 size={15} /> Kamu <strong>{attendanceRate - threshold}%</strong> di atas batas minimum</div></div></div></div>
      <div className="panel course-summary"><div className="panel-heading"><div><h3>Ringkasan mata kuliah</h3><p>Kehadiran per mata kuliah</p></div><button className="text-button">Semester ini <ChevronDown size={14} /></button></div>{schedules.slice(0, 3).map((schedule, index) => <div className="course-progress" key={schedule.id}><div className="course-progress-copy"><span className={`course-dot dot-${index}`} /><strong>{schedule.course}</strong><span>{[92, 84, 76][index]}%</span></div><div className="progress-track"><span className={`progress-${index}`} style={{ width: `${[92, 84, 76][index]}%` }} /></div></div>)}</div>
    </div>
    <section className="panel student-history"><div className="panel-heading"><div><h3>Riwayat kehadiran</h3><p>Riwayat tap KTM seluruh mata kuliah</p></div><button className="select-button"><SlidersHorizontal size={14} /> Filter <ChevronDown size={14} /></button></div><AttendanceTable records={myRecords} /></section>
  </>
}

function AdminPage() {
  const totalStudents = students.length
  const [selectedTab, setSelectedTab] = useState('Mahasiswa')
  return <>
    <PageHeading eyebrow="ADMINISTRASI AKADEMIK" title="Akademik & laporan" description="Kelola data master dan pantau rekapitulasi kehadiran universitas." actions={<button className="button button-primary"><Download size={16} /> Ekspor laporan</button>} />
    <div className="stats-grid"><StatCard icon={<Users size={18} />} label="Total mahasiswa" value="1.284" meta="Di 6 program studi" trend="up" accent="blue" /><StatCard icon={<BookOpen size={18} />} label="Mata kuliah aktif" value="86" meta="Semester berjalan" trend="neutral" accent="violet" /><StatCard icon={<CalendarDays size={18} />} label="Jadwal kuliah" value="142" meta="Di 18 ruang kelas" trend="neutral" accent="green" /><StatCard icon={<Activity size={18} />} label="Kehadiran rata-rata" value="86%" meta="Rekapitulasi semester berjalan" trend="up" accent="amber" /></div>
    <section className="panel admin-panel"><div className="panel-heading"><div><h3>Data master</h3><p>Kelola data akademik universitas</p></div><button className="button button-primary button-small" onClick={() => window.alert(`Form tambah ${selectedTab.toLowerCase()} siap dihubungkan ke API.`)}>+ Tambah data</button></div><div className="tabs">{['Mahasiswa', 'Dosen', 'Jadwal kuliah', 'Ruangan'].map((tab) => <button className={selectedTab === tab ? 'selected' : ''} key={tab} onClick={() => setSelectedTab(tab)}>{tab}</button>)}</div><div className="table-wrap"><table className="attendance-table"><thead><tr><th>{selectedTab === 'Mahasiswa' ? 'MAHASISWA' : selectedTab.toUpperCase()}</th><th>IDENTITAS</th><th>PROGRAM / DETAIL</th><th>STATUS</th></tr></thead><tbody>{students.slice(0, 5).map((student, index) => <tr key={student.id}><td><div className="student-cell"><Avatar initials={student.initials} color={student.color} small /><span><strong>{selectedTab === 'Mahasiswa' ? student.name : selectedTab === 'Dosen' ? ['Dr. Maya Lestari', 'Andi Pratama', 'Budi Santoso'][index % 3] : selectedTab === 'Jadwal kuliah' ? schedules[index % schedules.length].course : `Ruang ${['A-302', 'B-201', 'C-105'][index % 3]}`}</strong><small>{selectedTab === 'Mahasiswa' ? 'Mahasiswa aktif' : 'Fakultas Teknologi Informasi'}</small></span></div></td><td>{selectedTab === 'Mahasiswa' ? student.nim : `AKD-${String(240 + index).padStart(4, '0')}`}</td><td>{selectedTab === 'Mahasiswa' ? student.program : schedules[index % schedules.length].code}</td><td><Badge tone="green">Aktif</Badge></td></tr>)}</tbody></table></div><div className="table-pagination"><span>Menampilkan 1–5 dari {totalStudents} data</span><div><button aria-label="Halaman sebelumnya"><ChevronLeft size={15} /></button><button className="current">1</button><button>2</button><button>3</button><button aria-label="Halaman berikutnya"><ChevronRight size={15} /></button></div></div></section>
    <section className="admin-bottom"><div className="panel report-card"><span className="report-icon"><FileText size={19} /></span><div><strong>Laporan kehadiran fakultas</strong><p>Rekap kehadiran seluruh program studi semester ini.</p><button className="panel-link">Buat laporan <ArrowRight size={15} /></button></div></div><div className="panel report-card"><span className="report-icon lavender"><Activity size={19} /></span><div><strong>Analisis kelayakan UAS</strong><p>Identifikasi mahasiswa di bawah ambang kehadiran.</p><button className="panel-link">Lihat analisis <ArrowRight size={15} /></button></div></div></section>
  </>
}

function SimulatorPage({ onTap }: { onTap: (nim: string, room: string, timestamp: string) => ReturnType<typeof validateTap> }) {
  const [nim, setNim] = useState('2023101001')
  const [room, setRoom] = useState('A-302')
  const nextDemoDate = new Date(`${demoClassDate}T12:00:00`)
  nextDemoDate.setDate(nextDemoDate.getDate() + 7)
  const nextDemoDateValue = `${nextDemoDate.getFullYear()}-${String(nextDemoDate.getMonth() + 1).padStart(2, '0')}-${String(nextDemoDate.getDate()).padStart(2, '0')}`
  const [timestamp, setTimestamp] = useState(`${nextDemoDateValue}T08:10`)
  const [result, setResult] = useState<ReturnType<typeof validateTap> | null>(null)
  const [tapCount, setTapCount] = useState(0)
  const runTap = (event: React.FormEvent) => {
    event.preventDefault()
    const nextResult = onTap(nim, room, timestamp)
    setResult(nextResult)
    setTapCount((count) => count + 1)
  }
  return <>
    <PageHeading eyebrow="HARDWARE SIMULATOR" title="Simulasi tap KTM" description="Uji alur pembacaan kartu dan validasi jadwal tanpa perangkat fisik." actions={<Badge tone="green"><span className="status-pulse" /> Reader terhubung</Badge>} />
    <div className="simulator-layout">
      <section className="panel simulator-panel"><div className="simulator-top"><div className="reader-icon"><Fingerprint size={25} /></div><div><h3>RFID / NFC Reader</h3><p>Simulasikan pembacaan kartu mahasiswa</p></div><span className="device-status"><i /> ONLINE</span></div>
        <form className="sim-form" onSubmit={runTap}><label>Nomor ID KTM <span>*</span><div className="input-with-icon"><Fingerprint size={17} /><input value={nim} onChange={(event) => setNim(event.target.value)} placeholder="Contoh: 2023101001" inputMode="numeric" required /></div><small>Gunakan NIM yang terdaftar di sistem.</small></label><label>Lokasi ruangan <span>*</span><div className="select-wrap"><select value={room} onChange={(event) => setRoom(event.target.value)}><option value="A-302">Gedung A · Ruang 302</option><option value="B-201">Gedung B · Ruang 201</option><option value="C-105">Gedung C · Ruang 105</option><option value="D-401">Gedung D · Ruang 401</option></select><ChevronDown size={16} /></div></label><label>Waktu tap <span>*</span><div className="input-with-icon"><CalendarDays size={17} /><input type="datetime-local" value={timestamp} onChange={(event) => setTimestamp(event.target.value)} required /></div></label><button className="button button-primary tap-submit" type="submit"><Fingerprint size={18} /> Simulasikan tap kartu</button></form>
        <div className="sim-hint"><CircleHelp size={15} /><span><strong>Tip:</strong> Untuk uji coba berhasil, gunakan KTM <button onClick={() => setNim('2023101001')}>2023101001</button> dan waktu sesuai jadwal kelas di ruang A-302.</span></div>
      </section>
      <div className="sim-side"><section className="panel result-panel"><div className="panel-heading"><div><h3>Hasil validasi</h3><p>Respons sistem terbaru</p></div><span className="result-live"><i /> LIVE</span></div>{result ? <div className={`result-state ${result.ok ? 'success' : 'failure'}`}><span className="result-state-icon">{result.ok ? <CheckCircle2 size={25} /> : <AlertTriangle size={25} />}</span><strong>{result.ok ? `Absensi ${result.status}` : 'Absensi ditolak'}</strong><p>{result.message}</p>{result.student && <div className="result-student"><Avatar initials={result.student.initials} color={result.student.color} small /><span><strong>{result.student.name}</strong><small>{result.student.nim}</small></span></div>}{result.schedule && <div className="result-schedule"><span>{result.schedule.course}</span><strong>{result.schedule.room} · {result.schedule.start}–{result.schedule.end}</strong></div>}</div> : <div className="result-empty"><span><Fingerprint size={26} /></span><strong>Menunggu kartu dibaca</strong><p>Isi data KTM di samping untuk memulai simulasi.</p></div>}<div className="result-footer"><span>SIMULASI HARI INI</span><strong>{tapCount} <small>percobaan</small></strong></div></section>
        <section className="panel rules-panel"><div className="panel-heading"><div><h3>Aturan validasi</h3><p>Logika pemeriksaan sistem</p></div><ShieldCheck size={18} className="rules-shield" /></div><div className="rule-list"><div><span className="rule-check"><Check size={12} /></span><span>KTM terdaftar di database akademik</span></div><div><span className="rule-check"><Check size={12} /></span><span>Jadwal aktif sesuai hari dan ruangan</span></div><div><span className="rule-check"><Check size={12} /></span><span>Tap dilakukan dalam rentang waktu kelas</span></div><div><span className="rule-check"><Check size={12} /></span><span>Belum ada absensi untuk sesi yang sama</span></div></div></section></div>
    </div>
  </>
}

export default App
