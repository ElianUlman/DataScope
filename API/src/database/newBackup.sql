--
-- PostgreSQL database dump
--

\restrict 2PyHMNmb0we8M3dulblq0gdvpSlfPWg9LJecaRidks3JiMmrc8VB9dtB1fdfoSB

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

-- Started on 2026-04-09 17:07:19

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 857 (class 1247 OID 16438)
-- Name: tiers; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.tiers AS ENUM (
    'basic',
    'standard',
    'advanced'
);


ALTER TYPE public.tiers OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 16446)
-- Name: companies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.companies (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    creationdate timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tier public.tiers NOT NULL
);


ALTER TABLE public.companies OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16445)
-- Name: companies_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.companies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.companies_id_seq OWNER TO postgres;

--
-- TOC entry 5049 (class 0 OID 0)
-- Dependencies: 219
-- Name: companies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.companies_id_seq OWNED BY public.companies.id;


--
-- TOC entry 224 (class 1259 OID 16466)
-- Name: invites; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.invites (
    id integer NOT NULL,
    companyfk bigint NOT NULL,
    userfk bigint NOT NULL,
    isadmin bit(1) NOT NULL,
    creationdate timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    isvalid bit(1) NOT NULL
);


ALTER TABLE public.invites OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16465)
-- Name: invites_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.invites_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.invites_id_seq OWNER TO postgres;

--
-- TOC entry 5052 (class 0 OID 0)
-- Dependencies: 223
-- Name: invites_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.invites_id_seq OWNED BY public.invites.id;


--
-- TOC entry 222 (class 1259 OID 16455)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(100) NOT NULL,
    creationdate timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16454)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 5055 (class 0 OID 0)
-- Dependencies: 221
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4871 (class 2604 OID 16449)
-- Name: companies id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies ALTER COLUMN id SET DEFAULT nextval('public.companies_id_seq'::regclass);


--
-- TOC entry 4875 (class 2604 OID 16469)
-- Name: invites id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invites ALTER COLUMN id SET DEFAULT nextval('public.invites_id_seq'::regclass);


--
-- TOC entry 4873 (class 2604 OID 16458)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 5037 (class 0 OID 16446)
-- Dependencies: 220
-- Data for Name: companies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.companies (id, name, creationdate, tier) FROM stdin;
1	pepe SRL	2026-04-09 16:45:46.504893	basic
3	timba SA	2026-04-09 16:55:05.71627	advanced
5	comrades SC	2026-04-09 17:06:17.007416	basic
\.


--
-- TOC entry 5041 (class 0 OID 16466)
-- Dependencies: 224
-- Data for Name: invites; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.invites (id, companyfk, userfk, isadmin, creationdate, isvalid) FROM stdin;
1	1	1	1	2026-04-09 16:59:43.234684	1
2	3	3	1	2026-04-09 17:00:00.874314	1
3	5	5	1	2026-04-09 17:06:17.007416	1
\.


--
-- TOC entry 5039 (class 0 OID 16455)
-- Dependencies: 222
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, password, creationdate) FROM stdin;
1	MichaelScott	michaelscott@gmail.com	$2b$10$1.anQKx4HJWe0Q0J44aF2ueGYvCaL2nMHE/NxjqtdlAMXVW/X7aIO	2026-04-09 16:45:46.512418
3	DreadPirateRoberts	notyourbusiness@gmail.com	$2b$10$SR3FYq240EDvChktyfjB7.92hh.f2KWAPgeiv2QaWF1jc11tIqTKe	2026-04-09 16:55:05.721673
5	Vlad Ulianov	thepeoplesparty@gmail.com	$2b$10$Lpvd3zJiNolguhtzA/ErculadHrYDJExKa21HYFeCBGrQOXMNBY5.	2026-04-09 17:06:17.007416
\.


--
-- TOC entry 5057 (class 0 OID 0)
-- Dependencies: 219
-- Name: companies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.companies_id_seq', 5, true);


--
-- TOC entry 5058 (class 0 OID 0)
-- Dependencies: 223
-- Name: invites_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.invites_id_seq', 3, true);


--
-- TOC entry 5059 (class 0 OID 0)
-- Dependencies: 221
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 5, true);


--
-- TOC entry 4878 (class 2606 OID 16489)
-- Name: companies companies_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_name_key UNIQUE (name);


--
-- TOC entry 4880 (class 2606 OID 16453)
-- Name: companies companies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_pkey PRIMARY KEY (id);


--
-- TOC entry 4886 (class 2606 OID 16475)
-- Name: invites invites_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invites
    ADD CONSTRAINT invites_pkey PRIMARY KEY (id);


--
-- TOC entry 4882 (class 2606 OID 16464)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4884 (class 2606 OID 16462)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4887 (class 2606 OID 16478)
-- Name: invites invites_companyfk_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invites
    ADD CONSTRAINT invites_companyfk_fkey FOREIGN KEY (companyfk) REFERENCES public.companies(id) NOT VALID;


--
-- TOC entry 4888 (class 2606 OID 16483)
-- Name: invites invites_userfk_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invites
    ADD CONSTRAINT invites_userfk_fkey FOREIGN KEY (userfk) REFERENCES public.users(id) NOT VALID;


--
-- TOC entry 5047 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT USAGE ON SCHEMA public TO "dbToAPI_user";


--
-- TOC entry 5048 (class 0 OID 0)
-- Dependencies: 220
-- Name: TABLE companies; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.companies TO "dbToAPI_user";


--
-- TOC entry 5050 (class 0 OID 0)
-- Dependencies: 219
-- Name: SEQUENCE companies_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT USAGE ON SEQUENCE public.companies_id_seq TO "dbToAPI_user";


--
-- TOC entry 5051 (class 0 OID 0)
-- Dependencies: 224
-- Name: TABLE invites; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.invites TO "dbToAPI_user";


--
-- TOC entry 5053 (class 0 OID 0)
-- Dependencies: 223
-- Name: SEQUENCE invites_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT USAGE ON SEQUENCE public.invites_id_seq TO "dbToAPI_user";


--
-- TOC entry 5054 (class 0 OID 0)
-- Dependencies: 222
-- Name: TABLE users; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.users TO "dbToAPI_user";


--
-- TOC entry 5056 (class 0 OID 0)
-- Dependencies: 221
-- Name: SEQUENCE users_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT USAGE ON SEQUENCE public.users_id_seq TO "dbToAPI_user";


--
-- TOC entry 2066 (class 826 OID 16477)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT USAGE ON SEQUENCES TO "dbToAPI_user";


--
-- TOC entry 2065 (class 826 OID 16476)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT SELECT,INSERT,DELETE,UPDATE ON TABLES TO "dbToAPI_user";


-- Completed on 2026-04-09 17:07:19

--
-- PostgreSQL database dump complete
--

\unrestrict 2PyHMNmb0we8M3dulblq0gdvpSlfPWg9LJecaRidks3JiMmrc8VB9dtB1fdfoSB

