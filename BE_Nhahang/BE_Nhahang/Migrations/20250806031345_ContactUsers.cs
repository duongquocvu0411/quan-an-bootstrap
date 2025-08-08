using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BE_Nhahang.Migrations
{
    /// <inheritdoc />
    public partial class ContactUsers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsReplied",
                table: "ContactUsers",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "RepliedAt",
                table: "ContactUsers",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RepliedBy",
                table: "ContactUsers",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsReplied",
                table: "ContactUsers");

            migrationBuilder.DropColumn(
                name: "RepliedAt",
                table: "ContactUsers");

            migrationBuilder.DropColumn(
                name: "RepliedBy",
                table: "ContactUsers");
        }
    }
}
