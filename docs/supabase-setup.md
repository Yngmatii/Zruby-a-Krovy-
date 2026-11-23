# Supabase pre kontaktný formulár

1. V Supabase vytvorte projekt a otvorte **SQL Editor**.
2. Spustite tento SQL skript. Tabuľka uchová meno, email, telefón, správu a čas prijatia.

```sql
create table public.spravy (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  meno text not null,
  email text not null,
  telefon text not null,
  sprava text not null
);

alter table public.spravy enable row level security;
grant select, insert on table public.spravy to anon, authenticated;

create policy "Anyone can read messages"
  on public.spravy for select
  to anon, authenticated
  using (true);

create policy "Anyone can add messages"
  on public.spravy for insert
  to anon, authenticated
  with check (true);
```

3. V nastaveniach projektu skopírujte **Project URL** a verejný **publishable** alebo **anon** kľúč.
4. V `kontakt.html` nahraďte `YOUR_PROJECT_ID` a `YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY` svojimi hodnotami. Kľúč `service_role` ani secret key do HTML nikdy nevkladajte.
5. Otvorte stránku cez lokálny webový server alebo nasadený web a odošlite skúšobnú správu.

**Upozornenie:** Tieto pravidlá sprístupnia všetky správy každému návštevníkovi a umožnia komukoľvek pridávať záznamy. Keďže tabuľka obsahuje email a telefón, vo verejnom zozname budú viditeľné aj tieto osobné údaje. Pre skutočný kontaktný formulár je bezpečnejšie verejné čítanie vypnúť a zoznam správ zobraziť iba prihlásenému správcovi.