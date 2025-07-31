using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BE_Nhahang.Migrations
{
    /// <inheritdoc />
    public partial class updatetable_booking : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "BookingCode",
                table: "TableBookings",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BookingCode",
                table: "TableBookings");
        }
    }
}
