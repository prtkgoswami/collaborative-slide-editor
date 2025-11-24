# Collaborative Slide Editor (Real-time)

> A real-time collaborative slide editor demonstrating scalable frontend architecture, collaboration systems, and strong product judgment.

---

## 📌 Overview

This project is a collaborative slide editor that allows multiple users to create, edit, and manipulate slide content in real-time. The primary goal of this implementation is to demonstrate strong product judgment, architectural clarity, and collaboration fundamentals within a tight scope.

The editor supports live multi-user interaction, role-based permissions, per-user undo/redo history, and widget-based slide editing — designed to feel like a realistic MVP of a collaborative design tool.

📷 **Screenshot / Demo GIF Placeholder**

> *Add editor UI screenshot or animated demo here*

---

## 🔗 Live Demo

> **Live URL:** https://collaborative-slide-editor.vercel.app/

---

## 🎥 Walkthrough Video

> **implementation walkthrough:** https://www.youtube.com/watch?v=ykIrmiJxMKs

This video covers:

* Feature demo
* Architectural decisions
* Tradeoffs made
* Edge cases
* AI tool usage

---

## 🧩 Key Features

### 🖊️ Slide Editing

* Multi-slide deck creation
* Add / delete slides (owner only)
* Text widgets with:

  * Drag and move
  * Inline editing
  * Resizable via textarea
  * Selection and focus state

### 🤝 Real-time Collaboration

* Multiple users editing simultaneously
* Live presence indicators
* Real-time cursor positions
* Sync powered by Liveblocks shared storage (CRDT-based)

### 🧠 Role & Permission System

* First user becomes **Owner**
* All others become **Editors**
* Owner can:

  * Add/delete slides
  * Invite collaborators
* Editors can:

  * Add/delete/edit widgets (within permitted slides)
* Read-only access enforced for slides outside user permissions

### 🔄 Undo / Redo (Per User)

* Per-user undo and redo history
* Logical grouping:

  * Dragging = 1 undo step
  * Typing session = 1 undo step
* Keyboard support:

  * Ctrl/Cmd + Z → Undo
  * Ctrl/Cmd + Shift + Z → Redo

---

## 🏗️ Architectural Overview

### 🗺️ System & Flow Diagram (tldraw)

> **Interactive Architecture Diagram:** https://www.tldraw.com/f/Rb5p4Fli9Rc8_NzW8SGxL?d=v-2401.-1007.8972.4326.X-8h4_E6eQX0N1c2yMPeP
>
> This diagram covers:
>
> * Component hierarchy
> * Data flow between UI, Liveblocks Storage, and Presence
> * Role & permission boundaries
> * Undo/Redo lifecycle

### High-Level Structure

```
App
 ├── LiveblocksProvider
 │   └── RoomProvider
 │       └── CollabEditor
 │           ├── SlideList
 │           ├── SlideCanvas
 │           └── Widgets
 └── History System (useEditorHistory)
```

### Shared State (Liveblocks Storage)

```ts
{
  ownerId: string | null,
  slides: [
    {
      id: string,
      widgets: {
        id: string;
        x: number;
        y: number;
        width: number;
        height: number;
        text: string;
      }[]
    }
  ]
}
```

### Presence State

```ts
{
  name: string,
  color: string,
  role: "owner" | "editor",
  permissibleSlides: "all" | string[],
  cursor: { x: number; y: number } | null,
  activeSlideId: string | null
}
```

---

## 🔧 Tech Stack

| Layer         | Technology                                |
| ------------- | ----------------------------------------- |
| UI            | React + TypeScript + ShadCN + Toastify    |
| Styling       | Tailwind CSS                              |
| Collaboration | Liveblocks (CRDT-based)                   |
| Routing       | React Router                              |
| Build Tool    | Vite                                      |
| Deployment    | Vercel                                    |

---

## ⚙️ Implementation Highlights

### ✅ Why Liveblocks Storage over raw Yjs

Liveblocks abstracts CRDT complexities while still providing real-time collaboration, making it ideal for a scoped MVP without sacrificing correctness or scalability.

### ✅ History Encapsulation

Undo/Redo logic is encapsulated in a reusable hook:

```
useEditorHistory()
```

This manages:

* Keyboard shortcuts
* History grouping
* Max history size
* Logical batching of operations

---

## 🧪 Known Edge Cases & Tradeoffs

### 1. Cross-user Undo Edge Case

If User A deletes a widget that User B previously edited, User B’s undo might resurrect the widget with partially reverted content. This is a known tradeoff of mutation-based CRDT history systems.

In a production-grade system, this would be handled via a domain-aware history system that ignores undo for non-existent targets.

### 2. Client-side Permissions

Role-based access control is currently enforced at the UI level for product realism. In a true production system, this would be validated server-side with signed invites and ACL enforcement.

---

## 📁 Folder Structure

```
src/
 ├── components/
 │   ├── Editor.tsx
 │   ├── Header.tsx
 │   ├── InviteDialog.tsx
 │   ├── SlideContainer.tsx
 │   ├── Slide.tsx
 │   ├── SlideWrapper.tsx
 │   ├── TextWidget.tsx
 │   └── ToolsTray.tsx
 ├── hooks/
 |   ├── usePermission.ts
 │   └── useEditorHistory.ts
 ├── pages/
 │   ├── Welcome.tsx
 │   ├── CollabEditor.tsx
 |   └── PageNotFound.tsx
 ├── context/
 │   └── ConnectionContext.tsx
 ├── liveblocks.config.ts
 ├── styles/
 └── main.tsx
```

---

## 🚀 Setup Instructions

```bash
git clone [https://github.com/prtkgoswami/collaborative-slide-editor.git]
cd project
npm install
```

Create a `.env` file:

```
VITE_LIVEBLOCKS_PUBLIC_KEY=<your_public_key>
```

Run locally:

```bash
npm run dev
```

---

## ✅ Future Improvements

* Fine-grained permissions per widget
* Persisted accounts & authenticated roles
* Collaborative rich text editing
* Widget resizing handles
* Snap-to-grid + alignment tools
* Commenting system

---

## 🤖 AI Usage Disclosure

AI tools were used to:

* Review and validate architectural decisions
* Speed up refactoring
* Sanity-check edge case behavior

All logic and final decisions were manually reviewed and implemented.

---

## 🙌 Final Note

This project intentionally balances product realism, architectural elegance, and scope control to demonstrate my approach to building collaborative systems under realistic constraints. It reflects strong UX thinking, technical depth, and a production mindset.

