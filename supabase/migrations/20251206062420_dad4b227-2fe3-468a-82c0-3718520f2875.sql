-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  avatar_url TEXT,
  notifications_enabled BOOLEAN DEFAULT true,
  time_format TEXT DEFAULT '12h',
  language TEXT DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Create medications table
CREATE TABLE public.medications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  frequency TEXT NOT NULL DEFAULT 'once',
  instructions TEXT,
  color TEXT DEFAULT '#0D9488',
  icon_name TEXT DEFAULT 'pill',
  stock INTEGER DEFAULT 30,
  refill_reminder BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on medications
ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;

-- Medications policies
CREATE POLICY "Users can view their own medications" 
  ON public.medications FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own medications" 
  ON public.medications FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own medications" 
  ON public.medications FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own medications" 
  ON public.medications FOR DELETE 
  USING (auth.uid() = user_id);

-- Create medication_doses table for scheduled doses
CREATE TABLE public.medication_doses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  medication_id UUID NOT NULL REFERENCES public.medications(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scheduled_time TIME NOT NULL,
  status TEXT DEFAULT 'upcoming',
  taken_at TIMESTAMP WITH TIME ZONE,
  dose_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on medication_doses
ALTER TABLE public.medication_doses ENABLE ROW LEVEL SECURITY;

-- Medication doses policies
CREATE POLICY "Users can view their own doses" 
  ON public.medication_doses FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own doses" 
  ON public.medication_doses FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own doses" 
  ON public.medication_doses FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own doses" 
  ON public.medication_doses FOR DELETE 
  USING (auth.uid() = user_id);

-- Create adherence_logs table for tracking history
CREATE TABLE public.adherence_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  medication_id UUID NOT NULL REFERENCES public.medications(id) ON DELETE CASCADE,
  dose_id UUID REFERENCES public.medication_doses(id) ON DELETE SET NULL,
  action TEXT NOT NULL, -- 'taken' or 'missed'
  logged_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on adherence_logs
ALTER TABLE public.adherence_logs ENABLE ROW LEVEL SECURITY;

-- Adherence logs policies
CREATE POLICY "Users can view their own adherence logs" 
  ON public.adherence_logs FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own adherence logs" 
  ON public.adherence_logs FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
    NEW.email
  );
  RETURN NEW;
END;
$$;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_medications_updated_at
  BEFORE UPDATE ON public.medications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for medications and doses
ALTER PUBLICATION supabase_realtime ADD TABLE public.medications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.medication_doses;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;