ALTER TABLE apflora.tpop DROP CONSTRAINT tpop_id_key cascade;

ALTER TABLE apflora.tpopber ADD CONSTRAINT tpopber_tpop_id_fkey FOREIGN KEY (tpop_id) REFERENCES apflora.tpop (id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE apflora.tpopmassn ADD CONSTRAINT tpopmassn_tpop_id_fkey FOREIGN KEY (tpop_id) REFERENCES apflora.tpop (id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE apflora.tpopmassnber ADD CONSTRAINT tpopmassnber_tpop_id_fkey FOREIGN KEY (tpop_id) REFERENCES apflora.tpop (id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE apflora.beob ADD CONSTRAINT beob_tpop_id_fkey FOREIGN KEY (tpop_id) REFERENCES apflora.tpop (id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE apflora.tpopkontr ADD CONSTRAINT tpopkontr_tpop_id_fkey FOREIGN KEY (tpop_id) REFERENCES apflora.tpop (id) ON DELETE CASCADE ON UPDATE CASCADE;


ALTER TABLE apflora.pop DROP CONSTRAINT pop_id_key cascade;
ALTER TABLE apflora.popber ADD CONSTRAINT popber_pop_id_fkey FOREIGN KEY (pop_id) REFERENCES apflora.pop (id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE apflora.popmassnber ADD CONSTRAINT popmassnber_pop_id_fkey FOREIGN KEY (pop_id) REFERENCES apflora.pop (id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE apflora.tpop ADD CONSTRAINT tpop_pop_id_fkey FOREIGN KEY (pop_id) REFERENCES apflora.pop (id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE apflora.ap
    ADD CONSTRAINT ap_fk_adresse FOREIGN KEY (bearbeiter)
    REFERENCES apflora.adresse (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE SET NULL;