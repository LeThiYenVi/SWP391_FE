-- Script để xóa hết tất cả bảng trong database
-- ⚠️ CẢNH BÁO: Script này sẽ xóa TOÀN BỘ dữ liệu và cấu trúc bảng!
-- Chỉ chạy khi bạn chắc chắn muốn reset database hoàn toàn

USE HS_New;
GO

-- Tắt foreign key constraints
EXEC sp_msforeachtable "ALTER TABLE ? NOCHECK CONSTRAINT all"
GO

-- Xóa tất cả foreign key constraints
DECLARE @sql NVARCHAR(max)=''
SELECT @sql = @sql + 'ALTER TABLE ' + QUOTENAME(SCHEMA_NAME(schema_id)) + '.' + QUOTENAME(OBJECT_NAME(parent_object_id)) + 
              ' DROP CONSTRAINT ' + QUOTENAME(name) + ';' + CHAR(13)
FROM sys.foreign_keys

EXECUTE sp_executesql @sql
GO

-- Xóa tất cả bảng
DECLARE @sql2 NVARCHAR(max)=''
SELECT @sql2 = @sql2 + 'DROP TABLE ' + QUOTENAME(SCHEMA_NAME(schema_id)) + '.' + QUOTENAME(name) + ';' + CHAR(13)
FROM sys.tables

EXECUTE sp_executesql @sql2
GO

-- Xóa tất cả views (nếu có)
DECLARE @sql3 NVARCHAR(max)=''
SELECT @sql3 = @sql3 + 'DROP VIEW ' + QUOTENAME(SCHEMA_NAME(schema_id)) + '.' + QUOTENAME(name) + ';' + CHAR(13)
FROM sys.views
WHERE is_ms_shipped = 0

EXECUTE sp_executesql @sql3
GO

-- Xóa tất cả stored procedures (nếu có)
DECLARE @sql4 NVARCHAR(max)=''
SELECT @sql4 = @sql4 + 'DROP PROCEDURE ' + QUOTENAME(SCHEMA_NAME(schema_id)) + '.' + QUOTENAME(name) + ';' + CHAR(13)
FROM sys.procedures
WHERE is_ms_shipped = 0

EXECUTE sp_executesql @sql4
GO

-- Xóa tất cả functions (nếu có)
DECLARE @sql5 NVARCHAR(max)=''
SELECT @sql5 = @sql5 + 'DROP FUNCTION ' + QUOTENAME(SCHEMA_NAME(schema_id)) + '.' + QUOTENAME(name) + ';' + CHAR(13)
FROM sys.objects
WHERE type IN ('FN', 'IF', 'TF') AND is_ms_shipped = 0

EXECUTE sp_executesql @sql5
GO

-- Xóa tất cả sequences (nếu có)
DECLARE @sql6 NVARCHAR(max)=''
SELECT @sql6 = @sql6 + 'DROP SEQUENCE ' + QUOTENAME(SCHEMA_NAME(schema_id)) + '.' + QUOTENAME(name) + ';' + CHAR(13)
FROM sys.sequences

EXECUTE sp_executesql @sql6
GO

-- Xóa tất cả user-defined data types (nếu có)
DECLARE @sql7 NVARCHAR(max)=''
SELECT @sql7 = @sql7 + 'DROP TYPE ' + QUOTENAME(SCHEMA_NAME(schema_id)) + '.' + QUOTENAME(name) + ';' + CHAR(13)
FROM sys.types
WHERE is_user_defined = 1

EXECUTE sp_executesql @sql7
GO

PRINT '✅ Đã xóa hết tất cả bảng và objects trong database!'
PRINT '🔄 Bây giờ có thể restart Spring Boot application để tạo lại schema mới'