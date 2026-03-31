-- =========================
-- CREAR TABLAS
-- =========================

CREATE TABLE public.company (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);

CREATE TABLE public."operationalAreas" (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    password TEXT NOT NULL,
    "companyId" INTEGER NOT NULL,
    CONSTRAINT fk_company
        FOREIGN KEY ("companyId")
        REFERENCES public.company(id)
        ON DELETE CASCADE
);

-- Evitar áreas duplicadas dentro de la misma empresa
ALTER TABLE public."operationalAreas"
ADD CONSTRAINT unique_area_per_company UNIQUE (name, "companyId");

-- =========================
-- INSERTS DE PRUEBA
-- =========================

-- Empresa (password ya hasheado de ejemplo)
INSERT INTO public.company (name, password)
VALUES 
('empresa1', '$2b$10$EjemploHashEmpresa1'),
('empresa2', '$2b$10$EjemploHashEmpresa2');

-- Áreas (asociadas a companyId)
INSERT INTO public."operationalAreas" (name, password, "companyId")
VALUES 
('area1', '$2b$10$EjemploHashArea1', 1),
('area2', '$2b$10$EjemploHashArea2', 1),
('area3', '$2b$10$EjemploHashArea3', 2);