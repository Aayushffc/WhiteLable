using Backend.DTOs.CRM;
using Backend.Models.CRM;
using Microsoft.Data.SqlClient;

namespace Backend.Services.CRM;

public class ContactService
{
    private readonly string _connectionString;
    private readonly ILogger<ContactService> _logger;

    public ContactService(IConfiguration configuration, ILogger<ContactService> logger)
    {
        _connectionString =
            configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException(
                "Connection string 'DefaultConnection' not found."
            );
        _logger = logger;
    }

    public async Task<IEnumerable<ContactDto>> GetAllContactsAsync(int tenantId)
    {
        try
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            const string sql =
                @"
                SELECT 
                    Id,
                    FirstName,
                    LastName,
                    Email,
                    PhoneNumber,
                    Company,
                    JobTitle,
                    Address,
                    City,
                    State,
                    PostalCode,
                    Country,
                    Notes,
                    Status,
                    CreatedAt,
                    UpdatedAt
                FROM Contacts 
                WHERE TenantId = @TenantId
                ORDER BY CreatedAt DESC";

            using var command = new SqlCommand(sql, connection);
            command.Parameters.AddWithValue("@TenantId", tenantId);

            var contacts = new List<ContactDto>();
            using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                contacts.Add(MapReaderToContactDto(reader));
            }

            _logger.LogInformation(
                "Retrieved {Count} contacts for tenant {TenantId}",
                contacts.Count,
                tenantId
            );
            return contacts;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving contacts for tenant {TenantId}", tenantId);
            throw new Exception("Error retrieving contacts", ex);
        }
    }

    public async Task<ContactDto?> GetContactByIdAsync(int id, int tenantId)
    {
        try
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            const string sql =
                @"
                SELECT 
                    Id,
                    FirstName,
                    LastName,
                    Email,
                    PhoneNumber,
                    Company,
                    JobTitle,
                    Address,
                    City,
                    State,
                    PostalCode,
                    Country,
                    Notes,
                    Status,
                    CreatedAt,
                    UpdatedAt
                FROM Contacts 
                WHERE Id = @Id AND TenantId = @TenantId";

            using var command = new SqlCommand(sql, connection);
            command.Parameters.AddWithValue("@Id", id);
            command.Parameters.AddWithValue("@TenantId", tenantId);

            using var reader = await command.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                var contact = MapReaderToContactDto(reader);
                _logger.LogInformation(
                    "Retrieved contact {Id} for tenant {TenantId}",
                    id,
                    tenantId
                );
                return contact;
            }

            _logger.LogWarning("Contact {Id} not found for tenant {TenantId}", id, tenantId);
            return null;
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Error retrieving contact {Id} for tenant {TenantId}",
                id,
                tenantId
            );
            throw new Exception($"Error retrieving contact with ID {id}", ex);
        }
    }

    public async Task<ContactDto> CreateContactAsync(CreateContactDto dto, int tenantId)
    {
        try
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            const string sql =
                @"
                INSERT INTO Contacts (
                    FirstName, LastName, Email, PhoneNumber, Company, 
                    JobTitle, Address, City, State, PostalCode, 
                    Country, Notes, Status, TenantId, CreatedAt
                )
                VALUES (
                    @FirstName, @LastName, @Email, @PhoneNumber, @Company,
                    @JobTitle, @Address, @City, @State, @PostalCode,
                    @Country, @Notes, @Status, @TenantId, @CreatedAt
                );
                SELECT SCOPE_IDENTITY();";

            using var command = new SqlCommand(sql, connection);
            AddContactParameters(command, dto, tenantId);
            command.Parameters.AddWithValue("@CreatedAt", DateTime.UtcNow);

            var id = Convert.ToInt32(await command.ExecuteScalarAsync());
            var createdContact = await GetContactByIdAsync(id, tenantId);

            if (createdContact == null)
            {
                throw new Exception("Failed to retrieve created contact");
            }

            _logger.LogInformation("Created contact {Id} for tenant {TenantId}", id, tenantId);
            return createdContact;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating contact for tenant {TenantId}", tenantId);
            throw new Exception("Error creating contact", ex);
        }
    }

    public async Task<ContactDto?> UpdateContactAsync(int id, UpdateContactDto dto, int tenantId)
    {
        try
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            const string sql =
                @"
                UPDATE Contacts 
                SET 
                    FirstName = @FirstName,
                    LastName = @LastName,
                    Email = @Email,
                    PhoneNumber = @PhoneNumber,
                    Company = @Company,
                    JobTitle = @JobTitle,
                    Address = @Address,
                    City = @City,
                    State = @State,
                    PostalCode = @PostalCode,
                    Country = @Country,
                    Notes = @Notes,
                    Status = @Status,
                    UpdatedAt = @UpdatedAt
                WHERE Id = @Id AND TenantId = @TenantId";

            using var command = new SqlCommand(sql, connection);
            command.Parameters.AddWithValue("@Id", id);
            AddContactParameters(command, dto, tenantId);
            command.Parameters.AddWithValue("@UpdatedAt", DateTime.UtcNow);

            var rowsAffected = await command.ExecuteNonQueryAsync();
            if (rowsAffected == 0)
            {
                _logger.LogWarning(
                    "Contact {Id} not found for update for tenant {TenantId}",
                    id,
                    tenantId
                );
                return null;
            }

            var updatedContact = await GetContactByIdAsync(id, tenantId);
            _logger.LogInformation("Updated contact {Id} for tenant {TenantId}", id, tenantId);
            return updatedContact;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating contact {Id} for tenant {TenantId}", id, tenantId);
            throw new Exception($"Error updating contact with ID {id}", ex);
        }
    }

    public async Task<bool> DeleteContactAsync(int id, int tenantId)
    {
        try
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            const string sql = "DELETE FROM Contacts WHERE Id = @Id AND TenantId = @TenantId";

            using var command = new SqlCommand(sql, connection);
            command.Parameters.AddWithValue("@Id", id);
            command.Parameters.AddWithValue("@TenantId", tenantId);

            var rowsAffected = await command.ExecuteNonQueryAsync();
            if (rowsAffected > 0)
            {
                _logger.LogInformation("Deleted contact {Id} for tenant {TenantId}", id, tenantId);
                return true;
            }

            _logger.LogWarning(
                "Contact {Id} not found for deletion for tenant {TenantId}",
                id,
                tenantId
            );
            return false;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting contact {Id} for tenant {TenantId}", id, tenantId);
            throw new Exception($"Error deleting contact with ID {id}", ex);
        }
    }

    public async Task<IEnumerable<ContactDto>> SearchContactsAsync(string searchTerm, int tenantId)
    {
        try
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            const string sql =
                @"
                SELECT 
                    Id,
                    FirstName,
                    LastName,
                    Email,
                    PhoneNumber,
                    Company,
                    JobTitle,
                    Address,
                    City,
                    State,
                    PostalCode,
                    Country,
                    Notes,
                    Status,
                    CreatedAt,
                    UpdatedAt
                FROM Contacts 
                WHERE TenantId = @TenantId
                AND (
                    FirstName LIKE @SearchTerm
                    OR LastName LIKE @SearchTerm
                    OR Email LIKE @SearchTerm
                    OR Company LIKE @SearchTerm
                    OR PhoneNumber LIKE @SearchTerm
                )
                ORDER BY CreatedAt DESC";

            using var command = new SqlCommand(sql, connection);
            command.Parameters.AddWithValue("@TenantId", tenantId);
            command.Parameters.AddWithValue("@SearchTerm", $"%{searchTerm}%");

            var contacts = new List<ContactDto>();
            using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                contacts.Add(MapReaderToContactDto(reader));
            }

            _logger.LogInformation(
                "Found {Count} contacts matching search term '{SearchTerm}' for tenant {TenantId}",
                contacts.Count,
                searchTerm,
                tenantId
            );
            return contacts;
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Error searching contacts with term '{SearchTerm}' for tenant {TenantId}",
                searchTerm,
                tenantId
            );
            throw new Exception("Error searching contacts", ex);
        }
    }

    private static ContactDto MapReaderToContactDto(SqlDataReader reader)
    {
        return new ContactDto
        {
            Id = reader.GetInt32(0),
            FirstName = reader.GetString(1),
            LastName = reader.GetString(2),
            Email = reader.GetString(3),
            PhoneNumber = reader.IsDBNull(4) ? null : reader.GetString(4),
            Company = reader.IsDBNull(5) ? null : reader.GetString(5),
            JobTitle = reader.IsDBNull(6) ? null : reader.GetString(6),
            Address = reader.IsDBNull(7) ? null : reader.GetString(7),
            City = reader.IsDBNull(8) ? null : reader.GetString(8),
            State = reader.IsDBNull(9) ? null : reader.GetString(9),
            PostalCode = reader.IsDBNull(10) ? null : reader.GetString(10),
            Country = reader.IsDBNull(11) ? null : reader.GetString(11),
            Notes = reader.IsDBNull(12) ? null : reader.GetString(12),
            Status = (ContactStatus)reader.GetInt32(13),
        };
    }

    private static void AddContactParameters(SqlCommand command, dynamic dto, int tenantId)
    {
        command.Parameters.AddWithValue("@FirstName", dto.FirstName);
        command.Parameters.AddWithValue("@LastName", dto.LastName);
        command.Parameters.AddWithValue("@Email", dto.Email);
        command.Parameters.AddWithValue("@PhoneNumber", (object?)dto.PhoneNumber ?? DBNull.Value);
        command.Parameters.AddWithValue("@Company", (object?)dto.Company ?? DBNull.Value);
        command.Parameters.AddWithValue("@JobTitle", (object?)dto.JobTitle ?? DBNull.Value);
        command.Parameters.AddWithValue("@Address", (object?)dto.Address ?? DBNull.Value);
        command.Parameters.AddWithValue("@City", (object?)dto.City ?? DBNull.Value);
        command.Parameters.AddWithValue("@State", (object?)dto.State ?? DBNull.Value);
        command.Parameters.AddWithValue("@PostalCode", (object?)dto.PostalCode ?? DBNull.Value);
        command.Parameters.AddWithValue("@Country", (object?)dto.Country ?? DBNull.Value);
        command.Parameters.AddWithValue("@Notes", (object?)dto.Notes ?? DBNull.Value);
        command.Parameters.AddWithValue("@Status", (int)dto.Status);
        command.Parameters.AddWithValue("@TenantId", tenantId);
    }
}
