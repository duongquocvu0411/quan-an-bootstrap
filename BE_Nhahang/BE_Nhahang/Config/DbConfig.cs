using BE_Nhahang.Models.Entities;
using BE_Nhahang.Models.Entities.Table;
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

        //table related models
        public DbSet<TableModel> Tables { get; set; }
        public DbSet<TableImageModel> TableImages { get; set; }
        public DbSet<TableBookingModel> TableBookings { get; set; }
        public DbSet<TableOrderModel> TableOrders { get; set; }



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


            // 1. TableModel → TableImageModel (1-n)
            builder.Entity<TableImageModel>()
                .HasOne(i => i.Table)
                .WithMany(t => t.TableImages)
                .HasForeignKey(i => i.TableId)
                .OnDelete(DeleteBehavior.Cascade);

            // 2. TableModel → TableBookingModel (1-n)
            builder.Entity<TableBookingModel>()
                .HasOne(b => b.Table)
                .WithMany(t => t.Bookings)
                .HasForeignKey(b => b.TableId)
                .OnDelete(DeleteBehavior.Cascade);

            // 3. TableBookingModel → TableOrderModel (1-n)
            builder.Entity<TableOrderModel>()
                .HasOne(o => o.Booking)
                .WithMany(b => b.TableOrders)
                .HasForeignKey(o => o.BookingId)
                .OnDelete(DeleteBehavior.Cascade);

          

        }
    }
}
