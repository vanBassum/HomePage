using Microsoft.EntityFrameworkCore;
using Server.Data;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddControllers();

// Read database path from config, defaulting to /data/db.sqlite
var dbPath = builder.Configuration["Storage:DatabasePath"];
if (string.IsNullOrWhiteSpace(dbPath))
    dbPath = "/data/db.sqlite";

// Ensure directory exists (important for /data in containers)
var dbDir = Path.GetDirectoryName(dbPath);
if (!string.IsNullOrWhiteSpace(dbDir))
    Directory.CreateDirectory(dbDir);

// Register EF Core with SQLite
builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlite($"Data Source={dbPath}");
});

// DEV ONLY: allow all CORS (any origin/headers/methods)
if (builder.Environment.IsDevelopment())
{
    builder.Services.AddCors(options =>
    {
        options.AddDefaultPolicy(p =>
            p.AllowAnyOrigin()
             .AllowAnyHeader()
             .AllowAnyMethod());
    });
}

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();     // /openapi/v1.json
    app.UseCors();        // apply default CORS policy
}

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

// Map controllers (this is the key line)
app.MapControllers();

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapFallback(async context =>
{
    if (context.Request.Path.StartsWithSegments("/api"))
    {
        context.Response.StatusCode = StatusCodes.Status404NotFound;
        return;
    }

    context.Response.ContentType = "text/html; charset=utf-8";
    await context.Response.SendFileAsync(Path.Combine(app.Environment.WebRootPath, "index.html"));
});

app.Run();
