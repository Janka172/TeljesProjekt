﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Data.Entity;
using webapiproj.Models;
using System.Web.Http.Description;
using webapiproj.Database;

namespace webapiproj.Controllers
{
    public class KategoriaModel
    {
        public string Nev { get; set; }
    }
    public class KategoriaController : ApiController
    {
        IProjektContext ctx = new ProjektContext();

        public KategoriaController() { }

        public KategoriaController(IProjektContext context)
        {
            ctx = context;
        }
        // GET api/<controller>
        [ResponseType(typeof(KategoriaModel))]
        public IHttpActionResult Get()
        {
            IEnumerable<KategoriaModel> result = null;
            result = ctx.Kategoriak.Select(x => new KategoriaModel
            {
                Nev = x.Nev
            }).ToList();
            return Ok(result);
        }

        // GET api/<controller>/5
        [ResponseType(typeof(KategoriaModel))]
        public IHttpActionResult Get(int id, string name)
        {
            KategoriaModel result = null;
            result = ctx.Kategoriak.Where(x => x.Nev == name).Select(x => new KategoriaModel
            {
                Nev = x.Nev
            }).FirstOrDefault();
            if (result == null) return NotFound();
            return Ok(result);
        }

        // POST api/<controller>
        [ResponseType(typeof(KategoriaModel))]
        public IHttpActionResult Post([FromBody] KategoriaModel value)
        {
            try
            {
                var result = ctx.Kategoriak.Add(new Kategoria
                {
                    Nev=value.Nev
                });
                ctx.SaveChanges();

                return Content(HttpStatusCode.Created, result);
            }
            catch (Exception ex)
            {
                if (ex.Message == "An error occurred while updating the entries. See the inner exception for details.") return Content(HttpStatusCode.Conflict, "Ezzel a névvel már létezik Kategoria rendszer.");
                return InternalServerError(ex);
            }

        }

        // PUT api/<controller>/5
        [ResponseType(typeof(KategoriaModel))]
        public IHttpActionResult Patch(int id, string name, [FromBody] KategoriaModel value)
        {
            try
            {
                var result = ctx.Kategoriak.Where(x => x.Nev == name).FirstOrDefault();
                if (result == null) return NotFound();
                if (value.Nev != null) result.Nev = value.Nev;

                ctx.SaveChanges();
                return Ok("Update sikeres");
            }
            catch (Exception ex)
            {
                if (ex.Message == "An error occurred while updating the entries. See the inner exception for details.") return Content(HttpStatusCode.Conflict, "Ezzel a névvel már létezik Kategoria rendszer.");
                return InternalServerError(ex);
            }
        }

        // DELETE api/<controller>/5
        [ResponseType(typeof(KategoriaModel))]
        public IHttpActionResult Delete(int id, string name)
        {
            var KatdId = ctx.Kategoriak.Where(x => x.Nev == name).Select(x => x.Id).FirstOrDefault();
            var set = ctx.Applikaciok.Where(x => x.KatId == KatdId).ToList();

            foreach (var item in set)
            {
                item.KatId = null;
            }

            var result = ctx.Kategoriak.Where(x => x.Nev == name).FirstOrDefault();
            if (result != null)
            {
                ctx.Kategoriak.Remove(result);
                ctx.SaveChanges();
                return Ok("Törlés sikeresen véghezment");
            }
            ctx.SaveChanges();
            return NotFound();
        }
    }
}