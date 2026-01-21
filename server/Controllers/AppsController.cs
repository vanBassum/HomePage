using Microsoft.AspNetCore.Mvc;
using System.Collections.Concurrent;

namespace HomePage.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AppsController : ControllerBase
{
    // Dummy in-memory storage
    private static readonly ConcurrentDictionary<int, AppRecord> _apps = new();
    private static int _nextId = 1;

    static AppsController()
    {
        // Seed demo data once
        if (_apps.IsEmpty)
        {
            _apps.TryAdd(1, new AppRecord(1, "Docs", "Internal documentation", "https://example.com/docs", null, "Work"));
            _apps.TryAdd(2, new AppRecord(2, "Grafana", "Dashboards", "https://example.com/grafana", null, "Monitoring"));
            _apps.TryAdd(3, new AppRecord(3, "GitHub", "Repositories", "https://github.com", null, "Dev"));
            _nextId = 4;
        }
    }

    [HttpGet]
    public ActionResult<IEnumerable<AppRecord>> List()
    {
        return Ok(_apps.Values.OrderBy(a => a.Id));
    }

    [HttpGet("{id:int}")]
    public ActionResult<AppRecord> Get(int id)
    {
        return _apps.TryGetValue(id, out var existing)
            ? Ok(existing)
            : NotFound();
    }

    [HttpPost]
    public ActionResult<AppRecord> Create([FromBody] AppRecord request)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            return BadRequest(new { error = "Name is required." });

        var id = System.Threading.Interlocked.Increment(ref _nextId) - 1;

        var created = new AppRecord(
            Id: id,
            Name: request.Name.Trim(),
            Description: request.Description,
            Url: request.Url,
            IconUrl: request.IconUrl,
            Category: request.Category
        );

        _apps[id] = created;

        return CreatedAtAction(nameof(Get), new { id }, created);
    }

    [HttpPut("{id:int}")]
    public ActionResult<AppRecord> Replace(int id, [FromBody] AppRecord request)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            return BadRequest(new { error = "Name is required." });

        if (!_apps.ContainsKey(id))
            return NotFound();

        var updated = new AppRecord(
            Id: id,
            Name: request.Name.Trim(),
            Description: request.Description,
            Url: request.Url,
            IconUrl: request.IconUrl,
            Category: request.Category
        );

        _apps[id] = updated;
        return Ok(updated);
    }

    [HttpPatch("{id:int}")]
    public ActionResult<AppRecord> Patch(int id, [FromBody] AppRecord request)
    {
        if (!_apps.TryGetValue(id, out var existing))
            return NotFound();

        var name = request.Name is null ? existing.Name : request.Name.Trim();
        if (string.IsNullOrWhiteSpace(name))
            return BadRequest(new { error = "Name cannot be empty." });

        var updated = existing with
        {
            Name = name,
            Description = request.Description ?? existing.Description,
            Url = request.Url ?? existing.Url,
            IconUrl = request.IconUrl ?? existing.IconUrl,
            Category = request.Category ?? existing.Category
        };

        _apps[id] = updated;
        return Ok(updated);
    }

    [HttpDelete("{id:int}")]
    public IActionResult Delete(int id)
    {
        return _apps.TryRemove(id, out _)
            ? NoContent()
            : NotFound();
    }
}
