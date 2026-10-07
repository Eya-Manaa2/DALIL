import { integer, jsonb, pgTable, primaryKey, serial, text, timestamp } from 'drizzle-orm/pg-core'

export const rateLimits = pgTable(
  'rate_limits',
  {
    key: text('key').notNull(),
    windowStart: timestamp('window_start', { withTimezone: true }).notNull(),
    hits: integer('hits').notNull().default(1),
  },
  (t) => [primaryKey({ columns: [t.key, t.windowStart] })],
)

export const usageEvents = pgTable('usage_events', {
  id: serial('id').primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  source: text('source').notNull(),
  audience: text('audience'),
  needs: text('needs').array().notNull().default([]),
  governorate: text('governorate'),
  resultsCount: integer('results_count'),
})

export const fieldReports = pgTable('field_reports', {
  id: serial('id').primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  officeName: text('office_name').notNull(),
  governorate: text('governorate').notNull(),
  kind: text('kind').notNull(),
  details: text('details'),
  status: text('status').notNull().default('new'),
})

export const applications = pgTable('applications', {
  id: serial('id').primaryKey(),
  trackingCode: text('tracking_code').unique().notNull(),
  userData: jsonb('user_data').notNull(),
  serviceId: text('service_id').notNull(),
  status: text('status').notNull().default('draft'),
  steps: jsonb('steps').notNull().default('[]'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})
