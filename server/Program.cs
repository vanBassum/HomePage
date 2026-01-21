using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

// Add MVC controllers
builder.Services.AddControllers();

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

var versionInfo = new VersionInfo(
    Name: "HomePage",
    Version: Assembly.GetExecutingAssembly().GetName().Version?.ToString() ?? "0.0.0"
);

app.MapGet("/api/version", () => versionInfo)
   .WithName("GetVersion")
   .WithTags("Version");

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
