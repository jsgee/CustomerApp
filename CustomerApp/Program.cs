using Microsoft.EntityFrameworkCore;

namespace CustomerApp
{
    public class Program
    {
        
        public static void Main(string[] args)
        {
            string corsPolicy = "OpenCORSPolicy";
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddCors(options =>
            {
                options.AddPolicy(
                  name: corsPolicy,
                  builder => {
                      builder.WithOrigins("*").AllowAnyHeader().AllowAnyMethod();
                  });
            });

            ConfigurationManager configuration = builder.Configuration;

            builder.Services.AddControllersWithViews();
            builder.Services.AddDbContext<CustomersContext>(options =>
            {
                options.UseSqlServer(configuration.GetConnectionString("ConnStr"));
            });

            builder.Services.AddSwaggerGen();

            

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (!app.Environment.IsDevelopment())
            {
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Customers Api v1");
            });
            // app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseRouting();
            app.UseCors(corsPolicy);


            app.MapControllerRoute(
                name: "default",
                pattern: "{controller}/{action=Index}/{id?}");

            app.MapFallbackToFile("index.html");

            app.Run();
        }
    }
}