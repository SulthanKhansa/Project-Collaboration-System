# Project Collaboration System — Backend

Backend untuk aplikasi kolaborasi proyek. Dibangun dengan **NestJS + TypeORM + PostgreSQL**, mencakup pengelolaan proyek, anggota, tugas, komentar, dan metadata file.

## Fitur

- CRUD proyek.
- CRUD anggota.
- Menambahkan anggota ke proyek, menampilkan daftar anggota proyek, mengubah role, dan mengeluarkan anggota.
- CRUD tugas dalam proyek (termasuk filter berdasarkan status dan assignee).
- CRUD komentar pada tugas.
- CRUD metadata file proyek (tanpa upload file fisik/cloud).

## Relasi

| Relasi | Tipe | Implementasi |
|---|---|---|
| Project ↔ Member | Many-to-many | Tabel pivot `project_members` |
| Project → Task | One-to-many | `tasks.project_id` |
| Task → Comment | One-to-many | `comments.task_id` |
| Project → File | One-to-many | `files.project_id` |

## Teknologi

- Node.js 24+
- NestJS 12 (ESM)
- TypeORM 1.x
- PostgreSQL 16 (Docker Compose)
- `class-validator` + `class-transformer`

## Prasyarat

- Node.js dan npm
- Docker Desktop (untuk PostgreSQL)

## Menjalankan

Dari root folder proyek:

```bash
docker compose up -d
```

Lalu jalankan API:

```bash
cd backend
npm install
npm run start:dev
```

API berjalan di **http://localhost:3001**.

Database PostgreSQL tersedia di `localhost:5434` dengan kredensial default:

```text
database: project_collab
username: project_collab
password: project_collab
```

> Port `5434` dan `3001` dipakai agar tidak bentrok dengan PostgreSQL/API lain yang mungkin sudah berjalan di port `5432`/`3000`. Ubah `docker-compose.yml` dan `backend/.env` jika ingin memakai port lain.

Konfigurasi aplikasi ada di `backend/.env`. Salin dari `backend/.env.example` bila file `.env` belum ada.

### Menghentikan

```bash
docker compose down
```

Untuk menghapus data database juga:

```bash
docker compose down -v
```

## Struktur singkat

```text
backend/src/
├─ common/enums/        # enum status, role, prioritas
├─ projects/            # proyek + keanggotaan proyek
├─ members/             # anggota
├─ tasks/               # tugas
├─ comments/            # komentar tugas
├─ files/               # metadata file
├─ app.module.ts
└─ main.ts
```

## Endpoint

Respons sukses memakai JSON. `POST` mengembalikan `201`, `GET`/`PATCH` mengembalikan `200`, dan `DELETE` mengembalikan `204`.

### Proyek

| Method | Endpoint | Keterangan |
|---|---|---|
| POST | `/projects` | Membuat proyek |
| GET | `/projects` | Daftar proyek |
| GET | `/projects/:id` | Detail proyek |
| PATCH | `/projects/:id` | Mengubah proyek |
| DELETE | `/projects/:id` | Menghapus proyek (cascade) |

Body `POST /projects`:

```json
{
  "name": "Website Redesign",
  "description": "Redesign company website",
  "status": "ACTIVE",
  "startDate": "2026-11-01",
  "endDate": "2026-12-31"
}
```

`status`: `ACTIVE` | `COMPLETED` | `ARCHIVED`. Tanggal memakai format `YYYY-MM-DD`.

### Anggota

| Method | Endpoint | Keterangan |
|---|---|---|
| POST | `/members` | Membuat anggota |
| GET | `/members` | Daftar anggota |
| GET | `/members/:id` | Detail anggota |
| PATCH | `/members/:id` | Mengubah anggota |
| DELETE | `/members/:id` | Menghapus anggota |

Body `POST /members`:

```json
{
  "name": "Budi Santoso",
  "email": "budi@example.com",
  "jobTitle": "Frontend Developer"
}
```

Email harus unik. Jika duplikat, API mengembalikan `409 Conflict`.

### Anggota proyek

| Method | Endpoint | Keterangan |
|---|---|---|
| POST | `/projects/:projectId/members` | Menambah anggota ke proyek |
| GET | `/projects/:projectId/members` | Daftar anggota proyek |
| PATCH | `/projects/:projectId/members/:memberId` | Mengubah role anggota |
| DELETE | `/projects/:projectId/members/:memberId` | Mengeluarkan anggota |

Body `POST /projects/:projectId/members`:

```json
{
  "memberId": "UUID_MEMBER",
  "role": "MEMBER"
}
```

`role`: `OWNER` | `MANAGER` | `MEMBER`. Satu anggota hanya boleh terdaftar sekali pada proyek yang sama (`409 Conflict`).

### Tugas

| Method | Endpoint | Keterangan |
|---|---|---|
| POST | `/projects/:projectId/tasks` | Membuat tugas |
| GET | `/projects/:projectId/tasks` | Daftar tugas proyek |
| GET | `/tasks/:id` | Detail tugas |
| PATCH | `/tasks/:id` | Mengubah tugas |
| DELETE | `/tasks/:id` | Menghapus tugas |

Body `POST /projects/:projectId/tasks`:

```json
{
  "title": "Implement login page",
  "description": "Create responsive login form",
  "assigneeId": "UUID_MEMBER",
  "status": "TODO",
  "priority": "HIGH",
  "dueDate": "2026-11-30"
}
```

- `status`: `TODO` | `IN_PROGRESS` | `DONE`
- `priority`: `LOW` | `MEDIUM` | `HIGH`
- Filter daftar tugas: `GET /projects/:projectId/tasks?status=TODO&assigneeId=UUID_MEMBER`
- Kirim `assigneeId: null` pada `PATCH` untuk melepas assignee.

### Komentar

| Method | Endpoint | Keterangan |
|---|---|---|
| POST | `/tasks/:taskId/comments` | Menambah komentar |
| GET | `/tasks/:taskId/comments` | Daftar komentar tugas |
| PATCH | `/comments/:id` | Mengubah komentar |
| DELETE | `/comments/:id` | Menghapus komentar |

Body `POST /tasks/:taskId/comments`:

```json
{
  "authorId": "UUID_MEMBER",
  "content": "Form sudah selesai, tinggal testing."
}
```

### Metadata file

| Method | Endpoint | Keterangan |
|---|---|---|
| POST | `/projects/:projectId/files` | Menyimpan metadata file |
| GET | `/projects/:projectId/files` | Daftar metadata file proyek |
| GET | `/files/:id` | Detail metadata file |
| PATCH | `/files/:id` | Mengubah metadata file |
| DELETE | `/files/:id` | Menghapus metadata file |

Body `POST /projects/:projectId/files`:

```json
{
  "originalName": "design-spec.pdf",
  "storageKey": "projects/website-redesign/design-spec.pdf",
  "mimeType": "application/pdf",
  "size": 1048576,
  "uploadedById": "UUID_MEMBER"
}
```

`storageKey` hanya penanda lokasi logis. Backend tidak menyimpan file fisik.

## Contoh alur lengkap

Contoh dengan `curl.exe` (Windows) atau `curl` (Linux/macOS). Ganti nilai UUID sesuai respons sebelumnya.

```bash
# 1. Buat anggota
curl -X POST http://localhost:3001/members \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Budi\",\"email\":\"budi@example.com\",\"jobTitle\":\"Developer\"}"

# 2. Buat proyek
curl -X POST http://localhost:3001/projects \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Website Redesign\",\"description\":\"Redesign website\"}"

# 3. Tambahkan anggota ke proyek
curl -X POST http://localhost:3001/projects/PROJECT_ID/members \
  -H "Content-Type: application/json" \
  -d "{\"memberId\":\"MEMBER_ID\",\"role\":\"MEMBER\"}"

# 4. Buat tugas
curl -X POST http://localhost:3001/projects/PROJECT_ID/tasks \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Implement login page\",\"assigneeId\":\"MEMBER_ID\",\"priority\":\"HIGH\"}"

# 5. Tambahkan komentar
curl -X POST http://localhost:3001/tasks/TASK_ID/comments \
  -H "Content-Type: application/json" \
  -d "{\"authorId\":\"MEMBER_ID\",\"content\":\"Sedang dikerjakan.\"}"

# 6. Simpan metadata file
curl -X POST http://localhost:3001/projects/PROJECT_ID/files \
  -H "Content-Type: application/json" \
  -d "{\"originalName\":\"spec.pdf\",\"storageKey\":\"files/spec.pdf\",\"mimeType\":\"application/pdf\",\"size\":1024,\"uploadedById\":\"MEMBER_ID\"}"
```

## Aturan validasi dan error

- Semua ID divalidasi sebagai UUID → `400 Bad Request` jika format salah.
- Properti body yang tidak dikenal ditolak → `400 Bad Request`.
- Resource tidak ditemukan → `404 Not Found`.
- Email anggota duplikat → `409 Conflict`.
- Anggota yang sama ditambahkan dua kali ke proyek → `409 Conflict`.
- `assigneeId`, `authorId`, `uploadedById`, dan `memberId` harus merujuk anggota yang ada.
- Menghapus proyek akan menghapus keanggotaan, tugas, komentar, dan metadata file terkait.
- Menghapus anggota akan menghapus keanggotaan proyeknya; tugas menjadi tanpa assignee; komentar dan metadata file tetap ada dengan relasi anggota `null`.

## Catatan

- `DB_SYNCHRONIZE=true` dipakai agar tabel dibuat otomatis saat aplikasi pertama kali berjalan. Untuk produksi, gunakan migration dan matikan `synchronize`.
- Autentikasi/JWT, upload file nyata, Swagger, dan automated test tidak termasuk dalam cakupan tugas ini.
