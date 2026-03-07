using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Models;

namespace Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AppsController : ControllerBase
{
    private readonly AppDbContext _db;

    public AppsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet(Name = nameof(GetAll))]
    public async Task<ActionResult<IEnumerable<AppRecord>>> GetAll(CancellationToken ct)
    {
        var items = await _db.AppRecords
            .AsNoTracking()
            .OrderBy(a => a.Id)
            .ToListAsync(ct);

        return Ok(items);
    }

    [HttpGet("{id:int}", Name = nameof(GetById))]
    public async Task<ActionResult<AppRecord>> GetById(int id, CancellationToken ct)
    {
        var entity = await _db.AppRecords.AsNoTracking().FirstOrDefaultAsync(a => a.Id == id, ct);
        if (entity is null) return NotFound();
        return Ok(entity);
    }

    [HttpPost(Name = nameof(Create))]
    public async Task<ActionResult<AppRecord>> Create([FromBody] AppRecord entity, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(entity.Name))
            return BadRequest(new { error = "Name is required." });

        _db.AppRecords.Add(entity);
        await _db.SaveChangesAsync(ct);
        return CreatedAtAction(nameof(GetById), new { id = entity.Id }, entity);
    }

    [HttpPut("{id:int}", Name = nameof(Replace))]
    public async Task<ActionResult<AppRecord>> Replace(int id, [FromBody] AppRecord request, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            return BadRequest(new { error = "Name is required." });

        var entity = await _db.AppRecords.FirstOrDefaultAsync(a => a.Id == id, ct);
        if (entity is null) return NotFound();

        entity.Name = request.Name;
        entity.Description = request.Description;
        entity.Url = request.Url;
        entity.IconUrl = request.IconUrl;
        entity.Category = request.Category;

        await _db.SaveChangesAsync(ct);
        return Ok(entity);
    }

    [HttpDelete("{id:int}", Name = nameof(Remove))]
    public async Task<IActionResult> Remove(int id, CancellationToken ct)
    {
        var entity = await _db.AppRecords.FirstOrDefaultAsync(a => a.Id == id, ct);
        if (entity is null) return NotFound();

        _db.AppRecords.Remove(entity);
        await _db.SaveChangesAsync(ct);

        return NoContent();
    }
}
