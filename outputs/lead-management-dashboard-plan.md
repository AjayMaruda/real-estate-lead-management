# Lead Management Dashboard - Fastest Build Plan

## Goal
Build a clean, demo-ready Lead Management Dashboard today with:
- Add Lead
- View Leads
- Search Leads
- Filter Leads
- Update Lead Status
- Metrics dashboard
- One high-value product-thinking feature: Lead Priority Scoring Engine

## Recommended Stack
- Frontend: React + Vite + TypeScript
- UI: shadcn/ui + Tailwind CSS
- Backend: Node.js + Express + TypeScript
- Database: MongoDB + Mongoose
- State/Data Fetching: React Query
- Forms: React Hook Form + Zod
- Charts: Recharts

## Why this stack
- Fast to build
- Easy to demo
- Simple mental model
- Good UI with minimal code
- MongoDB fits lead records naturally

---

## 1) Exact Implementation Order

### Step 1. Scaffold the app
- Create a Vite React TypeScript app
- Install shadcn/ui
- Add Tailwind
- Add React Query, React Hook Form, Zod, Recharts, Axios
- Create a simple folder structure:

```txt
src/
  components/
    ui/
    leads/
    dashboard/
  pages/
  lib/
  api/
  types/
```

### Step 2. Define the data model first
Create the MongoDB Lead schema before building UI so every component uses the same shape.

### Step 3. Build backend REST APIs
Implement CRUD-lite endpoints for leads plus metrics and priority scoring.

### Step 4. Seed mock data
Add 20-30 realistic leads so the dashboard looks alive from the first run.

### Step 5. Build the dashboard shell
Create top nav, KPI cards, charts, and the lead table layout.

### Step 6. Build the lead form
Add modal/drawer form for creating leads and updating status.

### Step 7. Build list search/filter interactions
- Search by name, phone, company, source
- Filter by status and source

### Step 8. Add scoring display
Show a score badge and priority label in the table.

### Step 9. Add the metrics section
Render:
- Total Leads
- Leads by Status
- Leads by Source
- Conversion Rate

### Step 10. Polish for demo
- Empty states
- Loading states
- Toasts
- Basic validation
- Sort by priority score

### Step 11. Write README and Loom script
- Explain how to run it
- Explain the story
- Explain the feature highlight

---

## 2) Fastest Possible Architecture

### Monolith
- One React app
- One Node/Express API
- One MongoDB database

### Request flow
UI -> React Query -> Express API -> MongoDB

### Key design choices
- No auth
- No roles
- No microservices
- No event queues
- No AI integration
- No complex caching

### Suggested folder layout

```txt
server/
  src/
    config/
    models/
    routes/
    controllers/
    services/
    seed/
    utils/

client/
  src/
    components/
    pages/
    hooks/
    lib/
    types/
```

---

## 3) Simplest MongoDB Schema

### Lead

```ts
type LeadStatus =
  | "New Lead"
  | "Contacted"
  | "Site Visit Scheduled"
  | "Negotiation"
  | "Closed Won"
  | "Closed Lost";

type LeadSource =
  | "Website"
  | "Referral"
  | "Walk-in"
  | "Facebook"
  | "Google Ads"
  | "Instagram"
  | "Other";

type Lead = {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  source: LeadSource;
  status: LeadStatus;
  budget?: number;
  notes?: string;
  priorityScore: number; // 0-100
  assignedTo?: string;
  nextFollowUpAt?: string;
  createdAt: string;
  updatedAt: string;
};
```

### Why this schema works
- Minimal fields
- Enough for a sales demo
- Good for search/filtering
- Supports scoring and metrics

---

## 4) REST APIs

### Leads

#### `GET /api/leads`
Query params:
- `q` search string
- `status`
- `source`
- `sortBy=priorityScore|createdAt`
- `order=asc|desc`
- `page`
- `limit`

Returns:
- paginated leads
- total count

#### `POST /api/leads`
Creates a lead.

Body:
```json
{
  "name": "Rahul Sharma",
  "phone": "+91 9876543210",
  "email": "rahul@example.com",
  "company": "Sharma Interiors",
  "source": "Website",
  "status": "New Lead",
  "budget": 250000,
  "notes": "Interested in 3BHK premium project"
}
```

#### `PATCH /api/leads/:id`
Updates any lead field, especially `status`.

#### `DELETE /api/leads/:id`
Optional. Include only if time permits.

### Metrics

#### `GET /api/metrics`
Returns:
- totalLeads
- leadsByStatus
- leadsBySource
- conversionRate
- avgPriorityScore
- overdueFollowUps

### Priority scoring

#### `POST /api/leads/:id/score`
Recomputes lead score.

#### `POST /api/leads/recalculate-scores`
Batch recalculates scores for all leads.

---

## 5) React Component Structure

### Pages
- `DashboardPage`
- `LeadsPage`

### Layout Components
- `AppShell`
- `Sidebar`
- `Topbar`
- `PageHeader`

### Dashboard Components
- `KpiCard`
- `StatusBreakdownChart`
- `SourceBreakdownChart`
- `ConversionCard`
- `PriorityLeadsList`

### Leads Components
- `LeadTable`
- `LeadRowActions`
- `LeadFormDialog`
- `LeadFilters`
- `LeadSearchBar`
- `LeadStatusBadge`
- `PriorityBadge`

### Shared Components
- `EmptyState`
- `LoadingSkeleton`
- `ConfirmDialog`
- `ToastProvider`

### Suggested component tree

```txt
App
  AppShell
    Topbar
    Sidebar
    Routes
      DashboardPage
        KpiCards
        Charts
        PriorityLeadsList
      LeadsPage
        LeadSearchBar
        LeadFilters
        LeadTable
        LeadFormDialog
```

---

## 6) shadcn UI Layout

### Use these shadcn components
- `Card`
- `Badge`
- `Button`
- `Input`
- `Select`
- `Dialog`
- `Sheet`
- `Table`
- `Tabs`
- `DropdownMenu`
- `Popover`
- `Calendar`
- `Separator`
- `ScrollArea`
- `Toast`

### Page layout

#### Top section
- Title: `Lead Management Dashboard`
- Subtitle: `Track, prioritize, and convert leads faster`
- Primary CTA: `Add Lead`
- Secondary CTA: `Recalculate Scores`

#### KPI row
4 cards:
- Total Leads
- Contacted Leads
- Closed Won
- Conversion Rate

#### Middle section
Left:
- Leads by Status chart
Right:
- Leads by Source chart

#### Bottom section
- Table with all leads
- Search bar above
- Filter controls above
- Score badge column
- Status action dropdown

### Visual style
- Clean white canvas
- Light gray background
- Blue primary accent
- Green success
- Amber warning
- Red lost state
- Rounded cards
- Strong spacing

---

## 7) Sample Mock Data

Use this to seed the app:

```json
[
  {
    "name": "Rahul Sharma",
    "phone": "+91 9876543210",
    "email": "rahul@example.com",
    "company": "Sharma Interiors",
    "source": "Website",
    "status": "New Lead",
    "budget": 250000,
    "notes": "Interested in premium apartment interiors",
    "priorityScore": 86
  },
  {
    "name": "Priya Nair",
    "phone": "+91 9811122233",
    "email": "priya@example.com",
    "company": "Nair Builders",
    "source": "Referral",
    "status": "Contacted",
    "budget": 800000,
    "notes": "Referred by existing client",
    "priorityScore": 92
  },
  {
    "name": "Aman Verma",
    "phone": "+91 9000012345",
    "email": "aman@example.com",
    "company": "Verma Holdings",
    "source": "Google Ads",
    "status": "Site Visit Scheduled",
    "budget": 1200000,
    "notes": "High intent commercial lead",
    "priorityScore": 78
  },
  {
    "name": "Sneha Iyer",
    "phone": "+91 9888877777",
    "email": "sneha@example.com",
    "company": "Iyer Associates",
    "source": "Facebook",
    "status": "Negotiation",
    "budget": 500000,
    "notes": "Requested pricing comparison",
    "priorityScore": 74
  },
  {
    "name": "Karan Mehta",
    "phone": "+91 9777766666",
    "email": "karan@example.com",
    "company": "Mehta Ventures",
    "source": "Walk-in",
    "status": "Closed Won",
    "budget": 300000,
    "notes": "Converted after site visit",
    "priorityScore": 95
  }
]
```

Add 15-20 more similar records by varying:
- source
- status
- budget
- priorityScore
- dates

---

## 8) Lead Priority Scoring Engine

### Business goal
Help sales reps focus on leads most likely to convert.

### Scoring factors
- Source quality
- Budget size
- Engagement stage
- Follow-up urgency
- Recency of activity
- Status progression

### Simple scoring formula

```ts
function scoreLead(lead) {
  let score = 0;

  const sourcePoints = {
    Referral: 25,
    Website: 20,
    Google Ads: 18,
    Walk-in: 22,
    Facebook: 10,
    Instagram: 8,
    Other: 5
  };

  const statusPoints = {
    "New Lead": 5,
    Contacted: 12,
    "Site Visit Scheduled": 20,
    Negotiation: 28,
    "Closed Won": 40,
    "Closed Lost": 0
  };

  score += sourcePoints[lead.source] ?? 5;
  score += statusPoints[lead.status] ?? 5;

  if (lead.budget >= 1000000) score += 20;
  else if (lead.budget >= 500000) score += 15;
  else if (lead.budget >= 200000) score += 10;
  else score += 5;

  if (lead.nextFollowUpAt) score += 10;
  if (lead.notes?.length > 20) score += 5;
  if (lead.status === "Closed Won") score = 100;
  if (lead.status === "Closed Lost") score = 0;

  return Math.min(100, score);
}
```

### Priority bands
- `80-100`: Hot
- `60-79`: Warm
- `30-59`: Medium
- `0-29`: Low

### Why this feature is strong
- Easy to explain in a demo
- Looks product-minded
- Gives immediate business value
- Can be built in under 1 hour

---

## 9) Dashboard Metrics Formulas

### Total Leads
```ts
totalLeads = leads.length
```

### Leads by Status
```ts
leadsByStatus[status] = count of leads where lead.status === status
```

### Leads by Source
```ts
leadsBySource[source] = count of leads where lead.source === source
```

### Conversion Rate
Keep this simple and business-friendly:

```ts
conversionRate = (closedWon / totalLeads) * 100
```

Where:
- `closedWon = number of leads with status === "Closed Won"`

### Optional helpful metrics
- `qualifiedLeads = Contacted + Site Visit Scheduled + Negotiation + Closed Won`
- `activePipeline = totalLeads - Closed Lost`
- `avgPriorityScore = average(priorityScore)`
- `followUpsDueToday = leads where nextFollowUpAt is today`

---

## 10) Product Thinking Section

### 5 feature ideas
1. Lead Priority Scoring Engine
2. Follow-up reminder system
3. Lead owner assignment
4. Pipeline stage analytics
5. Duplicate lead detection

### Best feature to build today
Lead Priority Scoring Engine

### Why this one wins
- Strong business value
- Simple implementation
- Easy to demo visually
- Improves rep efficiency
- Connects directly to the dashboard

### How to present it
Say:
“We added a lightweight scoring engine that ranks leads based on source, budget, and stage so sales teams can focus on the hottest opportunities first.”

---

## 11) README Content

```md
# Lead Management Dashboard

A simple lead management dashboard built with React, Express, and MongoDB.

## Features
- Add new leads
- View all leads
- Search leads
- Filter by status and source
- Update lead status
- View dashboard metrics
- Priority scoring engine

## Tech Stack
- React
- TypeScript
- shadcn/ui
- Express
- MongoDB
- Mongoose

## Getting Started
1. Install dependencies
2. Start MongoDB
3. Run backend server
4. Run frontend app

## Demo Highlights
- KPI cards for quick business insight
- Search and filters for usability
- Priority score badge for sales focus
- Clean UI with minimal setup

## Product Thinking
Priority scoring helps reps focus on the leads most likely to convert, improving speed and pipeline visibility.
```

---

## 12) Loom Walkthrough Script

### 2-3 minute script

#### Intro
“Hi, this is my Lead Management Dashboard. I built it to help sales teams track leads, prioritize follow-ups, and monitor conversion performance in one place.”

#### Problem
“Sales teams usually lose time switching between spreadsheets and scattered notes, so this dashboard centralizes lead tracking and makes the pipeline easier to manage.”

#### Walkthrough
“At the top, you can see total leads, leads by status, leads by source, and conversion rate. These give an instant snapshot of sales performance.”

“In the table, I can search leads by name, company, phone, or source, and filter by status or source.”

“I can also update a lead’s status directly from the table, which keeps the pipeline current with minimal friction.”

#### Feature highlight
“The feature I’m most proud of is the Lead Priority Scoring Engine. It assigns a score based on source, budget, and pipeline stage, so sales reps can focus on the hottest leads first.”

#### Close
“Overall, this is a lightweight but practical system that is fast to use, easy to demo, and built around real business value.”

---

## 13) Demo Checklist
- App loads with seeded data
- KPI cards show believable numbers
- Search works instantly
- Filters work independently
- Status updates persist
- Score badge is visible
- Conversion rate updates correctly
- UI looks polished on laptop screen

---

## 14) If Time Is Tight, Cut These First
- Delete button
- Sort controls beyond priority score
- Detailed analytics drilldowns
- Export to CSV
- Comments/activity timeline
- Multi-step lead form

---

## 15) Final Recommendation
Build the following in order:
1. Mongo schema
2. Seed data
3. Lead CRUD API
4. Metrics API
5. Priority scoring utility
6. Dashboard shell
7. Lead table
8. Search/filter
9. Add/edit status dialog
10. Charts and KPI cards
11. README
12. Loom script

