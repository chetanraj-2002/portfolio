-- Remove payment_transactions table and all related policies

-- Drop RLS policies first
DROP POLICY IF EXISTS "Admins can view all transactions" ON public.payment_transactions;
DROP POLICY IF EXISTS "Admins can insert transactions" ON public.payment_transactions;
DROP POLICY IF EXISTS "Admins can update transactions" ON public.payment_transactions;

-- Drop the payment_transactions table
DROP TABLE IF EXISTS public.payment_transactions;