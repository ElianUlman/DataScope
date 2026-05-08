--
-- PostgreSQL database dump
--

-- Dumped from database version 16.2
-- Dumped by pg_dump version 16.0

-- Started on 2026-05-08 08:54:28

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 869 (class 1247 OID 16487)
-- Name: category; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.category AS ENUM (
    'technical_programming_question',
    'creative_writing',
    'data_analysis',
    'translation',
    'general_question'
);


ALTER TYPE public.category OWNER TO postgres;

--
-- TOC entry 848 (class 1247 OID 16400)
-- Name: senders; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.senders AS ENUM (
    'user',
    'chatgpt',
    'claude',
    'gemini',
    'copilot',
    'other'
);


ALTER TYPE public.senders OWNER TO postgres;

--
-- TOC entry 851 (class 1247 OID 16414)
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
-- TOC entry 215 (class 1259 OID 16421)
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
-- TOC entry 216 (class 1259 OID 16425)
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
-- TOC entry 4848 (class 0 OID 0)
-- Dependencies: 216
-- Name: companies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.companies_id_seq OWNED BY public.companies.id;


--
-- TOC entry 217 (class 1259 OID 16426)
-- Name: invites; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.invites (
    id integer NOT NULL,
    companyfk bigint NOT NULL,
    userfk bigint NOT NULL,
    isadmin boolean NOT NULL,
    creationdate timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    isvalid boolean NOT NULL
);


ALTER TABLE public.invites OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16430)
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
-- TOC entry 4849 (class 0 OID 0)
-- Dependencies: 218
-- Name: invites_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.invites_id_seq OWNED BY public.invites.id;


--
-- TOC entry 219 (class 1259 OID 16431)
-- Name: messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.messages (
    user_id bigint NOT NULL,
    content text NOT NULL,
    sender public.senders NOT NULL,
    creation_datetime timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    id integer NOT NULL
);


ALTER TABLE public.messages OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16437)
-- Name: messages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.messages_id_seq OWNER TO postgres;

--
-- TOC entry 4850 (class 0 OID 0)
-- Dependencies: 220
-- Name: messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.messages_id_seq OWNED BY public.messages.id;


--
-- TOC entry 223 (class 1259 OID 16475)
-- Name: statistics; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.statistics (
    id bigint DEFAULT nextval('public.messages_id_seq'::regclass) NOT NULL,
    message_id bigint NOT NULL,
    used_tokens bigint NOT NULL,
    latency_ms bigint NOT NULL,
    estimated_cost double precision NOT NULL,
    category public.category NOT NULL,
    clarity double precision NOT NULL,
    complexity double precision NOT NULL,
    clarity_examples double precision NOT NULL,
    clarity_constraints double precision
);


ALTER TABLE public.statistics OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16438)
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
-- TOC entry 222 (class 1259 OID 16442)
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
-- TOC entry 4851 (class 0 OID 0)
-- Dependencies: 222
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4662 (class 2604 OID 16443)
-- Name: companies id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies ALTER COLUMN id SET DEFAULT nextval('public.companies_id_seq'::regclass);


--
-- TOC entry 4664 (class 2604 OID 16444)
-- Name: invites id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invites ALTER COLUMN id SET DEFAULT nextval('public.invites_id_seq'::regclass);


--
-- TOC entry 4667 (class 2604 OID 16445)
-- Name: messages id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages ALTER COLUMN id SET DEFAULT nextval('public.messages_id_seq'::regclass);


--
-- TOC entry 4668 (class 2604 OID 16446)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 4834 (class 0 OID 16421)
-- Dependencies: 215
-- Data for Name: companies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.companies (id, name, creationdate, tier) FROM stdin;
1	pepe SRL	2026-04-09 16:45:46.504893	basic
3	timba SA	2026-04-09 16:55:05.71627	advanced
5	comrades SC	2026-04-09 17:06:17.007416	basic
\.


--
-- TOC entry 4836 (class 0 OID 16426)
-- Dependencies: 217
-- Data for Name: invites; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.invites (id, companyfk, userfk, isadmin, creationdate, isvalid) FROM stdin;
1	1	1	t	2026-04-09 16:59:43.234684	t
2	3	3	t	2026-04-09 17:00:00.874314	t
3	5	5	t	2026-04-09 17:06:17.007416	t
19	5	20	f	2026-04-11 13:10:38.577623	t
\.


--
-- TOC entry 4838 (class 0 OID 16431)
-- Dependencies: 219
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.messages (user_id, content, sender, creation_datetime, id) FROM stdin;
5	i need a manifesto for the working people of the republic of southern new krusigistan	user	2026-05-01 16:02:34.214056	1
5	how 2 russkaya revolutsia	other	2026-05-01 16:13:10.070679	2
5	proletariat of the world, unite!	gemini	2026-05-01 16:15:26.379937	3
\.


--
-- TOC entry 4842 (class 0 OID 16475)
-- Dependencies: 223
-- Data for Name: statistics; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.statistics (id, message_id, used_tokens, latency_ms, estimated_cost, category, clarity, complexity, clarity_examples, clarity_constraints) FROM stdin;
\.


--
-- TOC entry 4840 (class 0 OID 16438)
-- Dependencies: 221
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, password, creationdate) FROM stdin;
1	MichaelScott	michaelscott@gmail.com	$2b$10$1.anQKx4HJWe0Q0J44aF2ueGYvCaL2nMHE/NxjqtdlAMXVW/X7aIO	2026-04-09 16:45:46.512418
3	DreadPirateRoberts	notyourbusiness@gmail.com	$2b$10$SR3FYq240EDvChktyfjB7.92hh.f2KWAPgeiv2QaWF1jc11tIqTKe	2026-04-09 16:55:05.721673
5	Vlad Ulianov	thepeoplesparty@gmail.com	$2b$10$Lpvd3zJiNolguhtzA/ErculadHrYDJExKa21HYFeCBGrQOXMNBY5.	2026-04-09 17:06:17.007416
20	Joseph	2gulag@siberia.ru	$2b$10$MzTNzOL9nAGJUGRwsIMUIuqhJpnXyT.LO3VXvl4YNqjaiWZ3NL1yS	2026-04-11 01:10:32.233605
\.


--
-- TOC entry 4852 (class 0 OID 0)
-- Dependencies: 216
-- Name: companies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.companies_id_seq', 32, true);


--
-- TOC entry 4853 (class 0 OID 0)
-- Dependencies: 218
-- Name: invites_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.invites_id_seq', 19, true);


--
-- TOC entry 4854 (class 0 OID 0)
-- Dependencies: 220
-- Name: messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.messages_id_seq', 3, true);


--
-- TOC entry 4855 (class 0 OID 0)
-- Dependencies: 222
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 20, true);


--
-- TOC entry 4672 (class 2606 OID 16448)
-- Name: companies companies_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_name_key UNIQUE (name);


--
-- TOC entry 4674 (class 2606 OID 16450)
-- Name: companies companies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_pkey PRIMARY KEY (id);


--
-- TOC entry 4676 (class 2606 OID 16452)
-- Name: invites invites_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invites
    ADD CONSTRAINT invites_pkey PRIMARY KEY (id);


--
-- TOC entry 4679 (class 2606 OID 16454)
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- TOC entry 4686 (class 2606 OID 16479)
-- Name: statistics statistics_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.statistics
    ADD CONSTRAINT statistics_pkey PRIMARY KEY (id);


--
-- TOC entry 4681 (class 2606 OID 16456)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4683 (class 2606 OID 16458)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4684 (class 1259 OID 16485)
-- Name: fki_messagefk; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX fki_messagefk ON public.statistics USING btree (message_id);


--
-- TOC entry 4677 (class 1259 OID 16459)
-- Name: fki_messages_users_fk; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX fki_messages_users_fk ON public.messages USING btree (user_id);


--
-- TOC entry 4687 (class 2606 OID 16460)
-- Name: invites invites_companyfk_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invites
    ADD CONSTRAINT invites_companyfk_fkey FOREIGN KEY (companyfk) REFERENCES public.companies(id) NOT VALID;


--
-- TOC entry 4688 (class 2606 OID 16465)
-- Name: invites invites_userfk_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invites
    ADD CONSTRAINT invites_userfk_fkey FOREIGN KEY (userfk) REFERENCES public.users(id) NOT VALID;


--
-- TOC entry 4690 (class 2606 OID 16480)
-- Name: statistics messagefk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.statistics
    ADD CONSTRAINT messagefk FOREIGN KEY (message_id) REFERENCES public.messages(id) NOT VALID;


--
-- TOC entry 4689 (class 2606 OID 16470)
-- Name: messages messages_users_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_users_fk FOREIGN KEY (user_id) REFERENCES public.users(id) NOT VALID;


-- Completed on 2026-05-08 08:54:28

--
-- PostgreSQL database dump complete
--

