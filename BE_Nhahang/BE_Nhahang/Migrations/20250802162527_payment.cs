using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BE_Nhahang.Migrations
{
    /// <inheritdoc />
    public partial class payment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                 name: "PaymentQrs",
                 columns: table => new
                 {
                     Id = table.Column<int>(type: "int", nullable: false)
                         .Annotation("SqlServer:Identity", "1, 1"),
                     BookingId = table.Column<int>(type: "int", nullable: false),
                     Amount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                     Note = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: false),
                     QrImageUrl = table.Column<string>(type: "nvarchar(512)", maxLength: 512, nullable: false),
                     CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                     CreatedBy = table.Column<string>(type: "nvarchar(64)", maxLength: 64, nullable: true)
                 },
                 constraints: table =>
                 {
                     table.PrimaryKey("PK_PaymentQrs", x => x.Id);
                     table.ForeignKey(
                         name: "FK_PaymentQrs_TableBookings_BookingId",
                         column: x => x.BookingId,
                         principalTable: "TableBookings",
                         principalColumn: "Id",
                         onDelete: ReferentialAction.Cascade);
                 });
            migrationBuilder.CreateIndex(
                name: "IX_PaymentQrs_BookingId",
                table: "PaymentQrs",
                column: "BookingId");
        }
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PaymentQrs");
        }
    }
}
