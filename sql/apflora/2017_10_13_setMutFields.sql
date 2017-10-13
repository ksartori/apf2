ALTER TABLE apflora.adresse ALTER COLUMN "MutWann" SET DEFAULT NOW();
ALTER TABLE apflora.adresse ALTER COLUMN "MutWer" SET DEFAULT current_setting('request.jwt.claim.username', true);
ALTER TABLE apflora.ap ALTER COLUMN "MutWann" SET DEFAULT NOW();
ALTER TABLE apflora.ap ALTER COLUMN "MutWer" SET DEFAULT current_setting('request.jwt.claim.username', true);
ALTER TABLE apflora.ap_bearbstand_werte ALTER COLUMN "MutWann" SET DEFAULT NOW();
ALTER TABLE apflora.ap_bearbstand_werte ALTER COLUMN "MutWer" SET DEFAULT current_setting('request.jwt.claim.username', true);
ALTER TABLE apflora.ap_erfbeurtkrit_werte ALTER COLUMN "MutWann" SET DEFAULT NOW();
ALTER TABLE apflora.ap_erfbeurtkrit_werte ALTER COLUMN "MutWer" SET DEFAULT current_setting('request.jwt.claim.username', true);
ALTER TABLE apflora.ap_erfkrit_werte ALTER COLUMN "MutWann" SET DEFAULT NOW();
ALTER TABLE apflora.ap_erfkrit_werte ALTER COLUMN "MutWer" SET DEFAULT current_setting('request.jwt.claim.username', true);
ALTER TABLE apflora.ap_umsetzung_werte ALTER COLUMN "MutWann" SET DEFAULT NOW();
ALTER TABLE apflora.ap_umsetzung_werte ALTER COLUMN "MutWer" SET DEFAULT current_setting('request.jwt.claim.username', true);
ALTER TABLE apflora.apber ALTER COLUMN "MutWann" SET DEFAULT NOW();
ALTER TABLE apflora.apber ALTER COLUMN "MutWer" SET DEFAULT current_setting('request.jwt.claim.username', true);
ALTER TABLE apflora.apberuebersicht ALTER COLUMN "MutWann" SET DEFAULT NOW();
ALTER TABLE apflora.apberuebersicht ALTER COLUMN "MutWer" SET DEFAULT current_setting('request.jwt.claim.username', true);
ALTER TABLE apflora.assozart ALTER COLUMN "MutWann" SET DEFAULT NOW();
ALTER TABLE apflora.assozart ALTER COLUMN "MutWer" SET DEFAULT current_setting('request.jwt.claim.username', true);
ALTER TABLE apflora.beobzuordnung ALTER COLUMN "BeobMutWann" SET DEFAULT NOW();
ALTER TABLE apflora.beobzuordnung ALTER COLUMN "BeobMutWer" SET DEFAULT current_setting('request.jwt.claim.username', true);
ALTER TABLE apflora.projekt ALTER COLUMN "MutWann" SET DEFAULT NOW();
ALTER TABLE apflora.projekt ALTER COLUMN "MutWer" SET DEFAULT current_setting('request.jwt.claim.username', true);
ALTER TABLE apflora.ber ALTER COLUMN "MutWann" SET DEFAULT NOW();
ALTER TABLE apflora.ber ALTER COLUMN "MutWer" SET DEFAULT current_setting('request.jwt.claim.username', true);
ALTER TABLE apflora.erfkrit ALTER COLUMN "MutWann" SET DEFAULT NOW();
ALTER TABLE apflora.erfkrit ALTER COLUMN "MutWer" SET DEFAULT current_setting('request.jwt.claim.username', true);
ALTER TABLE apflora.idealbiotop ALTER COLUMN "MutWann" SET DEFAULT NOW();
ALTER TABLE apflora.idealbiotop ALTER COLUMN "MutWer" SET DEFAULT current_setting('request.jwt.claim.username', true);
ALTER TABLE apflora.pop ALTER COLUMN "MutWann" SET DEFAULT NOW();
ALTER TABLE apflora.pop ALTER COLUMN "MutWer" SET DEFAULT current_setting('request.jwt.claim.username', true);
ALTER TABLE apflora.pop_entwicklung_werte ALTER COLUMN "MutWann" SET DEFAULT NOW();
ALTER TABLE apflora.pop_entwicklung_werte ALTER COLUMN "MutWer" SET DEFAULT current_setting('request.jwt.claim.username', true);
ALTER TABLE apflora.pop_status_werte ALTER COLUMN "MutWann" SET DEFAULT NOW();
ALTER TABLE apflora.pop_status_werte ALTER COLUMN "MutWer" SET DEFAULT current_setting('request.jwt.claim.username', true);
ALTER TABLE apflora.popber ALTER COLUMN "MutWann" SET DEFAULT NOW();
ALTER TABLE apflora.popber ALTER COLUMN "MutWer" SET DEFAULT current_setting('request.jwt.claim.username', true);
ALTER TABLE apflora.popmassnber ALTER COLUMN "MutWann" SET DEFAULT NOW();
ALTER TABLE apflora.popmassnber ALTER COLUMN "MutWer" SET DEFAULT current_setting('request.jwt.claim.username', true);
ALTER TABLE apflora.tpop ALTER COLUMN "MutWann" SET DEFAULT NOW();
ALTER TABLE apflora.tpop ALTER COLUMN "MutWer" SET DEFAULT current_setting('request.jwt.claim.username', true);
ALTER TABLE apflora.tpop_apberrelevant_werte ALTER COLUMN "MutWann" SET DEFAULT NOW();
ALTER TABLE apflora.tpop_apberrelevant_werte ALTER COLUMN "MutWer" SET DEFAULT current_setting('request.jwt.claim.username', true);
ALTER TABLE apflora.tpop_entwicklung_werte ALTER COLUMN "MutWann" SET DEFAULT NOW();
ALTER TABLE apflora.tpop_entwicklung_werte ALTER COLUMN "MutWer" SET DEFAULT current_setting('request.jwt.claim.username', true);
ALTER TABLE apflora.tpopber ALTER COLUMN "MutWann" SET DEFAULT NOW();
ALTER TABLE apflora.tpopber ALTER COLUMN "MutWer" SET DEFAULT current_setting('request.jwt.claim.username', true);
ALTER TABLE apflora.tpopkontr ALTER COLUMN "MutWann" SET DEFAULT NOW();
ALTER TABLE apflora.tpopkontr ALTER COLUMN "MutWer" SET DEFAULT current_setting('request.jwt.claim.username', true);
ALTER TABLE apflora.tpopkontr_idbiotuebereinst_werte ALTER COLUMN "MutWann" SET DEFAULT NOW();
ALTER TABLE apflora.tpopkontr_idbiotuebereinst_werte ALTER COLUMN "MutWer" SET DEFAULT current_setting('request.jwt.claim.username', true);
ALTER TABLE apflora.tpopkontr_typ_werte ALTER COLUMN "MutWann" SET DEFAULT NOW();
ALTER TABLE apflora.tpopkontr_typ_werte ALTER COLUMN "MutWer" SET DEFAULT current_setting('request.jwt.claim.username', true);
ALTER TABLE apflora.tpopkontrzaehl ALTER COLUMN "MutWann" SET DEFAULT NOW();
ALTER TABLE apflora.tpopkontrzaehl ALTER COLUMN "MutWer" SET DEFAULT current_setting('request.jwt.claim.username', true);
ALTER TABLE apflora.tpopkontrzaehl_einheit_werte ALTER COLUMN "MutWann" SET DEFAULT NOW();
ALTER TABLE apflora.tpopkontrzaehl_einheit_werte ALTER COLUMN "MutWer" SET DEFAULT current_setting('request.jwt.claim.username', true);
ALTER TABLE apflora.tpopkontrzaehl_methode_werte ALTER COLUMN "MutWann" SET DEFAULT NOW();
ALTER TABLE apflora.tpopkontrzaehl_methode_werte ALTER COLUMN "MutWer" SET DEFAULT current_setting('request.jwt.claim.username', true);
ALTER TABLE apflora.tpopmassn ALTER COLUMN "MutWann" SET DEFAULT NOW();
ALTER TABLE apflora.tpopmassn ALTER COLUMN "MutWer" SET DEFAULT current_setting('request.jwt.claim.username', true);
ALTER TABLE apflora.tpopmassn_erfbeurt_werte ALTER COLUMN "MutWann" SET DEFAULT NOW();
ALTER TABLE apflora.tpopmassn_erfbeurt_werte ALTER COLUMN "MutWer" SET DEFAULT current_setting('request.jwt.claim.username', true);
ALTER TABLE apflora.tpopmassn_typ_werte ALTER COLUMN "MutWann" SET DEFAULT NOW();
ALTER TABLE apflora.tpopmassn_typ_werte ALTER COLUMN "MutWer" SET DEFAULT current_setting('request.jwt.claim.username', true);
ALTER TABLE apflora.tpopmassnber ALTER COLUMN "MutWann" SET DEFAULT NOW();
ALTER TABLE apflora.tpopmassnber ALTER COLUMN "MutWer" SET DEFAULT current_setting('request.jwt.claim.username', true);
ALTER TABLE apflora.ziel ALTER COLUMN "MutWann" SET DEFAULT NOW();
ALTER TABLE apflora.ziel ALTER COLUMN "MutWer" SET DEFAULT current_setting('request.jwt.claim.username', true);
ALTER TABLE apflora.ziel_typ_werte ALTER COLUMN "MutWann" SET DEFAULT NOW();
ALTER TABLE apflora.ziel_typ_werte ALTER COLUMN "MutWer" SET DEFAULT current_setting('request.jwt.claim.username', true);
ALTER TABLE apflora.zielber ALTER COLUMN "MutWann" SET DEFAULT NOW();
ALTER TABLE apflora.zielber ALTER COLUMN "MutWer" SET DEFAULT current_setting('request.jwt.claim.username', true);
