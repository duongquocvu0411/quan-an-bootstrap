using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BE_Nhahang.Migrations
{
    /// <inheritdoc />
    public partial class updatefoodimg : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Caption",
                table: "FoodImages");

            migrationBuilder.DropColumn(
                name: "SortOrder",
                table: "FoodImages");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Caption",
                table: "FoodImages",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "SortOrder",
                table: "FoodImages",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
