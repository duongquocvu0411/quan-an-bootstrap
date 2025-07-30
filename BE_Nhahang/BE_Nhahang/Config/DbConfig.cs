using BE_Nhahang.Models.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;


namespace BE_Nhahang.Config
{
    public class DbConfig : IdentityDbContext<IdentityUser>
    {
        public DbConfig(DbContextOptions<DbConfig> options) : base(options)
        {
            
        }
        public DbSet<FoodCategoryModel> FoodCategories { get; set; }
        public DbSet<FoodModel>Foods { get; set; }
        public DbSet<FoodDetailModel> FoodDetails { get; set; }
        public DbSet<FoodImageModel> FoodImages { get; set; }
        public DbSet<SystemLogModel> SystemLogs { get; set; }

     
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<FoodModel>(e =>
            {
                e.Property(f => f.Price)
                .HasColumnType("decimal(18,2)");

                e.HasOne(f => f.Category)
                .WithMany()
                .HasForeignKey(f => f.CategoryId)
                .OnDelete(DeleteBehavior.Restrict); // Giữ nguyên dữ liệu khi xóa danh mục
            });

            // oncasedelete food and img - detail

            builder.Entity<FoodModel>()
            .HasOne(f => f.FoodDetail)
            .WithOne(d => d.Food)
            .HasForeignKey<FoodDetailModel>(d => d.FoodId)
            .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<FoodImageModel>()
                .HasOne(i => i.Food)
                .WithMany(f => f.FoodImages)
                .HasForeignKey(i => i.FoodId)
                .OnDelete(DeleteBehavior.Cascade);

        }
    }
}
