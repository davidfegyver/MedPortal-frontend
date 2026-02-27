
-- Add permissive public SELECT policies for anonymous access
CREATE POLICY "Public read patients" ON public.patients FOR SELECT USING (true);
CREATE POLICY "Public read medical_records" ON public.medical_records FOR SELECT USING (true);
CREATE POLICY "Public read patient_pdfs" ON public.patient_pdfs FOR SELECT USING (true);
