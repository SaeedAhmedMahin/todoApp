````python?code_reference&code_event_index=2

content = """# My Daily Flow - Smart To-Do List

A sleek, dark-themed productivity application designed to organize tasks into Morning, Afternoon, and Evening slots. Built with Next.js and Supabase, it features seamless cross-category drag-and-drop functionality and an automated data cleanup system.

## Features

- **Categorized Workflow**: Organize your day into Morning, Afternoon, and Evening sections.
- **Fluid Drag and Drop**: Move tasks freely within a category or drag them between different times of day using `@hello-pangea/dnd`.
- **Smart Fractional Indexing**: Uses a custom `float8` positioning system to ensure reordering is instantaneous and efficient without heavy database re-indexing.
- **Automated Cleanup**: A backend `pg_cron` job automatically deletes completed tasks older than **12 hours** to keep your workspace clutter-free.
- **Secure Authentication**: Complete user auth flow using Supabase SSR and Next.js Middleware to protect your data and bounce unauthenticated users.
- **Optimistic UI Updates**: The UI updates instantly when you add, toggle, delete, or move tasks, making the app feel lightning-fast.

## Technologies Used

- **Framework**: [Next.js 16.2.4](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Drag & Drop**: [@hello-pangea/dnd](https://github.com/hello-pangea/dnd)

## Required Dependencies

To run this project, you will need to install the following core packages:

```bash
# Core features & auth
npm install @supabase/supabase-js @supabase/ssr @hello-pangea/dnd

# Type definitions (for dev)
npm install -D @types/node @types/react @types/react-dom
````

## Database Schema

The application relies on a `todos` table in Supabase with the following structure:

  - `id`: `int8` (Primary Key)
  - `description`: `text` (The task content)
  - `completed`: `boolean` (Default: false)
  - `when`: `int2` (0: Morning, 1: Afternoon, 2: Evening)
  - `position`: `float8` (Used for calculating drag-and-drop placement)
  - `user_id`: `uuid` (References `auth.users`, protected by RLS)
  - `created_at`: `timestamptz` (Default: `now()`)

### 12-Hour Cleanup Cron Job

To enable the 12-hour auto-delete feature, the following SQL must be run in the Supabase SQL Editor (requires `pg_cron` extension):

```sql
select cron.schedule(
  'auto-delete-completed-todos',
  '0 * * * *', 
  $$
  DELETE FROM public.todos
  WHERE completed = true
  AND created_at < now() - interval '12 hours'
  $$
);
```

## Setup & Installation

1.  **Clone the repository**:
    ```bash
    git clone [https://github.com/yourusername/todoApp.git](https://github.com/yourusername/todoApp.git)
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Environment Variables**:
    Create a `.env.local` file in the root directory with your Supabase credentials:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
    ```
4.  **Run the development server**:
    ```bash
    npm run dev
    ```
5.  **Access the app**: Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) in your browser.

-----

