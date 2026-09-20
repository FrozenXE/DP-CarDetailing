-- Run this in the Supabase SQL Editor after confirming that one studio bay
-- should accept only one active booking per date and arrival-time slot.
--
-- The React app also checks availability before inserting a booking. This
-- index protects against two simultaneous booking requests.

create unique index if not exists bookings_one_active_slot
  on public.bookings (appointment_date, arrival_time_slot)
  where status in ('pending', 'active', 'curing');
