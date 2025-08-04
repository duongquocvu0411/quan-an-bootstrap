using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BE_Nhahang.Migrations
{
    /// <inheritdoc />
    public partial class addtablepaymentaccounts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "BankShortName",
                table: "PaymentQrBankAccounts",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BankShortName",
                table: "PaymentQrBankAccounts");
        }
    }
}
